import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import type { AnyZodObject } from "zod/v3";

const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data.body;

    next();
  };
};

export default validateRequest;
