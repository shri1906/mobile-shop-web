const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  duration: {
    type: String,
    required: true,
    default: '1-2 hours'
  },
  category: {
    type: String,
    enum: ['screen-repair', 'battery', 'water-damage', 'software', 'data-recovery', 'other'],
    required: true
  },
  icon: {
    type: String,
    default: '🔧'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);
