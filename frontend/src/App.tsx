import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { SignUp } from '@/pages/SignUp';
import { Dashboard } from '@/pages/Dashboard';
import { Onboarding } from '@/pages/Onboarding';
import { LearningPathway } from '@/pages/LearningPathway';
import { SkillGap } from '@/pages/SkillGap';
import { Recommendations } from '@/pages/Recommendations';
import { ProgressTracker } from '@/pages/ProgressTracker';
import { Companion } from '@/pages/Companion';
import { Settings } from '@/pages/Settings';
import { applyTheme, getThemePreference } from '@/utils/dashboardStore';


function ProtectedOnboarding() {
  const { isAuthenticated } = useLearnMate();
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }
  return <Onboarding />;
}

const router = createBrowserRouter([
  // Public Landing & Marketing
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  // Public Authentication / Onboarding Initiation
  {
    path: '/signup',
    element: <SignUp />,
  },
  // Standalone Calibration Onboarding Flow
  {
    path: '/onboarding',
    element: <ProtectedOnboarding />,
  },
  // Protected Application Shell
  {
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/pathway',
        element: <LearningPathway />,
      },
      {
        path: '/skills',
        element: <SkillGap />,
      },
      {
        path: '/resources',
        element: <Recommendations />,
      },
      {
        path: '/recommendations',
        element: <Recommendations />,
      },
      {
        path: '/progress',
        element: <ProgressTracker />,
      },
      {
        path: '/companion',
        element: <Companion />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      // Fallback
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);

export default function App() {
  useEffect(() => {
    // 1. Initial theme application on boot
    const pref = getThemePreference();
    applyTheme(pref);

    // 2. Listen to OS system dark mode toggle when system theme is selected
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (getThemePreference() === 'system') {
        applyTheme('system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  return <RouterProvider router={router} />;
}
