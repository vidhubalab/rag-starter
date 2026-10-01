import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowUpRight, ArrowDownRight, Globe2, Activity, ArrowUpDown } from 'lucide-react';
import { AssetCategory, TableOverviewTab, MarketAsset } from '../../types/market';
import {
  CATEGORY_TOP_BENCHMARKS,
  WORLD_INDICES_TABLE,
  US_MARKET_LEADERS,
  CRYPTO_BENCHMARKS,
} from '../../data/mockMarketData';

interface MarketsOverviewViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
  onOpenScreener: (category?: AssetCategory) => void;
  liveTickFlashMap?: Record<string, 'green' | 'red' | null>;
}

export const MarketsOverviewView: React.FC<MarketsOverviewViewProps> = ({
  onSelectAsset,
  onOpenScreener,
  liveTickFlashMap = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('US stocks');
  const [tableTab, setTableTab] = useState<TableOverviewTab>('Performance');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('everywhere');
  const [showAllLeaders, setShowAllLeaders] = useState(false);
  const [showAllCrypto, setShowAllCrypto] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const categories: AssetCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
    'Economy',
  ];

  const regions = [
    { id: 'everywhere', label: 'Markets, everywhere' },
    { id: 'us', label: 'United States' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia', label: 'Asia-Pacific' },
    { id: 'americas', label: 'Americas' },
    { id: 'global', label: 'Global Emerging' },
  ];

  // Active top 3 index/benchmark cards based on selected category
  const topBenchmarkCards =
    CATEGORY_TOP_BENCHMARKS[selectedCategory] || CATEGORY_TOP_BENCHMARKS['US stocks'];

  // Table sorting logic
  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colKey);
      setSortDirection('desc');
    }
  };

  const sortedTableData = [...WORLD_INDICES_TABLE].sort((a, b) => {
    if (!sortColumn) return 0;
    let valA = 0;
    let valB = 0;

    if (sortColumn === 'price') {
      valA = a.price;
      valB = b.price;
    } else if (sortColumn === 'change') {
      valA = a.change;
      valB = b.change;
    } else if (sortColumn === 'changePercent') {
      valA = a.changePercent;
      valB = b.changePercent;
    } else if (sortColumn === 'high') {
      valA = a.high;
      valB = b.high;
    } else if (sortColumn === 'low') {
      valA = a.low;
      valB = b.low;
    }

    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const visibleLeaders = showAllLeaders ? US_MARKET_LEADERS : US_MARKET_LEADERS.slice(0, 4);
  const visibleCrypto = showAllCrypto ? CRYPTO_BENCHMARKS : CRYPTO_BENCHMARKS.slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* BEGIN: HeroHeadlineSection */}
      <section className="pt-8 pb-4 px-4 text-center max-w-7xl mx-auto">
        {/* Main Dropdown Headline */}
        <div className="relative inline-block">
          <div
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
            className="inline-flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <h1 className="text-3xl sm:text-5xl md:text-[54px] font-black tracking-tight text-[#131722] dark:text-white transition-colors">
              {regions.find((r) => r.id === selectedRegion)?.label || 'Markets, everywhere'}
            </h1>
            <ChevronDown
              className={`w-7 h-7 sm:w-10 sm:h-10 text-[#131722] dark:text-white stroke-[3] group-hover:translate-y-0.5 transition-transform ${
                isRegionDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Region selector dropdown */}
          {isRegionDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-[#1E222D] rounded-2xl shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] py-2 z-30 text-left animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
                Select Region Focus
              </div>
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegion(reg.id);
                    setIsRegionDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm font-semibold flex items-center justify-between hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] transition-colors cursor-pointer ${
                    selectedRegion === reg.id
                      ? 'text-[#2962FF] font-bold bg-blue-50/50 dark:bg-blue-900/20'
                      : 'text-[#131722] dark:text-[#D1D4DC]'
                  }`}
                >
                  <span>{reg.label}</span>
                  {selectedRegion === reg.id && <div className="w-1.5 h-1.5 rounded-full bg-[#2962FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Pill Filter Navigation Bar */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1 px-2 border border-[#E0E3EB] dark:border-[#2A2E39] rounded-full bg-white dark:bg-[#1E222D] shadow-xs max-w-full">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#E8ECEF] dark:bg-[#2A2E39] text-[#131722] dark:text-white font-bold shadow-2xs'
                      : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>
      {/* END: HeroHeadlineSection */}

      {/* BEGIN: IndicesCarouselSection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title Link */}
        <div
          onClick={() => onOpenScreener(selectedCategory)}
          className="flex items-center gap-1.5 mb-5 group cursor-pointer w-fit select-none"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
            {selectedCategory === 'Crypto' ? 'Crypto Benchmarks' : selectedCategory === 'Futures' ? 'Commodities &amp; Futures' : 'Indices'}
          </h2>
          <ChevronRight className="w-6 h-6 stroke-[2.5] text-[#131722] dark:text-white group-hover:translate-x-1 group-hover:text-[#2962FF] transition-all" />
        </div>

        {/* Indices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topBenchmarkCards.slice(0, 3).map((item, index) => {
            const isPos = item.change >= 0;
            const flash = liveTickFlashMap[item.symbol];
            const strokeColor = isPos ? '#089981' : '#F23645';
            const gradId = `card-grad-${item.id}-${index}`;

            // Calculate SVG coordinates
            const points = item.sparkline || [20, 20, 20, 20];
            const min = Math.min(...points);
            const max = Math.max(...points);
            const r = max - min || 1;
            const stepX = 280 / (points.length - 1 || 1);

            const pathCoords = points
              .map((val, i) => {
                const x = i * stepX;
                const y = 4 + ((val - min) / r) * 32;
                return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
              })
              .join(' ');

            const areaCoords = `${pathCoords} L 280 40 L 0 40 Z`;

            return (
              <article
                key={item.id}
                onClick={() => onSelectAsset(item)}
                className={`bg-white dark:bg-[#1E222D] rounded-2xl border border-[#E0E3EB] dark:border-[#2A2E39] p-5 market-card-hover relative cursor-pointer group transition-all ${
                  flash === 'green' ? 'tick-flash-green' : flash === 'red' ? 'tick-flash-red' : ''
                }`}
                data-purpose="index-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-full text-white font-extrabold text-xs flex items-center justify-center tracking-tighter shrink-0 shadow-xs"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.badgeColor || '#FFFFFF',
                      }}
                    >
                      {item.badge}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs text-[#787B86] font-medium block truncate max-w-[160px] sm:max-w-[200px]">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg text-[#131722] dark:text-white tabular-nums">
                      ${item.price.toLocaleString(undefined, {
                        minimumFractionDigits: item.price < 10 ? 2 : 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-1 tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      <span>{item.change > 0 ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}</span>
                      <span>({item.changePercent > 0 ? `+${item.changePercent.toFixed(2)}` : item.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Sparkline Mini Chart SVG */}
                <div className="mt-4 h-12 w-full">
                  <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 280 40">
                    <defs>
                      <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path
                      d={pathCoords}
                      stroke={strokeColor}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path d={areaCoords} fill={`url(#${gradId})`} />
                  </svg>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {/* END: IndicesCarouselSection */}

      {/* BEGIN: MarketOverviewTabsAndTable */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl bg-white dark:bg-[#1E222D] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#131722] dark:text-white">
                World indices overview
              </h2>
              <p className="text-xs sm:text-sm text-[#787B86]">
                Real-time performance of major global stock market benchmarks
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F0F3FA] dark:bg-[#181B24] p-1 rounded-full border border-[#E0E3EB] dark:border-[#2A2E39]">
              {(['Performance', 'Technical', 'Components'] as TableOverviewTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTableTab(tab)}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    tableTab === tab
                      ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-2xs font-bold'
                      : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-xs uppercase text-[#787B86] border-b border-[#E0E3EB] dark:border-[#2A2E39]">
                  <th className="py-3 px-2 font-medium">Index</th>

                  {tableTab === 'Performance' && (
                    <>
                      <th
                        onClick={() => handleSort('price')}
                        className="py-3 px-2 font-medium text-right cursor-pointer hover:text-[#131722] dark:hover:text-white select-none"
                      >
                        <div className="flex items-center justify-end gap-1">
                          Price <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('change')}
                        className="py-3 px-2 font-medium text-right cursor-pointer hover:text-[#131722] dark:hover:text-white select-none"
                      >
                        <div className="flex items-center justify-end gap-1">
                          Change <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('changePercent')}
                        className="py-3 px-2 font-medium text-right cursor-pointer hover:text-[#131722] dark:hover:text-white select-none"
                      >
                        <div className="flex items-center justify-end gap-1">
                          % Change <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('high')}
                        className="py-3 px-2 font-medium text-right cursor-pointer hover:text-[#131722] dark:hover:text-white select-none"
                      >
                        High
                      </th>
                      <th
                        onClick={() => handleSort('low')}
                        className="py-3 px-2 font-medium text-right cursor-pointer hover:text-[#131722] dark:hover:text-white select-none"
                      >
                        Low
                      </th>
                      <th className="py-3 px-2 font-medium text-center">Trend (1D)</th>
                    </>
                  )}

                  {tableTab === 'Technical' && (
                    <>
                      <th className="py-3 px-2 font-medium text-right">Price</th>
                      <th className="py-3 px-2 font-medium text-center">Rating</th>
                      <th className="py-3 px-2 font-medium text-right">RSI (14)</th>
                      <th className="py-3 px-2 font-medium text-right">MACD</th>
                      <th className="py-3 px-2 font-medium text-right">MA 50</th>
                      <th className="py-3 px-2 font-medium text-right">Beta</th>
                    </>
                  )}

                  {tableTab === 'Components' && (
                    <>
                      <th className="py-3 px-2 font-medium text-right">Price</th>
                      <th className="py-3 px-2 font-medium text-right">Market Cap</th>
                      <th className="py-3 px-2 font-medium text-right">P/E Ratio</th>
                      <th className="py-3 px-2 font-medium text-right">Div Yield</th>
                      <th className="py-3 px-2 font-medium text-right">52W High</th>
                      <th className="py-3 px-2 font-medium text-right">52W Low</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
                {sortedTableData.map((row) => {
                  const isPos = row.change >= 0;
                  const flash = liveTickFlashMap[row.symbol];

                  return (
                    <tr
                      key={row.id}
                      onClick={() => onSelectAsset(row)}
                      className={`hover:bg-[#F8F9FD] dark:hover:bg-[#252A37] transition-colors group cursor-pointer ${
                        flash === 'green' ? 'tick-flash-green' : flash === 'red' ? 'tick-flash-red' : ''
                      }`}
                    >
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: row.badgeBg,
                              color: row.badgeColor || '#131722',
                            }}
                          >
                            {row.badge}
                          </span>
                          <div>
                            <span className="font-bold text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                              {row.symbol}
                            </span>
                            <span className="text-xs text-[#787B86] block">{row.subtitle}</span>
                          </div>
                        </div>
                      </td>

                      {tableTab === 'Performance' && (
                        <>
                          <td className="py-3.5 px-2 text-right font-semibold text-[#131722] dark:text-white tabular-nums">
                            {row.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            className={`py-3.5 px-2 text-right font-medium tabular-nums ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {row.change > 0 ? `+${row.change.toFixed(2)}` : row.change.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-2 text-right tabular-nums">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                isPos
                                  ? 'bg-[#E6F4EA] dark:bg-emerald-950/40 text-[#089981]'
                                  : 'bg-[#FCE8E6] dark:bg-rose-950/40 text-[#F23645]'
                              }`}
                            >
                              {row.changePercent > 0 ? `+${row.changePercent.toFixed(2)}` : row.changePercent.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.high.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.low.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3.5 px-2 w-28 text-center">
                            <svg className="h-5 w-20 mx-auto" viewBox="0 0 80 20">
                              <path
                                d={
                                  isPos
                                    ? 'M0 16 L20 14 L40 10 L60 8 L80 2'
                                    : 'M0 6 L20 9 L40 7 L60 14 L80 16'
                                }
                                fill="none"
                                stroke={isPos ? '#089981' : '#F23645'}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </td>
                        </>
                      )}

                      {tableTab === 'Technical' && (
                        <>
                          <td className="py-3.5 px-2 text-right font-semibold text-[#131722] dark:text-white tabular-nums">
                            {row.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3.5 px-2 text-center">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded ${
                                row.technicalRating.includes('Buy')
                                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-[#089981]'
                                  : row.technicalRating.includes('Sell')
                                  ? 'bg-rose-100 dark:bg-rose-950/40 text-[#F23645]'
                                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'
                              }`}
                            >
                              {row.technicalRating}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.rsi.toFixed(1)}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.macd.toFixed(1)}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.ma50.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.beta.toFixed(2)}
                          </td>
                        </>
                      )}

                      {tableTab === 'Components' && (
                        <>
                          <td className="py-3.5 px-2 text-right font-semibold text-[#131722] dark:text-white tabular-nums">
                            {row.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums font-medium">
                            {row.marketCap}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.peRatio ? row.peRatio.toFixed(1) : '—'}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.divYield || '—'}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.fiftyTwoWeekHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-2 text-right text-[#787B86] tabular-nums">
                            {row.fiftyTwoWeekLow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* END: MarketOverviewTabsAndTable */}

      {/* BEGIN: TwoColumnMarketMovers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Box 1: Market leaders */}
          <div className="border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl bg-white dark:bg-[#1E222D] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#131722] dark:text-white">Market leaders</h3>
                <span className="text-xs bg-gray-100 dark:bg-[#2A2E39] text-[#787B86] px-2 py-0.5 rounded font-medium">
                  US
                </span>
              </div>
              <button
                onClick={() => setShowAllLeaders(!showAllLeaders)}
                className="text-xs font-semibold text-[#2962FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showAllLeaders ? 'Show less' : 'See all'}
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-2.5">
              {visibleLeaders.map((item) => {
                const isPos = item.change >= 0;
                const flash = liveTickFlashMap[item.symbol];

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectAsset(item)}
                    className={`flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F9FD] dark:hover:bg-[#252A37] transition-colors cursor-pointer group ${
                      flash === 'green' ? 'tick-flash-green' : flash === 'red' ? 'tick-flash-red' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: item.badgeBg,
                          color: item.badgeColor || '#FFFFFF',
                        }}
                      >
                        {item.badge}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors leading-tight">
                          {item.symbol}
                        </h4>
                        <p className="text-xs text-[#787B86]">{item.name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-[#131722] dark:text-white tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {item.change > 0 ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)} (
                        {item.changePercent > 0 ? `+${item.changePercent.toFixed(2)}` : item.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Box 2: Crypto benchmark */}
          <div className="border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl bg-white dark:bg-[#1E222D] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#131722] dark:text-white">Crypto benchmark</h3>
                <span className="text-xs bg-gray-100 dark:bg-[#2A2E39] text-[#787B86] px-2 py-0.5 rounded font-medium">
                  Global
                </span>
              </div>
              <button
                onClick={() => setShowAllCrypto(!showAllCrypto)}
                className="text-xs font-semibold text-[#2962FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showAllCrypto ? 'Show less' : 'See all'}
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-2.5">
              {visibleCrypto.map((item) => {
                const isPos = item.change >= 0;
                const flash = liveTickFlashMap[item.symbol];

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectAsset(item)}
                    className={`flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F9FD] dark:hover:bg-[#252A37] transition-colors cursor-pointer group ${
                      flash === 'green' ? 'tick-flash-green' : flash === 'red' ? 'tick-flash-red' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: item.badgeBg,
                          color: item.badgeColor || '#FFFFFF',
                        }}
                      >
                        {item.badge}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors leading-tight">
                          {item.symbol}
                        </h4>
                        <p className="text-xs text-[#787B86]">{item.name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-[#131722] dark:text-white tabular-nums">
                        ${item.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {item.change > 0 ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)} (
                        {item.changePercent > 0 ? `+${item.changePercent.toFixed(2)}` : item.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* END: TwoColumnMarketMovers */}
    </div>
  );
};
