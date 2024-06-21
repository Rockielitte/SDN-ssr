import { Router } from "express";
import { Authorization } from "../middlewares/authorization";
import { DashboardController } from "../controllers/dashboard.controller";
import authentication from "../middlewares/authentication";
import validate from "../middlewares/validate";
import { brandValidate } from "../validate/brand.validate";
import { watchValidate } from "../validate/watch.validate";

export const dashboardRoutes = Router();
dashboardRoutes.use(authentication, Authorization([true]));

dashboardRoutes.get("/brands", DashboardController.brandsPage);

dashboardRoutes.get("/users", DashboardController.usersPage);
dashboardRoutes.get("/watches", DashboardController.watchesPage);
dashboardRoutes.post(
  "/brands",
  validate(brandValidate),
  DashboardController.addBrand
);
dashboardRoutes.put(
  "/brands/:_id",
  validate(brandValidate),
  DashboardController.putBrand
);
dashboardRoutes.delete("/brands/:_id", DashboardController.deleteBrand);

dashboardRoutes.post(
  "/watches",
  validate(watchValidate),
  DashboardController.addWatch
);
dashboardRoutes.put(
  "/watches/:_id",
  validate(watchValidate),
  DashboardController.putWatch
);
dashboardRoutes.delete("/watches/:_id", DashboardController.deleteWatch);
