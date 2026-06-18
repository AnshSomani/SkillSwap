import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import swapRoutes from './routes/swaps.js';
import adminRoutes from './routes/admin.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS — allow requests from the deployed frontend URL and localhost dev
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // set this in Vercel env vars to your frontend deployment URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/admin', adminRoutes);

// Health check / root
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkillSwap API is running ✅',
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    dbCode: mongoose.connection.readyState,
    error: global.mongoError || null
  });
});

// Only start the HTTP server when NOT running inside Vercel (i.e. local dev)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

// Export for Vercel serverless
export default app;
