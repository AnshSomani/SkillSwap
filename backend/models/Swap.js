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
    requesterSkill: {
        type: String,
        required: true,
    },
    responderSkill: {
        type: String,
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
