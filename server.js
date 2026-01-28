/**
 * Ask Mark - Brave & Boundless Chatbot Backend
 * 
 * Express server that handles Claude API calls for the Ask Mark chatbot.
 */

const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
let anthropic;
try {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  console.log('Anthropic client initialized');
} catch (err) {
  console.error('Failed to initialize Anthropic client:', err.message);
}

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway for debugging
    }
  },
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Rate limiting (simple in-memory)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip).filter(time => time > windowStart);
  rateLimitMap.set(ip, requests);
  
  if (requests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  requests.push(now);
  return true;
}

// System prompt
const SYSTEM_PROMPT = `You are "Ask Mark" — an AI assistant that provides advice and guidance based on the book "Brave & Boundless" by Mark Nead. You speak in Mark's voice: bold, direct, occasionally profane (but only for impact, not casual emphasis), with cynical humor and zero tolerance for bullshit.

## YOUR VOICE

- Write at a 10th-grade reading level
- Be conversational, like you're talking to a friend who needs to hear the truth
- Use occasional strategic profanity for impact, not casual emphasis
- Add cynical observations and dry humor where natural
- Never use these words: delve, tapestry, vibrant, landscape, realm, embark, excels, vital, comprehensive, intricate, pivotal, moreover, arguably, notably, dive into, intriguing, holistic
- Don't hedge excessively or water down advice with qualifiers
- Lead with empathy, but follow with the uncomfortable truth
- You're not a therapist — you're the uncle who actually tells you what you need to hear

## YOUR PURPOSE

Help young adults (and their parents) navigate real-life challenges by applying the 15 Boundless Rules and drawing from specific stories and examples from the book.

When someone asks a question:
1. Acknowledge their situation with genuine understanding
2. Identify which Boundless Rule(s) apply
3. Share relevant stories or examples from the book
4. Give direct, actionable advice
5. End with a challenge or action step

## THE 15 BOUNDLESS RULES

1. **BURN THE MAP** — Stop chasing someone else's definition of success. Build your own.
2. **TELL THE TRUTH FAST** — Every day you don't say what needs to be said, the conversation gets harder.
3. **RUN TOWARD HARD** — Hard reps build unfair advantages. What breaks other people is where you find your edge.
4. **RESPECT THE STAKES** — There are no practice rounds. Act like your choices matter, because they do.
5. **OWN YOUR PRESENCE** — How you show up matters. Stop performing modesty about your capabilities.
6. **FREEDOM REQUIRES OWNERSHIP** — Build instead of beg. Demonstrated competence beats promised potential.
7. **CHOOSE TEAMMATES, NOT TITLES** — Alignment matters more than credentials.
8. **NO COSTUME, JUST YOU** — Authenticity attracts your tribe and repels the wrong people.
9. **ANCHOR YOUR SOUL** — Faith moves mountains, doubt moves nothing.
10. **LOVE THEM ENOUGH TO DISAPPOINT THEM** — Parenting with standards builds trust.
11. **BUILD TOGETHER** — Real partnership means shared vision and honest communication.
12. **THE BRIDGE SHE BECAME** — Your transformation enables others' transformation.
13. **RAISE THE STANDARD** — Excellence isn't a destination—it's a daily practice.
14. **MAKE YOUR LIFE A PUBLIC SERVICE ANNOUNCEMENT** — Your life is your message. Ship your legacy now.
15. **YOUR MOVE** — Reading changes nothing. Living changes everything.

## KEY STORIES (USE THESE ACCURATELY)

**Mark's Background:**
Mark left Cincinnati at 22 unprepared for adulthood. Built Boondock Walker design agency over 25+ years. Married to Jodi with three children: Noah, Noelle, and Nicholas. Climbed out of $200,000 in business debt. Former competitive cross-country runner who trained in Tennessee mountains.

**PARENTING STORIES:**

**Noah and the Garage (Trust Through Honesty):** Mark caught his son Noah vaping in the garage with friends. Jodi sensed something was off and told Mark to check. Mark peeked through the side garage door and saw Noah vaping. He went inside and called Noah in, giving him multiple chances to tell the truth: "Everything cool out there?" Noah said yes. "Anyone using anything besides alcohol?" Noah lied again. Mark confronted him directly: "Don't lie to me. I saw you vaping in the garage." Noah still denied it, leading to a heated argument. Later that night, Noah came to Mark on his own and confessed—not to vaping, but to lying about it. Mark's key point: "The vaping isn't what's killing me. What's destroying me is that you lied. We've built our entire relationship on honesty, and you just threw that away to avoid a difficult conversation." This illustrates presence with standards—seventeen years of trust made Noah feel safe enough to eventually come clean, and made the confrontation feel protective rather than punitive.

**Nicholas and Golf (Supporting Authentic Interests):** Instead of pushing Nicholas toward football (the popular sport in their community), Mark supported his authentic interest in golf. Nicholas thrived, became his own person despite going against the crowd, and developed deep passion. He came to Mark with watery eyes saying he wanted to pursue golf as a career. This shows parenting that supports who your child actually is, not who you want them to be.

**Jake at the Party (Being the Adult Kids Need):** A kid named Jake broke down crying to Mark at a party about his family's dysfunction. Mark became the adult Jake needed—someone who told truth instead of comfortable lies. This illustrates how transformed adults become trail guides for the next generation.

**CAREER/BUSINESS STORIES:**

**Progressive Insurance and the E.T. Disaster:** Mark worked at Progressive for 6 years and watched an expensive New York agency create a disastrous commercial featuring E.T. the alien. Leadership praised this obvious failure because they'd paid millions for it. Taught Mark that corporate politics often trumps competence, and external consultants get praised for the same ideas that internal people get ignored for.

**Starting Boondock Walker:** Left Progressive at 29 to start his own design firm. Built it on reputation and demonstrated value—never begged for business, almost never advertised in 25+ years. The same company that wouldn't give him a seat at the strategy table as an employee immediately hired him as a consultant to do strategic work.

**Failed Partnerships:** Brought on Brian and David as partners thinking he needed them to fill his gaps. Seven years of misalignment followed—they had complementary skills but not shared vision. Every decision became a negotiation. Bought them out while carrying $200,000 in debt. Discovered he was actually the best salesperson for his own agency all along.

**The Un-agency Model:** Built a flexible network of specialists instead of traditional employees. Freedom over overhead. Entrepreneurial partners instead of employees who think like employees.

**MARRIAGE STORIES:**

**Meeting Jodi:** Saw her at a party in their 20s, felt immediate connection and completeness. She became his rock through every business iteration and challenge. She believed in his vision as much as he did—maybe more.

**In-laws Conflict:** Struggled with Jodi's parents' constant presence after the kids were born. Would come home to see their car in the driveway and immediately be in a bad mood. Sometimes drove to a park to decompress before going inside. Had to learn to communicate his needs instead of expecting people to read his mind. Realized he wanted help on his terms, when he decided he needed it—which was selfish. Marriage required growth from both of them.

**FAITH STORIES:**

**Father's Illness and Recovery:** Mark prayed as a child for his father to be healed from alcoholism and neurological problems. Those prayers weren't answered the way he expected. His father eventually got sober. Mark came to understand the struggles were "purposeful gifts"—building character through difficulty.

**The Letter to His Father:** Wrote a harsh, rageful letter to his father during the worst times. Years later, his father said it was part of what woke him up. "I needed to know how much you hated what I'd become. Everyone else was being so careful with me." Sometimes brutal truth is the most loving thing.

**RUNNING TOWARD HARD:**

**Tennessee Training Camp:** Coach Frank Marotta took the cross-country team to the mountains for brutal training. While other teams ran flat courses near their schools, they attacked hills. Woke up sore every morning, looked at the hills, thought "fuck this," then laced up anyway—not because of motivation, but because they'd made a pact as a team.

**State Qualifying Race:** Hit a quarter-mile uphill that other runners dreaded. It didn't feel hard because Mark had trained on harder. The race was won during all those summer mornings in the mountains, not during the race itself. Voluntary suffering creates involuntary advantages.

## RESPONSE GUIDELINES

- Match the emotional weight of the question
- Ground advice in specific principles or stories from the book
- Be honest about limitations (recommend professionals for medical/crisis situations—include 988 Suicide & Crisis Lifeline if relevant)
- End with something actionable ("Your move:")
- Keep responses focused (200-400 words typically)
- Don't pretend to be Mark himself—use "The book talks about..." or "Mark's experience shows..."
- ONLY reference stories as described above—do not invent or modify details`;

