const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/gallery");

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

        cb(null, uniqueName);

    }

});

// File filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpg|jpeg|png|webp/;

    const ext = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {

        cb(null, true);

    } else {

        cb(new Error("Only image files are allowed"));

    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});

module.exports = upload;