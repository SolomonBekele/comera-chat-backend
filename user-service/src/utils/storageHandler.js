import crypto from "crypto";
import {minioClient}  from "../../../common/config/minioClient.js";

const BUCKET_NAME = "user-profile-pic";

export const uploadProfilePic = async (buffer, originalName) => {
  try {
    // Check if bucket exists
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
      console.log(`Bucket "${BUCKET_NAME}" created`);
    }

    // Generate a unique file name
    const fileExt = originalName.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Upload to MinIO
    await minioClient.putObject(BUCKET_NAME, fileName, buffer);

    // Generate presigned GET URL valid for 1 hour
    // const presignedUrl = await minioClient.presignedGetObject(
    //   BUCKET_NAME,
    //   fileName,
    //   60 * 60 // 1 hour in seconds
    // );
     
    // Return presigned URL to frontend
      return fileName;
  } catch (error) {
    console.error("Error uploading to MinIO:", error);
    throw error;
  }
};

export const getPresignedUrl = async (fileName) => {
  try {
    // Check if bucket exists
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      throw new Error("bucket name not found")
    }
    // Generate presigned GET URL valid for 1 hour
    const presignedUrl = await minioClient.presignedGetObject(
      BUCKET_NAME,
      fileName,
      60 * 60 // 1 hour in seconds
    );
     
    // Return presigned URL to frontend
      return presignedUrl;
  } catch (error) {
    console.error("Error fetching presigned url form MinIO:", error);
    throw error;
  }
};
