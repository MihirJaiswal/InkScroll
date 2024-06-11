const Manga = require('../models/Manga');
const fs = require('fs');
const axios = require('axios'); // Assuming you'll use axios for API requests

// Function to upload manga
exports.uploadManga = async (req, res) => {
  const { title, description, genre, chapterNumber, tags, status } = req.body;
  const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
  const coverImageFile = req.files['coverImage'] ? req.files['coverImage'][0] : null;

  if (!pdfFile) {
    console.error('No PDF file uploaded');
    return res.status(400).json({ msg: 'No PDF file uploaded' });
  }

  if (!coverImageFile) {
    console.error('No cover image uploaded');
    return res.status(400).json({ msg: 'No cover image uploaded' });
  }

  try {
    console.log('Skipping NSFW content check');

    const manga = new Manga({
      title,
      description,
      author: req.user.id,
      pdf: pdfFile.path,
      coverImage: coverImageFile.path,
      genre,
      chapterNumber,
      tags: tags ? tags.split(',') : [],
      status: status || 'ongoing',
      nsfw: false, // Temporarily setting this to false
    });

    await manga.save();
    console.log('Manga saved successfully:', manga);
    res.json(manga);
  } catch (err) {
    console.error('Error during upload process:', err);
    res.status(500).send('Server error');
  }
};

// Function to get all mangas
exports.getMangas = async (req, res) => {
  try {
    const mangas = await Manga.find().populate('author', ['username']);
    res.json(mangas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Function to get manga by title
exports.getMangaByTitle = async (req, res) => {
  const title = req.params.title;

  try {
    const manga = await Manga.findOne({ title }).populate('author', ['username']);
    if (!manga) {
      return res.status(404).json({ msg: 'Manga not found' });
    }
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Function to add a new chapter
exports.addChapter = async (req, res) => {
  const { title, chapterNumber } = req.body;
  const pdfFile = req.file;

  if (!pdfFile) {
    console.error('No PDF file uploaded');
    return res.status(400).json({ msg: 'No PDF file uploaded' });
  }

  try {
    const manga = await Manga.findOne({ title });

    if (!manga) {
      return res.status(404).json({ msg: 'Manga not found' });
    }

    manga.chapters.push({
      chapterNumber,
      title,
      pdf: pdfFile.path,
    });

    await manga.save();
    console.log('Chapter added successfully:', manga);
    res.json(manga);
  } catch (err) {
    console.error('Error adding chapter:', err);
    res.status(500).send('Server error');
  }
};

//function to add comments
exports.addComment = async (req, res) => {
  const title = req.params.title;
  const { text } = req.body;

  try {
    const manga = await Manga.findOne({ title });
    if (!manga) {
      return res.status(404).json({ msg: 'Manga not found' });
    }

    const newComment = {
      user: req.user.id,
      text,
    };

    manga.comments.push(newComment);
    await manga.save();
    res.json(newComment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};