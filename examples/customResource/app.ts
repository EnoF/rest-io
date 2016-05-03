import * as express from 'express';
import RestIO from '../../src/index';
import * as mongoose from 'mongoose';
export const app = express();

var port = 3030;

var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var mongoUrl = 'mongodb://' + host + ':' + (process.env.MONGO_PORT || '27017') + '/';

var db = new mongoose.Mongoose();
mongoUrl += (process.env.DB || 'customResource');
db.connect(mongoUrl);

new RestIO(app, {
  db: db,
  resources: __dirname + '/resources'
});

app.listen(port, () => {
  console.log('Server has started under port: ' + port);
});
