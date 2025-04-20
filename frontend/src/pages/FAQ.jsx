import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronUp, MessageCircleQuestion, Mail } from 'lucide-react';

const FAQ = () => {
  const { isDarkMode } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const faqs = [
    {
      question: "What is EduForum?",
      answer: "EduForum is a comprehensive academic platform designed to enhance campus communication. It features an AI-powered chatbot, discussion forums, and notice boards to help students, teachers, and administrators stay connected and informed."
    },
    {
      question: "How do I use the chatbot?",
      answer: "The chatbot is available on the dashboard. Simply type your question in the chat input field and press enter or click the send button. The chatbot can help with academic queries, campus information, and general assistance."
    },
    {
      question: "What kind of questions can I ask the chatbot?",
      answer: "You can ask about course details, admission processes, campus facilities, faculty information, placement statistics, hostel facilities, and general academic queries. The chatbot is designed to provide accurate and helpful responses to your questions."
    },
    {
      question: "How do I create a post?",
      answer: "To create a post, navigate to the 'My Posts' section in the sidebar and click the 'Create Post' button. Fill in the required details, add any attachments if needed, and click 'Post' to publish your content."
    },
    {
      question: "How do I view notices?",
      answer: "All notices are available in the 'Notices' section of the sidebar. You can view notices by department, date, or category. Teachers can also create new notices through the 'Create Notice' option."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All user data is encrypted and stored securely. We follow industry-standard security practices to protect your information and ensure your privacy."
    },
    {
      question: "How do I change my account settings?",
      answer: "You can access your account settings by clicking on the 'Settings' option in the sidebar. Here you can update your profile information, change your password, and modify your notification preferences."
    },
    {
      question: "What should I do if I encounter technical issues?",
      answer: "If you experience any technical difficulties, please try refreshing the page first. If the issue persists, you can contact the technical support team through the 'Help' section or report the problem using the feedback form."
    }
  ];

  useEffect(() => {
    setFilteredFaqs(
      faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section with animated gradient background */}
        <div className={`relative rounded-2xl overflow-hidden mb-12 p-8 ${isDarkMode ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-gray-100'}`}>
          <div className="absolute inset-0 bg-grid opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-opacity-20 bg-blue-500">
              <MessageCircleQuestion className={`w-8 h-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Find answers to common questions about using EduForum
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
            isSearchFocused ? (isDarkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-400') : ''
          }`}>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full px-5 py-4 pl-10 ${
                isDarkMode 
                  ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700' 
                  : 'bg-white text-gray-900 placeholder-gray-500 focus:bg-gray-50'
              } transition-colors duration-200 outline-none`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="hidden md:flex mb-8 overflow-x-auto">
          <button className={`px-4 py-2 mr-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            All Questions
          </button>
          <button className={`px-4 py-2 mr-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}>
            Getting Started
          </button>
          <button className={`px-4 py-2 mr-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}>
            Account & Settings
          </button>
          <button className={`px-4 py-2 mr-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}>
            Technical Support
          </button>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                } shadow-md hover:shadow-lg transform hover:translate-y-px`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`w-full px-6 py-5 flex justify-between items-center transition-colors duration-200`}
                  aria-expanded={openIndex === index}
                >
                  <h3 className={`text-lg font-semibold text-left ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </h3>
                  <span className={`ml-4 flex-shrink-0 p-1.5 rounded-full ${
                    openIndex === index ? 
                      (isDarkMode ? 'bg-blue-900' : 'bg-blue-100') : 
                      (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                  }`}>
                    {openIndex === index ? (
                      <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </span>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`px-6 py-5 border-t ${
                    isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-100 text-gray-600'
                  }`}>
                    <p className="text-base leading-relaxed">{faq.answer}</p>
                    <div className={`mt-3 flex items-center text-sm ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      <button className="flex items-center hover:underline">
                        <span>Was this helpful?</span>
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.865-1.271L7 14M3 18h4l2-7V4a1 1 0 011-1h2a1 1 0 011 1v7l2 7h4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-10 rounded-xl ${
              isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
            }`}>
              <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-opacity-20 bg-gray-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21.036 14.856a9.9 9.9 0 00.96-4.856c0-5.523-4.477-10-10-10S2 4.477 2 10c0 5.523 4.477 10 10 10a9.9 9.9 0 004.856-.96"></path>
                </svg>
              </div>
              <p className="text-lg font-medium">No results found</p>
              <p className="mt-2">Try a different search term or browse all questions</p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className={`mt-12 p-8 rounded-xl ${
          isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
        } shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h2 className={`text-xl sm:text-2xl font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Still have questions?
              </h2>
              <p className={`mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                If you can't find the answer you're looking for, feel free to contact our support team. We're here to help you 24/7.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors duration-200`}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  <span>Contact Support</span>
                </button>
                <button
                  className={`px-6 py-3 rounded-lg ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } transition-colors duration-200`}
                >
                  View Documentation
                </button>
              </div>
            </div>
            <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
              <div className={`rounded-full p-4 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              } shadow-lg`}>
                <svg className={`w-20 h-20 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} EduForum. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;