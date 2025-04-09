import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBottomRef = useRef(null);
  const chatContainerRef = useRef(null); // Add this line
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const currentLastMessage = messages[messages.length - 1];
    if (currentLastMessage && lastMessageRef.current !== currentLastMessage) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      lastMessageRef.current = currentLastMessage;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');

      try {
        const response = await axios.post('http://127.0.0.1:5000/friendly_chat', { message: input });
        const botMessage = { text: response.data.response, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorBotMessage = { text: 'Sorry, an error occurred.', sender: 'bot', isError: true };
        setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
      }
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div ref={chatContainerRef} style={styles.chatContainer}> {/* Line 43 */}
        <div style={styles.messageContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(message.sender === 'user' ? styles.userMessage : styles.botMessage),
                ...(message.isError && styles.errorMessage),
              }}
            >
              {message.text}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            style={styles.input}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    padding: '0',
    margin: '0',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    fontFamily: 'sans-serif',
  },
  chatContainer: {
    height: '500px',
    width: '500px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  messageContainer: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '10px',
  },
  message: {
    maxWidth: '80%',
    padding: '8px 12px',
    borderRadius: '10px',
    marginBottom: '8px',
    clear: 'both',
    wordBreak: 'break-word',
    fontSize: '1em',
    fontFamily: 'sans-serif',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    float: 'right',
    color: '#333',
  },
  botMessage: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
    float: 'left',
    color: '#333',
  },
  errorMessage: {
    backgroundColor: '#FFDDDD',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
    fontSize: '1em',
    fontFamily: 'sans-serif',
  },
  sendButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1em',
    fontFamily: 'sans-serif',
  },
};

export default Chat;