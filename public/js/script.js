const registeredTeam = document.getElementById("registered-team");
const regTeam = document.getElementById("registeredTeam");
const homeWraper = document.getElementById("home-wraper");
const tournamentName = document.getElementById("tournamentName");
const registrationStart = document.getElementById("registrationStart");
const startDate = document.getElementById("startDate");
const tournamentFee = document.getElementById("tournamentFee");
const qualifierDay1 = document.getElementById("qualifierDay1");
const qualifierDay2 = document.getElementById("qualifierDay2");
const grandFinalDate = document.getElementById("grandFinalDate");
const tournamentFirstPrize = document.getElementById("tournamentFirstPrize");
const tournamentSecondPrize = document.getElementById("tournamentSecondPrize");
const tournamentThirdPrize = document.getElementById("tournamentThirdPrize");
const gfStanding = document.getElementById("grandfinal-standing");
const menu1 = document.getElementById("menu1");
const menu2 = document.getElementById("menu2");
const btnWraper = document.getElementById("btn-wraper");

const prize1 = document.querySelector(".prize-details");
const prize2 = document.querySelector(".prize-details2");
const prize3 = document.querySelector(".prize-details3");

const confirmed = document.getElementById("confirmed");
const notConfirmed = document.getElementById("not-confirmed");

async function getParticipant() {
  const res = await fetch("api/v1/register");
  const json = await res.json();

  registeredTeam.innerHTML = `${json.length}/64`;
  regTeam.innerHTML = `Tim : ${json.length}`;

  if (json.length === 0) {
    homeWraper.innerHTML = `<div class="no-participant">
                            <h3>Belum Tersedia Saat Ini</h3>
                        </div>`;
  }

  json.filter((t) => {
    checkWinner(t, prize1, t.tournamentFirstWinner, tournamentFirstPrize);
    checkWinner(t, prize2, t.tournamentSecondWinner, tournamentSecondPrize);
    checkWinner(t, prize3, t.tournamentThirdWinner, tournamentThirdPrize);
  });

  json.forEach((t) => {
    console.log(t.confirmed);
    if (t.confirmed === true > 0) {
      confirmed.style.display = "block";
    }
    if (t.confirmed === false > 0) {
      notConfirmed.style.display = "block";
    }
  });
}

function checkWinner(data, field, conds, span) {
  if (conds === true) {
    field.style.background = `url(../logos/${data.logo.slice(5)})`;
    field.style.backgroundSize = "80px";
    field.style.backgroundRepeat = "no-repeat";
    field.style.backgroundPosition = "center";
    span.innerHTML = data.teamName;
    span.style.fontSize = "18px";
  }
}

async function getTourneyInfo() {
  const res = await fetch("api/v1/tourney");
  const json = await res.json();
  json.map((tourney) => {
    registrationStart.innerHTML = tourney.registrationStart;
    tournamentName.innerHTML = tourney.tournamentName;
    startDate.innerHTML = tourney.startDate;
    tournamentFee.innerHTML = `Rp. ${new Intl.NumberFormat().format(
      tourney.tournamentFee
    )}`;
    qualifierDay1.innerHTML = tourney.qualifierDay1;
    qualifierDay2.innerHTML = tourney.qualifierDay2;
    grandFinalDate.innerHTML = tourney.grandFinalDate;
    tournamentFirstPrize.innerHTML = `Rp. ${new Intl.NumberFormat().format(
      tourney.tournamentFirstPrize
    )}`;
    tournamentSecondPrize.innerHTML = `Rp. ${new Intl.NumberFormat().format(
      tourney.tournamentSecondPrize
    )}`;
    tournamentThirdPrize.innerHTML = `Rp. ${new Intl.NumberFormat().format(
      tourney.tournamentThirdPrize
    )}`;
    if (!tourney.showGroupStandings) {
      menu1.innerHTML = `<div class="no-participant">
                            <h3>Belum Tersedia Saat Ini</h3>
                        </div>`;
    }
    if (!tourney.showKillStanding) {
      menu2.innerHTML = `<div class="no-participant">
                            <h3>Belum Tersedia Saat Ini</h3>
                        </div>`;
    }
    if (!tourney.showGrandFinal) {
      gfStanding.style.display = "none";
    }
    if (tourney.registrationClosed) {
      btnWraper.innerHTML = `<a class="btn-disabled" type="button" disabled>Pendaftaran Tutup</a>`;
      registrationButton.style.display = "none";
    }
  });
}

