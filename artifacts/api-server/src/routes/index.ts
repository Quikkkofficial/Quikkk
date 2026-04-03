import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import applicationsRouter from "./applications";
import vendorsRouter from "./vendors";
import commissionsRouter from "./commissions";
import documentsRouter from "./documents";
import leadsRouter from "./leads";
import communicationsRouter from "./communications";
import notificationsRouter from "./notifications";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(applicationsRouter);
router.use(vendorsRouter);
router.use(commissionsRouter);
router.use(documentsRouter);
router.use(leadsRouter);
router.use(communicationsRouter);
router.use(notificationsRouter);
router.use(analyticsRouter);

export default router;
