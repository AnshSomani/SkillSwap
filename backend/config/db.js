import mongoose from 'mongoose';

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        global.mongoError = 'MONGO_URI is not defined in environment variables';
        console.error(global.mongoError);
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        global.mongoError = error.message;
    }
};

export default connectDB;
