export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  isDragging: boolean;
}

export interface VideoPlayerRefs {
  video: HTMLVideoElement | null;
  container: HTMLDivElement | null;
  progressBar: HTMLDivElement | null;
  lastValidTime: number;
}