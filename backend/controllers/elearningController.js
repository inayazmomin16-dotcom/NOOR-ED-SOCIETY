const ELearning = require("../models/ELearning");
const fs = require("fs");
const path = require("path");

/* =====================================================
   UPLOAD DIRECTORY
===================================================== */

const uploadDirectory = path.join(
    __dirname,
    "../uploads/elearning"
);


/* =====================================================
   DELETE FILE SAFELY
===================================================== */

function deleteFile(filePath) {

    if (!filePath) {
        return;
    }

    const cleanPath =
        filePath.startsWith("/")
            ? filePath.substring(1)
            : filePath;

    const fullPath =
        path.join(__dirname, "..", cleanPath);

    try {

        if (fs.existsSync(fullPath)) {

            fs.unlinkSync(fullPath);

            console.log(
                "Deleted file:",
                fullPath
            );

        }

    } catch (error) {

        console.error(
            "File deletion error:",
            error.message
        );

    }

}


/* =====================================================
   CREATE MATERIAL
===================================================== */

const createMaterial = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Please upload a file"

            });

        }


        const classNumber =
            Number(req.body.classNumber);


        if (
            !classNumber ||
            classNumber < 5 ||
            classNumber > 12
        ) {

            deleteFile(
                `/uploads/elearning/${req.file.filename}`
            );

            return res.status(400).json({

                success: false,

                message:
                    "Class must be between 5 and 12"

            });

        }


        const allowedCategories = [

            "Notes",
            "Assignment",
            "Question Paper",
            "Syllabus"

        ];


        if (
            !allowedCategories.includes(
                req.body.category
            )
        ) {

            deleteFile(
                `/uploads/elearning/${req.file.filename}`
            );

            return res.status(400).json({

                success: false,

                message: "Invalid category"

            });

        }


        const material =
            await ELearning.create({

                title:
                    req.body.title?.trim(),

                classNumber:

                    classNumber,

                category:
                    req.body.category,

                file:
                    `/uploads/elearning/${req.file.filename}`,

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

        if (req.file) {

            deleteFile(
                `/uploads/elearning/${req.file.filename}`
            );

        }


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


/* =====================================================
   GET ALL MATERIALS
===================================================== */

const getMaterials = async (req, res) => {

    try {

        const filter = {};


        /* Class filter */

        if (req.query.classNumber) {

            const classNumber =
                Number(req.query.classNumber);


            if (
                classNumber >= 5 &&
                classNumber <= 12
            ) {

                filter.classNumber =
                    classNumber;

            }

        }


        /* Category filter */

        if (req.query.category) {

            filter.category =
                req.query.category;

        }


        const materials =
            await ELearning
                .find(filter)
                .sort({
                    date: -1
                });


        res.status(200).json({

            success: true,

            count:
                materials.length,

            data:
                materials

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


/* =====================================================
   GET MATERIAL BY ID
===================================================== */

const getMaterialById = async (req, res) => {

    try {

        const material =
            await ELearning.findById(
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

            data:
                material

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


/* =====================================================
   UPDATE MATERIAL
===================================================== */

const updateMaterial = async (req, res) => {

    try {

        const material =
            await ELearning.findById(
                req.params.id
            );


        if (!material) {

            if (req.file) {

                deleteFile(
                    `/uploads/elearning/${req.file.filename}`
                );

            }


            return res.status(404).json({

                success: false,

                message:
                    "E-Learning content not found"

            });

        }


        /* Update text fields */

        if (req.body.title !== undefined) {

            material.title =
                req.body.title.trim();

        }


        if (
            req.body.classNumber !== undefined
        ) {

            const classNumber =
                Number(
                    req.body.classNumber
                );


            if (
                classNumber < 5 ||
                classNumber > 12
            ) {

                if (req.file) {

                    deleteFile(
                        `/uploads/elearning/${req.file.filename}`
                    );

                }


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

            material.category =
                req.body.category;

        }


        if (
            req.body.description !== undefined
        ) {

            material.description =
                req.body.description.trim();

        }


        /* Replace file */

        if (req.file) {

            const oldFile =
                material.file;


            material.file =
                `/uploads/elearning/${req.file.filename}`;


            /*
             * Save new material first.
             * Then delete old file.
             */

            await material.save();


            if (oldFile) {

                deleteFile(oldFile);

            }


        } else {

            await material.save();

        }


        res.status(200).json({

            success: true,

            message:
                "E-Learning content updated successfully",

            data:
                material

        });


    } catch (error) {

        if (req.file) {

            deleteFile(
                `/uploads/elearning/${req.file.filename}`
            );

        }


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


/* =====================================================
   DELETE MATERIAL
===================================================== */

const deleteMaterial = async (req, res) => {

    try {

        const material =
            await ELearning.findById(
                req.params.id
            );


        if (!material) {

            return res.status(404).json({

                success: false,

                message:
                    "E-Learning content not found"

            });

        }


        const fileToDelete =
            material.file;


        await ELearning.findByIdAndDelete(
            req.params.id
        );


        /* Delete uploaded PDF/file */

        if (fileToDelete) {

            deleteFile(
                fileToDelete
            );

        }


        res.status(200).json({

            success: true,

            message:
                "E-Learning content deleted successfully"

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


/* =====================================================
   EXPORT
===================================================== */

module.exports = {

    createMaterial,

    getMaterials,

    getMaterialById,

    updateMaterial,

    deleteMaterial

};