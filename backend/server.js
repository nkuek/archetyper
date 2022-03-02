const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const compression = require('compression');
const app = express();

app.use(compression());
// app.use(favicon('../frontend/build/favicon.ico'));

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join('../frontend', 'build')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));
});

app.listen(port);
