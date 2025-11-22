const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        friendRequests: [
            {
                from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
            },
        ],
        blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        avatar: { type: String, default: '' },
        status: { type: String, enum: ['online', 'offline', 'busy'], default: 'offline' },
        verificationOTP: { type: String },
        otpExpires: { type: Date },
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