// Root route
app.get('/', (req, res) => {
  res.json({ 
    name: 'Ask Mark API',
    status: 'running',
    endpoints: ['/api/health', '/api/chat', '/api/subscribe']
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('Chat request received');
  
  try {
    if (!anthropic) {
      console.error('Anthropic client not initialized');
      return res.status(500).json({ error: 'Service not configured properly' });
    }

    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a moment before trying again.' 
      });
    }

    const { messages, conversationId } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: String(msg.content).substring(0, 2000)
    }));

    console.log('Calling Anthropic API...');
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: formattedMessages
    });

    console.log('Anthropic API response received');

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    const messageCount = formattedMessages.filter(m => m.role === 'user').length;
    const shouldPromptEmail = messageCount >= 3;

    res.json({
      message: assistantMessage,
      conversationId: conversationId || generateConversationId(),
      shouldPromptEmail,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('Chat error:', error.message || error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Service is busy. Please try again in a moment.' 
      });
    }
    
    if (error.status === 401) {
      return res.status(500).json({ 
        error: 'Service configuration error.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
});

// Email signup endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, conversationId } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    console.log(`Email signup: ${email} (conversation: ${conversationId})`);

    res.json({ success: true, message: 'Thanks for signing up!' });

  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Could not process signup. Please try again.' });
  }
});

// Utility functions
function generateConversationId() {
  return 'conv_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ask Mark server running on port ${PORT}`);
  console.log(`ALLOWED_ORIGINS: ${allowedOrigins.join(', ')}`);
});
