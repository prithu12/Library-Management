import mongoose from 'mongoose';

export const connectDB = async () => {
  // Read the env var lazily: dotenv.config() runs after this module is imported.
  const mongoUri = process.env.MONGODB_URI || process.env.MongoDB_URI;

  try {
    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing from the environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};