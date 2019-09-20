var Koa = require('koa');
var app = new Koa();
const Router = require('koa-router');
const views = require('koa-views');
const log = require('./utils/log');
const path = require('path');
const statics = require('koa-static-router');

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const config = require('./utils/config.json');
let isConsole = config.isConsole;
const port = config.port;
const delay = config.delay;
var usocket = [];
const apiStartTime = new Date();

// 首页路由
let router = new Router();
router.get('/', async ctx => {
    let title = 'Socket.IO chat';
    await ctx.render('wechat', {
        title,
        isConsole,
        delay,
        port
    });
});


app.use(statics([{
    dir: 'public', //静态资源目录对于相对入口文件index.js的路径
    router: '/public/' //路由
}]))

// 加载模板引擎,文件会自动拼接此后缀
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

app.use(router.routes());

// 假设你将 Node 服务器部署后的地址为：https://www.example.com/ws
// 则： WS_HOST = 'https://www.example.com'
// const msgSocket = io(`${WS_HOST}`, {
//     secure: true,
//     path: '/ws/socket.io'
// });

// socket连接
let  count = 0;

io.on('connection', (socket) => {
    count++;
    // 打开新的连接显示的内容
    socket.emit('users', {number: count});
    // 显示数据到已经打开的连接上
    socket.broadcast.emit('users', {number: count});
    const ms = new Date() - apiStartTime;



    socket.on("join", function (name) {
        usocket[name] = socket;
        io.emit("join", name);
    })
    socket.on('chat-message', (msg) => {
        let logs = `api:[/chat-message],响应时间[${ms}ms],send:[${msg}]`;
        log.info(logs);
        console.log('message: ' + msg);
        io.emit('chat-message', msg);
    });
    socket.on('disconnect', (msg) => {
        let logs = `api:[/disconnect],响应时间[${ms}ms],send:[user disconnected]`;
        log.info(logs);
        count--;
        socket.broadcast.emit('users', {tips:'神秘人退出了聊天',number: count});
        console.log('user disconnected');

    });
    console.log(io.sockets)
});

// 监听端口
server.listen(port, () => {
    console.log(`listening on :${port}`);
});