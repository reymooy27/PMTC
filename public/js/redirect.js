const participantsEmail = document.getElementById("email");
const email = localStorage.getItem("participantsEmail");
const sendEmail = document.getElementById("sendEmail");
participantsEmail.innerHTML = email;
sendEmail.addEventListener("click", async () => {
  await fetch("/redirect", {
    method: "post",
    body: JSON.stringify({
      teamName: localStorage.getItem("teamName"),
      email: localStorage.getItem("participantsEmail"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
});
