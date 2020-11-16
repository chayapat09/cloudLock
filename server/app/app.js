var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var io = require('socket.io')();
var mqtt = require('mqtt');


// --------------------- SOCKET.IO -------------------------
var clientNum = 0;

io.on('connection' , (socket) => {
  clientNum++;
  io.emit('CMD::activeConnection',clientNum);
  flushCardsToClient();

  socket.on('allowKey' , (key) => {
    handleAllowKey(key);
    flushCardsToClient();
  })

  socket.on('disallowKey' , (key) => {
    handleDisAllowKey(key);
    flushCardsToClient();
  })
});

// ********************************************************

// ------------------------ MQTT --------------------------
//myMQTT = mqtt('tcp://161.200.199.2','Username','Cratchat','Password','0123456789','ClientID','Mbp');
var client = mqtt.connect('mqtt://161.200.199.2',{
  //clientId : 'Mbp',
  username : 'Cratchat',
  password : '0123456789',
});

client.on('connect',() => {
  console.log('mqtt connected!');
  client.subscribe('cloudLock/0/server');
  client.subscribe('cloudLock/0/listKey');
  client.subscribe('cloudLock/0/allowKey');
  client.subscribe('cloudLock/0/disAllowKey');

});

client.on('message' , (topic , message) => {
  message = message.toString();
  console.log(topic);
  if (topic === 'cloudLock/0/server') {
    handleCardKey(message);
  }
  if (topic === 'cloudLock/0/listKey') {
    handleListKey(message);
  }

  if (topic === 'cloudLock/0/allowKey') {
    handleAllowKey(message);
  }

  if (topic === 'cloudLock/0/disAllowKey') {
    handleDisAllowKey(message);
  }
  
});


//const cards = [ {_id : '94ifrirept' , allow : false , name : 'dkfmdlfg'} ];
const cards = new Map();
//cards.set('94ifrirept' ,{_id : '94ifrirept' , allow : false , name : 'dkfmdlfg'} );

const cleanKey = _key => {
  const _keyL = _key.trim().split(' ');
  if (_keyL.length !== 12) return null;
  const key = _keyL.join(' ');
  return key;
  
}

const handleCardKey = _key => {
  const key = cleanKey(_key);
  if (key === null) return;

  if (!cards.has(key)) {
    cards.set(key , {
      _id : key,
      name : 'Not set',
      allow : false,
    });
    flushLogToClient(`Card ${key} was Added to Cloudlock!`)
    flushCardsToClient();
    return;
  }

  const cardData = cards.get(key);

  if (cardData.allow) {
    client.publish('cloudLock/0/prototype' , 'UNLOCK');
    flushLogToClient(`Card ${key} detected and Allow to Cloudlock!`)
  }
  else {
    flushLogToClient(`Card ${key} detected and refuse to Cloudlock!`)
  }

  console.log(cards);

}

const handleListKey = (_key) => {

  const output = []; // id , allowed

  cards.forEach((value , key) => {
    output.push(`key : ${key} ; ${value.allow ? 'allow' : 'now allowed'}`);
  });
  console.log(output.join('\n'));
  client.publish('cloudLock/0/listKey/listen',output.join('\n'));
}

const handleAllowKey = (_key) => {
  const key = cleanKey(_key);
  if (key === null) return;

  if (!cards.has(key)) {
    return;
  }

  cards.set(key , {...cards.get(key) , allow : true});
}


const handleDisAllowKey = (_key) => {
  const key = cleanKey(_key);
  if (key === null) return;

  if (!cards.has(key)) {
    return;
  }

  cards.set(key , {...cards.get(key) , allow : false});
}

const flushCardsToClient = () => {
  const toClient = [];
  cards.forEach( (value , key) => {
    toClient.push(value);
  })
  io.emit('cardList' , toClient);
}

const flushLogToClient = (message) => {
  io.emit('log' , message);
}



// ********************************************************

function handleError(error) {
  console.log(error.message);
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/socket',(req , res) => {
  res.sendFile(__dirname + '/index.html')
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app,io};
