const button = document.querySelector(".start-btn");

button.addEventListener("click", () => {

    button.innerHTML = "Loading...";

    button.disabled = true;

    setTimeout(() => {

        window.location.href = "home.html";

    },800);

});