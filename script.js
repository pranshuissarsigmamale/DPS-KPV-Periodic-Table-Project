document.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const hover = document.getElementById("hoverCard");
const search = document.getElementById("search");

const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");
const atom = document.getElementById("atom");
const usesBox = document.getElementById("uses");

let elements = [];

/* USES */
const elementUses = {
  Hydrogen:["Fuel","Rocket fuel"],
  Oxygen:["Breathing","Medical"],
  Carbon:["Fuel","Diamond"],
  Iron:["Construction"],
  Copper:["Wiring"],
  Gold:["Jewelry"],
  Silicon:["Chips"]
};

/* FETCH DATA */
fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(r=>r.json())
.then(data=>{
  elements = data.elements;
  render(elements);
})
.catch(()=>{
  table.innerHTML = "⚠️ Failed to load data. Check internet.";
});

/* RENDER TABLE */
function render(list){
  table.innerHTML = "";

  list.forEach(el=>{
    if(!el.xpos || !el.ypos) return;

    const div = document.createElement("div");
    div.className = "element";

    div.innerHTML = `${el.number}<br>${el.symbol}`;
    div.style.gridColumn = el.xpos;
    div.style.gridRow = el.ypos;

    div.dataset.name = el.name.toLowerCase();
    div.dataset.symbol = el.symbol.toLowerCase();

    /* HOVER */
    div.addEventListener("mousemove", e=>{
      hover.style.display = "block";

      let x = e.pageX + 12;
      let y = e.pageY + 12;

      x = Math.min(x, window.innerWidth - 180);
      y = Math.min(y, window.innerHeight - 100);

      hover.style.left = x + "px";
      hover.style.top = y + "px";

      hover.innerHTML = `
        <b>${el.name}</b><br>
        ${el.symbol} | ${el.number}
      `;
    });

    div.addEventListener("mouseleave", ()=>{
      hover.style.display = "none";
    });

    /* CLICK */
    div.addEventListener("click", ()=>{
      modal.classList.add("show");

      title.innerText = `${el.name} (${el.symbol})`;

      content.innerHTML = `
        Atomic No: ${el.number}<br>
        Mass: ${el.atomic_mass}<br>
        Config: ${el.electron_configuration || "N/A"}
      `;

      renderAtom(el);

      const uses = elementUses[el.name] || ["Various uses"];
      usesBox.innerHTML =
        "<b>Uses:</b><br>• " + uses.join("<br>• ");
    });

    table.appendChild(div);
  });
}

/* ATOM */
function renderAtom(el){
  atom.innerHTML = `<div class="nucleus"></div>`;

  if(!el.shells) return;

  el.shells.forEach((c,i)=>{
    const orbit = document.createElement("div");
    orbit.className = "orbit";

    const size = 50 + i*30;

    orbit.style.width = size + "px";
    orbit.style.height = size + "px";
    orbit.style.animationDuration = (4 + i*2) + "s";

    for(let j=0;j<c;j++){
      const e = document.createElement("div");
      e.className = "electron";

      e.style.transform =
        `rotate(${(360/c)*j}deg) translate(${size/2}px)`;

      orbit.appendChild(e);
    }

    atom.appendChild(orbit);
  });
}

/* CLOSE MODAL */
document.getElementById("close").onclick = ()=>{
  modal.classList.remove("show");
};

modal.addEventListener("click", e=>{
  if(e.target === modal){
    modal.classList.remove("show");
  }
});

/* SEARCH */
search.addEventListener("input", e=>{
  const v = e.target.value.toLowerCase();

  const filtered = elements.filter(el =>
    el.name.toLowerCase().includes(v) ||
    el.symbol.toLowerCase().includes(v)
  );

  render(filtered);
});

});
