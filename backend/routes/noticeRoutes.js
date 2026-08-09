const express = require("express");
const router = express.Router();

const {
    createNotice,
    getNotices,
    updateNotice,
    deleteNotice
} = require("../controllers/noticeController");

// Create Notice
router.post("/", createNotice);

// Get All Notices
router.get("/", getNotices);

// Update Notice
router.put("/:id", updateNotice);

// Delete Notice
router.delete("/:id", deleteNotice);

module.exports = router;