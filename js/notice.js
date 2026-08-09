document.addEventListener("DOMContentLoaded", () => {

const API_URL = "https://noor-ed-society-backend.onrender.com/api/notices";
    const noticeList = document.querySelector("#noticeList");
    const searchInput = document.querySelector(".search-box input");
    const filterButtons = document.querySelectorAll(".filter-section button");
    const menuButton = document.querySelector(".menu-btn");
    const mobileMenu = document.querySelector("#mobileMenu");

    let allNotices = [];
    let currentCategory = "All";
    let currentSearch = "";


    /* ================================
       MOBILE MENU
    ================================= */

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("show");
        });

    }


    document.addEventListener("click", (event) => {

        if (
            mobileMenu &&
            menuButton &&
            !mobileMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            mobileMenu.classList.remove("show");
        }

    });


    if (mobileMenu) {

        mobileMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                mobileMenu.classList.remove("show");
            });

        });

    }


    /* ================================
       LOAD NOTICES
    ================================= */

    async function loadNotices() {

        try {

            showLoading();

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();


            /*
             * Support different API response formats
             */

            if (Array.isArray(data)) {

                allNotices = data;

            } else if (Array.isArray(data.notices)) {

                allNotices = data.notices;

            } else if (Array.isArray(data.data)) {

                allNotices = data.data;

            } else {

                allNotices = [];

            }


            /*
             * Sort notices by newest date first
             */

            allNotices.sort((a, b) => {

                const dateA = new Date(
                    a.date ||
                    a.createdAt ||
                    0
                );

                const dateB = new Date(
                    b.date ||
                    b.createdAt ||
                    0
                );

                return dateB - dateA;

            });


            renderNotices();

        } catch (error) {

            console.error(
                "Error loading notices:",
                error
            );

            showError();

        }

    }


    /* ================================
       RENDER NOTICES
    ================================= */

    function renderNotices() {

        if (!noticeList) return;


        const filteredNotices = allNotices.filter(notice => {

            const category = getCategory(notice);


            /*
             * Category filter
             */

            const categoryMatch =
                currentCategory === "All" ||
                category.toLowerCase() ===
                currentCategory.toLowerCase();


            /*
             * Notice title
             */

            const title = String(
                notice.title ||
                notice.name ||
                ""
            ).toLowerCase();


            /*
             * Notice description
             */

            const description = String(
                notice.description ||
                notice.content ||
                notice.message ||
                ""
            ).toLowerCase();


            /*
             * Search text
             */

            const search =
                currentSearch.toLowerCase();


            const searchMatch =
                title.includes(search) ||
                description.includes(search);


            return categoryMatch && searchMatch;

        });


        /*
         * No notices found
         */

        if (filteredNotices.length === 0) {

            noticeList.innerHTML = `
                <div class="no-notices">

                    <i class="fa-solid fa-circle-info"></i>

                    <h3>
                        No Notices Found
                    </h3>

                    <p>
                        There are no notices matching your search.
                    </p>

                </div>
            `;

            return;

        }


        /*
         * Create notice cards
         */

        noticeList.innerHTML = filteredNotices
            .map(notice => createNoticeCard(notice))
            .join("");


        /*
         * Card animation delay
         */

        noticeList
            .querySelectorAll(".notice-card")
            .forEach((card, index) => {

                card.style.animationDelay =
                    `${index * 0.08}s`;

            });

    }


    /* ================================
       CREATE NOTICE CARD
    ================================= */

    function createNoticeCard(notice) {

        const category = getCategory(notice);

        const categoryClass =
            getCategoryClass(category);


        /*
         * Notice title
         */

        const title = escapeHTML(
            notice.title ||
            notice.name ||
            "Untitled Notice"
        );


        /*
         * Notice description
         */

        const description = escapeHTML(
            notice.description ||
            notice.content ||
            notice.message ||
            "No description available."
        );


        /*
         * Notice date
         */

        const formattedDate = formatDate(
            notice.date ||
            notice.createdAt
        );


        /*
         * New notice badge
         */

        const isNew =
            notice.isNew === true ||
            notice.new === true ||
            notice.status === "new";


        /*
         * Notice card
         *
         * PDF option has been completely removed.
         */

        return `
            <div
                class="notice-card"
                data-category="${escapeHTML(category)}"
            >

                <div class="notice-header">

                    <span class="badge ${categoryClass}">
                        ${escapeHTML(category)}
                    </span>


                    ${
                        isNew
                            ? `
                                <span class="new-badge">
                                    NEW
                                </span>
                            `
                            : ""
                    }

                </div>


                <h3>
                    ${title}
                </h3>


                <div class="notice-date">

                    <i class="fa-solid fa-calendar-days"></i>

                    <span>
                        ${formattedDate}
                    </span>

                </div>


                <p>
                    ${description}
                </p>

            </div>
        `;

    }


    /* ================================
       GET CATEGORY
    ================================= */

    function getCategory(notice) {

        let category =
            notice.category ||
            notice.type ||
            "Events";


        category = String(category).trim();

        const lower =
            category.toLowerCase();


        if (
            lower === "exam" ||
            lower === "exams" ||
            lower === "examination"
        ) {

            return "Exams";

        }


        if (
            lower === "holiday" ||
            lower === "holidays"
        ) {

            return "Holidays";

        }


        if (
            lower === "event" ||
            lower === "events"
        ) {

            return "Events";

        }


        if (
            lower === "admission" ||
            lower === "admissions"
        ) {

            return "Admission";

        }


        return category;

    }


    /* ================================
       CATEGORY CSS CLASS
    ================================= */

    function getCategoryClass(category) {

        const lower =
            category.toLowerCase();


        if (
            lower === "exam" ||
            lower === "exams"
        ) {

            return "exam";

        }


        if (
            lower === "holiday" ||
            lower === "holidays"
        ) {

            return "holiday";

        }


        if (
            lower === "admission" ||
            lower === "admissions"
        ) {

            return "admission";

        }


        if (
            lower === "event" ||
            lower === "events"
        ) {

            return "event";

        }


        return "event";

    }


    /* ================================
       FORMAT DATE
    ================================= */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "Date not available";

        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {

            return String(dateValue);

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* ================================
       SEARCH
    ================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                currentSearch =
                    event.target.value.trim();

                renderNotices();

            }
        );

    }


    /* ================================
       CATEGORY FILTER
    ================================= */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {


                /*
                 * Remove active class
                 */

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                /*
                 * Add active class
                 */

                button.classList.add(
                    "active"
                );


                /*
                 * Get selected category
                 */

                currentCategory =
                    button.textContent.trim();


                renderNotices();

            }
        );

    });


    /* ================================
       LOADING
    ================================= */

    function showLoading() {

        if (!noticeList) return;


        noticeList.innerHTML = `

            <div class="no-notices">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <h3>
                    Loading Notices...
                </h3>

                <p>
                    Please wait while we load the latest notices.
                </p>

            </div>

        `;

    }


    /* ================================
       ERROR
    ================================= */

    function showError() {

        if (!noticeList) return;


        noticeList.innerHTML = `

            <div class="no-notices">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Unable to Load Notices
                </h3>

                <p>
                    Please try again later.
                </p>

                <button
                    type="button"
                    class="notice-btn"
                    id="retryNotices"
                >

                    <i class="fa-solid fa-rotate-right"></i>

                    Retry

                </button>

            </div>

        `;


        const retryButton =
            document.querySelector(
                "#retryNotices"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadNotices
            );

        }

    }


    /* ================================
       SECURITY - ESCAPE HTML
    ================================= */

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* ================================
       LOAD DATA
    ================================= */

    loadNotices();

});