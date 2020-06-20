const form = document.getElementById("login_form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  const formData = new FormData(this);
  await fetch("/login/admin", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.error(err));
});
