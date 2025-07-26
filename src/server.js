const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middlewares
app.use(cors({ origin: ['http://localhost:5000','http://localhost:5173'], credentials: true }))
app.use(express.json())

// Routes
app.use('/api/flashcards', require('./routes/flashcards'))
app.use('/api/auth', require('./routes/auth'))

// Connect DB and start server
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGO_URI.replace(/:\/\/[^@]+@/, '://<credentials>@'));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message, err.stack);
});