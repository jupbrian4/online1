import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { X, Play } from 'lucide-react';
import Lenis from 'lenis';

type Page = 'home' | 'project' | 'about';
type Category = 'DOCUMENTARY' | 'COMMERCIAL' | 'NARRATIVE';

interface VideoProject {
  id: string;
  title: string;
  thumb: string;
  videoUrl: string;
  position: string;
  year: string;
  previewUrl?: string; // Optional low-res preview
}

const CATEGORIES: Category[] = ['COMMERCIAL', 'DOCUMENTARY', 'NARRATIVE'];

const ScrambleText = ({ text, className, onClick, onMouseEnter, onMouseLeave, as: Component = 'button' }: { 
  text: string, 
  className?: string, 
  onClick?: () => void,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
  as?: any,
  key?: string | number
}) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <Component 
      onClick={onClick}
      onMouseEnter={() => {
        scramble();
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        onMouseLeave?.();
      }}
      className={className}
    >
      {displayText}
    </Component>
  );
};

const PROJECTS: Record<Category, VideoProject[]> = {
  'DOCUMENTARY': [
    { id: 'dy2', title: 'Extreme Sports at a\nWorld-Class Ski Resort', thumb: 'https://img.youtube.com/vi/udE9rc49P0s/maxresdefault.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205236/daermin_gq7dvy.mp4', position: 'Director', year: '2025' },
    { id: 'dy3', title: 'Cross-Country Skiing in the\nCradle of Human Skiing', thumb: 'https://img.youtube.com/vi/bj4_aNadQNc/maxresdefault.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205292/majun_fwj4f1.mp4', position: 'Director', year: '2025' },
    { id: 'dy1', title: 'A Xinjiang Epic in Musical Notes:\nThe Twelve Muqam', thumb: 'https://img.youtube.com/vi/O00Vrtz7Qkw/maxresdefault.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205328/muqam_gbstff.mp4', position: 'Director', year: '2025' },
    { id: 'd0', title: "The Kran River in Altay\nin a Young Writer's Pen", thumb: 'https://img.youtube.com/vi/gA1wnXd8ORc/maxresdefault.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205322/bayan_yslqj3.mp4', position: 'Director', year: '2025' },
    { id: 'dy6', title: 'Why a Teacher Went Viral on\nShort-Video Platforms', thumb: 'https://img.youtube.com/vi/Jl0AFNXdZ20/maxresdefault.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205157/teacher_fzp3gf.mp4', position: 'Director', year: '2025' },
    { id: 'dy7', title: 'Redefining Intangible Heritage\nwith Contemporary Art', thumb: 'https://img.youtube.com/vi/vGQk-L3D0I0/maxresdefault.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205242/maxing_etiujj.mp4', position: 'Director', year: '2025' },
  ],
  'COMMERCIAL': [
    { id: 'c1', title: 'GQ x Dior Sauvage Perfume', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/Dior.jpeg', videoUrl: 'https://vimeo.com/1172393565', position: 'Director', year: '2023' },
    { id: 'c7', title: 'Douyin (TikTok) Gold Origins:\nHainan, No Hurry', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/hainan.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773203803/hainan1_mr3swq.mp4', position: 'Director', year: '2024' },
    { id: 'c5', title: 'Douyin (TikTok) Gold Origins:\nShowing-off with Changbai Mountain', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/changbaishan.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773203793/changbai1_u1mn7f.mp4', position: 'Director', year: '2024' },
    { id: 'c4', title: 'Douyin (TikTok) Gold Origins:\nJingdezhen: Perfectly Timed', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/jingdezhen.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773203803/jingdezhen1_tqetci.mp4', position: 'Director', year: '2024' },
    { id: 'c3', title: 'GQ x Ouyang Nana Live Today', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/ouyang.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773204834/ouyang1_uclmqy.mp4', position: 'Director', year: '2023' },
    { id: 'c6', title: 'Chinese National Geographic:\nTravel to Wushan with Zetao Ning', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/hiking%20with.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773204828/Travel1_j0lmjv.mp4', position: 'Director', year: '2025' },
    { id: 'c2', title: 'The Power To Rewrite Lives', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/rewrite%20lives.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205338/rewrite_sjjsgr.mp4', position: 'Director', year: '2022' },
    { id: 'c10', title: 'GQ x Kiehl’s Act Any Age', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/age.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773203801/kiehls_dmexvs.mp4', position: 'Director', year: '2023' },
    { id: 'c8', title: 'Christian Louboutin Chinese New\nYear Campaign 2025 - No.1', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/Chinese%20new%20year%201.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773204160/Chinese_new_year_1_kefrzh.mp4', position: 'Director', year: '2025' },
    { id: 'c9', title: 'Christian Louboutin Chinese New\nYear Campaign 2025 - No.2', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/Chinese%20new%20year%202.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773204156/Chinese_new_year_2_mffcdq.mp4', position: 'Director', year: '2025' },
    { id: 'c12', title: 'GQ x Chanel Late Night FM\nwith Zhilei Xin', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/late%20night.jpeg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773204178/Bleu_%E8%BE%9B%E8%8A%B7%E8%95%BE_z3lj2y.mp4', position: 'Post-Production Producer', year: '2023' },
    { id: 'c11', title: 'Japan Airline\nLet dreams set sail', thumb: 'https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/japan.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773204191/Japan_airline_syorzd.mp4', position: 'Director of Photography', year: '2023' },
  ],
  'NARRATIVE': [
    { id: 'n1', title: 'Detour', thumb: 'https://github.com/jupbrian4/Video-Portfolio/releases/download/narr/detour-window-horizontal1.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205324/Detour_Screener_NO_subtitle_eatyoa.mp4', position: 'Writer, Director', year: '2019' },
    { id: 'n2', title: 'One More Thing', thumb: 'https://github.com/jupbrian4/Video-Portfolio/releases/download/narr/one.more.thing.jpg', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205007/One_more_thing_c6ip5c.mp4', position: 'Writer, Director, Editor', year: '2017' },
    { id: 'n3', title: 'Overexposed', thumb: 'https://github.com/jupbrian4/Video-Portfolio/releases/download/narr/overexposed.thumbpic.png', videoUrl: 'https://res.cloudinary.com/dx9mv2lkh/video/upload/v1773205539/overexposed_cw0yxw.mp4', position: 'Director of Photography', year: '2018' },
    { id: 'n4', title: 'She Has Your Eyes', thumb: 'https://github.com/jupbrian4/Video-Portfolio/releases/download/narr/she.has.your.eyes.jpg', videoUrl: 'https://vimeo.com/384082803?from=outro-embed', position: 'Director of Photography', year: '2018' },
  ]
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isProjectMenuOpen, setProjectMenuOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoProject | null>(null);
  const [hoveredProject, setHoveredProject] = useState<VideoProject | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollGlitch, setScrollGlitch] = useState(false);
  
  // Cursor State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<'default' | 'play' | 'text'>('default');

  // Scroll Velocity for Glitch
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = Math.abs(currentY - lastY);
      if (diff > 50) {
        setScrollGlitch(true);
        setTimeout(() => setScrollGlitch(false), 150);
      }
      lastY = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Scroll Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Cursor Tracking
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const handlePageChange = (newPage: Page) => {
    if (page === newPage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setPage(newPage);
      window.scrollTo(0, 0);
      setTimeout(() => setIsTransitioning(false), 400);
    }, 400);
  };

  const handleSelectCategory = (cat: Category | null) => {
    setActiveCategory(cat);
    handlePageChange('project');
  };

  const allProjects = useMemo(() => {
    if (activeCategory) return PROJECTS[activeCategory];
    return CATEGORIES.map(cat => PROJECTS[cat]).flat();
  }, [activeCategory]);

  return (
    <div className={`min-h-screen bg-[#050505] text-[#F4F4F5] selection:bg-[#F27D26]/30 font-mono flex flex-col font-light cursor-none ${scrollGlitch ? 'glitching' : ''}`}>
      {/* Custom Cursor */}
      <div 
        className={`custom-cursor ${cursorType === 'play' ? 'active' : ''} ${cursorType === 'text' ? 'text-hover' : ''}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      >
        {cursorType === 'play' && <span>PLAY</span>}
      </div>

      {/* Film Overlays */}
      <div className="film-scratches" />
      <div className="light-leak" />

      {/* Shutter Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="shutter-overlay origin-top"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 0.4 }}
              className="shutter-flicker"
            />
          </>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <nav className="w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center z-50 relative">
        <ScrambleText 
          text="ZELONG PENG"
          className="text-sm md:text-base font-sans font-bold tracking-widest uppercase cursor-pointer mb-6 md:mb-0 border-none outline-none bg-transparent p-0"
          onClick={() => handlePageChange('home')}
          onMouseEnter={() => setCursorType('text')}
          onMouseLeave={() => setCursorType('default')}
        />
        <div className="flex gap-8 md:gap-12 text-[10px] md:text-xs tracking-[0.2em] uppercase font-light relative items-center">
          <ScrambleText 
            text="HOME"
            onClick={() => handlePageChange('home')} 
            onMouseEnter={() => setCursorType('text')}
            onMouseLeave={() => setCursorType('default')}
            className={`hover:opacity-100 transition-opacity border-none outline-none bg-transparent p-0 ${page === 'home' ? 'opacity-100 text-[#F27D26]' : 'opacity-50'}`}
          />
          
          <div className="relative group" onMouseLeave={() => setProjectMenuOpen(false)}>
            <ScrambleText 
              text="WORK"
              onMouseEnter={() => {
                setProjectMenuOpen(true);
                setCursorType('text');
              }}
              onMouseLeave={() => setCursorType('default')}
              onClick={() => {
                handlePageChange('project');
                setProjectMenuOpen(!isProjectMenuOpen);
              }} 
              className={`hover:opacity-100 transition-opacity border-none outline-none bg-transparent p-0 ${page === 'project' || isProjectMenuOpen ? 'opacity-100 text-[#F27D26]' : 'opacity-50'}`}
            />
            
            {/* Project Dropdown */}
            <AnimatePresence>
              {isProjectMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 md:left-auto md:right-0 pt-4 flex flex-col items-start md:items-end z-50 min-w-[160px]"
                >
                  <div className="bg-[#080808] border border-white/10 p-5 flex flex-col gap-3.5 w-full shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                    {CATEGORIES.map(cat => (
                      <ScrambleText 
                        key={cat}
                        text={cat}
                        onMouseEnter={() => setCursorType('text')}
                        onMouseLeave={() => setCursorType('default')}
                        onClick={() => {
                          handleSelectCategory(cat);
                          setProjectMenuOpen(false);
                        }}
                        className={`whitespace-nowrap transition-all text-[10px] tracking-[0.2em] uppercase text-left md:text-right border-none outline-none bg-transparent p-0 m-0 ${activeCategory === cat ? 'text-[#F27D26] opacity-100 font-medium' : 'text-white opacity-70 hover:opacity-100 hover:text-[#F27D26] font-normal'}`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ScrambleText 
            text="ABOUT ME"
            onClick={() => handlePageChange('about')} 
            onMouseEnter={() => setCursorType('text')}
            onMouseLeave={() => setCursorType('default')}
            className={`hover:opacity-100 transition-opacity border-none outline-none bg-transparent p-0 ${page === 'about' ? 'opacity-100 text-[#F27D26]' : 'opacity-50'}`}
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="relative w-full h-[calc(100vh-100px)] overflow-hidden flex flex-col"
            >
              {/* Cinematic Double Exposure Background */}
              <div className="absolute inset-0 overflow-hidden bg-[#050505] z-0">
                {/* Base Image (Rocky Landscape) */}
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  src="https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/hero%20bgs.png"
                  className="absolute inset-0 w-full h-full object-cover z-0 hero-breathe"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000';
                  }}
                />

                {/* Localized Glitch Slices */}
                <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
                  <img 
                    src="https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/hero%20bgs.png"
                    className="absolute inset-0 w-full h-full object-cover glitch-slice"
                    style={{ filter: 'hue-rotate(90deg) brightness(1.5)' }}
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src="https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/hero%20bgs.png"
                    className="absolute inset-0 w-full h-full object-cover glitch-slice-2"
                    style={{ filter: 'hue-rotate(-90deg) brightness(1.5)' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Secondary Exposure Layer - Blurred and Screened */}
                <motion.img 
                  initial={{ scale: 1.2, x: -50, opacity: 0 }}
                  animate={{ scale: 1, x: 0, opacity: 0.6 }}
                  transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
                  src="https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/hero%20bgs.png"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen blur-[12px] brightness-75"
                  style={{ transformOrigin: 'bottom left' }}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                
                {/* Overlays for Cinematic Feel */}
                <div className="absolute inset-0 vignette opacity-60" />
                <div className="absolute inset-0 scanlines opacity-20" />
                <div className="absolute inset-0 bg-grain opacity-15" />

                {/* Lighting Texture Flow */}
                <motion.div 
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute inset-0 mix-blend-overlay"
                  style={{ 
                    backgroundImage: 'radial-gradient(circle at 30% 30%, #F27D26 0%, transparent 60%)', 
                    backgroundSize: '200% 200%' 
                  }}
                />
              </div>
              
              {/* Asymmetrical Content */}
              <div className="absolute bottom-32 left-8 md:left-24 flex flex-col items-start pointer-events-none z-10">
                 <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                    className="flex flex-col"
                  >
                    <h1 className="text-5xl md:text-8xl lg:text-[120px] font-sans font-bold text-white tracking-tighter uppercase leading-none glitch-text glitch-text-rgb" data-text="Zelong Peng">
                      Zelong<br/>Peng
                    </h1>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    className="mt-8 bg-white/5 backdrop-blur-md border-l-2 border-[#F27D26] px-6 py-4 rounded-r-sm interactive-glitch pointer-events-auto"
                    onMouseEnter={(e) => e.currentTarget.classList.add('glitching')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('glitching')}
                  >
                    <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#F27D26] font-mono">
                      Beijing Based Director
                    </p>
                  </motion.div>
              </div>

              {/* Bottom Categories */}
              <div className="absolute bottom-12 left-0 w-full px-12 md:px-24 flex flex-col md:flex-row justify-end items-center gap-8 md:gap-12 z-20">
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.5 + i * 0.1 }}
                    className="relative group py-2"
                  >
                    <ScrambleText
                      text={cat}
                      onMouseEnter={() => setCursorType('text')}
                      onMouseLeave={() => setCursorType('default')}
                      onClick={() => handleSelectCategory(cat)}
                      className="text-[10px] md:text-xs tracking-[0.2em] text-white/50 hover:text-[#F27D26] transition-colors uppercase font-light border-none outline-none bg-transparent p-0 m-0"
                    />
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#F27D26] transition-all duration-700 group-hover:w-full opacity-50 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {page === 'project' && (
            <motion.div 
              key="project"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="pt-24 md:pt-32 px-6 md:px-16 max-w-[2000px] mx-auto w-full"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-24 md:mb-40">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="flex flex-col"
                >
                  <h1 className="text-4xl md:text-7xl font-sans font-bold tracking-tighter uppercase">
                    {activeCategory || 'Selected Works'}
                  </h1>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="flex gap-12 md:gap-24 mt-12 md:mt-4"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-light">Filters</span>
                  <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-light">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-left transition-all ${activeCategory === cat ? 'opacity-100 text-[#F27D26]' : 'opacity-40 hover:opacity-100 hover:text-[#F27D26]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Simple 2-Column Gallery Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 pb-32">
                {allProjects.map((proj, i) => (
                    <motion.div 
                      key={proj.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="cursor-none flex flex-col group self-start relative"
                      onClick={() => setSelectedVideo(proj)}
                      onMouseEnter={() => {
                        setHoveredProject(proj);
                        setCursorType('play');
                      }}
                      onMouseLeave={() => {
                        setHoveredProject(null);
                        setCursorType('default');
                      }}
                    >
                      {/* Metadata above image */}
                      <div className="flex justify-start items-baseline text-[10px] uppercase tracking-[0.1em] font-mono mb-4 overflow-hidden">
                        <motion.h3 
                          initial={{ y: "100%" }}
                          whileInView={{ y: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="opacity-90 text-white group-hover:text-[#F27D26] transition-colors whitespace-pre-line"
                        >
                          {proj.title} / {proj.position} / {proj.year}
                        </motion.h3>
                      </div>
                      
                      {/* Image / Video Preview */}
                      <div className="relative aspect-video overflow-hidden bg-white/5">
                        <AnimatePresence>
                          {hoveredProject?.id === proj.id ? (
                            <motion.video
                              key="preview"
                              initial={{ opacity: 0, scale: 1.1 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              src={proj.videoUrl}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover object-top"
                            />
                          ) : (
                            <motion.img 
                              key="thumb"
                              initial={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              src={proj.thumb} 
                              alt={proj.title} 
                              className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {page === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="pt-32 px-6 md:px-16 max-w-[2000px] mx-auto w-full pb-32"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
                <motion.div 
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-white/5"
                >
                  <img 
                    src="https://raw.githubusercontent.com/jupbrian4/Video-Portfolio/main/profile.JPG" 
                    alt="Director" 
                    className="w-full h-full object-cover opacity-80 grayscale"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="space-y-16 pt-12">
                  <div className="space-y-8 text-sm md:text-base opacity-60 leading-loose font-light max-w-xl">
                    <p className="interactive-glitch" onMouseEnter={(e) => e.currentTarget.classList.add('glitching')} onMouseLeave={(e) => e.currentTarget.classList.remove('glitching')}>
                      NYU Tisch graduate with 5+ years of experience in film and media production. Specialized in directing global documentary series for Phoenix TV and high-impact commercial campaigns for brands including Dior and Jeep. Experienced in VFX coordination for international feature films and creating digital content with proven viral reach of over 16 million views.
                    </p>
                    <p>
                      Based in Beijing, working globally.
                    </p>
                  </div>
                  <div className="pt-16 border-t border-white/10">
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-40 mb-6 font-light">Inquiries</p>
                    <a href="mailto:seaprod1@gmail.com" className="text-xl md:text-2xl font-light tracking-widest hover:text-[#F27D26] transition-colors">
                      seaprod1@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Brands Worked With */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-32 pt-16 border-t border-white/10"
              >
                <h3 className="text-[10px] tracking-[0.2em] uppercase opacity-40 mb-12 font-mono text-center">Brands Worked With</h3>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-all duration-500">
                  {[
                    { name: 'CHANEL', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/CHANEL_Logo_1.png', filter: 'brightness(0) invert(1)' },
                    { name: 'DIOR', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/Dior_idDN_cIMfS_1.png', filter: 'brightness(0) invert(1)' },
                    { name: 'Christian Louboutin', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/idw1weepqw_1773133068333.jpeg', filter: 'none' },
                    { name: 'ByteDance', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/ByteDance_idJg5znO6n_1.png', filter: 'brightness(0) invert(1)' },
                    { name: 'Taobao', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/Taobao_id-qQZaZ6R_0.png', filter: 'brightness(0) invert(1)' },
                    { name: 'SAMSUNG', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/Samsung_idLNQNZGf5_1.png', filter: 'brightness(0) invert(1)' },
                    { name: 'TikTok', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/idv4QpSgzw_1773133002538.png', filter: 'none' },
                    { name: 'Jeep', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/Jeep_id4S8p4lU9_1.png', filter: 'brightness(0) invert(1)' },
                    { name: 'vivo', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/Vivo_Logo_1.png', filter: 'brightness(0) invert(1)' },
                    { name: 'JAPAN AIRLINES', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/JAPAN%20AIRLINES%20(JAL)_idskLoZxnE_1.png', filter: 'none' },
                    { name: 'GQ Magazine', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/GQ%20Magazine_idPzqQPpSX_0.png', filter: 'brightness(0) invert(1)' },
                    { name: 'Tatler', url: 'https://raw.githubusercontent.com/jupbrian4/logo/main/Tatler_idP8MBwfdh_0.png', filter: 'brightness(0) invert(1)' },
                  ].map(brand => (
                    <div key={brand.name} className="flex items-center justify-center h-12 md:h-16 w-auto relative group">
                      <img 
                        src={brand.url} 
                        alt={brand.name} 
                        className="max-h-full max-w-[120px] md:max-w-[160px] object-contain transition-all duration-300"
                        style={{ filter: brand.filter }}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.classList.remove('hidden');
                          }
                        }}
                      />
                      <span className="hidden text-xl md:text-3xl font-sans font-bold tracking-tighter text-white/80 group-hover:text-white transition-colors uppercase">
                        {brand.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Footer (Visible on Project and About pages) */}
      <AnimatePresence>
        {page !== 'home' && (
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 px-6 md:px-16 pb-16 pt-24 border-t border-white/10 max-w-[2000px] mx-auto w-full"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-12">
              <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] font-light">
                <ScrambleText text="WORK" onClick={() => handlePageChange('project')} onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} className="text-left hover:text-[#F27D26] transition-colors border-none outline-none bg-transparent p-0" />
                <ScrambleText text="ABOUT ME" onClick={() => handlePageChange('about')} onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} className="text-left hover:text-[#F27D26] transition-colors border-none outline-none bg-transparent p-0" />
                <ScrambleText text="CONTACT" onClick={() => window.location.href = 'mailto:seaprod1@gmail.com'} onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} className="text-left hover:text-[#F27D26] transition-colors border-none outline-none bg-transparent p-0" />
                <ScrambleText text="PRIVACY POLICY" onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} className="text-left hover:text-[#F27D26] transition-colors border-none outline-none bg-transparent p-0" />
              </div>
              <div className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold uppercase tracking-tighter flex items-center gap-6 opacity-80">
                Thank you for watching 
                <span className="font-sans text-2xl md:text-4xl border border-white/30 rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center pb-1 text-[#F27D26] border-[#F27D26]/50">
                  ☺
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-32 opacity-30 font-light gap-4">
              <ScrambleText text="WEBSITE DESIGN BY AI STUDIO" as="span" onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} />
              <ScrambleText text="IMPRESSUM" as="span" onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} />
              <ScrambleText text="© 2024 ZELONG PENG. ALL RIGHTS RESERVED." as="span" onMouseEnter={() => setCursorType('text')} onMouseLeave={() => setCursorType('default')} />
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
          >
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-[#F27D26] transition-colors z-10"
            >
              <X size={32} strokeWidth={1} />
            </button>
            <div className="w-full max-w-[1600px] aspect-video px-4 md:px-16 relative flex flex-col justify-center">
              {selectedVideo.videoUrl.includes('youtube.com') || selectedVideo.videoUrl.includes('youtu.be') || selectedVideo.videoUrl.includes('xinpianchang.com') || selectedVideo.videoUrl.includes('vimeo.com') ? (
                <iframe 
                  key={selectedVideo.videoUrl}
                  src={
                    selectedVideo.videoUrl.includes('youtube.com') || selectedVideo.videoUrl.includes('youtu.be') 
                      ? `${selectedVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`
                      : selectedVideo.videoUrl.includes('vimeo.com')
                        ? `https://player.vimeo.com/video/${selectedVideo.videoUrl.split('vimeo.com/')[1].split('?')[0]}?autoplay=1`
                        : selectedVideo.videoUrl
                  }
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video 
                  key={selectedVideo.videoUrl}
                  controls 
                  autoPlay 
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain outline-none bg-transparent"
                  onAbort={() => {
                    console.debug("Video fetch aborted - likely intentional");
                  }}
                  onError={() => {
                    console.error("Video loading error for: " + selectedVideo.videoUrl);
                  }}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-16 left-16 right-16 flex justify-between items-start text-[10px] uppercase tracking-[0.2em] font-mono"
              >
                <h3 className="opacity-90 font-bold text-xs whitespace-pre-line">
                  {selectedVideo.title} / {selectedVideo.position} / {selectedVideo.year}
                </h3>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
