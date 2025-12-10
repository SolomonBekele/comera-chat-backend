"use strict";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  const users = [
    {
      id: uuidv4(),
      phone_number: "0911111111",
      email: "admin@example.com",
      username: "admin",
      password: await bcrypt.hash("Admin@123", 10),
      name: "System Admin",
      profile_picture: null,
      status: "ACTIVE",
      last_seen: now,
      language: "ENGLISH",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      phone_number: "0922222222",
      email: "user1@example.com",
      username: "user1",
      password: await bcrypt.hash("User1@123", 10),
      name: "User One",
      profile_picture: null,
      status: "ACTIVE",
      last_seen: now,
      language: "AMHARIC",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      phone_number: "0933333333",
      email: "user2@example.com",
      username: "user2",
      password: await bcrypt.hash("User2@123", 10),
      name: "User Two",
      profile_picture: null,
      status: "ACTIVE",
      last_seen: now,
      language: "ARABIC",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      phone_number: "0944444444",
      email: "user3@example.com",
      username: "user3",
      password: await bcrypt.hash("User3@123", 10),
      name: "User Three",
      profile_picture: null,
      status: "INACTIVE",
      last_seen: null,
      language: "ENGLISH",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      phone_number: "0955555555",
      email: "user4@example.com",
      username: "user4",
      password: await bcrypt.hash("User4@123", 10),
      name: "User Four",
      profile_picture: null,
      status: "BANNED",
      last_seen: null,
      language: "AMHARIC",
      created_at: now,
      updated_at: now,
    }
  ];

  await queryInterface.bulkInsert("user", users);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("user", null, {});
}
