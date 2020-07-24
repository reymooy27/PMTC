function checkPhoneKey(key) {
  return (
    (key >= "0" && key <= "9") ||
    key == "+" ||
    key == "(" ||
    key == ")" ||
    key == "-" ||
    key == "ArrowLeft" ||
    key == "ArrowRight" ||
    key == "Delete" ||
    key == "Backspace"
  );
}

const form = document.getElementById("registrationForm");
const teamNameInput = document.getElementById("namaTeam");
const singkatanTeamInput = document.getElementById("singkatanTeam");
const idPemain1Input = document.getElementById("idPemain");
const idPemain2Input = document.getElementById("idPemain2");
const idPemain3Input = document.getElementById("idPemain3");
const idPemain4Input = document.getElementById("idPemain4");
const namaPemain1Input = document.getElementById("namaPemain");
const namaPemain2Input = document.getElementById("namaPemain2");
const namaPemain3Input = document.getElementById("namaPemain3");
const namaPemain4Input = document.getElementById("namaPemain4");
const noHPInput = document.getElementById("noHP");
const emailInput = document.getElementById("email");
const formDiv = document.querySelector(".form");
const logoInput = document.getElementById("logo");
const prevImage = document.getElementById("imagePreviewImage");

logoInput.addEventListener("change", () => {
  if (validImageRes(event)) {
    previewImage(event);
  } else {
    invalid(logoInput, "Res terlalu besar");
  }
});

function validImageRes(ev) {
  const img = new Image();
  img.src = window.URL.createObjectURL(ev.target.files[0]);

  img.addEventListener("load", () => {
    window.URL.revokeObjectURL(img.src);
    if (img.naturalWidth > 500 || img.naturalHeight > 500) {
      return false;
    }
  });
  return true;
}

function previewImage(ev) {
  const reader = new FileReader();
  const file = ev.target.files[0];
  const size = file.size;
  const type = file.type.indexOf("image");

  reader.addEventListener("load", () => {
    if (reader.readyState == 2) {
      if (size > 100000) {
        invalid(logoInput, "Ukuran terlalu besar");
      } else if (type == -1) {
        invalid(logoInput, "Format salah");
      } else {
        valid(logoInput);
        prevImage.src = reader.result;
        prevImage.style.display = "block";
        logoInput.style.display = "none";
      }
    } else {
      prevImage.src = null;
      prevImage.style.display = null;
    }
  });
  reader.readAsDataURL(file);
}

teamNameInput.focus();

function cekIdSudahTerdaftar(field, data) {
  if (
    field.value == data.idPlayer ||
    field.value == data.idPlayer2 ||
    field.value == data.idPlayer3 ||
    field.value == data.idPlayer4
  ) {
    return true;
  } else {
    return false;
  }
}
function cekNickSudahTerdaftar(field, data) {
  if (
    field.value === data.playerName ||
    field.value === data.playerName2 ||
    field.value === data.playerName3 ||
    field.value === data.playerName4
  ) {
    return true;
  } else {
    return false;
  }
}

function cekInputSama(field, field1, field2, field3) {
  if (
    field.value == field1.value ||
    field.value == field2.value ||
    field.value == field3.value
  ) {
    return true;
  } else {
    return false;
  }
}

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

const uri = "/api/v1/register";

