const express = require('express');
const { uploadManga, getMangas, getMangaByTitle, addChapter, addComment } = require('../controllers/mangaController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

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
  limits: { fileSize: 9000000 }, // 5 MB limit for PDF files
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf') {
      const filetypes = /pdf/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Error: PDF Files Only!'));
      }
    } else if (file.fieldname === 'coverImage') {
      // Allow all image types for coverImage
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Error: Image Files Only!'));
      }
    }
  }
});

const uploadFields = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// @route   POST api/mangas
// @desc    Upload manga
// @access  Private
router.post('/', authMiddleware, uploadFields, uploadManga);

// @route   GET api/mangas
// @desc    Get all mangas
// @access  Public
router.get('/', getMangas);

// @route   GET api/mangas/:title
// @desc    Get manga by title
// @access  Public
router.get('/:title', getMangaByTitle);

router.get('/api/mangas/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const manga = await Manga.findOne({ title }).populate('chapters').exec(); // Populate chapters

    if (!manga) {
      return res.status(404).send('Manga not found');
    }

    res.json(manga);
  } catch (error) {
    console.error('Error fetching manga:', error);
    res.status(500).send('Server error');
  }
});

// @route   POST api/mangas/add-chapter
// @desc    Add a new chapter
// @access  Private
const uploadSinglePdf = upload.single('pdf');
router.post('/add-chapter', authMiddleware, uploadSinglePdf, addChapter);

//comments
router.post('/:title/comments', [authMiddleware, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  addComment(req, res);
});

module.exports = router;
