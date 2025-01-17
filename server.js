const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './secret.env' });  // Specify the correct file name

// App setup
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// MongoDB connection setup (using Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Failed to connect to MongoDB Atlas:', err));


// Define Message Schema
const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    randomTag: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);

// API Endpoints
// Save a message
app.post('/messages', async (req, res) => {
    const { text } = req.body;
    const randomTag = `Anonymous #${Math.floor(Math.random() * 10000)}`;
    try {
        const message = new Message({ text, randomTag });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Retrieve all messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

console.log('Mongo URI:', process.env.MONGO_URI);