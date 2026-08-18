import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { loadYouTubeIframeAPI } from "../youtube/loadYouTubeAPI.js";

// Renders a hidden (audio-only feel) YouTube player and exposes play/pause/
// seek/volume controls to the parent via ref. Visual UI stays custom (the
// ricksha progress bar etc); this component only owns actual playback.
const YouTubePlayer = forwardRef(function YouTubePlayer(
  { onReady, onStateChange, onError },
  ref
) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeAPI().then((YT) => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        height: "1",
        width: "1",
        playerVars: {
          playsinline: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => onReady && onReady(),
          onStateChange: (e) => onStateChange && onStateChange(e.data),
          onError: (e) => onError && onError(e.data),
        },
      });
    });

    return () => {
      cancelled = true;
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    loadVideo(videoId, autoplay) {
      if (!playerRef.current) return;
      if (autoplay) playerRef.current.loadVideoById(videoId);
      else playerRef.current.cueVideoById(videoId);
    },
    play() {
      playerRef.current && playerRef.current.playVideo();
    },
    pause() {
      playerRef.current && playerRef.current.pauseVideo();
    },
    seekTo(seconds) {
      playerRef.current && playerRef.current.seekTo(seconds, true);
    },
    setVolume(vol0to1) {
      playerRef.current && playerRef.current.setVolume(Math.round(vol0to1 * 100));
    },
    getCurrentTime() {
      return playerRef.current ? playerRef.current.getCurrentTime() : 0;
    },
    getDuration() {
      return playerRef.current ? playerRef.current.getDuration() : 0;
    },
  }));

  return <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0 }} ref={containerRef} />;
});

export default YouTubePlayer;
