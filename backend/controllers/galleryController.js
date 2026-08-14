const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


// ===============================
// Upload image to Cloudinary
// ===============================
const uploadToCloudinary = (fileBuffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                folder: "noor-education-society/gallery",
                resource_type: "image"
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


// ===============================
// CREATE GALLERY
// ===============================
const createGallery = async (req, res) => {

    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Image file is required"

            });

        }


        // Upload image to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);


        console.log("CLOUDINARY RESULT:", result);
        console.log("CLOUDINARY URL:", result.secure_url);

        // Save Cloudinary URL in MongoDB
        const gallery = await Gallery.create({

            title: req.body.title,

            category: req.body.category,

            image: result.secure_url,

            publicId: result.public_id

        });


        res.status(201).json({

            success: true,

            message: "Gallery item added successfully",

            data: gallery

        });


    } catch (error) {

        console.error("Gallery upload error:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===============================
// GET ALL GALLERY
// ===============================
const getGallery = async (req, res) => {

    try {

        const gallery = await Gallery
            .find()
            .sort({ date: -1 });


        res.status(200).json({

            success: true,

            count: gallery.length,

            data: gallery

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===============================
// GET GALLERY BY ID
// ===============================
const getGalleryById = async (req, res) => {

    try {

        const gallery = await Gallery.findById(req.params.id);


        if (!gallery) {

            return res.status(404).json({

                success: false,

                message: "Gallery item not found"

            });

        }


        res.status(200).json({

            success: true,

            data: gallery

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===============================
// UPDATE GALLERY
// ===============================
const updateGallery = async (req, res) => {

    try {

        const gallery = await Gallery.findById(req.params.id);


        if (!gallery) {

            return res.status(404).json({

                success: false,

                message: "Gallery item not found"

            });

        }


        // Update text fields
        gallery.title = req.body.title;

        gallery.category = req.body.category;


        // If a new image was uploaded
        if (req.file) {

            // Delete old Cloudinary image
            if (gallery.publicId) {

                await cloudinary.uploader.destroy(
                    gallery.publicId
                );

            }


            // Upload new image
            const result = await uploadToCloudinary(
                req.file.buffer
            );


            gallery.image = result.secure_url;

            gallery.publicId = result.public_id;

        }


        await gallery.save();


        res.status(200).json({

            success: true,

            message: "Gallery updated successfully",

            data: gallery

        });


    } catch (error) {

        console.error("Gallery update error:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===============================
// DELETE GALLERY
// ===============================
const deleteGallery = async (req, res) => {

    try {

        const gallery = await Gallery.findById(
            req.params.id
        );


        if (!gallery) {

            return res.status(404).json({

                success: false,

                message: "Gallery item not found"

            });

        }


        // Delete image from Cloudinary
        if (gallery.publicId) {

            await cloudinary.uploader.destroy(
                gallery.publicId
            );

        }


        // Delete MongoDB record
        await Gallery.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,

            message: "Gallery deleted successfully"

        });


    } catch (error) {

        console.error("Gallery delete error:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

    createGallery,

    getGallery,

    getGalleryById,

    updateGallery,

    deleteGallery

};