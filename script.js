const table = document.getElementById("table");

/* CATEGORY MAP */
const categoryMap = {
H:"nonmetal",He:"noble",Li:"alkali",Be:"alkaline",
B:"metalloid",C:"nonmetal",N:"nonmetal",O:"nonmetal",
F:"halogen",Ne:"noble"
};

/* LOAD DATA */
let elementDetails = {};

fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(res=>res.json())
.then(data=>{
    data.elements.forEach(el=>{
        elementDetails[el.symbol]={
            name:el.name,
            atomicNumber:el.number,
            mass:el.atomic_mass,
            category:el.category,
            config:el.electron_configuration,
            found:el.source||"Natural sources",
            uses:el.summary||"Various uses",
            type:el.category.includes("synthetic")?"Man-made":"Natural",
            facts:generateFacts(el)
        };

        createElement(el);
    });
});

/* CREATE ELEMENT */
function createElement(el){
    const div=document.createElement("div");
    div.className="element "+(categoryMap[el.symbol]||"");
    div.style.gridColumn=el.xpos;
    div.style.gridRow=el.ypos;

    div.innerHTML=`
        <div class="number">${el.number}</div>
        <div class="symbol">${el.symbol}</div>
    `;

    div.onclick=()=>openModal(el.symbol);

    table.appendChild(div);
}

/* MODAL */
const modal=document.getElementById("modal");
const title=document.getElementById("modal-title");
const body=document.getElementById("modal-body");

document.getElementById("close-btn").onclick=closeModal;

function openModal(symbol){
    const data=elementDetails[symbol];

    title.innerText=data.name;

    body.innerHTML=`
    <b>Atomic Number:</b> ${data.atomicNumber}<br>
    <b>Atomic Mass:</b> ${data.mass}<br>
    <b>Category:</b> ${data.category}<br><br>

    <b>⚛️ Electron Configuration:</b><br>
    `;

    body.appendChild(animateConfig(data.config));

    body.innerHTML+=`
    <br><b>🌍 Found:</b> ${data.found}<br>
    <b>⚙️ Uses:</b> ${data.uses}<br>
    <b>🤖 Type:</b> ${data.type}<br><br>

    <b>💡 Facts:</b>
    <ul>${data.facts.map(f=>`<li>${f}</li>`).join("")}</ul>
    `;

    modal.style.display="block";
    setTimeout(()=>modal.classList.add("show"),10);
}

function closeModal(){
    modal.classList.remove("show");
    setTimeout(()=>modal.style.display="none",300);
}

window.onclick=e=>{
    if(e.target==modal) closeModal();
};

/* ANIMATE CONFIG */
function animateConfig(config){
    const container=document.createElement("div");
    config.split(" ").forEach((orb,i)=>{
        const span=document.createElement("span");
        span.className="orbital";
        span.innerText=orb;
        span.style.animationDelay=(i*0.2)+"s";
        container.appendChild(span);
    });
    return container;
}

/* AUTO FACTS */
function generateFacts(el){
    return [
        `${el.name} has atomic number ${el.number}.`,
        `Category: ${el.category}.`,
        `Electron config: ${el.electron_configuration}.`,
        el.summary?.slice(0,100)+"...",
        el.discovered_by ? `Discovered by ${el.discovered_by}.` : "Discovery unknown."
    ];
}
