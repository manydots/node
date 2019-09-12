//const db = require('./utils/mysql')
const Koa = require('koa');
const path = require('path');
const proxy = require('http-proxy-middleware');
const log = require('./utils/log');
const views = require('koa-views');
const bodyparser = require('koa-bodyparser');
const router = require('./routes/test');
const static = require('koa-static');
const statics = require('koa-static-router');
//const fs = require('fs');
const app = new Koa();
const port = 3030;
const url = `http://127.0.0.1:${port}`; //后端服务器地址

app.proxy = true;
app.use(async (ctx, next) => {
    //以api开头的异步请求接口都会被转发
    const apiStartTime = new Date();
    ctx.util = {
        log: log,
        apiStartTime: apiStartTime
    }

    if (ctx.url.startsWith('/api')) {
        ctx.respond = false; // 绕过koa内置对象response ，写入原始res对象，而不是koa处理过的response
        return proxy({
            target: url, // 服务器地址
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/api': '/webapp/api'
            }
            /*
                上面这个pathRewrite字段不是必须的，
                你的开发环境和生产环境接口路径不一致的话，才需要加这个。
            */
        })(ctx.req, ctx.res, next)
    } else if (ctx.url.startsWith('/public')) {
        //console.log('public')
    } else {
        const ms = new Date() - apiStartTime;
        let logs = `method:[${ctx.method}],api:[${ctx.url}],响应时间[${ms}ms]`;
        console.log(`时间:[${new Date()}],${logs}`);
        log.info(logs);
    }
    //console.log(log)
    return next();
});


// 指定静态资源文件夹,不起作用与路由冲突
//app.use(static(path.join(__dirname, './public')))

app.use(statics([{
    dir: 'public', //静态资源目录对于相对入口文件index.js的路径
    router: '/public/' //路由
}]))

//读取post数据中间件=>ctx.request.body
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))

// 加载模板引擎,文件会自动拼接此后缀
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());


//error
app.on('error', (err, ctx) => {
    ctx.body = {
        code: -1,
        msg: '错误'
    };
    log.error(`时间:[${new Date().toLocaleDateString()}],${err}`);
});

// 监听
app.listen(port, () => {
    console.log(`Listening ${port}...`)
});