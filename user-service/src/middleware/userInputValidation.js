import Joi from "joi";
const userSignUpScheme = Joi.object({
  phone_number: Joi.number().min(10).required(),
  email: Joi.string().email().required(),
  password:Joi.string().required(),
  name: Joi.string().min(3).required(),
  profile_pic:Joi.string()
});
export const validateSignUpUser = (req, res, next) => {
  const { error } = userSignUpScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

const userLoginScheme = Joi.object({
  email:Joi.string().required(),
  password:Joi.string().required(),
});

export const validateLoginUser = (req, res, next) => {
  const { error } = userLoginScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};
const tokenScheme = Joi.object({
  refreshToken:Joi.string().required(),
});
export const validateRefreshToken = (req, res, next) => {
  const { error } = userLoginScheme.refreshToken(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};