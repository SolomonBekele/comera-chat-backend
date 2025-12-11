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
      name: "Carrol White",
      profile_picture:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      status: "AVAILABLE",
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
      name: "Anaf Mezgebu",
      profile_picture: null,
      status: "BUZY",
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
      name: "Mohammed Joshi",
      profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      status: "DO_NOT_DISTURB",
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
      name: "Selamawit Desta",
      profile_picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      status: "AVAILABLE",
      last_seen: now,
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
      name: "Fikir Yared",
      profile_picture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      status: "AVAILABLE",
      last_seen: now,
      language: "AMHARIC",
      created_at: now,
      updated_at: now,
    },
  ];

  await queryInterface.bulkInsert("user", users);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("user", null, {});
}
