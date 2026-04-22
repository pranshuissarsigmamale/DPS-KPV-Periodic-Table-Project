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

/* CATEGORY FIX */
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

/* LOAD */
fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(r=>r.json())
.then(data=>{

  data.elements.forEach(el=>{

    if(el.number > 118) return;

    elements[el.symbol] = el;

    const d = document.createElement("div");
    d.className = "element " + getCategory(el.category);

    d.dataset.symbol = el.symbol;
    d.dataset.name = el.name;

    // FIX LANTHANOID POSITION
    if(el.category?.includes("lanthanoid")){
      d.style.gridRow = 9;
      d.style.gridColumn = el.number - 56;
    }
    else if(el.category?.includes("actinoid")){
      d.style.gridRow = 10;
      d.style.gridColumn = el.number - 88;
    }
    else{
      d.style.gridColumn = el.xpos;
      d.style.gridRow = el.ypos;
    }

    d.innerHTML = `${el.number}<br><b>${el.symbol}</b>`;

    table.appendChild(d);
  });
});

/* CLICK */
table.onclick = e=>{
  const el = e.target.closest(".element");
  if(!el) return;

  const data = elements[el.dataset.symbol];
  if(!data) return;

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
};

/* SEARCH */
search.oninput = ()=>{
  const v = search.value.toLowerCase();
  document.querySelectorAll(".element").forEach(el=>{
    el.style.opacity =
      !v || el.dataset.name.toLowerCase().includes(v) ||
      el.dataset.symbol.toLowerCase().includes(v)
      ? "1":"0.2";
  });
};

/* CLOSE */
document.getElementById("close").onclick = ()=>modal.classList.remove("show");
window.onclick = e=>{ if(e.target===modal) modal.classList.remove("show"); };

/* ORBITAL */
function drawOrbital(config){
  const c=document.createElement("div");
  if(!config) return c;

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
      b.innerText=v==2?"↑↓":v==1?"↑":"";
      c.appendChild(b);
    });

    c.appendChild(document.createElement("br"));
  });

  return c;
}

/* SHELL */
function drawShell(n){
  const c=document.createElement("div");
  c.className="atom";

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

    c.appendChild(orbit);
  });

  return c;
}

});
