const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Service is required'],
    },
    deviceModel:{
        type: String,
        required: [true, 'Device model is required'],
        trim: true,
    },
    issueDescription: {
        type: String,
        required: [true, 'Issue description is required'],
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required'],
    },
    appointmentTime: {
        type: String,
        required: [true, 'Appointment time is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
        