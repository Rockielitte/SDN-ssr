import mongoose from 'mongoose';
import AppConfig from './appConfig';

const connectDB = async () => {
  try {
    await mongoose.connect(AppConfig.MONGO_DB_URI);
    console.log('Successfully connected to DB');
  } catch (error) {
    console.error('Could not connect to DB', error);
    process.exit(1);
  }
};
export default connectDB;
