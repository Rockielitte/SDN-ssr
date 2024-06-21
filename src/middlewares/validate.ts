import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { ValidationError } from "../errors/ValidationError";
import { valid } from "joi";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("validate middleware");

    try {
      console.log(req.body);
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: any) {
      const validationErrors = JSON.parse(err.message);
      console.log(validationErrors, "errorMessage");
      const errorMap: Object = {};
      validationErrors.forEach(
        (error) => (errorMap[error.path[1]] = error.message)
      );
      next(new ValidationError(errorMap, req.body));
    }
  };

export default validate;
