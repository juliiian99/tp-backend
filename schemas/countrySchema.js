const mongoose = require("mongoose");
const { Schema } = mongoose;
var connection = require("../data/dbConnection");

const CountrySchema = new Schema(
  {
    name: String,
    players: [{ type: mongoose.Types.ObjectId, ref: "Player" }],
  },
  {
    collection: "countries",
  }
);

CountrySchema.static("findByName", function (name) {
  return this.findOne({ name: name });
});

module.exports = connection.model("Country", CountrySchema);
