import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (e) {
    console.error('❌ Error connecting to MongoDB:', e.message);
    process.exit(1);
  }
};

export default connectDB;
