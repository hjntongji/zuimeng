var config = require('./config/config');


var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var wechat = require('wechat');
var crypto = require('crypto');

var port = process.env.PORT || config.port || 3000;

var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
mongoose.connect(config.db);

var app = express();

// models loading
var models_path = __dirname + '/app/models';
var walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);

        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

app.set('views', './app/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: config.sessionSecret,
    store: new mongoStore({
        url: config.db,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'dist')));


app.use('/weixin', wechat(config.weixin, function (req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    console.log(message);
    if (message.EventKey === 'SHARE_STORY') {
        res.reply('不只运动，遇见感动！\n分享你一路奔跑的故事，\n分享一次特别的经历，\n分享你的恣意青春，\n我们，在等待非同凡响的你！\n图文稿件一经采纳，将会通过原创保护功能推送给所有人！\n投稿请联络：kingcross@me.com，不胜感激！');
    } else {
        if (message.Content === '成绩查询') {
            res.reply(
              {
                type: 'text',
                content: '<a href="http:\/\/zuicool.com\/results">成绩查询</a>'
              }
            );
        } else if (message.Content === '奔跑') {
            // 回复一段音乐
            res.reply({
              type: "music",
              content: {
                title: "来段音乐吧",
                description: "奔跑",
                musicUrl: "http://96.f.1ting.com/568bd180/550c69d275390dcc4f5e7da37b94f35c/zzzzzmp3/2012aJan/16F/16zjtvknwh/02.mp3",
              }
            });
        } else {
            res.reply({
                type: 'transfer_customer_service'
            });
        }
    } 
}));

require('./config/routes')(app);
if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
}

app.listen(port);
app.locals.moment = require('moment');

console.log('zuimeng started on port ' + port);
