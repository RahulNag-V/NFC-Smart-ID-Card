import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { OwnerEditorProvider } from './context/OwnerEditorContext';
import { PublicPortfolioView } from './components/public/PublicPortfolioView';
import { OwnerLogin } from './components/owner/OwnerLogin';
import { OwnerDashboard } from './components/owner/OwnerDashboard';

type AppRoute = 'public' | 'owner-login' | 'owner-dashboard';

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return 'public';

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

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

  return 'public';
}

function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const { isOwner, loading: authLoading } = useAuth();

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

  // Route 2: Owner Dashboard (Protected)
  if (currentRoute === 'owner-dashboard') {
    if (!authLoading && !isOwner) {
      // Unauthorized or not logged in: redirect to owner login
      return (
        <OwnerLogin
          onLoginSuccess={() => navigateTo('owner-dashboard')}
          onNavigatePublic={() => navigateTo('public')}
        />
      );
    }

    return (
      <OwnerEditorProvider>
        <OwnerDashboard
          onNavigatePublic={() => navigateTo('public')}
          onLogout={() => navigateTo('owner-login')}
        />
      </OwnerEditorProvider>
    );
  }

  // Route 3: Public Read-Only Portfolio
  return (
    <PublicPortfolioView
      onNavigateOwnerLogin={() => navigateTo('owner-login')}
      onNavigateOwnerDashboard={() => navigateTo('owner-dashboard')}
    />
  );
}

export function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <AppRouter />
      </SiteContentProvider>
    </AuthProvider>
  );
}

export default App;
