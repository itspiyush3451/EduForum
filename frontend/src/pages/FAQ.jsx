import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const { isDarkMode } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

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

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Find answers to common questions about using EduForum
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-md hover:shadow-lg`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className={`w-full px-6 py-4 flex justify-between items-center ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                <h3 className={`text-lg font-semibold text-left ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                )}
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className={`px-6 py-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className={`mt-12 p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Still have questions?
          </h2>
          <p className={`mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            If you can't find the answer you're looking for, feel free to contact our support team.
          </p>
          <button
            className={`px-6 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors duration-200`}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 