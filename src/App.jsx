import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';
import SafeIcon from './common/SafeIcon';
import CryptoCard from './components/CryptoCard';
import MilestoneCard from './components/MilestoneCard';
import LoadingSpinner from './components/LoadingSpinner';
import InvestmentSummary from './components/InvestmentSummary';
import './App.css';

const { FiTarget } = FiIcons;

function App() {
  const [cryptoData, setCryptoData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Individual investment per coin
  const investmentPerCoin = 920;
  // Total initial investment in GBP (920 * 3)
  const initialInvestment = investmentPerCoin * 3;

  // Holdings data
  const holdings = {
    bitcoin: 0.03112216,
    ethereum: 0.455434,
    theta: 167.03130317
  };

  // Milestones
  const milestones = {
    bitcoin: [100000, 250000, 500000],
    ethereum: [5000, 10000, 20000],
    theta: [10, 20, 50]
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSymbol = (coin) => {
    if (coin === 'bitcoin') return 'BTC';
    if (coin === 'ethereum') return 'ETH';
    if (coin === 'theta') return 'THETA';
    return coin.toUpperCase();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setCurrentDate(new Date());

      // Fetch Current Live Data
      let currentPrices, currentExchange;
      
      try {
        const cryptoResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,theta-token&vs_currencies=usd'
        );
        if (!cryptoResponse.ok) throw new Error('CoinGecko API limit');
        currentPrices = await cryptoResponse.json();

        const exchangeResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        if (!exchangeResponse.ok) throw new Error('Exchange API error');
        currentExchange = await exchangeResponse.json();
      } catch (e) {
        console.warn('Live data fetch failed, using fallback values', e);
        // Fallback live data
        currentPrices = {
          bitcoin: { usd: 96500 },
          ethereum: { usd: 3650 },
          'theta-token': { usd: 2.25 }
        };
        currentExchange = { rates: { GBP: 0.78 } };
      }

      const prices = {
        bitcoin: currentPrices.bitcoin?.usd || 96500,
        ethereum: currentPrices.ethereum?.usd || 3650,
        theta: currentPrices['theta-token']?.usd || 2.25
      };
      
      const rate = currentExchange.rates?.GBP || 0.78;

      setCryptoData(prices);
      setExchangeRate(rate);

    } catch (err) {
      console.error("Critical error in main fetch:", err);
      // Even in error, set fallback data
      setExchangeRate(0.78); 
      setCryptoData({ bitcoin: 96500, ethereum: 3650, theta: 2.25 });
    } finally {
      setLoading(false);
    }
  };

  const calculateHoldingValue = (crypto, price) => holdings[crypto] * (price || 0);
  const calculateTotalValue = () => {
    if (!cryptoData || !exchangeRate) return 0;
    const btcValue = calculateHoldingValue('bitcoin', cryptoData.bitcoin);
    const ethValue = calculateHoldingValue('ethereum', cryptoData.ethereum);
    const thetaValue = calculateHoldingValue('theta', cryptoData.theta);
    return (btcValue + ethValue + thetaValue) * exchangeRate;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) return <LoadingSpinner />;

  const currentTotalValue = calculateTotalValue();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30">
      <motion.header 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <span className="font-black text-black text-xl">P</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Punters Group</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:block text-right">
              <p className="text-[8px] text-gray-500 font-black uppercase">Current Month</p>
              <p className="text-[10px] text-green-400 font-bold flex items-center justify-end">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {format(currentDate, 'MMMM yyyy').toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-12">
        <InvestmentSummary 
          totalValue={currentTotalValue} 
          initialInvestment={initialInvestment} 
          formatCurrency={formatCurrency} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <CryptoCard 
            name="Bitcoin" 
            symbol="BTC" 
            amount={holdings.bitcoin} 
            price={cryptoData?.bitcoin} 
            value={calculateHoldingValue('bitcoin', cryptoData?.bitcoin)} 
            gbpValue={calculateHoldingValue('bitcoin', cryptoData?.bitcoin) * exchangeRate} 
            formatCurrency={formatCurrency} 
            color="orange"
            initialInvestment={investmentPerCoin}
          />
          <CryptoCard 
            name="Ethereum" 
            symbol="ETH" 
            amount={holdings.ethereum} 
            price={cryptoData?.ethereum} 
            value={calculateHoldingValue('ethereum', cryptoData?.ethereum)} 
            gbpValue={calculateHoldingValue('ethereum', cryptoData?.ethereum) * exchangeRate} 
            formatCurrency={formatCurrency} 
            color="blue" 
            initialInvestment={investmentPerCoin}
          />
          <CryptoCard 
            name="Theta" 
            symbol="THETA" 
            amount={holdings.theta} 
            price={cryptoData?.theta} 
            value={calculateHoldingValue('theta', cryptoData?.theta)} 
            gbpValue={calculateHoldingValue('theta', cryptoData?.theta) * exchangeRate} 
            formatCurrency={formatCurrency} 
            color="purple" 
            initialInvestment={investmentPerCoin}
          />
        </div>

        <section className="bg-white/5 rounded-3xl p-8 border border-white/5">
          <div className="flex items-center mb-10">
            <div className="p-3 bg-green-500/10 rounded-2xl mr-4">
              <SafeIcon icon={FiTarget} className="text-2xl text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Price Target Milestones</h2>
              <p className="text-gray-500 text-sm font-medium">Strategic exit points for the 2026-2027 cycle</p> 
            </div> 
          </div> 
          
          <div className="space-y-12"> 
            {Object.entries(milestones).map(([coin, targets]) => ( 
              <div key={coin}> 
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center"> 
                  <span className="w-8 h-[1px] bg-white/10 mr-4"></span> 
                  {getSymbol(coin)} Strategy 
                </h3> 
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
                  {targets.map(target => ( 
                    <MilestoneCard 
                      key={`${coin}-${target}`} 
                      symbol={getSymbol(coin)} 
                      milestonePrice={target} 
                      holdingValue={holdings[coin] * target} 
                      gbpValue={holdings[coin] * target * exchangeRate} 
                      formatCurrency={formatCurrency} 
                      color={coin === 'bitcoin' ? 'orange' : coin === 'ethereum' ? 'blue' : 'purple'} 
                    /> 
                  ))} 
                </div> 
              </div> 
            ))} 
          </div> 
        </section> 
      </main> 
      
      <footer className="border-t border-white/5 py-12 bg-black"> 
        <div className="container mx-auto px-6 text-center"> 
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest"> 
            © {format(currentDate, 'yyyy')} Punters Group • Strategic Asset Management 
          </p> 
        </div> 
      </footer> 
    </div> 
  );
}

export default App;