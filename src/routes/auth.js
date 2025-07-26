const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken') // Fixed import (was incorrectly 'bcryptjs')
const bcrypt = require('bcryptjs')

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      console.log('Missing email or password:', { email, password })
      return res.status(400).json({ error: 'Email and password are required' })
    }
    console.log('Register attempt for email:', email)
    let user = await User.findOne({ email })
    if (user) {
      console.log('User already exists:', email)
      return res.status(400).json({ error: 'User already exists' })
    }
    user = new User({ email, password })
    console.log('Creating new user:', email)
    await user.save()
    console.log('User saved successfully:', email)
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.status(201).json({ token })
  } catch (err) {
    console.error('Register endpoint error:', err.message, err.stack)
    res.status(500).json({ error: `Server error: ${err.message}` })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token })
  } catch (err) {
    console.error('Login endpoint error:', err.message, err.stack)
    res.status(500).json({ error: `Server error: ${err.message}` })
  }
})

module.exports = router