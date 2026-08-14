const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const extension =
        path
            .extname(file.originalname)
            .toLowerCase();

    if (
        file.mimetype === "application/pdf" &&
        extension === ".pdf"
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF files are allowed"
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;