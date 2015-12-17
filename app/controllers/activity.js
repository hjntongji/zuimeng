var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');
var Category = mongoose.model('Category');
// var Comment = mongoose.model('Comment')
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// detail page
exports.detail = function (req, res) {
    res.render('index/activity', {
        title: '最盟 活动详情页'
    });
    // var id = req.params.id;

    // Activity.update({
    //     _id: id
    // }, {
    //     $inc: {
    //         pv: 1
    //     }
    // }, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });

    // Activity.findById(id, function (err, movie) {
    //     Comment
    //         .find({
    //             movie: id
    //         })
    //         .populate('from', 'name')
    //         .populate('reply.from reply.to', 'name')
    //         .exec(function (err, comments) {
    //             res.render('detail', {
    //                 title: 'imooc 详情页',
    //                 movie: movie,
    //                 comments: comments
    //             });
    //         });
    // });
};

// 活动编辑页
exports.new = function (req, res) {
    Category.find({}, function (err, categories) {
        res.render('admin', {
            title: '最盟 活动编辑页',
            categories: categories,
            activity: {}
        });
    });
};

// 活动更新页
exports.update = function (req, res) {
    var id = req.params.id;

    if (id) {
        Activity.findById(id, function (err, activity) {
            Category.find({}, function (err, categories) {
                res.render('admin', {
                    title: '最盟 活动更新页',
                    activity: activity,
                    categories: categories
                });
            });
        });
    }
};

// 活动相关图片上传处
// exports.savePoster = function (req, res, next) {
//     var posterData = req.files.uploadPoster;
//     var filePath = posterData.path;
//     var originalFilename = posterData.originalFilename;

//     if (originalFilename) {
//         fs.readFile(filePath, function (err, data) {
//             var timestamp = Date.now();
//             var type = posterData.type.split('/')[1];
//             var poster = timestamp + '.' + type;
//             var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
//             fs.writeFile(newPath, data, function (err) {
//                 req.poster = poster;
//                 next();
//             });
//         });
//     } else {
//         next();
//     }
// };

// 保存一个活动
exports.save = function (req, res) {
    var id = req.body.activity._id;
    var activityObj = req.body.activity;
    var _activity;

    if (req.poster) {
        activityObj.poster = req.poster;
    }

    if (id) {
        Activity.findById(id, function (err, activity) {
            if (err) {
                console.log(err);
            }
            _activity = _.extend(activity, activityObj);
            _activity.save(function (err, activity) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/activity/' + activity._id);
            });
        });
    } else {
        _activity = new Activity(activityObj);

        var categoryId = activityObj.category;
        var categoryName = activityObj.categoryName;

        _activity.save(function (err, activity) {
            if (err) {
                console.log(err);
            }
            if (categoryId) {
                Category.findById(categoryId, function (err, category) {
                    category.activitys.push(activity._id);

                    category.save(function (err, category) {
                        res.redirect('/activity/' + activity._id);
                    });
                });
            } else if (categoryName) {
                Category.findByName(categoryName, function (err, category) {
                    if (!category) {
                        category = new Category({
                            name: categoryName,
                            movies: [activity._id]
                        });
                    } else {
                        category.activitys.push(activity._id);
                    }
                    category.save(function (err, category) {
                        activity.category = category._id;
                        activity.save(function (err, activity) {
                            res.redirect('/activity/' + activity._id);
                        });
                    });
                });
            }
        });
    }
};

// list page
exports.list = function (req, res) {
    Activity.find({})
        .populate('category', 'name')
        .exec(function (err, activitys) {
            if (err) {
                console.log(err);
            }
            res.render('list', {
                title: '活动 列表页',
                activitys: activitys
            });
        });
};

// 删除某一个活动
exports.del = function (req, res) {
    var id = req.query.id;
    if (id) {
        Activity.remove({
            _id: id
        }, function (err, movie) {
            if (err) {
                console.log(err);
                res.json({
                    success: 0
                });
            } else {
                res.json({
                    success: 1
                });
            }
        });
    }
};

