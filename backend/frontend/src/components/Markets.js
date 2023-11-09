import React from 'react';
import TradingView from './widgets/TradingView';
import StockHeatMap from './widgets/StockHeatMap';
import CryptoHeatMap from './widgets/CryptoHeatMap';
import { useState } from 'react';

const Markets = () => {
  const [chart, setChart] = useState({
    'tradingView' : true,
    'stockHeatMap' : false,
    'cryptoHeatMap' : false
  });

  const handleChartType = (chartType) => {
    setChart((...prevChart) => ({
      tradingView: chartType === 'tradingView',
      stockHeatMap: chartType === 'stockHeatMap',
      cryptoHeatMap: chartType === 'cryptoHeatMap',
    }));
  }

  return (
    <main role="main" className="container" id="markets">
      <div className="row">
        <div className="col-md-10">
        {chart.tradingView && <TradingView/>}
        {chart.stockHeatMap && <StockHeatMap/>}
        {chart.cryptoHeatMap && <CryptoHeatMap/>}
        </div>
        <div className="col-md-2 market-nav">
          <div className="content-section">
            <h3>Markets</h3>
            <p className='text-muted'>Charts are 15 minutes delayed</p>
            <ul className="list-group">
              <li className="list-group-item list-group-item-light"><a href="https://www.nasdaq.com/market-activity/earnings" target="_blank">Earnings Calendar</a></li>
              <li className="list-group-item list-group-item-light"><a onClick={() => handleChartType('stockHeatMap')}>Stock Heatmap</a></li>
              <li className="list-group-item list-group-item-light"><a onClick={() => handleChartType('cryptoHeatMap')}>Crypto Heatmap</a></li>
              {!chart.tradingView && <li className="list-group-item list-group-item-light"><a onClick={() => handleChartType('tradingView')}>Back</a></li>}
            </ul>
          </div>  
        </div>
      </div>
    </main>
    )
}

export default Markets