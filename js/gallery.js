const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.15
});

document.querySelectorAll("section, .gallery-card, .footer").forEach((item) => {

    item.classList.add("hidden");

    observer.observe(item);

});

const filters = document.querySelectorAll(".filter");

filters.forEach((button) => {

    button.addEventListener("click", () => {

        filters.forEach((btn) => btn.classList.remove("active"));

        button.classList.add("active");

    });

});

const cards = document.querySelectorAll(".gallery-card");

cards.forEach((card) => {

    card.addEventListener("click", () => {

        const img = card.querySelector("img");

        const overlay = document.createElement("div");

        overlay.className = "lightbox";

        overlay.innerHTML = `

            <span class="close-lightbox">&times;</span>

            <img src="${img.src}" alt="Gallery Image">

        `;

        document.body.appendChild(overlay);

        document.body.style.overflow = "hidden";

        overlay.addEventListener("click", () => {

            overlay.remove();

            document.body.style.overflow = "auto";

        });

    });

});

document.querySelectorAll(".filter").forEach((btn) => {

    btn.addEventListener("click", function(e){

        const circle = document.createElement("span");

        circle.classList.add("ripple");

        const rect = this.getBoundingClientRect();

        circle.style.left = (e.clientX - rect.left) + "px";

        circle.style.top = (e.clientY - rect.top) + "px";

        this.appendChild(circle);

        setTimeout(()=>{

            circle.remove();

        },600);

    });

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
