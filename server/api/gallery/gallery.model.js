'use strict';

import mongoose from 'mongoose';

var GallerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'noname_gallery',
      trim: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    photo_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo'
    }]
  },
  // Schema options
  // http://mongoosejs.com/docs/guide.html#timestamps
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Gallery', GallerySchema);
