const express = require('express');
const router = express.Router();
const {
  uploadNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  downloadNote,
  likeNote,
  bookmarkNote,
  addComment,
  deleteComment,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public search & view routes
router.get('/', getNotes);
router.get('/:id', getNoteById);

// Protected actions on notes
router.post('/', protect, upload.single('pdf'), uploadNote);
router.put('/:id', protect, upload.single('pdf'), updateNote);
router.delete('/:id', protect, deleteNote);

// Download action (Requires protect to log user download logs)
router.get('/:id/download', protect, downloadNote);

// Likes and bookmarks
router.post('/:id/like', protect, likeNote);
router.post('/:id/bookmark', protect, bookmarkNote);

// Comment management
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
