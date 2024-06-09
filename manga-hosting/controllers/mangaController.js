const Manga = require('../models/Manga');
const fs = require('fs');
const axios = require('axios');  // Assuming you'll use axios for API requests

exports.uploadManga = async (req, res) => {
  const { title, description, genre } = req.body;
  const pdfFile = req.file;
  const coverImage = req.body.coverImage
  console.log('uploadManga called');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  if (!pdfFile) {
    console.error('No PDF file uploaded');
    return res.status(400).json({ msg: 'No PDF file uploaded' });
  }

 /*  try {
    // Check PDF for NSFW content using an AI API
    const nsfwCheckResponse = await axios.post('YOUR_NSFW_API_ENDPOINT', {
      file: pdfFile.path,
      // Include any other required parameters for the API
    });

    const isNsfw = nsfwCheckResponse.data.is_nsfw;

    const manga = new Manga({
      title,
      description,
      author: req.user.id,
      pdf: pdfFile.path,
      nsfw: isNsfw,
    });

    await manga.save();
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; */

try {
  console.log('Skipping NSFW content check');

  const manga = new Manga({
    title,
    description,
    author: req.user.id,
    pdf: pdfFile.path,
    coverImage,
    genre,
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

exports.getMangas = async (req, res) => {
  try {
    const mangas = await Manga.find().populate('author', ['username']);
    res.json(mangas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getMangaByTitle = async (req, res) => {
  const title = req.params.title;

  try {
    const manga = await Manga.findOne({ title });
    if (!manga) {
      return res.status(404).json({ msg: 'Manga not found' });
    }
    res.json(manga);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
