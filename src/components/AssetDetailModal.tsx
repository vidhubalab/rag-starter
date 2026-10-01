import React, { useState } from 'react';
import { X, Star, TrendingUp, TrendingDown, Clock, BarChart2, Activity, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (asset: MarketAsset) => void;
  onOpenTrade: (asset: MarketAsset, type: 'BUY' | 'SELL') => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';
type ChartType = 'line' | 'candles';

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onOpenTrade,
}) => {
  if (!asset) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const candles = asset.candles || [];
  const points = candles.map((c) => c.close);
  const minPrice = Math.min(...points);
  const maxPrice = Math.max(...points);
  const range = maxPrice - minPrice || 1;

  // Active hover point or current asset
  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : null;
  const displayPrice = activeCandle ? activeCandle.close : asset.price;
  const isPositive = asset.isPositive;

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const padding = 20;

  // Generate SVG path for line chart
  const pathD = candles
    .map((c, i) => {
      const x = padding + (i / (candles.length - 1 || 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((c.close - minPrice) / range) * (svgHeight - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${svgWidth - padding} ${svgHeight} L ${padding} ${svgHeight} Z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#1E222D] rounded-2xl shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full font-extrabold text-xs flex items-center justify-center tracking-tighter shrink-0 shadow-xs"
              style={{ backgroundColor: asset.badgeBg, color: asset.badgeColor || '#FFFFFF' }}
            >
              {asset.badge}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#131722] dark:text-white tracking-tight">
                  {asset.symbol}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-gray-100 dark:bg-[#2A2E39] text-[#787B86]">
                  {asset.exchange}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-blue-50 dark:bg-blue-900/30 text-[#2962FF]">
                  {asset.category}
                </span>
              </div>
              <p className="text-xs text-[#787B86] font-medium">{asset.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Watchlist Star Toggle */}
            <button
              onClick={() => onToggleWatchlist(asset)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                  : 'border-[#E0E3EB] dark:border-[#2A2E39] text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className="w-5 h-5 fill-current" />
            </button>

            {/* Quick Trade Buttons */}
            <button
              onClick={() => onOpenTrade(asset, 'BUY')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#089981] hover:bg-[#06806c] text-white shadow-xs transition-colors cursor-pointer"
            >
              Buy
            </button>
            <button
              onClick={() => onOpenTrade(asset, 'SELL')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F23645] hover:bg-[#d42c3a] text-white shadow-xs transition-colors cursor-pointer"
            >
              Sell
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-[#787B86] hover:text-[#131722] dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Price Bar & Change */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#131722] dark:text-white tabular-nums tracking-tight">
                ${displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className={`text-sm font-bold flex items-center gap-1.5 mt-1 tabular-nums ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>
                  {asset.change > 0 ? '+' : ''}
                  {asset.change.toFixed(2)}
                </span>
                <span>({asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
                <span className="text-xs text-[#787B86] font-normal ml-2">Today · Real-time market feed</span>
              </div>
            </div>

            {/* Technical Gauge Indicator */}
            <div className="bg-[#F0F3FA] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45] rounded-xl px-3.5 py-2 flex items-center gap-3">
              <div>
                <span className="text-[11px] text-[#787B86] block font-medium">Technical Rating</span>
                <span
                  className={`text-sm font-extrabold ${
                    asset.technicalRating.includes('Buy')
                      ? 'text-[#089981]'
                      : asset.technicalRating.includes('Sell')
                      ? 'text-[#F23645]'
                      : 'text-amber-500'
                  }`}
                >
                  {asset.technicalRating}
                </span>
              </div>
              <div className="flex gap-1">
                {['Strong Sell', 'Sell', 'Neutral', 'Buy', 'Strong Buy'].map((tier) => (
                  <span
                    key={tier}
                    className={`w-2 h-4 rounded-xs ${
                      asset.technicalRating === tier
                        ? tier.includes('Buy')
                          ? 'bg-[#089981]'
                          : tier.includes('Sell')
                          ? 'bg-[#F23645]'
                          : 'bg-amber-400'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Chart Controls (Timeframe & Mode) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#252A37] p-1 rounded-lg">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white dark:bg-[#1E222D] text-[#2962FF] shadow-xs'
                      : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#252A37] p-1 rounded-lg">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-white dark:bg-[#1E222D] text-[#131722] dark:text-white shadow-xs'
                    : 'text-[#787B86]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Line
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  chartType === 'candles'
                    ? 'bg-white dark:bg-[#1E222D] text-[#131722] dark:text-white shadow-xs'
                    : 'text-[#787B86]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Candles
              </button>
            </div>
          </div>

          {/* Interactive Chart Canvas / SVG Container */}
          <div className="border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-4 bg-white dark:bg-[#131722] relative overflow-hidden">
            <div className="h-64 sm:h-72 w-full relative">
              {chartType === 'line' ? (
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <defs>
                    <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isPositive ? '#089981' : '#F23645'}
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor={isPositive ? '#089981' : '#F23645'}
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
                    <line
                      key={ratio}
                      x1={padding}
                      y1={svgHeight * ratio}
                      x2={svgWidth - padding}
                      y2={svgHeight * ratio}
                      stroke="currentColor"
                      className="text-gray-100 dark:text-gray-800"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Gradient Area Fill */}
                  <path d={areaD} fill="url(#detailGradient)" />

                  {/* Main Line Stroke */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive hover points */}
                  {candles.map((c, i) => {
                    const cx = padding + (i / (candles.length - 1 || 1)) * (svgWidth - padding * 2);
                    const cy =
                      svgHeight - padding - ((c.close - minPrice) / range) * (svgHeight - padding * 2);
                    const isHovered = hoverIndex === i;
                    return (
                      <g
                        key={i}
                        onMouseEnter={() => setHoverIndex(i)}
                        className="cursor-crosshair"
                      >
                        {isHovered && (
                          <>
                            <line
                              x1={cx}
                              y1={padding}
                              x2={cx}
                              y2={svgHeight - padding}
                              stroke="#2962FF"
                              strokeWidth="1"
                              strokeDasharray="3 3"
                            />
                            <circle
                              cx={cx}
                              cy={cy}
                              r="5"
                              fill="#2962FF"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                          </>
                        )}
                        <rect
                          x={cx - (svgWidth / candles.length) / 2}
                          y="0"
                          width={svgWidth / candles.length}
                          height={svgHeight}
                          fill="transparent"
                        />
                      </g>
                    );
                  })}
                </svg>
              ) : (
                /* Candlestick Mode */
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {candles.map((c, i) => {
                    const x = padding + (i / (candles.length - 1 || 1)) * (svgWidth - padding * 2);
                    const candleWidth = Math.max(4, (svgWidth / candles.length) * 0.6);
                    const isBullish = c.close >= c.open;
                    const highY = svgHeight - padding - ((c.high - minPrice) / range) * (svgHeight - padding * 2);
                    const lowY = svgHeight - padding - ((c.low - minPrice) / range) * (svgHeight - padding * 2);
                    const openY = svgHeight - padding - ((c.open - minPrice) / range) * (svgHeight - padding * 2);
                    const closeY = svgHeight - padding - ((c.close - minPrice) / range) * (svgHeight - padding * 2);

                    const topBody = Math.min(openY, closeY);
                    const bodyHeight = Math.max(2, Math.abs(closeY - openY));
                    const color = isBullish ? '#089981' : '#F23645';

                    return (
                      <g
                        key={i}
                        onMouseEnter={() => setHoverIndex(i)}
                        className="cursor-crosshair"
                      >
                        {/* Wick */}
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.2" />
                        {/* Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={topBody}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={color}
                          rx="1"
                        />
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Hover tooltip bar */}
            <div className="mt-3 pt-3 border-t border-[#E0E3EB] dark:border-[#2A2E39] flex flex-wrap items-center justify-between text-xs text-[#787B86] tabular-nums">
              <div>
                <span>Point: </span>
                <span className="font-bold text-[#131722] dark:text-white">
                  {activeCandle ? activeCandle.time : 'Latest Session'}
                </span>
              </div>
              <div className="flex gap-4">
                <span>
                  O: <strong className="text-[#131722] dark:text-white">{activeCandle ? activeCandle.open : asset.open}</strong>
                </span>
                <span>
                  H: <strong className="text-[#131722] dark:text-white">{activeCandle ? activeCandle.high : asset.high}</strong>
                </span>
                <span>
                  L: <strong className="text-[#131722] dark:text-white">{activeCandle ? activeCandle.low : asset.low}</strong>
                </span>
                <span>
                  C: <strong className="text-[#131722] dark:text-white">{activeCandle ? activeCandle.close : asset.price}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Key Fundamentals / Technical Metrics Grid */}
          <div>
            <h3 className="text-base font-bold text-[#131722] dark:text-white mb-3">Key Statistics & Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">Day Range</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  ${asset.low.toFixed(2)} - ${asset.high.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">52-Week Range</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  ${asset.fiftyTwoWeekLow.toFixed(2)} - ${asset.fiftyTwoWeekHigh.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">Volume</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  {asset.volume}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">Market Capitalization</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  {asset.marketCap}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">P/E Ratio</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  {asset.peRatio ? asset.peRatio.toFixed(1) : '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">RSI (14)</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  {asset.rsi.toFixed(1)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">50-Day Moving Avg</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  ${asset.ma50.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45]">
                <span className="text-[11px] text-[#787B86] block font-medium">Beta (Volatility)</span>
                <span className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                  {asset.beta.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* About section */}
          <div className="p-4 rounded-xl bg-[#F0F3FA] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45] space-y-1.5">
            <h4 className="text-xs uppercase font-bold text-[#787B86] tracking-wider">About {asset.name}</h4>
            <p className="text-xs sm:text-sm text-[#131722] dark:text-[#D1D4DC] leading-relaxed">
              {asset.about}
            </p>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="sm:hidden flex gap-2 pt-2">
            <button
              onClick={() => onOpenTrade(asset, 'BUY')}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-[#089981] text-white text-center cursor-pointer"
            >
              Buy {asset.symbol}
            </button>
            <button
              onClick={() => onOpenTrade(asset, 'SELL')}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-[#F23645] text-white text-center cursor-pointer"
            >
              Sell {asset.symbol}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
