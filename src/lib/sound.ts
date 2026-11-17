/**
 * The invitation's music and mandap sound effects, synthesised live with the
 * Web Audio API, so there are no audio files and no copyright issues.
 *
 *   Music: an original shehnai melody in Raag Bhupali (S R G P D) over a
 *          tanpura drone and a gentle keherwa tabla groove.
 *   Cues:  shankh (conch), temple ghanti, dhol, ghungroo, coin, whoosh, chime.
 *
 * Browsers only allow sound after a tap, so `start()` must be called from a
 * click/tap handler. Everything else is safe to call any time.
 *
 * The couple can swap the synthesised music for their own track via
 * `wedding.music.src` (a file in /public).
 */
import { wedding } from "@/wedding.config";

export type Cue = "doors" | "bells" | "shankh" | "dhol" | "ghungroo" | "coin" | "chime" | "windchime" | "tick";

type State = { started: boolean; muted: boolean };

const PREF_KEY = "shagun-sound";
const SA = 293.66; // tonic (D4), a comfortable shehnai register
const BPM = 76;
const BEAT = 60 / BPM;

let ctx: AudioContext | null = null;
let master: GainNode;
let musicBus: GainNode;
let sfxBus: GainNode;
let reverbIn: GainNode;
let noise: AudioBuffer;
let track: HTMLAudioElement | null = null;
let schedulerTimer: ReturnType<typeof setInterval> | undefined;

const SERVER_STATE: State = { started: false, muted: false };
let state: State = SERVER_STATE;
const listeners = new Set<() => void>();
const emit = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

/* ─────────────── setup ─────────────── */

function makeImpulse(c: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function makeNoise(c: AudioContext) {
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function build() {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC({ latencyHint: "playback" });
  const c = ctx;

  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 3;
  master = c.createGain();
  master.gain.value = 0;
  master.connect(comp).connect(c.destination);

  // A warm hall reverb, like a mandap under a shamiana.
  const verb = c.createConvolver();
  verb.buffer = makeImpulse(c, 2.8, 2.6);
  reverbIn = c.createGain();
  reverbIn.gain.value = 0.32;
  reverbIn.connect(verb).connect(master);

  musicBus = c.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);
  musicBus.connect(reverbIn);

  sfxBus = c.createGain();
  sfxBus.gain.value = 0.85;
  sfxBus.connect(master);
  sfxBus.connect(reverbIn);

  noise = makeNoise(c);
}

/** iOS mutes Web Audio when the ringer switch is off unless the page plays "media". */
function iosPlaybackSession() {
  const nav = navigator as Navigator & { audioSession?: { type: string } };
  if (nav.audioSession) {
    try {
      nav.audioSession.type = "playback";
    } catch {
      /* not supported */
    }
  }
  const silent = new Audio(
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==",
  );
  silent.loop = true;
  silent.volume = 0.01;
  silent.play().catch(() => {});
}

/* ─────────────── small helpers ─────────────── */

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function noiseBurst(t: number, dur: number, type: BiquadFilterType, freq: number, q: number, peak: number, out: AudioNode) {
  const c = ctx!;
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  env(g, t, peak, 0.004, dur);
  src.connect(f).connect(g).connect(out);
  src.start(t, Math.random());
  src.stop(t + dur + 0.05);
}

function partial(t: number, freq: number, amp: number, decay: number, out: AudioNode, type: OscillatorType = "sine") {
  const c = ctx!;
  const o = c.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  const g = c.createGain();
  env(g, t, amp, 0.003, decay);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + decay + 0.1);
}

/* ─────────────── instruments ─────────────── */

/** Temple hand bell: inharmonic partials with long, uneven decays. */
function ghanti(t: number, f = 1180, vol = 0.32) {
  const ratios = [1, 1.51, 2.27, 2.86, 4.18, 5.6];
  const decays = [3.2, 2.4, 1.8, 1.2, 0.8, 0.5];
  ratios.forEach((r, i) => partial(t, f * r * (1 + (Math.random() - 0.5) * 0.002), (vol / (i + 1.2)) * 1.4, decays[i], sfxBus));
  noiseBurst(t, 0.03, "highpass", 5000, 0.7, vol * 0.4, sfxBus);
}

