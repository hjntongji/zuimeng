/**
 * config
 */

var path = require('path');

var config = {
  name: '最盟', // 俱乐部的名字
  description: '最盟: 上海高校运动联盟，以跑步为核心的跨校运动交流、分享平台，跑步信息发布、报名、志愿者招募，合作体育品牌和主办方的各种福利，结识上海十几所高校的跑者和NTCgirls，与全校已注册师生和校友一起互动、PK你的跑马成绩。最盟，不只运动，遇见感动！', // 俱乐部的的描述
  keywords: '最盟,最猛,最萌,高校,拉风,跑步,运动,同济,交大,上海',

  // 添加到 html head 中的信息
  siteHeaders: [
    '<meta name="author" content="johning" />',
    '<meta name="company" content="baidu" />',
    '<meta name="email" content="hjny11@163.com" />'
  ],

  // site_logo: '/public/images/myclub_light2.png', // default is `name`
  // site_icon: '/public/images/cnode_icon_32.png', // 默认没有 favicon, 这里填写网址
  // cdn host，如 http://cnodejs.qiniudn.com
  // site_static_host: '', // 静态文件存储域名
  
  siteHost: 'sh.zuimeng.org',

  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  // google_tracker_id: '',
  // 默认的cnzz tracker ID，自有站点请修改
  // cnzz_tracker_id: '',

  // mongodb 配置
  db: 'mongodb://localhost/zuimeng',
  dbName: 'node_club_dev',


  // redis 配置，默认是本地
  // redisHost: '127.0.0.1',
  // redisPort: 6379,

  sessionSecret: '12345zuimeng54321', // 务必修改
  authCookieName: 'zuimeng.org',

  // 程序运行的端口
  port: 3000,

  // 微信的相关配置
  weixin: {
    appid: 'wx35ee7d6d83988da7',
    token: 'zuimengorg',
    // secret: 'd74b37620ecaa50b8bc7d399c2eebe0f',
    encodingAESKey: 'C76kn6WswIvaf173aEKBKHVXCrxd61hxnjhPd6bzhqH'
  },

  // // RSS配置
  // rss: {
  //   title: 'CNode：Node.js专业中文俱乐部的',
  //   link: 'http://cnodejs.org',
  //   language: 'zh-cn',
  //   description: 'CNode：Node.js专业中文俱乐部的',
  //   // 最多获取的RSS Item数量
  //   max_rss_items: 50
  // },

  // weibo app key
  // weibo_key: 10000000,
  // weibo_id: 'your_weibo_id',

  

  // github 登陆的配置
  // GITHUB_OAUTH: {
  //   clientID: 'your GITHUB_CLIENT_ID',
  //   clientSecret: 'your GITHUB_CLIENT_SECRET',
  //   callbackURL: 'http://cnodejs.org/auth/github/callback'
  // },


  // 下面两个配置都是文件上传的配置
  // 7牛的access信息，用于文件上传
  qn_access: {
    accessKey: 'qmD79qq2RUVO1-cfnOR5o8Y7v5UuEpre1pZwe5ah',
    secretKey: 'kR4NtM0QsCxZCAjk5e2_jwSJ328OMsmev1X8wdny',
    bucket: 'zuimeng',
    domain: 'http://7xpi0m.com1.z0.glb.clouddn.com'
  },
  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  // newrelic 是个用来监控网站性能的服务
  // newrelic_key: 'yourkey',

  // // 极光推送
  // jpush: {
  //   appKey: 'YourAccessKeyyyyyyyyyyyy',
  //   masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
  //   isDebug: false,
  // },


  // 是否允许直接注册（否则只能走 github 的方式）
  // allow_sign_up: true,
  // 
  // // admin 可删除话题，编辑标签，设某人为达人
  // admins: { user_login_name: true },

  // create_post_per_day: 1000, // 每个用户一天可以发的主题数
  // create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  // visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

module.exports = config;