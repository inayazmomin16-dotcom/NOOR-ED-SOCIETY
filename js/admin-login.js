const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    }else{

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }

});

const loginForm = document.querySelector(".login-form");
const loginBtn = document.querySelector(".login-btn");

loginForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    loginBtn.innerHTML = "Logging In...";

    loginBtn.disabled = true;

    loginBtn.style.opacity = ".8";

    setTimeout(()=>{

        window.location.href="dashboard.html";

    },1200);

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        loginForm.requestSubmit();

    }

});

const inputs=document.querySelectorAll(".input-field input");

inputs.forEach(input=>{

    input.addEventListener("focus",()=>{

        input.parentElement.style.boxShadow="0 0 0 3px rgba(248,169,31,.35)";

    });

    input.addEventListener("blur",()=>{

        input.parentElement.style.boxShadow="none";

    });

});

window.addEventListener("load",()=>{

    document.querySelector(".login-card").style.opacity="1";

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

