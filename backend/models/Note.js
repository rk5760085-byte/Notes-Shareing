const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject name'],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Please specify the semester'],
      enum: {
        values: [
          'Semester 1',
          'Semester 2',
          'Semester 3',
          'Semester 4',
          'Semester 5',
          'Semester 6',
          'Semester 7',
          'Semester 8',
          'Other'
        ],
        message: 'Please choose a valid semester',
      },
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    fileUrl: {
      type: String,
      required: [true, 'Please upload a PDF file'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comment counts or population
noteSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'note',
  justOne: false,
});

module.exports = mongoose.model('Note', noteSchema);
