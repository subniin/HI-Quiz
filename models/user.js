var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    name: String,
    userid: String,
    password : String,
    loginCount: Number,
    scores: Number,
    solvedQuiz: Number,
    lastLogin: Date,
    lastScore: Number,
    lastSolvedQuiz: Number
});

//password를 암호화
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//password의 유효성 검증
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
