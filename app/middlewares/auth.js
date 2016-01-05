
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var Message = require('../proxy').Message;
var config = require('../config');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var superagent = require('superagent');

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
    if (!req.session.user) {
      return res.render('notify/notify', {error: '你还没有登录。'});
    }
    if (!req.session.user.is_admin) {
      return res.render('notify/notify', {error: '需要管理员权限。'});
    }
  next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
  if(!config.debug) {
    if (!req.session || !req.session.user) {
      return res.status(403).send('forbidden!');
    } 
    if (!req.session.user.name || req.session.user.name === '') {
      return res.redirect('/redirect');
    }
  }
  next();
};

exports.blockUser = function () {
  return function (req, res, next) {
    if (req.path === '/signout') {
      return next();
    }
    if (req.session.user && req.session.user.is_block && req.method !== 'GET') {
      return res.status(403).send('您已被管理员屏蔽了。有疑问请联系 @alsotang。');
    }
    next();
  };
};


function gen_session(user, res) {
  var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  res.cookie(config.auth_cookie_name, auth_token,
    {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true}); //cookie 有效期30天
}
exports.gen_session = gen_session;

// 微信auth
exports.authWeixin = function (req, res, next) {
  var ep = new eventproxy();
  ep.fail(next);
  var authorizeUrl = config.weixin.authorizeUrl;
  var appid = config.weixin.appid;
  var secret = config.weixin.secret;
  var redirectUri = config.weixin.redirectUri;
  var redirectBaseUrl = authorizeUrl + '?appid=' + appid + '&redirect_uri=' + encodeURIComponent('http://m.zuimeng.org' + req.originalUrl) + '&response_type=code&scope=snsapi_base&state=0#wechat_redirect';
  var redirectInfoUrl = authorizeUrl + '?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
  
  ep.all('get_weixin', function (user) {
    if (!user) {
      return res.redirect(redirectInfoUrl);
    }
    req.session.user = new UserModel(user);
    next();
  });

  if (req.session.user) {
    ep.emit('get_weixin', req.session.user);
  } else {
    var state = req.query.state;
    if (state === '0') {
      var code = req.query.code;
      if (code) {
        console.log('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code');
        superagent
        .get('https://api.weixin.qq.com/sns/oauth2/access_token')
        .query({appid: appid, secret: secret, code: code, grant_type: 'authorization_code'})
        .set('Content-Type', 'application/json')
        .end(function(err, authRes){
          if(err){
            return console.log(err);
          }
          auth = JSON.parse(authRes.text);
          console.log(auth);
          var User = UserProxy.getUserByWeixinOpenId(auth.openid, ep.done('get_weixin'));
        });
      }
    } else if (state === '1') {
      var code = req.query.code;
      if (code) {
        console.log(code);
        superagent
          .get('https://api.weixin.qq.com/sns/oauth2/access_token')
          .query({appid: appid, secret: secret, code: code, grant_type: 'authorization_code'})
          .end(function(err, authRes){
              if(err){
                return console.log(err);
              }
              auth = JSON.parse(authRes.text);
              superagent
              .get('https://api.weixin.qq.com/sns/userinfo')
              .query({access_token: auth.access_token, openid: auth.openid, lang: 'zh_CN'})
              .end(function(err, infoRes){
                if(err){
                  return console.log(err);
                }
                auth = JSON.parse(infoRes.text);
                console.log(auth);
                UserProxy.newAndSaveWeixin(auth, ep.done('get_weixin'));
                // var User = UserProxy.getUserByWeixinOpenId(openid, ep.done('get_weixin'));
              });
          });
      }
    } else {
      return res.redirect(redirectBaseUrl);
    }
  }
};


// 验证用户是否登录
exports.authUser = function (req, res, next) {
  var ep = new eventproxy();
  ep.fail(next);

  if (config.debug && req.cookies['mock_user']) {
    var mockUser = JSON.parse(req.cookies['mock_user']);
    req.session.user = new UserModel(mockUser);
    if (mockUser.is_admin) {
      req.session.user.is_admin = true;
    }
    return next();
  }

  ep.all('get_user', function (user) {
    if (!user) {
      return next();
    }
    user = res.locals.current_user = req.session.user = new UserModel(user);

    if (config.admins.hasOwnProperty(user.loginname)) {
      user.is_admin = true;
    }
    Message.getMessagesCount(user._id, ep.done(function (count) {
      user.messages_count = count;
      next();
    }));

  });

  if (req.session.user) {
    ep.emit('get_user', req.session.user);
  } else {
    var auth_token = req.signedCookies[config.auth_cookie_name];
    if (!auth_token) {
      return next();
    }

    var auth = auth_token.split('$$$$');
    var user_id = auth[0];
    UserProxy.getUserById(user_id, ep.done('get_user'));
  }
};
