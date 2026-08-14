const API = "https://noor-ed-society-backend.onrender.com/api/schedule";
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

    document.addEventListener("click", (event) => {
        if (
            !menuBtn.contains(event.target) &&
            !mobileMenu.contains(event.target)
        ) {
            mobileMenu.classList.remove("show");

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    });

    const menuLinks = mobileMenu.querySelectorAll("a");

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("show");

            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        });
    });
}

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".mobile-menu a").forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) {
        link.style.background = "#F8D35F";
        link.style.color = "#102B72";
    }
});

async function loadTimetables() {
    const classContainer =
        document.getElementById("classTimetableContainer");

    const teacherContainer =
        document.getElementById("teacherTimetableContainer");

    if (!classContainer || !teacherContainer) {
        return;
    }

    classContainer.innerHTML = `
        <p class="schedule-loading">
            Loading timetables...
        </p>
    `;

    teacherContainer.innerHTML = `
        <p class="schedule-loading">
            Loading timetable...
        </p>
    `;

    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error(
                `Server returned ${response.status}`
            );
        }

        const result = await response.json();

        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {
            throw new Error(
                result.message ||
                "Invalid server response"
            );
        }

        const schedules = result.data;

        const classTimetables = schedules
            .filter(item => {
                return (
                    String(item.type || "")
                        .toLowerCase() === "class"
                );
            })
            .sort((a, b) => {
                return (
                    Number(a.classNumber || 0) -
                    Number(b.classNumber || 0)
                );
            });

        const teacherTimetables = schedules.filter(item => {
            return (
                String(item.type || "")
                    .toLowerCase() === "teacher"
            );
        });

        classContainer.innerHTML = "";

        teacherContainer.innerHTML = "";

        if (classTimetables.length === 0) {
            classContainer.innerHTML = `
                <div class="schedule-empty">

                    <i class="fa-solid fa-file-pdf"></i>

                    <h3>
                        No class timetables available
                    </h3>

                    <p>
                        Timetables will be uploaded soon.
                    </p>

                </div>
            `;
        } else {
            classTimetables.forEach(timetable => {
                const card =
                    createTimetableCard(
                        timetable,
                        "class"
                    );

                classContainer.appendChild(card);
            });
        }

        if (teacherTimetables.length === 0) {
            teacherContainer.innerHTML = `
                <div class="schedule-empty">

                    <i class="fa-solid fa-file-pdf"></i>

                    <h3>
                        Teacher timetable not available
                    </h3>

                    <p>
                        Timetable will be uploaded soon.
                    </p>

                </div>
            `;
        } else {
            teacherTimetables.forEach(timetable => {
                const card =
                    createTimetableCard(
                        timetable,
                        "teacher"
                    );

                teacherContainer.appendChild(card);
            });
        }

    } catch (error) {
        console.error(
            "Timetable Error:",
            error
        );

        classContainer.innerHTML = `
            <div class="schedule-error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Unable to load timetables
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

        teacherContainer.innerHTML = `
            <div class="schedule-error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Unable to load timetable
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;
    }
}

function createTimetableCard(timetable, type) {
    const card =
        document.createElement("div");

    card.className =
        "timetable-card";

    const filePath =
        timetable.pdf ||
        timetable.pdfUrl ||
        timetable.file ||
        timetable.fileUrl ||
        timetable.document ||
        "";

    const fileUrl =
        getFileUrl(filePath);

    let title = "";

    let subtitle = "";

    if (type === "class") {
        const classNumber =
            timetable.classNumber;

        title =
            classNumber
                ? `Class ${convertClassNumber(classNumber)}`
                : "Class Timetable";

        subtitle =
            "Weekly Class Timetable";
    } else {
        title =
            "Teachers Weekly Timetable";

        subtitle =
            "Academic Year 2026–2027";
    }

    if (!fileUrl) {
        card.innerHTML = `
            <div class="card-icon">
                <i class="fa-solid fa-file-pdf"></i>
            </div>

            <div class="card-content">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(subtitle)}
                </p>

            </div>

            <div class="card-buttons">

                <button
                    type="button"
                    class="disabled"
                    disabled
                >

                    <i class="fa-solid fa-file-circle-xmark"></i>

                    PDF Not Available

                </button>

            </div>
        `;

        return card;
    }

    card.innerHTML = `
        <div class="card-icon">

            <i class="fa-solid fa-file-pdf"></i>

        </div>

        <div class="card-content">

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(subtitle)}
            </p>

        </div>

        <div class="card-buttons">

            <a
                href="${escapeAttribute(fileUrl)}"
                target="_blank"
                rel="noopener noreferrer"
            >

                <i class="fa-solid fa-eye"></i>

                View

            </a>

            <a
                href="${escapeAttribute(fileUrl)}"
                download
            >

                <i class="fa-solid fa-download"></i>

                Download

            </a>

        </div>
    `;

    return card;
}

function convertClassNumber(number) {
    const classes = {
        5: "V",
        6: "VI",
        7: "VII",
        8: "VIII",
        9: "IX",
        10: "X"
    };

    return (
        classes[number] ||
        number
    );
}

function getFileUrl(filePath) {
    if (!filePath) {
        return "";
    }

    const value =
        String(filePath).trim();

    if (!value) {
        return "";
    }

    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

 if (value.startsWith("/")) {
    return "https://noor-ed-society-backend.onrender.com" + value;
}

return "https://noor-ed-society-backend.onrender.com/" + value;
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

window.addEventListener("load", () => {
    document.body.style.opacity = "1";

    loadTimetables();
});
