var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
  title: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  summary: {
    type: String,
    required: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;