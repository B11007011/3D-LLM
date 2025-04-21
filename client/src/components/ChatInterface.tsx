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
  const conversationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation when messages change
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userInput = inputValue.trim();
    setInputValue("");
    
    // Add user message
    addMessage(userInput, "user");
    
    // Update chat history
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: userInput }
    ];
    setChatHistory(updatedHistory);
    
    // Add pending bot message
    const pendingId = addMessage("...", "bot", true);
    
    try {
      setIsLoading(true);
      
      // Call the LLM service to process the message
      const response = await processMessage(userInput, { previousMessages: updatedHistory });
      
      // Update the pending message with the actual response
      updateMessage(pendingId, { 
        text: response.text, 
        pending: false,
        tokens: response.tokens,
        processingTime: response.processingTime
      });
      
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">smart_toy</span>
            <h2 className="font-medium text-gray-800">AI Assistant</h2>
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="material-icons text-sm">help_outline</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Conversation Area */}
      <div 
        ref={conversationRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-container flex ${message.sender === 'user' ? 'justify-end' : ''}`}
          >
            <div 
              className={`message max-w-[85%] ${
                message.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : message.error 
                    ? 'bg-red-50 border border-red-200 text-red-800' 
                    : 'bg-white border border-gray-200 shadow-sm'
              } rounded-lg p-3 text-sm relative ${message.pending ? 'opacity-70' : ''}`}
            >
              <p>{message.text}</p>
              <div className="flex justify-between items-center text-xs opacity-70 mt-1">
                {message.processingTime && !message.pending && message.sender === 'bot' && (
                  <span className="text-gray-500">
                    {message.tokens} tokens · {(message.processingTime / 1000).toFixed(1)}s
                  </span>
                )}
                <span className={message.processingTime ? "ml-auto" : ""}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              {message.pending && (
                <div className="absolute right-2 top-2 animate-pulse">
                  <span className="material-icons text-sm">more_horiz</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex flex-col space-y-2">
          <Textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeypress}
            className="flex-1 min-h-[80px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Try asking about: project setup, team management, file versions
            </div>
            <Button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLoading ? (
                <span className="material-icons animate-spin text-sm mr-1">refresh</span>
              ) : (
                <span className="material-icons text-sm mr-1">send</span>
              )}
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
