import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime

url = 'https://efdsearch.senate.gov/search/'

driver = webdriver.Firefox()
driver.get('https://efdsearch.senate.gov/search/')
checkbox = driver.find_element(By.ID, 'agree_statement')
checkbox.click()

search = driver.find_element(By.ID, 'search_options')

#check current and previous senators
current_senators = search.find_element(By.XPATH, '//label[input[@value="1"]]')
current_senators.click()
former_senators = search.find_element(By.XPATH, '//label[input[@value="5"]]')
former_senators.click()

#check type of reports (periodic)
periodic_reports = search.find_element(By.XPATH, '//label[input[@value="11"]]')
periodic_reports.click()

#from beginning of year till now
start = '01/01/2023'
end = datetime.now().date()
from_date = search.find_element(By.ID, 'fromDate')
from_date.send_keys(start)

#submit form
submit = search.find_element(By.XPATH, '/html/body/div[1]/main/div/div/div[5]/div/form/div/button')
submit.click()

wait = WebDriverWait(driver, 10) 
wait.until(EC.presence_of_all_elements_located((By.XPATH, '//*[@id="filedReports"]/tbody/tr')))
columns = ['Stock', 'Transaction Date', 'Buy/Sell', 'Type', 'Amount', 'Senator']
df = pd.DataFrame(columns=columns)

while True:
    #get actual data
    table = driver.find_element(By.ID, 'filedReports')
    rows = table.find_elements(By.TAG_NAME, "tr")
    main_window = driver.current_window_handle
    for row in rows[1:]:
        row.find_element(By.TAG_NAME, "a").click()
        columns = row.find_elements(By.TAG_NAME, "td")
        first_name = columns[0].text.capitalize()
        last_name = columns[1].text.capitalize()
        senator = first_name + ' ' + last_name
        driver.switch_to.window(driver.window_handles[1])
        try: 
            electronic = WebDriverWait(driver, 2).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'mb-4')))
            rows = driver.find_elements(By.TAG_NAME, "tr")
            for row in rows[1:]:
                cols = row.find_elements(By.TAG_NAME, "td")
                df = df.append({
                    "Stock": cols[3].text.strip() if cols[3].text.strip() != '--' else cols[4].text.strip(),
                    "Transaction Date": cols[1].text.strip(),
                    "Buy/Sell": ''.join(cols[6].text.strip().split(' ')[0]),
                    "Type": cols[5].text.strip(),
                    "Amount": cols[7].text.strip(),
                    "Senator": senator
                }, ignore_index=True)
            time.sleep(2)
        except:
            pass
        driver.close()
        driver.switch_to.window(main_window)
    next_button = driver.find_element(By.ID, 'filedReports_next')
    if 'disabled' in next_button.get_attribute('class'):
        break
    next_button.click()
    time.sleep(2)
    wait.until(EC.presence_of_all_elements_located((By.XPATH, '//*[@id="filedReports"]/tbody/tr')))

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
print(df)
time.sleep(5)
driver.quit()
#df.to_csv('data.csv', index=False) 
