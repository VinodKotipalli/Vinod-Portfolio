// Browser Web Speech API service for Voice Interview

type SpeechRecognitionInstance = any;

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: SpeechRecognitionInstance | null = null;
  private isListeningActive = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public get isVoiceRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  public get isSynthesisSupported(): boolean {
    return !!this.synth;
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.synth) return;

    this.synth.cancel(); // Stop any pending speech

    // Clean markdown symbols for natural speech reading
    const cleanText = text
      .replace(/[`*_#>-]/g, ' ')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const englishVoice =
      voices.find((v) => v.name.includes('Natural') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang === 'en-US') ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public startListening(
    onTranscript: (text: string, isFinal: boolean) => void,
    onError?: (err: any) => void
  ) {
    if (!this.recognition) {
      if (onError) onError(new Error('Speech recognition not supported in this browser.'));
      return;
    }

    if (this.isListeningActive) {
      return;
    }

    try {
      this.isListeningActive = true;
      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const combined = (finalTranscript + ' ' + interimTranscript).trim();
        onTranscript(combined, finalTranscript.length > 0);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech' && onError) {
          onError(event);
        }
      };

      this.recognition.onend = () => {
        // Auto-restart if user still wants listening
        if (this.isListeningActive) {
          try {
            this.recognition.start();
          } catch {}
        }
      };

      this.recognition.start();
    } catch (err) {
      this.isListeningActive = false;
      if (onError) onError(err);
    }
  }

  public stopListening() {
    this.isListeningActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }
}

export const speechService = new SpeechService();
