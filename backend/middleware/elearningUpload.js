const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/elearning");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const name = path
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9-_]/g, "_");

        cb(
            null,
            `${name}-${Date.now()}${ext}`
        );
    }
});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".xls",
        ".xlsx"
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (
        allowedTypes.includes(file.mimetype) &&
        allowedExtensions.includes(ext)
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, Word, PowerPoint and Excel files are allowed."
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

module.exports = upload;