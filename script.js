document.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const search = document.getElementById("search");
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");

let elements = {};

/* THEME */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

/* LOAD DATA */
table.innerHTML = "<h2>Loading...</h2>";

fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(r => r.json())
.then(data => {

  table.innerHTML = "";

  data.elements.forEach(el => {
    elements[el.symbol] = el;

    const div = document.createElement("div");
    div.className = "element";

    div.style.gridColumn = el.xpos;
    div.style.gridRow = el.ypos;

    div.dataset.symbol = el.symbol;
    div.dataset.name = el.name;

    div.innerHTML = `${el.number}<br><b>${el.symbol}</b>`;

    table.appendChild(div);
  });
});

/* CLICK */
table.onclick = e => {
  const el = e.target.closest(".element");
  if (!el) return;

  const data = elements[el.dataset.symbol];
  if (!data) return;

  modal.classList.add("show");
  title.innerText = data.name;

  content.innerHTML = `
    Atomic No: ${data.number}<br>
    Symbol: ${data.symbol}<br>
    Category: ${data.category}<br>
    Mass: ${data.atomic_mass}<br><br>
    Electron Config:<br>${data.electron_configuration}
  `;

  content.appendChild(drawOrbital(data.electron_configuration));
  content.appendChild(drawShell(data.number));
};

/* CLOSE */
document.getElementById("close").onclick = () => modal.classList.remove("show");
window.onclick = e => { if(e.target===modal) modal.classList.remove("show"); };

/* SEARCH */
search.oninput = () => {
  const val = search.value.toLowerCase();
  document.querySelectorAll(".element").forEach(el => {
    el.style.opacity =
      !val ||
      el.dataset.name.toLowerCase().includes(val) ||
      el.dataset.symbol.toLowerCase().includes(val)
      ? "1" : "0.2";
  });
};

/* ORBITAL */
function drawOrbital(config){
  const c = document.createElement("div");
  if(!config) return c;

  config.replace(/\[.*?\]/g,"").split(" ").forEach(o=>{
    const m = o.match(/(\d+)([spdf])(\d+)/);
    if(!m) return;

    let e = +m[3];
    let boxes = {s:1,p:3,d:5,f:7}[m[2]];
    let arr = Array(boxes).fill(0);

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

      el.style.left = "50%";
      el.style.top = "50%";
      el.style.transform = `rotate(${angle}deg) translate(${r}px) rotate(-${angle}deg)`;

      orbit.appendChild(el);
    }

    c.appendChild(orbit);
  });

  return c;
}

});
