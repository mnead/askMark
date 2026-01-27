/**
 * Ask Mark Chat Widget
 * 
 * A React component for the Brave & Boundless chatbot.
 * Styled to match the B&B brand aesthetic.
 * 
 * Usage:
 * 1. Import the component: import AskMarkChat from './AskMarkChat';
 * 2. Add to your page: <AskMarkChat apiUrl="https://your-backend-url.com" />
 */

import React, { useState, useRef, useEffect } from 'react';

// Inline styles to avoid CSS file dependencies
const styles = {
  // Main container
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    border: '3px solid #1a1a1a',
    borderRadius: '0',
    overflow: 'hidden',
    backgroundColor: '#faf8f5', // cream
    boxShadow: '8px 8px 0 #1a1a1a',
  },

  // Header
  header: {
    backgroundColor: '#1a1a1a',
    color: '#faf8f5',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  headerIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#e63946', // red
    borderRadius: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  headerSubtitle: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    opacity: 0.8,
  },

  // Messages area
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  // Welcome message
  welcome: {
    textAlign: 'center',
    padding: '20px',
  },

  welcomeTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#1a1a1a',
  },

  welcomeText: {
    fontSize: '14px',
    color: '#4a4a4a',
    lineHeight: 1.5,
    marginBottom: '20px',
  },

  // Starter questions
  starters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  starterButton: {
    backgroundColor: '#fff',
    border: '2px solid #1a1a1a',
    padding: '12px 16px',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },

  starterButtonHover: {
    backgroundColor: '#1a1a1a',
    color: '#faf8f5',
  },

  // Message bubbles
  messageRow: {
    display: 'flex',
    gap: '12px',
    maxWidth: '90%',
  },

  messageRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },

  messageRowAssistant: {
    alignSelf: 'flex-start',
  },

  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },

  avatarUser: {
    backgroundColor: '#f4a261', // orange
    color: '#1a1a1a',
  },

  avatarAssistant: {
    backgroundColor: '#e63946', // red
    color: '#faf8f5',
  },

  messageBubble: {
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: 1.6,
  },

  messageBubbleUser: {
    backgroundColor: '#1a1a1a',
    color: '#faf8f5',
  },

  messageBubbleAssistant: {
    backgroundColor: '#fff',
    border: '2px solid #1a1a1a',
  },

  // Typing indicator
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '8px 0',
  },

  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#1a1a1a',
    borderRadius: '50%',
    animation: 'pulse 1.4s infinite ease-in-out',
  },

  // Input area
  inputContainer: {
    padding: '16px 20px',
    borderTop: '3px solid #1a1a1a',
    backgroundColor: '#fff',
  },

  inputWrapper: {
    display: 'flex',
    gap: '12px',
  },

  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    border: '2px solid #1a1a1a',
    borderRadius: '0',
    outline: 'none',
    fontFamily: 'inherit',
  },

  sendButton: {
    backgroundColor: '#e63946',
    color: '#faf8f5',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },

  sendButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },

  // Email prompt
  emailPrompt: {
    backgroundColor: '#fcf3cf',
    border: '2px solid #f4a261',
    padding: '16px',
    margin: '0 20px 16px 20px',
  },

  emailPromptText: {
    fontSize: '14px',
    marginBottom: '12px',
    color: '#1a1a1a',
  },

  emailInputWrapper: {
    display: 'flex',
    gap: '8px',
  },

  emailInput: {
    flex: 1,
    padding: '10px 12px',
    fontSize: '14px',
    border: '2px solid #1a1a1a',
    borderRadius: '0',
    fontFamily: 'inherit',
  },

  emailButton: {
    backgroundColor: '#1a1a1a',
    color: '#faf8f5',
    border: 'none',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontFamily: 'inherit',
  },

  dismissButton: {
    background: 'none',
    border: 'none',
    fontSize: '12px',
    color: '#666',
    cursor: 'pointer',
    marginTop: '8px',
    fontFamily: 'inherit',
  },

  // Success message
  successMessage: {
    backgroundColor: '#d4edda',
    border: '2px solid #28a745',
    padding: '12px 16px',
    margin: '0 20px 16px 20px',
    fontSize: '14px',
    color: '#155724',
  },

  // Error message
  errorMessage: {
    backgroundColor: '#f8d7da',
    border: '2px solid #dc3545',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#721c24',
  },
};

