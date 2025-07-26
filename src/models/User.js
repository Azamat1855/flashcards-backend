const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      console.log('Hashing password for user:', this.email)
      this.password = await bcrypt.hash(this.password, 10)
    }
    console.log('Saving user to collection: users')
    next()
  } catch (err) {
    console.error('User save error:', err.message, err.stack)
    next(err)
  }
})

UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (err) {
    console.error('Password comparison error:', err.message, err.stack)
    throw err
  }
}

// Explicitly set collection name to 'users'
module.exports = mongoose.model('User', UserSchema, 'users')