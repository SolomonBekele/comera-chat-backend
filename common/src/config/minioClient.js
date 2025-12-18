import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_HOST,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Test MinIO connection
minioClient.listBuckets((err, buckets) => {
  if (err) {
    console.error("❌ MinIO connection failed:", err.message);
  } else {
    console.log("✅ MinIO connected successfully. Buckets:", buckets.map(b => b.name));
  }
});