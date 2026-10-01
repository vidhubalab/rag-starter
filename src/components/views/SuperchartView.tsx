import React, { useState } from 'react';
import {
  Maximize2,
  TrendingUp,
  BarChart2,
  Activity,
  Layers,
  Settings,
  Eye,
  Camera,
  Share2,
  Plus,
  Minus,
  Star,
} from 'lucide-react';
import { MarketAsset } from '../../types/market';
import { US_FEATURED_INDICES, ALL_SEARCHABLE_ASSETS } from '../../data/mockMarketData';

interface SuperchartViewProps {
  onOpenTrade: (asset: MarketAsset, type: 'BUY' | 'SELL') => void;
  onSelectAssetModal: (asset: MarketAsset) => void;
}

export const SuperchartView: React.FC<SuperchartViewProps> = ({
  onOpenTrade,
  onSelectAssetModal,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(US_FEATURED_INDICES[0]);
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '1h' | '1D' | '1W'>('1D');
  const [chartMode, setChartMode] = useState<'candles' | 'line'>('candles');
  const [showIndicators, setShowIndicators] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const candles = selectedAsset.candles || [];
  const prices = candles.map((c) => c.close);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const width = 850;
  const height = 400;
  const padTop = 20;
  const padBottom = 60;
  const padLeft = 20;
  const padRight = 70;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Bar for Chart */}
      <div className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Symbol switcher */}
        <div className="flex items-center gap-3">
          <select
            value={selectedAsset.symbol}
            onChange={(e) => {
              const matched = ALL_SEARCHABLE_ASSETS.find((a) => a.symbol === e.target.value);
              if (matched) setSelectedAsset(matched);
            }}
            className="bg-[#F0F3FA] dark:bg-[#252A37] text-sm font-bold text-[#131722] dark:text-white px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer"
          >
            {ALL_SEARCHABLE_ASSETS.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-[#131722] dark:text-white tabular-nums">
              ${selectedAsset.price.toFixed(2)}
            </span>
            <span
              className={`text-xs font-bold tabular-nums ${
                selectedAsset.isPositive ? 'text-[#089981]' : 'text-[#F23645]'
              }`}
            >
              {selectedAsset.change > 0 ? '+' : ''}
              {selectedAsset.change.toFixed(2)} ({selectedAsset.changePercent > 0 ? '+' : ''}
              {selectedAsset.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Timeframe tools */}
        <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#252A37] p-1 rounded-xl text-xs font-bold">
          {(['1m', '5m', '1h', '1D', '1W'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-white dark:bg-[#1E222D] text-[#2962FF] shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Style & Indicators */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartMode(chartMode === 'candles' ? 'line' : 'candles')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] text-[#787B86] hover:text-[#131722] dark:hover:text-white cursor-pointer"
          >
            {chartMode === 'candles' ? <BarChart2 className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
            <span>{chartMode === 'candles' ? 'Candles' : 'Line'}</span>
          </button>

          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer ${
              showIndicators
                ? 'border-[#2962FF] bg-[#2962FF]/10 text-[#2962FF]'
                : 'border-[#E0E3EB] dark:border-[#2A2E39] text-[#787B86]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>EMA 20/50</span>
          </button>

          <div className="flex gap-1.5">
            <button
              onClick={() => onOpenTrade(selectedAsset, 'BUY')}
              className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-[#089981] hover:bg-[#06806c] text-white shadow-xs cursor-pointer"
            >
              Buy
            </button>
            <button
              onClick={() => onOpenTrade(selectedAsset, 'SELL')}
              className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-[#F23645] hover:bg-[#d42c3a] text-white shadow-xs cursor-pointer"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-4 sm:p-6 shadow-xs relative">
        <div className="w-full h-[450px]">
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="superGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962FF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2962FF" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines and Price Axis */}
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((ratio) => {
              const y = padTop + ratio * (height - padTop - padBottom);
              const pVal = maxP - ratio * range;
              return (
                <g key={ratio}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="currentColor"
                    className="text-gray-100 dark:text-gray-800"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={width - padRight + 8}
                    y={y + 4}
                    className="text-[11px] fill-[#787B86] tabular-nums"
                  >
                    ${pVal.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Volume Bars at bottom */}
            {showVolume &&
              candles.map((c, i) => {
                const x = padLeft + (i / (candles.length - 1 || 1)) * (width - padLeft - padRight);
                const maxVol = Math.max(...candles.map((can) => can.volume));
                const vH = (c.volume / maxVol) * 45;
                const isBull = c.close >= c.open;
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - 4}
                    y={height - padBottom - vH}
                    width={8}
                    height={vH}
                    fill={isBull ? '#089981' : '#F23645'}
                    opacity={0.3}
                  />
                );
              })}

            {/* Candlesticks or Line */}
            {chartMode === 'candles' ? (
              candles.map((c, i) => {
                const x = padLeft + (i / (candles.length - 1 || 1)) * (width - padLeft - padRight);
                const isBull = c.close >= c.open;
                const highY = padTop + ((maxP - c.high) / range) * (height - padTop - padBottom);
                const lowY = padTop + ((maxP - c.low) / range) * (height - padTop - padBottom);
                const openY = padTop + ((maxP - c.open) / range) * (height - padTop - padBottom);
                const closeY = padTop + ((maxP - c.close) / range) * (height - padTop - padBottom);

                const top = Math.min(openY, closeY);
                const bHeight = Math.max(2, Math.abs(closeY - openY));
                const color = isBull ? '#089981' : '#F23645';

                return (
                  <g key={`candle-${i}`}>
                    <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.2" />
                    <rect
                      x={x - 5}
                      y={top}
                      width={10}
                      height={bHeight}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })
            ) : (
              <path
                d={candles
                  .map((c, i) => {
                    const x = padLeft + (i / (candles.length - 1 || 1)) * (width - padLeft - padRight);
                    const y = padTop + ((maxP - c.close) / range) * (height - padTop - padBottom);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#2962FF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Simulated EMA 20 & 50 Indicator lines */}
            {showIndicators && (
              <>
                <path
                  d={candles
                    .map((c, i) => {
                      const x = padLeft + (i / (candles.length - 1 || 1)) * (width - padLeft - padRight);
                      const smoothVal = c.close * 0.99;
                      const y = padTop + ((maxP - smoothVal) / range) * (height - padTop - padBottom);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  opacity={0.8}
                />
                <path
                  d={candles
                    .map((c, i) => {
                      const x = padLeft + (i / (candles.length - 1 || 1)) * (width - padLeft - padRight);
                      const smoothVal = c.close * 0.975;
                      const y = padTop + ((maxP - smoothVal) / range) * (height - padTop - padBottom);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#9945FF"
                  strokeWidth="1.5"
                  opacity={0.8}
                />
              </>
            )}

            {/* Time labels along the bottom */}
            {candles
              .filter((_, idx) => idx % 6 === 0)
              .map((c, idx) => {
                const origIndex = idx * 6;
                const x = padLeft + (origIndex / (candles.length - 1 || 1)) * (width - padLeft - padRight);
                return (
                  <text
                    key={`time-${idx}`}
                    x={x}
                    y={height - padBottom + 20}
                    textAnchor="middle"
                    className="text-[10px] fill-[#787B86]"
                  >
                    {c.time}
                  </text>
                );
              })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#E0E3EB] dark:border-[#2A2E39] text-xs text-[#787B86]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2962FF]" />
            <span>Price Action</span>
          </div>
          {showIndicators && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span>EMA (20)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9945FF]" />
                <span>EMA (50)</span>
              </div>
            </>
          )}
          <div className="ml-auto text-xs">
            <button
              onClick={() => onSelectAssetModal(selectedAsset)}
              className="font-bold text-[#2962FF] hover:underline cursor-pointer"
            >
              Open Comprehensive Financial Sheet &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
