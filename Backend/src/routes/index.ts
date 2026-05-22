import { Router } from "express";

import {
  customerSessionController,
  loginController,
  ownerRegisterController,
} from "../controllers/auth.controller";
import {
  createOrderController,
  callWaiterController,
  simulatePaymentController,
} from "../controllers/customer.controller";
import { healthController } from "../controllers/health.controller";
import {
  ownerCategoryController,
  ownerCreateWaiterController,
  ownerDashboardController,
  ownerMenuController,
  ownerPromoController,
  ownerSettingsController,
  ownerUploadController,
} from "../controllers/owner.controller";
import {
  orderStatusController,
  publicRestaurantController,
} from "../controllers/public.controller";
import {
  waiterBoardController,
  waiterCallStatusController,
  waiterOrderStatusController,
} from "../controllers/waiter.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const apiRouter = Router();

apiRouter.get("/health", healthController);

apiRouter.post("/public/auth/owner/register", ownerRegisterController);
apiRouter.post("/public/auth/login", loginController);
apiRouter.post("/public/customer/session", customerSessionController);
apiRouter.get("/public/restaurant", publicRestaurantController);
apiRouter.get("/public/orders/:orderId", orderStatusController);

apiRouter.get(
  "/owner/dashboard",
  requireAuth,
  requireRole(["OWNER"]),
  ownerDashboardController
);
apiRouter.patch(
  "/owner/settings",
  requireAuth,
  requireRole(["OWNER"]),
  ownerSettingsController
);
apiRouter.post(
  "/owner/upload",
  requireAuth,
  requireRole(["OWNER"]),
  upload.single("file"),
  ownerUploadController
);
apiRouter.post(
  "/owner/waiters",
  requireAuth,
  requireRole(["OWNER"]),
  ownerCreateWaiterController
);
apiRouter.post(
  "/owner/categories",
  requireAuth,
  requireRole(["OWNER"]),
  ownerCategoryController
);
apiRouter.post(
  "/owner/menu-items",
  requireAuth,
  requireRole(["OWNER"]),
  ownerMenuController
);
apiRouter.post(
  "/owner/promos",
  requireAuth,
  requireRole(["OWNER"]),
  ownerPromoController
);

apiRouter.get(
  "/waiter/board",
  requireAuth,
  requireRole(["WAITER", "OWNER"]),
  waiterBoardController
);
apiRouter.patch(
  "/waiter/orders/status",
  requireAuth,
  requireRole(["WAITER", "OWNER"]),
  waiterOrderStatusController
);
apiRouter.patch(
  "/waiter/calls/status",
  requireAuth,
  requireRole(["WAITER", "OWNER"]),
  waiterCallStatusController
);

apiRouter.post(
  "/customer/orders",
  requireAuth,
  requireRole(["CUSTOMER"]),
  createOrderController
);
apiRouter.post(
  "/customer/payment/simulate",
  requireAuth,
  requireRole(["CUSTOMER"]),
  simulatePaymentController
);
apiRouter.post(
  "/customer/call-waiter",
  requireAuth,
  requireRole(["CUSTOMER"]),
  callWaiterController
);
