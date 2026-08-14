const API = "https://noor-ed-society-backend.onrender.com/api/gallery";
const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold:0.15
});

document.querySelectorAll("section,.footer").forEach(item=>{

    item.classList.add("hidden");

    observer.observe(item);

});

async function loadGallery(){

    try{

        const res = await fetch(API);

        const result = await res.json();

        const galleryGrid = document.getElementById("galleryGrid");

        galleryGrid.innerHTML = "";

        result.data.forEach(item=>{

            galleryGrid.innerHTML += `

            <div class="gallery-card"
                 data-category="${item.category.toLowerCase()}">

                <img
src="${item.image}"                    alt="${item.title}">

                <div class="gallery-info">

                    <h3>${item.title}</h3>

                    <p>${item.category}</p>

                </div>

            </div>

            `;

        });

        enableLightbox();

    }

    catch(err){

        console.error(err);

    }

}

const searchInput = document.querySelector(".search-box input");

if(searchInput){

    searchInput.addEventListener("keyup",()=>{

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".gallery-card").forEach(card=>{

            const text = card.innerText.toLowerCase();

            card.style.display =
                text.includes(value)
                ? "block"
                : "none";

        });

    });

}

document.querySelectorAll(".filter").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document
            .querySelectorAll(".filter")
            .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        const filter = btn.dataset.filter.toLowerCase();

        document.querySelectorAll(".gallery-card").forEach(card=>{

            if(filter==="all"){

                card.style.display="block";

            }

            else{

                card.style.display =

                card.dataset.category===filter

                ? "block"

                : "none";

            }

        });

    });

});

function enableLightbox(){

    document.querySelectorAll(".gallery-card").forEach(card=>{

        card.onclick = ()=>{

            const img = card.querySelector("img");

            const overlay = document.createElement("div");

            overlay.className="lightbox";

            overlay.innerHTML=`

                <span class="close-lightbox">&times;</span>

                <img src="${img.src}">

            `;

            document.body.appendChild(overlay);

            document.body.style.overflow="hidden";

            overlay.onclick=()=>{

                overlay.remove();

                document.body.style.overflow="auto";

            };

        };

    });

}

document.querySelectorAll(".filter").forEach(btn=>{

    btn.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        ripple.className="ripple";

        const rect=this.getBoundingClientRect();

        ripple.style.left=(e.clientX-rect.left)+"px";

        ripple.style.top=(e.clientY-rect.top)+"px";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});

const menuBtn=document.querySelector(".menu-btn");

const mobileMenu=document.getElementById("mobileMenu");

const menuIcon=menuBtn.querySelector("i");

menuBtn.addEventListener("click",()=>{

    mobileMenu.classList.toggle("show");

    if(mobileMenu.classList.contains("show")){

        menuIcon.classList.replace("fa-bars","fa-xmark");

    }

    else{

        menuIcon.classList.replace("fa-xmark","fa-bars");

    }

});

document.addEventListener("click",(e)=>{

    if(

        !menuBtn.contains(e.target)

        &&

        !mobileMenu.contains(e.target)

    ){

        mobileMenu.classList.remove("show");

        menuIcon.classList.replace("fa-xmark","fa-bars");

    }

});

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

    loadGallery();

});