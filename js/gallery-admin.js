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
".page-title, .upload-card, .gallery-list, .image-card"
).forEach((item)=>{

    item.classList.add("hidden");

    observer.observe(item);

});

const fileInput = document.querySelector('input[type="file"]');

if(fileInput){

    fileInput.addEventListener("change",function(){

        const file=this.files[0];

        if(!file) return;

        const reader=new FileReader();

        reader.onload=function(e){

            let preview=document.querySelector(".preview-image");

            if(!preview){

                preview=document.createElement("img");

                preview.className="preview-image";

                preview.style.width="100%";
                preview.style.height="220px";
                preview.style.objectFit="cover";
                preview.style.borderRadius="18px";
                preview.style.marginTop="18px";
                preview.style.border="2px dashed #F8A91F";

                document.querySelector(".upload-form").appendChild(preview);

            }

            preview.src=e.target.result;

        };

        reader.readAsDataURL(file);

    });

}

const search=document.querySelector(".search-box input");

if(search){

search.addEventListener("keyup",()=>{

    const value=search.value.toLowerCase();

    document.querySelectorAll(".image-card").forEach((card)=>{

        const text=card.innerText.toLowerCase();

        if(text.includes(value)){

            card.style.display="flex";

        }else{

            card.style.display="none";

        }

    });

});

}

document.querySelectorAll(".delete-btn").forEach((btn)=>{

    btn.addEventListener("click",()=>{

        const confirmDelete=confirm("Delete this image?");

        if(confirmDelete){

            btn.closest(".image-card").remove();

        }

    });

});

document.querySelectorAll(".edit-btn").forEach((btn)=>{

    btn.addEventListener("click",()=>{

        alert("Edit feature will be connected with the database later.");

    });

});

const form=document.querySelector(".upload-form");

if(form){

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    alert("Image upload will be connected to MySQL & PHP later.");

});

}

document.querySelectorAll(".image-card").forEach((card)=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-6px) scale(1.02)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0) scale(1)";

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