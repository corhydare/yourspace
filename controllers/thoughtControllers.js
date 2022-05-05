const { Thought, User } = require("../models");

const thoughtControllers = {
  getAllThought(req, res) {
    Thought.find({})
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400).json(err);
      });
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400).json(err);
      });
  },

  createThought({ body }, res) {
    Thought.create(body)
      .then((dbThoughtData) => {
        User.findOneAndUpdate(
          { _id: body.userId },
          { $addToSet: { thoughts: dbThoughtData._id } },
          { new: true }
        )
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "Nobody with this id..." });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        User.findOneAndUpdate(
          { userName: dbThoughtData.userName },
          { $pull: { thoughts: params.id } }
        )
          .then(() => {
            res.json({
              message: "This thought has been removed",
            });
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Nothing with this id..." });
          return;
        }
        console.log("test");
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtControllers;
