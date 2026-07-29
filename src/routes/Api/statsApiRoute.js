const express = require("express");
const router = express.Router();

const controller = require("../../controllers/Api/statsApiController");

router.get("/", controller.getStats);

module.exports = router;