const express = require("express");
const PostController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/save",checkAuth, PostController.savePost);
router.put("/update",checkAuth, PostController.updatePost);
router.get("/find/:id", PostController.getPost);
router.delete("/delete/:id",checkAuth, PostController.deletePost);
router.get("/list", PostController.getAllPosts);

module.exports = router;
