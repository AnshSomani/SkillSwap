import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import url module

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

// Enable CORS - This is still useful for development
app.use(cors());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/admin', adminRoutes);

// --- Deployment Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if in production environment
if (process.env.NODE_ENV === 'production') {
  // Set the frontend build folder as a static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // For any route that is not an API route, serve the frontend's index.html file
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  );
} else {
  // In development, just confirm the API is running
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
