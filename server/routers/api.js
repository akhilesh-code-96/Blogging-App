import express from "express";
import PostController from "../src/controllers/post.controller.js";
import UserController from "../src/controllers/user.controller.js";
import { uploadFile } from "../src/middlewares/file-upload.middleware.js";
import { auth } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

const postController = new PostController();
const userController = new UserController();

router.get("/", (req, res) => res.send("Hello World!"));
router.post("/account-posts", postController.accountPost);
router.get("/posts", postController.getPost);
router.post(
  "/register",
  uploadFile.single("photo"),
  userController.registerUser
);
router.post("/post-login", userController.login);
router.post("/user", userController.getUser);
router.post("/get-users-info", userController.userInfo);
router.post("/update-about", userController.updateAbout);
router.get("/logout", userController.logout);
router.post("/new-blog", postController.newPost);
router.post("/update-blog", postController.updateBlog);
router.post("/delete-blog", postController.deleteBlog);
router.post("/update-likes", postController.updateLikes);
router.post("/post-comment", postController.updateComments);
router.get("/get-comment/", postController.getComments);
router.post("/post-reply/", postController.updateReplies);

export default router;
