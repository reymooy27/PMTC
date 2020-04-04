//Menu
function menuToggle() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("toggle");
  nav.classList.toggle("active");
  toggle.classList.toggle("active");
}
const menu = document.getElementById("toggle");
menu.addEventListener("click", menuToggle);

//Animate on scroll
AOS.init();

// Standings collapsible
let coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("collapsible-active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

// SChedule tab
let tabs = document.querySelectorAll("[data-tab-target]");
let tabContent = document.querySelectorAll("[data-tab-content]");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContent.forEach(tabContent => tabContent.classList.remove("active-tab"));
    tabs.forEach(tabContent => tabContent.classList.remove("qualifier-active"));

    tab.classList.add("qualifier-active");
    target.classList.add("active-tab");
  });
});

// Tournament Information tab
let tabs2 = document.querySelectorAll("[data-tab-target2]");
let tabContent2 = document.querySelectorAll("[data-tab-content2]");
tabs2.forEach(tab2 => {
  tab2.addEventListener("click", () => {
    const target2 = document.querySelector(tab2.dataset.tabTarget2);
    tabContent2.forEach(tabContent2 =>
      tabContent2.classList.remove("active-tab")
    );
    tabs2.forEach(tabContent2 =>
      tabContent2.classList.remove("qualifier-active")
    );

    tab2.classList.add("qualifier-active");
    target2.classList.add("active-tab");
  });
});
