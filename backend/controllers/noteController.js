const Note = require('../models/Note');
const User = require('../models/User');
const Comment = require('../models/Comment');
const path = require('path');
const fs = require('fs');

// @desc    Upload a new note
// @route   POST /api/notes
// @access  Private
const uploadNote = async (req, res) => {
  try {
    const { title, subject, semester, description, tags } = req.body;

    if (!title || !subject || !semester || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Process tags (comma separated string to array)
    let processedTags = [];
    if (tags) {
      processedTags = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '');
    }

    // Relative path for client access
    const fileUrl = `/uploads/${req.file.filename}`;

    const note = await Note.create({
      title,
      subject,
      semester,
      description,
      tags: processedTags,
      fileUrl,
      author: req.user._id,
      authorName: req.user.name,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notes (with search, filter, sorting)
// @route   GET /api/notes
// @access  Public
const getNotes = async (req, res) => {
  try {
    const { search, subject, semester, tag, sort, author } = req.query;

    // Build Match Query
    let matchQuery = {};

    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, '$options': 'i' } },
        { subject: { $regex: search, '$options': 'i' } },
        { tags: { $regex: search, '$options': 'i' } },
      ];
    }

    if (subject) {
      matchQuery.subject = { $regex: subject, '$options': 'i' };
    }

    if (semester) {
      matchQuery.semester = semester;
    }

    if (tag) {
      matchQuery.tags = tag;
    }

    if (author) {
      // Find notes by author ID or search by author name
      matchQuery.$or = [
        { authorName: { $regex: author, '$options': 'i' } }
      ];
    }

    // Create MongoDB Aggregation pipeline to support sorting by likes length
    let pipeline = [{ $match: matchQuery }];

    // Add fields for count calculations
    pipeline.push({
      $addFields: {
        likesCount: { $size: { $ifNull: ['$likes', []] } },
      },
    });

    // Define Sorting
    let sortField = { createdAt: -1 }; // Default: Latest
    if (sort === 'downloads') {
      sortField = { downloadCount: -1 };
    } else if (sort === 'likes') {
      sortField = { likesCount: -1 };
    } else if (sort === 'oldest') {
      sortField = { createdAt: 1 };
    }

    pipeline.push({ $sort: sortField });

    // Execute aggregation
    const notes = await Note.aggregate(pipeline);

    // Populate the author details manually on aggregation results
    await Note.populate(notes, { path: 'author', select: 'name email profileImage' });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get note by ID
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('author', 'name email profileImage')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'user', select: 'name profileImage' }
      });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const { title, subject, semester, description, tags } = req.body;

    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure user is note owner or admin
    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to update this note' });
    }

    // Process tags
    let processedTags = note.tags;
    if (tags) {
      processedTags = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '');
    }

    note.title = title || note.title;
    note.subject = subject || note.subject;
    note.semester = semester || note.semester;
    note.description = description || note.description;
    note.tags = processedTags;

    // Handle new file if uploaded
    if (req.file) {
      // Delete old file
      const oldFilePath = path.join(__dirname, '..', note.fileUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      note.fileUrl = `/uploads/${req.file.filename}`;
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure user is note owner or admin
    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this note' });
    }

    // Delete PDF file from uploads directory
    const filePath = path.join(__dirname, '..', note.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete associated comments
    await Comment.deleteMany({ note: note._id });

    // Remove note
    await Note.findByIdAndDelete(req.params.id);

    // Remove references from users' bookmarks
    await User.updateMany(
      { bookmarks: note._id },
      { $pull: { bookmarks: note._id } }
    );

    res.json({ message: 'Note removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download note file
// @route   GET /api/notes/:id/download
// @access  Private
const downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const filePath = path.join(__dirname, '..', note.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Physical PDF file not found on server' });
    }

    // Increment download count
    note.downloadCount += 1;
    await note.save();

    // Log to user download history
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user && !user.downloads.includes(note._id)) {
        user.downloads.push(note._id);
        await user.save();
      }
    }

    res.download(filePath, `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike a note
// @route   POST /api/notes/:id/like
// @access  Private
const likeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user has already liked the note
    const alreadyLiked = note.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike
      note.likes = note.likes.filter((userId) => userId.toString() !== req.user._id.toString());
    } else {
      // Like
      note.likes.push(req.user._id);
    }

    await note.save();

    res.json({
      likes: note.likes,
      likesCount: note.likes.length,
      isLiked: !alreadyLiked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bookmark / Unbookmark a note
// @route   POST /api/notes/:id/bookmark
// @access  Private
const bookmarkNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already bookmarked
    const alreadyBookmarked = user.bookmarks.includes(note._id);

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter((noteId) => noteId.toString() !== note._id.toString());
    } else {
      user.bookmarks.push(note._id);
    }

    await user.save();

    res.json({
      bookmarks: user.bookmarks,
      isBookmarked: !alreadyBookmarked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to note
// @route   POST /api/notes/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Please add comment text' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const comment = await Comment.create({
      note: note._id,
      user: req.user._id,
      userName: req.user.name,
      userProfileImage: req.user.profileImage,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment from note
// @route   DELETE /api/notes/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership or admin status
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({ message: 'Comment removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
