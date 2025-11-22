const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // We might need a Chat model for group/1:1 management
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        type: { type: String, enum: ['text', 'image', 'video', 'file'], default: 'text' },
        fileUrl: { type: String, default: '' },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
