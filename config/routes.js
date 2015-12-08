var Index = require('../app/controllers/index'); // 主页
var User = require('../app/controllers/user'); // 用户页
var Activity = require('../app/controllers/activity'); // 活动页
var Mass = require('../app/controllers/mass'); // 社团

// var Comment = require('../app/controllers/comment'); // 评论列表
// var Tag = require('../app/controllers/tag'); // 活动标签

module.exports = function (app) {
    // pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;
        next();
    });

    // 主页
    app.get('/', Index.index);

    // // 注册
    // app.post('/user/signup', User.signup);
    // // 登入
    // app.post('/user/signin', User.signin);
    // // 登陆页
    // app.get('/signin', User.showSignin);
    // // 注册页
    // app.get('/signup', User.showSignup);
    // // 登出
    // app.get('/logout', User.logout);
    // // 管理用户列表
    // // app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

    // // Activity
    // // 具体一个活动的信息页
    // app.get('/activity/:id', Activity.detail);
    // // 创建一个新的活动
    // app.get('/admin/activity/new', User.signinRequired, User.adminRequired, Activity.new);
    // // 修改活动信息 修改页
    // app.get('/admin/activity/update/:id', User.signinRequired, User.adminRequired, Activity.update);
    // // 更新
    // app.post('/admin/activity', User.signinRequired, User.adminRequired, Activity.savePoster, Activity.save);
    // // 活动列表页
    // app.get('/admin/activity/list', User.signinRequired, User.adminRequired, Activity.list);
    // // 删除活动
    // app.delete('/admin/activity/list', User.signinRequired, User.adminRequired, Activity.del);

    // // 保存Comment
    // app.post('/user/comment', User.signinRequired, Comment.save);

    // // Tag
    // app.get('/admin/tag/new', User.signinRequired, User.adminRequired, Tag.new)
    // app.post('/admin/tag', User.signinRequired, User.adminRequired, Tag.save)
    // app.get('/admin/tag/list', User.signinRequired, User.adminRequired, Tag.list)

    // results
    // app.get('/results', Index.search)
};
