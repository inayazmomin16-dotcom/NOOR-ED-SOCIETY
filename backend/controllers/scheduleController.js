const Schedule = require("../models/Schedule");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(
    __dirname,
    "../uploads/schedule"
);

const uploadSchedule = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file"
            });
        }

        const type = req.body.type;

        const classNumber =
            type === "class"
                ? Number(req.body.classNumber)
                : null;

        if (!["class", "teacher"].includes(type)) {
            fs.unlinkSync(
                path.join(
                    uploadDir,
                    req.file.filename
                )
            );

            return res.status(400).json({
                success: false,
                message: "Invalid timetable type"
            });
        }

        if (
            type === "class" &&
            (
                !classNumber ||
                classNumber < 5 ||
                classNumber > 10
            )
        ) {
            fs.unlinkSync(
                path.join(
                    uploadDir,
                    req.file.filename
                )
            );

            return res.status(400).json({
                success: false,
                message: "Please select a valid class"
            });
        }

        const filter =
            type === "class"
                ? {
                    type: "class",
                    classNumber
                }
                : {
                    type: "teacher"
                };

        const existing =
            await Schedule.findOne(filter);

        if (existing && existing.pdf) {
            const oldPath =
                path.join(
                    __dirname,
                    "..",
                    existing.pdf
                );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        const pdfPath =
            `/uploads/schedule/${req.file.filename}`;

        if (existing) {
            existing.pdf = pdfPath;

            await existing.save();

            return res.status(200).json({
                success: true,
                message:
                    "Timetable replaced successfully",
                data: existing
            });
        }

        const schedule =
            await Schedule.create({
                type,
                classNumber,
                pdf: pdfPath
            });

        return res.status(201).json({
            success: true,
            message:
                "Timetable uploaded successfully",
            data: schedule
        });

    } catch (error) {

        if (req.file) {
            const filePath =
                path.join(
                    uploadDir,
                    req.file.filename
                );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        console.error(
            "Schedule upload error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSchedules = async (req, res) => {
    try {

        const schedules =
            await Schedule
                .find()
                .sort({
                    type: 1,
                    classNumber: 1
                });

        return res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getScheduleById = async (req, res) => {
    try {

        const schedule =
            await Schedule.findById(
                req.params.id
            );

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Timetable not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: schedule
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteSchedule = async (req, res) => {
    try {

        const schedule =
            await Schedule.findByIdAndDelete(
                req.params.id
            );

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Timetable not found"
            });
        }

        if (schedule.pdf) {

            const filePath =
                path.join(
                    __dirname,
                    "..",
                    schedule.pdf
                );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return res.status(200).json({
            success: true,
            message:
                "Timetable deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadSchedule,
    getSchedules,
    getScheduleById,
    deleteSchedule
};