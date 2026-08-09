const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    const existingAdmin = await Admin.findOne({
        username: "nooradmin"
    });

    if (existingAdmin) {
        console.log("Admin already exists");
        process.exit();
    }

    const hashedPassword = await bcrypt.hash("noor@1982", 10);

    await Admin.create({
        username: "nooradmin",
        password: hashedPassword
    });

    console.log("✅ Admin Created Successfully");

    process.exit();

})
.catch(err => {
    console.log(err);
    process.exit();
});