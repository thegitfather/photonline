'use strict';

import mongoose from 'mongoose';

var GallerySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    photo_ids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo'
    }],
    location: {
      type: String,
      default: 'unknown_location',
      trim: true
    },
    timeframeFrom: {
      type: Date
    },
    timeframeTo: {
      type: Date
    },
    description: {
      type: String,
      trim: true
    }
  },
  // Schema options
  // http://mongoosejs.com/docs/guide.html#timestamps
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Gallery', GallerySchema);
