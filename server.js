var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    events = require('./events.js'),
    memcached = require('./drivers/memcached.js'),
    port = process.env.PORT || 8099;

app.use(express.static(path.join(__dirname, '/public')));
app.use('/scripts', express.static(__dirname + '/node_modules'));

//Frontend routes
app.get('/adm', function(req, res) {
    res.sendFile(__dirname + '/templates/admin.html');
});

app.get('/stat', function(req, res) {
    res.sendFile(__dirname + '/templates/stat.html');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

//Backend routes
app.post('/register', function (req, res) {
    res.send(JSON.stringify({ user_hash : Math.random().toString(36).substring(7) }));
});

//Server
http.listen(port, function() {
    console.log('server started on localhost:'+port)

    var votes = { red : 0, blue : 0 };

    memcached.set('votes', votes, 11110, function (err) {
        if (err) throw new err;
    });
});

io.on('connection', function(socket) {
    events.votes(function(data) {
        io.emit('votes', data);
    });

    socket.on('vote', function(data) {
        events.vote(data, function(data) {
            io.emit('votes', data);
        });
    });

    socket.on('reset', function(msg) {
        events.reset(function(data) {
            io.emit('votes', data);
        });
    });

    socket.on('stop', function(msg) {
        events.stop(function(data) {
            // io.emit('votes', data);
        });
    });

    socket.on('win', function(msg) {
        events.win(function(data) {
            io.emit('votes', data);
        });
    });

});