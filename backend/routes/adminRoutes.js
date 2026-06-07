const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllNotes,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Group routes under protect & admin middleware
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/notes', getAllNotes);

module.exports = router;
