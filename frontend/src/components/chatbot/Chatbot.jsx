import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { MessageCircle, Send, User, Bot, ChevronDown, Moon, Sun, HelpCircle, Sparkles, Brain, Star } from 'lucide-react';
import botimg from '../../assets/botimg.png';

const Chatbot = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm your AI assistant. I can help answer questions, provide information, or just chat. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay

      const response = await axios.post('http://localhost:3000/api/chat', {
        message: input
      });

      // Add another small delay before showing the response
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second additional delay

      const botMessage = {
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getRandomSuggestion = () => {
    const suggestions = [
      "What can you help me with?",
      "Tell me an interesting fact",
      "Can you recommend a good book?",
      "Write a short poem about technology",
      "What's the weather like today?"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSendMessage({ preventDefault: () => {} });
  };

  const formatMessage = (text) => {
    // Split the message by newlines and filter out empty lines
    return text.split('\n').filter(line => line.trim());
  };

  return (
    <div 
      className={`flex flex-col h-full rounded-xl overflow-hidden shadow-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
      style={{ 
        minHeight: '500px',
        maxHeight: 'calc(100vh - 2rem)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Chat header with gradient and controls */}
      <div className={`relative ${isDarkMode ? 'bg-gradient-to-r from-blue-900 via-purple-800 to-blue-800' : 'bg-gradient-to-r from-blue-500 via-purple-400 to-blue-400'}`}>
        <div className="absolute inset-0 opacity-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full object-cover">
            <path fill="#FFFFFF" fillOpacity="1" d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,170.7C672,160,768,96,864,96C960,96,1056,160,1152,170.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div 
          className="p-3 relative z-10 rounded-t-lg shadow-lg"
          style={{
            background: 'linear-gradient(to right, #094F8E, #5A94C8)'
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="p-2 rounded-full mr-3 shadow-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  EduBot
                </h2>
                <p 
                  className="text-xs opacity-80"
                  style={{ color: '#A7C3E1' }}
                >
                  Your friendly virtual companion
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: '1px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <ChevronDown 
                  size={16} 
                  className={`text-white transform transition-transform ${isMinimized ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMinimized ? (
        <div 
          className={`flex items-center justify-center cursor-pointer ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          } relative h-full`}
          onClick={() => setIsMinimized(false)}
          style={{ 
            backgroundImage: isDarkMode 
              ? 'radial-gradient(circle at 10% 20%, rgba(21, 25, 40, 0.8) 0%, rgba(43, 46, 60, 0.4) 90.1%)' 
              : 'radial-gradient(circle at 10% 20%, rgba(236, 241, 253, 0.8) 0%, rgba(250, 252, 255, 0.4) 90.1%)'
          }}
        >
          <img 
            src={botimg} 
            alt="Chatbot" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <>
          {/* Messages container - scrollable */}
          <div className={`flex-1 overflow-y-auto p-3 space-y-3 ${isDarkMode ? 'bg-gray-800 scrollbar-thin scrollbar-webkit' : 'bg-gray-50'}`}
               style={{ backgroundImage: isDarkMode ? 'radial-gradient(circle at 10% 20%, rgba(21, 25, 40, 0.8) 0%, rgba(43, 46, 60, 0.4) 90.1%)' : 'radial-gradient(circle at 10% 20%, rgba(236, 241, 253, 0.8) 0%, rgba(250, 252, 255, 0.4) 90.1%)' }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {message.sender === 'bot' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shadow-md ${
                    isDarkMode ? 'bg-gradient-to-br from-blue-600 to-purple-700' : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}>
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-md backdrop-blur-sm ${
                    message.sender === 'user'
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-tr-none'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none'
                      : isDarkMode
                      ? 'bg-gray-700 bg-opacity-80 text-white rounded-tl-none'
                      : 'bg-white bg-opacity-90 text-gray-900 rounded-tl-none'
                  }`}
                >
                  {formatMessage(message.text).map((line, i) => (
                    <div key={i} className="mb-1 last:mb-0">
                      {line.includes(':') ? (
                        <div className="flex flex-col text-xs">
                          <span className="font-medium">{line.split(':')[0]}:</span>
                          <span className="ml-2 text-xs opacity-90">{line.split(':')[1]}</span>
                        </div>
                      ) : (
                        <p className="text-xs">{line}</p>
                      )}
                    </div>
                  ))}
                  <p
                    className={`text-[10px] mt-1 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 shadow-md ${
                    isDarkMode ? 'bg-gradient-to-br from-blue-700 to-purple-800' : 'bg-gradient-to-br from-blue-600 to-purple-600'
                  }`}>
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shadow-md ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-600 to-purple-700' : 'bg-gradient-to-br from-blue-500 to-purple-500'
                }`}>
                  <Bot size={16} className="text-white animate-pulse" />
                </div>
                <div className={`max-w-[80%] rounded-2xl p-3 shadow-md ${
                  isDarkMode ? 'bg-gray-700 bg-opacity-80 text-white' : 'bg-white bg-opacity-90 text-gray-900'
                } rounded-tl-none`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '0ms' }} />
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'} animate-bounce`} style={{ animationDelay: '150ms' }} />
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestion chips */}
          <div className={`px-3 py-2 flex flex-wrap gap-1.5 border-t ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <button
              onClick={() => handleSuggestionClick("What courses are offered?")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => handleSuggestionClick("What are the admission requirements?")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Admissions
            </button>
            <button
              onClick={() => handleSuggestionClick("Tell me about the faculty members")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => handleSuggestionClick("What are the campus facilities?")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Facilities
            </button>
            <button
              onClick={() => handleSuggestionClick("What are the placement opportunities?")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Placements
            </button>
            <button
              onClick={() => handleSuggestionClick("Tell me about hostel accommodation")}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hostel
            </button>
          </div>

          {/* Input form - fixed at bottom */}
          <div className={`p-3 border-t ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className={`w-full rounded-full pl-3 pr-10 py-2 text-xs focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-400'
                } transition-all duration-300`}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`absolute right-1 top-1 p-1.5 rounded-full ${
                  loading || !input.trim()
                    ? isDarkMode
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:opacity-90'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                } transition-all duration-200 shadow-md`}
              >
                <Send size={14} />
              </button>
            </form>
            
            <div className="mt-1.5 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star size={8} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <p className={`text-[9px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Ask me anything - I'm here to assist you 24/7
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;