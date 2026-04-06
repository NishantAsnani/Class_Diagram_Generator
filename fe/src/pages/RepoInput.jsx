// fe/pages/RepoInput.jsx
import { useState, useEffect } from "react";
import DiagramViewer from "./DiagramViewer";

export default function RepoInput() {
    const [repoUrl, setRepoUrl] = useState("");
    const [diagramData, setDiagramData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (loading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 8;
                });
            }, 400);
        } else {
            setProgress(100);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleGenerate = async () => {
        if (!repoUrl.trim()) return;
        setLoading(true);
        setError(null);
        setDiagramData(null);

        try {
            const res = await fetch("http://localhost:3000/api/repo/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setDiagramData(data);
        } catch (err) {
            setError(err.message || "Failed to analyze repository.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleGenerate();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-mono overflow-x-hidden">
            {/* Grid background */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-xs tracking-widest uppercase mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        UML Class Diagram Generator
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-tight mb-4">
                        Visualize Any<br />
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            Codebase
                        </span>
                    </h1>
                    <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                        Paste a GitHub repository URL and generate an interactive class diagram in seconds.
                    </p>
                </div>

                {/* Input card */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-4 backdrop-blur-sm">
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">
                        Repository URL
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            {/* Git icon */}
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm select-none">
                                ⎇
                            </span>
                            <input
                                type="text"
                                placeholder="https://github.com/owner/repo"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60 focus:bg-black/60 transition-all duration-200 disabled:opacity-50"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !repoUrl.trim()}
                            className="relative px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
                            style={{
                                background: loading
                                    ? "rgba(99,102,241,0.3)"
                                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                boxShadow: loading ? "none" : "0 0 30px rgba(99,102,241,0.3)",
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="20 60" />
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Generate
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Progress bar */}
                    {loading && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-white/30 mb-1.5">
                                <span>Cloning & analyzing repository...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Error state */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm flex items-start gap-3 mb-6">
                        <span className="text-base mt-0.5">⚠</span>
                        <div>
                            <p className="font-semibold mb-0.5">Analysis failed</p>
                            <p className="text-red-400/70 text-xs">{error}</p>
                        </div>
                    </div>
                )}

                {/* Diagram output */}
                {diagramData && !loading && (
                    <div className="mt-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Diagram generated — {diagramData.classes?.length ?? 0} classes found
                            </div>
                            <button
                                onClick={() => setDiagramData(null)}
                                className="text-white/20 hover:text-white/50 text-xs transition-colors"
                            >
                                Clear ✕
                            </button>
                        </div>
                        <DiagramViewer data={diagramData} />
                    </div>
                )}
            </div>
        </div>
    );
}