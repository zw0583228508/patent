import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import usersRouter from "./users";
import commentsRouter from "./comments";
import notificationsRouter from "./notifications";
import uploadRouter from "./upload";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);
router.use("/notifications", notificationsRouter);
router.use(uploadRouter);

export default router;
