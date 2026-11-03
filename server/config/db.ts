import mongoose from 'mongoose';

let isConnectedToAtlas = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.log('ℹ️ [RentEase DB] No MONGODB_URI found in environment. Initializing high-performance embedded database with demo records.');
    return false;
  }

  try {
    console.log('⏳ [RentEase DB] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnectedToAtlas = true;
    console.log('✅ [RentEase DB] Successfully connected to MongoDB Atlas!');
    return true;
  } catch (err: any) {
    console.warn(`⚠️ [RentEase DB] MongoDB connection failed (${err.message}). Falling back gracefully to built-in store so app works out of the box.`);
    isConnectedToAtlas = false;
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connectedToAtlas: isConnectedToAtlas,
    readyState: mongoose.connection.readyState,
    databaseType: isConnectedToAtlas ? 'MongoDB Atlas (Mongoose)' : 'Embedded RentEase Engine',
  };
};
