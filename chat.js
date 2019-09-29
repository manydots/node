var Koa = require('koa');
var app = new Koa();
var server = require('http').createServer(app.callback());
const bodyparser = require('koa-bodyparser')
const path = require('path');
const views = require('koa-views');
const io = require('socket.io')(server);
//const statics = require('koa-static-router');
const static = require('koa-static');
const router = require('./routes/chat');
const log = require('./utils/log');
var serverName = process.env.NAME || 'Unknown';
var port = process.env.port || 3030;
var usersOnline = 0;

// app.use(statics([{
// 	dir: 'public', //静态资源目录对于相对入口文件index.js的路径
// 	router: '/public/' //路由
// }]))

app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))

app.use(static(__dirname, './public'));

// 加载模板引擎,文件会自动拼接此后缀
app.use(views(path.join(__dirname, './views'), {
	extension: 'ejs'
}))


app.use(async (ctx, next) => {
	//以api开头的异步请求接口都会被转发
	const apiStartTime = new Date();
	ctx.util = {
		apiStartTime: apiStartTime
	}
	return next();
});

// 加载路由中间件
app.use(router.routes());


//app.use(router.routes()).use(router.allowedMethods())

io.on('connection', function(socket) {
	var addedUser = false;
	socket.on('new message', function(data) {
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});

		let logs = `用户[${socket.username}]说:${data}`;
		console.log(logs)
		log.info(logs);
	});
	socket.on('add user', function(username) {
		if (addedUser) return;
		socket.username = username;
		socket.token = socket.id;
		//console.log(socket.handshake.query)
		usersOnline++;
		addedUser = true;
		socket.emit('login', {
			numUsers: usersOnline
		});

		socket.broadcast.emit('user joined', {
			username: socket.username,
			numUsers: usersOnline
		});

		let logs = `[${socket.username}]进入了聊天室，当前在线[${usersOnline}]人`;
		console.log(logs)
		log.info(logs);
	});

	socket.on('typing', function() {
		socket.broadcast.emit('typing', {
			username: socket.username
		});
	});

	socket.on('stop typing', function() {
		socket.broadcast.emit('stop typing', {
			username: socket.username
		});
	});

	socket.on('disconnect', function() {
		if (addedUser) {
			usersOnline--;
			socket.broadcast.emit('user left', {
				username: socket.username,
				numUsers: usersOnline
			});
			let logs = `[${socket.username}]离开了聊天室，当前在线[${usersOnline}]人`;
			console.log(logs)
			log.info(logs);
		}
	});
});

// 监听端口
server.listen(port, () => {
	console.log('Server listening at port %d', port);
	console.log('Hello, I\'m %s, how can I help?', serverName);
});