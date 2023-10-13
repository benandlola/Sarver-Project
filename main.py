import requests
import pandas as pd
from bs4 import BeautifulSoup

url = 'https://efdsearch.senate.gov/search/'

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
csrf_token = soup.find('input', {'name': 'csrfmiddlewaretoken'}).get('value')
csrf_cookie = response.cookies['csrftoken']
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': url,
}
cookies = {
    'csrftoken': csrf_token
}
payload = {
    'prohibition_agreement': '1',
    'csrfmiddlewaretoken': csrf_token
}
response = requests.post(url, headers=headers, data=payload, cookies=cookies)
if response.status_code == 200:
    print("Checkbox checked successfully.")
else:
    print("Failed to check the checkbox.")
soup = BeautifulSoup(response.text, 'html.parser')
print(soup.prettify())