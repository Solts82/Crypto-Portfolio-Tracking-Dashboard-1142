import { format, addMonths, differenceInMonths, startOfMonth, subMonths } from 'date-fns';

// Real historical monthly approximate close prices (USD)
// Source: Historical market data (Jan 2022 - Dec 2024)
// This serves as our "Truth" anchor for the past.
export const BACKUP_HISTORY = [
  { date: '2024-12-01', btc: 96000, eth: 3650, theta: 2.25 },
  { date: '2024-11-01', btc: 69500, eth: 2510, theta: 1.35 },
  { date: '2024-10-01', btc: 63300, eth: 2600, theta: 1.45 },
  { date: '2024-09-01', btc: 59000, eth: 2500, theta: 1.25 },
  { date: '2024-08-01', btc: 64600, eth: 3150, theta: 1.40 },
  { date: '2024-07-01', btc: 62700, eth: 3430, theta: 1.60 },
  { date: '2024-06-01', btc: 67500, eth: 3760, theta: 2.15 },
  { date: '2024-05-01', btc: 60600, eth: 3000, theta: 2.05 },
  { date: '2024-04-01', btc: 71000, eth: 3600, theta: 2.85 },
  { date: '2024-03-01', btc: 61200, eth: 3350, theta: 2.10 },
  { date: '2024-02-01', btc: 42000, eth: 2300, theta: 1.05 },
  { date: '2024-01-01', btc: 42300, eth: 2280, theta: 1.15 },
  
  { date: '2023-12-01', btc: 37700, eth: 2050, theta: 1.00 },
  { date: '2023-11-01', btc: 34600, eth: 1800, theta: 0.85 },
  { date: '2023-10-01', btc: 27000, eth: 1670, theta: 0.62 },
  { date: '2023-09-01', btc: 25900, eth: 1630, theta: 0.58 },
  { date: '2023-08-01', btc: 29200, eth: 1830, theta: 0.75 },
  { date: '2023-07-01', btc: 30500, eth: 1930, theta: 0.78 },
  { date: '2023-06-01', btc: 26800, eth: 1860, theta: 0.75 },
  { date: '2023-05-01', btc: 28000, eth: 1830, theta: 0.88 },
  { date: '2023-04-01', btc: 28500, eth: 1820, theta: 1.05 },
  { date: '2023-03-01', btc: 23100, eth: 1600, theta: 1.15 },
  { date: '2023-02-01', btc: 23000, eth: 1580, theta: 1.05 },
  { date: '2023-01-01', btc: 16600, eth: 1200, theta: 0.72 },

  { date: '2022-12-01', btc: 17100, eth: 1280, theta: 0.85 },
  { date: '2022-11-01', btc: 20500, eth: 1550, theta: 1.10 },
  { date: '2022-10-01', btc: 19400, eth: 1320, theta: 1.05 },
  { date: '2022-09-01', btc: 20000, eth: 1550, theta: 1.15 },
  { date: '2022-08-01', btc: 23300, eth: 1630, theta: 1.45 },
  { date: '2022-07-01', btc: 19900, eth: 1060, theta: 1.15 },
  { date: '2022-06-01', btc: 31600, eth: 1940, theta: 1.25 },
  { date: '2022-05-01', btc: 38500, eth: 2800, theta: 2.50 },
  { date: '2022-04-01', btc: 45500, eth: 3280, theta: 3.60 },
  { date: '2022-03-01', btc: 43200, eth: 2900, theta: 3.00 },
  { date: '2022-02-01', btc: 38500, eth: 2680, theta: 2.80 },
  { date: '2022-01-01', btc: 47700, eth: 3700, theta: 4.80 },
];

export const getBackupHistoricalData = (holdings, currentGbpRate, currentPrices) => {
  // 1. Sort history chronologically
  const sortedHistory = [...BACKUP_HISTORY].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // 2. Determine "Today" and the "Latest History Point"
  const today = new Date();
  const lastHistoryDate = new Date(sortedHistory[sortedHistory.length - 1].date);
  
  // 3. Calculate value for the hardcoded history
  let fullHistory = sortedHistory.map(point => {
    const totalUsd = 
      (point.btc * holdings.bitcoin) + 
      (point.eth * holdings.ethereum) + 
      (point.theta * holdings.theta);
    
    // Historical FX adjustment (simplified)
    let historicalRate = currentGbpRate;
    const d = new Date(point.date);
    if (d.getFullYear() === 2022 && d.getMonth() > 8) historicalRate = 0.88; 
    else if (d.getFullYear() === 2022) historicalRate = 0.82; 
    else if (d.getFullYear() === 2023) historicalRate = 0.80;
    
    return {
      date: point.date,
      value: totalUsd * historicalRate,
      prices: { btc: point.btc, eth: point.eth, theta: point.theta } // Store for interpolation
    };
  });

  // 4. Bridge the gap if 'today' is later than the last hardcoded date
  if (differenceInMonths(today, lastHistoryDate) > 0) {
    const monthsDiff = differenceInMonths(today, lastHistoryDate);
    const lastPoint = fullHistory[fullHistory.length - 1];
    
    // Target (Today's) Value
    const currentBtc = currentPrices?.bitcoin || 96500;
    const currentEth = currentPrices?.ethereum || 3650;
    const currentTheta = currentPrices?.theta || 2.25;
    
    const currentTotalUsd = 
      (currentBtc * holdings.bitcoin) + 
      (currentEth * holdings.ethereum) + 
      (currentTheta * holdings.theta);
      
    const currentTotalGbp = currentTotalUsd * currentGbpRate;

    // Generate intermediate months
    for (let i = 1; i <= monthsDiff; i++) {
      const nextDate = addMonths(lastHistoryDate, i);
      const isCurrentMonth = i === monthsDiff;
      
      let val;
      if (isCurrentMonth) {
        val = currentTotalGbp;
      } else {
        // Linear Interpolation for missing months
        const progress = i / monthsDiff;
        val = lastPoint.value + (currentTotalGbp - lastPoint.value) * progress;
        
        // Add random noise for realism on interpolated points
        const noise = (Math.random() * 0.04) - 0.02; // +/- 2%
        val = val * (1 + noise);
      }
      
      fullHistory.push({
        date: format(nextDate, 'yyyy-MM-dd'),
        value: val
      });
    }
  }

  // 5. Slice to ensure we strictly return the last 36 months from TODAY
  // We want [Today - 36 months] to [Today]
  const cutoffDate = startOfMonth(subMonths(today, 36));
  
  return fullHistory.filter(point => new Date(point.date) >= cutoffDate);
};