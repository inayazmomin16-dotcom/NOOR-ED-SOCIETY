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

const materialsContainer =
    document.getElementById("materialsContainer");

const materialCount =
    document.getElementById("materialCount");

const refreshBtn =
    document.getElementById("refreshBtn");

const filterClass =
    document.getElementById("filterClass");

const filterCategory =
    document.getElementById("filterCategory");

async function loadMaterials() {

    materialsContainer.innerHTML =
        `<div class="loading">Loading materials...</div>`;

    try {

        const params = new URLSearchParams();

        if (filterClass.value !== "all") {
            params.append(
                "classNumber",
                filterClass.value
            );
        }

        if (filterCategory.value !== "all") {
            params.append(
                "category",
                filterCategory.value
            );
        }

        const url =
            params.toString()
                ? `${API}?${params.toString()}`
                : API;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load materials");
        }

        const result = await response.json();

        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {
            throw new Error("Invalid server response");
        }

        materialCount.textContent =
            `${result.count} material${result.count === 1 ? "" : "s"}`;

        renderMaterials(result.data);

    } catch (error) {

        console.error(error);

        materialCount.textContent =
            "Unable to load";

        materialsContainer.innerHTML = `
            <div class="empty">
                Unable to load E-Learning materials.
            </div>
        `;
    }
}

function renderMaterials(materials) {

    materialsContainer.innerHTML = "";

    if (materials.length === 0) {

        materialsContainer.innerHTML = `
            <div class="empty">
                No E-Learning materials found.
            </div>
        `;

        return;
    }

    materials.forEach(material => {

        const item =
            document.createElement("div");

        item.className = "material-item";

        const fileUrl =
            getFileUrl(material.file);

        item.innerHTML = `
            <div class="material-info">

                <h3>
                    ${escapeHTML(material.title)}
                </h3>

                <div class="material-meta">

                    <span>
                        Class ${escapeHTML(
                            material.classNumber
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            material.category
                        )}
                    </span>

                </div>

                <p>
                    ${escapeHTML(
                        material.description ||
                        "No description"
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
                    class="edit-btn"
                    onclick="editMaterial('${escapeAttribute(material._id)}')"
                >
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteMaterial('${escapeAttribute(material._id)}')"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>

            </div>
        `;

        materialsContainer.appendChild(item);

    });
}

materialForm.addEventListener("submit", async e => {

    e.preventDefault();

    const id = materialId.value;

    if (!title.value.trim()) {
        alert("Please enter a title.");
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

    if (!id && !file.files.length) {
        alert("Please select a file.");
        return;
    }

    try {

        saveBtn.disabled = true;

        saveBtn.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i> Uploading...`;

        const formData =
            new FormData();

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

        if (file.files.length) {

            formData.append(
                "file",
                file.files[0]
            );

        }

        const response =
            await fetch(
                id
                    ? `${API}/${id}`
                    : API,
                {
                    method: id
                        ? "PUT"
                        : "POST",
                    body: formData
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
                "Operation failed"
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

        console.error(error);

        alert(error.message);

    } finally {

        saveBtn.disabled = false;

        saveBtn.innerHTML =
            materialId.value
                ? `<i class="fa-solid fa-floppy-disk"></i> Update Material`
                : `<i class="fa-solid fa-plus"></i> Add Material`;

    }

});

async function editMaterial(id) {

    try {

        const response =
            await fetch(`${API}/${id}`);

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Unable to get material"
            );

        }

        const material =
            result.data;

        materialId.value =
            material._id;

        title.value =
            material.title;

        classNumber.value =
            material.classNumber;

        category.value =
            material.category;

        description.value =
            material.description || "";

        file.value = "";

        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit E-Learning Material";

        saveBtn.innerHTML =
            `<i class="fa-solid fa-floppy-disk"></i> Update Material`;

        cancelBtn.style.display =
            "block";

        const existingFile =
            document.getElementById(
                "existingFile"
            );

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

            existingFile.style.display =
                "block";

        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert(error.message);

    }
}

async function deleteMaterial(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this material?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE"
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
                "Delete failed"
            );

        }

        alert(
            "Material deleted successfully."
        );

        await loadMaterials();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }
}

function resetForm() {

    materialForm.reset();

    materialId.value = "";

    document.getElementById(
        "formTitle"
    ).textContent =
        "Add E-Learning Material";

    saveBtn.innerHTML =
        `<i class="fa-solid fa-plus"></i> Add Material`;

    cancelBtn.style.display =
        "none";

    const existingFile =
        document.getElementById(
            "existingFile"
        );

    if (existingFile) {

        existingFile.innerHTML = "";

        existingFile.style.display =
            "none";

    }
}

function getFileUrl(filePath) {

    if (!filePath) {
        return "#";
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

cancelBtn.addEventListener(
    "click",
    resetForm
);

refreshBtn.addEventListener(
    "click",
    loadMaterials
);

filterClass.addEventListener(
    "change",
    loadMaterials
);

filterCategory.addEventListener(
    "change",
    loadMaterials
);

if (file) {

    file.addEventListener(
        "change",
        () => {

            if (!file.files.length) {
                return;
            }

            const selectedFile =
                file.files[0];

            console.log(
                "Selected file:",
                selectedFile.name
            );

        }
    );

}

window.addEventListener(
    "load",
    loadMaterials
);