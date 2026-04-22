document.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");

const search = document.getElementById("search");

const quizPanel = document.getElementById("quizPanel");

let elements = {};
let quizSet = [];

/* ---------------- LOAD TABLE ---------------- */
fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(r => r.json())
.then(data => {

data.elements.forEach(el => {

if(!el.xpos || !el.ypos) return;

elements[el.symbol] = el;

const div = document.createElement("div");
div.className = "element";

div.innerHTML = `${el.number}<br>${el.symbol}`;

div.style.gridColumn = el.xpos;
div.style.gridRow = el.ypos;

div.onclick = () => openModal(el.symbol);

table.appendChild(div);
});

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
<p>Category: ${el.category}</p>
`;
}

document.getElementById("close").onclick =
()=>modal.classList.remove("show");

/* ---------------- SEARCH ---------------- */
search.oninput = e => {
const v = e.target.value.toLowerCase();

document.querySelectorAll(".element").forEach(el => {
el.style.opacity =
el.innerText.toLowerCase().includes(v) ? "1" : "0.2";
});
};

/* ---------------- QUIZ ---------------- */
document.getElementById("quizBtn").onclick = () => {
quizPanel.classList.add("show");
loadQuiz();
};

document.getElementById("closeQuiz").onclick = () => {
quizPanel.classList.remove("show");
};

const questions = [
{ q:"Symbol of Hydrogen?", options:["H","He"], answer:"H" },
{ q:"Atomic number of Helium?", options:["1","2"], answer:"2" },
{ q:"Symbol of Oxygen?", options:["O","Ox"], answer:"O" }
];

function loadQuiz(){
quizSet = questions.sort(()=>0.5-Math.random()).slice(0,2);

const quiz = document.getElementById("quiz");
quiz.innerHTML = "";

quizSet.forEach((q,i)=>{

let div = document.createElement("div");
div.innerHTML = `<p>${q.q}</p>`;

q.options.forEach(o=>{
div.innerHTML += `
<label>
<input type="radio" name="q${i}" value="${o}">
${o}
</label><br>
`;
});

quiz.appendChild(div);
});
}

window.checkAnswers = function(){
let score = 0;

quizSet.forEach((q,i)=>{
const sel = document.querySelector(`input[name=q${i}]:checked`);
if(sel && sel.value === q.answer) score++;
});

alert("Score: " + score + "/" + quizSet.length);
};

});
