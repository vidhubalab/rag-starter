import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, TrendingUp, TrendingDown, Clock, UserCheck, Flame } from 'lucide-react';
import { COMMUNITY_IDEAS } from '../../data/mockMarketData';
import { MarketAsset } from '../../types/market';
import { ALL_SEARCHABLE_ASSETS } from '../../data/mockMarketData';

interface CommunityViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onSelectAsset }) => {
  const [ideas, setIdeas] = useState(COMMUNITY_IDEAS);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedMap((prev) => {
      const isLiked = !!prev[id];
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea.id === id ? { ...idea, likes: idea.likes + (isLiked ? -1 : 1) } : idea
        )
      );
      return { ...prev, [id]: !isLiked };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#131722] dark:text-white tracking-tight">
            Community Trading Ideas
          </h1>
          <p className="text-sm text-[#787B86] mt-1">
            Real market discussions, chart breakdowns, and macro forecasts published by top analysts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[#089981] font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-current" /> 14,200 Active Traders Online
          </span>
        </div>
      </div>

      {/* Grid of Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea) => {
          const matchedAsset = ALL_SEARCHABLE_ASSETS.find((a) => a.symbol === idea.symbol);
          const isLiked = !!likedMap[idea.id];

          return (
            <article
              key={idea.id}
              className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-5 shadow-xs hover:border-[#2962FF] transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2962FF] to-[#9945FF] text-white flex items-center justify-center font-bold text-xs">
                    {idea.authorAvatar}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#131722] dark:text-white block">
                      {idea.author}
                    </span>
                    <span className="text-[11px] text-[#787B86] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {idea.timeAgo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      idea.sentiment === 'Bullish'
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-[#089981]'
                        : 'bg-rose-100 dark:bg-rose-950/40 text-[#F23645]'
                    }`}
                  >
                    {idea.sentiment === 'Bullish' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {idea.sentiment}
                  </span>

                  {matchedAsset && (
                    <button
                      onClick={() => onSelectAsset(matchedAsset)}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#2A2E39] text-xs font-bold text-[#2962FF] hover:underline cursor-pointer"
                    >
                      ${idea.symbol}
                    </button>
                  )}
                </div>
              </div>

              {/* Title & summary */}
              <div>
                <h3 className="font-bold text-base text-[#131722] dark:text-white leading-snug">
                  {idea.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#787B86] mt-2 leading-relaxed">
                  {idea.summary}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#F0F3FA] dark:bg-[#252A37] text-[#787B86] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions: Likes, comments */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E0E3EB] dark:border-[#2A2E39] text-xs text-[#787B86]">
                <button
                  onClick={() => toggleLike(idea.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    isLiked ? 'text-[#2962FF]' : 'hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{idea.likes.toLocaleString()}</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{idea.comments}</span>
                  </div>
                  <button className="hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
