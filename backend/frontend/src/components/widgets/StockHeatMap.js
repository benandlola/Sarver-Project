import React, { useEffect, useRef, memo } from 'react';

function StockHeatMap() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
            "exchanges": [],
            "dataSource": "SPX500",
            "grouping": "sector",
            "blockSize": "market_cap_basic",
            "blockColor": "change",
            "locale": "en",
            "symbolUrl": "",
            "colorTheme": "dark",
            "hasTopBar": true,
            "isDataSetEnabled": true,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "width": "100%",
            "height": "220%"
        }`;
      container.current.appendChild(script);

      return () => {
        // Cleanup the dynamically added script when component unmounts
        if (container.current) {
            container.current.removeChild(script);
          }
      };    
    },[]);

  return (
    <div className="tradingview-widget-container" ref={container}></div>
  );
}

export default memo(StockHeatMap);
