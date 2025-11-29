import Joi from 'joi';

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const vacationCreateUpdateSchema = Joi.object({
  destination: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).max(1000).required(),
  price: Joi.number().min(1).max(10000).precision(2).required(),
  
  startDate: Joi.string().pattern(dateRegex).required(),
  endDate: Joi.string().pattern(dateRegex).required(),
  
}).custom((value, helpers) => {
  if (new Date(value.startDate) >= new Date(value.endDate)) {
    return helpers.error('any.invalid', { message: 'Start date must be before end date.' });
  }
  return value;
}, 'Date Range Validation');