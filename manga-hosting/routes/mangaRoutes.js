// routes/mangaRoutes.js
const express = require('express');
const { uploadManga, getMangas } = require('../controllers/mangaController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
});

// @route   POST api/mangas
// @desc    Upload manga
// @access  Private
router.post('/', authMiddleware, upload.single('image'), uploadManga);

// @route   GET api/mangas
// @desc    Get all mangas
// @access  Public
router.get('/', getMangas);

module.exports = router;
