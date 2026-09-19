let audioContext: AudioContext | null = null;

let soundEnabled = false;

let searchOscillator: OscillatorNode | null = null;
let searchGain: GainNode | null = null;

let pathOscillator: OscillatorNode | null = null;
let pathGain: GainNode | null = null;

let searchPulseInterval: ReturnType<typeof setInterval> | null = null;
let pathPulseInterval: ReturnType<typeof setInterval> | null = null;

/* =====================================================
   AUDIO CONTEXT
===================================================== */

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }

  return audioContext;
}

/* =====================================================
   SOUND ON / OFF
===================================================== */

export function enableAudio(): void {
  soundEnabled = true;

  const context = getAudioContext();

  if (context.state === 'suspended') {
    void context.resume();
  }
}

export function disableAudio(): void {
  soundEnabled = false;
  stopAllSounds();
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/* =====================================================
   SEARCH / ZOOM SOUND
===================================================== */

export function startSearchSound(
  speed: number = 1
): void {
  if (!soundEnabled) return;

  stopSearchSound();

  const context = getAudioContext();

  searchOscillator = context.createOscillator();
  searchGain = context.createGain();

  searchOscillator.type = 'sawtooth';

  const baseFrequency =
    120 + speed * 12;

  const endFrequency =
    420 + speed * 20;

  searchOscillator.frequency.setValueAtTime(
    baseFrequency,
    context.currentTime
  );

  searchOscillator.frequency.linearRampToValueAtTime(
    endFrequency,
    context.currentTime + 1.2 / speed
  );

  searchGain.gain.setValueAtTime(
    0.0001,
    context.currentTime
  );

  searchGain.gain.linearRampToValueAtTime(
    0.65,
    context.currentTime + 0.12
  );

  searchOscillator.connect(searchGain);
  searchGain.connect(context.destination);

  searchOscillator.start();

  const pulseInterval = Math.max(
    18,
    180 / speed
  );

  searchPulseInterval = setInterval(() => {
    playSearchPulse(speed);
  }, pulseInterval);
}

function playSearchPulse(
  speed: number
): void {
  if (!soundEnabled) return;

  const context = getAudioContext();

  const oscillator =
    context.createOscillator();

  const gain =
    context.createGain();

  oscillator.type = 'square';

  const frequency =
    220 +
    Math.random() * 220 +
    speed * 20;

  oscillator.frequency.setValueAtTime(
    frequency,
    context.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    frequency * 2,
    context.currentTime +
      0.08 / speed
  );

  gain.gain.setValueAtTime(
    0.0001,
    context.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.55,
    context.currentTime + 0.01
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime +
      0.13 / speed
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();

  oscillator.stop(
    context.currentTime +
      Math.max(
        0.05,
        0.14 / speed
      )
  );
}

export function stopSearchSound(): void {
  if (searchPulseInterval) {
    clearInterval(searchPulseInterval);
    searchPulseInterval = null;
  }

  if (
    searchOscillator &&
    searchGain &&
    audioContext
  ) {
    const now =
      audioContext.currentTime;

    searchGain.gain.cancelScheduledValues(
      now
    );

    searchGain.gain.setValueAtTime(
      searchGain.gain.value,
      now
    );

    searchGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.2
    );

    try {
      searchOscillator.stop(
        now + 0.2
      );
    } catch {
      // Oscillator may already be stopped.
    }
  }

  searchOscillator = null;
  searchGain = null;
}

/* =====================================================
   PATH FOUND
===================================================== */

export function playPathFoundSound(
  speed: number = 1
): void {
  if (!soundEnabled) return;

  const context = getAudioContext();

  const pitchMultiplier =
    1 + speed * 0.025;

  /* FIRST BLINK */

  const oscillator1 =
    context.createOscillator();

  const gain1 =
    context.createGain();

  oscillator1.type = 'square';

  oscillator1.frequency.setValueAtTime(
    600 * pitchMultiplier,
    context.currentTime
  );

  oscillator1.frequency.exponentialRampToValueAtTime(
    1100 * pitchMultiplier,
    context.currentTime +
      0.12 / speed
  );

  gain1.gain.setValueAtTime(
    0.0001,
    context.currentTime
  );

  gain1.gain.exponentialRampToValueAtTime(
    0.85,
    context.currentTime + 0.015
  );

  gain1.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime +
      0.18 / speed
  );

  oscillator1.connect(gain1);
  gain1.connect(context.destination);

  oscillator1.start();

  oscillator1.stop(
    context.currentTime +
      Math.max(
        0.1,
        0.2 / speed
      )
  );

  /* SECOND BLINK */

  const oscillator2 =
    context.createOscillator();

  const gain2 =
    context.createGain();

  oscillator2.type = 'square';

  oscillator2.frequency.setValueAtTime(
    900 * pitchMultiplier,
    context.currentTime +
      0.08 / speed
  );

  oscillator2.frequency.exponentialRampToValueAtTime(
    1600 * pitchMultiplier,
    context.currentTime +
      0.2 / speed
  );

  gain2.gain.setValueAtTime(
    0.0001,
    context.currentTime +
      0.07 / speed
  );

  gain2.gain.exponentialRampToValueAtTime(
    0.75,
    context.currentTime +
      0.09 / speed
  );

  gain2.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime +
      0.3 / speed
  );

  oscillator2.connect(gain2);
  gain2.connect(context.destination);

  oscillator2.start(
    context.currentTime +
      0.07 / speed
  );

  oscillator2.stop(
    context.currentTime +
      Math.max(
        0.15,
        0.32 / speed
      )
  );
}

