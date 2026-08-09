const express = require("express");
const router = express.Router();

const {
    uploadSchedule,
    getSchedules,
    getScheduleById,
    deleteSchedule
} = require("../controllers/scheduleController");

const upload = require("../middleware/scheduleUpload");
const protect = require("../middleware/authMiddleware");


// =========================
// PUBLIC
// =========================

router.get("/", getSchedules);

router.get("/:id", getScheduleById);


// =========================
// ADMIN
// =========================

router.post(
    "/",
    protect,
    upload.single("pdf"),
    uploadSchedule
);

router.delete(
    "/:id",
    protect,
    deleteSchedule
);


module.exports = router;