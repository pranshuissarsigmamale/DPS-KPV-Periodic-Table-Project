document.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");

const hoverCard = document.getElementById("hoverCard");

const comparePanel = document.getElementById("comparePanel");
const elem1 = document.getElementById("elem1");
const elem2 = document.getElementById("elem2");
const compareResult = document.getElementById("compareResult");

const mapPanel = document.getElementById("mapPanel");
const mapTitle = document.getElementById("mapTitle");
const mapContent = document.getElementById("mapContent");

const search = document.getElementById("search");

let elements = {};
let loaded = false;

/* ---------------- LOAD ---------------- */
fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(r => r.json())
.then(data => {

data.elements.forEach(el => {

  if(el.number > 118) return;

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

loaded = true;
initCompare();

});

/* ---------------- MODAL ---------------- */
function openModal(sym){
const el = elements[sym];
if(!el) return;

modal.classList.add("show");

title.textContent = `${el.name} (${el.symbol})`;

content.innerHTML = `
<p><b>Atomic Number:</b> ${el.number}</p>
<p><b>Atomic Mass:</b> ${el.atomic_mass}</p>

<button onclick="showMap('${sym}')">🌍 Map</button>
`;
}

document.getElementById("close").onclick =
()=>modal.classList.remove("show");

/* ---------------- HOVER ---------------- */
function showHover(el,e){
hoverCard.classList.add("show");
hoverCard.innerHTML = `${el.name}<br>#${el.number}`;
moveHover(e);
}

function moveHover(e){
hoverCard.style.left = e.clientX + 10 + "px";
hoverCard.style.top = e.clientY + 10 + "px";
}

function hideHover(){
hoverCard.classList.remove("show");
}

/* ---------------- SEARCH ---------------- */
search.oninput = e=>{
const v = e.target.value.toLowerCase();

document.querySelectorAll(".element").forEach(el=>{
const n = el.dataset.name || "";
const s = el.dataset.symbol || "";

const match = n.toLowerCase().includes(v) || s.toLowerCase().includes(v);

el.style.opacity = (!v || match) ? "1":"0.15";
});
};

/* ---------------- COMPARE ---------------- */
document.getElementById("compareBtn").onclick=()=>{
comparePanel.classList.add("show");
if(loaded) initCompare();
};

document.getElementById("closeCompare").onclick=
()=>comparePanel.classList.remove("show");

function initCompare(){

if(elem1.options.length) return;

Object.values(elements).forEach(el=>{

const o = document.createElement("option");
o.value = el.symbol;
o.textContent = el.name;

elem1.appendChild(o);
elem2.appendChild(o.cloneNode(true));
});
}

window.compareElements = function(){

const a = elements[elem1.value];
const b = elements[elem2.value];

if(!a || !b){
compareResult.innerHTML = "<p>Select both elements</p>";
return;
}

const scale = v => Math.min((v || 1)/3,100);

compareResult.innerHTML = `
<h3>${a.name} ⚔️ ${b.name}</h3>

<div class="bar">
<div>${a.symbol}</div>
<div class="bar-track"><div class="bar-fill" style="width:${scale(a.atomic_mass)}%"></div></div>
</div>

<div class="bar">
<div>${b.symbol}</div>
<div class="bar-track"><div class="bar-fill" style="width:${scale(b.atomic_mass)}%"></div></div>
</div>

<p>${a.atomic_mass > b.atomic_mass ? a.name + " heavier" : b.name + " heavier"}</p>
`;
};

/* ---------------- MAP ---------------- */
window.showMap = function(sym){

const el = elements[sym];
if(!el) return;

mapPanel.classList.add("show");

mapTitle.textContent = el.name;

mapContent.innerHTML = `
<button onclick="filterCountry('India')">India</button>
<button onclick="filterCountry('USA')">USA</button>
<button onclick="filterCountry('Global')">Global</button>
`;
};

window.filterCountry = function(c){

const map = {
India:["iron","aluminium","uranium"],
USA:["iron","copper","gold"],
Global:["iron","carbon","oxygen"]
};

const list = Object.values(elements).filter(e =>
(map[c] || []).some(k =>
(e.name || "").toLowerCase().includes(k)
));

mapContent.innerHTML =
list.length ? list.map(e=>e.name).join("<br>") : "No data";
};

document.getElementById("closeMap").onclick =
()=>mapPanel.classList.remove("show");

});
