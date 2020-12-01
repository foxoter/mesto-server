const {
  celebrate, Joi,
} = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('validator');
const BadRequestError = require('../errors/badRequestError');

const urlValidator = validator.isURL;
const emailValidator = validator.isEmail;

const name = Joi.string()
  .min(2)
  .max(30)
  .required();

const about = Joi.string()
  .min(2)
  .max(30)
  .required();

const avatar = Joi.string()
  .required().custom((value, helpers) => (urlValidator(value) ? value : helpers.error('any.invalid')));

const email = Joi.string()
  .required()
  .custom((value, helpers) => (emailValidator(value) ? value : helpers.error('any.invalid')));

const password = Joi.string()
  .required()
  .min(8)
  .error(() => new BadRequestError('`Password` field must contain at least 8 characters'));

const id = Joi.objectId();

module.exports.userIdValidator = celebrate({
  params: Joi.object().keys({
    id,
  }),
});

module.exports.createUserValidator = celebrate({
  body: Joi.object().keys({
    email, password, name, about, avatar,
  }),
});

module.exports.updateProfileValidator = celebrate({
  body: Joi.object().keys({
    name, about,
  }),
});

module.exports.updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar,
  }),
});

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email,
    password: Joi.string().required().min(8),
  }),
});
