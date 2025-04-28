const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada o es nueva
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(8);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Método para verificar la contraseña actual
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Método para actualizar la contraseña de forma segura
userSchema.methods.updatePassword = async function(currentPassword, newPassword) {
  try {
    // Verificar la contraseña actual
    const isMatch = await this.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // Actualizar a la nueva contraseña
    this.password = newPassword;
    await this.save();
    return true;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;