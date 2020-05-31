//Menu
function menuToggle() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("toggle");
  nav.classList.toggle("active");
  toggle.classList.toggle("active");
}
const menu = document.getElementById("toggle");
menu.addEventListener("click", menuToggle);

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
smoothScrollBackToTop;

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
