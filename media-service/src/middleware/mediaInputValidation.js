import Joi from "joi";

/**
 * Common options
 */
const options = {
  abortEarly: false,
  allowUnknown: false,
};

/**
 * UUID param validation
 */
const mediaIdSchema = Joi.object({
  id: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .messages({
      "string.base": "Media id must be a string",
      "string.guid": "Invalid media id format",
      "any.required": "Media id is required",
    }),
});

/**
 * Create media validation
 */
const createMediaSchema = Joi.object({
  fileType: Joi.string()
    .trim()
    .valid("image", "video", "audio", "document")
    .required()
    .messages({
      "any.only": "fileType must be image, video, audio, or document",
      "any.required": "fileType is required",
    }),

  fileName: Joi.string()
    .trim()
    .max(255)
    .optional()
    .messages({
      "string.max": "fileName must be less than 255 characters",
    }),

  size: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "size is required",
    }),
});

/**
 * Update media validation (PATCH / PUT)
 */
const updateMediaSchema = Joi.object({
  fileType: Joi.string()
    .trim()
    .valid("image", "video", "audio", "document")
    .optional(),

  fileName: Joi.string()
    .trim()
    .max(255)
    .optional(),

  size: Joi.string()
    .trim()
    .optional(),
}).min(1);

/**
 * File name param validation
 */
const fileNameParamSchema = Joi.object({
  fileName: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "fileName is required",
    }),
});

/**
 * File type param validation
 */
const fileTypeParamSchema = Joi.object({
  fileType: Joi.string()
    .valid("image", "video", "audio", "document")
    .required()
    .messages({
      "any.only": "Invalid fileType",
      "any.required": "fileType is required",
    }),
});

/**
 * Search query validation
 */
const searchMediaSchema = Joi.object({
  fileName: Joi.string().trim().optional(),
  fileType: Joi.string()
    .valid("image", "video", "audio", "document")
    .optional(),
}).or("fileName", "fileType");

/* ===========================
   Middleware exports
=========================== */

/**
 * Validate media ID (params)
 */
export const validateMediaId = (req, res, next) => {
  const { error } = mediaIdSchema.validate(req.params, options);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};

/**
 * Validate create media (body)
 */
export const validateCreateMedia = (req, res, next) => {
  const { error } = createMediaSchema.validate(req.body, options);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};

/**
 * Validate update media (body)
 */
export const validateUpdateMedia = (req, res, next) => {
  const { error } = updateMediaSchema.validate(req.body, options);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};

/**
 * Validate file name (params)
 */
export const validateFileNameParam = (req, res, next) => {
  const { error } = fileNameParamSchema.validate(req.params, options);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};

/**
 * Validate file type (params)
 */
export const validateFileTypeParam = (req, res, next) => {
  const { error } = fileTypeParamSchema.validate(req.params, options);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};

/**
 * Validate search query (?fileName=&fileType=)
 */
export const validateSearchMedia = (req, res, next) => {
  const { error } = searchMediaSchema.validate(req.query, options);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};
