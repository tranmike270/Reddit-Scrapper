var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
// Requiring module to encrypt passwords
var bCrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;


var UserSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    firstName : String,
    lastName: String,
    created: {
        type: Date,
        default: Date.now
    },
    articles : [
        {
            type: Schema.Types.ObjectId,
            ref: "Article",
            notes : [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Note"
                }
            ]
        }
    ]
});

var User = mongoose.model('User', UserSchema);

module.exports = User;