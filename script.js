window.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const search = document.getElementById("search");
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");
const closeBtn = document.getElementById("close");

let elementsData = {};
let allElements = [];
let loaded = false;

/* THEME */
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
};

/* CATEGORY */
function getCategoryClass(cat){
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
table.innerHTML = "<h2>Loading...</h2>";

fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(res => {
    if(!res.ok) throw new Error("Network error");
    return res.json();
})
.then(data => {
    const frag = document.createDocumentFragment();

    data.elements.forEach(el => {
        if(el.name === "Ununennium") return;

        elementsData[el.symbol] = el;

        const div = document.createElement("div");
        div.className = "element " + getCategoryClass(el.category);

        div.dataset.symbol = el.symbol;
        div.dataset.name = el.name;

        div.style.gridColumn = el.xpos;
        div.style.gridRow = el.ypos;

        div.innerHTML = `${el.number}<br><b>${el.symbol}</b>`;
        frag.appendChild(div);
    });

    table.innerHTML = "";
    table.appendChild(frag);
    allElements = document.querySelectorAll(".element");
    loaded = true;
})
.catch(() => {
    table.innerHTML = "<h2 style='color:red'>Failed to load data</h2>";
});

/* CLICK */
table.addEventListener("click", e => {
    if(!loaded) return alert("Still loading...");

    const el = e.target.closest(".element");
    if(!el) return;

    const data = elementsData[el.dataset.symbol];
    if(!data) return;

    modal.classList.add("show");
    document.body.classList.add("modal-open");

    title.innerText = data.name;
    content.replaceChildren();

    const info = document.createElement("div");
    info.innerHTML = `
    <b>Atomic No:</b> ${data.number}<br>
    <b>Symbol:</b> ${data.symbol}<br>
    <b>Category:</b> ${data.category}<br>
    <b>Mass:</b> ${data.atomic_mass}<br><br>
    <b>Electron Configuration:</b><br>
    ${data.electron_configuration}
    `;
    content.appendChild(info);

    const oTitle = document.createElement("b");
    oTitle.textContent = "Orbital Diagram:";
    content.appendChild(oTitle);
    content.appendChild(generateOrbitalDiagram(data.electron_configuration));

    const sTitle = document.createElement("b");
    sTitle.textContent = "Shell Model:";
    content.appendChild(sTitle);
    content.appendChild(generateShellModel(data.number));
});

/* CLOSE */
closeBtn.onclick = closeModal;
window.addEventListener("click", e=>{
    if(e.target===modal) closeModal();
});

document.addEventListener("keydown", e=>{
    if(e.key==="Escape") closeModal();
});

function closeModal(){
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
}

/* SEARCH */
search.addEventListener("input", ()=>{
    const val = search.value.toLowerCase();

    allElements.forEach(el=>{
        const match =
            el.dataset.name.toLowerCase().includes(val) ||
            el.dataset.symbol.toLowerCase().includes(val);

        el.style.opacity = val ? (match ? "1" : "0.2") : "1";
    });
});

/* ORBITAL */
const subshellMap = { s:1, p:3, d:5, f:7 };

function generateOrbitalDiagram(config){
    const container = document.createElement("div");
    if(!config) return container;

    config = config.replace(/\[.*?\]/g, "");

    config.split(" ").forEach(o=>{
        const m = o.match(/(\d+)([spdf])(\d+)/);
        if(!m) return;

        let electrons = parseInt(m[3]);
        let boxes = subshellMap[m[2]];
        let arr = Array(boxes).fill(0);

        for(let i=0;i<boxes && electrons>0;i++){arr[i]++; electrons--;}
        for(let i=0;i<boxes && electrons>0;i++){arr[i]++; electrons--;}

        const label = document.createElement("div");
        label.innerText = m[1]+m[2];
        container.appendChild(label);

        arr.forEach(v=>{
            const box = document.createElement("div");
            box.className="orbital-box";
            box.innerText = v===2?"↑↓":v===1?"↑":"";
            container.appendChild(box);
        });

        container.appendChild(document.createElement("br"));
    });

    return container;
}

/* SHELL */
function generateShellModel(eCount){
    const container = document.createElement("div");
    container.className = "atom";

    const shells = [2,8,18,32,32,18,8];
    let remaining = eCount;

    shells.forEach((cap, i) => {
        if(remaining <= 0) return;

        let electrons = Math.min(cap, remaining);
        if(electrons > 24) electrons = 24;

        remaining -= electrons;

        const orbit = document.createElement("div");
        orbit.className = "orbit";
        const size = 80 + i * 40;

        orbit.style.width = size + "px";
        orbit.style.height = size + "px";

        for(let j = 0; j < electrons; j++){
            const wrapper = document.createElement("div");
            wrapper.className = "electron-wrapper";

            const electron = document.createElement("div");
            electron.className = "electron";

            const angle = (360 / electrons) * j;

            wrapper.style.transform = `rotate(${angle}deg)`;
            wrapper.style.animationDuration = (4 + i * 2) + "s";

            electron.style.transform = `translateX(${size/2 - 4}px)`;

            wrapper.appendChild(electron);
            orbit.appendChild(wrapper);
        }

        container.appendChild(orbit);
    });

    return container;
}

});
