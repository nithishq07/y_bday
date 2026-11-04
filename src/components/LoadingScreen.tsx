import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Rotating celestial animation */}
      <div className="relative w-32 h-32 mb-8">
        {/* Outer orbit ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-galaxy-purple/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Middle orbit ring */}
        <motion.div
          className="absolute inset-3 rounded-full border border-cosmic-blue/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner orbit ring */}
        <motion.div
          className="absolute inset-6 rounded-full border border-champagne-gold/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center star */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-4 h-4 rounded-full bg-champagne-gold shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
        </motion.div>
        {/* Orbiting planet 1 */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0 64px' }}
        >
          <div className="w-2 h-2 rounded-full bg-galaxy-purple-light shadow-[0_0_10px_rgba(155,77,202,0.5)]" />
        </motion.div>
        {/* Orbiting planet 2 */}
        <motion.div
          className="absolute top-3 left-1/2 -translate-x-1/2"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0 52px' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cosmic-blue-light shadow-[0_0_8px_rgba(45,106,143,0.5)]" />
        </motion.div>
      </div>

      <motion.p
        className="font-serif text-lg text-star-white/60 tracking-[0.3em] uppercase"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Aligning the Stars
      </motion.p>
    </motion.div>
  );
}

