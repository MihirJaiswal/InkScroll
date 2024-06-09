//mangaRouter.js
const express = require('express');
const { uploadManga, getMangas,getMangaByTitle } = require('../controllers/mangaController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5 MB limit for PDF files
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: PDF Files Only!');
    }
  },
});

// @route   POST api/mangas
// @desc    Upload manga
// @access  Private
router.post('/', authMiddleware, upload.single('pdf'), uploadManga);

// @route   GET api/mangas
// @desc    Get all mangas
// @access  Public
router.get('/', getMangas);

// @route   GET api/mangas/:title
// @desc    Get manga by title
// @access  Public
router.get('/:title', getMangaByTitle);

module.exports = router;
