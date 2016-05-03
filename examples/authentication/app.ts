import * as express from 'express';
import RestIO from '../../src/index';
import * as mongoose from 'mongoose';

export const app = express();

var port = 4000;

var db = new mongoose.Mongoose();
var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var mongoUrl = 'mongodb://' + host + ':' + (process.env.MONGO_PORT || '27017') + '/';

mongoUrl += (process.env.DB || 'auth');
db.connect(mongoUrl);

new RestIO(app, {
  db: db,
  resources: __dirname + '/resources'
});

process.env.REST_IO_HMAC_KEY = process.env.REST_IO_HMAC_KEY || 'hmac key which set via js to demo';
process.env.REST_IO_AES_KEY = process.env.REST_IO_AES_KEY || 'aes key which is set via js to demo';

app.listen(port, () => {
  console.log('Server has started under port: ' + port);
});
