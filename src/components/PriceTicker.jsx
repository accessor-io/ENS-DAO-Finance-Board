import React, { useEffect, useState } from 'react';

const COINGECKO_SIMPLE_PRICE = 'https://api.coingecko.com/api/v3/simple/price';

const pairs = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'ethereum-name-service', symbol: 'ENS' },
  { id: 'usd-coin', symbol: 'USDC' },
];

export default function PriceTicker() {
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});

  const fetchPrices = async () => {
    try {
      const ids = pairs.map(p => p.id).join(',');
      const url = `${COINGECKO_SIMPLE_PRICE}?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
      const res = await fetch(url);
      const data = await res.json();
      const nextPrices = {};
      const nextChanges = {};
      for (const p of pairs) {
        nextPrices[p.symbol] = data[p.id]?.usd ?? null;
        nextChanges[p.symbol] = data[p.id]?.usd_24h_change ?? 0;
      }
      setPrices(nextPrices);
      setChanges(nextChanges);
    } catch (e) {
      // silent fail; keep last prices
    }
  };

  useEffect(() => {
    fetchPrices();
    const t = setInterval(fetchPrices, 30_000);
    return () => clearInterval(t);
  }, []);

  const badge = (symbol) => {
    const price = prices[symbol];
    const change = changes[symbol] ?? 0;
    const up = change >= 0;
    const color = up ? 'text-green-600' : 'text-red-600';
    const arrow = up ? '↗' : '↘';
    return (
      <span key={symbol} className={`${color} text-xs`}>
        {symbol}: {price ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'} {arrow}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-end">
      <div className="flex space-x-3 text-xs">
        {pairs.map(p => badge(p.symbol))}
      </div>
    </div>
  );
}
