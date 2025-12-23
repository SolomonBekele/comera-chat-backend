
import { DataTypes } from 'sequelize';
import sequelize from "../../config/sequelize.js";

const MediaModel = sequelize.define('Media', {
  id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
   },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalFileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  minioFileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'media',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at', 
});

export default MediaModel;