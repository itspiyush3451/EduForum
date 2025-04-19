// // server.js
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/department_db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Define schemas
// const admissionSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   keywords: [String],
//   lastUpdated: { type: Date, default: Date.now }
// });

// const feeSchema = new mongoose.Schema({
//   type: String,
//   amount: Number,
//   description: String,
//   dueDate: Date,
//   keywords: [String],
//   lastUpdated: { type: Date, default: Date.now }
// });

// const placementSchema = new mongoose.Schema({
//   company: String,
//   position: String,
//   package: String,
//   eligibility: String,
//   processDate: Date,
//   keywords: [String],
//   lastUpdated: { type: Date, default: Date.now }
// });

// const academicSchema = new mongoose.Schema({
//   type: { type: String, enum: ['syllabus', 'timetable', 'calendar', 'holiday'] },
//   title: String,
//   content: String,
//   course: String,
//   semester: String,
//   year: Number,
//   keywords: [String],
//   lastUpdated: { type: Date, default: Date.now }
// });

// // Create models
// const Admission = mongoose.model('Admission', admissionSchema);
// const Fee = mongoose.model('Fee', feeSchema);
// const Placement = mongoose.model('Placement', placementSchema);
// const Academic = mongoose.model('Academic', academicSchema);

// // NLP helper function to find the most relevant document
// const findRelevantDocuments = async (model, query) => {
//   // A simple keyword matching algorithm
//   // In a production app, you might want to use a more sophisticated NLP approach
//   const words = query.toLowerCase().split(/\W+/).filter(word => word.length > 2);
  
//   // Find documents where keywords match the query words
//   const documents = await model.find({
//     $or: [
//       { keywords: { $in: words } },
//       { content: { $regex: words.join('|'), $options: 'i' } },
//       { title: { $regex: words.join('|'), $options: 'i' } }
//     ]
//   }).limit(3);
  
//   return documents;
// };

// // API routes
// app.post('/api/admissions', async (req, res) => {
//   try {
//     const { query } = req.body;
//     const admissionInfo = await findRelevantDocuments(Admission, query);
    
//     if (admissionInfo.length === 0) {
//       return res.json({ 
//         answer: "I don't have specific information about that admission query. Please contact the admissions office at admissions@department.edu or visit our website for more details."
//       });
//     }
    
//     // Construct a response from the found documents
//     const response = admissionInfo.map(info => info.content).join(' ');
//     res.json({ answer: response });
//   } catch (error) {
//     console.error('Error processing admission query:', error);
//     res.status(500).json({ answer: "Sorry, I'm having trouble retrieving admission information right now." });
//   }
// });

// app.post('/api/fees', async (req, res) => {
//   try {
//     const { query } = req.body;
//     const feeInfo = await findRelevantDocuments(Fee, query);
    
//     if (feeInfo.length === 0) {
//       return res.json({ 
//         answer: "I don't have specific information about that fee query. Please contact the finance office at finance@department.edu for more details."
//       });
//     }
    
//     // Construct a response based on the fee documents
//     let response = "Here's the fee information you requested: ";
//     feeInfo.forEach(fee => {
//       response += `${fee.type}: $${fee.amount} - ${fee.description}. Due date: ${new Date(fee.dueDate).toLocaleDateString()}. `;
//     });
    
//     res.json({ answer: response });
//   } catch (error) {
//     console.error('Error processing fee query:', error);
//     res.status(500).json({ answer: "Sorry, I'm having trouble retrieving fee information right now." });
//   }
// });

// app.post('/api/placements', async (req, res) => {
//   try {
//     const { query } = req.body;
//     const placementInfo = await findRelevantDocuments(Placement, query);
    
//     if (placementInfo.length === 0) {
//       return res.json({ 
//         answer: "I don't have specific information about that placement query. Please contact the placement cell at placements@department.edu for more details."
//       });
//     }
    
//     // Construct a response based on the placement documents
//     let response = "Here's the placement information you requested: ";
//     placementInfo.forEach(placement => {
//       response += `${placement.company} is offering ${placement.position} with package ${placement.package}. Eligibility: ${placement.eligibility}. Process date: ${new Date(placement.processDate).toLocaleDateString()}. `;
//     });
    
//     res.json({ answer: response });
//   } catch (error) {
//     console.error('Error processing placement query:', error);
//     res.status(500).json({ answer: "Sorry, I'm having trouble retrieving placement information right now." });
//   }
// });

// app.post('/api/academics', async (req, res) => {
//   try {
//     const { query } = req.body;
//     const academicInfo = await findRelevantDocuments(Academic, query);
    
