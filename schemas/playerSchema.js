const mongoose = require("mongoose");
const { Schema } = mongoose;
var connection = require("../data/dbConnection");

const PlayerSchema = new Schema(
  {
    username: { type: String, unique: true },
    name: String,
    lastname: String,
    password: String,
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
  },
  {
    collection: "players",
  }
);

PlayerSchema.statics = {
  create: function (data, cb) {
    const player = new this(data);
    player.save(cb);
  },
  login: function (query, cb) {
    this.find(query, cb);
  },
  findByName: function (name) {
    return this.findOne({ username: name });
  },
};

module.exports = connection.model("Player", PlayerSchema);
