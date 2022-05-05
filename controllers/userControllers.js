const { User, Thought } = require("../models");

const userControllers = {
  getAllUser(req, res) {
    User.find({})
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400).json(err);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate([
        {
          path: "thoughts",
          select: "-__v",
        },
        {
          path: "friends",
          select: "-__v",
        },
      ])
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400).json(err);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        User.updateMany(
          { _id: { $in: dbUserData.friends } },
          { $pull: { friends: params.id } }
        )
          .then(() => {
            Thought.deleteMany({ userName: dbUserData.userName })
              .then(() => {
                res.json({
                  message: "This user and their thoughts have been removed.",
                });
              })
              .catch((err) => res.status(400).json(err));
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },

  createFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then((dbUserData2) => {
            if (!dbUserData2) {
              res.status(404).json({ message: "Nobody with this id..." });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Nobody with this id..." });
          return;
        }
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $pull: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then((dbUserData2) => {
            if (!dbUserData2) {
              res.status(404).json({ message: "Nobody with this id..." });
              return;
            }
            res.json({
              message:
                "This user and everything associated with them has been removed.",
            });
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userControllers;
