const API = "https://noor-ed-society-backend.onrender.com/api/elearning";

const videoBtn = document.getElementById("videoBtn");
const studyBtn = document.getElementById("studyBtn");

const videoSection = document.getElementById("videoSection");
const studySection = document.getElementById("studySection");

const videoContainer = document.getElementById("videoContainer");
const studyContainer = document.getElementById("studyContainer");

const videoClassFilter = document.getElementById("videoClassFilter");
const studyClassFilter = document.getElementById("studyClassFilter");

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

    document.addEventListener("click", e => {
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

const currentPage =
    window.location.pathname.split("/").pop();

document
    .querySelectorAll(".mobile-menu a")
    .forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.style.background = "#F8D35F";
            link.style.color = "#102B72";
        }
    });

function getFileUrl(filePath) {
    if (!filePath) {
        return "#";
    }

    const value = String(filePath).trim();

    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    if (value.startsWith("/")) {
        return `https://noor-ed-society-backend.onrender.com${value}`;
    }

    return `https://noor-ed-society-backend.onrender.com/${value}`;
}

async function getMaterials() {
    const response = await fetch(API);
    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Unable to load E-Learning materials"
        );
    }

    if (!Array.isArray(result.data)) {
        throw new Error("Invalid E-Learning response");
    }

    return result.data;
}

function filterByClass(materials, selectedClass) {
    if (selectedClass === "all") {
        return materials;
    }

    return materials.filter(material => {
        return String(material.classNumber) === String(selectedClass);
    });
}

function getCategoryIcon(category) {
    const value = String(category || "").toLowerCase();

    if (value === "assignment") {
        return "fa-file-pen";
    }

    if (value === "question paper") {
        return "fa-file-lines";
    }

    if (value === "syllabus") {
        return "fa-book";
    }

    return "fa-file-pdf";
}

function renderStudyMaterials(materials) {
    if (!studyContainer) {
        return;
    }

    const selectedClass =
        studyClassFilter
            ? studyClassFilter.value
            : "all";

    const filteredMaterials =
        filterByClass(
            materials,
            selectedClass
        );

    studyContainer.innerHTML = "";

    if (!filteredMaterials.length) {
        studyContainer.innerHTML = `
            <div class="loading">
                No study material found for the selected class.
            </div>
        `;
        return;
    }

    filteredMaterials.forEach(material => {
        const card =
            document.createElement("div");

        card.className = "book-card";

        const title =
            escapeHTML(
                material.title ||
                "Untitled Material"
            );

        const category =
            escapeHTML(
                material.category ||
                "Study Material"
            );

        const description =
            escapeHTML(
                material.description ||
                "Study material for students."
            );

        const classNumber =
            escapeHTML(
                material.classNumber ?? "N/A"
            );

        const fileUrl =
            getFileUrl(material.file);

        const icon =
            getCategoryIcon(material.category);

        card.innerHTML = `
            <div class="book-icon">
                <i class="fa-solid ${icon}"></i>
            </div>

            <div class="book-content">
                <h3>${title}</h3>

                <div class="book-meta">
                    <span>
                        <i class="fa-solid fa-graduation-cap"></i>
                        Class ${classNumber}
                    </span>

                    <span>
                        <i class="fa-solid fa-book"></i>
                        ${category}
                    </span>
                </div>

                <p>${description}</p>

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

function renderVideoMaterials(materials) {
    if (!videoContainer) {
        return;
    }

    const selectedClass =
        videoClassFilter
            ? videoClassFilter.value
            : "all";

    const videos =
        materials.filter(material => {
            const isVideo =
                material.resourceType === "video";

            const classMatches =
                selectedClass === "all" ||
                String(material.classNumber) ===
                    String(selectedClass);

            return isVideo && classMatches;
        });

    videoContainer.innerHTML = "";

    if (!videos.length) {
        videoContainer.innerHTML = `
            <div class="loading">
                No video lectures found for the selected class.
            </div>
        `;
        return;
    }

    videos.forEach(material => {
        const card =
            document.createElement("div");

        card.className = "video-card";

        const title =
            escapeHTML(
                material.title ||
                "Video Lecture"
            );

        const description =
            escapeHTML(
                material.description ||
                "Video lecture for students."
            );

        const classNumber =
            escapeHTML(
                material.classNumber ?? "N/A"
            );

        const fileUrl =
            getFileUrl(material.file);

        card.innerHTML = `
            <div class="video-wrapper">
                <video
                    controls
                    preload="metadata"
                >
                    <source
                        src="${escapeAttribute(fileUrl)}"
                    >
                    Your browser does not support video playback.
                </video>
            </div>

            <div class="video-content">
                <h3>${title}</h3>

                <div class="book-meta">
                    <span>
                        <i class="fa-solid fa-graduation-cap"></i>
                        Class ${classNumber}
                    </span>
                </div>

                <p>${description}</p>
            </div>
        `;

        videoContainer.appendChild(card);
    });
}

async function loadMaterials() {
    if (studyContainer) {
        studyContainer.innerHTML = `
            <div class="loading">
                Loading study material...
            </div>
        `;
    }

    if (videoContainer) {
        videoContainer.innerHTML = `
            <div class="loading">
                Loading video lectures...
            </div>
        `;
    }

    try {
        const materials = await getMaterials();

        renderStudyMaterials(materials);
        renderVideoMaterials(materials);
    } catch (error) {
        console.error(
            "E-Learning loading error:",
            error
        );

        if (studyContainer) {
            studyContainer.innerHTML = `
                <div class="loading">
                    Unable to load study material.
                    <br><br>
                    Please try again later.
                </div>
            `;
        }

        if (videoContainer) {
            videoContainer.innerHTML = `
                <div class="loading">
                    Unable to load video lectures.
                    <br><br>
                    Please try again later.
                </div>
            `;
        }
    }
}

function showVideoSection() {
    if (videoSection) {
        videoSection.style.display = "block";
    }

    if (studySection) {
        studySection.style.display = "none";
    }

    if (videoBtn) {
        videoBtn.classList.add("active");
    }

    if (studyBtn) {
        studyBtn.classList.remove("active");
    }
}

function showStudySection() {
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
}

if (videoBtn) {
    videoBtn.addEventListener(
        "click",
        showVideoSection
    );
}

if (studyBtn) {
    studyBtn.addEventListener(
        "click",
        showStudySection
    );
}

if (videoClassFilter) {
    videoClassFilter.addEventListener(
        "change",
        loadMaterials
    );
}

if (studyClassFilter) {
    studyClassFilter.addEventListener(
        "change",
        loadMaterials
    );
}

function escapeHTML(value) {
    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}

function escapeAttribute(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

window.addEventListener(
    "load",
    async () => {
        document.body.style.opacity = "1";
        showStudySection();
        await loadMaterials();
    }
);