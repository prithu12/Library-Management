import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './Config/db.js';
import authRoutes from './Routes/auth.routes.js';
import connectCloudinary from './Config/cloudinary.js';
import bookRoutes from './Routes/book.routes.js';
import borrowRoutes from './Routes/borrow.routes.js';
import adminRoutes from './Routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173' || 'http://localhost:5174',
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Library Management API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found`, success: false });
});


  await connectDB();
  connectCloudinary();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;
