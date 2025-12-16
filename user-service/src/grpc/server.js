// user-service/src/grpc/server.js
import 'dotenv/config'
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { getUserByIdService } from '../services/userService.js';
import logger from '../utils/logger.js';


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

// Implement GetUserById RPC
const getUserById = async (call, callback) => {
    logger.info("get user by id grpc hit...");
  try {
    const { user_id } = call.request;
    const user = await getUserByIdService(user_id)
      
    if (!user) {
      return callback(null, { 
        user_id: "", 
        name: "", 
        username: "", 
        phoneNumber: "", 
        email: "", 
        profile_pic: "", 
        lastSeen: "", 
        success: false 
    });
    }

    callback(null, {
      user_id: user.id,
      name:user.name,
      username: user.username || null,
      phoneNumber:user.phone_number,
      email: user.email,
      profile_pic: user.profile_picture || "",
      lastSeen: user.last_seen,
      success: true,
    });
  } catch (error) {
    console.error("gRPC GetUserById error:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: "Internal server error",
    });
  }
};

// Create and start server
const server = new grpc.Server();
server.addService(userPackage.UserService.service, { GetUserById: getUserById });

const PORT = "0.0.0.0:50052"; // user-service port
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) throw err;
  console.log(`User Service gRPC server running at ${PORT}`);
  server.start();
});
