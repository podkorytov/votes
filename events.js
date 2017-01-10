var memcached = require('./drivers/memcached.js');
var defaultTTL = 0;

var vote = function (data, callback) {
	memcached.get('user_votes', function (err, userVotesData) {
		if(err) throw new err;

		memcached.get('votes', function (err, votes) {
			if(err) throw new err;

			if (votes) {
				if (userVotesData && userVotesData[data.user_hash]) {
					votes[userVotesData[data.user_hash]]--;
				}

				if (!userVotesData) {
					userVotesData = {};
				}

				userVotesData[data.user_hash] = data.color;

				votes[data.color]++;

				memcached.set('user_votes', userVotesData, defaultTTL, function (err) {
					if (err) throw new err;
				});

				memcached.set('votes', votes, defaultTTL, function (err) {
					if (err) throw new err;
				});

				callback(votes);
			};
		});

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

var reset = function () {
	var votes = {red : 0 , blue : 0};

	memcached.set('votes', votes, defaultTTL, function (err) {
		if(err) throw new err;
	});

	memcached.set('user_votes', {}, defaultTTL, function (err) {
		if(err) throw new err;
	});

	memcached.set('vote_status', true, defaultTTL, function (err) {
		if(err) throw new err;
	});
};

var win = function (callback) {
	console.log('Reality wins');
	callback({red: 100, blue: 0});
};

var stop = function () {
	memcached.set('vote_status', false, defaultTTL, function (err) {
		if(err) throw new err;
	});
};

var isActive = function (callback) {
	memcached.get('vote_status', function (err, isActive) {
		callback(isActive ? isActive : false);
	});
}

module.exports = {
    votes: votes,
    vote: vote,
    reset: reset,
    win:win,
    stop: stop,
	isActive : isActive
};