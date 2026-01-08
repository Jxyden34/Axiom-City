/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef, useState } from 'react';
import { BuildingType, CityStats, AIGoal, NewsItem, WeatherType, DisasterType, ActiveDisaster, HistoryLogEntry, Grid } from '../types';
import { BUILDINGS } from '../constants';

interface UIOverlayProps {
  stats: CityStats;
  grid: Grid;
  selectedTool: BuildingType;
  onSelectTool: (type: BuildingType) => void;
  currentGoal: AIGoal | null;
  newsFeed: NewsItem[];

  onCycleTax?: () => void;
  onTakeLoan?: () => void;
  onRepayLoan?: () => void;
  onBuyShares?: () => void;
  onSellShares?: () => void;
  onResetCity: () => void;
  neonMode: boolean;
  onToggleNeon: () => void;
  onTogglePhotoMode: () => void;
  weather: WeatherType;
  activeDisaster: ActiveDisaster | null;
  onTriggerDisaster: () => void;
  aiEnabled: boolean;
  onToggleAi: () => void;
  historyLog: HistoryLogEntry[];
  showHistory: boolean;
  onToggleHistory: () => void;
}

const tools = [
  BuildingType.None,
  BuildingType.Road,
  BuildingType.Residential,
  BuildingType.Apartment,
  BuildingType.Mansion,
  BuildingType.Commercial,
  BuildingType.Industrial,
  BuildingType.Park,
  BuildingType.School,
  BuildingType.Hospital,
  BuildingType.Police,
  BuildingType.FireStation,
  BuildingType.GoldMine,
  BuildingType.Casino,
  BuildingType.MegaMall,
  BuildingType.SpacePort,
  BuildingType.University,
  BuildingType.ResearchCentre,
  BuildingType.Stadium,
  BuildingType.Bridge
];

const ToolButton = ({ type, isSelected, onClick, money, grid }: { type: BuildingType, isSelected: boolean, onClick: () => void, money: number, grid: Grid }) => {
  const config = BUILDINGS[type];
  const canAfford = money >= config.cost;

  // Check limits
  let count = 0;
  if (config.maxAllowed) {
    grid.forEach(row => row.forEach(tile => {
      if (tile.buildingType === type) count++;
    }));
  }
  const isLimitReached = config.maxAllowed ? count >= config.maxAllowed : false;

  return (
    <button
      onClick={onClick}
      disabled={(!canAfford && type !== BuildingType.None) || isLimitReached}
      className={`
        relative group flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all
        ${isSelected ? 'border-cyan-400 bg-cyan-900/80 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105 z-10' : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700'}
        ${(!canAfford && type !== BuildingType.None) || isLimitReached ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
      `}
    >
      {isLimitReached && <div className="absolute top-1 right-1 text-[10px] bg-red-600 text-white px-1 rounded">MAX</div>}
      <div className={`text-4xl mb-2 ${isSelected ? 'animate-bounce' : ''}`}>
        {type === BuildingType.None ? '🚜' :
          type === BuildingType.Road ? '🛣️' :
            type === BuildingType.Residential ? '🏠' :
              type === BuildingType.Commercial ? '🏪' :
                type === BuildingType.Industrial ? '🏭' :
                  type === BuildingType.Park ? '🌳' :
                    type === BuildingType.Police ? '🚓' :
                      type === BuildingType.FireStation ? '🚒' :
                        type === BuildingType.School ? '🏫' :
                          type === BuildingType.Hospital ? '🏥' :
                            type === BuildingType.GoldMine ? '💰' :
                              type === BuildingType.Apartment ? '🏢' :
                                type === BuildingType.Mansion ? '🏰' :
                                  type === BuildingType.Casino ? '🎰' :
                                    type === BuildingType.MegaMall ? '🛍️' :
                                      type === BuildingType.SpacePort ? '🚀' :
                                        type === BuildingType.University ? '🎓' :
                                          type === BuildingType.Stadium ? '🏟️' :
                                            type === BuildingType.ResearchCentre ? '🧪' :
                                              type === BuildingType.Bridge ? '🌉' : '❓'}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-center leading-none text-white shadow-black drop-shadow-md">
        {config.name}
      </div>
      {config.cost > 0 && (
        <div className={`text-[10px] font-mono mt-1 ${canAfford ? 'text-green-300' : 'text-red-400'}`}>
          ${config.cost}
        </div>
      )}
    </button>
  );
};

