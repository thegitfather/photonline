'use strict';

import mongoose from 'mongoose';

var PhotoSchema = new mongoose.Schema(
  {
    gallery_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' },
    filename: {
      type: String,
      trim: true
    },
    path: {
      type: String,
      default: './uploads/',
      trim: true
    },
    originalFilename: {
      type: String,
      trim: true
    },
    size: {
      type: Number,
      default: 0
    },
    md5: {
      type: String,
      trim: true
    },
    position: {
      type: Number
    }
  }
);

export default mongoose.model('Photo', PhotoSchema);
