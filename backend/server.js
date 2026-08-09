const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const noticeRoutes = require("./routes/noticeRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const elearningRoutes = require("./routes/elearningRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();


// =========================
// DATABASE
// =========================

connectDB();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =========================
// UPLOADS
// =========================

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


// =========================
// API ROUTES
// =========================

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


// =========================
// HOME
// =========================

app.get("/", (req, res) => {

    res.send(
        "Noor Education Society Backend Running 🚀"
    );

});


// =========================
// SERVER
// =========================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
});