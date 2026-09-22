import mongoose from 'mongoose';
import dotenv from 'dotenv';
export const UserSchmema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength:8,
    },
    role:{
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
})