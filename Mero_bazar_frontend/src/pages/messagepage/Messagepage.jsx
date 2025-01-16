// components/Chat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat({ userId, receiverId }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Fetch conversation history between the two users when the component mounts
    const fetchConversation = async () => {
      try {
        const response = await axios.get('api/message/conversation', {
          params: { userId1: userId, userId2: receiverId },
        });
        setChatHistory(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchConversation();
  }, [userId, receiverId]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = {
          sender: userId,
          receiver: receiverId,
          message,
        };
        const response = await axios.post('api/message/send', newMessage);
        setChatHistory((prevChats) => [...prevChats, response.data]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${chat.sender === userId ? 'sent' : 'received'}`}
          >
            <p>{chat.message}</p>
            <small>{new Date(chat.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
