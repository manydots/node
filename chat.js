var Koa = require('koa');
var app = new Koa();
var port = process.env.port || 3030;
var server = require('http').createServer(app.callback());
const Router = require('koa-router');
const path = require('path');
const views = require('koa-views');
const io = require('socket.io')(server);
//const statics = require('koa-static-router');
const static = require('koa-static');
var serverName = process.env.NAME || 'Unknown';
var usersOnline = 0;

// app.use(statics([{
// 	dir: 'public', //静态资源目录对于相对入口文件index.js的路径
// 	router: '/public/' //路由
// }]))

app.use(static(__dirname, './public'));

// 加载模板引擎,文件会自动拼接此后缀
app.use(views(path.join(__dirname, './views'), {
	extension: 'ejs'
}))

// 首页路由
let router = new Router();
router.get('/', async ctx => {
	let title = 'Socket.IO chat';
	await ctx.render('chat', {
		title
	});
});
app.use(router.routes());

io.on('connection', function(socket) {
	var addedUser = false;
	socket.on('new message', function(data) {
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
	});

	socket.on('add user', function(username) {
		if (addedUser) return;
		socket.username = username;
		usersOnline++;
		addedUser = true;
		socket.emit('login', {
			numUsers: usersOnline
		});
		socket.broadcast.emit('user joined', {
			username: socket.username,
			numUsers: usersOnline
		});
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
		}
	});
});

// 监听端口
server.listen(port, () => {
	console.log('Server listening at port %d', port);
	console.log('Hello, I\'m %s, how can I help?', serverName);
});