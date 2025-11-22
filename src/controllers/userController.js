const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Search users
// @route   GET /api/users?search=keyword
// @access  Private
const searchUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
};

// @desc    Send friend request
// @route   POST /api/users/friend-request
// @access  Private
const sendFriendRequest = async (req, res) => {
    const { userId } = req.body;

    if (userId === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    const userToSend = await User.findById(userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToSend) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends
    if (currentUser.friends.includes(userId)) {
        return res.status(400).json({ message: 'User is already your friend' });
    }

    // Check if request already sent
    const alreadySent = userToSend.friendRequests.find(
        (r) => r.from.toString() === req.user._id.toString()
    );

    if (alreadySent) {
        return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Check if they sent you a request (if so, auto-accept? For now, just error)
    const receivedRequest = currentUser.friendRequests.find(
        (r) => r.from.toString() === userId && r.status === 'pending'
    );

    if (receivedRequest) {
        return res.status(400).json({ message: 'This user has already sent you a friend request. Please accept it.' });
    }

    userToSend.friendRequests.push({ from: req.user._id });
    await userToSend.save();

    res.status(200).json({ message: 'Friend request sent' });
};

// @desc    Accept/Reject friend request
// @route   PUT /api/users/friend-request
// @access  Private
const respondToFriendRequest = async (req, res) => {
    const { requestId, action } = req.body; // action: 'accept' or 'reject'

    const user = await User.findById(req.user._id);
    const request = user.friendRequests.find((r) => r._id.toString() === requestId);

    if (!request) {
        return res.status(404).json({ message: 'Friend request not found' });
    }

    if (action === 'accept') {
        // Add to friends list for both
        user.friends.push(request.from);
        const sender = await User.findById(request.from);
        sender.friends.push(user._id);
        await sender.save();

        // Remove from requests
        user.friendRequests = user.friendRequests.filter((r) => r._id.toString() !== requestId);
        await user.save();
        res.json({ message: 'Friend request accepted' });
    } else if (action === 'reject') {
        user.friendRequests = user.friendRequests.filter((r) => r._id.toString() !== requestId);
        await user.save();
        res.json({ message: 'Friend request rejected' });
    } else {
        res.status(400).json({ message: 'Invalid action' });
    }
};

// @desc    Get friends list
// @route   GET /api/users/friends
// @access  Private
const getFriends = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('friends', 'name email avatar status')
        .populate('friendRequests.from', 'name email avatar');

    res.json({
        friends: user.friends,
        friendRequests: user.friendRequests,
    });
};

module.exports = {
    registerUser,
    authUser,
    getUserProfile,
    searchUsers,
    sendFriendRequest,
    respondToFriendRequest,
    getFriends
};
