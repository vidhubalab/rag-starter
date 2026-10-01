import React, { useState } from 'react';
import { Star, Shield, Zap, CheckCircle2, ExternalLink, HelpCircle } from 'lucide-react';
import { TOP_BROKERS } from '../../data/mockMarketData';
import { BrokerInfo } from '../../types/market';

export const BrokersView: React.FC = () => {
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-[#131722] dark:text-white tracking-tight">
          Integrated Verified Brokers
        </h1>
        <p className="text-sm text-[#787B86] mt-1">
          Execute trades directly from TradingView charts with ultra-low latency, institutional security, and regulated partners
        </p>
      </div>

      {connectedBroker && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#089981]" />
            <div>
              <span className="font-bold text-sm text-[#131722] dark:text-white">
                Account connected with {connectedBroker}
              </span>
              <p className="text-xs text-[#787B86]">Paper execution bridge active with zero commission</p>
            </div>
          </div>
          <button
            onClick={() => setConnectedBroker(null)}
            className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Brokers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOP_BROKERS.map((broker) => {
          const isConnected = connectedBroker === broker.name;
          return (
            <div
              key={broker.id}
              className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-6 shadow-xs space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl text-white font-black text-sm flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: broker.badgeColor }}
                  >
                    {broker.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#131722] dark:text-white">
                      {broker.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#787B86] mt-0.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 font-bold text-[#131722] dark:text-white">
                          {broker.rating}
                        </span>
                      </div>
                      <span>({broker.reviewsCount.toLocaleString()} trader reviews)</span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-[#2962FF]">
                  Regulated: {broker.regulator}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F8F9FD] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45] text-xs">
                <div>
                  <span className="text-[11px] text-[#787B86] block">EUR/USD Spread</span>
                  <span className="font-bold text-[#131722] dark:text-white tabular-nums">
                    {broker.spread}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#787B86] block">Leverage</span>
                  <span className="font-bold text-[#131722] dark:text-white">
                    {broker.leverage}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#787B86] block">Min Deposit</span>
                  <span className="font-bold text-[#131722] dark:text-white tabular-nums">
                    {broker.depositMin}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                {broker.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#787B86]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#089981] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Connect Button */}
              <button
                onClick={() => setConnectedBroker(isConnected ? null : broker.name)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  isConnected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2962FF] hover:bg-[#1E53E5] text-white'
                }`}
              >
                {isConnected ? '✓ Connected to Terminal' : 'Trade with ' + broker.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
