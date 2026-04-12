import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import usersRouter from "./users";
import commentsRouter from "./comments";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);
router.use(uploadRouter);

export default router;
