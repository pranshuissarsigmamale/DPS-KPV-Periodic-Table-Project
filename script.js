document.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");
const search = document.getElementById("search");

let elements = {};

/* THEME */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

/* CATEGORY */
function getCategory(cat){
  if(!cat) return "";
  cat = cat.toLowerCase();

  if(cat.includes("lanthanoid")) return "lanthanoid";
  if(cat.includes("actinoid")) return "actinoid";
  if(cat.includes("alkaline")) return "alkaline";
  if(cat.includes("alkali")) return "alkali";
  if(cat.includes("transition")) return "transition";
  if(cat.includes("metalloid")) return "metalloid";
  if(cat.includes("nonmetal")) return "nonmetal";
  if(cat.includes("halogen")) return "halogen";
  if(cat.includes("noble")) return "noble";

  return "";
}

/* LOAD DATA */
fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(res => res.json())
.then(data => {

  data.elements.forEach(el => {

    if(el.number > 118) return;

    elements[el.symbol] = el;

    const div = document.createElement("div");
    div.className = "element " + getCategory(el.category);

    div.dataset.symbol = el.symbol;
    div.dataset.name = el.name;

    /* FIX lanthanoids + actinoids */
    if(el.category?.includes("lanthanoid")){
      div.style.gridRow = 9;
      div.style.gridColumn = el.number - 56;
    }
    else if(el.category?.includes("actinoid")){
      div.style.gridRow = 10;
      div.style.gridColumn = el.number - 88;
    }
    else{
      div.style.gridColumn = el.xpos;
      div.style.gridRow = el.ypos;
    }

    div.innerHTML = `${el.number}<br><b>${el.symbol}</b>`;

    table.appendChild(div);
  });

})
.catch(() => {
  table.innerHTML = "<h2 style='color:red'>Failed to load data</h2>";
});

/* 🔥 FIXED CLICK HANDLER */
table.addEventListener("click", function(e) {
  let el = e.target;

  while (el && !el.classList.contains("element")) {
    el = el.parentElement;
  }

  if (!el) return;

  const data = elements[el.dataset.symbol];
  if (!data) return;

  modal.classList.add("show");
  title.innerText = data.name;

  content.innerHTML = `
    <b>Atomic No:</b> ${data.number}<br>
    <b>Mass:</b> ${data.atomic_mass}<br>
    <b>Category:</b> ${data.category}<br><br>
    <b>Electron Config:</b><br>${data.electron_configuration}
  `;

  content.appendChild(drawOrbital(data.electron_configuration));
  content.appendChild(drawShell(data.number));
});

/* SEARCH */
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();

  document.querySelectorAll(".element").forEach(el => {
    el.style.opacity =
      !value ||
      el.dataset.name.toLowerCase().includes(value) ||
      el.dataset.symbol.toLowerCase().includes(value)
      ? "1" : "0.2";
  });
});

/* CLOSE MODAL */
document.getElementById("close").onclick = () => modal.classList.remove("show");

window.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("show");
};

/* ORBITAL DIAGRAM */
function drawOrbital(config){
  const container = document.createElement("div");
  if(!config) return container;

  config.replace(/\[.*?\]/g,"").split(" ").forEach(o=>{
    const m=o.match(/(\d+)([spdf])(\d+)/);
    if(!m) return;

    let e=+m[3];
    let boxes={s:1,p:3,d:5,f:7}[m[2]];
    let arr=Array(boxes).fill(0);

    for(let i=0;i<boxes && e>0;i++){arr[i]++;e--;}
    for(let i=0;i<boxes && e>0;i++){arr[i]++;e--;}

    arr.forEach(v=>{
      const b=document.createElement("div");
      b.className="orbital-box";
      b.innerText = v==2 ? "↑↓" : v==1 ? "↑" : "";
      container.appendChild(b);
    });

    container.appendChild(document.createElement("br"));
  });

  return container;
}

/* SHELL MODEL */
function drawShell(n){
  const container=document.createElement("div");
  container.className="atom";

  let shells=[2,8,18,32];
  let rem=n;

  shells.forEach((cap,i)=>{
    if(rem<=0) return;

    let e=Math.min(cap,rem);
    rem-=e;

    const orbit=document.createElement("div");
    orbit.className="orbit";

    let size=60+i*40;
    orbit.style.width=size+"px";
    orbit.style.height=size+"px";

    for(let j=0;j<e;j++){
      const el=document.createElement("div");
      el.className="electron";

      const angle=(360/e)*j;
      const r=size/2-4;

      el.style.left="50%";
      el.style.top="50%";
      el.style.transform=`rotate(${angle}deg) translate(${r}px) rotate(-${angle}deg)`;

      orbit.appendChild(el);
    }

    container.appendChild(orbit);
  });

  return container;
}

});
