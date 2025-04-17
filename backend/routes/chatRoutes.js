import express from 'express';
import { pool } from '../config/db.js';
import { processMessage } from '../services/chatbotService.js';

const router = express.Router();

// Chat endpoint
router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    // Process the message and get response
    const response = await processMessage(message);

    // Save chat history to database
    await pool.query(
      'INSERT INTO chat_history (message, response) VALUES ($1, $2)',
      [message, response]
    );

    res.json({ success: true, response });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ success: false, error: 'Failed to process message' });
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM chat_history WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 50',
      [userId]
    );

    res.json({ success: true, history: result.rows });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chat history' });
  }
});

export default router; 