"use client";

let audioCtx: AudioContext | null = null;
let muted = false;

const initAudio = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

// Check localStorage for persistency
if (typeof window !== "undefined") {
  muted = localStorage.getItem("cyber-portfolio-mute") === "true";
}

export const getMutedState = () => muted;

export const setMutedState = (state: boolean) => {
  muted = state;
  if (typeof window !== "undefined") {
    localStorage.setItem("cyber-portfolio-mute", String(state));
  }
};

export const playClickSound = () => {
  if (muted) return;
  const ctx = initAudio();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    // Pitch sweep: fast decay from 1200Hz to 150Hz in 0.08 seconds
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    // Gain envelope: fast decay to zero
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore errors
  }
};

export const playHoverSound = () => {
  if (muted) return;
  const ctx = initAudio();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "triangle";
    // Very high pitch tick: 3200Hz down to 800Hz in 0.02 seconds
    osc.frequency.setValueAtTime(3200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.02);

    // Gain envelope: extremely quiet, brief tick
    gain.gain.setValueAtTime(0.012, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  } catch {
    // Ignore errors
  }
};

export const playKeyboardSound = () => {
  if (muted) return;
  const ctx = initAudio();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "square";
    // Low mechanical type noise: random frequencies between 180Hz and 320Hz
    const freq = 180 + Math.random() * 140;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Very quiet click
    gain.gain.setValueAtTime(0.006, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // Ignore errors
  }
};

export const playBootEndSound = () => {
  if (muted) return;
  const ctx = initAudio();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  try {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.type = "sine";
    osc2.type = "triangle";

    // Dual sweep harmonizer
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);

    osc2.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore errors
  }
};
