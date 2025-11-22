const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    searchUsers,
    sendFriendRequest,
    respondToFriendRequest,
    getFriends
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, searchUsers);
router.post('/friend-request', protect, sendFriendRequest);
router.put('/friend-request', protect, respondToFriendRequest);
router.get('/friends', protect, getFriends);

module.exports = router;
