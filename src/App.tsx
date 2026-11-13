import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { OwnerEditorProvider } from './context/OwnerEditorContext';
import { PublicPortfolioView } from './components/public/PublicPortfolioView';
import { OwnerLogin } from './components/owner/OwnerLogin';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { NotFoundPage } from './components/common/NotFoundPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

type AppRoute = 'public' | 'owner-login' | 'owner-dashboard' | 'owner-security' | 'not-found';

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return 'public';

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (
    path === '/owner/security' ||
    path === '/owner/security/' ||
    hash === '#/owner/security' ||
    search.includes('mode=owner-security')
  ) {
    return 'owner-security';
  }

  if (
    path === '/owner/login' ||
    path === '/owner/login/' ||
    hash === '#/owner/login' ||
    search.includes('mode=owner-login')
  ) {
    return 'owner-login';
  }

  if (
    path === '/owner/dashboard' ||
    path === '/owner/dashboard/' ||
    hash === '#/owner/dashboard' ||
    search.includes('mode=owner-dashboard')
  ) {
    return 'owner-dashboard';
  }

  // Root or valid section anchor hashes on public page
  const isRootPath = path === '/' || path === '' || path === '/index.html';
  if (
    isRootPath &&
    (hash === '' ||
      hash === '#/' ||
      hash === '#' ||
      hash.startsWith('#student-profile') ||
      hash.startsWith('#academic-details') ||
      hash.startsWith('#verification') ||
      hash.startsWith('#nfc') ||
      hash.startsWith('#verify'))
  ) {
    return 'public';
  }

  if (hash.startsWith('#student-profile') || hash.startsWith('#academic-details') || hash.startsWith('#verification')) {
    return 'public';
  }

  return 'not-found';

  return 'not-found';
}

function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const { isOwner, loading: authLoading } = useAuth();

  // Dynamic SEO metadata updates per route
  useEffect(() => {
    let title = 'Digital Student ID • Rahul Nag V (24CS051) | Bangalore Technological Institute';
    let description =
      'Official Digital Student Identity Card and verified academic profile for Rahul Nag V (USN: 24CS051), Department of Computer Science & Engineering, Bangalore Technological Institute.';

    if (currentRoute === 'owner-login') {
      title = 'Owner Sign In • Ananta Sparsha Digital ID Console';
      description =
        'Secure administrative sign-in for Rahul Nag V to manage verified Smart ID parameters and credentials.';
    } else if (currentRoute === 'owner-dashboard') {
      title = 'Owner Console • Ananta Sparsha Smart ID Management';
      description =
        'Administrative portal to configure profile modules, appearance, academic transcripts, and live credentials.';
    } else if (currentRoute === 'owner-security') {
      title = 'Security & OTP Access Controls • Ananta Sparsha Console';
      description =
        'Cryptographic governance, phone MFA authentication, password updates, and session management.';
    } else if (currentRoute === 'not-found') {
      title = '404 Page Not Found • Ananta Sparsha Digital ID';
      description = 'The requested digital ID page or resource could not be found.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [currentRoute]);

  // Listen for browser forward/back buttons and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getInitialRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: AppRoute) => {
    let targetPath = '/';
    if (route === 'owner-login') targetPath = '/owner/login';
    if (route === 'owner-dashboard') targetPath = '/owner/dashboard';
    if (route === 'owner-security') targetPath = '/owner/security';
    if (route === 'not-found') targetPath = '/404';

    // Support both pushState and hash fallback for static hosting
    try {
      window.history.pushState({ route }, '', targetPath);
    } catch {
      window.location.hash = targetPath;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Route 1: Owner Login
  if (currentRoute === 'owner-login') {
    return (
      <OwnerLogin
        onLoginSuccess={() => navigateTo('owner-dashboard')}
        onNavigatePublic={() => navigateTo('public')}
      />
    );
  }

  // Route 2 & 3: Owner Dashboard & Owner Security (Protected)
  if (currentRoute === 'owner-dashboard' || currentRoute === 'owner-security') {
    if (!authLoading && !isOwner) {
      // Unauthorized or not logged in: redirect to owner login
      return (
        <OwnerLogin
          onLoginSuccess={() => navigateTo(currentRoute === 'owner-security' ? 'owner-security' : 'owner-dashboard')}
          onNavigatePublic={() => navigateTo('public')}
        />
      );
    }

    return (
      <OwnerEditorProvider initialTab={currentRoute === 'owner-security' ? 'security' : 'overview'}>
        <OwnerDashboard
          onNavigatePublic={() => navigateTo('public')}
          onLogout={() => navigateTo('owner-login')}
        />
      </OwnerEditorProvider>
    );
  }

  // Route 4: Custom 404 Not Found Page
  if (currentRoute === 'not-found') {
    return (
      <NotFoundPage
        onNavigateHome={() => navigateTo('public')}
        onNavigateLogin={() => navigateTo('owner-login')}
      />
    );
  }

  // Route 5: Public Read-Only Portfolio
  return (
    <PublicPortfolioView
      onNavigateOwnerLogin={() => navigateTo('owner-login')}
      onNavigateOwnerDashboard={() => navigateTo('owner-dashboard')}
    />
  );
}

export function App() {
  return (
    <ErrorBoundary fallbackTitle="Ananta Sparsha Experience Loader">
      <AuthProvider>
        <SiteContentProvider>
          <AppRouter />
        </SiteContentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
