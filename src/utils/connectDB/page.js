import  mongoose from "mongoose";

const connectDB = async () =>{
    if(mongoose.connection.readyState === 1 ){
        console.log("MongoDB already connected");
        return;
      }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "nurspire",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
          });
        console.log("Connected to Mongodb");
    } catch (error) {
        console.error("Failed to connect Mongodb",error)
        console.log("Failed to connect Mongodb")
    }
};
export default connectDB;