require('dotenv').config();
const mongoose = require('mongoose');
const Flashcard = require('../models/Flashcard');

async function migrateFlashcards() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const result = await Flashcard.updateMany(
      { group: { $exists: false } },
      { $set: { group: 'Default' } }
    );
    console.log(`Updated ${result.nModified} flashcards with default group 'Default'`);
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateFlashcards();