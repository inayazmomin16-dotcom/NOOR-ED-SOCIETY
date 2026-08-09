const API = "https://noor-ed-society-backend.onrender.com/api/elearning";
/* =====================================================
   ELEMENTS
===================================================== */

const videoBtn = document.getElementById("videoBtn");
const studyBtn = document.getElementById("studyBtn");

const videoSection = document.getElementById("videoSection");
const studySection = document.getElementById("studySection");

const videoContainer =
    document.getElementById("videoContainer");

const studyContainer =
    document.getElementById("studyContainer");

const videoClassFilter =
    document.getElementById("videoClassFilter");

const studyClassFilter =
    document.getElementById("studyClassFilter");


/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {

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

}


/* =====================================================
   ACTIVE MOBILE MENU
===================================================== */

const currentPage =
    window.location.pathname.split("/").pop();

document.querySelectorAll(".mobile-menu a").forEach(link => {

    const href = link.getAttribute("href");

    if (href === currentPage) {

        link.style.background = "#F8D35F";
        link.style.color = "#102B72";

    }

});


/* =====================================================
   TAB SWITCHING
===================================================== */

if (videoBtn && studyBtn) {

    videoBtn.addEventListener("click", () => {

        videoBtn.classList.add("active");
        studyBtn.classList.remove("active");

        if (videoSection) {
            videoSection.style.display = "block";
        }

        if (studySection) {
            studySection.style.display = "none";
        }

        loadVideos();

    });


    studyBtn.addEventListener("click", () => {

        studyBtn.classList.add("active");
        videoBtn.classList.remove("active");

        if (studySection) {
            studySection.style.display = "block";
        }

        if (videoSection) {
            videoSection.style.display = "none";
        }

        loadStudyMaterials();

    });

}


/* =====================================================
   FILE URL
===================================================== */

function getFileUrl(filePath) {

    if (!filePath) {
        return "#";
    }

    filePath = String(filePath).trim();

    /* Already complete URL */

    if (
        filePath.startsWith("http://") ||
        filePath.startsWith("https://")
    ) {

        return filePath;

    }

  if (filePath.startsWith("/")) {
    return `https://noor-ed-society-backend.onrender.com${filePath}`;
}

return `https://noor-ed-society-backend.onrender.com/${filePath}`;

}
/* =====================================================
   LOAD ALL E-LEARNING MATERIALS
===================================================== */

async function loadStudyMaterials() {

    if (!studyContainer) return;

    studyContainer.innerHTML = `
        <div class="loading">
            Loading study material...
        </div>
    `;

    try {

        const response =
            await fetch(API);

        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }

        const result =
            await response.json();

        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {

            throw new Error(
                "Invalid E-Learning response"
            );

        }

        renderStudyMaterials(result.data);

    } catch (error) {

        console.error(
            "E-Learning loading error:",
            error
        );

        studyContainer.innerHTML = `
            <div class="loading">

                Unable to load study material.

                <br><br>

                Please try again later.

            </div>
        `;

    }

}


/* =====================================================
   RENDER STUDY MATERIAL
===================================================== */

