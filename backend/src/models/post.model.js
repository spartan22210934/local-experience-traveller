import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  author: {
     type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: {
     type: String,
     required: true
     },
  description: {
     type: String, 
     required: true 
    },
  category: {
     type: String, enum: ['Food', 'Concert', 'Event', 'Other'],
      required: true },
  images: [{ type: String }], // Array of URLs
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Social Engagement
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Simple heart
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For ranking/trending
  commentCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexing for location-based searches
postSchema.index({ "location.city": 1 });

export const Post = mongoose.model("Post", postSchema);