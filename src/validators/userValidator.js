import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(5)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 5 characters',
      'string.pattern.base':
        'Password must contain both lowercase and uppercase letters',
      'any.required': 'Password is required',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',
    'any.required': 'Confirm Password is required',
  }),
  name: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters',
      'any.required': 'Name is required',
    }),
  surname: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Surname can only contain letters',
      'any.required': 'Surname is required',
    }),
  address: Joi.string().required().messages({
    'any:required': 'Address  is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'El email es obligatorio.',
      'string.email': 'El email no tiene un formato válido.',
    }),
  password: Joi.string().required().messages({
    'string.empty': 'La contraseña es obligatoria.',
  }),
});