/** Shankh (conch): swells in, holds, and bends up at the end. */
function shankh(t: number, dur = 3.2, f = 220) {
  const c = ctx!;
  const o1 = c.createOscillator();
  const o2 = c.createOscillator();
  o1.type = "sawtooth";
  o2.type = "square";
  o2.detune.value = 6;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1300;
  lp.Q.value = 1.2;
  const body = c.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 650;
  body.Q.value = 2;
  body.gain.value = 9;
  const g = c.createGain();
  const vib = c.createOscillator();
  const vibAmt = c.createGain();
  vib.frequency.value = 4.2;
  vibAmt.gain.value = 7;
  vib.connect(vibAmt);
  vibAmt.connect(o1.detune);
  vibAmt.connect(o2.detune);
  for (const o of [o1, o2]) {
    o.frequency.setValueAtTime(f * 0.88, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.45);
    o.frequency.setValueAtTime(f, t + dur - 0.55);
    o.frequency.exponentialRampToValueAtTime(f * 1.08, t + dur);
    o.connect(lp);
  }
  lp.connect(body).connect(g).connect(sfxBus);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.5);
  g.gain.setValueAtTime(0.16, t + dur - 0.6);
  g.gain.exponentialRampToValueAtTime(0.22, t + dur - 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);
  // breath
  const n = c.createBufferSource();
  n.buffer = noise;
  const nb = c.createBiquadFilter();
  nb.type = "bandpass";
  nb.frequency.value = 1400;
  nb.Q.value = 0.8;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(0.03, t + 0.3);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.2);
  n.connect(nb).connect(ng).connect(sfxBus);
  [o1, o2, vib].forEach((o) => {
    o.start(t);
    o.stop(t + dur + 0.4);
  });
  n.start(t);
  n.stop(t + dur + 0.4);
}

/** Ghungroo: a shimmer of tiny ankle bells. */
function ghungroo(t: number, count = 16, spread = 0.55, vol = 0.045) {
  for (let i = 0; i < count; i++) {
    const at = t + Math.random() * spread;
    const f = 4200 + Math.random() * 3200;
    partial(at, f, vol * (0.5 + Math.random()), 0.12 + Math.random() * 0.1, sfxBus);
    partial(at, f * 1.47, vol * 0.4, 0.08, sfxBus);
  }
}

function coin(t: number) {
  [0, 0.13, 0.22].forEach((d, i) => {
    const v = 0.16 / (i + 1);
    partial(t + d, 2793, v, 0.5, sfxBus);
    partial(t + d, 4186, v * 0.8, 0.35, sfxBus);
    partial(t + d, 6643, v * 0.5, 0.2, sfxBus);
  });
}

function whoosh(t: number) {
  const c = ctx!;
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.4;
  f.frequency.setValueAtTime(300, t);
  f.frequency.exponentialRampToValueAtTime(1800, t + 1.1);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  src.connect(f).connect(g).connect(sfxBus);
  src.start(t);
  src.stop(t + 1.5);
}

/* tabla / dhol */
function bayan(t: number, vol: number, out: AudioNode, from = 115, to = 68) {
  const c = ctx!;
  const o = c.createOscillator();
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + 0.22);
  const g = c.createGain();
  env(g, t, vol, 0.004, 0.5);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.6);
}
function dayan(t: number, vol: number, out: AudioNode) {
  const f = SA * 2;
  partial(t, f, vol, 0.28, out);
  partial(t, f * 2.01, vol * 0.45, 0.16, out);
  partial(t, f * 3.02, vol * 0.25, 0.1, out);
  noiseBurst(t, 0.02, "bandpass", 3500, 1.2, vol * 0.5, out);
}
function tik(t: number, vol: number, out: AudioNode) {
  noiseBurst(t, 0.045, "bandpass", 2800, 1.5, vol, out);
}

function dholFill(t: number) {
  const s = 60 / 150 / 2; // fast sixteenths
  const pat = ["D", "D", "-", "T", "D", "-", "D", "T", "D", "D", "T", "T", "D", "-", "D", "D"];
  pat.forEach((p, i) => {
    const at = t + i * s;
    if (p === "D") {
      bayan(at, 0.55, sfxBus, 95, 55);
      tik(at, 0.12, sfxBus);
    } else if (p === "T") {
      noiseBurst(at, 0.06, "bandpass", 1800, 1, 0.28, sfxBus);
      partial(at, 330, 0.12, 0.12, sfxBus);
    }
  });
}

/* ─────────────── music ─────────────── */

/** Just-intonation ratios for the Bhupali notes. Lower octave: lowercase. */
const NOTE: Record<string, number> = {
  p: 3 / 4, d: 5 / 6, S: 1, R: 9 / 8, G: 5 / 4, P: 3 / 2, D: 5 / 3, "S'": 2, "R'": 9 / 4, "G'": 5 / 2,
};

