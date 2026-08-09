const Gallery = require("../models/Gallery");


// Create Gallery Item
const createGallery = async (req, res) => {

    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);


        const gallery = await Gallery.create({

            title: req.body.title,

            category: req.body.category,

            image: req.file
                ? `/uploads/gallery/${req.file.filename}`
                : ""

        });


        res.status(201).json({

            success: true,

            message: "Gallery item added successfully",

            data: gallery

        });


    } catch (error) {


        res.status(500).json({

            success: false,

            message: error.message

        });


    }

};



// Get All Gallery Items
const getGallery = async (req, res) => {

    try {


        const gallery = await Gallery.find().sort({ date: -1 });


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



// Get Single Gallery Item
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



// Update Gallery Item
const updateGallery = async (req, res) => {

    try {


        const updateData = {


            title: req.body.title,


            category: req.body.category


        };


        if (req.file) {


            updateData.image =
                `/uploads/gallery/${req.file.filename}`;


        }



        const gallery = await Gallery.findByIdAndUpdate(

            req.params.id,

            updateData,

            {

                new: true,

                runValidators: true

            }

        );



        if (!gallery) {


            return res.status(404).json({

                success: false,

                message: "Gallery item not found"

            });


        }



        res.status(200).json({

            success: true,

            message: "Gallery updated successfully",

            data: gallery

        });



    } catch (error) {


        res.status(500).json({

            success: false,

            message: error.message

        });


    }

};



// Delete Gallery Item
const deleteGallery = async (req, res) => {

    try {


        const gallery = await Gallery.findByIdAndDelete(req.params.id);



        if (!gallery) {


            return res.status(404).json({

                success: false,

                message: "Gallery item not found"

            });


        }



        res.status(200).json({

            success: true,

            message: "Gallery deleted successfully"

        });



    } catch (error) {


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