
import React, { useState, useEffect, useCallback } from 'react';
import { PresentationData, AppStatus } from './types';
import { generatePresentation } from './services/geminiService';
import SlideRenderer from './components/SlideRenderer';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Loader2, 
  Presentation, 
  Layout, 
  Maximize2,
  Minimize2
} from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<PresentationData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startGeneration = async () => {
    setStatus(AppStatus.GENERATING);
    setError(null);
    try {
      const result = await generatePresentation("DALYs in Low Back Pain: Comprehensive Explanation and Global Impact");
      setData(result);
      setStatus(AppStatus.VIEWING);
      setCurrentIndex(0);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const nextSlide = useCallback(() => {
    if (data && currentIndex < data.slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [data, currentIndex]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== AppStatus.VIEWING) return;
    if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') setIsFullscreen(false);
  }, [status, nextSlide, prevSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isFullscreen ? 'bg-slate-900 overflow-hidden' : 'bg-slate-50'}`}>
      {/* Header - Hidden in Fullscreen */}
      {!isFullscreen && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Presentation className="text-white w-5 h-5" />
              </div>
              <h1 className="font-bold text-xl text-slate-900">DALY Master</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {status === AppStatus.VIEWING && (
                <button 
                  onClick={startGeneration}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              )}
              {status !== AppStatus.GENERATING && (
                <button 
                  onClick={startGeneration}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-md shadow-blue-200 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {status === AppStatus.IDLE ? 'Create Presentation' : 'Restart'}
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center ${isFullscreen ? 'h-screen p-0 max-w-none' : 'min-h-[calc(100vh-64px)]'}`}>
        
        {status === AppStatus.IDLE && (
          <div className="text-center max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Layout className="text-blue-600 w-10 h-10" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              The Burden of Low Back Pain
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Visualize Disability-Adjusted Life Years (DALYs) like never before. 
              Understand how years lived with disability impacts global populations.
            </p>
            <button 
              onClick={startGeneration}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-xl"
            >
              Generate Expert Presentation
            </button>
          </div>
        )}

        {status === AppStatus.GENERATING && (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900">Synthesizing GBD Insights</h3>
              <p className="text-slate-500">Calculating DALY metrics and building your slides...</p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center max-w-md">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="text-red-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Something went wrong</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={startGeneration}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === AppStatus.VIEWING && data && (
          <div className={`relative w-full ${isFullscreen ? 'h-full flex items-center justify-center' : 'max-w-5xl'}`}>
            <div className={`w-full ${isFullscreen ? 'h-full' : 'aspect-[16/9]'} slide-transition`}>
              <SlideRenderer slide={data.slides[currentIndex]} />
            </div>

            {/* Controls */}
            <div className={`flex items-center justify-between w-full mt-8 ${isFullscreen ? 'fixed bottom-8 px-12 z-50' : ''}`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-900 shadow-sm">
                  {currentIndex + 1} / {data.slides.length}
                </div>
                <button 
                  onClick={nextSlide}
                  disabled={currentIndex === data.slides.length - 1}
                  className="p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleFullscreen}
                  className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-2 font-medium"
                >
                  {isFullscreen ? (
                    <><Minimize2 className="w-5 h-5" /> Exit Fullscreen</>
                  ) : (
                    <><Maximize2 className="w-5 h-5" /> Fullscreen</>
                  )}
                </button>
              </div>
            </div>
            
            {/* Slide Previews - Desktop Only */}
            {!isFullscreen && (
              <div className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {data.slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`shrink-0 w-32 aspect-[16/9] rounded-lg border-2 transition-all p-2 overflow-hidden text-[8px] text-left relative ${
                      currentIndex === idx ? 'border-blue-600 bg-white shadow-lg' : 'border-slate-200 bg-slate-100 opacity-60'
                    }`}
                  >
                    <div className="font-bold mb-1 truncate">{s.title}</div>
                    <div className="h-1 w-8 bg-slate-300 rounded-full mb-1" />
                    <div className="h-1 w-12 bg-slate-200 rounded-full" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent CTA for generating new ones if IDLE */}
      {status === AppStatus.IDLE && (
        <footer className="fixed bottom-0 w-full py-6 border-t border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 flex justify-center">
            <p className="text-slate-500 text-sm">
              Powered by Gemini 3 Pro • GBD Study Data • Musculoskeletal Expert System
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
