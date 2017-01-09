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

    socket.on('channel_name', function(msg) {
        events.event_name(msg, function(error, data) {
            io.emit('channel_name', data2);
        });
    });

});
