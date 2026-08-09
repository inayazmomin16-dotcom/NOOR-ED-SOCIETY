const API = "https://noor-ed-society-backend.onrender.com/api/gallery";

/* ===========================
   Scroll Animation
=========================== */

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll(".page-title, .upload-card, .gallery-list")
.forEach((item) => {
    item.classList.add("hidden");
    observer.observe(item);
});

/* ===========================
   Image Preview
=========================== */

const fileInput = document.getElementById("image");

if (fileInput) {

    fileInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            let preview = document.querySelector(".preview-image");

            if (!preview) {

                preview = document.createElement("img");

                preview.className = "preview-image";

                preview.style.width = "100%";
                preview.style.height = "220px";
                preview.style.objectFit = "cover";
                preview.style.borderRadius = "18px";
                preview.style.marginTop = "18px";
                preview.style.border = "2px dashed #F8A91F";

                document.querySelector(".upload-form").appendChild(preview);
            }

            preview.src = e.target.result;
        };

        reader.readAsDataURL(file);

    });

}

/* ===========================
   Upload Gallery
=========================== */

const form = document.getElementById("galleryForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            window.location.href = "admin-login.html";
            return;
        }

        const formData = new FormData();

        formData.append("title", document.getElementById("title").value);
        formData.append("category", document.getElementById("category").value);
        formData.append("image", document.getElementById("image").files[0]);

        try {

            const res = await fetch(API, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Upload failed");
                return;
            }

            alert("Image Uploaded Successfully!");

            form.reset();

            const preview = document.querySelector(".preview-image");

            if (preview) preview.remove();

            loadGallery();

        }

        catch (err) {

            console.error(err);

            alert("Upload Failed");

        }

    });

}

/* ===========================
   Load Gallery
=========================== */

async function loadGallery() {

    try {

        const res = await fetch(API);

        const result = await res.json();

        const galleryList = document.getElementById("galleryList");

        if (!galleryList) return;

        galleryList.innerHTML = "";

        if (!result.data || result.data.length === 0) {

            galleryList.innerHTML = `
                <p style="color:white;text-align:center;">
                    No Images Uploaded Yet
                </p>
            `;

            return;

        }

        result.data.forEach((item) => {

            galleryList.innerHTML += `

            <div class="image-card">

                <img
                   src="https://noor-ed-society-backend.onrender.com${item.image}"
                    alt="${item.title}">

                <div class="image-details">

                    <h3>${item.title}</h3>

                    <p>Category: ${item.category}</p>

                    <div class="image-actions">

                        <button
                            class="delete-btn"
                            onclick="deleteGallery('${item._id}')">

                            <i class="fa-solid fa-trash"></i>

                            Delete

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch (err) {

        console.error(err);

    }

}

/* ===========================
   Delete Gallery
=========================== */

async function deleteGallery(id) {

    if (!confirm("Delete this image?")) return;

    const token = localStorage.getItem("token");

    try {

        const res = await fetch(`${API}/${id}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (res.ok) {

            alert("Image Deleted Successfully!");

            loadGallery();

        }

        else {

            alert("Delete Failed");

        }

    }

    catch (err) {

        console.error(err);

    }

}

/* ===========================
   Search
=========================== */

const search = document.querySelector(".search-box input");

if (search) {

    search.addEventListener("keyup", () => {

        const value = search.value.toLowerCase();

        document.querySelectorAll(".image-card").forEach((card) => {

            if (card.innerText.toLowerCase().includes(value)) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    });

}

/* ===========================
   Mobile Menu
=========================== */

const menuBtn = document.querySelector(".menu-btn");

const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {

    const menuIcon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", () => {

        mobileMenu.classList.toggle("show");

        if (mobileMenu.classList.contains("show")) {

            menuIcon.classList.replace("fa-bars", "fa-xmark");

        }

        else {

            menuIcon.classList.replace("fa-xmark", "fa-bars");

        }

    });

    document.addEventListener("click", (e) => {

        if (
            !menuBtn.contains(e.target) &&
            !mobileMenu.contains(e.target)
        ) {

            mobileMenu.classList.remove("show");

            menuIcon.classList.replace("fa-xmark", "fa-bars");

        }

    });

}

/* ===========================
   Page Load
=========================== */

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

    loadGallery();

});