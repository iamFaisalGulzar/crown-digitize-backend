const usersController = require("../controllers/user.controller.js");

var router = require("express").Router();

// Create a new Tutorial
router.post("/signup", usersController.signup);

router.post("/signin", usersController.beforeFunc, usersController.signin);

// Sign in with google
router.post("/googleLogin", usersController.singInWithGoogle);

// Retrieve all users
router.get("/", usersController.findAll);

// Retrieve all published users
router.get("/published", usersController.findAllPublished);

// Retrieve a single Tutorial with id
router.get("/:id", usersController.findOne);

// Update a Tutorial with id
router.put("/:id", usersController.update);

// Delete a Tutorial with id
router.delete("/:id", usersController.delete);

// Delete all users
router.delete("/", usersController.deleteAll);

module.exports = router;
