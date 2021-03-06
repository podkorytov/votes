var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    events = require('./events.js'),
    memcached = require('./drivers/memcached.js'),
    shortid = require('shortid'),
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
    res.send(JSON.stringify({ user_hash : shortid.generate() }));
});

app.get('/votes', function (req, res) {
    memcached.get('votes', function (err, data) {
        if (data) {
            res.send(JSON.stringify(data));
        }
    });
});


//Server
http.listen(port, function() {
    console.log('server started on localhost:'+port);

    var votes = { red : 0, blue : 0 };

    memcached.set('votes', votes, 0, function (err) {
        if (err) throw new err;
    });
    memcached.set('vote_status', true, 0, function (err) {
        if (err) throw new err;
    });
});

io.on('connection', function(socket) {
    events.votes(function(data) {
        io.emit('votes', data);
    });

    events.isActive(function(data) {
        io.emit('isActive', data);
    });

    socket.on('vote', function(data) {
        events.vote(data, function(data) {
            io.emit('votes', data);
        });
    });

    socket.on('reset', function(msg) {
        events.reset();

        io.emit('isActive', true);

        events.votes(function(data) {
            io.emit('votes', data);
        });
    });

    socket.on('stop', function() {
        events.stop();

        io.emit('isActive', false);

        events.votes(function(data) {
            io.emit('votes', data);
        });
    });

    socket.on('win', function() {
        events.win(function(data) {
            events.stop();

            io.emit('isActive', false);
            io.emit('win', data);
        });
    });
});