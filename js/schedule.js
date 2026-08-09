
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

const currentPage = location.pathname.split("/").pop();

document.querySelectorAll(".mobile-menu a").forEach(link=>{

    if(link.getAttribute("href") === currentPage){

        link.style.background="#F8D35F";
        link.style.color="#102B72";

    }

});

const calendarData = [

{

day:"15",

month:"Aug",

title:"Independence Day",

description:"Flag Hoisting & Cultural Programme",

type:"Event"

},

{

day:"20",

month:"Jul",

title:"Unit Test",

description:"Classes V to X",

type:"Exam"

}

];


const classTimetable=[

{

title:"Class V",

pdf:"#"

},

{

title:"Class VI",

pdf:"#"

},

{

title:"Class VII",

pdf:"#"

},

{

title:"Class VIII",

pdf:"#"

},

{

title:"Class IX",

pdf:"#"

},

{

title:"Class X",

pdf:"#"

}

];


const teacherTimetable=[

{

title:"Teachers Weekly Timetable",

pdf:"#"

}

];


const calendarContainer=document.getElementById("calendarContainer");

if(calendarContainer){

calendarContainer.innerHTML="";

calendarData.forEach(event=>{

calendarContainer.innerHTML+=`

<div class="event-card">

<div class="event-date">

<span>${event.day}</span>

<small>${event.month}</small>

</div>

<div class="event-details">

<h3>${event.title}</h3>

<p>${event.description}</p>

<span class="event-tag ${event.type==="Exam"?"exam":""}">

${event.type}

</span>

</div>

</div>

`;

});

}

const classContainer=document.getElementById("classTimetableContainer");

if(classContainer){

classContainer.innerHTML="";

classTimetable.forEach(item=>{

classContainer.innerHTML+=`

<div class="timetable-card">

<div class="card-icon">

<i class="fa-solid fa-file-pdf"></i>

</div>

<div class="card-content">

<h3>${item.title}</h3>

<p>Weekly Timetable</p>

</div>

<div class="card-buttons">

<a href="${item.pdf}" target="_blank" class="view-btn">

<i class="fa-solid fa-eye"></i>

View

</a>

<a href="${item.pdf}" download class="download-btn">

<i class="fa-solid fa-download"></i>

Download

</a>

</div>

</div>

`;

});

}

const teacherContainer=document.getElementById("teacherTimetableContainer");

if(teacherContainer){

teacherContainer.innerHTML="";

teacherTimetable.forEach(item=>{

teacherContainer.innerHTML+=`

<div class="timetable-card">

<div class="card-icon">

<i class="fa-solid fa-file-pdf"></i>

</div>

<div class="card-content">

<h3>${item.title}</h3>

<p>Academic Year 2026-27</p>

</div>

<div class="card-buttons">

<a href="${item.pdf}" target="_blank" class="view-btn">

<i class="fa-solid fa-eye"></i>

View

</a>

<a href="${item.pdf}" download class="download-btn">

<i class="fa-solid fa-download"></i>

Download

</a>

</div>

</div>

`;

});

}
