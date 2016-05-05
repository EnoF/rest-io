import SubResource from '../../../src/subResource';
import { parentResource } from './parent';

export const sub = new SubResource({
  name: 'sub',
  parentResource,
  populate: 'subs.ref'
});
