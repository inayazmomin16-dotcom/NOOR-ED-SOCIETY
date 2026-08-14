const API = "http://localhost:5000/api/schedule";
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

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".mobile-menu a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.style.background = "#F8D35F";
        link.style.color = "#102B72";
    }
});

const form = document.getElementById("scheduleForm");
const scheduleList = document.getElementById("scheduleList");
const scheduleType = document.getElementById("scheduleType");
const classField = document.getElementById("classField");
const classNumber = document.getElementById("classNumber");
const pdfInput = document.getElementById("pdf");
const scheduleId = document.getElementById("scheduleId");
const existingFile = document.getElementById("existingFile");
const saveButton = document.getElementById("saveScheduleBtn");
const cancelButton = document.getElementById("cancelScheduleBtn");
const refreshButton = document.getElementById("refreshScheduleBtn");
const searchInput = document.getElementById("searchSchedule");
const filterType = document.getElementById("filterType");
const filterClass = document.getElementById("filterClass");
const scheduleCount = document.getElementById("scheduleCount");
const formTitle = document.getElementById("formTitle");

let schedules = [];

if (scheduleType) {
    scheduleType.addEventListener("change", () => {
        if (scheduleType.value === "class") {
            classField.style.display = "block";
            classNumber.required = true;
        } else {
            classField.style.display = "none";
            classNumber.required = false;
            classNumber.value = "";
        }
    });
}

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            window.location.href = "admin-login.html";
            return;
        }

        const type = scheduleType.value;
        const selectedClass = classNumber.value;
        const file = pdfInput.files[0];

        if (!type) {
            alert("Please select timetable type.");
            return;
        }

        if (type === "class" && !selectedClass) {
            alert("Please select a class.");
            return;
        }

        if (!file && !scheduleId.value) {
            alert("Please select a PDF file.");
            return;
        }

        if (file && file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }

        saveButton.disabled = true;

        saveButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Uploading...
        `;

        try {
            const formData = new FormData();

            formData.append("type", type);

            if (type === "class") {
                formData.append("classNumber", selectedClass);
            }

            if (file) {
                formData.append("pdf", file);
            }

            const id = scheduleId.value;

            const url = id
                ? `${API}/${id}`
                : API;

            const method = id
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Failed to save timetable."
                );
            }

            alert(
                id
                    ? "Timetable updated successfully."
                    : "Timetable uploaded successfully."
            );

            resetForm();

            await loadSchedules();

        } catch (error) {
            console.error("Schedule Upload Error:", error);

            alert(
                error.message ||
                "Unable to upload timetable."
            );

        } finally {
            saveButton.disabled = false;

            saveButton.innerHTML = `
                <i class="fa-solid fa-upload"></i>
                Upload Timetable
            `;
        }
    });
}

async function loadSchedules() {
    if (!scheduleList) return;

    scheduleList.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading timetables...
        </div>
    `;

    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Failed to load timetables.");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message ||
                "Unable to load timetables."
            );
        }

        schedules = Array.isArray(result.data)
            ? result.data
            : [];

        applyFilters();

    } catch (error) {
        console.error("Load Schedule Error:", error);

        scheduleList.innerHTML = `
            <div class="empty">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h3>Unable to load timetables</h3>
                <p>
                    Please check your server and try again.
                </p>
            </div>
        `;
    }
}

function applyFilters() {
    const searchValue = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedType = filterType
        ? filterType.value
        : "all";

    const selectedClass = filterClass
        ? filterClass.value
        : "all";

    const filtered = schedules.filter(schedule => {
        const type =
            String(schedule.type || "").toLowerCase();

        const classValue =
            String(schedule.classNumber || "");

        const fileName =
            String(
                schedule.pdf ||
                schedule.file ||
                schedule.fileUrl ||
                ""
            ).toLowerCase();

        const typeMatch =
            selectedType === "all" ||
            type === selectedType;

        const classMatch =
            selectedClass === "all" ||
            classValue === selectedClass;

        const searchMatch =
            !searchValue ||
            type.includes(searchValue) ||
            classValue.includes(searchValue) ||
            fileName.includes(searchValue);

        return (
            typeMatch &&
            classMatch &&
            searchMatch
        );
    });

    displaySchedules(filtered);
}

function displaySchedules(data) {
    scheduleList.innerHTML = "";

    if (scheduleCount) {
        scheduleCount.textContent =
            `${data.length} timetable${data.length === 1 ? "" : "s"}`;
    }

    if (!data.length) {
        scheduleList.innerHTML = `
            <div class="empty">
                <i class="fa-regular fa-calendar-xmark"></i>
                <h3>No timetables found</h3>
                <p>
                    Upload a timetable to see it here.
                </p>
            </div>
        `;

        return;
    }

    data.forEach(schedule => {
        const item = createScheduleItem(schedule);
        scheduleList.appendChild(item);
    });
}

