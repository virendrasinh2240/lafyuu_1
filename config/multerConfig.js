const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Dashboard/image",
        allowedFormats: ["jpeg", "png", "jpg"],
        uniqueFilename: true,
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error("Please provide an image (jpg, png, jpeg)"));
        }
        cb(null, true);
    },
});

module.exports = {upload};
