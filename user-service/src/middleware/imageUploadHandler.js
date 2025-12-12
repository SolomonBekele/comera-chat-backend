import multer from 'multer';

// Use memory storage so the file stays in memory as a Buffer
const storage = multer.memoryStorage();

// File type filter (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: limit file size to 5MB
});

export { upload };