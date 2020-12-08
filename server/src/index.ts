import { builtinModules } from 'module';

const express = require('express');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const app = express();
const config = require('./config.json');
const bodyParser = require('body-parser');

app.use(cors());
app.use(history({}));
app.use(bodyParser.json());

app.use('/api/upload', require('./routes/api/upload'));
app.use('/api/login', require('./routes/api/login'));

app.use(express.static(`${__dirname}/uploads`));
app.use(express.static(`${__dirname}/dist`));

const PORT = config.server.port || 5000;
app.listen(PORT, () => console.log("Server Started On Port", PORT));
