import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import usersRouter from "./users";
import commentsRouter from "./comments";
import notificationsRouter from "./notifications";
import uploadRouter from "./upload";
import authRouter from "./auth";
import translateRouter from "./translate";
import collectionsRouter from "./collections";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/translate", translateRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);
router.use("/notifications", notificationsRouter);
router.use("/collections", collectionsRouter);
router.use(uploadRouter);

export default router;
