import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { processMessage } from "@/lib/llmService";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  pending?: boolean;
  error?: boolean;
  // Optional metadata
  tokens?: number;
  processingTime?: number;
  isTyping?: boolean;
  fullText?: string;
}

interface ChatInterfaceProps {
  updateUI: (uiType: string | null) => void;
}

const ChatInterface = ({ updateUI }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "What can I help you build today? 3D asset, scene, or something else?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([
    { role: "system", content: "You are an AI assistant specialized in 3D modeling and project management." },
    { role: "assistant", content: "What can I help you build today? 3D asset, scene, or something else?" }
  ]);
  
  // Suggested prompts for the demo
  const suggestedPrompts = [
    "I want to create a sci-fi robot for a game.",
    "Show me the 3D model viewer.",
    "Help me set up a project timeline.",
    "Compare Blender vs. Maya for this project.",
    "How should I organize my team?"
  ];
  
  const conversationRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom of conversation when messages change
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Cleanup typing animation interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const addMessage = (text: string, sender: "user" | "bot", pending: boolean = false, error: boolean = false, metadata: Record<string, any> = {}) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    setMessages((prevMessages) => [
      ...prevMessages, 
      { 
        id, 
        text, 
        sender, 
        timestamp: new Date(),
        pending,
        error,
        ...metadata
      }
    ]);
    
    return id;
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  };
  
  // Simulate typing animation for bot messages
  const simulateTyping = (text: string, id: string) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    let charIndex = 0;
    updateMessage(id, { isTyping: true, fullText: text, text: "" });
    
    typingIntervalRef.current = setInterval(() => {
      if (charIndex <= text.length) {
        updateMessage(id, { text: text.substring(0, charIndex) });
        charIndex++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        updateMessage(id, { isTyping: false });
      }
    }, 15); // Speed of typing animation
  };

  const handleSend = async (userInput?: string) => {
    const textToSend = userInput || inputValue.trim();
    if (!textToSend) return;
    
    setInputValue("");
    
    // Add user message
    addMessage(textToSend, "user");
    
    // Update chat history
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: textToSend }
    ];
    setChatHistory(updatedHistory);
    
    // Add pending bot message
    const pendingId = addMessage("...", "bot", true);
    
    try {
      setIsLoading(true);
      
      // Call the LLM service to process the message
      const response = await processMessage(textToSend, { previousMessages: updatedHistory });
      
      // Update the pending message with typing animation
      simulateTyping(response.text, pendingId);
      
      // Update chat history
      setChatHistory([
        ...updatedHistory,
        { role: "assistant", content: response.text }
      ]);
      
      // Trigger UI update if needed
      if (response.ui) {
        updateUI(response.ui);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      updateMessage(pendingId, { 
        text: "Sorry, I encountered an error processing your request. Please try again.",
        pending: false,
        error: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearConversation = () => {
    const initialMessage = {
      id: `msg-${Date.now()}`,
      text: "What can I help you build today? 3D asset, scene, or something else?",
      sender: "bot" as const,
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
    setChatHistory([
      { role: "system", content: "You are an AI assistant specialized in 3D modeling and project management." },
      { role: "assistant", content: initialMessage.text }
    ]);
  };
  
  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    // Auto-focus the textarea
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">smart_toy</span>
            <h2 className="font-medium text-gray-800">3D Project Assistant</h2>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={clearConversation}
                  >
                    <span className="material-icons text-sm">refresh</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="material-icons text-sm">settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assistant Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div 
        ref={conversationRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-gray-100 text-gray-900'
            } ${message.pending ? 'opacity-70' : ''} ${message.error ? 'bg-red-100 text-red-800' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="break-words">
                  {message.text}
                  {message.isTyping && <span className="animate-pulse">|</span>}
                </div>
              </div>
              <div className="mt-1 text-right">
                <span className={`text-[10px] ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Suggested Prompts */}
      <div className="px-4 pt-2 pb-0">
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => handleSuggestedPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeypress}
            placeholder="Type a message..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            variant="default" 
            size="icon" 
            className="h-[60px] w-[60px]"
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
          >
            <span className="material-icons">send</span>
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            {isLoading ? "AI is thinking..." : "Ask me anything about 3D project management"}
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <span className="material-icons text-sm">mic</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice input (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <span className="material-icons text-sm">attach_file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
