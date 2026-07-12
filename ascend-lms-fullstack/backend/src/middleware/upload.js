const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

const makeStorage = (subfolder) => {
  const dest = path.join(__dirname, '../uploads', subfolder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });
};

const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed (jpg, jpeg, png, webp, gif)'));
  }
};

const documentFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.zip', '.jpg', '.jpeg', '.png', '.txt'];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'File type not allowed'));
  }
};

const uploadProfileImage = multer({
  storage: makeStorage('profiles'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

const uploadThumbnail = multer({
  storage: makeStorage('thumbnails'),
  fileFilter: imageFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});

const uploadAssignmentFile = multer({
  storage: makeStorage('assignments'),
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { uploadProfileImage, uploadThumbnail, uploadAssignmentFile };
