import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Onboarding } from '@/pages/Onboarding';
import { LearningPathway } from '@/pages/LearningPathway';
import { SkillGap } from '@/pages/SkillGap';
import { Recommendations } from '@/pages/Recommendations';
import { ProgressTracker } from '@/pages/ProgressTracker';
import { Companion } from '@/pages/Companion';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Onboarding /> },
      { path: '/pathway', element: <LearningPathway /> },
      { path: '/skills', element: <SkillGap /> },
      { path: '/recommendations', element: <Recommendations /> },
      { path: '/progress', element: <ProgressTracker /> },
      { path: '/companion', element: <Companion /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