window.addEventListener("load", () => {
  getTourneyInfo();
  getParticipant();
});

//Menu
function menuToggle() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("toggle");
  nav.classList.toggle("active");
  toggle.classList.toggle("active");
}
const menu = document.getElementById("toggle");
menu.addEventListener("click", menuToggle);

// register button
const registrationButton = document.querySelector(".btn-registered.top");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 350) {
    registrationButton.classList.add("show");
  } else {
    registrationButton.classList.remove("show");
  }

  if (window.screen.width < 700) {
    if (window.pageYOffset > 600) {
      registrationButton.classList.add("show");
    } else {
      registrationButton.classList.remove("show");
    }
  }
});

// Standings collapsible
let coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("collapsible-active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

const teamList = document.getElementsByClassName("team-list");
for (let i = 0; i < teamList.length; i++) {
  teamList[i].addEventListener("click", function () {
    this.classList.toggle("team-list-active");
    let list = this.nextElementSibling;
    if (list.style.display === "block") {
      list.style.display = "none";
      this.style.marginBottom = "10px";
      this.style.borderBottom = " 0.8px rgba(255, 255, 255, 0.288) solid";
      this.style.borderBottomLeftRadius = "5px";
      this.style.borderBottomRightRadius = "5px";
    } else {
      list.style.display = "block";
      this.style.marginBottom = "0px";
      this.style.borderBottom = "none";
      this.style.borderBottomLeftRadius = "0px";
      this.style.borderBottomRightRadius = "0px";
    }
  });
}

// Schedule tab
let tabs = document.querySelectorAll("[data-tab-target]");
let tabContent = document.querySelectorAll("[data-tab-content]");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContent.forEach((tabContent) =>
      tabContent.classList.remove("active-tab")
    );
    tabs.forEach((tabContent) =>
      tabContent.classList.remove("qualifier-active")
    );

    tab.classList.add("qualifier-active");
    target.classList.add("active-tab");
  });
});

// Tournament Information tab
let tabs2 = document.querySelectorAll("[data-tab-target2]");
let tabContent2 = document.querySelectorAll("[data-tab-content2]");
tabs2.forEach((tab2) => {
  tab2.addEventListener("click", () => {
    const target2 = document.querySelector(tab2.dataset.tabTarget2);
    tabContent2.forEach((tabContent2) =>
      tabContent2.classList.remove("active-tab")
    );
    tabs2.forEach((tabContent2) =>
      tabContent2.classList.remove("qualifier-active")
    );

    tab2.classList.add("qualifier-active");
    target2.classList.add("active-tab");
  });
});

//back to top button
const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 1700) {
    if (!backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnExit");
      backToTopButton.classList.add("btnEntrance");
      backToTopButton.style.display = "block";
    }
  } else {
    if (backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnEntrance");
      backToTopButton.classList.add("btnExit");
      setTimeout(() => {
        backToTopButton.style.display = "none";
      }, 250);
    }
  }
});

backToTopButton.addEventListener("click", smoothScrollBackToTop);

function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;

  window.requestAnimationFrame(step);

  function step(timestamp) {
    {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      window.scrollTo(
        0,
        easeInOutCubic(progress, startPosition, distance, duration)
      );
      if (progress < duration) window.requestAnimationFrame(step);
    }
  }
}

function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}

// sort standing table
function sortTable(a) {
  var table, i, x, y;
  table = document.getElementById(`standing-table-${a}`);
  var switching = true;

  // Run loop until no switching is needed
  while (switching) {
    switching = false;
    var rows = table.rows;

    // Loop to go through all rows
    for (i = 1; i < rows.length - 1; i++) {
      var Switch = false;

      // Fetch 2 elements that need to be compared
      x = rows[i].getElementsByClassName("tot-pts")[0];
      y = rows[i + 1].getElementsByClassName("tot-pts")[0];

      // Check if 2 rows need to be switched
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        // If yes, mark Switch as needed and break loop
        Switch = true;
        break;
      }
    }
    if (Switch) {
      // Function to switch rows and mark switch as completed
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

sortTable(1);
sortTable(2);
sortTable(3);
sortTable(4);
sortTable(5);
sortTable(6);

// standing position
function pos(a) {
  let pos = document.getElementsByClassName(`pos-${a}`);
  for (let i = 0; i < pos.length; i++) {
    pos[i].innerHTML = i + 1;
  }
}

pos(1);
pos(2);
pos(3);
pos(4);
pos(5);
pos(6);
