const Elearning = require("../models/Elearning");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const path = require("path");

const allowedCategories = [
    "Notes",
    "Assignment",
    "Question Paper",
    "Syllabus"
];

const uploadToCloudinary = (
    fileBuffer,
    originalName,
    mimetype
) => {
    return new Promise((resolve, reject) => {
        const ext = path
            .extname(originalName)
            .toLowerCase();

        const name = path
            .basename(originalName, ext)
            .replace(/[^a-zA-Z0-9-_]/g, "_");

        let resourceType = "raw";

        if (mimetype.startsWith("video/")) {
            resourceType = "video";
        }

        const publicId =
            `${name}-${Date.now()}${ext}`;

        const stream =
            cloudinary.uploader.upload_stream(
                {
                    folder:
                        "noor-education-society/elearning",
                    public_id: publicId,
                    resource_type: resourceType
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            ...result,
                            resourceType
                        });
                    }
                }
            );

        streamifier
            .createReadStream(fileBuffer)
            .pipe(stream);
    });
};

const createMaterial = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const title = req.body.title?.trim();

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const classNumber =
            Number(req.body.classNumber);

        if (
            !Number.isInteger(classNumber) ||
            classNumber < 5 ||
            classNumber > 12
        ) {
            return res.status(400).json({
                success: false,
                message: "Class must be between 5 and 12"
            });
        }

        if (
            !allowedCategories.includes(
                req.body.category
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        const result =
            await uploadToCloudinary(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

        const material =
            await Elearning.create({
                title,
                classNumber,
                category: req.body.category,
                file: result.secure_url,
                publicId: result.public_id,
                resourceType: result.resourceType,
                description:
                    req.body.description?.trim() || ""
            });

        res.status(201).json({
            success: true,
            message:
                "E-Learning content added successfully",
            data: material
        });
    } catch (error) {
        console.error(
            "Create material error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMaterials = async (req, res) => {
    try {
        const filter = {};

        if (req.query.classNumber) {
            const classNumber =
                Number(req.query.classNumber);

            if (
                Number.isInteger(classNumber) &&
                classNumber >= 5 &&
                classNumber <= 12
            ) {
                filter.classNumber = classNumber;
            }
        }

        if (req.query.category) {
            if (
                allowedCategories.includes(
                    req.query.category
                )
            ) {
                filter.category =
                    req.query.category;
            }
        }

        const materials =
            await Elearning
                .find(filter)
                .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: materials.length,
            data: materials
        });
    } catch (error) {
        console.error(
            "Get materials error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMaterialById = async (req, res) => {
    try {
        const material =
            await Elearning.findById(
                req.params.id
            );

        if (!material) {
            return res.status(404).json({
                success: false,
                message:
                    "E-Learning content not found"
            });
        }

        res.status(200).json({
            success: true,
            data: material
        });
    } catch (error) {
        console.error(
            "Get material error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateMaterial = async (req, res) => {
    try {
        const material =
            await Elearning.findById(
                req.params.id
            );

        if (!material) {
            return res.status(404).json({
                success: false,
                message:
                    "E-Learning content not found"
            });
        }

        if (req.body.title !== undefined) {
            const title =
                req.body.title.trim();

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Title is required"
                });
            }

            material.title = title;
        }

        if (
            req.body.classNumber !== undefined
        ) {
            const classNumber =
                Number(req.body.classNumber);

            if (
                !Number.isInteger(classNumber) ||
                classNumber < 5 ||
                classNumber > 12
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Class must be between 5 and 12"
                });
            }

            material.classNumber =
                classNumber;
        }

        if (req.body.category !== undefined) {
            if (
                !allowedCategories.includes(
                    req.body.category
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid category"
                });
            }

            material.category =
                req.body.category;
        }

        if (
            req.body.description !== undefined
        ) {
            material.description =
                req.body.description.trim();
        }

        if (req.file) {
            if (material.publicId) {
                await cloudinary.uploader.destroy(
                    material.publicId,
                    {
                        resource_type:
                            material.resourceType ||
                            "raw"
                    }
                );
            }

            const result =
                await uploadToCloudinary(
                    req.file.buffer,
                    req.file.originalname,
                    req.file.mimetype
                );

            material.file =
                result.secure_url;

            material.publicId =
                result.public_id;

            material.resourceType =
                result.resourceType;
        }

        await material.save();

        res.status(200).json({
            success: true,
            message:
                "E-Learning content updated successfully",
            data: material
        });
    } catch (error) {
        console.error(
            "Update material error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const material =
            await Elearning.findById(
                req.params.id
            );

        if (!material) {
            return res.status(404).json({
                success: false,
                message:
                    "E-Learning content not found"
            });
        }

        if (material.publicId) {
            await cloudinary.uploader.destroy(
                material.publicId,
                {
                    resource_type:
                        material.resourceType ||
                        "raw"
                }
            );
        }

        await Elearning.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "E-Learning material deleted successfully"
        });
    } catch (error) {
        console.error(
            "Delete material error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createMaterial,
    getMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial
};