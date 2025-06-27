
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextToSpeechProps {
  isSpeaking: boolean;
  onToggleSpeaking: (speaking: boolean) => void;
  language: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  isSpeaking,
  onToggleSpeaking,
  language
}) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Map language codes to speech synthesis languages
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'ta': 'ta-IN',
        'te': 'te-IN'
      };

      utterance.lang = langMap[language] || 'en-US';
      utterance.rate = 0.8; // Slightly slower for children
      utterance.pitch = 1.1; // Slightly higher pitch for friendliness
      utterance.volume = 0.9;

      utterance.onstart = () => {
        onToggleSpeaking(true);
      };

      utterance.onend = () => {
        onToggleSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        onToggleSpeaking(false);
        utteranceRef.current = null;
        
        toast({
          title: "Speech error",
          description: "Couldn't speak the text. Please try again!",
          variant: "destructive"
        });
      };

      speechSynthesis.speak(utterance);
      
      toast({
        title: "Speaking... 🔊",
        description: "Playing audio response",
      });
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      onToggleSpeaking(false);
      utteranceRef.current = null;
    } else {
      // For demo purposes, speak a sample text
      const sampleTexts = {
        en: "Hello! I'm EduBridge, ready to help you learn!",
        hi: "नमस्ते! मैं EduBridge हूँ, आपकी मदद करने के लिए तैयार हूँ!",
        ta: "வணக்கம்! நான் EduBridge, உங்களுக்கு கற்றுக் கொடுக்க தயார்!",
        te: "నమస్కారం! నేను EduBridge, మీకు నేర్పడానికి సిద్ధంగా ఉన్నాను!"
      };
      
      const textToSpeak = sampleTexts[language as keyof typeof sampleTexts] || sampleTexts.en;
      speakText(textToSpeak);
    }
  };

  return (
    <Button
      onClick={toggleSpeech}
      variant={isSpeaking ? "destructive" : "outline"}
      size="icon"
      className={`transition-all duration-200 ${
        isSpeaking 
          ? 'animate-pulse bg-blue-500 hover:bg-blue-600' 
          : 'hover:bg-blue-50 border-blue-200'
      }`}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4 text-blue-500" />
      )}
    </Button>
  );
};

export default TextToSpeech;
