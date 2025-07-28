import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './CommunityForum.scss';

const CommunityForum = () => {
  const { gardenId } = useParams();
  const { user, token } = useAuthStore();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch chat rooms for the garden
  const fetchChatRooms = async () => {
    try {
      const response = await fetch(`/api/chat/garden/${gardenId}/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChatRooms(data.data);
        
        // Auto-select general room if available
        const generalRoom = data.data.find(room => room.type === 'general');
        if (generalRoom && !selectedRoom) {
          setSelectedRoom(generalRoom);
        }
      }
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected room
  const fetchMessages = async (roomId) => {
    try {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`/api/chat/rooms/${selectedRoom._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage,
          type: 'text',
          replyTo: replyTo?._id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
        setReplyTo(null);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedRoom) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'image');

    setSendingMessage(true);
    try {
      const response = await fetch(`/api/chat/rooms/${selectedRoom._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.data]);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setSendingMessage(false);
      setShowImageUpload(false);
    }
  };

  // Add reaction to message
  const addReaction = async (messageId, emoji) => {
    try {
      await fetch(`/api/chat/rooms/${selectedRoom._id}/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emoji })
      });

      // Refresh messages to show updated reactions
      fetchMessages(selectedRoom._id);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  useEffect(() => {
    if (gardenId && token) {
      fetchChatRooms();
    }
  }, [gardenId, token]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom._id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading community forum..." />;
  }

  return (
    <div className="community-forum">
      <Navbar />
      
      <div className="forum-container">
        {/* Sidebar with chat rooms */}
        <div className="forum-sidebar">
          <h2>Chat Rooms</h2>
          <div className="rooms-list">
            {chatRooms.map(room => (
              <div
                key={room._id}
                className={`room-item ${selectedRoom?._id === room._id ? 'active' : ''}`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="room-info">
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                </div>
                {room.unreadCount > 0 && (
                  <span className="unread-badge">{room.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main chat area */}
        <div className="forum-main">
          {selectedRoom ? (
            <>
              {/* Chat header */}
              <div className="chat-header">
                <h2>{selectedRoom.name}</h2>
                <p>{selectedRoom.description}</p>
                <span className="member-count">
                  👥 {selectedRoom.members?.length || 0} members
                </span>
              </div>

              {/* Messages area */}
              <div className="messages-container">
                {messages.map(message => (
                  <div key={message._id} className="message">
                    <div className="message-avatar">
                      <img 
                        src={message.sender.profilePicture || '/api/placeholder/40/40'} 
                        alt={message.sender.name}
                      />
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="sender-name">{message.sender.name}</span>
                        <span className="message-time">{formatTime(message.createdAt)}</span>
                      </div>
                      
                      {message.replyTo && (
                        <div className="reply-reference">
                          Replying to: {message.replyTo.content?.substring(0, 50)}...
                        </div>
                      )}
                      
                      <div className="message-text">
                        {message.type === 'image' ? (
                          <img 
                            src={message.attachments?.[0]?.url} 
                            alt="Shared image"
                            className="message-image"
                          />
                        ) : (
                          message.content
                        )}
                      </div>
                      
                      {/* Message actions */}
                      <div className="message-actions">
                        <button 
                          onClick={() => setReplyTo(message)}
                          className="action-btn"
                        >
                          💬 Reply
                        </button>
                        <button 
                          onClick={() => addReaction(message._id, '👍')}
                          className="action-btn"
                        >
                          👍
                        </button>
                        <button 
                          onClick={() => addReaction(message._id, '❤️')}
                          className="action-btn"
                        >
                          ❤️
                        </button>
                      </div>
                      
                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="message-reactions">
                          {message.reactions.map((reaction, index) => (
                            <span key={index} className="reaction">
                              {reaction.emoji} {reaction.count || 1}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply indicator */}
              {replyTo && (
                <div className="reply-indicator">
                  <span>Replying to {replyTo.sender.name}: {replyTo.content?.substring(0, 50)}...</span>
                  <button onClick={() => setReplyTo(null)}>✕</button>
                </div>
              )}

              {/* Message input */}
              <div className="message-input-container">
                <div className="input-actions">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="action-btn"
                    disabled={sendingMessage}
                  >
                    📷
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={sendingMessage}
                  className="message-input"
                />
                
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="send-btn"
                >
                  {sendingMessage ? '⏳' : '📤'}
                </button>
              </div>
            </>
          ) : (
            <div className="no-room-selected">
              <h2>Select a chat room to start messaging</h2>
              <p>Choose from the available rooms in the sidebar</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityForum;
