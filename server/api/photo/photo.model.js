'use strict';

import mongoose from 'mongoose';

var PhotoSchema = new mongoose.Schema(
  {
    gallery_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' },
    filename: {
      type: String,
      default: 'default.jpg',
      trim: true
    },
    path: {
      type: String,
      default: '/uploads/',
      trim: true
    },
    originalFilename: {
      type: String,
      default: 'originalFilename.jpg',
      trim: true
    },
    size: {
      type: Number,
      default: 0
    },
    md5: {
      type: String,
      default: 'unset',
      trim: true
    }
  }
);

export default mongoose.model('Photo', PhotoSchema);
