
import React, { useEffect, useState } from 'react';
import { AIEventResponse } from '../services/localAiService';

interface EventModalProps {
    event: AIEventResponse;
    onDecisionMade: (decision: 'YES' | 'NO') => void;
    aiDeciding: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, onDecisionMade, aiDeciding }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-md bg-stone-900 border-2 border-purple-500 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.4)] overflow-hidden flex flex-col transform transition-all scale-100">

                {/* Header */}
                <div className="bg-purple-900/50 p-4 border-b border-purple-600 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 uppercase tracking-widest font-mono shadow-sm">
                        Make A Choice
                    </h2>
                    <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_purple]"></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white leading-tight">{event.title}</h3>
                    <p className="text-gray-300 text-sm italic border-l-4 border-purple-500 pl-3">
                        "{event.description}"
                    </p>

                    <div className="grid grid-cols-1 gap-3 mt-4">
                        {/* Option A */}
                        <div className={`p-3 rounded-lg border ${aiDeciding ? 'border-gray-700 bg-gray-800' : 'border-green-500/50 bg-green-900/10'}`}>
                            <div className="text-xs text-gray-400 uppercase font-bold text-center mb-1">Choice A</div>
                            <div className="text-sm font-bold text-center text-green-200">{event.choices.yesLabel}</div>
                            <div className="text-[10px] text-center text-gray-500 mt-1">{event.choices.yesEffect}</div>
                        </div>

                        {/* Option B */}
                        <div className={`p-3 rounded-lg border ${aiDeciding ? 'border-gray-700 bg-gray-800' : 'border-red-500/50 bg-red-900/10'}`}>
                            <div className="text-xs text-gray-400 uppercase font-bold text-center mb-1">Choice B</div>
                            <div className="text-sm font-bold text-center text-red-200">{event.choices.noLabel}</div>
                            <div className="text-[10px] text-center text-gray-500 mt-1">{event.choices.noEffect}</div>
                        </div>
                    </div>
                </div>

                {/* Footer / AI Action */}
                <div className="bg-stone-950 p-4 border-t border-stone-800 flex justify-center items-center h-16">
                    {aiDeciding ? (
                        <div className="flex items-center gap-3 text-purple-400 font-mono text-sm animate-pulse">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></span>
                            AI Mayor is pondering logic...
                        </div>
                    ) : (
                        <div className="text-gray-500 text-xs font-mono">Waiting for AI...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventModal;
