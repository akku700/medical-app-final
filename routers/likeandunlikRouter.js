const express = require("express");
const router = express.Router();

const validateToken = require("../middlewares/validateToken");
const likeandunlikeController = require("../controllers/likeandunlikeController");

router.use(validateToken);

router.post("/like/:id", likeandunlikeController.likeproduct);
router.get("/mostlike", likeandunlikeController.mostlike);

module.exports = router;
