var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./config');
var bcrypt = require('bcrypt');

var app = express();
app.use(cors());

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

function convertPlainTextToCryptPassword(plainText) {
  return bcrypt.hashSync(plainText, bcrypt.genSaltSync(10));
}

function isValidPassword(plainText, cryptPassword) {
  return bcrypt.compareSync(plainText, cryptPassword);
}

con.connect(function (err) {
  if (err) throw err;
  console.log("Database connected successfully!");
});

// var user = {person_name: 'Punith', age: 29, sex: 'Male'};

// con.query('INSERT INTO Person.user SET ?', user, (err, res) => {
//   if (err) throw err;

//   console.log('1 Row inserted: ' + res.insertId);
// });

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/pass', function (req, res) {
  con.query('INSERT INTO user_login SET user_name=?, user_id=?, password=?', [user_name, 1, convertPlainTextToCryptPassword('kpunith8')], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});

app.get('/users', function (req, res) {
  con.query('SELECT DISTINCT u.person_name, u.age, u.sex, u.id FROM user u ORDER BY u.person_name DESC', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/users/:id', function (req, res) {
  con.query('SELECT DISTINCT u.person_name, u.age, u.sex, u.id FROM user u WHERE u.id = ?', [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.post('/users', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var age = req.body.age;
  var sex = req.body.sex;

  con.query('UPDATE user SET person_name=?, age=?, sex=? WHERE id=?', [name, age, sex, id], (err, result) => {
    if (err) throw err;
    console.log(`Changed ${result.changedRows} row(s)`);
  });
});

app.post('/userLogin', function (req, res) {
  var user_name = req.body.userName;
  var password = req.body.password;
  con.query('SELECT ul.password FROM user_login ul WHERE ul.user_name=?', [user_name], (err, result) => {
    if (err) throw err;
    res.json(isValidPassword(password, result[0].password));
    console.log('is Valid user: ', isValidPassword(password, result[0].password));
  });
});


app.listen(port, function () {
  console.log('Running on PORT: ' + port);
});