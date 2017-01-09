var register = function (msg, callback) {
	callback(msg);
};

var vote = function (msg, callback) {
	console.log('Get color');
	console.log('Get user hash');
	console.log('Save vote');

	callback({red: 11, blue: 17});
};

var reset = function (callback) {
	console.log('Reset values');
	callback({red: 0, blue: 0});
};

var win = function (callback) {
	console.log('Reality wins');
	callback({red: 100, blue: 0});
};

var stop = function (callback) {
	console.log('Stop votes');
};

var votes = function (callback) {
	console.log('Get current values');
	callback({red: 10, blue: 17});
};

module.exports = {
    register: register,
    votes: votes,
    vote: vote,
    reset: reset,
    win:win,
    stop: stop
};