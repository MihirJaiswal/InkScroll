//models/Manga.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChapterSchema = new mongoose.Schema({
  chapterNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
  pdf: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MangaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pdf: {
    type: String,
    required:true,
  },
  coverImage: {
    type: String, // Assuming the cover image is stored as a URL
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  nsfw: {
    type: Boolean,
    default: false,
  },
  chapters: [ChapterSchema],
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
  },
  comments: [CommentSchema],
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'hiatus'],
    default: 'ongoing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field on save
MangaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Manga = mongoose.model('Manga', MangaSchema);

module.exports = Manga;