const StatusRow = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex justify-between items-center text-xl my-1.5">
    <span className="text-gray-400 font-medium">{label}</span>
    <span className={`font-mono font-bold ${color} text-2xl`}>{value}</span>
  </div>
);

const CityStatusPanel = ({ stats }: { stats: CityStats }) => (
  <div className="bg-slate-900/95 p-6 rounded-2xl border-2 border-slate-600 shadow-2xl backdrop-blur-xl w-96 md:w-[28rem]">
    <div className="text-base font-black uppercase tracking-widest text-gray-300 mb-5 border-b-2 border-slate-600 pb-2">City Status</div>
    <div className="space-y-1.5">
      <StatusRow label="Population" value={(stats.population || 0).toLocaleString()} color="text-cyan-300" />
      <div className="flex gap-2 justify-between px-2 mb-2 bg-slate-800/40 rounded-lg py-1">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Kids</span>
          <span className="text-sm font-mono text-cyan-200">{stats.demographics?.children || 0}</span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-700 px-4">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Adults</span>
          <span className="text-sm font-mono text-cyan-200">{stats.demographics?.adults || 0}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Snrs</span>
          <span className="text-sm font-mono text-cyan-200">{stats.demographics?.seniors || 0}</span>
        </div>
      </div>
      <StatusRow label="Happiness" value={`${Math.round(stats.happiness)}%`} color={stats.happiness > 80 ? 'text-green-400' : stats.happiness > 40 ? 'text-yellow-400' : 'text-red-500'} />
      <StatusRow label="Education" value={`${Math.round(stats.education)}%`} color="text-blue-300" />
      <StatusRow label="Safety" value={`${Math.round(stats.safety)}%`} color="text-indigo-300" />

      <StatusRow label="Crime Risk" value={stats.crimeRate > 0 ? `${stats.crimeRate}` : 'Low'} color={stats.crimeRate > 20 ? 'text-red-500' : 'text-gray-400'} />
      <StatusRow label="Pollution" value={stats.pollutionLevel > 0 ? `${stats.pollutionLevel}` : 'Clean'} color={stats.pollutionLevel > 20 ? 'text-lime-400' : 'text-emerald-400'} />

      <div className="flex justify-between items-center text-xl my-1.5">
        <span className="text-gray-400 font-medium">Wind</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none transform transition-transform duration-1000" style={{ transform: `rotate(${Math.atan2(stats.windDirection?.y || 0, stats.windDirection?.x || 1) * (180 / Math.PI)}deg)` }}>
            ➤
          </span>
          <span className="font-mono font-bold text-gray-300 text-xl">
            {((stats.windSpeed || 0) * 100).toFixed(0)}km/h
          </span>
        </div>
      </div>

      <div className="h-px bg-slate-700 my-1.5" />

      <StatusRow label="Unemployment" value={`${Math.round(stats.jobs.unemployment * 100)}%`} color={stats.jobs.unemployment < 0.1 ? 'text-green-400' : 'text-red-400'} />
      <StatusRow label="Jobs" value={stats.jobs.total.toLocaleString()} color="text-orange-300" />
      <StatusRow label="Tax Rate" value={`${Math.round(stats.taxRate * 100)}%`} color="text-yellow-200" />

      <div className="h-px bg-slate-700 my-1.5" />

      <StatusRow label="Income" value={`+$${stats.budget.income}`} color="text-green-400" />
      <StatusRow label="Expenses" value={`-$${stats.budget.expenses}`} color="text-red-400" />
    </div>
  </div>
);

const AiControlPanel = ({ status, onReset }: { status: string, onReset: () => void }) => (
  <div className="bg-indigo-950/90 p-4 rounded-xl border border-indigo-500/30 shadow-xl backdrop-blur-md w-64 md:w-72">
    <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 border-b border-indigo-800 pb-2">AI Status</div>
    <div className="text-sm text-indigo-200 mb-4 leading-tight min-h-[1.5em]">{status}</div>
    <button onClick={onReset} className="w-full py-1.5 bg-red-900/50 hover:bg-red-800/80 border border-red-700 text-red-200 text-[10px] font-bold uppercase rounded transition-colors">
      Reset City
    </button>
  </div>
);

