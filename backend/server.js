import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname, __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initialize app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB connection
console.log('Connecting to:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('❌ DB Connection Error:', err));
