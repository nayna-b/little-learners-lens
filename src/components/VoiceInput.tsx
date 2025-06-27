
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  isListening: boolean;
  onToggleListening: (listening: boolean) => void;
  onTranscript: (transcript: string) => void;
  language: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  isListening,
  onToggleListening,
  onTranscript,
  language
}) => {
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Map language codes to speech recognition languages
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'ta': 'ta-IN',
        'te': 'te-IN'
      };
      
      recognition.lang = langMap[language] || 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        onToggleListening(false);
        
        toast({
          title: "Voice captured! 🎙️",
          description: `Heard: "${transcript}"`,
        });
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onToggleListening(false);
        
        toast({
          title: "Voice input error",
          description: "Couldn't capture voice. Please try again!",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        onToggleListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onToggleListening, onTranscript, toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        onToggleListening(true);
        
        toast({
          title: "Listening... 👂",
          description: "Speak your question now!",
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Error",
          description: "Couldn't start voice input. Please try again!",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button
      onClick={toggleListening}
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      className={`transition-all duration-200 ${
        isListening 
          ? 'animate-pulse bg-red-500 hover:bg-red-600' 
          : 'hover:bg-orange-50 border-orange-200'
      }`}
    >
      {isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4 text-orange-500" />
      )}
    </Button>
  );
};

export default VoiceInput;
