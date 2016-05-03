import { Schema } from 'mongoose';
import UserResource from '../../../src/userResource';

export const user = new UserResource({
  name: 'user',
  model: {
    userName: String,
    password: String,
    roles: [{
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }]
  }
});
