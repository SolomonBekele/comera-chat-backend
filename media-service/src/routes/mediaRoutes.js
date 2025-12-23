import express from "express";

import {
  getMediaByFileName,
  getMediaByFileType,
  getMediaByFileNameOrType,
  createMedia,
  getAllMedia,
  updateMediaById,
  deleteMediaById,
  getMediaUrlById,
} from "../controllers/mediaController.js";

import {
  validateCreateMedia,
  validateUpdateMedia,
  validateMediaId,
} from "../middleware/mediaInputValidation.js";

const router = express.Router();

/**
 * Public routes
 */
router.get("/", getAllMedia);
router.get("/:id", validateMediaId, getMediaUrlById);
router.get("/file/:fileName", getMediaByFileName);
router.get("/type/:fileType", getMediaByFileType);
router.get("/search", getMediaByFileNameOrType);

/**
 * Protected routes
 */
router.post("/",  validateCreateMedia, createMedia);
router.put("/:id",  validateUpdateMedia, updateMediaById);
router.delete("/:id",  validateMediaId, deleteMediaById);

export default router;
