var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  // 用户名
  username: {
    unique: true,
    type: String
  },
  // 密码
  password: String,
  // 角色
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
  },
  phoneNumber: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  // 教育信息
  eduInfo: {
    // 学校
    university: String,
    // 学院
    college: String,
    // 专业
    major: String,
    // 学年
    year: String,
    // 校区
    campus: String,
    // 学号
    card: String
  },
  // 微信相关的信息
  weixin: {
    openid: {
      type: String,
      unique: true
    },
    headimgurl: String,
    nickname: String,
    sex: String,
    language: String,
    city: String,
    province: String,
    country: String
  },
  // 身份相关信息
  profile: {
    // 身份证号
    cardId: String,
    // 名字
    name: String,
    // 性别
    gender: String,
    // 生日
    birthday: String,
    // 常住地
    location: String
  },
  // 积分
  score: { type: Number, default: 0 },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  }
};

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb);
  }
};

var User = mongoose.model('User', UserSchema);
module.exports = User;