async function getParticipants() {
  const res = await fetch(uri);
  const json = await res.json();
  json.map((data) => {
    form.addEventListener("submit", (event) => {
      if (teamNameInput.value.toLowerCase() === data.teamName.toLowerCase()) {
        event.preventDefault();
        invalid(teamNameInput, "Nama Tim sudah terdaftar");
      }
      localStorage.setItem("teamName", teamNameInput.value);

      if (
        singkatanTeamInput.value.toLowerCase() ===
        data.singkatanTeam.toLowerCase()
      ) {
        event.preventDefault();
        invalid(singkatanTeamInput, "Singkatan sudah terdaftar");
      }

      if (cekIdSudahTerdaftar(idPemain1Input, data)) {
        event.preventDefault();
        invalid(idPemain1Input, "Id sudah terdaftar");
      } else if (
        cekInputSama(
          idPemain1Input,
          idPemain2Input,
          idPemain3Input,
          idPemain4Input
        )
      ) {
        event.preventDefault();
        invalid(idPemain1Input, "Id sama");
      } else {
        valid(idPemain1Input);
      }

      if (cekIdSudahTerdaftar(idPemain2Input, data)) {
        event.preventDefault();
        invalid(idPemain2Input, "Id sudah terdaftar");
      } else if (
        cekInputSama(
          idPemain2Input,
          idPemain1Input,
          idPemain3Input,
          idPemain4Input
        )
      ) {
        event.preventDefault();
        invalid(idPemain2Input, "Id sama");
      } else {
        valid(idPemain2Input);
      }

      if (cekIdSudahTerdaftar(idPemain3Input, data)) {
        event.preventDefault();
        invalid(idPemain3Input, "Id sudah terdaftar");
      } else if (
        cekInputSama(
          idPemain3Input,
          idPemain1Input,
          idPemain2Input,
          idPemain4Input
        )
      ) {
        event.preventDefault();
        invalid(idPemain3Input, "Id sama");
      } else {
        valid(idPemain3Input);
      }

      if (cekIdSudahTerdaftar(idPemain4Input, data)) {
        event.preventDefault();
        invalid(idPemain4Input, "Id sudah terdaftar");
      } else if (
        cekInputSama(
          idPemain4Input,
          idPemain1Input,
          idPemain3Input,
          idPemain2Input
        )
      ) {
        event.preventDefault();
        invalid(idPemain4Input, "Id sama");
      } else {
        valid(idPemain4Input);
      }

      if (cekNickSudahTerdaftar(namaPemain1Input, data)) {
        event.preventDefault();
        invalid(namaPemain1Input, "Nick sudah terdaftar");
      } else if (
        cekInputSama(
          namaPemain1Input,
          namaPemain2Input,
          namaPemain3Input,
          namaPemain4Input
        )
      ) {
        event.preventDefault();
        invalid(namaPemain1Input, "Nick sama");
      } else {
        valid(namaPemain1Input);
      }

      if (cekNickSudahTerdaftar(namaPemain2Input, data)) {
        event.preventDefault();
        invalid(namaPemain2Input, "Nick sudah terdaftar");
      } else if (
        cekInputSama(
          namaPemain2Input,
          namaPemain1Input,
          namaPemain3Input,
          namaPemain4Input
        )
      ) {
        event.preventDefault();
        invalid(namaPemain2Input, "Nick sama");
      } else {
        valid(namaPemain2Input);
      }

      if (cekNickSudahTerdaftar(namaPemain3Input, data)) {
        event.preventDefault();
        invalid(namaPemain3Input, "Nick sudah terdaftar");
      } else if (
        cekInputSama(
          namaPemain3Input,
          namaPemain1Input,
          namaPemain2Input,
          namaPemain4Input
        )
      ) {
        event.preventDefault();
        invalid(namaPemain3Input, "Nick sama");
      } else {
        valid(namaPemain3Input);
      }

      if (cekNickSudahTerdaftar(namaPemain4Input, data)) {
        event.preventDefault();
        invalid(namaPemain4Input, "Nick sudah terdaftar");
      } else if (
        cekInputSama(
          namaPemain4Input,
          namaPemain1Input,
          namaPemain2Input,
          namaPemain3Input
        )
      ) {
        event.preventDefault();
        invalid(namaPemain4Input, "Nick sama");
      } else {
        valid(namaPemain4Input);
      }

      if (noHPInput.value == data.handphoneNumber) {
        event.preventDefault();
        invalid(noHPInput, "No HP sudah terdaftar");
      } else {
        valid(noHPInput);
      }

      if (emailInput.value === data.email) {
        event.preventDefault();
        invalid(emailInput, "Email sudah terdaftar");
      } else {
        valid(emailInput);
        localStorage.setItem("participantsEmail", emailInput.value);
      }
    });
  });
}

async function getTourneyInfo() {
  const res = await fetch("api/v1/tourney");
  const json = await res.json();
  json.map((tourney) => {
    if (tourney.registrationClosed) {
      formDiv.innerHTML = `
      <div class="registration-closed">
      <h1 class="registration-closed-title">Registration Closed</h1>
    </div>
    `;
    }
  });
}
window.addEventListener("load", () => {
  getParticipants();
  getTourneyInfo();
});
