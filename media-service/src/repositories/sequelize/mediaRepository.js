import Media from "../sequelize/db/model/mediaModel.js";
import { Op } from "sequelize";

/**
 * Find media by ID
 */
export const findMediaByIdRepo = async (id) => {
  const media = await Media.findOne({ where: { id } });
  return media ? media.dataValues : null;
};

/**
 * Find media by file name
 */
export const findMediaByFileNameRepo = async (fileName) => {
  const media = await Media.findOne({ where: { fileName } });
  return media ? media.dataValues : null;
};

/**
 * Find all media by file type (image, video, audio, etc.)
 */
export const findMediaByFileTypeRepo = async (fileType) => {
  const media = await Media.findAll({ where: { fileType } });
  return media.map((m) => m.dataValues);
};

/**
 * Find media by file name OR file type
 */
export const findMediaByFileNameOrTypeRepo = async (fileName, fileType) => {
  const media = await Media.findOne({
    where: {
      [Op.or]: [{ fileName }, { fileType }],
    },
  });

  return media ? media.dataValues : null;
};

/**
 * Create media
 */
export const createMediaRepo = async ( fileType, originalFileName,minioFileName, fileSize ) => {
  console.log(fileType, originalFileName,minioFileName, fileSize);
  const media = await Media.create({
    fileType,
    originalFileName,
    minioFileName,
    fileSize,
  });

  return media.dataValues;
};

/**
 * Delete media by ID
 */
export const deleteMediaByIdRepo = async (id) => {
  return await Media.destroy({ where: { id } });
};

/**
 * Get all media with pagination
 */
export const getAllMediaPaginatedRepo = async ({
  page = 1,
  limit = 20,
}) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Media.findAndCountAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  return {
    total: count,
    page,
    limit,
    data: rows.map((m) => m.dataValues),
  };
};

export const updateMediaByIdRepo = async (id,fileType, originalFileName,minioFileName, fileSize  ) => {
  const [updatedCount] = await Media.update(
    { originalFileName,minioFileName, fileType,fileSize },
    { where: { id } }
  );

  if (!updatedCount) return null;

  const media = await Media.findOne({ where: { id } });
  return media ? media.dataValues : null;
};

