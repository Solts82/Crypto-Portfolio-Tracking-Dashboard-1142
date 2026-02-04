import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
// Import only necessary ECharts modules to prevent bundle issues and ensure registration
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, MarkLineComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

// Register ECharts components
echarts.use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, CanvasRenderer]);

const { FiActivity } = FiIcons;

const ProfitRollerCoaster = ({ historicalData, initialInvestment }) => {
  const chartOption = useMemo(() => {
    // 1. Strict Data Safety Check
    if (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0) {
      return null;
    }

    // 2. Sanitize Data: Filter out any corrupt entries (NaN, null, undefined)
    const cleanData = historicalData.filter(d => 
      d && d.date && typeof d.value === 'number' && !isNaN(d.value) && isFinite(d.value)
    );

    if (cleanData.length === 0) return null;

    const dates = cleanData.map(d => format(new Date(d.date), 'MMM yyyy'));
    const values = cleanData.map(d => d.value);
    
    // Determine overall profitability for color theme
    const currentVal = values[values.length - 1];
    const isProfitable = currentVal >= initialInvestment;
    const themeColor = isProfitable ? '#22c55e' : '#ef4444'; // Green or Red

    // Calculate min/max for Y-axis scaling
    const allValues = [...values, initialInvestment];
    const minValue = Math.min(...allValues) * 0.9;
    const maxValue = Math.max(...allValues) * 1.1;

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        borderColor: '#333',
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        padding: 12,
        formatter: function (params) {
          const portfolioParam = params.find(p => p.seriesName === 'Portfolio Value');
          if (!portfolioParam) return '';

          const date = portfolioParam.name;
          const value = portfolioParam.value;
          const profit = value - initialInvestment;
          const profitPercent = (profit / initialInvestment) * 100;
          
          return `
            <div style="font-weight: 700; margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid #444; padding-bottom: 4px;">${date}</div>
            <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 4px;">
              <span style="color: #9ca3af;">Value:</span>
              <span style="font-weight: 700;">£${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 4px;">
              <span style="color: #9ca3af;">Invested:</span>
              <span style="color: #fb923c; font-weight: 600;">£${initialInvestment.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 15px; color: ${profit >= 0 ? '#4ade80' : '#ef4444'}; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #444;">
              <span>${profit >= 0 ? 'Profit' : 'Loss'}:</span>
              <span style="font-weight: 700;">${profit >= 0 ? '+' : ''}£${Math.abs(profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${profitPercent.toFixed(1)}%)</span>
            </div>
          `;
        }
      },
      grid: {
        left: '2%',
        right: '3%',
        bottom: '3%',
        top: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLine: { lineStyle: { color: '#444' } },
        axisLabel: { 
          color: '#6b7280',
          fontSize: 11,
          margin: 14,
          formatter: (value, index) => {
            // Smart label skipping for cleaner mobile view
            if (dates.length > 12 && index % 3 !== 0) return '';
            return value;
          }
        },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        min: Math.floor(minValue),
        max: Math.ceil(maxValue),
        splitLine: { 
          lineStyle: { 
            color: 'rgba(255,255,255,0.03)',
            type: 'dashed'
          } 
        },
        axisLabel: { 
          color: '#6b7280',
          fontSize: 11,
          formatter: (value) => `£${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`
        }
      },
      series: [
        {
          name: 'Portfolio Value',
          type: 'line',
          smooth: 0.4, // Smoother curve
          symbol: 'none', // Hide points by default
          symbolSize: 8,
          showSymbol: false,
          lineStyle: {
            width: 3,
            color: themeColor, // Solid color based on current profitability
            shadowColor: themeColor,
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          areaStyle: {
            opacity: 0.15,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: themeColor },
              { offset: 1, color: 'rgba(0,0,0,0)' }
            ])
          },
          // Investment Threshold Line (Using markLine is safer/standard for thresholds)
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: {
              color: '#fb923c', // Orange
              type: 'dashed',
              width: 1,
              opacity: 0.8
            },
            data: [
              { yAxis: initialInvestment, name: 'Initial Investment' }
            ],
            animation: false,
            silent: true
          },
          data: values,
          z: 2
        }
      ]
    };
  }, [historicalData, initialInvestment]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
            <SafeIcon icon={FiActivity} className="text-xl text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Profit Roller Coaster</h3>
            <p className="text-sm text-gray-400">36-Month Portfolio Performance</p>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#fb923c] rounded-full opacity-80"></span>
            <span className="text-gray-400">Invested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: chartOption?.series[0]?.lineStyle?.color || '#22c55e' }}></span>
            <span className="text-gray-400">Current</span>
          </div>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        {chartOption ? (
          <ReactECharts 
            echarts={echarts} 
            option={chartOption} 
            style={{ height: '100%', width: '100%' }} 
            theme="dark"
            notMerge={true} // Ensure clean update
            lazyUpdate={true} // Optimize performance
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
            <p className="text-sm">Analyzing market data...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfitRollerCoaster;