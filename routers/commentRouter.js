const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const validateToken = require("../middlewares/validateToken");

router.use(validateToken);
router.get("/:id", commentController.getCommentsOnProduct);
router.post("/:id", commentController.addComment);

module.exports = router;
