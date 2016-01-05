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
    if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
        res.reply('hehe');
    } else if (message.FromUserName === 'text') {
        //你也可以这样回复text类型的信息
        res.reply({
          content: 'text object',
          type: 'text'
        });
    } else if (message.FromUserName === 'hehe') {
        // 回复一段音乐
        res.reply({
          type: "music",
          content: {
            title: "来段音乐吧",
            description: "一无所有",
            musicUrl: "http://mp3.com/xx.mp3",
            hqMusicUrl: "http://mp3.com/xx.mp3",
            thumbMediaId: "thisThumbMediaId"
          }
        });
    } else {
        // 回复高富帅(图文回复)
        res.reply([
          {
            title: '欢迎关注最盟',
            description: '最盟: 上海高校运动联盟，以跑步为核心的跨校运动交流、分享平台',
            picurl: 'http://sh.zuimeng.org/build/img/mass.jpeg',
            url: 'http://sh.zuimeng.org/mass'
          }
        ]);
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
