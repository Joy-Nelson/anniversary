import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Sparkles, Flame, Calendar } from 'lucide-react';

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export const RelationshipTimerScene: React.FC = () => {
  const [elapsed, setElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  useEffect(() => {
    const startDate = new Date(2023, 8, 6, 0, 0, 0); // Sept 6, 2023 00:00:00

    const updateTimer = () => {
      const now = new Date();
      
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonthLastDay;
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      const diffTime = Math.abs(now.getTime() - startDate.getTime());
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      setElapsed({ years, months, days, hours, minutes, seconds, totalDays });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'YEARS', value: elapsed.years, highlight: false },
    { label: 'MONTHS', value: elapsed.months, highlight: false },
    { label: 'DAYS', value: elapsed.days, highlight: false },
    { label: 'HOURS', value: elapsed.hours, highlight: false },
    { label: 'MINUTES', value: elapsed.minutes, highlight: false },
    { label: 'SECONDS', value: elapsed.seconds, highlight: true }
  ];

  return (
    <section className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center relative select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center"
      >
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ktm-orange/40 bg-ktm-orange/10 text-ktm-orange text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_25px_rgba(255,102,0,0.25)]">
          <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          LIVE TIME COUNTER // SINCE SEPT 6, 2023
        </div>

        <h2 className="font-heading text-3xl md:text-5xl text-white font-extrabold tracking-wider mb-4">
          EVERY SECOND WITH YOU
        </h2>

        <p className="font-emotional text-xl md:text-2xl text-silver/80 mb-12 italic max-w-2xl mx-auto">
          "From the very first spark on September 6, 2023 — time stopped being measured in clocks, and started being measured in us."
        </p>

        {/* Aesthetic Live Clock Display Canvas */}
        <div className="glass-panel-gold p-8 md:p-12 rounded-3xl border border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden mb-10">
          
          {/* Background Ambient Glow Orbs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-ktm-orange/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

          {/* Date Stamp Tag */}
          <div className="inline-flex items-center gap-2 text-xs font-mono text-gold mb-8 bg-black/60 px-5 py-2 rounded-full border border-gold/30">
            <Calendar className="w-4 h-4 text-gold" />
            <span>START DATE: 6 SEPTEMBER 2023 // 00:00:00 HRS</span>
          </div>

          {/* 6 Grid Unit Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 w-full mb-8">
            {timeUnits.map((unit) => (
              <motion.div
                key={unit.label}
                whileHover={{ scale: 1.05 }}
                className={`p-4 md:p-5 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
                  unit.highlight
                    ? 'bg-gradient-to-b from-ktm-orange/20 to-black border-ktm-orange/60 shadow-[0_0_25px_rgba(255,102,0,0.3)]'
                    : 'bg-black/60 border-gold/25 shadow-lg'
                }`}
              >
                <div
                  className={`font-heading text-3xl md:text-4xl font-extrabold tracking-tight mb-1 ${
                    unit.highlight ? 'text-ktm-orange animate-pulse' : 'text-white'
                  }`}
                >
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div
                  className={`text-[10px] md:text-xs font-mono font-bold tracking-widest ${
                    unit.highlight ? 'text-ktm-orange' : 'text-gold/80'
                  }`}
                >
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Milestone Badge Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-silver/80 pt-4 border-t border-gold/20">
            <span className="flex items-center gap-1.5 text-gold">
              <Flame className="w-4 h-4 text-ktm-orange" />
              <strong>{elapsed.totalDays}</strong> DAYS OF LOVE
            </span>
            <span className="text-silver/40">•</span>
            <span className="flex items-center gap-1.5 text-silver/90">
              <Heart className="w-4 h-4 text-ktm-orange fill-ktm-orange animate-ping" style={{ animationDuration: '3s' }} />
              <strong>{(elapsed.totalDays * 115200).toLocaleString()}</strong> ESTIMATED HEARTBEATS SHARED
            </span>
          </div>
        </div>

        {/* Aesthetic Quote Note */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-gold/80 bg-black/60 px-6 py-3 rounded-full border border-gold/30 shadow-md">
          <Sparkles className="w-4 h-4 text-gold" />
          <span>OUR STORY IS STILL BEING WRITTEN, SECOND BY SECOND</span>
        </div>
      </motion.div>
    </section>
  );
};

export default RelationshipTimerScene;
