// media-service/src/grpc/server.js
import 'dotenv/config';
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js"; // optional logger
import { createMediaService, updateMediaByIdService } from '../services/mediaService.js';

const PROTO_PATH = path.resolve("./src/grpc/protos/media.proto");

// Load proto
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const mediaPackage = grpcObject.media;

// Implement uploadMedia RPC
const uploadMedia = async (call, callback) => {
  logger.info("uploadMedia grpc hit...");
  try {
    const { file, fileName, fileType,fileSize } = call.request;

    if (!file || !fileName || !fileType || !fileSize ) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "File , file name, file type and file size are required",
      });
    }

    const media = await createMediaService(file,fileName,fileType,fileSize)
    const media_id = media?.id;
    logger.info(`Uploaded media: ${media_id}`);
    callback(null, { media_id });
  } catch (error) {
    console.error("gRPC uploadMedia error:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: "Internal server error",
    });
  }
};

// Implement updateMedia RPC
const updateMedia = async (call, callback) => {
  logger.info("updateMedia grpc hit...");
  try {
    const { media_id, file, fileName, fileType ,fileSize} = call.request;

    if (!media_id,!file || !fileName || !fileType || !fileSize ) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "media_id ,File , file name, file type and file size are required",
      });
    }

    const media = await updateMediaByIdService(media_id, file,fileName,fileType,fileSize)
    const newMediaId = media.id;
    callback(null, { newMediaId });
  } catch (error) {
    console.error("gRPC updateMedia error:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: "Internal server error",
    });
  }
};

// Create and start server
const server = new grpc.Server();
server.addService(mediaPackage.MediaService.service, { uploadMedia, updateMedia });

const PORT = "0.0.0.0:50053"; 
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) throw err;
  console.log(`Media Service gRPC server running at ${PORT}`);
  server.start();
});
