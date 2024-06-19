//routes/userRoutes.js
const express = require('express');
const { updateProfile, getProfile, addFavorite, removeFavorite, getUserFavorites, getMangaById, followUser, unfollowUser } = require('../controllers/userController');
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
  limits: { fileSize: 5000000 }, // 5 MB limit for profile picture
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Image Files Only!'));
    }
  }
});

const uploadSingleImage = upload.single('profilePicture');

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, uploadSingleImage, updateProfile);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

router.get('/favorites', authMiddleware, getUserFavorites);
// @route   POST api/users/favorites/:mangaId
// @desc    Add manga to favorites
// @access  Private
router.post('/favorites/:mangaId', authMiddleware, addFavorite);

// @route   DELETE api/users/favorites/:mangaId
// @desc    Remove manga from favorites
// @access  Private
router.delete('/favorites/:mangaId', authMiddleware, removeFavorite);

router.get('/mangas/:mangaId', authMiddleware, getMangaById);

// New routes for follow and unfollow
// @route   POST api/users/follow/:userId
// @desc    Follow a user
// @access  Private
router.post('/follow/:userId', authMiddleware, followUser);

// @route   DELETE api/users/unfollow/:userId
// @desc    Unfollow a user
// @access  Private
router.delete('/unfollow/:userId', authMiddleware, unfollowUser);

module.exports = router;
