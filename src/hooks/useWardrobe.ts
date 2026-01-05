import { useState, useCallback, useEffect } from 'react';
import type { WardrobeState } from '../types';

const SOUND_ENABLED_KEY = 'wardrobe_sound_enabled';

export function useWardrobe() {
  const [state, setState] = useState<WardrobeState>({
    isOpen: false,
    activeArea: null,
    soundEnabled: false,
  });

  // 从 localStorage 读取音效设置
  useEffect(() => {
    const saved = localStorage.getItem(SOUND_ENABLED_KEY);
    if (saved !== null) {
      setState(prev => ({ ...prev, soundEnabled: saved === 'true' }));
    }
  }, []);

  // 播放开门音效
  const playOpenSound = useCallback(() => {
    if (!state.soundEnabled) return;
    // 使用 Web Audio API 生成简单的开门声音
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // 忽略音频错误
    }
  }, [state.soundEnabled]);

  // 播放关门音效
  const playCloseSound = useCallback(() => {
    if (!state.soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch {
      // 忽略音频错误
    }
  }, [state.soundEnabled]);

  // 打开衣柜
  const openWardrobe = useCallback(() => {
    playOpenSound();
    setState(prev => ({ ...prev, isOpen: true }));
  }, [playOpenSound]);

  // 关闭衣柜
  const closeWardrobe = useCallback(() => {
    playCloseSound();
    setState(prev => ({ ...prev, isOpen: false, activeArea: null }));
  }, [playCloseSound]);

  // 切换衣柜状态
  const toggleWardrobe = useCallback(() => {
    if (state.isOpen) {
      closeWardrobe();
    } else {
      openWardrobe();
    }
  }, [state.isOpen, openWardrobe, closeWardrobe]);

  // 设置活动区域
  const setActiveArea = useCallback((area: WardrobeState['activeArea']) => {
    setState(prev => ({ ...prev, activeArea: area }));
  }, []);

  // 切换音效
  const toggleSound = useCallback(() => {
    setState(prev => {
      const newEnabled = !prev.soundEnabled;
      localStorage.setItem(SOUND_ENABLED_KEY, String(newEnabled));
      return { ...prev, soundEnabled: newEnabled };
    });
  }, []);

  return {
    ...state,
    openWardrobe,
    closeWardrobe,
    toggleWardrobe,
    setActiveArea,
    toggleSound,
  };
}

export default useWardrobe;
