
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.resolve("./src/grpc/protos/user.proto");

// Load proto
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

// Create client (replace host:port with user-service)
export const userClient = new userPackage.UserService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
