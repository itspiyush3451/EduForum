import { pool } from '../config/db.js';

// Response categories
const responses = {
  greeting: [
    'Hello! How can I help you today?',
    'Hi there! What can I do for you?',
    'Hey! How can I assist you?'
  ],
  farewell: [
    'Goodbye! Have a great day!',
    'See you later!',
    'Take care!'
  ],
  help: [
    'I can help you with questions about courses, faculty, campus facilities, and academic information.',
    'Feel free to ask me about academic programs, campus resources, or general information!'
  ],
  courses: [
    'We offer a variety of courses across different departments including Computer Science, Mathematics, and more.',
    'Our academic programs are designed to provide comprehensive education in various fields.'
  ],
  faculty: [
    'Our faculty members are highly qualified experts in their respective fields.',
    'We have experienced professors and instructors dedicated to student success.'
  ],
  facilities: [
    'Our campus features modern classrooms, well-equipped laboratories, and a comprehensive library.',
    'We provide various facilities including computer labs, study areas, and recreational spaces.'
  ],
  admission: [
    'For admission inquiries, please visit our admissions office or check the official website.',
    'Admission process includes application submission, document verification, and entrance tests where applicable.'
  ],
  default: [
    'I\'m not sure I understand. Could you rephrase that?',
    'I need more information to help you with that.',
    'Could you be more specific about what you\'re looking for?'
  ]
};

async function processMessage(message) {
  const lowerMessage = message.toLowerCase();

  // Check for greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return getRandomResponse(responses.greeting);
  }

  // Check for farewells
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return getRandomResponse(responses.farewell);
  }

  // Check for help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return getRandomResponse(responses.help);
  }

  // Check for course-related queries
  if (lowerMessage.includes('course') || lowerMessage.includes('program') || lowerMessage.includes('study')) {
    return getRandomResponse(responses.courses);
  }

  // Check for faculty-related queries
  if (lowerMessage.includes('faculty') || lowerMessage.includes('professor') || lowerMessage.includes('teacher')) {
    return getRandomResponse(responses.faculty);
  }

  // Check for facility-related queries
  if (lowerMessage.includes('facility') || lowerMessage.includes('campus') || lowerMessage.includes('laboratory') || lowerMessage.includes('lab')) {
    return getRandomResponse(responses.facilities);
  }

  // Check for admission-related queries
  if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('enroll')) {
    return getRandomResponse(responses.admission);
  }

  // If no specific response is found, return a default response
  return getRandomResponse(responses.default);
}

function getRandomResponse(responseArray) {
  const randomIndex = Math.floor(Math.random() * responseArray.length);
  return responseArray[randomIndex];
}

export { processMessage }; 