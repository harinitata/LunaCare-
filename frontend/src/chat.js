import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      try {
        const response = await axios.post('http://127.0.0.1:5000/friendly_chat', { message: input });
        console.log("Response Data:", response.data); // Added for debugging
        // changed the next line to account for different response structures.
        let responseText = response.data.response || response.data || 'Response not found';
        setMessages((prevMessages) => [...prevMessages, { text: responseText, sender: 'bot' }]);

      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prevMessages) => [...prevMessages, { text: 'Sorry, an error occurred.', sender: 'bot' }]);
      }
    }
  };

  return (
    <div style={{ height: '500px', border: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
            <strong>{message.sender === 'user' ? 'You:' : 'Bot:'}</strong> {message.text}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          style={{ flex: 1, marginRight: '10px' }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;