function renderStudyMaterials(materials) {

    if (!studyContainer) return;

    studyContainer.innerHTML = "";

    /* Filter */

    const selectedClass =
        studyClassFilter
            ? studyClassFilter.value
            : "all";


    let filteredMaterials = materials;


    if (selectedClass !== "all") {

        filteredMaterials =
            materials.filter(material => {

                return String(
                    material.classNumber
                ) === String(selectedClass);

            });

    }


    /* No material */

    if (filteredMaterials.length === 0) {

        studyContainer.innerHTML = `

            <div class="loading">

                No study material found
                for the selected class.

            </div>

        `;

        return;

    }


    /* Create cards */

    filteredMaterials.forEach(material => {

        const card =
            document.createElement("div");

        card.className = "book-card";


        /* =================================================
           IMPORTANT:
           Your database field is classNumber
        ================================================= */

        const classNumber =
            material.classNumber !== undefined &&
            material.classNumber !== null
                ? material.classNumber
                : "N/A";


        const title =
            escapeHTML(
                material.title || "Untitled Material"
            );


        const category =
            escapeHTML(
                material.category || "Study Material"
            );


        const description =
            escapeHTML(
                material.description ||
                "Study material for students."
            );


        const fileUrl =
            getFileUrl(material.file);


        /* Choose icon */

        let icon =
            "fa-file-pdf";


        if (
            category.toLowerCase() ===
            "assignment"
        ) {

            icon = "fa-file-pen";

        }

        else if (
            category.toLowerCase() ===
            "question paper"
        ) {

            icon = "fa-file-lines";

        }

        else if (
            category.toLowerCase() ===
            "syllabus"
        ) {

            icon = "fa-book";

        }


        card.innerHTML = `

            <div class="book-icon">

                <i class="fa-solid ${icon}"></i>

            </div>


            <div class="book-content">

                <h3>

                    ${title}

                </h3>


                <div class="book-meta">

                    <span>

                        <i class="fa-solid fa-graduation-cap"></i>

                        Class ${escapeHTML(
                            classNumber
                        )}

                    </span>


                    <span>

                        <i class="fa-solid fa-book"></i>

                        ${category}

                    </span>

                </div>


                <p>

                    ${description}

                </p>


                <div class="book-actions">

                    <a
                        href="${escapeAttribute(fileUrl)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="download-btn"
                    >

                        <i class="fa-solid fa-eye"></i>

                        View

                    </a>


                    <a
                        href="${escapeAttribute(fileUrl)}"
                        download
                        class="download-btn"
                    >

                        <i class="fa-solid fa-download"></i>

                        Download

                    </a>

                </div>

            </div>

        `;


        studyContainer.appendChild(card);

    });

}


/* =====================================================
   VIDEO LECTURES
===================================================== */

async function loadVideos() {

    if (!videoContainer) return;

    videoContainer.innerHTML = `
        <div class="loading">
            Loading video lectures...
        </div>
    `;


    try {

        const response =
            await fetch(API);


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {

            throw new Error(
                "Invalid response"
            );

        }


        /*
         * At the moment your backend schema contains:
         *
         * Notes
         * Assignment
         * Question Paper
         * Syllabus
         *
         * It does NOT contain video lectures.
         *
         * So we don't display PDF materials
         * inside Video Lectures.
         */

        videoContainer.innerHTML = `

            <div class="loading">

                <i
                    class="fa-solid fa-video"
                    style="font-size:35px;margin-bottom:15px;"
                ></i>

                <br>

                No video lectures available yet.

            </div>

        `;


    } catch (error) {

        console.error(
            "Video loading error:",
            error
        );


        videoContainer.innerHTML = `

            <div class="loading">

                Unable to load video lectures.

            </div>

        `;

    }

}


/* =====================================================
   CLASS FILTER - STUDY MATERIAL
===================================================== */

if (studyClassFilter) {

    studyClassFilter.addEventListener(
        "change",
        () => {

            loadStudyMaterials();

        }
    );

}


/* =====================================================
   CLASS FILTER - VIDEO
===================================================== */

if (videoClassFilter) {

    videoClassFilter.addEventListener(
        "change",
        () => {

            loadVideos();

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


/* =====================================================
   ESCAPE ATTRIBUTE
===================================================== */

function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* =====================================================
   PAGE LOAD
===================================================== */

window.addEventListener("load", () => {

    document.body.style.opacity = "1";


    /* Study material visible initially */

    if (videoSection) {
        videoSection.style.display = "none";
    }

    if (studySection) {
        studySection.style.display = "block";
    }


    if (videoBtn) {
        videoBtn.classList.remove("active");
    }

    if (studyBtn) {
        studyBtn.classList.add("active");
    }


    loadStudyMaterials();

});