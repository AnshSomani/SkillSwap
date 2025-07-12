import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ratingSchema = new mongoose.Schema({
    rater: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    feedback: {
        type: String,
        trim: true,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    location: {
        type: String,
        default: '',
    },
    profilePhoto: {
        type: String,
        default: 'https://placehold.co/100x100/8b5cf6/ffffff?text=U',
    },
    skillsOffered: [String],
    skillsWanted: [String],
    availability: {
        type: String,
        default: 'Weekends',
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    ratings: [ratingSchema],
    avgRating: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