// CSS keyframes for typing animation (injected into document)
const injectStyles = () => {
  if (document.getElementById('ask-mark-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'ask-mark-styles';
  styleSheet.textContent = `
    @keyframes pulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }
    .ask-mark-typing-dot:nth-child(1) { animation-delay: 0s; }
    .ask-mark-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .ask-mark-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    .ask-mark-input:focus { border-color: #e63946 !important; }
    .ask-mark-starter:hover { background-color: #1a1a1a !important; color: #faf8f5 !important; }
    .ask-mark-send:hover:not(:disabled) { background-color: #c1121f !important; }
  `;
  document.head.appendChild(styleSheet);
};

// Starter questions
const STARTER_QUESTIONS = [
  "I'm stuck in a job I hate—what should I do?",
  "How do I have a hard conversation I've been avoiding?",
  "My teenager won't listen to me. Help.",
  "I feel like I've wasted years of my life. Is it too late?",
  "How do I know if my relationship is worth fighting for?",
];

// Format message content (handle bold text)
const formatMessage = (text) => {
  // Split by **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Main component
export default function AskMarkChat({ apiUrl = 'http://localhost:3001' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailDismissed, setEmailDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Inject CSS on mount
  useEffect(() => {
    injectStyles();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send message to backend
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageText.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          conversationId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      setConversationId(data.conversationId);
      
      // Show email prompt after 3 exchanges
      if (data.shouldPromptEmail && !emailDismissed && !emailSubmitted) {
        setShowEmailPrompt(true);
      }

    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Handle starter question click
  const handleStarterClick = (question) => {
    sendMessage(question);
  };

  // Handle email submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, conversationId })
      });

      if (response.ok) {
        setEmailSubmitted(true);
        setShowEmailPrompt(false);
      }
    } catch (err) {
      console.error('Email submit error:', err);
    }
  };

  // Dismiss email prompt
  const handleDismissEmail = () => {
    setShowEmailPrompt(false);
    setEmailDismissed(true);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>M</div>
        <div style={styles.headerText}>
          <h1 style={styles.headerTitle}>Ask Mark</h1>
          <p style={styles.headerSubtitle}>Advice from Brave & Boundless</p>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.welcome}>
            <div style={styles.welcomeTitle}>What's on your mind?</div>
            <p style={styles.welcomeText}>
              Get straight-talk advice on career, relationships, parenting, faith, 
              and breaking the patterns that hold you back. No bullshit, no sugarcoating.
            </p>
            <div style={styles.starters}>
              {STARTER_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  style={styles.starterButton}
                  className="ask-mark-starter"
                  onClick={() => handleStarterClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  ...(msg.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant)
                }}
              >
                <div
                  style={{
                    ...styles.avatar,
                    ...(msg.role === 'user' ? styles.avatarUser : styles.avatarAssistant)
                  }}
                >
                  {msg.role === 'user' ? 'Y' : 'M'}
                </div>
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAssistant)
                  }}
                >
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ ...styles.messageRow, ...styles.messageRowAssistant }}>
                <div style={{ ...styles.avatar, ...styles.avatarAssistant }}>M</div>
                <div style={{ ...styles.messageBubble, ...styles.messageBubbleAssistant }}>
                  <div style={styles.typing}>
                    <div style={styles.typingDot} className="ask-mark-typing-dot" />
                    <div style={styles.typingDot} className="ask-mark-typing-dot" />
                    <div style={styles.typingDot} className="ask-mark-typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {error && (
          <div style={styles.errorMessage}>{error}</div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Email prompt */}
      {showEmailPrompt && (
        <div style={styles.emailPrompt}>
          <div style={styles.emailPromptText}>
            Finding this helpful? Get notified when <em>Brave & Boundless</em> launches.
          </div>
          <form onSubmit={handleEmailSubmit} style={styles.emailInputWrapper}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.emailInput}
              required
            />
            <button type="submit" style={styles.emailButton}>
              Notify Me
            </button>
          </form>
          <button onClick={handleDismissEmail} style={styles.dismissButton}>
            No thanks
          </button>
        </div>
      )}

      {/* Email success */}
      {emailSubmitted && (
        <div style={styles.successMessage}>
          You're on the list. Watch your inbox.
        </div>
      )}

      {/* Input */}
      <div style={styles.inputContainer}>
        <form onSubmit={handleSubmit} style={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            style={styles.input}
            className="ask-mark-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            style={{
              ...styles.sendButton,
              ...(isLoading || !input.trim() ? styles.sendButtonDisabled : {})
            }}
            className="ask-mark-send"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
