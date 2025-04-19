import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

const readCollegeData = () => {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../Chatbot/server/collegeData.json'), 'utf8')
    );
  } catch (error) {
    console.error('Error reading college data:', error);
    return null;
  }
};

const findRelevantInfo = (message) => {
  const collegeData = readCollegeData();
  if (!collegeData) {
    return "I apologize, but I'm having trouble accessing the college information right now. Please try again later.";
  }

  const lowercaseMsg = message.toLowerCase();
  
  // General conversation responses
  if (lowercaseMsg.includes('how are you') || lowercaseMsg.includes('how do you do') || 
      lowercaseMsg.includes('how\'s it going') || lowercaseMsg.includes('how\'s everything')) {
    const generalResponses = [
      "I'm doing great! How can I help you today?",
      "I'm doing well! What would you like to know?",
      "I'm good! How may I assist you?",
      "I'm excellent! What can I help you with?",
      "I'm fantastic! What information do you need?"
    ];
    return getRandomResponse(generalResponses);
  }

  // Greeting responses
  if (lowercaseMsg.includes('hi') || lowercaseMsg.includes('hello') || lowercaseMsg.includes('hey') || 
      lowercaseMsg.includes('good morning') || lowercaseMsg.includes('good afternoon') || 
      lowercaseMsg.includes('good evening')) {
    const greetings = [
      `Hello! How can I help you today?`,
      `Hi! What would you like to know?`,
      `Greetings! How may I assist you?`,
      `Hello! What can I help you with?`,
      `Good ${getTimeOfDay()}! How may I help you?`
    ];
    return getRandomResponse(greetings);
  }

  // Farewell responses
  if (lowercaseMsg.includes('bye') || lowercaseMsg.includes('goodbye') || lowercaseMsg.includes('see you') || 
      lowercaseMsg.includes('thank you') || lowercaseMsg.includes('thanks')) {
    const farewells = [
      "Goodbye! Have a great day!",
      "Thank you! Take care!",
      "Goodbye! Come back soon!",
      "Thanks! See you later!",
      "Goodbye! I'm here if you need me!"
    ];
    return getRandomResponse(farewells);
  }

  // Admission related queries
  if (lowercaseMsg.includes('admission') || lowercaseMsg.includes('apply') || lowercaseMsg.includes('application')) {
    const admissionResponses = [
      `Admission Details:\n
      Process: ${collegeData.admission.process}\n
      Criteria: ${collegeData.admission.criteria}\n
      Documents: ${collegeData.admission.documents_required.join(', ')}\n
      Dates:\n
      - Start: ${collegeData.admission.important_dates.application_start}\n
      - End: ${collegeData.admission.important_dates.application_end}\n
      - Counseling: ${collegeData.admission.important_dates.counseling}`,
      
      `Admission Info:\n
      Process: ${collegeData.admission.process}\n
      Requirements: ${collegeData.admission.criteria}\n
      Documents Needed: ${collegeData.admission.documents_required.join(', ')}\n
      Key Dates:\n
      - Applications: ${collegeData.admission.important_dates.application_start} to ${collegeData.admission.important_dates.application_end}\n
      - Counseling: ${collegeData.admission.important_dates.counseling}`
    ];
    return getRandomResponse(admissionResponses);
  }

  // Fees related queries
  if (lowercaseMsg.includes('fee') || lowercaseMsg.includes('cost') || lowercaseMsg.includes('charges')) {
    const feeResponses = [
      `Fee Structure:\n
      Course: ${collegeData.fees.mca}\n
      Hostel:\n
      - Boys: ${collegeData.fees.hostel.boys}\n
      - Girls: ${collegeData.fees.hostel.girls}\n
      Bus: ${collegeData.fees.bus}`,
      
      `Fees:\n
      MCA: ${collegeData.fees.mca}\n
      Hostel:\n
      - Boys: ${collegeData.fees.hostel.boys}\n
      - Girls: ${collegeData.fees.hostel.girls}\n
      Transport: ${collegeData.fees.bus}`
    ];
    return getRandomResponse(feeResponses);
  }

  // Class related queries
  if (lowercaseMsg.includes('class') || lowercaseMsg.includes('timing') || lowercaseMsg.includes('schedule')) {
    const classResponses = [
      `Schedule:\n
      Mode: ${collegeData.classes.mode}\n
      Timing: ${collegeData.classes.timing}\n
      Labs: ${collegeData.classes.labs.join(', ')}\n
      Extra: ${collegeData.classes.extra_classes}`,
      
      `Class Info:\n
      Mode: ${collegeData.classes.mode}\n
      Time: ${collegeData.classes.timing}\n
      Labs: ${collegeData.classes.labs.join(', ')}\n
      Additional: ${collegeData.classes.extra_classes}`
    ];
    return getRandomResponse(classResponses);
  }

  // Bus facility queries
  if (lowercaseMsg.includes('bus') || lowercaseMsg.includes('transport')) {
    const busResponses = [
      `Transport:\n
      Available: Yes\n
      Routes: ${collegeData.bus_facility.routes.join(', ')}\n
      Timing: ${collegeData.bus_facility.timing}\n
      Fee: ${collegeData.bus_facility.fees}`,
      
      `Bus Service:\n
      Routes: ${collegeData.bus_facility.routes.join(', ')}\n
      Schedule: ${collegeData.bus_facility.timing}\n
      Cost: ${collegeData.bus_facility.fees}`
    ];
    return getRandomResponse(busResponses);
  }

  // Hostel related queries
  if (lowercaseMsg.includes('hostel') || lowercaseMsg.includes('accommodation') || lowercaseMsg.includes('stay')) {
    const hostelResponses = [
      `Hostel:\n
      Available: Yes\n
      Rooms: ${collegeData.hostel.rooms}\n
      Facilities: ${collegeData.hostel.facilities.join(', ')}`,
      
      `Accommodation:\n
      Type: ${collegeData.hostel.rooms}\n
      Amenities: ${collegeData.hostel.facilities.join(', ')}`
    ];
    return getRandomResponse(hostelResponses);
  }

  // Placement related queries
  if (lowercaseMsg.includes('placement') || lowercaseMsg.includes('job') || lowercaseMsg.includes('package') || lowercaseMsg.includes('company')) {
    const placementResponses = [
      `Placements:\n
      Ratio: ${collegeData.placements.ratio}\n
      Average: ${collegeData.placements.average_package}\n
      Highest: ${collegeData.placements.highest_package}\n
      Companies: ${collegeData.placements.top_companies.join(', ')}\n
      Support: ${collegeData.placements.support}`,
      
      `Career Info:\n
      Success Rate: ${collegeData.placements.ratio}\n
      Avg Salary: ${collegeData.placements.average_package}\n
      Top Offer: ${collegeData.placements.highest_package}\n
      Recruiters: ${collegeData.placements.top_companies.join(', ')}\n
      Support: ${collegeData.placements.support}`
    ];
    return getRandomResponse(placementResponses);
  }

  // Campus life queries
  if (lowercaseMsg.includes('campus') || lowercaseMsg.includes('club') || lowercaseMsg.includes('event') || lowercaseMsg.includes('sport')) {
    const campusResponses = [
      `Campus Life:\n
      Clubs: ${collegeData.campus_life.clubs.join(', ')}\n
      Events: ${collegeData.campus_life.events.join(', ')}\n
      Sports: ${collegeData.campus_life.sports.join(', ')}`,
      
      `Student Life:\n
      Activities: ${collegeData.campus_life.clubs.join(', ')}\n
      Events: ${collegeData.campus_life.events.join(', ')}\n
      Sports: ${collegeData.campus_life.sports.join(', ')}`
    ];
    return getRandomResponse(campusResponses);
  }

  // Contact information queries
  if (lowercaseMsg.includes('contact') || lowercaseMsg.includes('address') || lowercaseMsg.includes('phone') || lowercaseMsg.includes('email')) {
    const contactResponses = [
      `Contact:\n
      Address: ${collegeData.contact.address}\n
      Phone: ${collegeData.contact.phone}\n
      Email: ${collegeData.contact.email}\n
      Website: ${collegeData.contact.website}`,
      
      `Reach Us:\n
      Location: ${collegeData.contact.address}\n
      Phone: ${collegeData.contact.phone}\n
      Email: ${collegeData.contact.email}\n
      Web: ${collegeData.contact.website}`
    ];
    return getRandomResponse(contactResponses);
  }

  // Scholarship related queries
  if (lowercaseMsg.includes('scholarship') || lowercaseMsg.includes('financial aid') || lowercaseMsg.includes('fee waiver')) {
    const scholarshipResponses = [
      `Scholarships:\n
      Available:\n
      - ${collegeData.scholarships.government.join('\n- ')}\n
      Process: ${collegeData.scholarships.application_process}`,
      
      `Financial Aid:\n
      Government Schemes:\n
      - ${collegeData.scholarships.government.join('\n- ')}\n
      How to Apply: ${collegeData.scholarships.application_process}`
    ];
    return getRandomResponse(scholarshipResponses);
  }

  // MCA Department related queries
  if (lowercaseMsg.includes('mca department') || lowercaseMsg.includes('hod') || lowercaseMsg.includes('faculty')) {
    const mcaResponses = [
      `MCA Department:\n
      Info: ${collegeData.mca_department.general_info}\n
      Staff:\n
      - HOD: ${collegeData.mca_department.staff.hod}\n
      - Placement Coordinator: ${collegeData.mca_department.staff.placement_coordinator}\n
      - Project Coordinator: ${collegeData.mca_department.staff.project_coordinator}\n
      - Academic Exam Coordinator: ${collegeData.mca_department.staff.academic_exam_coordinator}\n
      - Professor: ${collegeData.mca_department.staff.professor}`,
      
      `Department Info:\n
      Overview: ${collegeData.mca_department.general_info}\n
      Faculty:\n
      - HOD: ${collegeData.mca_department.staff.hod}\n
      - Placement: ${collegeData.mca_department.staff.placement_coordinator}\n
      - Projects: ${collegeData.mca_department.staff.project_coordinator}\n
      - Exams: ${collegeData.mca_department.staff.academic_exam_coordinator}\n
      - Professor: ${collegeData.mca_department.staff.professor}`
    ];
    return getRandomResponse(mcaResponses);
  }

  // Academic Calendar queries
  if (lowercaseMsg.includes('calendar') || lowercaseMsg.includes('schedule') || lowercaseMsg.includes('holiday')) {
    const calendarResponses = [
      `Academic Calendar 2025-26:\n
      Semester 1:\n
      - Start: ${collegeData.academic_calendar['2025-26'].semester_1.start}\n
      - End: ${collegeData.academic_calendar['2025-26'].semester_1.end}\n
      - Holidays: ${collegeData.academic_calendar['2025-26'].semester_1.holidays.join(', ')}\n
      - Working Days: ${collegeData.academic_calendar['2025-26'].semester_1.working_days}\n
      Semester 2:\n
      - Start: ${collegeData.academic_calendar['2025-26'].semester_2.start}\n
      - End: ${collegeData.academic_calendar['2025-26'].semester_2.end}\n
      - Holidays: ${collegeData.academic_calendar['2025-26'].semester_2.holidays.join(', ')}\n
      - Working Days: ${collegeData.academic_calendar['2025-26'].semester_2.working_days}`,
      
      `Schedule 2025-26:\n
      Sem 1: ${collegeData.academic_calendar['2025-26'].semester_1.start} to ${collegeData.academic_calendar['2025-26'].semester_1.end}\n
      Sem 2: ${collegeData.academic_calendar['2025-26'].semester_2.start} to ${collegeData.academic_calendar['2025-26'].semester_2.end}\n
      Holidays:\n
      - Sem 1: ${collegeData.academic_calendar['2025-26'].semester_1.holidays.join(', ')}\n
      - Sem 2: ${collegeData.academic_calendar['2025-26'].semester_2.holidays.join(', ')}`
    ];
    return getRandomResponse(calendarResponses);
  }

  // Syllabus queries
  if (lowercaseMsg.includes('syllabus') || lowercaseMsg.includes('subjects') || lowercaseMsg.includes('courses')) {
    const syllabusResponses = [
      `MCA Syllabus:\n
      Semester 1:\n
      - ${collegeData.syllabus.mca_course.semester_1.join('\n- ')}\n
      Semester 2:\n
      - ${collegeData.syllabus.mca_course.semester_2.join('\n- ')}\n
      Semester 3:\n
      - ${collegeData.syllabus.mca_course.semester_3.join('\n- ')}\n
      Semester 4:\n
      - ${collegeData.syllabus.mca_course.semester_4.join('\n- ')}`,
      
      `Course Structure:\n
      Sem 1: ${collegeData.syllabus.mca_course.semester_1.join(', ')}\n
      Sem 2: ${collegeData.syllabus.mca_course.semester_2.join(', ')}\n
      Sem 3: ${collegeData.syllabus.mca_course.semester_3.join(', ')}\n
      Sem 4: ${collegeData.syllabus.mca_course.semester_4.join(', ')}`
    ];
    return getRandomResponse(syllabusResponses);
  }

  // Help/Assistance queries
  if (lowercaseMsg.includes('help') || lowercaseMsg.includes('what can you do') || lowercaseMsg.includes('assist')) {
    const helpResponses = [
      `I can help with:\n
      - Admissions\n
      - Fees & Scholarships\n
      - Classes & Syllabus\n
      - Academic Calendar\n
      - MCA Department\n
      - Transport\n
      - Hostel\n
      - Placements\n
      - Campus Life\n
      - Contact Info\n
      What would you like to know?`,
      
      `Topics I can help with:\n
      - Admission Process\n
      - Course Fees & Financial Aid\n
      - Class Schedule & Subjects\n
      - Academic Schedule\n
      - Department Info\n
      - Transportation\n
      - Accommodation\n
      - Career Info\n
      - Student Life\n
      - Contact Details\n
      How can I assist you?`
    ];
    return getRandomResponse(helpResponses);
  }

  // Default response
  const defaultResponses = [
    `I can help with:\n
    - Admissions\n
    - Fees & Scholarships\n
    - Classes & Syllabus\n
    - Academic Calendar\n
    - MCA Department\n
    - Transport\n
    - Hostel\n
    - Placements\n
    - Campus Life\n
    - Contact Info\n
    What would you like to know?`,
    
    `Topics I can help with:\n
    - Admission Process\n
    - Course Fees & Financial Aid\n
    - Class Schedule & Subjects\n
    - Academic Schedule\n
    - Department Info\n
    - Transportation\n
    - Accommodation\n
    - Career Info\n
    - Student Life\n
    - Contact Details\n
    How can I assist you?`
  ];
  return getRandomResponse(defaultResponses);
};

// Helper function to get time of day
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const processMessage = async (message) => {
  try {
    const response = findRelevantInfo(message);
    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    return 'I apologize, but I encountered an error. Please try asking your question again.';
  }
}; 