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
        default: 'https://placehold.co/100x100/8b5cf6/ffffff?text=S',
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
    // --- NEW FIELD FOR BANNING USERS ---
    isBanned: {
        type: Boolean,
        default: false,
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

// Helper to generate initials from a name
export const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length > 1) {
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
        return nameParts[0].charAt(0).toUpperCase();
    }
    return 'U';
};

// Encrypt password using bcrypt and set profilePhoto initials if not specified
userSchema.pre('save', async function (next) {
    if (!this.profilePhoto || this.profilePhoto.endsWith('?text=S') || this.profilePhoto === 'https://placehold.co/100x100/8b5cf6/ffffff?text=S') {
        const initials = getInitials(this.name);
        // Default color for user profile background
        const bgColor = this.role === 'admin' ? '10b981' : '8b5cf6';
        this.profilePhoto = `https://placehold.co/100x100/${bgColor}/ffffff?text=${initials}`;
    }

    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
