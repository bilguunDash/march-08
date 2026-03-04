import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Utensils, Film, Moon, Lock, ArrowRight, Music, Pause } from 'lucide-react';
import React from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop', // Sunset couple
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop', // Laughing
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2070&auto=format&fit=crop', // Holding hands
  'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=2070&auto=format&fit=crop'  // Evening/Night
];

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    }
  };

  return (
    <div className="bg-black text-white font-sans selection:bg-rose-500/30 overflow-x-hidden">
      <audio ref={audioRef} loop preload="auto">
        <source src="https://ia800504.us.archive.org/33/items/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3" type="audio/mpeg" />
      </audio>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <PasswordScreen key="password" onUnlock={handleUnlock} />
        ) : (
          <MainStory key="story" isPlaying={isPlaying} toggleMusic={toggleMusic} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PasswordScreen({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0308' || password.toLowerCase() === 'love') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={IMAGES[0]} 
          alt="bg" 
          className="w-full h-full object-cover opacity-40 blur-sm scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="z-10 w-full max-w-md p-10 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 text-center shadow-2xl">
        <Heart className="w-12 h-12 text-rose-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]" />
        <h1 className="text-3xl font-serif mb-3 tracking-wide">Хувийн урилга</h1>
        <p className="text-white/60 text-sm mb-10 tracking-wider uppercase">Нэвтрэх нууц үгээ оруулна уу</p>
        
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Нууц үг..."
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400 focus:bg-white/10 transition-all text-lg tracking-widest`}
            />
          </div>
          <button 
            type="submit"
            className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl py-4 font-medium tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(251,113,133,0.3)] hover:shadow-[0_0_30px_rgba(251,113,133,0.5)]"
          >
            Нэвтрэх <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        <p className="mt-8 text-xs text-white/30 font-mono">Hint: March 8 (0308)</p>
      </div>
    </motion.div>
  );
}

function MainStory({ isPlaying, toggleMusic }: { isPlaying: boolean, toggleMusic: () => void }) {
  const [currentBg, setCurrentBg] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative"
    >
      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/40 transition-all"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>

      {/* Fixed Backgrounds with Crossfade */}
      <div className="fixed inset-0 z-0">
        {IMAGES.map((img, index) => (
          <motion.div
            key={img}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBg === index ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.img 
              src={img} 
              alt="bg" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              animate={{ scale: currentBg === index ? [1, 1.05] : 1 }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            />
            <div className={`absolute inset-0 ${currentBg === 0 ? 'bg-black/55' : 'bg-black/70 backdrop-blur-md'}`} />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Section1 onEnter={() => setCurrentBg(0)} />
        <Section2 onEnter={() => setCurrentBg(1)} />
        <Section3 onEnter={() => setCurrentBg(2)} />
        <Section4 onEnter={() => setCurrentBg(3)} />
      </div>
    </motion.div>
  );
}

const Section = ({ children, onEnter, className = "" }: { children: React.ReactNode, onEnter: () => void, className?: string }) => {
  return (
    <motion.div 
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-20 ${className}`}
      onViewportEnter={onEnter}
      viewport={{ amount: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

function Section1({ onEnter }: { onEnter: () => void }) {
  return (
    <Section onEnter={onEnter} className="text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="max-w-3xl mx-auto z-10"
      >
        <h2 className="text-rose-300 font-serif italic text-2xl md:text-3xl mb-8 opacity-90">Миний хамгийн онцгой хүн…</h2>
        <h1 className="text-6xl md:text-8xl font-bold mb-10 tracking-tight font-serif">Өнөөдөр бол<br/>чиний өдөр.</h1>
        <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
          Гэхдээ үнэндээ… <br className="md:hidden" />чи бол миний өдөр бүрийн аз жаргал.
        </p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3 text-white/50 text-xs uppercase tracking-[0.3em]">
          <span>Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </motion.div>
    </Section>
  );
}

function Section2({ onEnter }: { onEnter: () => void }) {
  return (
    <Section onEnter={onEnter} className="max-w-3xl mx-auto">
      <div className="space-y-48 w-full py-32">
        <FadeInText>
          <p className="text-3xl md:text-5xl font-serif italic leading-relaxed text-center text-white/90">
            "Чамайг анх харахад зүгээр л нэг инээмсэглэл байсан…"
          </p>
        </FadeInText>
        
        <FadeInText>
          <p className="text-3xl md:text-5xl font-serif italic leading-relaxed text-center text-white/90">
            "Харин одоо чи миний тайван байдал, урам зориг…"
          </p>
        </FadeInText>
        
        <FadeInText>
          <div className="text-center">
            <p className="text-4xl md:text-6xl font-bold leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-rose-100">
              "Чи бол миний хамгийн зөв сонголт."
            </p>
            {/* <p className="mt-8 text-rose-400/60 font-mono text-sm md:text-base">git commit -m "Found the one" --amend</p> */}
          </div>
        </FadeInText>
      </div>
    </Section>
  );
}

function FadeInText({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, margin: "-20%" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Section3({ onEnter }: { onEnter: () => void }) {
  return (
    <Section onEnter={onEnter}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="text-center"
      >
        <Heart className="w-20 h-20 text-rose-500/50 mx-auto mb-10 animate-pulse" />
        <h2 className="text-4xl md:text-6xl font-light tracking-wide font-serif italic">Бидний түүх үргэлжилсээр...</h2>
      </motion.div>
    </Section>
  );
}

function Section4({ onEnter }: { onEnter: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: 'dinner', title: 'Romantic Dinner', icon: Utensils, desc: '19:00-д бэлэн бай. Би чамайг авна.' },
    { id: 'movie', title: 'Movie Night', icon: Film, desc: 'Чиний дуртай кино, миний тэврэлт.' },
    { id: 'walk', title: 'Evening Walk', icon: Moon, desc: 'Хот унтах үед бидний түүх үргэлжилнэ.' },
  ];

  return (
    <Section onEnter={onEnter} className="min-h-screen">
      <div className="max-w-5xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-serif">Өнөө оройг чи<br/>хэрхэн өнгөрүүлэх вэ?</h2>
          <p className="text-white/60 text-lg">Өөрийнхөө хүссэн сонголтоо хийгээрэй</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div 
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {options.map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    onClick={() => setSelected(opt.id)}
                    className="group relative p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rose-400/50 transition-all overflow-hidden text-left flex flex-col items-center text-center backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-500/0 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-rose-500/30 border border-rose-500/20">
                      <Icon className="w-8 h-8 text-rose-300" />
                    </div>
                    <h3 className="text-2xl font-serif mb-3">{opt.title}</h3>
                    <p className="text-sm text-white/40 group-hover:text-white/80 transition-colors tracking-widest uppercase">Сонгох</p>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-12 md:p-20 rounded-3xl bg-black/40 backdrop-blur-xl border border-rose-500/30 relative overflow-hidden max-w-2xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <Heart className="w-20 h-20 text-rose-500 mx-auto mb-8 animate-pulse" />
                <h3 className="text-4xl md:text-5xl font-serif mb-6">Гайхалтай сонголт!</h3>
                <p className="text-2xl md:text-3xl text-rose-200 font-light italic leading-relaxed">
                  "{options.find(o => o.id === selected)?.desc}"
                </p>
                <button 
                  onClick={() => setSelected(null)}
                  className="mt-16 text-sm text-white/40 hover:text-white/80 underline underline-offset-8 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  Сонголтоо өөрчлөх
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
