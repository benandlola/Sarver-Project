import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function TradingView() {
  const onLoadScriptRef = useRef();

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        if (document.getElementById('tradingview_593ea') && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "AMEX:SPY",
            interval: "D",
            timezone: "America/New_York",
            theme: "dark",
            style: "9",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: true,
            watchlist: ["SPY","QQQ","IWM"],
            withdateranges: true,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            hotlist: true,
            calendar: true,
            container_id: "tradingview_593ea",
          });
        }
      }
    },
    []
  );

  return (
    <div className='tradingview-widget-container'>
      <div id='tradingview_593ea'/>
    </div>
  );
}
