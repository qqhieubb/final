import { body } from "express-validator";

export const commentValidation = [
  body("commentText")
    .notEmpty()
    .withMessage("Comment text cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Comment text cannot exceed 500 characters"),
];
