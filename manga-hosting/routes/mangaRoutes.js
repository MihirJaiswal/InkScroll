const express = require('express');
const {
  uploadManga, getMangas, getMangaByTitle, addChapter, addComment, deleteComment,
  updateManga, deleteManga, updateChapter, deleteChapter, addChapterComment, 
  addCommentReply, likeComment, dislikeComment, getChapterComments 
} = require('../controllers/mangaController');
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
  limits: { fileSize: 9000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = file.fieldname === 'pdf' ? /pdf/ : /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error(`Error: ${file.fieldname === 'pdf' ? 'PDF' : 'Image'} Files Only!`));
    }
  }
});

const uploadFields = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

router.post('/', authMiddleware, uploadFields, uploadManga);
router.get('/', getMangas);
router.get('/:title', getMangaByTitle);
router.post('/add-chapter', authMiddleware, uploadFields, addChapter);

router.post('/:title/comments', [
  authMiddleware, 
  check('text', 'Text is required').not().isEmpty()
], addComment);

router.delete('/:title/comments/:commentId', authMiddleware, deleteComment);

router.put('/:id', authMiddleware, updateManga);
router.delete('/:id', authMiddleware, deleteManga);
router.put('/:mangaId/chapters/:chapterId', authMiddleware, updateChapter);
router.delete('/:mangaId/chapters/:chapterId', authMiddleware, deleteChapter);

router.post('/:mangaId/chapters/:chapterId/comments', [
  authMiddleware,
  check('text', 'Text is required').not().isEmpty()
], addChapterComment);

router.post('/:mangaId/chapters/:chapterId/comments/:commentId/replies', [
  authMiddleware,
  check('text', 'Text is required').not().isEmpty()
], addCommentReply);

router.put('/:mangaId/chapters/:chapterId/comments/:commentId/like', authMiddleware, likeComment);
router.put('/:mangaId/chapters/:chapterId/comments/:commentId/dislike', authMiddleware, dislikeComment);
router.get('/:mangaId/chapters/:chapterId/comments', getChapterComments);

module.exports = router;
