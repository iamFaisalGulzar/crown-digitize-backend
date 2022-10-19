const tutorialsController = require("../controllers/tutorial.controller.js");
const router = require("express").Router();

// Create a new Tutorial
router.post("/", tutorialsController.create);

// Retrieve all Tutorials
router.get("/", tutorialsController.findAll);

// Retrieve all published Tutorials
router.get("/published", tutorialsController.findAllPublished);

router.get("/title", tutorialsController.findByTitle);

// Retrieve a single Tutorial with id
router.get("/:id", tutorialsController.findOne);

// Update a Tutorial with id
router.put("/:id", tutorialsController.update);

// Delete a Tutorial with id
router.delete("/:id", tutorialsController.delete);

// Delete all Tutorials
router.delete("/", tutorialsController.deleteAll);

module.exports = router;
