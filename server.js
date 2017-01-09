var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    events = require('./events.js'),
    port = process.env.PORT || 8099;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/adm', function(req, res) {
    res.sendFile(__dirname + '/templates/admin.html');
});

app.get('/stat', function(req, res) {
    res.sendFile(__dirname + '/templates/stat.html');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

http.listen(port, function() {

});

io.on('connection', function(socket) {
    events.votes(function(data) {
        io.emit('votes', data);
    });

    socket.on('register', function(msg) {
        events.register(msg, function(data) {
            io.emit('register', data);
        });
    });

    socket.on('vote', function(msg) {
        events.vote(msg, function(data) {
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