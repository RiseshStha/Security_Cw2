const messageModels = require("../models/messageModels");

// Send a new message
const sendMessage = async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
        const newMessage = new messageModels({ sender, receiver, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Get conversation between two users
const getConversation = async (req, res) => {
    const { userId1, userId2 } = req.body;
    // const { userId1, userId2 } = req.params;
    try {
        const messages = await messageModels.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        }).sort('timestamp');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

module.exports = {
    sendMessage,
    getConversation
}

