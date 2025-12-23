import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

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

// Create gRPC client
export const mediaClient = new mediaPackage.MediaService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

// Example usage
// mediaClient.uploadMedia(
//   { file: Buffer.from("hello world") },
//   (err, response) => {
//     if (err) console.error(err);
//     else console.log("Media ID:", response.media_id);
//   }
// );
