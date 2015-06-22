import {AuthorizedResource} from '../../../src/authorizedResource';

var parentResource = new AuthorizedResource({
  name: 'parent',
  model: {
    name: String,
    subs: [{
      name: String
    }]
  }
});

export = parentResource;