const UIOverlay = ({
  stats,
  grid,
  selectedTool,
  onSelectTool,
  currentGoal,
  newsFeed,
  onClaimReward,
  isGeneratingGoal,
  onCycleTax,
  onTakeLoan,
  onRepayLoan,
  onBuyShares,
  onSellShares,
  onResetCity,
  neonMode,
  onToggleNeon,
  weather,
  activeDisaster,
  onTriggerDisaster,
  aiEnabled,
  onToggleAi,
  historyLog,
  showHistory,
  onToggleHistory,
  onTogglePhotoMode
}: UIOverlayProps) => {

  const [activeTab, setActiveTab] = useState<'build' | 'stats' | 'events'>('build');

  const newsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newsRef.current) newsRef.current.scrollTop = newsRef.current.scrollHeight;
  }, [newsFeed]);

  const historyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll history
  useEffect(() => {
    if (showHistory && historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [showHistory, historyLog]); // Scroll when opened or log updates

  const aiStatus = isGeneratingGoal ? "AI is analyzing city state..." : (currentGoal ? `Focus: ${currentGoal.description.substring(0, 30)}...` : "Idle");

  return (
    <div className="absolute inset-0 pointer-events-none p-4 font-sans z-10 flex flex-col justify-between">

      {/* --- CITY HISTORY MODAL --- */}
      {showHistory && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 pointer-events-auto backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-2xl max-h-[80vh] rounded-3xl border-4 border-amber-600/50 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            <div className="bg-amber-900/40 p-6 border-b border-amber-700/50 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-amber-100 font-serif">City Chronicles</h2>
                <p className="text-amber-300/60 font-mono text-sm uppercase tracking-wide">The history of your civilization</p>
              </div>
              <button onClick={onToggleHistory} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors">
                ❌
              </button>
            </div>
            <div ref={historyRef} className="flex-1 overflow-y-auto p-8 space-y-6 font-serif bg-[url('/paper-texture.png')] bg-slate-900/90 relative">
              {/* Decorative Line */}
              <div className="absolute left-10 top-0 bottom-0 w-1 bg-amber-700/30"></div>

              {historyLog.length === 0 && <div className="text-amber-500/50 italic text-center text-xl mt-10">History has not yet begun...</div>}

              {[...historyLog].reverse().map((entry) => (
                <div key={entry.id} className="relative pl-10 animate-fade-in-up">
                  {/* Dot on timeline */}
                  <div className={`absolute left-8 -translate-x-1/2 mt-1.5 w-4 h-4 rounded-full border-2 border-slate-900 shadow-xl
                                ${entry.type === 'disaster' ? 'bg-red-500 box-shadow-red' :
                      entry.type === 'major' ? 'bg-amber-400' :
                        entry.type === 'milestone' ? 'bg-cyan-400' : 'bg-slate-500'}
                            `}></div>

                  <div className="flex flex-col">
                    <span className={`font-mono text-xs font-bold uppercase tracking-widest mb-1
                                    ${entry.type === 'disaster' ? 'text-red-400' : 'text-amber-500/70'}
                                `}>Day {entry.day}</span>
                    <span className={`text-xl leading-relaxed
                                    ${entry.type === 'disaster' ? 'text-red-100 font-bold' :
                        entry.type === 'major' ? 'text-amber-50 font-medium' :
                          entry.type === 'milestone' ? 'text-cyan-100 font-medium italic' : 'text-slate-300'}
                                `}>{entry.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Left: Panels */}
      <div className="flex flex-col gap-4 items-start pointer-auto">
        <CityStatusPanel stats={stats} />



        {/* News Feed Moved Here */}
        <div className="w-96 md:w-[28rem] h-72 bg-slate-950/95 rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-5 py-3 text-base font-black uppercase tracking-widest text-gray-300 border-b-2 border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span>City Feed</span>
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={onTogglePhotoMode}
                  title="Open Photo Mode"
                  className="bg-slate-800 hover:bg-sky-600 text-white p-1.5 rounded-lg border border-slate-600 hover:border-sky-400 transition-all active:scale-90 shadow-lg group"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform inline-block">📸</span>
                </button>

                <button
                  onClick={onToggleNeon}
                  title={neonMode ? "Disable Neon Mode" : "Enable Neon Mode"}
                  className={`p-1.5 rounded-lg border transition-all active:scale-90 shadow-lg group ${neonMode ? 'bg-fuchsia-900/80 border-fuchsia-400 text-fuchsia-200' : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white'}`}
                >
                  <span className="text-sm group-hover:scale-110 transition-transform inline-block">✨</span>
                </button>

                <button
                  onClick={onToggleHistory}
                  title="View History"
                  className="bg-slate-800 hover:bg-amber-600 text-white p-1.5 rounded-lg border border-slate-600 hover:border-amber-400 transition-all active:scale-90 shadow-lg group"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform inline-block">📜</span>
                </button>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          </div>

          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30 z-20"></div>

          <div ref={newsRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm md:text-base font-mono scroll-smooth mask-image-b z-10">
            {newsFeed.length === 0 && <div className="text-gray-500 italic text-center mt-10 text-lg">No active news stream.</div>}
            {newsFeed.map((news) => (
              <div key={news.id} className={`
                border-l-4 pl-3 py-2 transition-all animate-fade-in leading-snug relative
                ${news.type === 'positive' ? 'border-green-500 text-green-200 bg-green-900/30' : ''}
                ${news.type === 'negative' ? 'border-red-500 text-red-200 bg-red-900/30' : ''}
                ${news.type === 'neutral' ? 'border-blue-400 text-blue-100 bg-blue-900/30' : ''}
              `}>
                <span className="opacity-70 text-[11px] uppercase font-bold absolute top-1 right-2">{new Date(Number(news.id.split('.')[0])).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="block mt-4">{news.text}</span>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* Emergency Banner */}
      {activeDisaster && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-8 py-3 rounded-xl border-4 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-pulse z-50 flex flex-col items-center">
          <div className="text-2xl font-black uppercase tracking-widest flex items-center gap-4">
            <span className="animate-bounce">⚠️</span>
            {activeDisaster.type === DisasterType.Meteor ? 'METEOR INBOUND' :
              activeDisaster.type === DisasterType.AlienInvasion ? 'ALIEN INVASION' :
                activeDisaster.type === DisasterType.SolarFlare ? 'SOLAR FLARE DETECTED' : 'EMERGENCY'}
            <span className="animate-bounce">⚠️</span>
          </div>
          <div className="text-xs font-mono mt-1 uppercase opacity-90">
            {activeDisaster.stage === 'WARNING' ? 'SEEK SHELTER IMMEDIATELY' : 'CRITICAL FAILURE IMMINENT'}
          </div>
        </div>
      )}

      {/* Top Right: Treasury & Settings */}
      <div className="absolute top-4 right-4 flex flex-col gap-3 items-end pointer-auto">
        <div className="bg-slate-900/95 p-6 rounded-2xl border-2 border-slate-600 shadow-2xl backdrop-blur-xl w-96 md:w-[28rem]">
          <div className="text-right text-sm mb-2 border-b-2 border-slate-600 pb-2 flex justify-between">
            <span className="text-gray-300 font-bold uppercase tracking-widest">Reserves</span>
            <span className="text-gray-400">Day {stats.day}</span>
          </div>
          <div className={`text-5xl font-black font-mono text-right my-4 ${stats.money >= 0 ? 'text-green-400' : 'text-red-500'}`}>
            ${stats.money.toLocaleString()}
          </div>
          <div className="text-right text-sm mt-2 border-t-2 border-slate-700 pt-2 flex justify-between items-center">
            <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">Weather Condition</span>
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none" title={weather}>
                {weather === WeatherType.Clear ? '☀️' :
                  weather === WeatherType.Rain ? '🌧️' :
                    weather === WeatherType.Snow ? '🌨️' :
                      weather === WeatherType.Fog ? '🌫️' :
                        weather === WeatherType.AcidRain ? '🧪' :
                          weather === WeatherType.Thunderstorm ? '⚡' :
                            weather === WeatherType.Sandstorm ? '🏜️' :
                              weather === WeatherType.Heatwave ? '🌡️' :
                                weather === WeatherType.MeteorShower ? '🌠' :
                                  weather === WeatherType.Aurora ? '🌌' :
                                    weather === WeatherType.BloodMoon ? '🌑' :
                                      weather === WeatherType.ToxicSmog ? '💨' :
                                        weather === WeatherType.Stardust ? '✨' : '❓'}
              </span>
              <span className="text-sm font-mono font-bold text-white">{weather}</span>
            </div>
          </div>

        </div>




      </div>

      {/* Bottom: Tools Only (Feed Moved) */}
      <div className="flex items-end gap-4 w-full pointer-events-auto justify-center">
        {/* Toolbar Centered or Full Width */}
        <div className="bg-slate-900/90 p-2 rounded-2xl border border-slate-700 shadow-2xl overflow-x-auto no-scrollbar max-w-[90vw]">
          <div className="flex gap-2">
            {tools.map(type => (
              <ToolButton key={type} type={type} isSelected={selectedTool === type} onClick={() => onSelectTool(type)} money={stats.money} grid={grid} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Goal & Control Panel Combined */}
      {aiEnabled ? (
        <div className={`absolute bottom-32 right-8 w-96 md:w-[28rem] bg-indigo-900/95 text-white rounded-2xl border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.5)] backdrop-blur-md overflow-hidden transition-all pointer-events-auto transform scale-100 hover:scale-105 origin-bottom-right`}>
          <div className="bg-indigo-800/90 px-6 py-4 flex justify-between items-center border-b border-indigo-600">
            <span className="font-bold uppercase text-base tracking-widest flex items-center gap-3 shadow-sm">
              <>
                <span className={`w-4 h-4 rounded-full ${isGeneratingGoal ? 'bg-yellow-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`}></span>
                AI Mayor
              </>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-indigo-300 uppercase">Active</span>
              <button
                onClick={onToggleAi}
                className="w-12 h-6 rounded-full bg-cyan-500 p-1 transition-colors duration-300 relative"
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md transform translate-x-6 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {currentGoal ? (
              <>
                <p className="text-lg font-medium text-indigo-50 mb-5 leading-relaxed drop-shadow">"{currentGoal.description}"</p>

                <div className="flex justify-between items-center mt-2 bg-indigo-950/60 p-3 rounded-lg border border-indigo-700/50">
                  <div className="text-xs text-gray-300 uppercase font-bold tracking-wider">
                    Target: <span className="font-mono font-bold text-white text-sm ml-2">
                      {currentGoal.targetType === 'building_count' && currentGoal.buildingType && BUILDINGS[currentGoal.buildingType]
                        ? BUILDINGS[currentGoal.buildingType].name
                        : currentGoal.targetType === 'money'
                          ? '$'
                          : 'Pop.'} {currentGoal.targetValue}
                    </span>
                  </div>
                  <div className="text-xs text-yellow-300 font-bold font-mono bg-yellow-900/50 px-3 py-1 rounded-full border border-yellow-600/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    +${currentGoal.reward}
                  </div>
                </div>

                {currentGoal.completed && (
                  <button
                    onClick={onClaimReward}
                    className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all animate-bounce text-sm uppercase tracking-wide border border-green-400/50"
                  >
                    Collect Reward
                  </button>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-400 py-4 italic flex items-center gap-3 justify-center">
                <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isGeneratingGoal ? "Analyzing city layout..." : "AI is idle..."}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Minimized State */
        <div className="absolute bottom-32 right-8 pointer-events-auto transform transition-all hover:scale-110 origin-bottom-right">
          <button
            onClick={onToggleAi}
            className="flex items-center gap-3 bg-slate-800/90 hover:bg-indigo-600 border-2 border-slate-600 hover:border-indigo-400 text-slate-300 hover:text-white px-5 py-3 rounded-full shadow-lg backdrop-blur-md group transition-all"
          >
            <span className="w-3 h-3 rounded-full bg-red-500 group-hover:bg-cyan-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all"></span>
            <span className="font-bold uppercase tracking-widest text-xs">Enable AI Mayor</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default UIOverlay;