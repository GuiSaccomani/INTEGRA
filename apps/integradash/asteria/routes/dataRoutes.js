const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

// Endpoints
router.get("/data", dataController.getData);
router.post("/data", dataController.postData);

module.exports = router;
 