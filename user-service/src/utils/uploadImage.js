
import crypto from "crypto";
import {minioClient} from "../config/minioClient.js";

const BUCKET_NAME = "user-profile-pic";

export const uploadProfilePic= async (buffer, originalName) =>{
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

    // Return URL
    return `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error("Error uploading to MinIO:", error);
    throw error;
  }
}


