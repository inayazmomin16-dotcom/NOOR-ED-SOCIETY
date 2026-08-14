const express = require("express");
const router = express.Router();

const {
    createMaterial,
    getMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial
} = require("../controllers/elearningController");

const upload = require("../middleware/elearningUpload");
const protect = require("../middleware/authMiddleware");

router.post(
    "/",
    protect,
    upload.single("file"),
    createMaterial
);

router.get(
    "/",
    getMaterials
);

router.get(
    "/:id",
    getMaterialById
);

router.put(
    "/:id",
    protect,
    upload.single("file"),
    updateMaterial
);

router.delete(
    "/:id",
    protect,
    deleteMaterial
);

module.exports = router;
