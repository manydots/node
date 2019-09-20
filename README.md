
<div align="center">

[![](https://flat.badgen.net/npm/v/dosn?icon=npm)](https://www.npmjs.com/package/dosn) [![NPM downloads](http://img.shields.io/npm/dm/dosn.svg?style=flat-square)](https://www.npmjs.com/package/dosn)

</div>
<pre>
  demo为node项目，建议clone到本地view
</pre>

## share
```
  
  demo结构还在优化中，nginx监听doso.jeeas.cn的80端口，转发到内部3030端口；
  nginx未配置负载均衡，已拦截ip访问；

  npm run chat:http
  简单聊天室启动方式[running]

  npm run server
  建议使用启动方式(debounce防抖函数500ms测试)

  npm run wechat
  简单聊天室启动方式(debounce防抖函数400ms测试)

  npm run start or npm start
  koa框架启动方式，建议自行配置


  预览地址 https://doso.jeeas.cn

  node环境:
    1、yum安装node会安装一个老版本;
    2、建议使用 n 管理node版本(npm install -g n);
        n 常用的命令有：
        n 会列出所有安装的版本供你切换
        n latest 安装最新版本
        n stable 安装最新稳定版
        n lts 安装最新长期支持版本
        n rm [版本号] 删除某一版本
        n -h 帮助命令
        n [版本号] 安装指定版本node

        Tips:
          若n切换的版本未生效还需要手动配置一下;
          a.查看系统node的安装路径: which node
          b.通过N_PREFIX变量来修改 n 的默认node安装路径
            .编辑环境配置文件: vim ~/.bash_profile 
            .添加配置语句:
             export N_PREFIX=/usr/local/node  (#node实际安装位置)
             export PATH=$N_PREFIX/bin:$PATH
          c.执行source使修改生效: source ~/.bash_profile
          d.检查是否生效: echo $N_PREFIX
          (亲测可用,转自:https://www.jianshu.com/p/d934d3ba67ec)

    3、node项目可以使用pm2管理
    4、在linux上使用screen挂起任务


  遇到的坑：

	  koa:使用 nginx+node+koa+mysql+ejs 简单尝试，透传获取真实ip；

  	log4js:日志级别无法拆分(原因未知)，未启用线程，都会打在info日志里；

  	koa-static:配置的静态资源无法访问(原因:配置问题)，可使用koa-static-router代替；

  	koa-bodyparser:读取post数据中间件=>ctx.request.body；

  	http-proxy-middleware:在入口处可配置转发请求；

  	koa-views:使用模板引擎(ejs)；

  	koa-router:配置路由，考虑动态方式，demo需要改进；


    linux上 export port=3030 && node --trace-deprecation chat.js
    windows上 set port=3030 && node --trace-deprecation chat.js





```

### 关于https
```javascript
  
  通过https访问才可以调用桌面通知Notification.requestPermission推送消息

  阿里云免费SSL: https://common-buy.aliyun.com/?commodityCode=cas&aly_as=zI60LOb8#/buy
  配置可以访问

```

### nginx下配置socket.io
```javascript
    
    //解决ws连接问题 参考:https://www.cnblogs.com/qkstart/p/11246173.html

    #80端口转443访问
    upstream nodes {
       ip_hash;
       server localhost:3030;
    }
    server {
       listen       80;
       server_name  doso.jeeas.cn;
       rewrite ^(.*)$  https://$http_host$1 permanent;
    }
    server {
        #listen 80;
        listen 443 ssl;
        server_name  doso.jeeas.cn;
        access_log  logs/doso443.log;
        #ssl on;   #设置为on启用SSL功能。
        ssl_certificate cert/doso.jeeas.cn.pem;
        ssl_certificate_key cert/doso.jeeas.cn.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   #使用该协议进行配置。
        ssl_prefer_server_ciphers on;
        location / {
              proxy_pass http://nodes; #反向代理集群
              proxy_buffering off;    #此参数非常重要，必须禁用代理缓存.
              proxy_set_header Host $host:$server_port;
              proxy_set_header        X-Real-IP $remote_addr;
              proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection "Upgrade";

        }
    }


```