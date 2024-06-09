// controllers/mangaController.js
const Manga = require('../models/Manga');
const path = require('path');
const fs = require('fs');

exports.uploadManga = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
    const manga = new Manga({
      title,
      description,
      author: req.user.id,
      image: file.path,
    });

    await manga.save();
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMangas = async (req, res) => {
  try {
    const mangas = await Manga.find().populate('author', ['username']);
    res.json(mangas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
