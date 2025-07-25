import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import './Chat.scss';

function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('/chat', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('message', handleNewMessage);
    newSocket.on('error', handleError);
    setSocket(newSocket);

    fetchGardens();

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGardens = async () => {
    try {
      const res = await fetch('/api/users/gardens', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGardens(data.gardens);
      if (data.gardens.length > 0) {
        joinRoom(data.gardens[0]._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = (gardenId) => {
    if (socket && gardenId) {
      socket.emit('join-room', gardenId);
      setActiveRoom(gardenId);
      fetchMessages(gardenId);
    }
  };

  const fetchMessages = async (gardenId) => {
    try {
      const res = await fetch(`/api/chat/messages/${gardenId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessages(data.messages);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleError = (error) => {
    setError(error.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    socket.emit('message', {
      content: newMessage,
      room: activeRoom
    });

    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!user) {
    return <div className="unauthorized">Please login to access chat.</div>;
  }

  return (
    <div className="chat">
      <div className="chat-sidebar">
        <h3>Garden Chats</h3>
        {loading ? (
          <div className="loading">Loading gardens...</div>
        ) : (
          <div className="garden-list">
            {gardens.map(garden => (
              <button
                key={garden._id}
                className={`garden-button ${activeRoom === garden._id ? 'active' : ''}`}
                onClick={() => joinRoom(garden._id)}
              >
                {garden.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="chat-main">
        {error && <div className="error">{error}</div>}
        
        {activeRoom ? (
          <>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`message ${message.user._id === user._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <div className="message-header">
                      <span className="username">{message.user.name}</span>
                      <span className="time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit" disabled={!newMessage.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-room-selected">
            Select a garden to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
