import React from 'react';
import Tradingview from "./widgets/Tradingview";
import Header from './Header';

const Markets =() => {
    return (
        <div>
        <Header/>
        <main role="main" className="container" id="markets">
          <div className="row">
            <div className="col-md-10">
            <Tradingview/>
            </div>
            <div className="col-md-2 market-nav">
              <div className="content-section">
                <h3>Markets</h3>
                <p className='text-muted'>Information</p>
                <ul className="list-group">
                  <li className="list-group-item list-group-item-light"><a href="https://www.nasdaq.com/market-activity/earnings" target="_blank">Earnings Calendar</a></li>
                </ul>
              </div>  
            </div>
          </div>
        </main>
        </div>
    )
}

export default Markets