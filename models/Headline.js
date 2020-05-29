var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var headlineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;