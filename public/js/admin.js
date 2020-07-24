const teamPlcPoint = document.getElementById("plc_pts");
const label1 = document.querySelector('label[for="playerKill"]');
const label2 = document.querySelector('label[for="player2Kill"]');
const label3 = document.querySelector('label[for="player3Kill"]');
const label4 = document.querySelector('label[for="player4Kill"]');
const playerKill = document.getElementById("playerKill");
const player2Kill = document.getElementById("player2Kill");
const player3Kill = document.getElementById("player3Kill");
const player4Kill = document.getElementById("player4Kill");
const form = document.getElementById("form");
const updtBttn = document.getElementById("update");
const deltBttn = document.getElementById("delete");
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
const tournamentName = document.getElementById("tournamentName");
const tournamentFirstPrize = document.getElementById("tournamentFirstPrize");
const tournamentSecondPrize = document.getElementById("tournamentSecondPrize");
const tournamentThirdPrize = document.getElementById("tournamentThirdPrize");
const tournamentFee = document.getElementById("tournamentFee");
const registrationStart = document.getElementById("registrationStart");
const startDate = document.getElementById("startDate");
const qualifierDay1 = document.getElementById("qualifierDay1");
const qualifierDay2 = document.getElementById("qualifierDay2");
const grandFinalDate = document.getElementById("grandFinalDate");
const updateTournamentButton = document.getElementById("update-tournament");
const tournamentForm = document.getElementById("tournament-form");
const tournamentFirstWinner = document.getElementById("tournamentFirstWinner");
const tournamentSecondWinner = document.getElementById(
  "tournamentSecondWinner"
);
const tournamentThirdWinner = document.getElementById("tournamentThirdWinner");
const showGroupStandings = document.getElementById("showGroupStandings");
const showGrandFinal = document.getElementById("showGrandFinal");
const showKillStanding = document.getElementById("showKillStanding");
const registrationClosed = document.getElementById("registrationClosed");
const confirmed = document.getElementById("confirmed");
const accessToken = localStorage.getItem("token");

async function accessAdmin() {
  await fetch("/admin", {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((info) => info)
    .catch((err) => console.log(err));
}

qualifyToGrandFinal.addEventListener("click", () => {
  if (qualifyToGrandFinal.checked === true) return true;
  return false;
});
tournamentFirstWinner.addEventListener("click", () => {
  if (tournamentFirstWinner.checked === true) return true;
  return false;
});
tournamentSecondWinner.addEventListener("click", () => {
  if (tournamentSecondWinner.checked === true) return true;
  return false;
});
tournamentThirdWinner.addEventListener("click", () => {
  if (tournamentThirdWinner.checked === true) return true;
  return false;
});

showGroupStandings.addEventListener("click", () => {
  if (showGroupStandings.checked === true) return true;
  return false;
});
showGrandFinal.addEventListener("click", () => {
  if (showGrandFinal.checked === true) return true;
  return false;
});
showKillStanding.addEventListener("click", () => {
  if (showKillStanding.checked === true) return true;
  return false;
});
registrationClosed.addEventListener("click", () => {
  if (registrationClosed.checked === true) return true;
  return false;
});
confirmed.addEventListener("click", () => {
  if (confirmed.checked === true) return true;
  return false;
});

window.addEventListener("load", async () => {
  accessAdmin();
  const res = await fetch("/api/v1/tourney");
  const json = await res.json();
  json.map((tourney) => {
    tournamentName.value = tourney.tournamentName;
    tournamentFirstPrize.value = tourney.tournamentFirstPrize;
    tournamentSecondPrize.value = tourney.tournamentSecondPrize;
    tournamentThirdPrize.value = tourney.tournamentThirdPrize;
    tournamentFee.value = tourney.tournamentFee;
    registrationStart.value = tourney.registrationStart;
    startDate.value = tourney.startDate;
    qualifierDay1.value = tourney.qualifierDay1;
    qualifierDay2.value = tourney.qualifierDay2;
    grandFinalDate.value = tourney.grandFinalDate;

    if (tourney.showGroupStandings === true) {
      showGroupStandings.checked = true;
    }

    if (tourney.showGrandFinal === true) {
      showGrandFinal.checked = true;
    }
    if (tourney.showKillStanding === true) {
      showKillStanding.checked = true;
    }
    if (tourney.registrationClosed === true) {
      registrationClosed.checked = true;
    }
  });
});

async function updateTournament() {
  await fetch("/tournament", {
    method: "put",
    body: JSON.stringify({
      tournamentName: tournamentName.value,
      tournamentFirstPrize: tournamentFirstPrize.value,
      tournamentSecondPrize: tournamentSecondPrize.value,
      tournamentThirdPrize: tournamentThirdPrize.value,
      tournamentFee: tournamentFee.value,
      registrationStart: registrationStart.value,
      startDate: startDate.value,
      qualifierDay1: qualifierDay1.value,
      qualifierDay2: qualifierDay2.value,
      grandFinalDate: grandFinalDate.value,
      showGroupStandings: showGroupStandings.checked,
      showGrandFinal: showGrandFinal.checked,
      showKillStanding: showKillStanding.checked,
      registrationClosed: registrationClosed.checked,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
}

updateTournamentButton.addEventListener("click", updateTournament);

async function updateParticipant(tim) {
  await fetch(`/participant/${tim}`, {
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
      tournamentFirstWinner: tournamentFirstWinner.checked,
      tournamentSecondWinner: tournamentSecondWinner.checked,
      tournamentThirdWinner: tournamentThirdWinner.checked,
      confirmed: confirmed.checked,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
}

async function deleteParticipant(tim) {
  await fetch(`/participant/${tim}`, {
    method: "delete",
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

select.addEventListener(
  "change",
  async (e) => {
    const res = await fetch("/api/v1/register");
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
        player3Kill.value = info.player3Kill;
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
        if (info.confirmed === true) {
          confirmed.checked = true;
        }
        if (info.qualifyToGrandFinal === true) {
          GFForm.style.display = "block";
          qualifyToGrandFinal.checked = true;

          if (info.tournamentFirstWinner === true) {
            tournamentFirstWinner.checked = true;
          }
          if (info.tournamentSecondWinner === true) {
            tournamentSecondWinner.checked = true;
          }
          if (info.tournamentThirdWinner === true) {
            tournamentThirdWinner.checked = true;
          }
        }
      }
    });
    let id = e.target.value;
    updtBttn.addEventListener("click", () => {
      updateParticipant(id);
    });
    deltBttn.addEventListener("click", () => {
      if (confirm("Apakah anda ingin menghapus tim ini ?"))
        deleteParticipant(id);
    });
  },
  { once: true }
);
