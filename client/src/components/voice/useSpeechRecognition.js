import { useRef, useCallback } from 'react';

const useSpeechRecognition = ({ language = 'en-IN', onResult, onListeningChange } = {}) => {
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported');
      return;
    }

    if (recognitionRef.current) recognitionRef.current.abort();
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult && onResult(transcript);
      onListeningChange && onListeningChange(false);
    };

    recognition.onerror = () => {
      onListeningChange && onListeningChange(false);
    };

    recognition.onend = () => {
      onListeningChange && onListeningChange(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    onListeningChange && onListeningChange(true);
  }, [language, onResult, onListeningChange]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      onListeningChange && onListeningChange(false);
    }
  }, [onListeningChange]);

  return { startListening, stopListening };
};

export default useSpeechRecognition;