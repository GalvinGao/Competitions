let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mysqlConn = require('mysql');
let uuidv4 = require('uuid/v4');
let crypto = require('crypto');
let session = require('express-session');
let cors = require('cors');
let history = require('connect-history-api-fallback');
let JsonDB = require('node-json-db');
var db = new JsonDB("myDataBase", true, false);

const config = {
  token: { //                   Admin | Diary | Weekly
    "admin": 'admin', //   + + +
    "demo": 'demo', // - - +
    "anonymous": "anonymous"
  }
}

function hash(algorithm, text) {
  //return 'foobar'
  return crypto.createHash(algorithm).update(text).digest('hex')
}

let app = express();

function insertSql(title, date, content, hash) {
  //
}

let requestId = function requestId(req, res, next) {
  req.requestId = uuidv4();
  req.requestTime = new Date().getTime()
  next();
};

let authenticate = function (req, res, next) {
  console.log(JSON.stringify(req.session))
  // if (req.session.login === true && req.session.role.length > 0) return next();
  try {
    switch (config.token[req.query.token]) {
      case "admin":
      case "demo":
      case "anonymous":
        req.session.login = true;
        req.session.role = config.token[req.query.token];
        console.log(`${req.requestId} has been auth as ${config.token[req.query.token]}.`);
        next();
        break;
      default:
        if (req.url === '/auth') return res.status(403).end('Authentication Required.');
        res.redirect("/auth");
        res.end();
        break;
    }
  } catch (e) {
    console.log(e)
    if (req.url === '/auth') return res.status(403).end('Authentication Required.');
    res.redirect("/auth");
    res.end()
  }
};

let sess = {
  secret: '5sgr93cbthd0oqj5c8qt8lroox52qlc8',
  cookie: {}
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(cors());
app.use(session(sess));
app.use(requestId);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.end('dairy-project Endpoint v1.')
});

app.get('/auth', authenticate, (req, res) => {
  res.json(formatOutput(req, {login: req.session.login, role: req.session.role}))
});

app.get('/logout', (req, res) => {
  req.session.login = false;
  req.session.role = null;
  res.json(formatOutput(req, {success: true}))
})

app.get('/list', authenticate, (req, res) => {
  res.json(formatOutput(req, db.getData("/")))
});

app.get('/detail/diary/:hash', authenticate, (req, res) => {
  try {
    res.json(formatOutput(req, db.getData(`/diary/${req.params.hash}`)))
  } catch (_) {
    res.status(404).end('404 Not Found')
  }
});

app.get('/detail/weekly/:hash', authenticate, (req, res) => {
  if (req.session.role !== "anonymous") {
    try {
      res.json(formatOutput(req, db.getData(`/weekly/${req.params.hash}`)))
    } catch (_) {
      res.status(404).end('404 Not Found')
    }
  }
});

app.post('/add', authenticate, (req, res) => {
  if (req.session.role === "admin") {
    let type = req.body.type;
    let title = req.body.title;
    let date = req.body.date;
    let content = req.body.content;
    let messageHash = hash('md5', content);
    let json = {type, title, date, content, hash: messageHash};
    switch (type) {
      case "dairy": {
        db.push(`/diary/${messageHash}`, json);
        res.json(formatOutput(req, { success: true}));
        break;
      }
      case "weekly": {
        db.push(`/weekly/${messageHash}`, json);
        res.json(formatOutput(req, { success: true}));
        break;
      }
      default: {
        res.status(400).end('400 Bad Request - ')
      }
    }
  } else {
    res.status(401).end('Unauthorized request.')
  }
})

function formatOutput(req, data) {
  var data = JSON.stringify(data)
  let timestamp = new Date().getTime();
  return {
    requestVerification: {
      url: {
        md5: hash('md5', req.url),
        sha256: hash('sha256', req.url)
      },
      requestTimestamp: req.requestTime
    },
    requestId: req.requestId,
    timestamp: timestamp,
    hash: {
      md5: hash('md5', data),
      sha256: hash('sha256', data)
    },
    data: data
  }
}

app.listen(3100, () => {
  console.log('Server started at http://localhost:3100')
});