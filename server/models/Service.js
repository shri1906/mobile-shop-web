const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Service title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Service price is required'],
        min: [0, 'Price cannot be negative'],
    },
    duration: {
        type: String,
        required: true,
        default: '1-2 hours',
    },
    category: {
        type: String,
        enum: ['screen-repair', 'battery', 'software', 'water-damage', 'data-recovery', 'other'],
        required: true,
    },
    icon :{
        type: String,
        default: '🛠'
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Service', serviceSchema);