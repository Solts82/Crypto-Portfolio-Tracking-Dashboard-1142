import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import CryptoCard from './components/CryptoCard';
import MilestoneCard from './components/MilestoneCard';
import LoadingSpinner from './components/LoadingSpinner';
import InvestmentSummary from './components/InvestmentSummary';
import './App.css';

const { FiTrendingUp, FiDollarSign, FiTarget } = FiIcons;

function App() {
  const [cryptoData, setCryptoData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial investment in GBP
  const initialInvestment = 2760;

  // Holdings data
  const holdings = {
    bitcoin: 0.03112216,
    ethereum: 0.455434,
    theta: 167.03130317
  };

  // Milestones
  const milestones = {
    bitcoin: [500000, 1000000],
    ethereum: [5000, 10000],
    theta: [20, 100]
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch crypto prices
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,theta-token&vs_currencies=usd'
      );
      const cryptoData = await cryptoResponse.json();

      // Fetch USD to GBP exchange rate
      const exchangeResponse = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      const exchangeData = await exchangeResponse.json();

      setCryptoData({
        bitcoin: cryptoData.bitcoin?.usd || 0,
        ethereum: cryptoData.ethereum?.usd || 0,
        theta: cryptoData['theta-token']?.usd || 0
      });

      setExchangeRate(exchangeData.rates?.GBP || 0.8);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateHoldingValue = (crypto, price) => {
    return holdings[crypto] * price;
  };

  const calculateMilestoneValue = (crypto, milestonePrice) => {
    return holdings[crypto] * milestonePrice;
  };

  const calculateTotalValue = () => {
    if (!cryptoData || !exchangeRate) return 0;
    
    const btcValue = calculateHoldingValue('bitcoin', cryptoData.bitcoin);
    const ethValue = calculateHoldingValue('ethereum', cryptoData.ethereum);
    const thetaValue = calculateHoldingValue('theta', cryptoData.theta);
    
    // Convert total USD value to GBP
    return (btcValue + ethValue + thetaValue) * exchangeRate;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/50 backdrop-blur-sm border-b border-green-500/30"
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Punters Group Crypto
              </h1>
              <p className="text-gray-300 mt-2">
                Track live cryptocurrency values from our strategic investments
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiTrendingUp} className="text-3xl text-green-400" />
              <span className="text-sm text-gray-400">Live Tracking</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Investment Summary */}
        <InvestmentSummary 
          totalValue={calculateTotalValue()}
          initialInvestment={initialInvestment}
          formatCurrency={formatCurrency}
        />

        {/* Current Holdings */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <SafeIcon icon={FiDollarSign} className="text-2xl text-green-400 mr-3" />
            <h2 className="text-2xl font-bold">Current Holdings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CryptoCard
              name="Bitcoin"
              symbol="BTC"
              amount={holdings.bitcoin}
              price={cryptoData?.bitcoin}
              value={calculateHoldingValue('bitcoin', cryptoData?.bitcoin)}
              gbpValue={calculateHoldingValue('bitcoin', cryptoData?.bitcoin) * exchangeRate}
              formatCurrency={formatCurrency}
              color="orange"
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
            />
          </div>
        </motion.section>

        {/* Price Milestones */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <SafeIcon icon={FiTarget} className="text-2xl text-green-400 mr-3" />
            <h2 className="text-2xl font-bold">Price Milestones</h2>
          </div>

          <div className="space-y-8">
            {/* Bitcoin Milestones */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Bitcoin (BTC)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.bitcoin.map((milestone) => (
                  <MilestoneCard
                    key={`btc-${milestone}`}
                    crypto="Bitcoin"
                    symbol="BTC"
                    milestonePrice={milestone}
                    holdingValue={calculateMilestoneValue('bitcoin', milestone)}
                    gbpValue={calculateMilestoneValue('bitcoin', milestone) * exchangeRate}
                    formatCurrency={formatCurrency}
                    color="orange"
                  />
                ))}
              </div>
            </div>

            {/* Ethereum Milestones */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Ethereum (ETH)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.ethereum.map((milestone) => (
                  <MilestoneCard
                    key={`eth-${milestone}`}
                    crypto="Ethereum"
                    symbol="ETH"
                    milestonePrice={milestone}
                    holdingValue={calculateMilestoneValue('ethereum', milestone)}
                    gbpValue={calculateMilestoneValue('ethereum', milestone) * exchangeRate}
                    formatCurrency={formatCurrency}
                    color="blue"
                  />
                ))}
              </div>
            </div>

            {/* Theta Milestones */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Theta (THETA)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.theta.map((milestone) => (
                  <MilestoneCard
                    key={`theta-${milestone}`}
                    crypto="Theta"
                    symbol="THETA"
                    milestonePrice={milestone}
                    holdingValue={calculateMilestoneValue('theta', milestone)}
                    gbpValue={calculateMilestoneValue('theta', milestone) * exchangeRate}
                    formatCurrency={formatCurrency}
                    color="purple"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Refresh Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            {loading ? 'Updating...' : 'Refresh Data'}
          </button>
          <p className="text-gray-400 text-sm mt-2">
            Exchange Rate: 1 USD = {exchangeRate?.toFixed(4)} GBP
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-green-500/30 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-gray-400">
          <p>© 2024 Punters Group. Strategic crypto investments with live tracking.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;