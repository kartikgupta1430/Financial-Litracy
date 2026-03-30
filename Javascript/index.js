(function () {
    emailjs.init("HO-ezRjZBt_n6QQpJ");
})();

function sendFeedback() {

    var feedback = document.getElementById("feedbackText").value;

    if (feedback.trim() === "") {
        alert("Please enter feedback");
        return;
    }

    emailjs.send("service_kn35wjr", "template_gee1ysb", {
        message: feedback
    })
    .then(function () {
        alert("Feedback sent successfully!");
        document.getElementById("feedbackText").value = "";
    })
    .catch(function (error) {
        console.log(error);
        alert("Failed to send feedback");
    });

}