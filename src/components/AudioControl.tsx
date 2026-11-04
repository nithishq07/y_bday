import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioControl() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create ambient audio context with generated tone (no external file needed)
    // This creates a gentle ambient space drone using Web Audio API
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a gentle drone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = 'sine';
    osc1.frequency.value = 110; // Low A
    osc2.type = 'sine';
    osc2.frequency.value = 165; // E above
    
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    filter.Q.value = 1;
    
    gain.gain.value = 0;
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    
    // Slowly modulate the filter for a living feel
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    
    // Store reference for mute/unmute
    (audioRef as any).current = { ctx, gain };
    
    return () => {
      osc1.stop();
      osc2.stop();
      lfo.stop();
      ctx.close();
    };
  }, []);

  const toggleMute = () => {
    const audio = (audioRef as any).current;
    if (!audio) return;
    
    if (isMuted) {
      audio.ctx.resume();
      audio.gain.gain.linearRampToValueAtTime(0.03, audio.ctx.currentTime + 1);
    } else {
      audio.gain.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 0.5);
    }
    setIsMuted(!isMuted);
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full glass text-star-white/60 hover:text-star-white transition-colors"
      aria-label={isMuted ? 'Unmute ambient audio' : 'Mute ambient audio'}
      title={isMuted ? 'Play ambient audio (generated, royalty-free)' : 'Mute audio'}
    >
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}

