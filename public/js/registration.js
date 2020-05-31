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

const showError = document.querySelector(".error");

const error = {
  teamName: "Nama Tim sudah terdaftar",
  singkatan: "Singkatan sama dengan tim lain",
  id1: "ID 1 Pemain sudah terdaftar",
  id2: "ID 2 Pemain sudah terdaftar",
  id3: "ID 3 Pemain sudah terdaftar",
  id4: "ID 4 Pemain sudah terdaftar",
  hp: "Nomor Handphone sudah terdaftar",
  email: "Email sudah terdaftar",
};

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

const url = "http://localhost:3000/register";

async function getParticipants() {
  await fetch(url)
    .then((a) => {
      return a.json();
    })
    .then((b) => {
      form.addEventListener("submit", (a) => {
        b.forEach((data) => {
          if (teamNameInput.value === data.teamName) {
            console.log("nama sama");
            a.preventDefault();
          }
          if (singkatanTeamInput.value === data.singkatanTeam) {
            console.log("singkatan sama");
            a.preventDefault();
          }
          if (idPemain1Input.value === data.idPlayer) {
            console.log("id1 sama");
            a.preventDefault();
          }
          if (idPemain2Input.value === data.idPlayer2) {
            console.log("id2 sama");
            a.preventDefault();
          }
          if (idPemain3Input.value === data.idPlayer3) {
            console.log("id3 sama");
            a.preventDefault();
          }
          if (idPemain4Input.value === data.idPlayer4) {
            console.log("id4 sama");
            a.preventDefault();
          }
        });
      });
    });
}

form.addEventListener("submit", getParticipants());
