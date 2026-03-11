import React, { useRef, useId, useEffect, useState } from 'react';
import { motion, animate, useMotionValue, AnimatePresence } from 'framer-motion';
// Added Menu icon to the import for the mobile hamburger menu
import { Linkedin, Mail, Hexagon, Activity, Cpu, Layers, Waves, Box, X, Phone, Menu } from 'lucide-react';

// =========================================
// ETHEREAL SHADOW EFFECT COMPONENT
// =========================================

function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
  if (fromLow === fromHigh) {
    return toLow;
  }
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = () => {
  const id = useId();
  const cleanId = id.replace(/:/g, "");
  return `shadowoverlay-${cleanId}`;
};

function EtherealBackgroundLayer({ 
  sizing = 'fill',
  color = 'rgba(128, 128, 128, 1)', 
  animation = { scale: 100, speed: 50 }, 
  noise = { opacity: 0.05, scale: 1 },
  className
}) {
  const id = useInstanceId();
  const animationEnabled = animation && animation.scale > 0;
  const feColorMatrixRef = useRef(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef(null);

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      if (hueRotateAnimation.current) {
        hueRotateAnimation.current.stop();
      }
      hueRotateMotionValue.set(0);
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        ease: "linear",
        delay: 0,
        onUpdate: (value) => {
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute("values", String(value));
          }
        }
      });

      return () => {
        if (hueRotateAnimation.current) {
          hueRotateAnimation.current.stop();
        }
      };
    }
  }, [animationEnabled, animationDuration, hueRotateMotionValue]);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : "none"
        }}
      >
        {animationEnabled && (
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={displacementScale}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            width: "100%",
            height: "100%",
            opacity: 0.6 
          }}
        />
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
            mixBlendMode: "overlay"
          }}
        />
      )}
    </div>
  );
}

