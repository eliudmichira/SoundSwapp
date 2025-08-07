import { useState, useEffect, useCallback } from 'react';

interface ViewportInfo {
  width: number;
  height: number;
  aspectRatio: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
  availableHeight: number;
  availableWidth: number;
  scrollbarWidth: number;
  devicePixelRatio: number;
  orientation: 'landscape' | 'portrait';
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

interface ViewportAnalysis {
  viewport: ViewportInfo;
  contentArea: {
    headerHeight: number;
    bottomNavHeight: number;
    availableContentHeight: number;
    contentPadding: number;
    scrollableHeight: number;
  };
  recommendations: {
    shouldUseCompactLayout: boolean;
    shouldReduceAnimations: boolean;
    shouldOptimizeForTouch: boolean;
    recommendedFontSize: number;
    recommendedSpacing: number;
  };
}

export const useViewportAnalysis = (): ViewportAnalysis => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    aspectRatio: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    isPortrait: false,
    safeAreaTop: 0,
    safeAreaBottom: 0,
    safeAreaLeft: 0,
    safeAreaRight: 0,
    availableHeight: 0,
    availableWidth: 0,
    scrollbarWidth: 0,
    devicePixelRatio: 1,
    orientation: 'portrait',
    breakpoint: 'md'
  });

  const getScrollbarWidth = useCallback(() => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }, []);

  const getSafeAreaInsets = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('--sat') || '0'),
      bottom: parseInt(style.getPropertyValue('--sab') || '0'),
      left: parseInt(style.getPropertyValue('--sal') || '0'),
      right: parseInt(style.getPropertyValue('--sar') || '0')
    };
  }, []);

  const getBreakpoint = useCallback((width: number): ViewportInfo['breakpoint'] => {
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  }, []);

  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const orientation = width > height ? 'landscape' : 'portrait';
    const safeAreas = getSafeAreaInsets();
    const scrollbarWidth = getScrollbarWidth();

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    const isLandscape = orientation === 'landscape';
    const isPortrait = orientation === 'portrait';

    setViewport({
      width,
      height,
      aspectRatio,
      isMobile,
      isTablet,
      isDesktop,
      isLandscape,
      isPortrait,
      safeAreaTop: safeAreas.top,
      safeAreaBottom: safeAreas.bottom,
      safeAreaLeft: safeAreas.left,
      safeAreaRight: safeAreas.right,
      availableHeight: height - safeAreas.top - safeAreas.bottom,
      availableWidth: width - safeAreas.left - safeAreas.right,
      scrollbarWidth,
      devicePixelRatio: window.devicePixelRatio || 1,
      orientation,
      breakpoint: getBreakpoint(width)
    });
  }, [getSafeAreaInsets, getScrollbarWidth, getBreakpoint]);

  useEffect(() => {
    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, [updateViewport]);

  // Calculate content area dimensions
  const contentArea = {
    headerHeight: viewport.isMobile ? 60 : 80,
    bottomNavHeight: viewport.isMobile ? 80 : 100,
    availableContentHeight: viewport.availableHeight - (viewport.isMobile ? 140 : 180),
    contentPadding: viewport.isMobile ? 16 : 24,
    scrollableHeight: viewport.availableHeight - (viewport.isMobile ? 140 : 180) - 32 // 32px for padding
  };

  // Generate recommendations based on viewport
  const recommendations = {
    shouldUseCompactLayout: viewport.isMobile || viewport.aspectRatio < 0.8,
    shouldReduceAnimations: viewport.devicePixelRatio > 2 || viewport.width < 375,
    shouldOptimizeForTouch: viewport.isMobile || viewport.width < 1024,
    recommendedFontSize: viewport.isMobile ? 14 : 16,
    recommendedSpacing: viewport.isMobile ? 8 : 12
  };

  return {
    viewport,
    contentArea,
    recommendations
  };
};

// Hook for logging viewport information
export const useViewportLogger = () => {
  const viewportAnalysis = useViewportAnalysis();

  useEffect(() => {
    console.log('🔍 Viewport Analysis:', {
      dimensions: `${viewportAnalysis.viewport.width}x${viewportAnalysis.viewport.height}`,
      aspectRatio: viewportAnalysis.viewport.aspectRatio.toFixed(2),
      orientation: viewportAnalysis.viewport.orientation,
      device: viewportAnalysis.viewport.isMobile ? 'Mobile' : viewportAnalysis.viewport.isTablet ? 'Tablet' : 'Desktop',
      breakpoint: viewportAnalysis.viewport.breakpoint,
      safeAreas: {
        top: viewportAnalysis.viewport.safeAreaTop,
        bottom: viewportAnalysis.viewport.safeAreaBottom,
        left: viewportAnalysis.viewport.safeAreaLeft,
        right: viewportAnalysis.viewport.safeAreaRight
      },
      contentArea: viewportAnalysis.contentArea,
      recommendations: viewportAnalysis.recommendations
    });
  }, [viewportAnalysis]);

  return viewportAnalysis;
}; 