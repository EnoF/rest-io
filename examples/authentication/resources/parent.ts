import AuthorizedResource from '../../../src/authorizedResource';

export const parentResource = new AuthorizedResource({
  name: 'parent',
  model: {
    name: String,
    subs: [{
      name: String
    }]
  }
});
