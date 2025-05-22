import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://rajubadike23:AzYr2X5LWCbYquVL@assessment.9epwzea.mongodb.net/AssessmentDb';
    
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(mongoURI, options);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('MongoDB Connection Error:', error.message);
      if (error.message.includes('IP whitelist')) {
        console.error('\nPlease follow these steps to fix the connection:');
        console.error('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
        console.error('2. Click on your cluster');
        console.error('3. Go to Network Access under Security');
        console.error('4. Add your current IP address or allow access from anywhere (0.0.0.0/0)');
      }
    }
    process.exit(1);
  }
};

export default connectDB; 