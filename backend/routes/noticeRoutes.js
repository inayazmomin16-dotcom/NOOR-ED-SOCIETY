const express = require("express");
const router = express.Router();

const {
    createNotice,
    getNotices,
    updateNotice,
    deleteNotice
} = require("../controllers/noticecontroller");

const protect = require("../middleware/authMiddleware");


// =========================
// PUBLIC
// =========================

router.get("/", getNotices);


// =========================
// ADMIN
// =========================

router.post("/", protect, createNotice);

router.put("/:id", protect, updateNotice);

router.delete("/:id", protect, deleteNotice);


module.exports = router;