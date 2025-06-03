import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../lib/ThemeContext';

// Define interfaces for component props and step structure
interface Step {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
  completedColor?: string;
}

interface ProgressVisualizationProps {
  steps?: Step[];
  currentStep: number;
  className?: string;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

// Import Lucide icons
import { 
  Music, 
  CheckCircle, 
  RotateCcw, 
  Play, 
  Loader, 
  FileText, 
  Youtube,
  ListMusic
} from 'lucide-react';

// Add utility function to detect mobile and Android specifically
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isAndroidDevice = () => {
  return /Android/i.test(navigator.userAgent);
};

export const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({ 
  steps, 
  currentStep, 
  className,
  onStepChange,
  onComplete
}) => {
  const { isDark } = useTheme();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number>(currentStep);
  const isMobile = isMobileDevice();
  const isAndroid = isAndroidDevice();
  
  // Use the provided steps or fallback to default steps
  const conversionSteps = steps || [
    {
      id: 1,
      title: "Connect to Spotify",
      description: "Authenticate and retrieve playlist data from Spotify API.",
      icon: <Music size={isMobile ? 22 : 18} className="h-5 w-5" />,
      color: "bg-platform-spotify text-content-on-primary-action",
      completedColor: "bg-platform-spotify text-content-on-primary-action"
    },
    {
      id: 2,
      title: "Process Tracks",
      description: "Analyze and prepare tracks for conversion.",
      icon: <FileText size={isMobile ? 22 : 18} className="h-5 w-5" />,
      color: "bg-brand-secondary-action text-content-on-secondary-action",
      completedColor: "bg-brand-secondary-action text-content-on-secondary-action"
    },
    {
      id: 3,
      title: "Match on YouTube",
      description: "Find matching tracks on YouTube platform.",
      icon: <Youtube size={isMobile ? 22 : 18} className="h-5 w-5" />,
      color: "bg-platform-youtube text-content-on-primary-action",
      completedColor: "bg-platform-youtube text-content-on-primary-action"
    },
    {
      id: 4,
      title: "Create Playlist",
      description: "Generate and finalize your YouTube playlist.",
      icon: <ListMusic size={isMobile ? 22 : 18} className="h-5 w-5" />,
      color: "bg-brand-highlight-pink text-content-on-highlight-pink",
      completedColor: "bg-brand-highlight-pink text-content-on-highlight-pink"
    }
  ];

  // Update component state when currentStep prop changes
  useEffect(() => {
    setActiveStep(currentStep);
    
    // Set all steps before currentStep as completed
    const completed: number[] = [];
    for (let i = 1; i < currentStep; i++) {
      completed.push(i);
    }
    setCompletedSteps(completed);
    
    // Set processing state based on whether we're in the middle of steps
    setIsProcessing(currentStep > 0 && currentStep <= conversionSteps.length);
  }, [currentStep, conversionSteps.length]);

  // Simulate processing with realistic timing
  const handleStartConversion = () => {
    setIsProcessing(true);
    setCompletedSteps([]);
    let currentStepIndex = 1;
    setActiveStep(currentStepIndex);
    
    // Notify parent of step change
    onStepChange?.(currentStepIndex);
    
    // Process each step with a delay to simulate real work
    const processNextStep = () => {
      // Simulate processing time (between 1.5-3 seconds per step)
      const processingTime = Math.floor(Math.random() * 1500) + 1500;
      
      setTimeout(() => {
        // Mark current step as completed
        setCompletedSteps(prev => [...prev, currentStepIndex]);
        
        // Move to next step
        currentStepIndex++;
        
        // If there are more steps, continue
        if (currentStepIndex <= conversionSteps.length) {
          setActiveStep(currentStepIndex);
          onStepChange?.(currentStepIndex);
          processNextStep();
        } else {
          // All steps completed
          setIsProcessing(false);
          onComplete?.();
        }
      }, processingTime);
    };
    
    processNextStep();
  };
  
  const handleReset = () => {
    setActiveStep(1);
    setCompletedSteps([]);
    setIsProcessing(false);
    onStepChange?.(1);
  };
  
  // Get step status
  const getStepStatus = (stepId: number): 'completed' | 'current' | 'pending' => {
    if (completedSteps.includes(stepId)) return "completed";
    if (activeStep === stepId) return "current";
    return "pending";
  };

  // Safety check for currentStep index
  const safeCurrentStep = Math.min(Math.max(1, activeStep), conversionSteps.length);
  const currentStepData = conversionSteps[safeCurrentStep - 1] || conversionSteps[0];

  // Update the render method with mobile-optimized layout
  return (
    <div className={`w-full max-w-4xl mx-auto bg-surface-card rounded-xl p-4 md:p-8 shadow-2xl ${className || ''}`}>
      <h2 className="text-xl md:text-2xl font-bold text-content-primary mb-4 md:mb-8">Conversion Progress</h2>
      
      {/* Mobile-specific progress indicator layout */}
      {isMobile ? (
        <div className="mb-8">
          {/* Mobile step indicator */}
          <div className="relative px-2 md:px-6">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-alt -translate-y-1/2"></div>
            
            {/* Animated progress line - thicker for mobile */}
            <motion.div 
              className={`absolute top-1/2 left-0 h-1 ${isDark ? 'bg-gradient-primary-action' : 'bg-spotify'} -translate-y-1/2`}
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((completedSteps.length || (isProcessing && activeStep === 1 ? 0.2 : 0)) / conversionSteps.length) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            
            {/* Steps - mobile optimized */}
            <div className="relative flex justify-between py-4">
              {conversionSteps.map((step) => {
                const status = getStepStatus(step.id);
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative" style={{ touchAction: 'manipulation' }}>
                    {/* Step circle - larger for mobile */}
                    <div className="relative">
                      <motion.div
                        className={`flex items-center justify-center w-14 h-14 rounded-full 
                        ${status === 'completed' 
                          ? isDark ? 'bg-state-success text-content-on-primary-action' : 'bg-state-success text-content-on-primary-action' 
                          : status === 'current' 
                            ? isDark ? 'bg-gradient-primary-action text-content-on-primary-action' : 'bg-spotify text-content-on-spotify'
                            : isDark ? 'bg-surface-alt text-content-tertiary' : 'bg-surface-alt text-content-tertiary'
                        } relative z-10`}
                        animate={status === 'current' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: status === 'current' ? Infinity : 0,
                          repeatType: "loop"
                        }}
                        style={{
                          // Android-specific optimizations
                          boxShadow: isAndroid && status === 'current' ? '0 0 15px hsl(var(--brand-primary-action-hsl), 0.6)' : 'none'
                        }}
                      >
                        {status === 'completed' ? (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckCircle size={22} className="h-5 w-5" />
                          </motion.div>
                        ) : status === 'current' && isProcessing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader size={22} className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <motion.div 
                            className="opacity-70"
                            animate={status === 'current' ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.7 }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: status === 'current' ? Infinity : 0,
                              repeatType: "loop"
                            }}
                          >
                            {step.icon}
                          </motion.div>
                        )}
                      </motion.div>
                      
                      {/* Pulse effect for current step - more noticeable on mobile */}
                      {status === 'current' && (
                        <motion.div
                          className={`absolute top-0 left-0 w-full h-full rounded-full ${isDark ? 'bg-brand-primary-action' : 'bg-spotify'} -z-10`}
                          style={{ boxShadow: isAndroid ? `0 0 10px hsl(var(${isDark ? '--brand-primary-action-hsl' : '--spotify-base-color-hsl'}), 0.4)` : 'none' }}
                          initial={{ opacity: 0.5, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.7 }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Step number - simplified for mobile */}
                    <div className="mt-1 text-sm font-medium text-gray-400">
                      Step {step.id}
                    </div>
                    
                    {/* Step title - abbreviated for mobile */}
                    <motion.div
                      className={`mt-1 text-xs font-medium text-center max-w-[60px] ${
                        status === 'completed' 
                          ? 'text-green-400' 
                          : status === 'current' 
                            ? 'text-purple-400'
                            : 'text-gray-600'
                      }`}
                    >
                      {/* Shorter titles for mobile */}
                      {step.id === 1 ? "Connect" : 
                       step.id === 2 ? "Process" : 
                       step.id === 3 ? "Match" : 
                       "Create"}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Current step details for mobile in card format */}
          <div className="mt-6 bg-surface-alt p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {currentStepData.icon && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  currentStepData.color || 'bg-brand-primary-action text-content-on-primary-action'
                }`}>
                  {currentStepData.icon}
                </div>
              )}
              <h3 className="text-lg font-bold text-content-primary">{currentStepData.title}</h3>
            </div>
            <p className="text-content-secondary text-sm">{currentStepData.description}</p>
          </div>
        </div>
      ) : (
        // Desktop layout
        <div className="hidden md:block">
          {/* Top part: Step indicators and labels */}
          <div className="relative mb-10">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-alt -translate-y-1/2"></div>
            <motion.div 
              className={`absolute top-1/2 left-0 h-0.5 ${isDark ? 'bg-gradient-primary-action' : 'bg-spotify'} -translate-y-1/2`}
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((completedSteps.length || (isProcessing && activeStep === 1 ? 0.2 : 0)) / conversionSteps.length) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <div className="relative flex justify-between">
              {conversionSteps.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex flex-col items-center text-center w-1/4 relative">
                    <div className="relative mb-2">
                      <motion.div
                        className={`flex items-center justify-center w-10 h-10 rounded-full 
                        ${status === 'completed' 
                          ? isDark ? 'bg-state-success text-content-on-primary-action' : 'bg-state-success text-content-on-primary-action'
                          : status === 'current' 
                            ? isDark ? 'bg-gradient-primary-action text-content-on-primary-action' : 'bg-spotify text-content-on-spotify'
                            : isDark ? 'bg-surface-alt text-content-tertiary' : 'bg-surface-alt text-content-tertiary'
                        } relative z-10 shadow-md`}
                        animate={status === 'current' ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 1.5, repeat: status === 'current' ? Infinity : 0 }}
                      >
                        {status === 'completed' ? (
                          <CheckCircle size={18} className="h-5 w-5" />
                        ) : status === 'current' && isProcessing ? (
                          <Loader size={18} className="h-5 w-5 animate-spin" />
                        ) : (
                          step.icon
                        )}
                      </motion.div>
                      {status === 'current' && (
                        <motion.div 
                          className={`absolute top-0 left-0 w-full h-full rounded-full ${isDark ? 'bg-brand-primary-action' : 'bg-spotify'} -z-10`}
                          initial={{ opacity: 0.5, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.6 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                    <p className={`text-xs font-medium 
                      ${status === 'completed' 
                        ? isDark ? 'text-state-success' : 'text-state-success'
                        : status === 'current' 
                          ? isDark ? 'text-content-primary' : 'text-spotify'
                          : 'text-content-tertiary'}`}>
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom part: Current step details and controls */}
          <div className="mt-6 bg-surface-alt p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {currentStepData.icon && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                  ${getStepStatus(currentStepData.id) === 'completed' 
                    ? isDark ? 'bg-state-success text-content-on-primary-action' : 'bg-state-success text-content-on-primary-action'
                    : getStepStatus(currentStepData.id) === 'current' 
                      ? isDark ? 'bg-gradient-primary-action text-content-on-primary-action' : 'bg-spotify text-content-on-spotify'
                      : isDark ? 'bg-surface-alt text-content-tertiary' : 'bg-surface-alt text-content-tertiary'}`}>
                  {currentStepData.icon}
                </div>
              )}
              <h3 className="text-lg font-bold text-content-primary">{currentStepData.title}</h3>
            </div>
            <p className="text-content-secondary text-sm">{currentStepData.description}</p>
          </div>
        </div>
      )}
      
      {/* Control buttons */}
      <div className="relative z-10">
        <div className={`flex ${isMobile ? "mt-4 flex-col space-y-2" : "mt-6 flex-wrap gap-3"}`}>
          {isProcessing ? (
            <button 
              className={`rounded-full flex items-center justify-center ${isMobile ? "py-3 px-6" : "py-2 px-5"} text-content-primary bg-surface-highlight hover:bg-surface-alt`}
              onClick={handleReset}
              style={{ touchAction: 'manipulation' }}
            >
              <RotateCcw size={16} className="mr-2 h-5 w-5" />
              <span>Cancel</span>
            </button>
          ) : completedSteps.includes(conversionSteps.length) ? (
            <button 
              className={`rounded-full flex items-center justify-center ${isMobile ? "py-3 px-6" : "py-2 px-5"} text-content-on-secondary-action bg-brand-secondary-action hover:bg-button-secondary-hover`}
              style={{ touchAction: 'manipulation' }}
            >
              <CheckCircle size={16} className="mr-2 h-5 w-5" />
              <span>View Results</span>
            </button>
          ) : (
            <button 
              className={`rounded-full flex items-center justify-center ${isMobile ? "py-3 px-6" : "py-2 px-5"} text-content-on-primary-action bg-brand-primary-action hover:bg-button-primary-hover`}
              onClick={handleStartConversion}
              style={{ touchAction: 'manipulation' }}
            >
              <Play size={16} className="mr-2 h-5 w-5" /> 
              <span>Start Conversion</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Connection status for mobile Android */}
      {isMobile && (
        <div className="mt-4 text-xs text-content-tertiary text-center">
          <p>If experiencing issues, try switching to WiFi or reconnecting.</p>
        </div>
      )}
    </div>
  );
};