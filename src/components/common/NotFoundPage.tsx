import React, { useEffect } from 'react';
import { Home, Shield, Compass, ArrowLeft } from 'lucide-react';
import { CollegeEmblem } from '../id-card/CollegeEmblem';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateLogin?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
}) => {
  useEffect(() => {
    document.title = '404 Page Not Found • Ananta Sparsha Digital ID';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'The requested digital ID route or page could not be found. Return to the official Smart ID profile.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#fbf8f3] text-[#2b241e] font-serif flex flex-col justify-between selection:bg-[#704a29]/20 selection:text-[#704a29]">
      {/* Top Simple Header */}
      <header className="h-16 border-b border-[#d9cdbd] bg-[#fffefb]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <CollegeEmblem size={34} />
          <div>
            <span className="block text-xs sm:text-sm font-bold font-serif uppercase tracking-tight text-[#2b241e] group-hover:text-[#704a29] transition-colors leading-tight">
              Ananta Sparsha
            </span>
            <span className="block text-[8.5px] sm:text-[9.5px] font-mono text-[#73685c] tracking-wider">
              SMART DIGITAL IDENTITY
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateHome}
          className="text-xs font-sans font-medium text-[#704a29] hover:text-[#593a1f] flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#f0eae1] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to ID Card</span>
        </button>
      </header>

      {/* Main 404 Hero Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full bg-[#fffefb] border border-[#d9cdbd] rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6">
          {/* Visual Icon Badge */}
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-2xl bg-[#f5ede2] border border-[#d9cdbd] text-[#704a29] mx-auto flex items-center justify-center shadow-xs">
              <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '24s' }} />
            </div>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#bc473b] text-white text-[10px] font-bold font-mono shadow-xs">
              404
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704a29] font-mono">
              HTTP 404 &bull; ROUTE NOT FOUND
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2b241e]">
              Destination Unavailable
            </h1>
            <p className="text-xs sm:text-sm text-[#73685c] leading-relaxed pt-1">
              The digital portfolio page, resource, or NFC record you are seeking does not exist or has been relocated.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e2d8cb] text-left text-xs font-mono space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#73685c]">
              Requested Path:
            </span>
            <p className="text-[#704a29] font-semibold truncate">
              {typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/404'}
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-sans">
            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#704a29] hover:bg-[#593a1f] active:scale-[0.98] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition focus-visible:ring-2 focus-visible:ring-amber-900/30"
            >
              <Home className="w-4 h-4" />
              <span>Return to Digital ID</span>
            </button>

            {onNavigateLogin && (
              <button
                type="button"
                onClick={onNavigateLogin}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] active:scale-[0.98] border border-[#d9cdbd] text-xs font-semibold text-[#2b241e] shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition focus-visible:ring-2 focus-visible:ring-amber-900/30"
              >
                <Shield className="w-4 h-4 text-[#704a29]" />
                <span>Owner Sign In</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-[#d9cdbd] bg-[#fffefb]/60 px-4 flex items-center justify-center text-[11px] text-[#73685c]">
        <span>&copy; {new Date().getFullYear()} Rahul Nag V &bull; Bangalore Technological Institute</span>
      </footer>
    </div>
  );
};

export default NotFoundPage;
