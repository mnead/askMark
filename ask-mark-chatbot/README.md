# Ask Mark - Brave & Boundless Chatbot

An AI-powered Q&A tool that provides advice based on *Brave & Boundless* by Mark Nead. Young adults and parents can ask questions about career, relationships, parenting, faith, and breaking generational patterns—and receive guidance grounded in the book's 15 Boundless Rules.

---

## Quick Start

### 1. Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your API key
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Start the server
npm start
```

The server runs on `http://localhost:3001` by default.

### 3. Add the Widget to Your Site

**Option A: Standalone HTML (easiest)**

Copy the contents of `frontend/ask-mark-embed.html` into your website. Update the `apiUrl` in the CONFIG section:

```javascript
const CONFIG = {
  apiUrl: 'https://your-backend-url.com', // Your deployed backend
};
```

**Option B: React Component**

If your site uses React, import the component:

```jsx
import AskMarkChat from './AskMarkChat';

function App() {
  return (
    <AskMarkChat apiUrl="https://your-backend-url.com" />
  );
}
```

---

## File Structure

```
ask-mark-chatbot/
├── backend/
│   ├── server.js          # Express server with Claude API
│   ├── package.json       # Node.js dependencies
│   └── .env.example       # Environment variables template
│
├── frontend/
│   ├── AskMarkChat.jsx    # React component version
│   └── ask-mark-embed.html # Standalone HTML version
│
└── README.md              # This file
```

---

## Deployment Options

### Backend Deployment

**Option 1: Railway (Recommended for simplicity)**

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

**Option 2: Render**

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect repo, set root directory to `backend`
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Deploy

**Option 3: Vercel (Serverless)**

Convert `server.js` to serverless function format for Vercel's API routes.

**Option 4: Your Own Server**

```bash
# On your server
git clone your-repo
cd ask-mark-chatbot/backend
npm install
npm start

# Use PM2 for production
npm install -g pm2
pm2 start server.js --name ask-mark
```

### Frontend Deployment

The frontend is static HTML/JS—host it anywhere:
- Add directly to your Shopify/WordPress/Squarespace site
- Host on Netlify, Vercel, or GitHub Pages
- Include in your existing braveandboundless.com build

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `PORT` | No | Server port (default: 3001) |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed origins for CORS |

### Customization

**Change Starter Questions**

Edit `STARTER_QUESTIONS` array in either frontend file:

```javascript
const STARTER_QUESTIONS = [
  "Your custom question 1?",
  "Your custom question 2?",
  // etc.
];
```

**Adjust Colors/Branding**

The widget uses your brand colors:
- Black: `#1a1a1a`
- Red: `#e63946`
- Orange: `#f4a261`
- Cream: `#faf8f5`

Edit the CSS styles to match any brand updates.

**Connect Email Service**

In `server.js`, uncomment and configure the email integration:

```javascript
// ConvertKit example
await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: process.env.CONVERTKIT_API_KEY,
    email: email
  })
});
```

---

## API Endpoints

### POST /api/chat

Send a message and get a response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I hate my job but I'm scared to leave" }
  ],
  "conversationId": "optional-existing-id"
}
```

**Response:**
```json
{
  "message": "I get it. Bills don't care about your dreams...",
  "conversationId": "conv_abc123",
  "shouldPromptEmail": false,
  "usage": {
    "inputTokens": 1500,
    "outputTokens": 450
  }
}
```

### POST /api/subscribe

Subscribe an email to your list.

**Request:**
```json
{
  "email": "user@example.com",
  "conversationId": "conv_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thanks for signing up!"
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-22T12:00:00.000Z"
}
```

---

## Cost Estimation

Using Claude 3.5 Sonnet:
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

**Typical conversation (5 exchanges):**
- ~2,500 input tokens (system prompt + messages)
- ~2,000 output tokens (responses)
- **Cost: ~$0.04 per conversation**

**Monthly estimates:**
| Conversations/month | Estimated Cost |
|---------------------|----------------|
| 100 | ~$4 |
| 1,000 | ~$40 |
| 10,000 | ~$400 |

---

## Rate Limiting

The backend includes basic rate limiting:
- 10 requests per minute per IP
- Returns 429 status if exceeded

For production with high traffic, implement Redis-based rate limiting.

---

## Security Considerations

1. **Never expose your API key** - Keep it server-side only
2. **CORS configuration** - Set `ALLOWED_ORIGINS` to your domain only
3. **Input validation** - Messages are truncated to 2000 characters
4. **Rate limiting** - Prevents abuse and runaway costs

---

## Troubleshooting

**"CORS error" in browser**

Add your frontend domain to `ALLOWED_ORIGINS` in `.env`:
```
ALLOWED_ORIGINS=https://braveandboundless.com,https://www.braveandboundless.com
```

**"API key invalid" error**

1. Check your API key is correct in `.env`
2. Ensure no extra spaces or quotes around the key
3. Verify your Anthropic account has API access enabled

**Widget not loading**

1. Check browser console for errors
2. Verify the `apiUrl` points to your running backend
3. Ensure backend server is running and accessible

**Slow responses**

Claude typically responds in 2-5 seconds. If slower:
1. Check your server's network connectivity
2. Consider upgrading server resources
3. Anthropic API may have temporary latency

---

## Analytics & Monitoring

Track these metrics:
- Conversations started per day
- Messages per conversation
- Email capture rate
- Most common question topics

Consider integrating:
- Google Analytics events
- Mixpanel or Amplitude
- Your own database logging

---

## Support

For issues with this implementation:
- Check the troubleshooting section above
- Review Anthropic's [API documentation](https://docs.anthropic.com/)

For the Brave & Boundless book content and messaging:
- Contact Mark directly

---

## License

This implementation is provided for Brave & Boundless use. The underlying book content and brand are proprietary to Mark Nead.