/* =====================================================
   PATH TRAVEL / ZOOM SOUND
===================================================== */

export function startPathTravelSound(
  speed: number = 1
): void {
  if (!soundEnabled) return;

  stopPathTravelSound();

  const context = getAudioContext();

  pathOscillator =
    context.createOscillator();

  pathGain =
    context.createGain();

  pathOscillator.type = 'sawtooth';

  const baseFrequency =
    240 + speed * 15;

  const endFrequency =
    700 + speed * 25;

  pathOscillator.frequency.setValueAtTime(
    baseFrequency,
    context.currentTime
  );

  pathOscillator.frequency.linearRampToValueAtTime(
    endFrequency,
    context.currentTime +
      1 / speed
  );

  pathGain.gain.setValueAtTime(
    0.0001,
    context.currentTime
  );

  pathGain.gain.linearRampToValueAtTime(
    0.60,
    context.currentTime + 0.12
  );

  pathOscillator.connect(pathGain);
  pathGain.connect(context.destination);

  pathOscillator.start();

  const pulseInterval = Math.max(
    14,
    140 / speed
  );

  pathPulseInterval = setInterval(() => {
    playPathPulse(speed);
  }, pulseInterval);
}

function playPathPulse(
  speed: number
): void {
  if (!soundEnabled) return;

  const context = getAudioContext();

  const oscillator =
    context.createOscillator();

  const gain =
    context.createGain();

  oscillator.type = 'square';

  const frequency =
    300 +
    Math.random() * 350 +
    speed * 25;

  oscillator.frequency.setValueAtTime(
    frequency,
    context.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    frequency * 1.5,
    context.currentTime +
      0.09 / speed
  );

  gain.gain.setValueAtTime(
    0.0001,
    context.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.65,
    context.currentTime + 0.015
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime +
      0.12 / speed
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();

  oscillator.stop(
    context.currentTime +
      Math.max(
        0.04,
        0.13 / speed
      )
  );
}

export function stopPathTravelSound(): void {
  if (pathPulseInterval) {
    clearInterval(pathPulseInterval);
    pathPulseInterval = null;
  }

  if (
    pathOscillator &&
    pathGain &&
    audioContext
  ) {
    const now =
      audioContext.currentTime;

    pathGain.gain.cancelScheduledValues(
      now
    );

    pathGain.gain.setValueAtTime(
      pathGain.gain.value,
      now
    );

    pathGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.2
    );

    try {
      pathOscillator.stop(
        now + 0.2
      );
    } catch {
      // Oscillator may already be stopped.
    }
  }

  pathOscillator = null;
  pathGain = null;
}

/* =====================================================
   FINAL DESTINATION
===================================================== */

export function playDestinationSound(
  speed: number = 1
): void {
  if (!soundEnabled) return;

  const context = getAudioContext();

  const pitchMultiplier =
    1 + speed * 0.025;

  const oscillator =
    context.createOscillator();

  const gain =
    context.createGain();

  oscillator.type = 'square';

  oscillator.frequency.setValueAtTime(
    700 * pitchMultiplier,
    context.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    1200 * pitchMultiplier,
    context.currentTime +
      0.15 / speed
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    1800 * pitchMultiplier,
    context.currentTime +
      0.3 / speed
  );

  gain.gain.setValueAtTime(
    0.0001,
    context.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.90,
    context.currentTime + 0.02
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime +
      0.38 / speed
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();

  oscillator.stop(
    context.currentTime +
      Math.max(
        0.15,
        0.4 / speed
      )
  );
}

/* =====================================================
   STOP EVERYTHING
===================================================== */

export function stopAllSounds(): void {
  stopSearchSound();
  stopPathTravelSound();
}