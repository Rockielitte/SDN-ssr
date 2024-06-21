import express, { Request, Response, NextFunction } from "express";
import { HomeController } from "../controllers/home.controller";

export const homeRouter = express.Router();

homeRouter.get("/home", HomeController.homePage);
homeRouter.get("/watches/:_id", HomeController.watchDetailPage);
homeRouter.get("/", (req, res) => {
  res.redirect("/home");
});
