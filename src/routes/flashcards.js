const express = require('express')
const router = express.Router()
const Flashcard = require('../models/Flashcard')
const jwt = require('jsonwebtoken')

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Get all flashcards
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching flashcards for user:', req.user.userId)
    const flashcards = await Flashcard.find({ userId: req.user.userId })
    res.json(flashcards)
  } catch (err) {
    console.error('Get flashcards error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create a flashcard
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating flashcard for user:', req.user.userId, req.body)
    const { word, translation, definition, group } = req.body
    if (!word || !translation || !definition || !group) {
      return res.status(400).json({ error: 'Word, translation, definition, and group are required' })
    }
    const flashcard = new Flashcard({
      word,
      translation,
      definition,
      group,
      userId: req.user.userId,
    })
    await flashcard.save()
    res.status(201).json(flashcard)
  } catch (err) {
    console.error('Create flashcard error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete a flashcard
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting flashcard:', req.params.id)
    const flashcard = await Flashcard.findOneAndDelete({ _id: req.params.id, userId: req.user.userId })
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' })
    }
    res.json({ message: 'Flashcard deleted' })
  } catch (err) {
    console.error('Delete flashcard error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update a flashcard
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Updating flashcard:', req.params.id, req.body)
    const { word, translation, definition, group } = req.body
    if (!word || !translation || !definition || !group) {
      return res.status(400).json({ error: 'Word, translation, definition, and group are required' })
    }
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { word, translation, definition, group } },
      { new: true }
    )
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' })
    }
    res.json(flashcard)
  } catch (err) {
    console.error('Update flashcard error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router 