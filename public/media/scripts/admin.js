$(function() {
    var socket = io();

    socket.emit('register', 'User123');

    $('#reset').on('click', function() {
        socket.emit('reset', 'reset');
    });

    $('#stop').on('click', function() {
        socket.emit('stop', 'stop');
    });

    $('#win').on('click', function() {
        socket.emit('win', 'win');
    });
});