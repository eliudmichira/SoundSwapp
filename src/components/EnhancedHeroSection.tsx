// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faArrowDown, faShuffle, faCompactDisc, faMusic, faHeadphones, faMicrophone, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../lib/ThemeContext';
import { cn } from '../lib/utils';
import { ParticleField } from './ui/ParticleField';
import { MorphingBlob } from './ui/MorphingBlob';
import { FloatingElements } from './ui/FloatingElements';
import { TypingEffect } from './ui/TypingEffect';
import { EnhancedGradientText } from './ui/EnhancedGradientText';
import { GlowButton } from './ui/GlowButton';

// Define motion variants for coordinated animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 100,
      damping: 10
    }
  }
};

export const EnhancedHeroSection = () => {
  const { isDark, toggleTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Music platform icons with physics
  const platformIcons = [
    { icon: faSpotify, color: 'text-spotify', x: -20, y: -40, scale: 2.5, delay: 0, rotation: -5 },
    { icon: 'youtube-logo', color: 'text-youtube', x: 30, y: 60, scale: 2.2, delay: 0.2, rotation: 5 },
    { icon: faCompactDisc, color: 'text-brand-primary', x: 50, y: -50, scale: 1.8, delay: 0.6, rotation: 8 },
    { icon: faMicrophone, color: 'text-brand-accent-pink', x: 70, y: 10, scale: 1.2, delay: 0.8, rotation: -8 },
    { icon: faHeadphones, color: 'text-brand-secondary', x: -40, y: 70, scale: 1.3, delay: 1, rotation: 12 },
    { icon: faMusic, color: 'text-brand-accent-pink', x: -80, y: -20, scale: 1, delay: 1.2, rotation: -15 },
  ];

  // Define SoundSwapp brand colors for particles and blobs
  const particleColor = isDark ? "var(--brand-accent-pink)" : "var(--brand-primary)";
  const morphingBlobColor1 = isDark ? "rgba(255, 122, 89, 0.15)" : "rgba(255, 122, 89, 0.1)"; // Coral
  const morphingBlobColor2 = isDark ? "rgba(255, 0, 122, 0.12)" : "rgba(255, 0, 122, 0.08)"; // Pink
  
  const floatingElementColors = [
    { color: isDark ? 'rgba(255, 122, 89, 0.3)' : 'rgba(255, 122, 89, 0.25)', size: 24 }, // Coral
    { color: isDark ? 'rgba(255, 0, 122, 0.25)' : 'rgba(255, 0, 122, 0.2)', size: 20 }, // Pink
    { color: isDark ? 'rgba(0, 196, 204, 0.25)' : 'rgba(0, 196, 204, 0.2)', size: 22 } // Teal
  ];

  return (
    <div 
      ref={scrollContainerRef}
      className="relative min-h-screen overflow-auto perspective-1000"
    >
      {/* Navigation Header with SoundSwapp branding */}
      <header className="absolute top-0 left-0 w-full z-50 bg-surface-glass/80 backdrop-blur-md border-b border-border-default/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mr-3 flex items-center gap-2">
              <svg width="36" height="36" viewBox="0 0 36 36" className="text-brand-primary soundswapp-logo-hero">
                <defs>
                  <linearGradient id="soundswapp-hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--brand-primary)" />
                    <stop offset="35%" stopColor="var(--brand-accent-pink)" />
                    <stop offset="100%" stopColor="var(--brand-secondary)" />
                  </linearGradient>
                  <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feOffset dy="1" result="offsetBlur" />
                    <feMerge>
                      <feMergeNode in="offsetBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <pattern id="hero-bg-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                     <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <motion.circle 
                  cx="18" 
                  cy="18" 
                  r="18" 
                  fill="url(#soundswapp-hero-grad)" 
                  initial={{opacity: 0.7}} 
                  animate={{opacity: 0.9}} 
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }} 
                />
                <motion.circle 
                  cx="18" 
                  cy="18" 
                  r="18" 
                  fill="url(#hero-bg-pattern)" 
                  initial={{opacity: 0.3}} 
                  animate={{opacity: 0.5}} 
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }} 
                />
                
                <g filter="url(#hero-glow)" transform="translate(0.5, 0.5)">
                  <motion.path 
                    className="ss-letter-main-hero" 
                    d="M12.5 23.5 C10 23.5 8.5 21.5 9 19 C9.5 16.5 12.5 15.5 15 15.5 C17.5 15.5 19.5 14 19 11.5 C18.5 9 16.5 7.5 14 7.5" 
                    stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.path 
                    className="ss-letter-highlight-hero" 
                    d="M12.8 23 C10.5 23 9.3 21.3 9.7 19.2 C10.1 17.1 12.8 16.1 15 16.1 C17.2 16.1 18.8 14.7 18.4 12.5 C18.0 10.3 16.2 8.5 14 8.5"
                    stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                  />
                  <motion.path 
                    className="ss-letter-main-hero" 
                    d="M23.5 23.5 C26 23.5 27.5 21.5 27 19 C26.5 16.5 23.5 15.5 21 15.5 C18.5 15.5 16.5 14 17 11.5 C17.5 9 19.5 7.5 22 7.5"
                    stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.35 }}
                  />
                  <motion.path 
                    className="ss-letter-highlight-hero" 
                    d="M23.2 23 C25.5 23 26.7 21.3 26.3 19.2 C25.9 17.1 23.2 16.1 21 16.1 C18.8 16.1 17.2 14.7 17.6 12.5 C18.0 10.3 19.8 8.5 22 8.5"
                    stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.55 }}
                  />
                </g>
              </svg>
              {/* Show official YouTube logo for dark backgrounds */}
            </div>
            <h1 className="text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-accent-pink to-brand-secondary">
                SoundSwapp
              </span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full backdrop-blur-md",
                "bg-surface-alt hover:bg-surface-highlight text-content-primary"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-xl text-content-primary"
              >
                {isDark ? '☀️' : '🌙'}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </header>

      <div 
        ref={heroRef}
        className={cn(
          "relative min-h-screen overflow-hidden flex flex-col items-center justify-center perspective-1000",
          "bg-background"
        )}
      >
        {/* Particle background */}
        <ParticleField 
          color={particleColor} 
          density="high"
          className="absolute inset-0"
        />
        {/* Animated morphing shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <MorphingBlob 
            color={morphingBlobColor1} 
            position={{ top: '10%', left: '5%' }}
            size={400}
          />
          <MorphingBlob 
            color={morphingBlobColor2} 
            position={{ bottom: '10%', right: '5%' }}
            size={350}
            animationDuration={25}
          />
          {/* Floating music notes and icons */}
          <FloatingElements 
            count={15} 
            elements={floatingElementColors}
          />
        </div>
        
        {/* Floating platform icons with physics */}
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          {platformIcons.map((item, index) => (
            <motion.div
              key={index}
              className={cn("absolute text-opacity-20", item.color)}
              initial={{ scale: 0, opacity: 0, rotate: item.rotation }}
              animate={{ 
                scale: item.scale,
                opacity: 0.15,
                x: item.x,
                y: item.y,
                rotate: item.rotation
              }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 15,
                delay: item.delay,
              }}
              style={{
                left: `calc(50% + ${item.x * 5}px)`,
                top: `calc(50% + ${item.y * 5}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              whileHover={{
                scale: item.scale * 1.2,
                opacity: 0.25,
                transition: { duration: 0.3 }
              }}
            >
              {typeof item.icon === 'string' ? (
                <img
                  src="/images/YouTube connection card logo.png"
                  alt="YouTube"
                  style={{ height: 40, width: 'auto', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <FontAwesomeIcon icon={item.icon} className="text-4xl" />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Main content with coordinated animations */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] pt-32 pb-16 px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main Headline */}
          <motion.h1
            className="mb-4 drop-shadow-lg"
            variants={itemVariants}
          >
            <div className="text-5xl md:text-7xl font-bold leading-tight mb-4">
              <span 
                style={{ 
                  background: 'var(--soundswapp-gradient)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block',
                  fontWeight: 800,
                  textShadow: '0 0 30px rgba(255,122,89,0.3)'
                }}
                className="animated-gradient-text"
              >
                SoundSwapp
              </span>
            </div>
          </motion.h1>

          {/* Animated Music Waveform */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <motion.rect x="0" y="12" width="8" height="8" rx="4" fill="var(--brand-accent-purple)" animate={{ y: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} />
                <motion.rect x="16" y="8" width="8" height="16" rx="4" fill="var(--brand-secondary)" animate={{ y: [8, 0, 8] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} />
                <motion.rect x="32" y="4" width="8" height="24" rx="4" fill="var(--brand-accent-pink)" animate={{ y: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
                <motion.rect x="48" y="8" width="8" height="16" rx="4" fill="var(--brand-primary)" animate={{ y: [8, 0, 8] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }} />
                <motion.rect x="64" y="12" width="8" height="8" rx="4" fill="var(--brand-accent-yellow)" animate={{ y: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.8 }} />
              </g>
            </svg>
          </motion.div>

          {/* Animated Floating Music Notes */}
          <div className="pointer-events-none select-none">
            <motion.span
              className="absolute left-1/4 top-32 text-3xl text-brand-accent-purple opacity-70"
              animate={{ y: [0, -20, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.2 }}
            >🎵</motion.span>
            <motion.span
              className="absolute right-1/4 top-40 text-2xl text-brand-secondary opacity-60"
              animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.7 }}
            >🎶</motion.span>
            <motion.span
              className="absolute left-1/3 top-56 text-2xl text-brand-accent-pink opacity-60"
              animate={{ y: [0, -18, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.8, delay: 1.1 }}
            >🎼</motion.span>
          </div>

          {/* Subheadline */}
          <motion.h2
            className="text-2xl md:text-3xl font-medium mb-6 text-content-primary tracking-tight h-[3em] md:h-[2em]"
            variants={itemVariants}
          >
            <TypingEffect 
              text="Seamlessly sync your music across all platforms."
              speed={50}
              cursor={true}
            />
          </motion.h2>
          {/* Description */}
          <motion.p
            className="max-w-2xl mx-auto mb-10 text-lg md:text-xl text-content-secondary"
            variants={itemVariants}
          >
            Transform playlists between Spotify, YouTube, and more with our intelligent, AI-powered music platform.
          </motion.p>
          {/* Hero Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <GlowButton
              onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}
              variant="soundswapp"
              size="lg"
              aria-label="Get Started"
            >
              Get Started
            </GlowButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};