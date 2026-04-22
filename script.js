document.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");

const hoverCard = document.getElementById("hoverCard");

const mapPanel = document.getElementById("mapPanel");
const mapTitle = document.getElementById("mapTitle");
const mapContent = document.getElementById("mapContent");

const search = document.getElementById("search");

let elements = {};

/* ---------------- LOAD ---------------- */
fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(r => r.json())
.then(data => {

data.elements.forEach(el => {

if(!el.xpos || !el.ypos) return;

elements[el.symbol] = el;

const div = document.createElement("div");
div.className = "element";

div.innerHTML = `${el.number}<br>${el.symbol}`;
div.dataset.name = el.name;
div.dataset.symbol = el.symbol;

div.style.gridColumn = el.xpos;
div.style.gridRow = el.ypos;

div.onclick = () => openModal(el.symbol);

div.onmouseenter = e => showHover(el, e);
div.onmousemove = e => moveHover(e);
div.onmouseleave = hideHover;

table.appendChild(div);
});

})
.catch(err => {
console.error("Load failed", err);
table.innerHTML = "<p>Failed to load elements</p>";
});

/* ---------------- MODAL ---------------- */
function openModal(sym){
const el = elements[sym];
if(!el) return;

modal.classList.add("show");

title.textContent = `${el.name} (${el.symbol})`;

content.innerHTML = `
<p>Atomic No: ${el.number}</p>
<p>Mass: ${el.atomic_mass}</p>

<button onclick="showMap('${sym}')">🌍 Map</button>
`;
}

document.getElementById("close").onclick =
()=>modal.classList.remove("show");

/* ---------------- HOVER (STABLE) ---------------- */
function showHover(el,e){
if(!el) return;

hoverCard.classList.add("show");
hoverCard.innerHTML = `
<b>${el.name}</b><br>
#${el.number}
`;

moveHover(e);
}

function moveHover(e){
hoverCard.style.left = (e.clientX + 10) + "px";
hoverCard.style.top = (e.clientY + 10) + "px";
}

function hideHover(){
hoverCard.classList.remove("show");
}

/* safety */
window.addEventListener("mouseout", hideHover);

/* ---------------- SEARCH ---------------- */
search.oninput = e => {
const v = e.target.value.toLowerCase();

document.querySelectorAll(".element").forEach(el => {
const n = el.dataset.name || "";
const s = el.dataset.symbol || "";

const match = n.toLowerCase().includes(v) || s.toLowerCase().includes(v);

el.style.opacity = (!v || match) ? "1" : "0.15";
});
};

/* ---------------- MAP ---------------- */
window.showMap = function(sym){

const el = elements[sym];
if(!el) return;

mapPanel.classList.add("show");

mapTitle.textContent = "🌍 Element Locations";

mapContent.innerHTML = `
<button onclick="filterCountry('India')">India</button>
<button onclick="filterCountry('USA')">USA</button>
<button onclick="filterCountry('Global')">Global</button>
`;
};

window.filterCountry = function(country){

const map = {
India: ["iron","aluminium","uranium"],
USA: ["iron","copper","gold"],
Global: ["oxygen","carbon","hydrogen"]
};

const list = Object.values(elements).filter(e =>
(map[country] || []).some(k =>
(e.name || "").toLowerCase().includes(k)
));

mapContent.innerHTML = `
<h3>${country}</h3>
${list.length ? list.map(e => e.name).join("<br>") : "No data"}
`;
};

document.getElementById("closeMap").onclick =
()=>mapPanel.classList.remove("show");

});
