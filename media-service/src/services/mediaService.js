import {
  findMediaByIdRepo,
  findMediaByFileNameRepo,
  findMediaByFileTypeRepo,
  findMediaByFileNameOrTypeRepo,
  createMediaRepo,
  deleteMediaByIdRepo,
  getAllMediaPaginatedRepo,
  updateMediaByIdRepo,
} from "../repositories/sequelize/mediaRepository.js";

import logger from "../utils/logger.js";
import i18n from "../i18n/langConfig.js";
import { deleteMedia, getPresignedUrl, uploadMedia } from "../utils/storageHandler.js";
import { formatBytes } from "../utils/formatBytes.js";

/**
 * Get media by ID
 */
export const getMediaByIdService = async (id) => {
  const media = await findMediaByIdRepo(id);
  console.log(media);

  if (!media) {
    logger.warn(`Media not found: id=${id}`);
    throw new Error(i18n.__("MEDIA.NOT_FOUND_ID", { id }));
  }
   const mediaUrl = await getPresignedUrl(media.minioFileName)

  logger.info(`Fetched media by id: id=${id}`);
  return mediaUrl;
};

/**
 * Get media by file name
 */
export const getMediaByFileNameService = async (fileName) => {
  const media = await findMediaByFileNameRepo(fileName);

  if (!media) {
    logger.warn(`Media not found: fileName=${fileName}`);
    throw new Error(i18n.__("MEDIA.NOT_FOUND_FILENAME", { fileName }));
  }

  logger.info(`Fetched media by file name: ${fileName}`);
  return media;
};

/**
 * Get media by file type
 */
export const getMediaByFileTypeService = async (fileType) => {
  const mediaList = await findMediaByFileTypeRepo(fileType);

  if (!mediaList.length) {
    logger.warn(`No media found for fileType=${fileType}`);
    return [];
  }

  logger.info(`Fetched media by fileType=${fileType}, count=${mediaList.length}`);
  return mediaList;
};

/**
 * Get media by file name OR type
 */
export const getMediaByFileNameOrTypeService = async (fileName, fileType) => {
  const media = await findMediaByFileNameOrTypeRepo(fileName, fileType);

  if (!media) {
    logger.warn(
      `Media not found: fileName=${fileName}, fileType=${fileType}`
    );
    throw new Error(i18n.__("MEDIA.NOT_FOUND"));
  }

  return media;
};

/**
 * Create media
 */
export const createMediaService = async (bufferFile,originalFileName,fileType,fileSize) => {
  
  const minioFileName = await uploadMedia(bufferFile,originalFileName);

  const media = await createMediaRepo( fileType, originalFileName,minioFileName, formatBytes(fileSize) );

  logger.info(`Media created: id=${media.id}`);
  return media;
};

/**
 * Get all media (paginated)
 */
export const getAllMediaService = async ({ page = 1, limit = 20 }) => {
  const result = await getAllMediaPaginatedRepo({ page, limit });

  if (!result.data.length) {
    logger.warn("No media found");
    return result;
  }

  logger.info(
    `Fetched media list: page=${page}, limit=${limit}, count=${result.data.length}`
  );

  return result;
};

/**
 * Update media by ID
 */
export const updateMediaByIdService = async (id, bufferFile,originalFileName,fileType,fileSize) => {
  const existingMedia = await findMediaByIdRepo(id);
 
  if (!existingMedia) {
    logger.warn(`Media update failed, not found: id=${id}`);
    throw new Error(i18n.__("MEDIA.NOT_FOUND_ID", { id }));
  }
  await deleteMedia(existingMedia.minioFileName);
  const minioFileName = await uploadMedia(bufferFile,originalFileName);

  const updatedMedia = await updateMediaByIdRepo(id, fileType, originalFileName,minioFileName, fileSize );

  logger.info(`Media updated: id=${id}`);
  return updatedMedia;
};

/**
 * Delete media by ID
 */
export const deleteMediaByIdService = async (id) => {
  const media = await findMediaByIdRepo(id);

  if (!media) {
    logger.warn(`Media delete failed, not found: id=${id}`);
    throw new Error(i18n.__("MEDIA.NOT_FOUND_ID", { id }));
  }

  await deleteMediaByIdRepo(id);

  logger.info(`Media deleted: id=${id}`);
  return true;
};