/** An original melody in Raag Bhupali. [note, beats]; "-" is a rest; "~" marks a slow glide (meend) into the note. */
const MELODY: [string, number][] = [
  ["G", 1], ["R", 0.5], ["S", 0.5], ["R", 1], ["G", 1], ["P", 1.5], ["G", 0.5], ["~D", 2],
  ["P", 1], ["D", 1], ["~S'", 1.5], ["D", 0.5], ["P", 1], ["G", 1], ["~R", 2],
  ["G", 0.5], ["P", 0.5], ["D", 1], ["S'", 1], ["~R'", 1], ["S'", 1], ["D", 0.5], ["P", 0.5], ["~G", 2],
  ["R", 1], ["G", 0.5], ["P", 0.5], ["G", 1], ["R", 1], ["S", 1], ["~d", 1], ["~S", 3], ["-", 1],
];
const MELODY_BEATS = MELODY.reduce((s, [, b]) => s + b, 0); // 32 beats

type Shehnai = { osc: OscillatorNode; gain: GainNode; breath: GainNode };
let shehnai: Shehnai | null = null;

function makeShehnai(): Shehnai {
  const c = ctx!;
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = SA;
  // nasal double-reed colour
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 380;
  const f1 = c.createBiquadFilter();
  f1.type = "peaking";
  f1.frequency.value = 1150;
  f1.Q.value = 2.2;
  f1.gain.value = 10;
  const f2 = c.createBiquadFilter();
  f2.type = "peaking";
  f2.frequency.value = 2700;
  f2.Q.value = 3;
  f2.gain.value = 6;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 4200;
  const gain = c.createGain();
  gain.gain.value = 0;
  // vibrato that the player leans into
  const vib = c.createOscillator();
  vib.frequency.value = 5.4;
  const vibAmt = c.createGain();
  vibAmt.gain.value = 14;
  vib.connect(vibAmt).connect(osc.detune);
  osc.connect(hp).connect(f1).connect(f2).connect(lp).connect(gain).connect(musicBus);
  // reed breath
  const n = c.createBufferSource();
  n.buffer = noise;
  n.loop = true;
  const nb = c.createBiquadFilter();
  nb.type = "bandpass";
  nb.frequency.value = 2600;
  nb.Q.value = 1;
  const breath = c.createGain();
  breath.gain.value = 0;
  n.connect(nb).connect(breath).connect(musicBus);
  osc.start();
  vib.start();
  n.start();
  return { osc, gain, breath };
}

function tanpuraPluck(t: number, ratio: number) {
  const c = ctx!;
  const f = (SA / 2) * ratio;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(3200, t);
  lp.frequency.exponentialRampToValueAtTime(700, t + 2.6); // the "jawari" shimmer settling
  const g = c.createGain();
  env(g, t, 0.085, 0.015, 3.6);
  lp.connect(g).connect(musicBus);
  for (const det of [-4, 3]) {
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.detune.value = det;
    o.connect(lp);
    o.start(t);
    o.stop(t + 3.8);
  }
}

/** Keherwa, 8 bols over 4 beats: Dha Ge Na Ti | Na Ka Dhi Na */
const KEHERWA = ["Dha", "Ge", "Na", "Ti", "Na", "Ka", "Dhi", "Na"];
function tablaBol(t: number, bol: string) {
  const v = 0.22;
  if (bol === "Dha" || bol === "Dhi") {
    bayan(t, v * 1.6, musicBus);
    dayan(t, v * (bol === "Dha" ? 0.9 : 0.7), musicBus);
  } else if (bol === "Ge") bayan(t, v * 1.2, musicBus, 100, 72);
  else if (bol === "Na") dayan(t, v * 0.8, musicBus);
  else tik(t, v * 0.6, musicBus);
}

let loopStart = 0;
let cycle = 0;

/** Schedules one full 32-beat cycle of music starting at `t0`. */
function scheduleCycle(t0: number, n: number) {
  // tanpura: P S S s, every beat, throughout
  const tanpura = [3 / 2, 2, 2, 1];
  for (let b = 0; b < MELODY_BEATS; b++) tanpuraPluck(t0 + b * BEAT, tanpura[b % 4]);

  // tabla joins from the second cycle
  if (n >= 1) {
    for (let b = 0; b < MELODY_BEATS * 2; b++) tablaBol(t0 + b * (BEAT / 2), KEHERWA[b % 8]);
  }

  // shehnai: rests through the very first cycle's opening bars, then sings
  const sh = shehnai!;
  let at = t0;
  const vol = 0.13;
  for (const [raw, beats] of MELODY) {
    const dur = beats * BEAT;
    if (raw === "-") {
      sh.gain.gain.setTargetAtTime(0, at, 0.08);
      sh.breath.gain.setTargetAtTime(0, at, 0.08);
    } else {
      const glide = raw.startsWith("~");
      const f = SA * NOTE[raw.replace("~", "")];
      sh.osc.frequency.setTargetAtTime(f, at - (glide ? 0.12 : 0.02), glide ? 0.09 : 0.02);
      sh.gain.gain.setTargetAtTime(vol, at, 0.04);
      sh.breath.gain.setTargetAtTime(0.012, at, 0.05);
      // a small breath between phrases / articulation dip
      if (dur > 0.3) sh.gain.gain.setTargetAtTime(vol * 0.72, at + dur - 0.07, 0.02);
    }
    at += dur;
  }
}

