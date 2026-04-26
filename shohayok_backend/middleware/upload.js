const multer = require("multer");

// 🔥 TEMP STORAGE (memory)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;