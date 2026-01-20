const mongoose = require("mongoose");
const { Schema } = mongoose;

// ⬇️ IMPORTANT: grab the default export
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// ✅ now this IS a function
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
