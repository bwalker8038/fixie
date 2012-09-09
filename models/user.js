var bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique:true },
    bio: String,
    hashedPassword: String,
    salt: String,
    dateCreated: {type: String, default: Date.now() }
});

userSchema.pre('save', function(next) {
    if(!validatePresenceOf(this.password)) {
        next(new Error('Password is missing'));
    } else {
        next();
    }
});

userSchema.virtual('password').set(function(password) {
    this.salt = bcrypt.genSaltSync(10);
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
