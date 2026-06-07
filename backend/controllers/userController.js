const User = require('../models/User');
const Note = require('../models/Note');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile, bookmarks, and downloads
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarks',
        populate: { path: 'author', select: 'name' }
      })
      .populate({
        path: 'downloads',
        populate: { path: 'author', select: 'name' }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's uploaded notes
    const uploadedNotes = await Note.find({ author: req.user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      bookmarks: user.bookmarks,
      downloads: user.downloads,
      uploadedNotesCount: uploadedNotes.length,
      uploadedNotes: uploadedNotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      user.password = req.body.password; // pre-save hook will hash it
    }

    const updatedUser = await user.save();

    // Re-query user to populate bookmarks and downloads
    const populatedUser = await User.findById(updatedUser._id)
      .populate('bookmarks')
      .populate('downloads');

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      profileImage: populatedUser.profileImage,
      bookmarks: populatedUser.bookmarks,
      downloads: populatedUser.downloads,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
