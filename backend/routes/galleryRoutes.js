const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    createGallery,
    getGallery,
    getGalleryById,
    updateGallery,
    deleteGallery
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");


// =========================
// PUBLIC
// =========================

router.get("/", getGallery);

router.get("/:id", getGalleryById);


// =========================
// ADMIN
// =========================

router.post(
    "/",
    protect,
    upload.single("image"),
    createGallery
);

router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateGallery
);

router.delete(
    "/:id",
    protect,
    deleteGallery
);


module.exports = router;