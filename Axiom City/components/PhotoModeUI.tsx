
import React, { useRef, useState, useEffect } from 'react';
import { CityStats } from '../types';

interface PhotoModeUIProps {
    stats: CityStats;
    onExit: () => void;
}

export const PhotoModeUI: React.FC<PhotoModeUIProps> = ({ stats, onExit }) => {
    const [snapshot, setSnapshot] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleCapture = () => {
        setIsCapturing(true);
        setTimeout(() => {
            // R3F puts the ID on the wrapper div, so we need to find the canvas inside it
            const container = document.getElementById('game-canvas');
            const canvas = (container?.querySelector('canvas') || document.querySelector('canvas')) as HTMLCanvasElement;

            if (!canvas || typeof canvas.toDataURL !== 'function') {
                console.error("Capture failed: Canvas not found");
                setIsCapturing(false);
                alert("Failed to capture city. Canvas not found.");
                return;
            }

            // 1. Capture the game canvas
            const gameDataUrl = canvas.toDataURL('image/png');

            const img = new Image();
            img.onload = () => {
                // 2. Create a high-res capture canvas for the "post-card"
                const finalCanvas = document.createElement('canvas');
                const ctx = finalCanvas.getContext('2d');
                if (!ctx) return;

                const padding = 100;
                // Use the image dimensions (which are the canvas buffer dimensions)
                finalCanvas.width = img.width + padding;
                finalCanvas.height = img.height + padding + 180; // Extra space for stats

                // Background
                ctx.fillStyle = '#0f172a'; // slate-900
                ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

                // Draw game screenshot centered
                ctx.drawImage(img, padding / 2, padding / 2, img.width, img.height);

                // Draw Border
                ctx.strokeStyle = '#0ea5e9'; // sky-500
                ctx.lineWidth = 6;
                ctx.strokeRect(padding / 2, padding / 2, img.width, img.height);

                // Title
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${Math.floor(img.width * 0.05)}px Inter, sans-serif`;
                ctx.fillText(`Axiom City: ${stats.activePlanet}`, padding / 2, img.height + padding + 60);

                // Stats
                ctx.font = `${Math.floor(img.width * 0.02)}px JetBrains Mono, monospace`;
                ctx.fillStyle = '#94a3b8'; // slate-400
                ctx.fillText(`Day ${stats.day} | Pop: ${stats.population.toLocaleString()} | Happiness: ${Math.round(stats.happiness)}%`, padding / 2, img.height + padding + 120);

                // Footer
                ctx.font = `italic ${Math.floor(img.width * 0.015)}px Inter, sans-serif`;
                ctx.fillStyle = '#334155'; // slate-700
                ctx.textAlign = 'right';
                ctx.fillText('Project Overmind - City Archives', finalCanvas.width - padding / 2, finalCanvas.height - 30);

                const finalDataUrl = finalCanvas.toDataURL('image/png');
                setSnapshot(finalDataUrl);
                setIsCapturing(false);
            };
            img.src = gameDataUrl;
        }, 100);
    };

    const downloadSnapshot = () => {
        if (!snapshot) return;
        const link = document.createElement('a');
        link.download = `AxiomCity_Day${stats.day}.png`;
        link.href = snapshot;
        link.click();
    };

    return (
        <div className="absolute inset-0 z-[100] flex flex-col pointer-events-none overflow-hidden">
            {/* Minimal Controls */}
            {!snapshot ? (
                <div className="flex justify-between p-8 pointer-events-auto">
                    <button
                        onClick={onExit}
                        className="bg-slate-900/80 text-white px-6 py-3 rounded-full border-2 border-slate-700 hover:bg-slate-800 transition-all font-bold uppercase tracking-widest text-sm"
                    >
                        ⬅ Exit Photo Mode
                    </button>
                    {!isCapturing && (
                        <button
                            onClick={handleCapture}
                            className="bg-sky-600 text-white px-10 py-4 rounded-full border-4 border-sky-400 shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:bg-sky-500 transition-all font-black uppercase tracking-[0.2em] text-lg animate-pulse"
                        >
                            📸 SNAPSHOT
                        </button>
                    )}
                </div>
            ) : (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-12 pointer-events-auto backdrop-blur-xl animate-fade-in">
                    <div className="max-w-5xl w-full flex flex-col items-center gap-8">
                        <div className="text-3xl font-black text-sky-400 uppercase tracking-[0.3em] mb-4">ARCHIVE RECORD SECURED</div>
                        <img src={snapshot} className="max-h-[70vh] rounded-xl border-4 border-sky-500 shadow-2xl shadow-sky-500/20" alt="Snapshot Preview" />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setSnapshot(null)}
                                className="bg-slate-800 text-slate-300 px-8 py-3 rounded-xl border border-slate-600 hover:bg-slate-700 font-bold uppercase"
                            >
                                Discard
                            </button>
                            <button
                                onClick={downloadSnapshot}
                                className="bg-green-600 text-white px-10 py-3 rounded-xl border-2 border-green-400 hover:bg-green-500 font-bold uppercase flex items-center gap-2"
                            >
                                💾 Download Image
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`Check out my city in Axiom City! Day ${stats.day}, Pop: ${stats.population}. Play at city.hindley.tech`);
                                    alert('Stats copied to clipboard! (Image sharing coming soon)');
                                }}
                                className="bg-indigo-600 text-white px-10 py-3 rounded-xl border-2 border-indigo-400 hover:bg-indigo-500 font-bold uppercase flex items-center gap-2"
                            >
                                🔗 Share Run
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Viewfinder Overlay */}
            {!snapshot && (
                <div className="absolute inset-0 border-[60px] border-black/40 flex items-center justify-center pointer-events-none">
                    <div className="w-[80vw] h-[70vh] border-2 border-white/20 relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/60"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/60"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/60"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/60"></div>

                        {/* Recording status */}
                        <div className="absolute top-4 left-6 flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-white text-xs font-mono font-bold tracking-widest opacity-80 uppercase">Rec: Capture Sequence</span>
                        </div>

                        <div className="absolute bottom-4 right-6 text-white text-[10px] font-mono opacity-50 uppercase tracking-widest">
                            {new Date().toISOString()} | NODE_CAPTURE_INIT
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
