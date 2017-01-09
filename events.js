var memcached = require('./drivers/memcached.js');

var vote = function (data, callback) {
	memcached.get('votes', function (err, votes) {
		if(err) throw new err;

		if (votes) {
			votes[data.color]++;

			memcached.set('votes', votes, 11110, function (err) {
				if(err) throw new err;
			});

			callback(votes);
		}
	});
};


var votes = function (callback) {
	memcached.get('votes', function (err, votes) {
		if(err) throw new err;

		if (votes) {
			callback(votes);
		}
	});
};

var reset = function (callback) {
	var votes = {red : 0 , blue : 0};

	memcached.set('votes', votes, 0, function (err) {
		if(err) throw new err;
	});

	callback(votes);
};

var win = function (callback) {
	console.log('Reality wins');
	callback({red: 100, blue: 0});
};

var stop = function (callback) {
	console.log('Stop votes');
};

module.exports = {
    votes: votes,
    vote: vote,
    reset: reset,
    win:win,
    stop: stop
};