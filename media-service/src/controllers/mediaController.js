import {
  getMediaByIdService,
  getMediaByFileNameService,
  getMediaByFileTypeService,
  getMediaByFileNameOrTypeService,
  createMediaService,
  getAllMediaService,
  updateMediaByIdService,
  deleteMediaByIdService,
} from "../services/mediaService.js";

import logger from "../utils/logger.js";
import i18n from "../i18n/langConfig.js";

/**
 * Get media by ID
 */
export const getMediaUrlById = async (req, res) => {
  logger.info("get media by id endpoint hit...");
  try {
    const { id } = req.params;
    const mediaUrl = await getMediaByIdService(id);

    res.json({
      success: true,
      message: i18n.__("MEDIA.RETRIEVED_BY_ID", { id }),
      mediaUrl,
    });
  } catch (error) {
    logger.error(`Get media error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get media by file name
 */
export const getMediaByFileName = async (req, res) => {
  logger.info("get media by file name endpoint hit...");
  try {
    const { fileName } = req.params;
    const media = await getMediaByFileNameService(fileName);

    res.json({
      success: true,
      message: i18n.__("MEDIA.RETRIEVED_BY_FILENAME", { fileName }),
      media,
    });
  } catch (error) {
    logger.error(`Get media error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get media by file type
 */
export const getMediaByFileType = async (req, res) => {
  logger.info("get media by file type endpoint hit...");
  try {
    const { fileType } = req.params;
    const media = await getMediaByFileTypeService(fileType);

    res.json({
      success: true,
      message: i18n.__("MEDIA.RETRIEVED_BY_TYPE", {
        fileType,
        count: media.length,
      }),
      media,
    });
  } catch (error) {
    logger.error(`Get media error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get media by file name OR file type
 */
export const getMediaByFileNameOrType = async (req, res) => {
  logger.info("get media by file name or type endpoint hit...");
  try {
    const { fileName, fileType } = req.query;
    const media = await getMediaByFileNameOrTypeService(fileName, fileType);

    res.json({
      success: true,
      message: i18n.__("MEDIA.RETRIEVED"),
      media,
    });
  } catch (error) {
    logger.error(`Get media error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Create media
 */
export const createMedia = async (req, res) => {
  logger.info("create media endpoint hit...");
  try {
    const file = req.file();
    const media = await createMediaService(file.buffer,file.originalname,file.mimetype,file.size);

    res.status(201).json({
      success: true,
      message: i18n.__("MEDIA.CREATED"),
      media,
    });
  } catch (error) {
    logger.error(`Create media error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all media (paginated)
 */
export const getAllMedia = async (req, res) => {
  logger.info("get all media endpoint hit...");
  try {
    const { page, limit } = req.query;

    const result = await getAllMediaService({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    res.json({
      success: true,
      message: i18n.__("MEDIA.RETRIEVED_ALL", {
        count: result.data.length,
      }),
      ...result,
    });
  } catch (error) {
    logger.error("Error fetching all media", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update media by ID
 */
export const updateMediaById = async (req, res) => {
  logger.info("update media endpoint hit...");
  try {
    const { id } = req.params;
    const media = await updateMediaByIdService(id, req.body);

    res.json({
      success: true,
      message: i18n.__("MEDIA.UPDATED"),
      media,
    });
  } catch (error) {
    logger.error(`Update media error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete media by ID
 */
export const deleteMediaById = async (req, res) => {
  logger.info("delete media endpoint hit...");
  try {
    const { id } = req.params;
    await deleteMediaByIdService(id);

    res.json({
      success: true,
      message: i18n.__("MEDIA.DELETED"),
    });
  } catch (error) {
    logger.error(`Delete media error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({ success: false, message: error.message });
  }
};
