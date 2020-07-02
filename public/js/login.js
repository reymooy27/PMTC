const form = document.getElementById("login_form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

function invalid(field, msg) {
  field.focus();
  field.classList.add("setErorr");
  field.nextElementSibling.innerHTML = msg;
  field.nextElementSibling.style.opacity = 1;
}
function valid(field) {
  field.nextElementSibling.style.opacity = 0;
  field.classList.remove("setErorr");
}

form.addEventListener("submit", async (e) => {
  if (usernameInput.value.trim() === "") {
    invalid(usernameInput, "Username Tidak Boleh Kosong");
    e.preventDefault();
  } else {
    valid(usernameInput);
  }

  if (passwordInput.value.trim() === "") {
    invalid(passwordInput, "Password Tidak Boleh Kosong");
    e.preventDefault();
  } else if (passwordInput.value > 10) {
    invalid(passwordInput, "Password Tidak Boleh Lebih Dari 10 Karakter");
    e.preventDefault();
  } else {
    valid(passwordInput);
  }

  await fetch("/login", {
    method: "POST",
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((info) => {
      alert(JSON.stringify(info));
      const token = info;
      localStorage.setItem("token", token);
      window.location = "/admin";
    })
    .catch((err) => console.error(err));
});
