import * as express from 'express';
import RestIO from '../../src/index';
import * as mongoose from 'mongoose';

export const app = express();

const port = 3000;

new RestIO(app, {
  resources: `${__dirname}/resources`
});

const host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
let mongoUrl = `mongodb://${host}:${process.env.MONGO_PORT || '27017'}/`;

mongoUrl += (process.env.DB || 'foods');
mongoose.connect(mongoUrl);

app.listen(port, () => {
  console.log(`Server has started under port: ${port}`);
});