//     if (academicInfo.length === 0) {
//       return res.json({ 
//         answer: "I don't have specific information about that academic query. Please contact the academic office at academics@department.edu for more details."
//       });
//     }
    
//     // Construct a response based on the academic documents
//     let response = "Here's the academic information you requested: ";
//     academicInfo.forEach(info => {
//       response += `${info.title}: ${info.content} `;
//       if (info.course) response += `(Course: ${info.course}, ${info.semester} semester, ${info.year}). `;
//     });
    
//     res.json({ answer: response });
//   } catch (error) {
//     console.error('Error processing academic query:', error);
//     res.status(500).json({ answer: "Sorry, I'm having trouble retrieving academic information right now." });
//   }
// });

// app.post('/api/general', (req, res) => {
//   res.json({ 
//     answer: "I'm your department assistant and can help with questions about admissions, fees, placements, scholarships, timetables, academic calendars, syllabi, and holidays. Could you please be more specific about what information you're looking for?"
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Seed data function (for development)
// const seedDatabase = async () => {
//   // Check if we already have data
//   const admissionCount = await Admission.countDocuments();
//   if (admissionCount > 0) return;
  
//   // Sample admission data
//   await Admission.create({
//     title: "Undergraduate Admission",
//     content: "Undergraduate admissions for the next academic year open on August 15th. Required documents include academic transcripts, ID proof, and two recommendation letters. The application fee is $50.",
//     keywords: ["undergraduate", "admission", "apply", "documents", "fee"]
//   });
  
//   await Admission.create({
//     title: "Graduate Admission",
//     content: "Graduate program applications are accepted year-round with primary deadlines on May 1st for Fall semester and November 1st for Spring. GRE scores and research proposals are required for all PhD applicants.",
//     keywords: ["graduate", "admission", "deadline", "requirements", "phd", "masters"]
//   });
  
//   // Sample fee data
//   await Fee.create({
//     type: "Tuition",
//     amount: 8500,
//     description: "Per semester tuition fee for full-time students",
//     dueDate: new Date("2025-08-15"),
//     keywords: ["tuition", "fee", "payment", "semester"]
//   });
  
//   await Fee.create({
//     type: "Scholarship",
//     amount: 5000,
//     description: "Merit scholarship covering partial tuition",
//     dueDate: new Date("2025-07-30"),
//     keywords: ["scholarship", "merit", "financial aid", "application"]
//   });
  
//   // Sample placement data
//   await Placement.create({
//     company: "Tech Solutions Inc.",
//     position: "Software Engineer",
//     package: "$85,000 per annum",
//     eligibility: "Minimum 3.5 GPA, CS or related major",
//     processDate: new Date("2025-02-15"),
//     keywords: ["tech", "software", "engineer", "coding"]
//   });
  
//   await Placement.create({
//     company: "Global Systems",
//     position: "Data Analyst",
//     package: "$75,000 per annum",
//     eligibility: "Statistics or Data Science background",
//     processDate: new Date("2025-03-10"),
//     keywords: ["data", "analyst", "statistics"]
//   });
  
//   // Sample academic data
//   await Academic.create({
//     type: "syllabus",
//     title: "Computer Science Curriculum",
//     content: "Core subjects include Programming Fundamentals, Data Structures, Algorithms, Database Management, Computer Networks, and Software Engineering.",
//     course: "B.Sc. Computer Science",
//     semester: "All",
//     year: 2025,
//     keywords: ["syllabus", "curriculum", "subjects", "computer science"]
//   });
  
//   await Academic.create({
//     type: "timetable",
//     title: "Class Schedule",
//     content: "Monday-Friday: 9AM-4PM with labs on Tuesday and Thursday afternoons.",
//     course: "All courses",
//     semester: "Fall",
//     year: 2025,
//     keywords: ["timetable", "schedule", "class", "timing"]
//   });
  
//   await Academic.create({
//     type: "holiday",
//     title: "Academic Holidays",
//     content: "Winter Break: Dec 22-Jan 3, Spring Break: Mar 15-22, Summer Break: Jun 10-Aug 15. All national holidays observed.",
//     course: "All courses",
//     semester: "Both",
//     year: 2025,
//     keywords: ["holiday", "break", "vacation"]
//   });
  
//   console.log("Database seeded successfully");
// };

// // Seed the database when server starts
// mongoose.connection.once('open', () => {
//   seedDatabase();
// });

const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Example: Fetch admission info
app.get('/api/admissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admissions');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example: Search based on user query
app.get('/api/placements/:program', async (req, res) => {
  const { program } = req.params;
  try {
    const result = await pool.query('SELECT * FROM placements WHERE program ILIKE $1', [`%${program}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch placement info' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
