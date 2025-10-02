let currentAudio: HTMLAudioElement | null = null;

function stopCurrentSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function playFlipSound() {
  stopCurrentSound();
  currentAudio = new Audio('../assets/audio/flip.mp3');
  currentAudio.play();
}

export function playMatchSound() {
  stopCurrentSound();
  currentAudio = new Audio('../assets/audio/good.mp3');
  currentAudio.play();
}

export function playNoMatchSound() {
  stopCurrentSound();
  currentAudio = new Audio('../assets/audio/fail.mp3');
  currentAudio.play();
}

export function playWinSound() {
  stopCurrentSound();
  currentAudio = new Audio('../assets/audio/game-over.mp3');
  currentAudio.play();
}
