import { useEffect } from 'react';

// Leave the portfolio router: Tickerverse is an independently built document.
export default function TickerverseEntry() {
  const destination = `/tickerverse/${window.location.search}${window.location.hash}`;
  useEffect(() => { window.location.replace(destination); }, [destination]);
  return <a href={destination}>Open Tickerverse</a>;
}
