const observer = new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.15
});

document.querySelectorAll(
".notice-hero, .title-section, .search-section, .filter-section, .notice-card"
).forEach((item)=>{

    item.classList.add("hidden");

    observer.observe(item);

});

const searchInput = document.querySelector(".search-box input");

if(searchInput){

    searchInput.addEventListener("keyup",()=>{

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".notice-card").forEach((card)=>{

            const text = card.innerText.toLowerCase();

            if(text.includes(value)){

                card.style.display = "block";

            }else{

                card.style.display = "none";

            }

        });

    });

}
const filterButtons = document.querySelectorAll(".filter-section button");

filterButtons.forEach((button)=>{

    button.addEventListener("click",()=>{

        filterButtons.forEach((btn)=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const category = button.innerText.toLowerCase();

        document.querySelectorAll(".notice-card").forEach((card)=>{

            if(category === "all"){

                card.style.display = "block";

                return;

            }

            const badge = card.querySelector(".badge");

            if(badge.innerText.toLowerCase() === category){

                card.style.display = "block";

            }else{

                card.style.display = "none";

            }

        });

    });

});

document.querySelectorAll(".notice-btn").forEach((button)=>{

    button.addEventListener("click",(e)=>{

        e.preventDefault();

        alert("This will open the PDF notice after database integration.");

    });

});

document.querySelectorAll(".notice-card").forEach((card)=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-6px)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0)";

    });

});

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

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