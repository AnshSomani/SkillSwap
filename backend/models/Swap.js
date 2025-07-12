import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    responder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    // UPDATED: Changed from a single String to an array of Strings
    requesterSkills: {
        type: [String],
        required: true,
    },
    // UPDATED: Changed from a single String to an array of Strings
    responderSkills: {
        type: [String],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

export default mongoose.model('Swap', swapSchema);
