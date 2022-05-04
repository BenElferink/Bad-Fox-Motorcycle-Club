import mongoose from 'mongoose'
import { MONGO_OPTIONS, MONGO_URI } from '../constants/mongo'

const connection = {}

const connectDB = async () => {
  if (connection.isConnected) return

  try {
    const db = await mongoose.connect(MONGO_URI, MONGO_OPTIONS)

    connection.isConnected = db.connections[0].readyState
    console.log('✅ MongoDB connected:', connection.isConnected)
  } catch (error) {
    console.log('❌ MongoDB connection error:', error.message)
  }
}

export default connectDB
