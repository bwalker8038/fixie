var userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique:true }
});
