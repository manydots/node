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

const apiStartTime = new Date();

// 首页路由
let router = new Router();
router.get('/', async ctx => {
    let title = 'Socket.IO chat';
    await ctx.render('wechat', {
        title,
        isConsole,
        delay
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

// socket连接
io.on('connection', (socket) => {
    const ms = new Date() - apiStartTime;
    

    
    socket.on('chat-message', (msg) => {
        let logs = `api:[/chat-message],响应时间[${ms}ms],send:[${msg}]`;
        log.info(logs);
        console.log('message: ' + msg);
        io.emit('chat-message', msg);
    });
    socket.on('disconnect', () => {
        let logs = `api:[/disconnect],响应时间[${ms}ms],send:[user disconnected]`;
        log.info(logs);
        console.log('user disconnected');
    });
});

// 监听端口
server.listen(port, () => {
    console.log(`listening on :${port}`);
});