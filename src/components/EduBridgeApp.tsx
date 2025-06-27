
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Send, Star, Heart, ThumbsUp, BookOpen, Globe, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from './ChatMessage';
import VoiceInput from './VoiceInput';
import TextToSpeech from './TextToSpeech';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

const EduBridgeApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackEmojis, setFeedbackEmojis] = useState<string[]>([]);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  ];

  const welcomeMessages = {
    en: "Hi there! I'm EduBridge, your friendly AI tutor! 🌟 Ask me anything about math, science, or language. I'm here to help you learn!",
    hi: "नमस्ते! मैं EduBridge हूँ, आपका दोस्ताना AI शिक्षक! 🌟 गणित, विज्ञान या भाषा के बारे में कुछ भी पूछें। मैं आपकी मदद करने के लिए यहाँ हूँ!",
    ta: "வணக்கம்! நான் EduBridge, உங்கள் நட்புரீதியான AI ஆசிரியர்! 🌟 கணிதம், அறிவியல் அல்லது மொழி பற்றி எதையும் கேளுங்கள். நான் உங்களுக்கு கற்றுக் கொடுக்க இங்கே இருக்கிறேன்!",
    te: "నమస్కారం! నేను EduBridge, మీ స్నేహపూర్వక AI ఉపాధ్యాయుడు! 🌟 గణితం, సైన్స్ లేదా భాష గురించి ఏదైనా అడగండి. నేను మీకు నేర్పడానికి ఇక్కడ ఉన్నాను!"
  };

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: '1',
      text: welcomeMessages[selectedLanguage as keyof typeof welcomeMessages],
      isUser: false,
      timestamp: new Date(),
      language: selectedLanguage
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Update welcome message when language changes
    if (messages.length > 0) {
      const updatedMessages = [...messages];
      updatedMessages[0] = {
        ...updatedMessages[0],
        text: welcomeMessages[selectedLanguage as keyof typeof welcomeMessages],
        language: selectedLanguage
      };
      setMessages(updatedMessages);
    }
  }, [selectedLanguage]);

  const generateEduBridgeResponse = async (question: string, language: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple educational responses based on keywords and language
    const responses = {
      en: {
        electricity: "⚡ Electricity is like invisible energy that flows through wires! Think of it like water flowing through pipes. When you flip a switch, electricity flows to the light bulb and makes it glow! ✨",
        fractions: "🍕 Fractions are parts of a whole! Imagine a pizza cut into 4 slices. If you eat 2 slices, you ate 2/4 (or 1/2) of the pizza! The top number tells us how many parts we have, and the bottom number tells us how many parts the whole thing is divided into. 🧮",
        verbs: "🏃‍♂️ Verbs are action words! They tell us what someone is doing. Like 'run', 'jump', 'eat', 'sleep'. When I say 'The cat runs', 'runs' is the verb because it shows the action! 📚",
        default: "That's a great question! 🤔 Let me help you understand this step by step. Remember, learning is like building blocks - we start with simple ideas and build bigger ones! Keep asking questions, that's how we learn best! 🌟"
      },
      hi: {
        electricity: "⚡ बिजली एक अदृश्य ऊर्जा है जो तारों से बहती है! इसे पानी की तरह समझें जो पाइप में बहता है। जब आप स्विच दबाते हैं, बिजली बल्ब तक पहुंचती है और उसे चमकाती है! ✨",
        fractions: "🍕 भिन्न का मतलब है पूरे का हिस्सा! एक पिज्जा को 4 टुकड़ों में काटने की कल्पना करें। अगर आप 2 टुकड़े खाते हैं, तो आपने 2/4 (या 1/2) पिज्जा खाया! ऊपर वाला नंबर बताता है कि हमारे पास कितने हिस्से हैं। 🧮",
        verbs: "🏃‍♂️ क्रिया वे शब्द हैं जो काम दिखाते हैं! जैसे 'दौड़ना', 'कूदना', 'खाना', 'सोना'। जब मैं कहता हूँ 'बिल्ली दौड़ती है', तो 'दौड़ती' क्रिया है! 📚",
        default: "यह बहुत अच्छा सवाल है! 🤔 मैं आपको इसे समझाने में मदद करूंगा। याद रखें, सीखना ब्लॉक्स बनाने की तरह है - हम सरल चीजों से शुरू करते हैं! 🌟"
      },
      ta: {
        electricity: "⚡ மின்சாரம் கம்பிகள் வழியாக பாயும் கண்ணுக்கு தெரியாத சக்தி! இதை குழாய்களில் பாயும் தண்ணீர் போல நினைத்துக் கொள்ளுங்கள். ஸ்விட்சை அழுத்தும்போது, மின்சாரம் விளக்கு வரை சென்று அதை ஒளிர வைக்கிறது! ✨",
        fractions: "🍕 பின்னங்கள் என்பது முழுவதின் பகுதிகள்! ஒரு பிட்சாவை 4 துண்டுகளாக வெட்டினால், நீங்கள் 2 துண்டுகள் சாப்பிட்டால், நீங்கள் 2/4 (அல்லது 1/2) பிட்சா சாப்பிட்டீர்கள்! 🧮",
        verbs: "🏃‍♂️ வினைச்சொற்கள் செயல் சொற்கள்! 'ஓடு', 'குதி', 'சாப்பிடு', 'தூங்கு' போன்றவை. 'பூனை ஓடுகிறது' என்று சொன்னால், 'ஓடுகிறது' வினைச்சொல்! 📚",
        default: "இது மிக நல்ல கேள்வி! 🤔 இதை படிப்படியாக புரிய வைக்கிறேன். கற்றல் என்பது கட்டிடம் கட்டுவது போல - எளிய விஷயங்களில் இருந்து ஆரம்பிக்கிறோம்! 🌟"
      },
      te: {
        electricity: "⚡ విద్యుత్ అనేది తీగల ద్వారా ప్రవహించే కనిపించని శక్తి! దీన్ని పైపుల్లో ప్రవహించే నీటిలా అనుకోండి. స్విచ్ నొక్కినప్పుడు, విద్యుత్ బల్బుకు చేరుకుని దాన్ని వెలిగిస్తుంది! ✨",
        fractions: "🍕 భిన్నాలు అంటే మొత్తంలో భాగాలు! ఒక పిజ్జాను 4 ముక్కలుగా కట్టినట్లయితే, మీరు 2 ముక్కలు తింటే, మీరు 2/4 (లేదా 1/2) పిజ్జా తిన్నారు! 🧮",
        verbs: "🏃‍♂️ క్రియలు అంటే చర్య పదాలు! 'పరుగెత్తు', 'దూకు', 'తిను', 'నిద్రపో' లాంటివి. 'పిల్లి పరుగెత్తుతుంది' అంటే, 'పరుగెత్తుతుంది' క్రియ! 📚",
        default: "ఇది చాలా మంచి ప్రశ్న! 🤔 దీన్ని మీకు దశలవారీగా అర్థం చేయిస్తాను. నేర్చుకోవడం అంటే ఇటుకలతో కట్టడం లాంటిది - సాధారణ విషయాలతో మొదలుపెడతాం! 🌟"
      }
    };

    const langResponses = responses[language as keyof typeof responses] || responses.en;
    
    // Check for keywords in the question
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('electric') || lowerQuestion.includes('बिजली') || lowerQuestion.includes('மின்சாரம்') || lowerQuestion.includes('విద్యుత్')) {
      return langResponses.electricity;
    } else if (lowerQuestion.includes('fraction') || lowerQuestion.includes('भिन्न') || lowerQuestion.includes('பின்னம்') || lowerQuestion.includes('భిన్న')) {
      return langResponses.fractions;
    } else if (lowerQuestion.includes('verb') || lowerQuestion.includes('क्रिया') || lowerQuestion.includes('வினை') || lowerQuestion.includes('క్రియ')) {
      return langResponses.verbs;
    } else {
      return langResponses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateEduBridgeResponse(inputText, selectedLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Add random feedback emojis
      const emojis = ['⭐', '🌟', '💫', '✨', '🎉', '👏', '🤗', '💖'];
      setFeedbackEmojis([emojis[Math.floor(Math.random() * emojis.length)]]);
      setTimeout(() => setFeedbackEmojis([]), 3000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your question. Please try again!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInputText(transcript);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-blue-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              EduBridge
            </h1>
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-600 text-lg">Your friendly AI tutor for learning anything! 🌟</p>
        </div>

        {/* Control Panel */}
        <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOfflineMode ? <WifiOff className="w-5 h-5 text-gray-500" /> : <Wifi className="w-5 h-5 text-green-500" />}
                <Switch
                  checked={isOfflineMode}
                  onCheckedChange={setIsOfflineMode}
                />
                <span className="text-sm text-gray-600">
                  {isOfflineMode ? 'Offline Mode' : 'Online Mode'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="h-96 mb-4 p-4 bg-white/70 backdrop-blur-sm overflow-hidden">
          <div className="h-full overflow-y-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span>EduBridge is thinking...</span>
              </div>
            )}
          </div>
        </Card>

        {/* Feedback Emojis */}
        {feedbackEmojis.length > 0 && (
          <div className="text-center mb-4">
            {feedbackEmojis.map((emoji, index) => (
              <span key={index} className="text-3xl animate-bounce inline-block mx-1">
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* Input Area */}
        <Card className="p-4 bg-white/70 backdrop-blur-sm">
          <div className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything about math, science, or language! 📚"
              className="flex-1 min-h-[80px] text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <VoiceInput
                isListening={isListening}
                onToggleListening={setIsListening}
                onTranscript={handleVoiceInput}
                language={selectedLanguage}
              />
              <TextToSpeech
                isSpeaking={isSpeaking}
                onToggleSpeaking={setIsSpeaking}
                language={selectedLanguage}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Made with ❤️ to help children learn and grow • EduBridge AI Tutor</p>
        </div>
      </div>
    </div>
  );
};

export default EduBridgeApp;
