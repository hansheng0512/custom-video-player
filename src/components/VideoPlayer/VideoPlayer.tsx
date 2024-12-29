import React, {useState, useRef, useEffect, MouseEvent} from 'react';
import {Play, Pause, Volume2, VolumeX, Maximize, Minimize, Rewind} from 'lucide-react';
import {VideoPlayerState, VideoPlayerRefs} from './types';

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({videoUrl, className = ''}) => {
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    currentTime: 0,
    duration: 0,
    isDragging: false,
  });

  const refs = {
    video: useRef<HTMLVideoElement>(null),
    container: useRef<HTMLDivElement>(null),
    progressBar: useRef<HTMLDivElement>(null),
    lastValidTime: useRef<number>(0),
  } as VideoPlayerRefs;

  useEffect(() => {
    const video = refs.video;
    if (!video?.current) return;

    const handleLoadedMetadata = (): void => {
      setPlayerState(prev => ({
        ...prev,
        duration: video.current?.duration || 0
      }));
    };

    const preventRateChange = (): void => {
      if (video.current && video.current.playbackRate !== 1) {
        video.current.playbackRate = 1;
      }
    };

    const preventKeyboardShortcuts = (e: KeyboardEvent): void => {
      const preventedKeys = ['ArrowRight', 'L', 'l', '>', '.'];
      if (preventedKeys.includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleTimeUpdate = (): void => {
      if (!video.current) return;

      if (!playerState.isDragging && video.current.currentTime > refs.lastValidTime.current + 0.5) {
        video.current.currentTime = refs.lastValidTime.current;
      } else {
        refs.lastValidTime.current = video.current.currentTime;
        setPlayerState(prev => ({
          ...prev,
          currentTime: video.current?.currentTime || 0
        }));
      }
    };

    const handleSeeking = (): void => {
      if (video.current && video.current.currentTime > refs.lastValidTime.current) {
        video.current.currentTime = refs.lastValidTime.current;
      }
    };

    const preventVideoClick = (e: Event): void => {
      e.preventDefault();
    };

    video.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.current.addEventListener('ratechange', preventRateChange);
    video.current.addEventListener('timeupdate', handleTimeUpdate);
    video.current.addEventListener('seeking', handleSeeking);
    video.current.addEventListener('click', preventVideoClick);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    return () => {
      video.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.current?.removeEventListener('ratechange', preventRateChange);
      video.current?.removeEventListener('timeupdate', handleTimeUpdate);
      video.current?.removeEventListener('seeking', handleSeeking);
      video.current?.removeEventListener('click', preventVideoClick);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, [playerState.isDragging]);

  const handleMouseMove = (e: MouseEvent): void => {
    if (playerState.isDragging && refs.progressBar.current && refs.video.current) {
      e.preventDefault();
      const rect = refs.progressBar.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const newTime = position * playerState.duration;

      if (newTime <= refs.lastValidTime.current) {
        refs.video.current.currentTime = newTime;
        setPlayerState(prev => ({...prev, currentTime: newTime}));
      }
    }
  };

  const handleMouseUp = (): void => {
    setPlayerState(prev => ({...prev, isDragging: false}));
    document.removeEventListener('mousemove', handleMouseMove as any);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: MouseEvent): void => {
    if (!refs.progressBar.current || !refs.video.current) return;

    const rect = refs.progressBar.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * playerState.duration;

    if (newTime <= refs.lastValidTime.current) {
      setPlayerState(prev => ({...prev, isDragging: true}));
      refs.video.current.currentTime = newTime;
      setPlayerState(prev => ({...prev, currentTime: newTime}));

      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const togglePlay = (): void => {
    if (!refs.video.current) return;

    if (playerState.isPlaying) {
      refs.video.current.pause();
    } else {
      refs.video.current.play();
    }
    setPlayerState(prev => ({...prev, isPlaying: !prev.isPlaying}));
  };

  const handleBackward = (): void => {
    if (!refs.video.current) return;

    const newTime = Math.max(refs.video.current.currentTime - 10, 0);
    refs.video.current.currentTime = newTime;
    refs.lastValidTime.current = newTime;
    setPlayerState(prev => ({...prev, currentTime: newTime}));
  };

  const toggleMute = (): void => {
    if (!refs.video.current) return;

    refs.video.current.muted = !refs.video.current.muted;
    setPlayerState(prev => ({...prev, isMuted: !prev.isMuted}));
  };

  const toggleFullscreen = async (): Promise<void> => {
    if (!document.fullscreenElement) {
      await refs.container.current?.requestFullscreen();
      setPlayerState(prev => ({...prev, isFullscreen: true}));
    } else {
      await document.exitFullscreen();
      setPlayerState(prev => ({...prev, isFullscreen: false}));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative w-full max-w-3xl mx-auto ${className}`} ref={refs.container}>
      <video
        ref={refs.video}
        className="w-full rounded-lg select-none"
        controls={false}
        onContextMenu={(e): void => e.preventDefault()}
      >
        <source src={videoUrl} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
        <div className="flex items-center space-x-2 mb-2">
          <div
            ref={refs.progressBar}
            className="relative w-full h-2 bg-gray-600 rounded cursor-pointer"
            onMouseDown={handleMouseDown}
          >
            <div
              className="absolute h-full bg-white rounded"
              style={{width: `${(playerState.currentTime / playerState.duration) * 100}%`}}
            />
          </div>
          <span className="text-white text-sm whitespace-nowrap">
            {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={playerState.isPlaying ? 'Pause' : 'Play'}
            >
              {playerState.isPlaying ? (
                <Pause className="w-6 h-6"/>
              ) : (
                <Play className="w-6 h-6"/>
              )}
            </button>

            <button
              onClick={handleBackward}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <Rewind className="w-6 h-6"/>
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={playerState.isMuted ? 'Unmute' : 'Mute'}
            >
              {playerState.isMuted ? (
                <VolumeX className="w-6 h-6"/>
              ) : (
                <Volume2 className="w-6 h-6"/>
              )}
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={playerState.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {playerState.isFullscreen ? (
              <Minimize className="w-6 h-6"/>
            ) : (
              <Maximize className="w-6 h-6"/>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;