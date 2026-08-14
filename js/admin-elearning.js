const API = "http://localhost:5000/api/elearning";

const materialForm = document.getElementById("materialForm");
const materialId = document.getElementById("materialId");
const title = document.getElementById("title");
const classNumber = document.getElementById("classNumber");
const category = document.getElementById("category");
const file = document.getElementById("file");
const description = document.getElementById("description");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const materialsContainer = document.getElementById("materialsContainer");
const materialCount = document.getElementById("materialCount");
const refreshBtn = document.getElementById("refreshBtn");
const filterClass = document.getElementById("filterClass");
const filterCategory = document.getElementById("filterCategory");

const menuBtn = document.getElementById("menuBtn");
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

async function loadMaterials() {
    if (!materialsContainer) return;

    materialsContainer.innerHTML =
        `<div class="loading">Loading materials...</div>`;

    try {
        const params = new URLSearchParams();

        if (filterClass && filterClass.value !== "all") {
            params.append("classNumber", filterClass.value);
        }

        if (filterCategory && filterCategory.value !== "all") {
            params.append("category", filterCategory.value);
        }

        const url = params.toString()
            ? `${API}?${params.toString()}`
            : API;

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || `Server error: ${response.status}`
            );
        }

        if (!Array.isArray(result.data)) {
            throw new Error("Invalid server response");
        }

        if (materialCount) {
            materialCount.textContent =
                `${result.count} material${result.count === 1 ? "" : "s"}`;
        }

        renderMaterials(result.data);
    } catch (error) {
        console.error("Load materials error:", error);

        if (materialCount) {
            materialCount.textContent = "Unable to load";
        }

        materialsContainer.innerHTML = `
            <div class="empty">
                Unable to load E-Learning materials.
            </div>
        `;
    }
}

function renderMaterials(materials) {
    if (!materialsContainer) return;

    materialsContainer.innerHTML = "";

    if (!materials.length) {
        materialsContainer.innerHTML = `
            <div class="empty">
                No E-Learning materials found.
            </div>
        `;
        return;
    }

    materials.forEach(material => {
        const item = document.createElement("div");
        item.className = "material-item";

        const fileUrl = getFileUrl(material.file);

        item.innerHTML = `
            <div class="material-info">
                <h3>${escapeHTML(material.title)}</h3>

                <div class="material-meta">
                    <span>
                        Class ${escapeHTML(material.classNumber)}
                    </span>

                    <span>
                        ${escapeHTML(material.category)}
                    </span>
                </div>

                <p>
                    ${escapeHTML(
                        material.description || "No description"
                    )}
                </p>
            </div>

            <div class="material-actions">
                <a
                    href="${escapeAttribute(fileUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="view-btn"
                >
                    <i class="fa-solid fa-eye"></i>
                    View
                </a>

                <button
                    type="button"
                    class="delete-btn"
                    data-id="${escapeAttribute(material._id)}"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </div>
        `;

        const deleteBtn =
            item.querySelector(".delete-btn");

        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
                deleteMaterial(material._id);
            });
        }

        materialsContainer.appendChild(item);
    });
}

if (materialForm) {
    materialForm.addEventListener("submit", async e => {
        e.preventDefault();

        const id = materialId.value.trim();

        if (!title.value.trim()) {
            alert("Please enter a material title.");
            return;
        }

        if (!classNumber.value) {
            alert("Please select a class.");
            return;
        }

        if (!category.value) {
            alert("Please select a category.");
            return;
        }

        if (!id && (!file || !file.files.length)) {
            alert("Please select a file.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            window.location.href = "admin-login.html";
            return;
        }

        try {
            saveBtn.disabled = true;

            saveBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Uploading...
            `;

            const formData = new FormData();

            formData.append(
                "title",
                title.value.trim()
            );

            formData.append(
                "classNumber",
                classNumber.value
            );

            formData.append(
                "category",
                category.value
            );

            formData.append(
                "description",
                description.value.trim()
            );

            if (file && file.files.length) {
                formData.append(
                    "file",
                    file.files[0]
                );
            }

            const response = await fetch(
                id ? `${API}/${id}` : API,
                {
                    method: id ? "PUT" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Upload failed"
                );
            }

            alert(
                id
                    ? "Material updated successfully."
                    : "Material uploaded successfully."
            );

            resetForm();
            await loadMaterials();
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message || "Upload failed.");
        } finally {
            saveBtn.disabled = false;

            saveBtn.innerHTML = materialId.value
                ? `
                    <i class="fa-solid fa-floppy-disk"></i>
                    Update Material
                  `
                : `
                    <i class="fa-solid fa-plus"></i>
                    Add Material
                  `;
        }
    });
}

async function editMaterial(id) {
    try {
        const response = await fetch(`${API}/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to get material"
            );
        }

        const material = result.data;

        materialId.value = material._id;
        title.value = material.title;
        classNumber.value = material.classNumber;
        category.value = material.category;
        description.value = material.description || "";

        if (file) {
            file.value = "";
        }

        const formTitle =
            document.getElementById("formTitle");

        if (formTitle) {
            formTitle.textContent =
                "Edit E-Learning Material";
        }

        saveBtn.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Update Material
        `;

        cancelBtn.style.display = "block";

        const existingFile =
            document.getElementById("existingFile");

        if (existingFile) {
            existingFile.innerHTML = `
                Current file:
                <a
                    href="${escapeAttribute(
                        getFileUrl(material.file)
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View File
                </a>
            `;

            existingFile.style.display = "block";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } catch (error) {
        console.error("Edit error:", error);
        alert(error.message);
    }
}

async function deleteMaterial(id) {
    if (
        !confirm(
            "Are you sure you want to delete this material?"
        )
    ) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "admin-login.html";
        return;
    }

    try {
        const response = await fetch(
            `${API}/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Delete failed"
            );
        }

        alert("Material deleted successfully.");

        await loadMaterials();
    } catch (error) {
        console.error("Delete error:", error);
        alert(error.message);
    }
}

function resetForm() {
    if (materialForm) {
        materialForm.reset();
    }

    materialId.value = "";

    const formTitle =
        document.getElementById("formTitle");

    if (formTitle) {
        formTitle.textContent =
            "Add E-Learning Material";
    }

    saveBtn.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Add Material
    `;

    cancelBtn.style.display = "none";

    const existingFile =
        document.getElementById("existingFile");

    if (existingFile) {
        existingFile.innerHTML = "";
        existingFile.style.display = "none";
    }
}

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

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
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

if (cancelBtn) {
    cancelBtn.addEventListener("click", resetForm);
}

if (refreshBtn) {
    refreshBtn.addEventListener("click", loadMaterials);
}

if (filterClass) {
    filterClass.addEventListener("change", loadMaterials);
}

if (filterCategory) {
    filterCategory.addEventListener("change", loadMaterials);
}

if (file) {
    file.addEventListener("change", () => {
        if (!file.files.length) {
            return;
        }

        console.log(
            "Selected file:",
            file.files[0].name
        );

        console.log(
            "File type:",
            file.files[0].type
        );

        console.log(
            "File size:",
            file.files[0].size
        );
    });
}

window.editMaterial = editMaterial;
window.deleteMaterial = deleteMaterial;

window.addEventListener("load", loadMaterials);