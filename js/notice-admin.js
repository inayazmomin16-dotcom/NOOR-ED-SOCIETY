const API = "https://noor-ed-society-backend.onrender.com/api/notices";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "admin-login.html";
}

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.15
});


document.querySelectorAll(
    ".page-title, .upload-card, .notice-list, .footer"
).forEach((item) => {

    item.classList.add("hidden");

    observer.observe(item);

});

const form = document.getElementById("noticeForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();


        const title =
            document.getElementById("title").value.trim();

        const description =
            document.getElementById("description").value.trim();


        if (!title || !description) {

            alert("Please fill all fields.");

            return;

        }


        try {

            const response = await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify({

                    title: title,

                    description: description

                })

            });


            const result = await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Failed to upload notice."
                );

                return;

            }


            alert(
                result.message ||
                "Notice uploaded successfully."
            );


            form.reset();


            loadNotices();


        } catch (error) {

            console.error(
                "Upload Notice Error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );

        }

    });

}
async function loadNotices() {

    const noticeList =
        document.getElementById("noticeList");


    if (!noticeList) return;


    try {

        const response =
            await fetch(API);


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load notices."
            );

        }


        noticeList.innerHTML = "";


        if (
            !result.data ||
            result.data.length === 0
        ) {

            noticeList.innerHTML = `

                <div class="empty-notice">

                    <i class="fa-solid fa-bell-slash"></i>

                    <p>
                        No notices available.
                    </p>

                </div>

            `;

            return;

        }


        result.data.forEach((notice) => {


            const date =
                new Date(notice.date);


            const formattedDate =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const card =
                document.createElement("div");


            card.className =
                "notice-card";


            card.innerHTML = `

                <div class="notice-details">

                    <h3>
                        ${escapeHTML(notice.title)}
                    </h3>

                    <div class="notice-date">

                        <i class="fa-solid fa-calendar-days"></i>

                        <span>
                            ${formattedDate}
                        </span>

                    </div>

                    <p>
                        ${escapeHTML(notice.description)}
                    </p>

                </div>

                <div class="notice-actions">

                    <button
                        class="delete-btn"
                        onclick="deleteNotice('${notice._id}')">

                        <i class="fa-solid fa-trash"></i>

                        Delete Notice

                    </button>

                </div>

            `;


            noticeList.appendChild(card);

        });

        document
            .querySelectorAll(".notice-card")
            .forEach((card) => {

                card.classList.add("show");

            });


    } catch (error) {

        console.error(
            "Load Notices Error:",
            error
        );


        noticeList.innerHTML = `

            <div class="empty-notice">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>
                    Unable to load notices.
                </p>

            </div>

        `;

    }

}

async function deleteNotice(id) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this notice?"
        );


    if (!confirmDelete) return;


    const currentToken =
        localStorage.getItem("token");


    if (!currentToken) {

        alert("Please login first.");

        window.location.href =
            "admin-login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${currentToken}`

                    }

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to delete notice."
            );

            return;

        }


        alert(
            result.message ||
            "Notice deleted successfully."
        );


        loadNotices();


    } catch (error) {

        console.error(
            "Delete Notice Error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}

const searchInput =
    document.getElementById("searchNotice");


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        () => {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(".notice-card")
                .forEach((card) => {

                    const text =
                        card.innerText
                            .toLowerCase();


                    if (
                        text.includes(value)
                    ) {

                        card.style.display =
                            "block";

                    } else {

                        card.style.display =
                            "none";

                    }

                });

        }
    );

}

const menuBtn =
    document.querySelector(".menu-btn");


const mobileMenu =
    document.getElementById("mobileMenu");


if (menuBtn && mobileMenu) {


    const menuIcon =
        menuBtn.querySelector("i");


    menuBtn.addEventListener(
        "click",
        () => {


            mobileMenu.classList.toggle(
                "show"
            );


            if (
                mobileMenu.classList.contains(
                    "show"
                )
            ) {

                menuIcon.classList.remove(
                    "fa-bars"
                );

                menuIcon.classList.add(
                    "fa-xmark"
                );

            } else {

                menuIcon.classList.remove(
                    "fa-xmark"
                );

                menuIcon.classList.add(
                    "fa-bars"
                );

            }

        }
    );


    document.addEventListener(
        "click",
        (e) => {


            if (

                !menuBtn.contains(
                    e.target
                )

                &&

                !mobileMenu.contains(
                    e.target
                )

            ) {


                mobileMenu.classList.remove(
                    "show"
                );


                menuIcon.classList.remove(
                    "fa-xmark"
                );


                menuIcon.classList.add(
                    "fa-bars"
                );

            }

        }
    );

}

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}
window.addEventListener(
    "load",
    () => {

        document.body.style.opacity =
            "1";


        loadNotices();

    }
);