const Schedule = require("../models/Schedule");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const path = require("path");

const uploadToCloudinary = (
    fileBuffer,
    originalName
) => {

    return new Promise((resolve, reject) => {

        const ext =
            path
                .extname(originalName)
                .toLowerCase();

        const name =
            path
                .basename(originalName, ext)
                .replace(
                    /[^a-zA-Z0-9-_]/g,
                    "_"
                );

        const publicId =
            `${name}-${Date.now()}${ext}`;

        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder:
                        "noor-education-society/schedule",

                    public_id:
                        publicId,

                    resource_type:
                        "raw"
                },

                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }
            );

        streamifier
            .createReadStream(fileBuffer)
            .pipe(stream);

    });

};


const uploadSchedule = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message:
                    "Please upload a PDF file"
            });

        }


        const type =
            req.body.type;


        const classNumber =
            type === "class"
                ? Number(req.body.classNumber)
                : null;


        if (
            !["class", "teacher"]
                .includes(type)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid timetable type"
            });

        }


        if (
            type === "class" &&
            (
                !Number.isInteger(
                    classNumber
                ) ||
                classNumber < 5 ||
                classNumber > 10
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please select a valid class"
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


        const result =
            await uploadToCloudinary(
                req.file.buffer,
                req.file.originalname
            );


        if (existing) {

            if (
                existing.pdf &&
                existing.pdf.includes(
                    "res.cloudinary.com"
                )
            ) {

                try {

                    await cloudinary.uploader.destroy(
                        existing.publicId,
                        {
                            resource_type:
                                "raw"
                        }
                    );

                } catch (error) {

                    console.error(
                        "Old Cloudinary file deletion error:",
                        error
                    );

                }

            }


            existing.pdf =
                result.secure_url;

            existing.publicId =
                result.public_id;

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

                pdf:
                    result.secure_url,

                publicId:
                    result.public_id

            });


        return res.status(201).json({
            success: true,
            message:
                "Timetable uploaded successfully",
            data: schedule
        });


    } catch (error) {

        console.error(
            "Schedule upload error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


const getSchedules = async (
    req,
    res
) => {

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
            count:
                schedules.length,
            data:
                schedules
        });


    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


const getScheduleById = async (
    req,
    res
) => {

    try {

        const schedule =
            await Schedule.findById(
                req.params.id
            );


        if (!schedule) {

            return res.status(404).json({
                success: false,
                message:
                    "Timetable not found"
            });

        }


        return res.status(200).json({
            success: true,
            data:
                schedule
        });


    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


const deleteSchedule = async (
    req,
    res
) => {

    try {

        const schedule =
            await Schedule.findById(
                req.params.id
            );


        if (!schedule) {

            return res.status(404).json({
                success: false,
                message:
                    "Timetable not found"
            });

        }


        if (
            schedule.publicId
        ) {

            try {

                await cloudinary.uploader.destroy(
                    schedule.publicId,
                    {
                        resource_type:
                            "raw"
                    }
                );

            } catch (error) {

                console.error(
                    "Cloudinary delete error:",
                    error
                );

            }

        }


        await Schedule.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({
            success: true,
            message:
                "Timetable deleted successfully"
        });


    } catch (error) {

        console.error(
            "Delete schedule error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message
        });

    }

};


module.exports = {
    uploadSchedule,
    getSchedules,
    getScheduleById,
    deleteSchedule
};