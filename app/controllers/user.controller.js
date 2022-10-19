const User = require("../models/user.model");
const { google } = require("googleapis");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

// Create and Save a new Tutorial
exports.signup = async (req, res) => {
  // Validate request
  const { username, password } = req.body;
  if (!username) {
    res.status(400).send({
      message: "username can not be empty!",
    });
    return;
  } else if (!password) {
    res.status(400).send({
      message: "password can not be empty!",
    });
    return;
  }

  let hasUser = await User.findOne({
    where: { username },
  });

  if (hasUser) {
    res
      .status(409)
      .send({ message: "username already exits.Try with another username" });
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  // Create a Tutorial
  const user = {
    username: username,
    password: hashPassword,
  };

  // Save Tutorial in the database
  User.create(user)
    .then((data) => {
      res.status(201).send("Account created successfully");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Simple sign

exports.signin = async (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "username can not be empty!",
    });
    return;
  } else if (!req.body.password) {
    res.status(400).send({
      message: "password can not be empty!",
    });
    return;
  }

  let user = await User.findOne({
    where: { username: req.body.username },
  });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET
    );
    // res.redirect("http://localhost:3001/blog-overview");

    res.status(200).send(token);
  } else {
    res.status(404).send({ message: "emial or password is incorrect!" });
  }
};

exports.beforeFunc = (req, res, next) => {
  console.log("BEFORE FUNCTION IS CALLED");
  next();
};

// Sign in with Google
exports.singInWithGoogle = async (req, res) => {
  const token = req.body.accessToken;
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials({ access_token: token });
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  const response = await oauth2.userinfo.get();
  if (response.status === 200) {
    let user = await User.findOne({
      where: { username: response.data.email },
    });
    if (user) {
      const token = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET
      );
      res.status(200).send(token);
    } else {
      return res.status(400).send({ message: "User not found!" });
    }
  } else {
    return res.status(400).send({ message: "User not found!" });
  }
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  User.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
