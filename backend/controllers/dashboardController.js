const Notice = require("../models/Notice");
const Gallery = require("../models/Gallery");
const ELearning = require("../models/ELearning");
const Schedule = require("../models/Schedule");

const getDashboardStats = async (req, res) => {
    try {

        const noticeCount = await Notice.countDocuments();

        const galleryCount = await Gallery.countDocuments();

        const materialCount = await ELearning.countDocuments();

        const scheduleCount = await Schedule.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                noticeCount,
                galleryCount,
                materialCount,
                scheduleCount
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboardStats
};