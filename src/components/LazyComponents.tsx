import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-primary" />
  </div>
);

// Lazy load heavy components with TS workaround
export const LazyPlaylistInsights = lazy(() =>
  import('./visualization/PlaylistInsights').then(module => ({ default: module.PlaylistInsights as unknown as React.ComponentType }))
);

export const LazyEnhancedFailedTracksModal = lazy(() =>
  import('./EnhancedFailedTracksModal').then(module => ({ default: module.EnhancedFailedTracksModal as unknown as React.ComponentType }))
);

export const LazySuccessCelebration = lazy(() =>
  import('./feedback/SuccessCelebration').then(module => ({ default: module.SuccessCelebration as unknown as React.ComponentType }))
);

export const LazyToastContainer = lazy(() =>
  import('./feedback/EnhancedToast').then(module => ({ default: module.ToastContainer as unknown as React.ComponentType }))
);

// Lazy load utility components
export const LazyParticleField = lazy(() =>
  import('./ui/ParticleField').then(module => ({ default: module.ParticleField as unknown as React.ComponentType }))
);

export const LazyGlassmorphicCard = lazy(() =>
  import('./ui/GlassmorphicCard').then(module => ({ default: module.GlassmorphicCard as unknown as React.ComponentType }))
);

export const LazyGlowButton = lazy(() =>
  import('./ui/GlowButton').then(module => ({ default: module.GlowButton as unknown as React.ComponentType }))
);

// Wrapper component for lazy loading
export const LazyComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
); 