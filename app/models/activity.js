var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ActivitySchema = new Schema({
    title: String,
    date: String,
    address: String,
    country: String,
    provnice: String,
    city: String,
    summary: String,
    poster: String,
    year: Number,
    detail: String,
    pv: {
      type: Number,
      default: 0
    },
    category: {
      type: ObjectId,
      ref: 'Category'
    },
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

// var ObjectId = mongoose.Schema.Types.ObjectId
ActivitySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

ActivitySchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb);
    }
};

var Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;
