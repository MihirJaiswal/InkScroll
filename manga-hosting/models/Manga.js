const mongoose = require('mongoose');

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
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Manga = mongoose.model('Manga', MangaSchema);

module.exports = Manga;