function startMusic() {
  if (wedding.music?.src) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    track = track ?? new Audio(`${base}${wedding.music.src}`);
    track.loop = true;
    track.volume = 0.6;
    track.play().catch(() => {});
    return;
  }
  const c = ctx!;
  shehnai = shehnai ?? makeShehnai();
  musicBus.gain.setValueAtTime(0.0001, c.currentTime);
  musicBus.gain.exponentialRampToValueAtTime(0.9, c.currentTime + 4);
  loopStart = c.currentTime + 0.1;
  cycle = 0;
  scheduleCycle(loopStart, cycle);
  // keep scheduling one cycle ahead
  clearInterval(schedulerTimer);
  schedulerTimer = setInterval(() => {
    if (!ctx) return;
    const cycleLen = MELODY_BEATS * BEAT;
    const nextStart = loopStart + (cycle + 1) * cycleLen;
    if (ctx.currentTime > nextStart - 3) {
      cycle += 1;
      scheduleCycle(nextStart, cycle);
    }
  }, 500);
}

/* ─────────────── public API ─────────────── */

function readPref(): "on" | "off" | null {
  try {
    return (localStorage.getItem(PREF_KEY) as "on" | "off" | null) ?? null;
  } catch {
    return null;
  }
}
function writePref(v: "on" | "off") {
  try {
    localStorage.setItem(PREF_KEY, v);
  } catch {
    /* ignore */
  }
}

export const sound = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getState: () => state,
  getServerState: (): State => SERVER_STATE,

  /** True if the guest turned sound off on an earlier visit. */
  prefersOff: () => readPref() === "off",

  /** Call from a tap/click. Starts music (and any opening cue) unless muted. */
  start(opening?: Cue) {
    if (typeof window === "undefined") return;
    if (!ctx) {
      build();
      iosPlaybackSession();
    }
    ctx!.resume().catch(() => {});
    if (state.started) return;
    emit({ started: true, muted: false });
    writePref("on");
    master.gain.setTargetAtTime(1, ctx!.currentTime, 0.05);
    if (opening) this.cue(opening);
    // let the shankh and bells ring out before the shehnai comes in
    setTimeout(startMusic, opening ? 2600 : 200);
  },

  setMuted(muted: boolean) {
    if (!state.started) {
      if (!muted) this.start();
      return;
    }
    emit({ muted });
    writePref(muted ? "off" : "on");
    const c = ctx!;
    if (muted) {
      master.gain.setTargetAtTime(0, c.currentTime, 0.08);
      track?.pause();
      setTimeout(() => state.muted && c.suspend(), 400);
    } else {
      c.resume();
      master.gain.setTargetAtTime(1, c.currentTime, 0.1);
      track?.play().catch(() => {});
    }
  },

  /** Plays a one-off sound effect (ignored until sound has been started). */
  cue(name: Cue) {
    if (!ctx || !state.started || state.muted) return;
    const t = ctx.currentTime + 0.02;
    switch (name) {
      case "doors":
        whoosh(t);
        ghanti(t + 0.1);
        ghanti(t + 0.32, 1240);
        shankh(t + 0.5);
        break;
      case "bells":
        [0, 0.2, 0.42, 0.66].forEach((d, i) => ghanti(t + d, i % 2 ? 1240 : 1180, 0.22));
        break;
      case "shankh":
        shankh(t);
        break;
      case "dhol":
        dholFill(t);
        break;
      case "ghungroo":
        ghungroo(t);
        break;
      case "coin":
        coin(t);
        break;
      case "chime":
        ghanti(t, 1760, 0.12);
        break;
      case "windchime":
        [0, 0.35, 0.8, 1.2, 1.7].forEach((d, i) => ghanti(t + d, SA * 4 * [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3][i], 0.06));
        break;
      case "tick":
        ghungroo(t, 5, 0.12, 0.05);
        break;
    }
  },
};

// Pause everything while the tab is hidden; carry on when the guest comes back.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !state.started || state.muted) return;
    if (document.hidden) {
      ctx.suspend();
      track?.pause();
    } else {
      ctx.resume();
      track?.play().catch(() => {});
    }
  });
}

// Development-only handle for inspecting levels from the browser console.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __shagunSound: unknown }).__shagunSound = {
    ctx: () => ctx,
    buses: () => ({ master, musicBus, sfxBus }),
    cue: (name: Cue) => sound.cue(name),
  };
}
