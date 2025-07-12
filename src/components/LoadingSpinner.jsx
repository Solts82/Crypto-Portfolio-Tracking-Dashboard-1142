import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLoader } = FiIcons;

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <SafeIcon icon={FiLoader} className="text-4xl text-green-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Crypto Data</h2>
        <p className="text-gray-400">Fetching live prices and exchange rates...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;