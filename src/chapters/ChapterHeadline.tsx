import { useEffect, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ChapterHeadline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cosmic particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create golden particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#d4af37' : '#f0d060',
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(Date.now() * 0.002 + p.x));
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.1;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.3, ease: 'easeOut' as any },
    }),
  };

  return (
    <div className="chapter relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-midnight">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,45,142,0.05)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Newspaper transition header */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-b border-champagne-gold/30 py-2 mb-12"
        >
          <p className="text-champagne-gold/40 text-[10px] tracking-[0.5em] uppercase font-sans">
            The Most Important Headline of the Day
          </p>
        </motion.div>

        {/* Date */}
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="text-star-white/30 text-sm tracking-[0.4em] uppercase mb-8 font-sans"
        >
          November 5, 2005
        </motion.p>

        {/* Main name */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="mb-8"
        >
          <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-wide">
            <span className="text-gradient-gold">YUKTHI</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-champagne-gold/50 to-transparent mt-6 max-w-md mx-auto"
          />
        </motion.div>

        {/* Sparkle icon */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          className="mb-8"
        >
          <Sparkles className="w-6 h-6 text-champagne-gold/50 mx-auto" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          className="text-star-white/50 text-lg md:text-xl font-serif italic max-w-2xl mx-auto mb-6 leading-relaxed"
        >
          While the world was making history, a new individual began writing her own.
        </motion.p>

        {/* Was Born text */}
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3.5}
          className="text-star-white/30 text-xs tracking-[0.3em] uppercase mb-12"
        >
          Was Born
        </motion.p>

        {/* Birthday greeting */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
          className="mt-8"
        >
          <p className="font-serif text-3xl md:text-4xl text-gradient-cosmic">
            Happy Birthday, Yukthi!
          </p>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent" />
    </div>
  );
}

