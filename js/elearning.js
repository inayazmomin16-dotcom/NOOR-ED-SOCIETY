const videoBtn = document.getElementById("videoBtn");
const studyBtn = document.getElementById("studyBtn");

const videoSection = document.getElementById("videoSection");
const studySection = document.getElementById("studySection");

videoBtn.addEventListener("click", () => {

    videoBtn.classList.add("active");
    studyBtn.classList.remove("active");

    videoSection.style.display = "block";
    studySection.style.display = "none";

});

studyBtn.addEventListener("click", () => {

    studyBtn.classList.add("active");
    videoBtn.classList.remove("active");

    studySection.style.display = "block";
    videoSection.style.display = "none";

});

document.getElementById("videoClassFilter").addEventListener("change", function () {

    console.log("Selected Video Class:", this.value);

});

document.getElementById("studyClassFilter").addEventListener("change", function () {

    console.log("Selected Study Class:", this.value);

});

const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("show");

    if (mobileMenu.classList.contains("show")) {

        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");

    } else {

        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");

    }

});

document.addEventListener("click", (e) => {

    if (
        !menuBtn.contains(e.target) &&
        !mobileMenu.contains(e.target)
    ) {

        mobileMenu.classList.remove("show");

        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");

    }

});