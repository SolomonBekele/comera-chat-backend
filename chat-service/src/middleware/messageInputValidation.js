import Joi from "joi";
const sendMessageScheme = Joi.object({
  conversationId: Joi.string().min(10),
  receiverId: Joi.string().required(),
  content:Joi.string().required(),
  type: Joi.string().min(3).required(),
});
export const validateSendMessge = (req, res, next) => {
  const { error } = sendMessageScheme.validate(req.body);
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
  const { error } = tokenScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

const userUpdateScheme = Joi.object({
  phoneNumber: Joi.number().min(10).required(),
  fullName: Joi.string().min(3).required(),
});
export const validateUpdateUser = (req, res, next) => {
  const { error } = userUpdateScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};



// Validate uploaded profile picture
const profilePicUpdateScheme = Joi.object({
  // Expecting a file object with mimetype and size
  mimetype: Joi.string()
    .valid("image/jpeg", "image/png", "image/jpg", "image/gif")
    .required()
    .messages({
      "any.only": "Only JPG, JPEG, PNG, or GIF images are allowed",
      "any.required": "Profile picture is required",
    }),
  size: Joi.number()
    .max(5 * 1024 * 1024) // max 5 MB
    .messages({
      "number.max": "Profile picture must be less than 5 MB",
    }),
});

export const validateProfilePicUpdate = (req, res, next) => {
 
  const { error } = profilePicUpdateScheme.validate(req.file, { 
    abortEarly: true,
    allowUnknown:true
  });

  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });

  next();
};
