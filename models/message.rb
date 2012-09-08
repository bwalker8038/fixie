var messageSchema = new Schema({
    body: String,
    author: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    dateCreated: { type: Date, default: Date.now }
});
