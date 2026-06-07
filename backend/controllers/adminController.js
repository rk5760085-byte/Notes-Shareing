const User = require('../models/User');
const Note = require('../models/Note');
const Comment = require('../models/Comment');

// @desc    Get admin dashboard analytics & statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNotes = await Note.countDocuments();

    // Sum of all note download counts
    const downloadsSum = await Note.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$downloadCount' },
        },
      },
    ]);
    const totalDownloads = downloadsSum.length > 0 ? downloadsSum[0].total : 0;

    // Active users: count users who registered or uploaded notes (mock value + actual user count)
    const activeUsers = await User.countDocuments({ role: 'student' });

    // Group notes by semester
    const notesBySemester = await Note.aggregate([
      {
        $group: {
          _id: '$semester',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // Group notes by subject (Top 5 subjects)
    const notesBySubject = await Note.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Latest user signs
    const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select('-password');

    // Popular notes (Most downloaded)
    const popularNotes = await Note.find({}).sort({ downloadCount: -1 }).limit(5).populate('author', 'name');

    res.json({
      totalUsers,
      totalNotes,
      totalDownloads,
      activeUsers,
      notesBySemester,
      notesBySubject,
      recentUsers,
      popularNotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account and their notes/comments
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin account' });
    }

    // Find and delete all notes created by this user
    const notes = await Note.find({ author: userId });
    for (const note of notes) {
      // Delete comments of this note
      await Comment.deleteMany({ note: note._id });
      // Note deletion file handling (optional, but good for cleanup)
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', note.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await Note.findByIdAndDelete(note._id);
    }

    // Delete comments written by this user
    await Comment.deleteMany({ user: userId });

    // Remove user references from other users' bookmarks/downloads
    await User.updateMany(
      {},
      {
        $pull: { bookmarks: { $in: notes.map(n => n._id) } },
        $pull: { downloads: { $in: notes.map(n => n._id) } }
      }
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notes (admin view)
// @route   GET /api/admin/notes
// @access  Private/Admin
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ createdAt: -1 }).populate('author', 'name email');
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllNotes,
};
