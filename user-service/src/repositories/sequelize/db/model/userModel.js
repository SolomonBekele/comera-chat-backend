import { DataTypes } from 'sequelize';
import sequelize from "../../config/sequelize.js";

const User = sequelize.define('User', {
  id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
   },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, 
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: DataTypes.STRING,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED'),
    defaultValue: 'ACTIVE',
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: true, 
  },
  language: {
    type: DataTypes.ENUM('ENGLISH', 'AMHARIC', 'ARABIC'),
    defaultValue: 'ENGLISH',
  }
}, {
  tableName: 'user',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at', 
});

export default User;
