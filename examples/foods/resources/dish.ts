import { Schema } from 'mongoose';
import { Resource } from '../../../src/resource';
import { food } from './food';

export const dish = new Resource({
  name: 'dish',
  model: {
    name: String,
    mainIngredient: {
      type: Schema.Types.ObjectId,
      ref: 'Food'
    }
  },
  parentResource: food,
  parentRef: 'mainIngredient'
});
