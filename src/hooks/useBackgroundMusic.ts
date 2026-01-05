import { useState, useEffect, useRef, useCallback } from 'react';

// 温馨的钢琴音符频率
const MELODY_NOTES = [
  { freq: 523.25, duration: 0.5 },  // C5
  { freq: 587.33, duration: 0.5 },  // D5
  { freq: 659.25, duration: 0.5 },  // E5
  { freq: 523.25, duration: 0.5 },  // C5
  { freq: 659.25, duration: 0.5 },  // E5
  { freq: 587.33, duration: 0.5 },  // D5
  { freq: 523.25, duration: 1.0 },  // C5
  { freq: 0, duration: 0.5 },       // 休止
  { freq: 392.00, duration: 0.5 },  // G4
  { freq: 440.00, duration: 0.5 },  // A4
  { freq: 493.88, duration: 0.5 },  // B4
  { freq: 523.25, duration: 0.5 },  // C5
  { freq: 493.88, duration: 0.5 },  // B4
  { freq: 440.00, duration: 0.5 },  // A4
  { freq: 392.00, duration: 1.0 },  // G4
  { freq: 0, duration: 0.5 },       // 休止
];

const MUSIC_ENABLED_KEY = 'wardrobe_music_enabled';

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem(MUSIC_ENABLED_KEY);
    return saved === 'true';
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 播放单个音符
  const playNote = useCallback((freq: number, duration: number, startTime: number) => {
    if (!audioContextRef.current || !gainNodeRef.current || freq === 0) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const noteGain = audioContextRef.current.createGain();
    
    oscillator.connect(noteGain);
    noteGain.connect(gainNodeRef.current);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, startTime);
    
    // 柔和的音符包络
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    noteGain.gain.linearRampToValueAtTime(0.2, startTime + duration * 0.5);
    noteGain.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, []);

  // 播放整段旋律
  const playMelody = useCallback(() => {
    if (!audioContextRef.current || !isPlayingRef.current) return;
    
    const startTime = audioContextRef.current.currentTime;
    let currentTime = startTime;
    
    MELODY_NOTES.forEach((note) => {
      if (note.freq > 0) {
        playNote(note.freq, note.duration, currentTime);
      }
      currentTime += note.duration;
    });
    
    // 计算旋律总时长，然后循环播放
    const totalDuration = MELODY_NOTES.reduce((sum, note) => sum + note.duration, 0);
    
    timeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        playMelody();
      }
    }, totalDuration * 1000);
  }, [playNote]);

  // 开始播放
  const startMusic = useCallback(() => {
    if (isPlayingRef.current) return;
    
    try {
      // 创建音频上下文
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      // 创建主音量控制
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.setValueAtTime(0.15, audioContextRef.current.currentTime); // 低音量
      
      isPlayingRef.current = true;
      setIsPlaying(true);
      
      playMelody();
    } catch (error) {
      console.error('无法播放音乐:', error);
    }
  }, [playMelody]);

  // 停止播放
  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  // 切换播放状态
  const toggleMusic = useCallback(() => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    localStorage.setItem(MUSIC_ENABLED_KEY, String(newEnabled));
    
    if (newEnabled) {
      startMusic();
    } else {
      stopMusic();
    }
  }, [isEnabled, startMusic, stopMusic]);

  // 初始化时如果之前开启了音乐，需要用户交互后才能播放
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (isEnabled && !isPlayingRef.current) {
        startMusic();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    if (isEnabled) {
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isEnabled, startMusic]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [stopMusic]);

  return {
    isPlaying,
    isEnabled,
    toggleMusic,
    startMusic,
    stopMusic,
  };
}

export default useBackgroundMusic;
