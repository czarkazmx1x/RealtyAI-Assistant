import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real_estate_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Define schemas
const listingSchema = new mongoose.Schema({
  address: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  squareFootage: Number,
  lotSize: Number,
  features: String,
  neighborhood: String,
  images: [String],
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  interest: String,
  priceRange: Number,
  timeline: String,
  notes: String,
  status: { type: String, default: 'new' },
  score: Number,
  priority: String,
  contactCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Task schema for the task management system
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  type: String, // 'lead-followup', 'showing', 'listing', etc.
  relatedToId: mongoose.Schema.Types.ObjectId, // Reference to a lead or listing
  relatedToType: String, // 'lead' or 'listing'
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Social media post tracking
const postSchema = new mongoose.Schema({
  platform: String, // 'nextdoor', 'facebook', etc.
  content: String,
  images: [String],
  listingId: mongoose.Schema.Types.ObjectId,
  status: String, // 'draft', 'scheduled', 'published'
  scheduledTime: Date,
  publishedTime: Date,
  engagement: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
export const Listing = mongoose.model('Listing', listingSchema);
export const Lead = mongoose.model('Lead', leadSchema);
export const Task = mongoose.model('Task', taskSchema);
export const Post = mongoose.model('Post', postSchema);

export default { connectDB, Listing, Lead, Task, Post };
