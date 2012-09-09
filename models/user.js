var bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;


function validatePresenceOf(value) {
  return value && value.length;
};


var userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    hashedPassword: String,
    salt: String,
    bio: String,
    dateCreated: {type: String, default: Date.now() }
});

userSchema.pre('save', function(next) {
    if(this.password != this.passwordConfirm) {
        next(new Error('Passwords do not match'));
    } else if(!validatePresenceOf(this.password)){
        next(new Error('Password is missing'));
    } else {
        next();
    }
});

userSchema.virtual('passwordConfirm').set(function(password) {
    this._passwordConfirm = password;
}).get(function() {
    return this._passwordConfirm;
});

userSchema.virtual('password').set(function(password) {
    this.salt = bcrypt.genSaltSync(10);
    this._password = password;
    this.hashedPassword = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

userSchema.method('encryptPassword', function(password) {
    return bcrypt.hashSync(password, this.salt);
});

userSchema.method('authenticate', function(plaintext) {
    return bcrypt.compareSync(plaintext, this.hashed_password);
});

exports.User = mongoose.model('User', userSchema);
