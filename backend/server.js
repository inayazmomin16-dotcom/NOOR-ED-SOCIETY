const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const noticeRoutes = require("./routes/noticeRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const elearningRoutes = require("./routes/elearningRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

console.log("Cloudinary config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING"
});

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

console.log(
    "Uploads folder:",
    path.join(__dirname, "uploads")
);

app.use(
    "/api/notices",
    noticeRoutes
);

app.use(
    "/api/gallery",
    galleryRoutes
);

app.use(
    "/api/elearning",
    elearningRoutes
);

app.use(
    "/api/schedule",
    scheduleRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.get("/", (req, res) => {
    res.send(
        "Noor Education Society Backend Running 🚀"
    );
});

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
});