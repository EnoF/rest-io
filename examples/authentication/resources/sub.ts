import AuthorizedSubResource from '../../../src/authorizedSubResource';
import { parentResource } from './parent';

export const sub = new AuthorizedSubResource({
  name: 'sub',
  parentResource: parentResource
});
