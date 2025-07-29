const mongoose = require('mongoose')

const FlashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  translation: { type: String, required: true },
  definition: { type: String, required: true },
  group: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'flashcards' })

module.exports = mongoose.model('Flashcard', FlashcardSchema, 'flashcards')