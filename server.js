const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3333;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

require('./app/routes')(app);

app.listen(port, () => {
    console.log('We are live on ' + port);
});

app.use(express.static('html'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use('/json', express.static('json'));
