const form = document.getElementById("contactForm");
const popup = document.getElementById("popup");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const formData = new FormData(form);

    fetch("https://formsubmit.co/ajax/iamkartik1425@gmail.com", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if(response.ok){
            popup.style.display = "flex";

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            alert("Error sending message");
        }
    })
    .catch(() => alert("Network error"));
});