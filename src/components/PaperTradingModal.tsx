import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, DollarSign, Wallet } from 'lucide-react';
import { MarketAsset, PaperTradePosition } from '../types/market';

interface PaperTradingModalProps {
  asset: MarketAsset | null;
  tradeType: 'BUY' | 'SELL';
  onClose: () => void;
  onExecuteTrade: (position: PaperTradePosition) => void;
  cashBalance: number;
}

export const PaperTradingModal: React.FC<PaperTradingModalProps> = ({
  asset,
  tradeType: initialTradeType,
  onClose,
  onExecuteTrade,
  cashBalance,
}) => {
  if (!asset) return null;

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>(initialTradeType);
  const [shares, setShares] = useState<number>(10);
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
  const [limitPrice, setLimitPrice] = useState<number>(asset.price);
  const [isSuccess, setIsSuccess] = useState(false);

  const pricePerUnit = orderType === 'Market' ? asset.price : limitPrice;
  const totalCost = shares * pricePerUnit;
  const canAfford = tradeType === 'SELL' || totalCost <= cashBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford || shares <= 0) return;

    onExecuteTrade({
      symbol: asset.symbol,
      name: asset.name,
      type: tradeType,
      shares,
      entryPrice: pricePerUnit,
      currentPrice: asset.price,
      timestamp: new Date().toLocaleTimeString(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E222D] rounded-2xl shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-full text-white font-extrabold text-[11px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: asset.badgeBg }}
            >
              {asset.badge}
            </span>
            <div>
              <h3 className="font-bold text-sm text-[#131722] dark:text-white">
                Paper Trading · {asset.symbol}
              </h3>
              <span className="text-xs text-[#787B86]">${asset.price.toFixed(2)} USD</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787B86] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h4 className="font-bold text-lg text-[#131722] dark:text-white">Order Filled!</h4>
            <p className="text-xs text-[#787B86]">
              Simulated {tradeType} order for {shares} shares of {asset.symbol} executed at $
              {pricePerUnit.toFixed(2)}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#F0F3FA] dark:bg-[#252A37] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 text-xs font-extrabold rounded-lg transition-colors cursor-pointer ${
                  tradeType === 'BUY'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 text-xs font-extrabold rounded-lg transition-colors cursor-pointer ${
                  tradeType === 'SELL'
                    ? 'bg-[#F23645] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Account Balance display */}
            <div className="flex items-center justify-between text-xs text-[#787B86] px-1">
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" /> Paper Balance:
              </span>
              <span className="font-bold text-[#131722] dark:text-white tabular-nums">
                ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Order Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787B86]">Order Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Market', 'Limit'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      orderType === type
                        ? 'border-[#2962FF] bg-[#2962FF]/10 text-[#2962FF]'
                        : 'border-[#E0E3EB] dark:border-[#2A2E39] text-[#787B86]'
                    }`}
                  >
                    {type} Order
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#787B86]">Quantity (Shares / Units)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#F0F3FA] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45] rounded-xl px-3 py-2 text-sm font-bold tabular-nums outline-none focus:border-[#2962FF]"
                />
                <div className="flex gap-1">
                  {[5, 10, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setShares(preset)}
                      className="px-2 py-1.5 rounded-lg border border-[#E0E3EB] dark:border-[#363A45] text-xs font-semibold text-[#787B86] hover:text-[#131722] dark:hover:text-white"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {orderType === 'Limit' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#787B86]">Limit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || asset.price)}
                  className="w-full bg-[#F0F3FA] dark:bg-[#252A37] border border-[#E0E3EB] dark:border-[#363A45] rounded-xl px-3 py-2 text-sm font-bold tabular-nums outline-none focus:border-[#2962FF]"
                />
              </div>
            )}

            {/* Total calculation */}
            <div className="bg-[#F8F9FD] dark:bg-[#252A37] rounded-xl p-3 border border-[#E0E3EB] dark:border-[#363A45] space-y-1 text-xs">
              <div className="flex justify-between text-[#787B86]">
                <span>Estimated Price:</span>
                <span className="font-semibold text-[#131722] dark:text-white tabular-nums">
                  ${pricePerUnit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#787B86]">
                <span>Estimated Value:</span>
                <span className="font-bold text-sm text-[#131722] dark:text-white tabular-nums">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {!canAfford && (
              <div className="flex items-center gap-1.5 text-xs text-[#F23645] bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Insufficient paper funds for this purchase.</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!canAfford}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all cursor-pointer ${
                tradeType === 'BUY'
                  ? 'bg-[#089981] hover:bg-[#06806c] disabled:opacity-50'
                  : 'bg-[#F23645] hover:bg-[#d42c3a] disabled:opacity-50'
              }`}
            >
              Place Simulated {tradeType} Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
