const { Schema, model } = require("mongoose");
const reactionsSchema = require("./Reactions");
const moment = require("moment");

const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },
    userName: {
      type: String,
      required: true,
    },
    reactions: [reactionsSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtsSchema.virtual("reactionsCount").get(function () {
  return this.reactions.length;
});

const Thoughts = model("Thought", thoughtsSchema);

module.exports = Thoughts;
