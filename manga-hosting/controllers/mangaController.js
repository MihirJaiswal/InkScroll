const Manga = require('../models/Manga');
const fs = require('fs');
const { validationResult } = require('express-validator');

exports.uploadManga = async (req, res) => {
  const { title, description, genre, chapterNumber, tags, status } = req.body;
  const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
  const coverImageFile = req.files['coverImage'] ? req.files['coverImage'][0] : null;

  if (!pdfFile || !coverImageFile) {
    return res.status(400).json({ msg: 'PDF and cover image are required' });
  }

  try {
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
      nsfw: false,
    });

    await manga.save();
    res.json(manga);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getMangas = async (req, res) => {
  try {
    const mangas = await Manga.find().populate('author', ['username']).populate('comments.user', 'username profilePicture');
    res.json(mangas);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getMangaByTitle = async (req, res) => {
  try {
    const manga = await Manga.findOne({ title: req.params.title })
      .populate('author', ['username'])
      .populate('comments.user', 'username profilePicture');
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });
    res.json(manga);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.addChapter = async (req, res) => {
  const { title, chapterNumber, subTitle, description } = req.body;
  const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
  const coverImageFile = req.files['coverImage'] ? req.files['coverImage'][0] : null;

  if (!pdfFile || !coverImageFile) {
    return res.status(400).json({ msg: 'PDF and cover image are required' });
  }

  try {
    const manga = await Manga.findOne({ title });
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    if (manga.author.toString() !== req.user.id) return res.status(403).json({ msg: 'User not authorized' });

    manga.chapters.push({
      chapterNumber,
      title,
      subTitle,
      description,
      pdf: pdfFile.path,
      coverImage: coverImageFile.path,
    });

    await manga.save();
    res.json(manga);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const title = req.params.title;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const manga = await Manga.findOne({ title });
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const newComment = { user: req.user.id, text };
    manga.comments.push(newComment);
    await manga.save();

    const populatedManga = await Manga.findOne({ title }).populate('comments.user', 'username profilePicture');
    const addedComment = populatedManga.comments.find(comment => comment.text === text && comment.user.equals(req.user.id));

    res.status(201).json(addedComment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  const { title, commentId } = req.params;

  try {
    const manga = await Manga.findOne({ title });
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const comment = manga.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    manga.comments.pull(commentId);
    await manga.save();

    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.addChapterComment = async (req, res) => {
  const { mangaId, chapterId } = req.params;
  const { text } = req.body;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });

    const newComment = { user: req.user.id, text };
    chapter.comments.push(newComment);
    await manga.save();

    res.status(201).json(chapter.comments);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.addCommentReply = async (req, res) => {
  const { mangaId, chapterId, commentId } = req.params;
  const { text } = req.body;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });

    const comment = chapter.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    const reply = { user: req.user.id, text };
    comment.replies.push(reply);
    await manga.save();

    res.status(201).json(comment.replies);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.likeComment = async (req, res) => {
  const { mangaId, chapterId, commentId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });

    const comment = chapter.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.likes.includes(req.user.id)) {
      comment.likes.pull(req.user.id);
    } else {
      comment.likes.push(req.user.id);
      if (comment.dislikes.includes(req.user.id)) {
        comment.dislikes.pull(req.user.id);
      }
    }

    await manga.save();
    res.json(comment.likes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.dislikeComment = async (req, res) => {
  const { mangaId, chapterId, commentId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });

    const comment = chapter.comments.id(commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    if (comment.dislikes.includes(req.user.id)) {
      comment.dislikes.pull(req.user.id);
    } else {
      comment.dislikes.push(req.user.id);
      if (comment.likes.includes(req.user.id)) {
        comment.likes.pull(req.user.id);
      }
    }

    await manga.save();
    res.json(comment.dislikes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getChapterComments = async (req, res) => {
  const { mangaId, chapterId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });

    const populatedChapter = await manga.populate({
      path: `chapters.${chapter._id}.comments.user`,
      select: 'username profilePicture',
    }).execPopulate();

    res.json(populatedChapter.comments);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateManga = async (req, res) => {
  const { id } = req.params;
  const { title, description, genre, tags, status, nsfw } = req.body;

  try {
    const manga = await Manga.findById(id);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    if (manga.author.toString() !== req.user.id) return res.status(403).json({ msg: 'User not authorized' });

    manga.title = title || manga.title;
    manga.description = description || manga.description;
    manga.genre = genre || manga.genre;
    manga.tags = tags ? tags.split(',') : manga.tags;
    manga.status = status || manga.status;
    manga.nsfw = nsfw !== undefined ? nsfw : manga.nsfw;

    await manga.save();
    res.json(manga);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteManga = async (req, res) => {
  const { id } = req.params;

  try {
    const manga = await Manga.findById(id);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    if (manga.author.toString() !== req.user.id) return res.status(403).json({ msg: 'User not authorized' });

    await manga.remove();
    res.json({ msg: 'Manga deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateChapter = async (req, res) => {
  const { mangaId, chapterId } = req.params;
  const { title, chapterNumber, subTitle, description } = req.body;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });

    if (manga.author.toString() !== req.user.id) return res.status(403).json({ msg: 'User not authorized' });

    chapter.title = title || chapter.title;
    chapter.chapterNumber = chapterNumber || chapter.chapterNumber;
    chapter.subTitle = subTitle || chapter.subTitle;
    chapter.description = description || chapter.description;

    await manga.save();
    res.json(manga);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteChapter = async (req, res) => {
  const { mangaId, chapterId } = req.params;

  try {
    const manga = await Manga.findById(mangaId);
    if (!manga) return res.status(404).json({ msg: 'Manga not found' });

    const chapter = manga.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ msg: 'Chapter not found' });

    if (manga.author.toString() !== req.user.id) return res.status(403).json({ msg: 'User not authorized' });

    chapter.remove();
    await manga.save();
    res.json({ msg: 'Chapter deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
