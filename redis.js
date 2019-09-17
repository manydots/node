var redis = require('redis');
var sub = redis.createClient(6379,'127.0.0.1'),
	pub = redis.createClient(6379,'127.0.0.1');
var msg_count = 0;

sub.on("subscribe", function(channel, count) {
	pub.publish("a nice channel", "I am sending a message.");
	pub.publish("a nice channel", "I am sending a second message.");
	pub.publish("a nice channel", "I am sending my last message.");
});

sub.on("message", function(channel, message) {
	console.log("sub channel " + channel + ": " + message);
	msg_count += 1;
	if (msg_count === 3) {
		sub.unsubscribe();
		sub.quit();
		pub.quit();6379
	}
});

sub.subscribe("a nice channel");