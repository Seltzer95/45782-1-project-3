import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, 
    allowUnknown: true, 
    stripUnknown: true,
  });

  if (error) {
 
    const errorMessages = error.details.map((detail) => detail.message.replace(/"/g, ''));


    console.log('❌ Validation failed:', errorMessages);
    console.log('Request body:', req.body);


    return res.status(400).json({
        message: 'Validation failed',
        errors: errorMessages
    });
  }


  req.body = value;
  next();
};