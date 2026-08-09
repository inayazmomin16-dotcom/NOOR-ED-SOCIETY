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
".welcome, .stats, .management, .activity, .logout-section"
).forEach((section)=>{

    section.classList.add("hidden");

    observer.observe(section);

});

const cards=document.querySelectorAll(".dashboard-card");

cards.forEach((card)=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-8px) scale(1.03)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0) scale(1)";

    });

});

const stats=document.querySelectorAll(".stat-card h2");

stats.forEach((counter)=>{

    let target=parseInt(counter.innerText);

    if(isNaN(target)) return;

    let count=0;

    const speed=25;

    const update=()=>{

        if(count<target){

            count++;

            counter.innerText=count;

            setTimeout(update,speed);

        }

    };

    counter.innerText="0";

    update();

});

document.querySelectorAll(".dashboard-card, .logout-btn").forEach((btn)=>{

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