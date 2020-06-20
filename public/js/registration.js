// Filepond image post
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
  FilePondPluginImageValidateSize,
  FilePondPluginFileValidateType
);

FilePond.setOptions({
  stylePanelAspectRatio: 120 / 120,
  imageResizeTargetWidth: 120,
  allowImageValidateSize: true,
  imageValidateSizeLabelImageSizeTooBig: "Gambar Terlalu Besar",
  imageValidateSizeMaxWidth: 640,
  imageValidateSizeMaxHeight: 640,
  acceptedFileTypes: ["image/png", "image/jpeg"],
});

FilePond.parse(document.body);

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

teamNameInput.focus();

function invalid(field, msg) {
  field.nextElementSibling.innerHTML = msg;
  field.nextElementSibling.style.opacity = 1;
  field.classList.add("setErorr");
  field.focus();
}
function valid(field) {
  field.nextElementSibling.style.opacity = 0;
  field.classList.remove("setErorr");
}

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

const uri = "/register";

async function getParticipants() {
  const res = await fetch(uri);
  const json = await res.json();
  json.map((data) => {
    form.addEventListener("submit", (event) => {
      if (teamNameInput.value.toLowerCase() === data.teamName.toLowerCase()) {
        event.preventDefault();
        invalid(teamNameInput, "Nama Tim sudah terdaftar");
      }

      if (
        singkatanTeamInput.value.toLowerCase() ===
        data.singkatanTeam.toLowerCase()
      ) {
        event.preventDefault();
        invalid(singkatanTeamInput, "Singkatan sudah terdaftar");
      }

      if (cekIdSudahTerdaftar(idPemain1Input, data)) {
        invalid(idPemain1Input, "Id sudah terdaftar");
        event.preventDefault();
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
        invalid(idPemain2Input, "Id sudah terdaftar");
        event.preventDefault();
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
        invalid(idPemain3Input, "Id sudah terdaftar");
        event.preventDefault();
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
        invalid(idPemain4Input, "Id sudah terdaftar");
        event.preventDefault();
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
        invalid(namaPemain1Input, "Nick sudah terdaftar");
        event.preventDefault();
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
        invalid(namaPemain2Input, "Nick sudah terdaftar");
        event.preventDefault();
      } else if (
        cekInputSama(
          namaPemain2Input,
          namaPemain1Input,
          namaPemain3Input,
          namaPemain4Input
        )
      ) {
        invalid(namaPemain2Input, "Nick sama");
        event.preventDefault();
      } else {
        valid(namaPemain2Input);
      }

      if (cekNickSudahTerdaftar(namaPemain3Input, data)) {
        invalid(namaPemain3Input, "Nick sudah terdaftar");
        event.preventDefault();
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
        invalid(namaPemain4Input, "Nick sudah terdaftar");
        event.preventDefault();
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
      }
    });
  });
}
window.addEventListener("load", () => {
  console.log("load");
  getParticipants();
});
