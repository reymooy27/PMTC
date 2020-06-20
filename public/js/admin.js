const teamPlcPoint = document.getElementById("plc_pts");
const label1 = document.querySelector('label[for="playerKill"]');
const label2 = document.querySelector('label[for="player2Kill"]');
const label3 = document.querySelector('label[for="player3Kill"]');
const label4 = document.querySelector('label[for="player4Kill"]');
const playerKill = document.getElementById("playerKill");
const player2Kill = document.getElementById("player2Kill");
const player3Kill = document.getElementById("player3Kill");
const player4Kill = document.getElementById("player4Kill");
const form = document.querySelector("form");
const updtBttn = document.getElementById("update");
const select = document.getElementById("teamSelect");
const teamsDiv = document.querySelector(".teams");
const namaTeam = document.querySelector("#namaTeam");
const inGroup = document.getElementById("inGroup");
const qualifyToGrandFinal = document.getElementById("qualifyToGrandFinal");
const GFteamPlcPoint = document.getElementById("GFplc_pts");
const GFplayerKill = document.getElementById("GFplayerKill");
const GFplayer2Kill = document.getElementById("GFplayer2Kill");
const GFplayer3Kill = document.getElementById("GFplayer3Kill");
const GFplayer4Kill = document.getElementById("GFplayer4Kill");
const GFlabel1 = document.querySelector('label[for="GFplayerKill"]');
const GFlabel2 = document.querySelector('label[for="GFplayer2Kill"]');
const GFlabel3 = document.querySelector('label[for="GFplayer3Kill"]');
const GFlabel4 = document.querySelector('label[for="GFplayer4Kill"]');
const GFForm = document.getElementById("gf");

GFlabel1.addEventListener("click", () => console.log("ss"));
qualifyToGrandFinal.addEventListener("click", () => {
  if (qualifyToGrandFinal.checked === true) return true;
  return false;
});

async function updateParticipant(tim) {
  await fetch(`/${tim}`, {
    method: "put",
    body: JSON.stringify({
      teamKillPoint:
        Number(playerKill.value) +
        Number(player2Kill.value) +
        Number(player3Kill.value) +
        Number(player4Kill.value),
      teamPlcPoint: teamPlcPoint.value,
      playerKill: playerKill.value,
      player2Kill: player2Kill.value,
      player3Kill: player3Kill.value,
      player4Kill: player4Kill.value,
      inGroup: inGroup.value,
      qualifyToGrandFinal: qualifyToGrandFinal.checked,
      GFteamKillPoint:
        Number(GFplayerKill.value) +
        Number(GFplayer2Kill.value) +
        Number(GFplayer3Kill.value) +
        Number(GFplayer4Kill.value),
      GFteamPlcPoint: GFteamPlcPoint.value,
      GFplayerKill: GFplayerKill.value,
      GFplayer2Kill: GFplayer2Kill.value,
      GFplayer3Kill: GFplayer3Kill.value,
      GFplayer4Kill: GFplayer4Kill.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
}

window.addEventListener("load", displayTeam());

select.addEventListener(
  "change",
  async (e) => {
    const res = await fetch("/register");
    const json = await res.json();
    json.map((info) => {
      if (e.target.value === info._id) {
        namaTeam.innerHTML = info.teamName;
        teamPlcPoint.value = info.teamPlcPoint;
        label1.innerHTML = info.playerName;
        label2.innerHTML = info.playerName2;
        label3.innerHTML = info.playerName3;
        label4.innerHTML = info.playerName4;
        playerKill.value = info.playerKill;
        player2Kill.value = info.player2Kill;
        player3Kill.value = info.player4Kill;
        player4Kill.value = info.player4Kill;
        inGroup.value = info.inGroup;
        GFteamPlcPoint.value = info.GFteamPlcPoint;
        GFlabel1.innerHTML = info.playerName;
        GFlabel2.innerHTML = info.playerName2;
        GFlabel3.innerHTML = info.playerName3;
        GFlabel4.innerHTML = info.playerName4;
        GFplayerKill.value = info.GFplayerKill;
        GFplayer2Kill.value = info.GFplayer2Kill;
        GFplayer3Kill.value = info.GFplayer3Kill;
        GFplayer4Kill.value = info.GFplayer4Kill;
        if (info.qualifyToGrandFinal === true) {
          GFForm.style.display = "block";
          return (qualifyToGrandFinal.checked = true);
        }
      }
    });
    let id = e.target.value;
    console.log(id);
    updtBttn.addEventListener("click", () => {
      updateParticipant(id);
    });
  },
  { once: true }
);

async function displayTeam() {
  const res = await fetch("/register");
  const json = await res.json();
  teamsDiv.innerHTML = json.map((tim) => {
    return `
      <div class="team">
        <h3>${tim.teamName} (${tim.inGroup})</h3>
        <h5>Kill Point : ${tim.teamKillPoint} - GF : ${tim.GFteamKillPoint}</h5>
        <h5>Plc Point : ${tim.teamPlcPoint} - GF :${tim.GFteamPlcPoint}</h5>
        <h5>${tim.playerName} : ${tim.playerKill} - GF : ${
      tim.GFplayerKill
    }</h5>
        <h5>${tim.playerName2} : ${tim.player2Kill} - GF : ${
      tim.GFplayer2Kill
    }</h5>
        <h5>${tim.playerName3} : ${tim.player3Kill} - GF : ${
      tim.GFplayer3Kill
    }</h5>
        <h5>${tim.playerName4} : ${tim.player4Kill} - GF : ${
      tim.GFplayer4Kill
    }</h5>
        <h5>Lolos Grandfinal : ${
          tim.qualifyToGrandFinal ? "Lolos" : "Tidak Lolos"
        }</h5>
      </div>
      `;
  });
}
