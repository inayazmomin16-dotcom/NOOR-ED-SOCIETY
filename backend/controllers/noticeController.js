const Notice = require("../models/Notice");

// Create Notice
const createNotice = async (req, res) => {
    try {
        const notice = await Notice.create(req.body);

        res.status(201).json({
            success: true,
            message: "Notice created successfully",
            data: notice
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Notices
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: notices.length,
            data: notices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Notice
const updateNotice = async (req, res) => {
    try {

        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notice updated successfully",
            data: notice
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Notice
const deleteNotice = async (req, res) => {
    try {

        const notice = await Notice.findByIdAndDelete(req.params.id);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notice deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createNotice,
    getNotices,
    updateNotice,
    deleteNotice
};