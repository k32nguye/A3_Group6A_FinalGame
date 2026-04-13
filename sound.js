// =====================
// SYNTHESIZED AUDIO
// Uses p5.js Oscillator — no audio files needed
// =====================

let _audioUnlocked = false;
let _bgmEnabled = true;

function unlockAudio() {
  // p5.sound requires a user gesture before playing
  if (!_audioUnlocked) {
    getAudioContext().resume();
    _audioUnlocked = true;
  }
}

function startBgmLoop() {
  try {
    unlockAudio();
    if (!_bgmEnabled) return;
    if (!bgmTrack || !bgmTrack.isLoaded()) return;
    if (!bgmTrack.isPlaying()) {
      bgmTrack.setVolume(0.22);
      bgmTrack.loop();
    }
  } catch (e) {
    // Silently ignore audio errors
  }
}

function toggleBgm() {
  _bgmEnabled = !_bgmEnabled;
  try {
    if (!bgmTrack || !bgmTrack.isLoaded()) return;
    if (_bgmEnabled) {
      startBgmLoop();
    } else if (bgmTrack.isPlaying()) {
      bgmTrack.stop();
    }
  } catch (e) {
    // Silently ignore audio errors
  }
}

function isBgmEnabled() {
  return _bgmEnabled;
}

function playSound(type) {
  try {
    unlockAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    if (type === "click") {
      _beep(ctx, 880, "sine", 0.08, 0.06);
    } else if (type === "correct") {
      _beep(ctx, 523, "sine", 0.18, 0.15); // C5
      _beepDelay(ctx, 659, "sine", 0.18, 0.18, 0.16); // E5
    } else if (type === "wrong") {
      _beep(ctx, 220, "sawtooth", 0.22, 0.28);
      _beepDelay(ctx, 160, "sawtooth", 0.22, 0.25, 0.22);
    } else if (type === "tick") {
      _beep(ctx, 440, "square", 0.06, 0.05);
    } else if (type === "levelup") {
      // 4-note ascending arpeggio
      _beepDelay(ctx, 392, "sine", 0.18, 0.12, 0.0);
      _beepDelay(ctx, 523, "sine", 0.18, 0.12, 0.13);
      _beepDelay(ctx, 659, "sine", 0.18, 0.12, 0.26);
      _beepDelay(ctx, 784, "sine", 0.22, 0.22, 0.39);
    } else if (type === "cvdshift") {
      // Low unsettling drone
      _beepDelay(ctx, 110, "sawtooth", 0.12, 0.7, 0.0);
      _beepDelay(ctx, 116, "sawtooth", 0.08, 0.5, 0.2);
    } else if (type === "scenario") {
      _beep(ctx, 330, "triangle", 0.15, 0.2);
      _beepDelay(ctx, 277, "triangle", 0.12, 0.2, 0.22);
    }
  } catch (e) {
    // Silently ignore audio errors
  }
}

function _beep(ctx, freq, type, gain, duration) {
  _beepDelay(ctx, freq, type, gain, duration, 0);
}

function _beepDelay(ctx, freq, type, gain, duration, delay) {
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();

  osc.connect(vol);
  vol.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

  vol.gain.setValueAtTime(0, ctx.currentTime + delay);
  vol.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
  vol.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + delay + duration,
  );

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.01);
}
