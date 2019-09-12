
## share
```
  
  demo结构还在优化中，nginx监听doso.jeeas.cn的80端口，转发到内部3030端口；
  nginx未配置负载均衡，已拦截ip访问；


  npm run server
  建议使用启动方式

  npm run start or npm start
  koa框架启动方式，建议自行配置

  预览地址 http://doso.jeeas.cn

  遇到的坑：

	koa:使用 nginx+node+koa+mysql+ejs 简单尝试，透传获取真实ip；

  	log4js:日志级别无法拆分(原因未知)，未启用线程，都会打在info日志里；

  	koa-static:配置的静态资源无法访问(原因未知)，使用koa-static-router代替；

  	koa-bodyparser:读取post数据中间件=>ctx.request.body；

  	http-proxy-middleware:在入口处可配置转发请求；

  	koa-views:使用模板引擎(ejs)；

  	koa-router:配置路由，考虑动态方式，demo需要改进；






``` 