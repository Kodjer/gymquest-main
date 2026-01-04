// src/lib/gameEffects.ts

/**
 * Р’РѕСЃРїСЂРѕРёР·РІРѕРґРёС‚ Р·РІСѓРє СѓСЃРїРµС…Р° РїСЂРё РІС‹РїРѕР»РЅРµРЅРёРё РєРІРµСЃС‚Р°
 */
export function playSuccessSound() {
  // РЎРѕР·РґР°РµРј Р°СѓРґРёРѕ РєРѕРЅС‚РµРєСЃС‚ РґР»СЏ РіРµРЅРµСЂР°С†РёРё Р·РІСѓРєР°
  if (typeof window !== "undefined") {
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      // РЎРѕР·РґР°РµРј РїРѕСЃР»РµРґРѕРІР°С‚РµР»СЊРЅРѕСЃС‚СЊ РЅРѕС‚ РґР»СЏ РјРµР»РѕРґРёС‡РЅРѕРіРѕ Р·РІСѓРєР° СѓСЃРїРµС…Р°
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (РјР°Р¶РѕСЂРЅРѕРµ С‚СЂРµР·РІСѓС‡РёРµ)

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = "sine";

        // РќР°СЃС‚СЂРѕР№РєР° РѕРіРёР±Р°СЋС‰РµР№ Р·РІСѓРєР°
        const startTime = audioContext.currentTime + index * 0.1;
        const duration = 0.15;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      console.log("Audio not supported:", error);
    }
  }
}

/**
 * Р’РѕСЃРїСЂРѕРёР·РІРѕРґРёС‚ Р·РІСѓРє РґР»СЏ СЂР°Р·РЅС‹С… СѓСЂРѕРІРЅРµР№ СЃР»РѕР¶РЅРѕСЃС‚Рё
 */
export function playDifficultySound(difficulty: "easy" | "medium" | "hard") {
  if (typeof window !== "undefined") {
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      let frequencies: number[];
      let duration: number;

      switch (difficulty) {
        case "easy":
          frequencies = [440, 554.37]; // A4, C#5
          duration = 0.2;
          break;
        case "medium":
          frequencies = [440, 554.37, 659.25]; // A4, C#5, E5
          duration = 0.3;
          break;
        case "hard":
          frequencies = [440, 554.37, 659.25, 783.99]; // A4, C#5, E5, G5
          duration = 0.4;
          break;
      }

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = "triangle";

        const startTime = audioContext.currentTime + index * 0.08;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      console.log("Audio not supported:", error);
    }
  }
}

/**
 * РљРѕРјР±РёРЅРёСЂРѕРІР°РЅРЅС‹Р№ СЌС„С„РµРєС‚: Р·РІСѓРє РїСЂРё РІС‹РїРѕР»РЅРµРЅРёРё РєРІРµСЃС‚Р°
 */
export function celebrateQuestComplete(difficulty: "easy" | "medium" | "hard") {
  const { soundEnabled } = getAudioSettings();

  if (soundEnabled) {
    playSuccessSound();
    // РќРµР±РѕР»СЊС€Р°СЏ Р·Р°РґРµСЂР¶РєР° РјРµР¶РґСѓ Р·РІСѓРєР°РјРё РґР»СЏ Р»СѓС‡С€РµРіРѕ СЌС„С„РµРєС‚Р°
    setTimeout(() => {
      playDifficultySound(difficulty);
    }, 200);
  }
}

/**
 * Р­С„С„РµРєС‚ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РґРѕСЃС‚РёР¶РµРЅРёСЏ
 */
export function celebrateAchievement() {
  const { soundEnabled } = getAudioSettings();

  if (!soundEnabled) return;

  if (typeof window !== "undefined") {
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      // РўРѕСЂР¶РµСЃС‚РІРµРЅРЅР°СЏ РјРµР»РѕРґРёСЏ РґР»СЏ РґРѕСЃС‚РёР¶РµРЅРёСЏ
      const melody = [
        { freq: 523.25, time: 0 }, // C5
        { freq: 659.25, time: 0.15 }, // E5
        { freq: 783.99, time: 0.3 }, // G5
        { freq: 1046.5, time: 0.45 }, // C6
      ];

      melody.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          note.freq,
          audioContext.currentTime
        );
        oscillator.type = "sine";

        const startTime = audioContext.currentTime + note.time;
        const duration = 0.2;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      console.log("Audio not supported:", error);
    }
  }
}

/**
 * РџСЂРѕРІРµСЂРєР° РЅР°СЃС‚СЂРѕРµРє РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РґР»СЏ Р·РІСѓРєРѕРІ
 */
export function getAudioSettings() {
  if (typeof window !== "undefined") {
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
    return { soundEnabled };
  }

  return { soundEnabled: true };
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window !== "undefined") {
    localStorage.setItem("soundEnabled", enabled.toString());
  }
}
