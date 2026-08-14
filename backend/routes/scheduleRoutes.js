const express = require("express");

const {
    uploadSchedule,
    getSchedules,
    getScheduleById,
    deleteSchedule
} = require("../controllers/scheduleController");

const upload = require("../middleware/scheduleUpload");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    upload.single("pdf"),
    uploadSchedule
);

router.get(
    "/",
    getSchedules
);

router.get(
    "/:id",
    getScheduleById
);

router.put(
    "/:id",
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