// =========================================
// MAIN APP COMPONENT
// =========================================

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [enlargedImage, setEnlargedImage] = useState(null);
  
  // NEW: State to control the mobile navigation menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050505] text-gray-200 font-sans selection:bg-white/20 overflow-x-hidden">
      
      {/* --- GLOBAL FIXED BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {currentPage === 'home' && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/ui_ux_background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
        {currentPage !== 'home' && (
          <div className="absolute inset-0">
            <EtherealBackgroundLayer 
              color="rgba(128, 128, 128, 1)" 
              animation={{ scale: 100, speed: 50 }} 
              noise={{ opacity: 0.1, scale: 1 }}
            />
          </div>
        )}
      </div>

      {/* --- NAVIGATION (Responsive) --- */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20 w-full max-w-[1600px] mx-auto bg-transparent">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 cursor-pointer z-50"
          onClick={() => {
            setCurrentPage('home');
            setIsMobileMenuOpen(false); // Close menu if logo is clicked on mobile
          }}
        >
          <Hexagon className="w-6 h-6 text-white stroke-[1.5]" />
          <span className="text-xl font-bold tracking-[0.15em] text-white uppercase mt-0.5 hover:text-gray-300 transition-colors">
            Synerksis Labs
          </span>
        </motion.div>

        {/* DESKTOP NAVIGATION */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex gap-10 text-[14px] font-normal text-gray-300 tracking-wider"
        >
          <button onClick={() => setCurrentPage('product')} className={`hover:text-white transition-colors ${currentPage === 'product' ? 'text-white font-semibold' : ''}`}>Product</button>
          <button onClick={() => setCurrentPage('mission')} className={`hover:text-white transition-colors ${currentPage === 'mission' ? 'text-white font-semibold' : ''}`}>Mission</button>
          <button onClick={() => setCurrentPage('team')} className={`hover:text-white transition-colors ${currentPage === 'team' ? 'text-white font-semibold' : ''}`}>Team</button>
          <button onClick={() => setCurrentPage('contact')} className={`hover:text-white transition-colors ${currentPage === 'contact' ? 'text-white font-semibold' : ''}`}>Contact</button>
        </motion.div>

        {/* MOBILE HAMBURGER BUTTON */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden text-white z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </motion.button>

        {/* MOBILE NAVIGATION MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 flex flex-col items-center py-8 gap-8 md:hidden shadow-2xl z-40"
            >
              {['product', 'mission', 'team', 'contact'].map((page) => (
                <button 
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setIsMobileMenuOpen(false); // Close menu when a link is clicked
                  }} 
                  className={`text-lg tracking-widest uppercase transition-colors ${currentPage === page ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                  {page}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- PAGE CONTENT RENDERER --- */}
      <div className="relative z-10 flex-grow flex flex-col w-full max-w-[1600px] mx-auto"> 

        {/* 1. HOME PAGE */}
        {currentPage === 'home' && (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex items-center px-6 md:px-12 lg:px-20 w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8 items-center h-full">
              <div className="w-full h-[200px] sm:h-[300px] md:h-[400px]"></div>
              
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-start gap-4 max-w-xl xl:max-w-2xl lg:pl-24 xl:pl-32 pb-12 lg:pb-0"
              >
                <motion.h1 
                  variants={fadeUpVariant}
                  className="text-5xl lg:text-[56px] xl:text-[64px] font-bold text-white tracking-tight leading-[1.1] uppercase"
                >
                  UNLOCK YOUR POTENTIAL
                </motion.h1>
                
                <motion.p 
                  variants={fadeUpVariant}
                  className="text-base md:text-[17px] text-gray-400 leading-relaxed font-light mt-2 max-w-[90%]"
                >
                  Introducing the Myoband: Advanced Biometric Feedback & Control
                </motion.p>
                
                <motion.button 
                  onClick={() => setCurrentPage('product')}
                  variants={fadeUpVariant}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-8 py-3.5 bg-white text-black text-[13px] font-bold tracking-[0.1em] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all uppercase cursor-pointer"
                >
                  LEARN MORE
                </motion.button>
              </motion.div>
            </div>
          </motion.main>
        )}

        {/* 2. PRODUCT PAGE */}
        {currentPage === 'product' && (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex items-center py-8 px-6 md:px-12 lg:px-20 w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-12 lg:gap-6 items-center h-full">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col items-start gap-5 max-w-xl xl:max-w-2xl"
              >
                <motion.div variants={fadeUpVariant} className="flex items-center gap-3 text-gray-400 font-medium tracking-widest text-[11px] uppercase">
                  <Activity className="w-4 h-4" />
                  <span>Bio-Electronics & AI</span>
                </motion.div>

                <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                  NEXT-GENERATION <br /> KINETIC INTELLIGENCE
                </motion.h2>
                
                <motion.p variants={fadeUpVariant} className="text-base md:text-[17px] text-gray-400 leading-relaxed font-light mt-1">
                  The MyoBand is a cutting-edge deep tech wearable engineered to capture precise biometric signals. Designed for ultimate versatility, it adapts to your body worn seamlessly on the arms or legs to track high-fidelity kinetic data. 
                </motion.p>

                <motion.div variants={fadeUpVariant} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
                  <div className="flex flex-col gap-2 p-5 rounded-2xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
                    <Waves className="w-5 h-5 text-white mb-1" />
                    <h3 className="text-white font-semibold text-sm tracking-wide">Gesture Control</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Translates micro-muscle movements into macro-commands with near zero latency.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-5 rounded-2xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
                    <Cpu className="w-5 h-5 text-white mb-1" />
                    <h3 className="text-white font-semibold text-sm tracking-wide">AI Architecture</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Transforms raw physiological signals into actionable insights and controls.</p>
                  </div>

                  <div className="flex flex-col gap-2 p-5 rounded-2xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
                    <Box className="w-5 h-5 text-white mb-1" />
                    <h3 className="text-white font-semibold text-sm tracking-wide">Perfect Physical Form Factor</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Ergonomic links engineered for day-long comfort and consistent signal integrity.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-5 rounded-2xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
                    <Layers className="w-5 h-5 text-white mb-1" />
                    <h3 className="text-white font-semibold text-sm tracking-wide">Clinical Dashboard</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Dedicated interface for professionals to monitor and analyze patient metrics.</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="flex flex-col justify-center items-center relative w-full h-[350px] md:h-[550px] lg:pl-10"
              >
                <motion.img
                  src="/transparent_background_myiband.png"
                  alt="MyoBand Deep Tech Wearable"
                  className="relative z-10 w-full max-w-[350px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[650px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.9)]"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[280px] md:w-[350px] lg:w-[420px] xl:w-[550px] h-[15px] bg-black blur-[15px] rounded-[100%] z-0"
                  animate={{ scale: [1, 0.85, 1], opacity: [0.8, 0.4, 0.8] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </motion.main>
        )}

        {/* 3. MISSION PAGE */}
        {currentPage === 'mission' && (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col justify-center py-12 px-6 md:px-12 lg:px-20 w-full max-w-[1200px] mx-auto relative z-10"
          >
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center text-center gap-8"
            >
              <motion.div variants={fadeUpVariant} className="flex items-center gap-3 text-gray-400 font-medium tracking-widest text-[11px] uppercase">
                <Hexagon className="w-4 h-4" />
                <span>Our Vision</span>
              </motion.div>

              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight uppercase leading-[1.1]">
                Pioneering the Future <br className="hidden md:block" /> of Bio-Kinetics
              </motion.h2>
              
              <motion.p variants={fadeUpVariant} className="text-base md:text-[18px] text-gray-400 leading-relaxed font-light max-w-3xl mt-2">
                At Synerksis Labs, our mission is to become the premier brand in modern biomedical and AI-driven smart gesture control. We are dedicated to producing first-of-a-kind wearable technologies that bridge the gap between human intent and digital execution.
              </motion.p>

              <motion.div variants={fadeUpVariant} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
                <div className="flex flex-col gap-3 p-8 rounded-3xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md text-left hover:bg-black/60 transition-colors duration-500">
                  <Activity className="w-6 h-6 text-white mb-2" />
                  <h3 className="text-white font-semibold text-lg tracking-wide">Clinical Diagnostics</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Making the diagnosis and progression tracking of chronic disorders highly accessible, precise, and effortless.</p>
                </div>
                
                <div className="flex flex-col gap-3 p-8 rounded-3xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md text-left hover:bg-black/60 transition-colors duration-500">
                  <Waves className="w-6 h-6 text-white mb-2" />
                  <h3 className="text-white font-semibold text-lg tracking-wide">Athletic Enhancement</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Providing athletes with high-fidelity biomechanical data to track progression, perfect form, and unlock peak physical performance.</p>
                </div>

                <div className="flex flex-col gap-3 p-8 rounded-3xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md text-left hover:bg-black/60 transition-colors duration-500">
                  <Cpu className="w-6 h-6 text-white mb-2" />
                  <h3 className="text-white font-semibold text-lg tracking-wide">First-of-a-Kind Tech</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Innovating at the intersection of AI and hardware to deliver entirely new paradigms of gesture-based wearable technology.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.main>
        )}

        {/* 4. TEAM PAGE */}
        {currentPage === 'team' && (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col justify-center py-12 px-6 md:px-12 lg:px-20 w-full max-w-[1400px] mx-auto"
          >
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
                The Synergy Behind <br className="md:hidden" /> The Kinesis
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="mt-6 text-gray-400 font-light leading-relaxed text-[15px] md:text-base">
                Driven by a shared vision in deep tech, our founders combine expertise in advanced electronics, software architecture, and industrial design to redefine human-computer interaction.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
            >
              {[
                { 
                  name: "Sourish Mandal", 
                  role: "Co-Founder & Hardware Lead", 
                  desc: "Spearheading electrical engineering, advanced circuit design, and the core physical gesture control technology powering the MyoBand.", 
                  image: "/sourish.jpeg",
                  initials: "SM",
                  linkedin: "https://www.linkedin.com/in/sourish-mandal-a81182302?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                  email: "sourishmandal11work@gmail.com"
                },
                { 
                  name: "Soumili", 
                  role: "Co-Founder & Software Lead", 
                  desc: "Driving the intricate software architecture, machine learning models, and real-time biometric data processing pipelines.", 
                  image: "/soumili.jpeg",
                  initials: "S",
                  linkedin: "https://www.linkedin.com/in/soumili-das-3a351a325",
                  email: "milisoud2005@gmail.com"
                },
                { 
                  name: "Chetan", 
                  role: "Co-Founder & Mechanical Lead", 
                  desc: "Leading the physical product development, 3D printing implementation, and ensuring the wearable's modular ergonomics.", 
                  image: "/chetan.png",
                  initials: "C",
                  linkedin: "https://www.linkedin.com/in/chetan-barua-147b6b317?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                  email: "chetanlpla17@gmail.com"
                }
              ].map((member, index) => (
                <motion.div key={index} variants={fadeUpVariant} className="group relative flex flex-col p-8 rounded-3xl bg-black/40 border border-white/[0.05] hover:bg-black/60 transition-colors duration-500 backdrop-blur-md">
                  
                  {/* ATTRACTIVE IMAGE CONTAINER WITH HOVER & CLICK EFFECT */}
                  <div 
                    className="relative w-24 h-24 mb-6 cursor-pointer"
                    onClick={() => setEnlargedImage(member.image)}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/[0.02] group-hover:bg-white/[0.1] blur-xl transition-all duration-500"></div>
                    
                    <div className="relative w-full h-full rounded-full border border-white/[0.15] bg-[#111] overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover grayscale-[80%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                        onError={(e) => {
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=0D0D0D&color=fff&size=150`;
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-wide">{member.name}</h3>
                  <p className="text-xs text-white/60 uppercase tracking-widest font-medium mt-1 mb-4">{member.role}</p>
                  <p className="text-sm text-gray-400 font-light leading-relaxed mb-8 flex-grow">
                    {member.desc}
                  </p>
                  <div className="flex gap-4 mt-auto">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label={`LinkedIn for ${member.name}`}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-white transition-colors" aria-label={`Email ${member.name}`}>
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.main>
        )}

        {/* 5. CONTACT PAGE */}
        {currentPage === 'contact' && (
          <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col justify-center py-12 px-6 md:px-12 lg:px-20 w-full max-w-[1200px] mx-auto relative z-10"
          >
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-3 text-gray-400 font-medium tracking-widest text-[11px] uppercase mb-4">
                <Hexagon className="w-4 h-4" />
                <span>Get In Touch</span>
              </motion.div>
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
                Initiate Contact
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="mt-6 text-gray-400 font-light leading-relaxed text-[15px] md:text-base">
                Whether you are interested in partnership opportunities, exploring our clinical diagnostic tools, or inquiring about our smart gesture technologies, our team is ready to connect.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto"
            >
              {/* Email Card */}
              <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center gap-4 p-8 md:p-10 rounded-3xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md hover:bg-black/60 transition-colors duration-500">
                <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.1] flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">Digital Correspondence</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-4 flex-grow">For general inquiries, collaborations, and support, reach out to us via email.</p>
                <a href="mailto:labssynerksis@gmail.com" className="text-gray-300 hover:text-white text-lg font-medium transition-colors break-all">
                  labssynerksis@gmail.com
                </a>
              </motion.div>

              {/* Phone Card */}
              <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center gap-4 p-8 md:p-10 rounded-3xl bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md hover:bg-black/60 transition-colors duration-500">
                <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.1] flex items-center justify-center mb-2">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">Direct Lines</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-4 flex-grow">Speak directly with our founders regarding immediate opportunities.</p>
                <div className="flex flex-col gap-3 text-gray-300 text-lg font-medium">
                  <a href="tel:+916295192682" className="hover:text-white transition-colors">+91 62951 92682</a>
                  <a href="tel:+916289853234" className="hover:text-white transition-colors">+91 62898 53234</a>
                  <a href="tel:+919330374529" className="hover:text-white transition-colors">+91 93303 74529</a>
                </div>
              </motion.div>
            </motion.div>
          </motion.main>
        )}

      </div>
      
      {/* --- FOOTER (Responsive Layout) --- */}
      <footer className="relative z-50 flex flex-col md:flex-row items-center justify-between px-6 py-8 md:px-12 lg:px-20 w-full text-gray-500 bg-transparent">
        <div className="flex flex-col md:flex-row gap-6 mb-4 md:mb-0 w-full max-w-[1600px] mx-auto justify-between items-center text-center md:text-left">
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/company/synerksislabs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            
            <a href="mailto:labssynerksis@gmail.com" aria-label="Email" className="hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>

          </div>
          <div className="text-[13px] leading-relaxed tracking-wide">
            <p>© 2026 Synerksis LABS</p>
            <p>Based in Kolkata, India</p>
          </div>
        </div>
      </footer>

      {/* --- ENLARGED IMAGE MODAL (Lightbox) --- */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
            onClick={() => setEnlargedImage(null)}
          >
            <button className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-[101]">
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full aspect-square md:aspect-auto md:max-h-[75vh] bg-[#111] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 cursor-default"
              onClick={(e) => e.stopPropagation()} 
            >
              <img 
                src={enlargedImage} 
                alt="Enlarged Team Member" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=Team+Member&background=0D0D0D&color=fff&size=500`;
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}