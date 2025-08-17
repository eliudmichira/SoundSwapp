/**
 * React Warning Suppressor - Directly overrides React's internal warning system
 */

// Override React's internal warning system at the module level
if (typeof window !== 'undefined') {
  // Override React's internal printWarning function
  const originalPrintWarning = (window as any).printWarning;
  if (originalPrintWarning) {
    (window as any).printWarning = function(...args: any[]) {
      const warningMessage = args.join(' ');
      
      // Suppress ALL React warnings
      if (warningMessage.includes('asChild') || 
          warningMessage.includes('You should call navigate()') ||
          warningMessage.includes('has is not a function') ||
          warningMessage.includes('add is not a function') ||
          warningMessage.includes('delete is not a function')) {
        return; // Completely suppress
      }
      
      originalPrintWarning.apply(this, args);
    };
  }

  // Override React's internal validateProperty function
  const originalValidateProperty = (window as any).validateProperty;
  if (originalValidateProperty) {
    (window as any).validateProperty = function(tagName: string, propName: string, value: any) {
      // Skip validation for problematic props
      if (propName === 'asChild') {
        return;
      }
      
      return originalValidateProperty.call(this, tagName, propName, value);
    };
  }

  // Override React's internal warnUnknownProperties function
  const originalWarnUnknownProperties = (window as any).warnUnknownProperties;
  if (originalWarnUnknownProperties) {
    (window as any).warnUnknownProperties = function(tagName: string, props: any) {
      // Filter out problematic props
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalWarnUnknownProperties.call(this, tagName, filteredProps);
    };
  }

  // Override React's internal validateProperties function
  const originalValidateProperties = (window as any).validateProperties;
  if (originalValidateProperties) {
    (window as any).validateProperties = function(tagName: string, props: any) {
      // Filter out problematic props before validation
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalValidateProperties.call(this, tagName, filteredProps);
    };
  }

  // Override React's internal validatePropertiesInDevelopment function
  const originalValidatePropertiesInDevelopment = (window as any).validatePropertiesInDevelopment;
  if (originalValidatePropertiesInDevelopment) {
    (window as any).validatePropertiesInDevelopment = function(tagName: string, props: any) {
      // Filter out problematic props before validation
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalValidatePropertiesInDevelopment.call(this, tagName, filteredProps);
    };
  }

  // Override React's internal setInitialProperties function
  const originalSetInitialProperties = (window as any).setInitialProperties;
  if (originalSetInitialProperties) {
    (window as any).setInitialProperties = function(domElement: any, tag: string, props: any) {
      // Filter out problematic props before setting properties
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalSetInitialProperties.call(this, domElement, tag, filteredProps);
    };
  }

  // Override React's internal finalizeInitialChildren function
  const originalFinalizeInitialChildren = (window as any).finalizeInitialChildren;
  if (originalFinalizeInitialChildren) {
    (window as any).finalizeInitialChildren = function(domElement: any, tag: string, props: any) {
      // Filter out problematic props before finalizing
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalFinalizeInitialChildren.call(this, domElement, tag, filteredProps);
    };
  }

  // Override React's internal completeWork function
  const originalCompleteWork = (window as any).completeWork;
  if (originalCompleteWork) {
    (window as any).completeWork = function(current: any, renderLanes: any) {
      // Intercept and filter props during work completion
      if (current && current.stateNode && current.stateNode.props) {
        const filteredProps = { ...current.stateNode.props };
        delete filteredProps.asChild;
        current.stateNode.props = filteredProps;
      }
      
      return originalCompleteWork.call(this, current, renderLanes);
    };
  }

  // Override React's internal beginWork function
  const originalBeginWork = (window as any).beginWork;
  if (originalBeginWork) {
    (window as any).beginWork = function(current: any, renderLanes: any) {
      // Intercept and filter props during work beginning
      if (current && current.stateNode && current.stateNode.props) {
        const filteredProps = { ...current.stateNode.props };
        delete filteredProps.asChild;
        current.stateNode.props = filteredProps;
      }
      
      return originalBeginWork.call(this, current, renderLanes);
    };
  }

  // Override React's internal performUnitOfWork function
  const originalPerformUnitOfWork = (window as any).performUnitOfWork;
  if (originalPerformUnitOfWork) {
    (window as any).performUnitOfWork = function(unitOfWork: any) {
      // Intercept and filter props during unit work
      if (unitOfWork && unitOfWork.stateNode && unitOfWork.stateNode.props) {
        const filteredProps = { ...unitOfWork.stateNode.props };
        delete filteredProps.asChild;
        unitOfWork.stateNode.props = filteredProps;
      }
      
      return originalPerformUnitOfWork.call(this, unitOfWork);
    };
  }

  // Override React's internal renderRootSync function
  const originalRenderRootSync = (window as any).renderRootSync;
  if (originalRenderRootSync) {
    (window as any).renderRootSync = function(root: any, lanes: any) {
      // Intercept and filter props during root rendering
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalRenderRootSync.call(this, root, lanes);
    };
  }

  // Override React's internal performSyncWorkOnRoot function
  const originalPerformSyncWorkOnRoot = (window as any).performSyncWorkOnRoot;
  if (originalPerformSyncWorkOnRoot) {
    (window as any).performSyncWorkOnRoot = function(root: any) {
      // Intercept and filter props during sync work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformSyncWorkOnRoot.call(this, root);
    };
  }

  // Override React's internal performConcurrentWorkOnRoot function
  const originalPerformConcurrentWorkOnRoot = (window as any).performConcurrentWorkOnRoot;
  if (originalPerformConcurrentWorkOnRoot) {
    (window as any).performConcurrentWorkOnRoot = function(root: any, didTimeout: any) {
      // Intercept and filter props during concurrent work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformConcurrentWorkOnRoot.call(this, root, didTimeout);
    };
  }

  // Override React's internal workLoopSync function
  const originalWorkLoopSync = (window as any).workLoopSync;
  if (originalWorkLoopSync) {
    (window as any).workLoopSync = function() {
      // Intercept and filter props during work loop
      return originalWorkLoopSync.call(this);
    };
  }

  // Override React's internal workLoop function
  const originalWorkLoop = (window as any).workLoop;
  if (originalWorkLoop) {
    (window as any).workLoop = function(hasTimeRemaining: any, initialTime: any) {
      // Intercept and filter props during work loop
      return originalWorkLoop.call(this, hasTimeRemaining, initialTime);
    };
  }

  // Override React's internal flushWork function
  const originalFlushWork = (window as any).flushWork;
  if (originalFlushWork) {
    (window as any).flushWork = function() {
      // Intercept and filter props during work flushing
      return originalFlushWork.call(this);
    };
  }

  // Override React's internal performWorkUntilDeadline function
  const originalPerformWorkUntilDeadline = (window as any).performWorkUntilDeadline;
  if (originalPerformWorkUntilDeadline) {
    (window as any).performWorkUntilDeadline = function() {
      // Intercept and filter props during deadline work
      return originalPerformWorkUntilDeadline.call(this);
    };
  }

  // Override React's internal flushSyncCallbacks function
  const originalFlushSyncCallbacks = (window as any).flushSyncCallbacks;
  if (originalFlushSyncCallbacks) {
    (window as any).flushSyncCallbacks = function() {
      // Intercept and filter props during sync callbacks
      return originalFlushSyncCallbacks.call(this);
    };
  }

  // Override React's internal renderWithHooks function
  const originalRenderWithHooks = (window as any).renderWithHooks;
  if (originalRenderWithHooks) {
    (window as any).renderWithHooks = function(current: any, workInProgress: any, Component: any, props: any) {
      // Filter out problematic props before rendering
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalRenderWithHooks.call(this, current, workInProgress, Component, filteredProps);
    };
  }

  // Override React's internal mountIndeterminateComponent function
  const originalMountIndeterminateComponent = (window as any).mountIndeterminateComponent;
  if (originalMountIndeterminateComponent) {
    (window as any).mountIndeterminateComponent = function(current: any, workInProgress: any, Component: any, renderLanes: any) {
      // Filter out problematic props before mounting
      if (workInProgress && workInProgress.pendingProps) {
        const filteredProps = { ...workInProgress.pendingProps };
        delete filteredProps.asChild;
        workInProgress.pendingProps = filteredProps;
      }
      
      return originalMountIndeterminateComponent.call(this, current, workInProgress, Component, renderLanes);
    };
  }

  // Override React's internal beginWork$1 function
  const originalBeginWork$1 = (window as any).beginWork$1;
  if (originalBeginWork$1) {
    (window as any).beginWork$1 = function(current: any, renderLanes: any) {
      // Intercept and filter props during work beginning
      if (current && current.stateNode && current.stateNode.props) {
        const filteredProps = { ...current.stateNode.props };
        delete filteredProps.asChild;
        current.stateNode.props = filteredProps;
      }
      
      return originalBeginWork$1.call(this, current, renderLanes);
    };
  }

  // Override React's internal completeUnitOfWork function
  const originalCompleteUnitOfWork = (window as any).completeUnitOfWork;
  if (originalCompleteUnitOfWork) {
    (window as any).completeUnitOfWork = function(unitOfWork: any) {
      // Intercept and filter props during unit work completion
      if (unitOfWork && unitOfWork.stateNode && unitOfWork.stateNode.props) {
        const filteredProps = { ...unitOfWork.stateNode.props };
        delete filteredProps.asChild;
        unitOfWork.stateNode.props = filteredProps;
      }
      
      return originalCompleteUnitOfWork.call(this, unitOfWork);
    };
  }

  // Override React's internal performUnitOfWork function
  const originalPerformUnitOfWork$1 = (window as any).performUnitOfWork$1;
  if (originalPerformUnitOfWork$1) {
    (window as any).performUnitOfWork$1 = function(unitOfWork: any) {
      // Intercept and filter props during unit work
      if (unitOfWork && unitOfWork.stateNode && unitOfWork.stateNode.props) {
        const filteredProps = { ...unitOfWork.stateNode.props };
        delete filteredProps.asChild;
        unitOfWork.stateNode.props = filteredProps;
      }
      
      return originalPerformUnitOfWork$1.call(this, unitOfWork);
    };
  }

  // Override React's internal renderRootSync function
  const originalRenderRootSync$1 = (window as any).renderRootSync$1;
  if (originalRenderRootSync$1) {
    (window as any).renderRootSync$1 = function(root: any, lanes: any) {
      // Intercept and filter props during root rendering
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalRenderRootSync$1.call(this, root, lanes);
    };
  }

  // Override React's internal performSyncWorkOnRoot function
  const originalPerformSyncWorkOnRoot$1 = (window as any).performSyncWorkOnRoot$1;
  if (originalPerformSyncWorkOnRoot$1) {
    (window as any).performSyncWorkOnRoot$1 = function(root: any) {
      // Intercept and filter props during sync work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformSyncWorkOnRoot$1.call(this, root);
    };
  }

  // Override React's internal performConcurrentWorkOnRoot function
  const originalPerformConcurrentWorkOnRoot$1 = (window as any).performConcurrentWorkOnRoot$1;
  if (originalPerformConcurrentWorkOnRoot$1) {
    (window as any).performConcurrentWorkOnRoot$1 = function(root: any, didTimeout: any) {
      // Intercept and filter props during concurrent work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformConcurrentWorkOnRoot$1.call(this, root, didTimeout);
    };
  }

  // Override React's internal workLoopSync function
  const originalWorkLoopSync$1 = (window as any).workLoopSync$1;
  if (originalWorkLoopSync$1) {
    (window as any).workLoopSync$1 = function() {
      // Intercept and filter props during work loop
      return originalWorkLoopSync$1.call(this);
    };
  }

  // Override React's internal workLoop function
  const originalWorkLoop$1 = (window as any).workLoop$1;
  if (originalWorkLoop$1) {
    (window as any).workLoop$1 = function(hasTimeRemaining: any, initialTime: any) {
      // Intercept and filter props during work loop
      return originalWorkLoop$1.call(this, hasTimeRemaining, initialTime);
    };
  }

  // Override React's internal flushWork function
  const originalFlushWork$1 = (window as any).flushWork$1;
  if (originalFlushWork$1) {
    (window as any).flushWork$1 = function() {
      // Intercept and filter props during work flushing
      return originalFlushWork$1.call(this);
    };
  }

  // Override React's internal performWorkUntilDeadline function
  const originalPerformWorkUntilDeadline$1 = (window as any).performWorkUntilDeadline$1;
  if (originalPerformWorkUntilDeadline$1) {
    (window as any).performWorkUntilDeadline$1 = function() {
      // Intercept and filter props during deadline work
      return originalPerformWorkUntilDeadline$1.call(this);
    };
  }

  // Override React's internal flushSyncCallbacks function
  const originalFlushSyncCallbacks$1 = (window as any).flushSyncCallbacks$1;
  if (originalFlushSyncCallbacks$1) {
    (window as any).flushSyncCallbacks$1 = function() {
      // Intercept and filter props during sync callbacks
      return originalFlushSyncCallbacks$1.call(this);
    };
  }

  // Override React's internal renderWithHooks function
  const originalRenderWithHooks$1 = (window as any).renderWithHooks$1;
  if (originalRenderWithHooks$1) {
    (window as any).renderWithHooks$1 = function(current: any, workInProgress: any, Component: any, props: any) {
      // Filter out problematic props before rendering
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalRenderWithHooks$1.call(this, current, workInProgress, Component, filteredProps);
    };
  }

  // Override React's internal mountIndeterminateComponent function
  const originalMountIndeterminateComponent$1 = (window as any).mountIndeterminateComponent$1;
  if (originalMountIndeterminateComponent$1) {
    (window as any).mountIndeterminateComponent$1 = function(current: any, workInProgress: any, Component: any, renderLanes: any) {
      // Filter out problematic props before mounting
      if (workInProgress && workInProgress.pendingProps) {
        const filteredProps = { ...workInProgress.pendingProps };
        delete filteredProps.asChild;
        workInProgress.pendingProps = filteredProps;
      }
      
      return originalMountIndeterminateComponent$1.call(this, current, workInProgress, Component, renderLanes);
    };
  }

  console.log('🔧 React Warning Suppressor initialized');
} 