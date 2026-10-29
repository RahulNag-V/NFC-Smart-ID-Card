import React from 'react';
import { CollegeEmblem } from './CollegeEmblem';
import { FolderGit2, Mail, Menu, X, Pencil } from 'lucide-react';
import { defaultStudentData } from '../../data/student';

interface CollegeNavbarProps {
  activeTab: 'home' | 'works' | 'contact';
  onSelectTab: (tab: 'home' | 'works' | 'contact') => void;
  onEdit?: () => void;
}

export const CollegeNavbar: React.FC<CollegeNavbarProps> = ({
  activeTab,
  onSelectTab,
  onEdit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fffefb]/95 backdrop-blur-md border-b border-[#d9cdbd] text-[#2b241e] print:hidden shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* College Brand & Seal */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform">
            <CollegeEmblem size={38} className="sm:w-[44px] sm:h-[44px]" />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] sm:text-[13px] font-serif font-bold uppercase tracking-tight text-[#2b241e] group-hover:text-[#704a29] transition-colors leading-tight truncate">
              Bangalore Technological Institute
            </span>
            <span className="block text-[8px] sm:text-[9.5px] font-mono font-bold text-[#704a29] tracking-wider truncate">
              STUDENT IDENTITY SYSTEM &bull; VTU RECOGNIZED
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#704a29] text-[#fffefb] font-bold shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]'
            }`}
          >
            Digital Student ID
          </button>

          <a
            href="#student-profile"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                onSelectTab('home');
                setTimeout(() => {
                  document.getElementById('student-profile')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3.5 py-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition-colors cursor-pointer"
          >
            Profile
          </a>

          <a
            href="#academic-details"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                onSelectTab('home');
                setTimeout(() => {
                  document.getElementById('academic-details')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3.5 py-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition-colors cursor-pointer"
          >
            Academics
          </a>

          <a
            href="#verification"
            onClick={(e) => {
              if (activeTab !== 'home') {
                e.preventDefault();
                onSelectTab('home');
                setTimeout(() => {
                  document.getElementById('verification')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3.5 py-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition-colors cursor-pointer"
          >
            Verification
          </a>

          <button
            type="button"
            onClick={() => onSelectTab('works')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'works'
                ? 'bg-[#704a29] text-[#fffefb] font-bold shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Engineering Works</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('contact')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'bg-[#704a29] text-[#fffefb] font-bold shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </nav>

        {/* Student Quick Pill (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#d9cdbd]">
          <div className="text-right">
            <span className="block text-xs font-bold text-[#2b241e] leading-tight">
              {defaultStudentData.fullName}
            </span>
            <span className="block text-[10px] font-mono font-bold text-[#704a29]">
              USN: {defaultStudentData.usn}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#704a29] text-[#fffefb] font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {defaultStudentData.fullName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg bg-[#f0eae1] text-[#2b241e] hover:bg-[#e6dcce] transition-colors focus:outline-none border border-[#d9cdbd]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fffefb] border-t border-[#d9cdbd] px-4 py-3 space-y-1.5 shadow-md">
          <button
            type="button"
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'home' ? 'bg-[#704a29] text-[#fffefb]' : 'text-[#2b241e] hover:bg-[#f0eae1]'
            }`}
          >
            Digital Student ID
          </button>
          <a
            href="#student-profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-medium text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]"
          >
            Profile Details
          </a>
          <a
            href="#academic-details"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-medium text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]"
          >
            Academic Details
          </a>
          <a
            href="#contact-details"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-medium text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]"
          >
            Contact &amp; Privacy
          </a>
          <a
            href="#verification"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-medium text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]"
          >
            Verification Protocol
          </a>
          <button
            type="button"
            onClick={() => {
              onSelectTab('works');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'works' ? 'bg-[#704a29] text-[#fffefb]' : 'text-[#2b241e] hover:bg-[#f0eae1]'
            }`}
          >
            Selected Works &bull; Projects (7)
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('contact');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'contact' ? 'bg-[#704a29] text-[#fffefb]' : 'text-[#2b241e] hover:bg-[#f0eae1]'
            }`}
          >
            Direct Inquiries &bull; Contact
          </button>
        </div>
      )}
    </header>
  );
};
