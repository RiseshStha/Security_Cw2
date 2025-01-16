const router = require('express').Router();
const messageController = require('../controllers/messageControllers');

// Route to send a message
router.post('/send', messageController.sendMessage);

// Route to get conversation between two users
router.get('/conversation', messageController.getConversation);

module.exports = router;