function createScheduleItem(schedule) {
    const item = document.createElement("div");

    item.className = "schedule-item";

    const type =
        String(schedule.type || "").toLowerCase();

    const isClass =
        type === "class";

    const title = isClass
        ? `Class ${schedule.classNumber || ""}`
        : "Teacher Timetable";

    const subtitle = isClass
        ? "Weekly Class Timetable"
        : "Staff Weekly Timetable";

    const filePath =
        schedule.pdf ||
        schedule.file ||
        schedule.fileUrl ||
        schedule.document ||
        "";

    const fileUrl =
        getFileUrl(filePath);

    item.innerHTML = `
        <div class="pdf-icon">
            <i class="fa-solid fa-file-pdf"></i>
        </div>

        <div class="schedule-info">

            <h3>
                ${escapeHTML(title)}
            </h3>

            <div class="schedule-meta">

                <span>
                    <i class="fa-solid fa-calendar-days"></i>
                    ${isClass ? "Class Timetable" : "Teacher Timetable"}
                </span>

                ${
                    isClass
                    ?
                    `
                    <span class="teacher-tag">
                        <i class="fa-solid fa-school"></i>
                        Class ${escapeHTML(
                            schedule.classNumber
                        )}
                    </span>
                    `
                    :
                    ""
                }

            </div>

            <p>
                ${escapeHTML(subtitle)}
            </p>

        </div>

        <div class="schedule-actions">

            ${
                fileUrl
                ?
                `
                <a
                    href="${escapeAttribute(fileUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="view-btn"
                >
                    <i class="fa-solid fa-eye"></i>
                    View
                </a>
                `
                :
                `
                <button
                    type="button"
                    disabled
                >
                    PDF Missing
                </button>
                `
            }

            <button
                type="button"
                class="edit-btn"
                data-id="${schedule._id}"
            >
                <i class="fa-solid fa-pen"></i>
                Edit
            </button>

            <button
                type="button"
                class="delete-btn"
                data-id="${schedule._id}"
            >
                <i class="fa-solid fa-trash"></i>
                Delete
            </button>

        </div>
    `;

    const editButton =
        item.querySelector(".edit-btn");

    const deleteButton =
        item.querySelector(".delete-btn");

    editButton.addEventListener("click", () => {
        editSchedule(schedule);
    });

    deleteButton.addEventListener("click", () => {
        deleteSchedule(schedule._id);
    });

    return item;
}

function getFileUrl(filePath) {
    if (!filePath) {
        return "";
    }

    if (
        filePath.startsWith("http://") ||
        filePath.startsWith("https://")
    ) {
        return filePath;
    }
if (filePath.startsWith("/")) {
    return `http://localhost:5000${filePath}`;
}

return `http://localhost:5000/${filePath}`;
}
function editSchedule(schedule) {
    scheduleId.value =
        schedule._id || "";

    scheduleType.value =
        schedule.type || "";

    scheduleType.dispatchEvent(
        new Event("change")
    );

    if (schedule.type === "class") {
        classNumber.value =
            schedule.classNumber || "";
    }

    const filePath =
        schedule.pdf ||
        schedule.file ||
        schedule.fileUrl ||
        schedule.document ||
        "";

    if (filePath) {
        const fileUrl =
            getFileUrl(filePath);

        existingFile.style.display = "block";

        existingFile.innerHTML = `
            Current PDF:
            <a
                href="${escapeAttribute(fileUrl)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                View Current PDF
            </a>
        `;
    } else {
        existingFile.style.display = "none";
        existingFile.innerHTML = "";
    }

    formTitle.textContent =
        "Update Timetable";

    saveButton.innerHTML = `
        <i class="fa-solid fa-rotate"></i>
        Update Timetable
    `;

    cancelButton.style.display =
        "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

if (cancelButton) {
    cancelButton.addEventListener(
        "click",
        resetForm
    );
}

function resetForm() {
    if (!form) return;

    form.reset();

    scheduleId.value = "";

    classField.style.display =
        "none";

    classNumber.required =
        false;

    existingFile.style.display =
        "none";

    existingFile.innerHTML =
        "";

    formTitle.textContent =
        "Upload Timetable";

    saveButton.innerHTML = `
        <i class="fa-solid fa-upload"></i>
        Upload Timetable
    `;

    cancelButton.style.display =
        "none";
}

async function deleteSchedule(id) {
    if (!id) return;

    const confirmed =
        confirm(
            "Are you sure you want to delete this timetable?"
        );

    if (!confirmed) return;

    const token =
        localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href =
            "admin-login.html";
        return;
    }

    try {
        const response = await fetch(
            `${API}/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to delete timetable."
            );
        }

        alert(
            "Timetable deleted successfully."
        );

        await loadSchedules();

    } catch (error) {
        console.error(
            "Delete Schedule Error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete timetable."
        );
    }
}

if (refreshButton) {
    refreshButton.addEventListener(
        "click",
        loadSchedules
    );
}

if (searchInput) {
    searchInput.addEventListener(
        "input",
        applyFilters
    );
}

if (filterType) {
    filterType.addEventListener(
        "change",
        applyFilters
    );
}

if (filterClass) {
    filterClass.addEventListener(
        "change",
        applyFilters
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
    () => {
        document.body.style.opacity = "1";
        loadSchedules();
    }
);