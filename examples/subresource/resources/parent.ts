import { Schema } from 'mongoose';
import { Resource } from '../../../src/resource';

export const parentResource = new Resource({
  name: 'parent',
  model: {
    name: String,
    subs: [{
      name: String,
      ref: {
        type: Schema.Types.ObjectId,
        ref: 'Ref'
      }
    }]
  }
});
