import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


// initialize
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

console.log('Connecting to:', process.env.MONGO_URI);

// connect DB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB Connected');
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
})
.catch((err) => console.error(err));

import postRoutes from './routes/postRoutes.js';

// after your other app.use()
app.use('/api/posts', postRoutes);


