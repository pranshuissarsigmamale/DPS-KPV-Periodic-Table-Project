document.addEventListener("DOMContentLoaded", () => {

const table = document.getElementById("table");
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const content = document.getElementById("content");
const search = document.getElementById("search");

let elements = {};

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

/* LOAD */
fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
.then(r=>r.json())
.then(data=>{

  data.elements.forEach(el=>{

    if(el.number > 118) return;

    elements[el.symbol] = el;

    const div = document.createElement("div");
    div.className = "element " + getCategory(el.category);

    div.dataset.symbol = el.symbol;
    div.dataset.name = el.name;

    /* INDICATOR */
    if(el.number === 57){
      div.innerHTML = "57<br>*";
    }

    if(el.number === 89){
      div.innerHTML = "89<br>**";
    }

    /* POSITION */
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
      div.innerHTML = `${el.number}<br><b>${el.symbol}</b>`;
    }

    div.addEventListener("click", ()=>openModal(el.symbol));

    table.appendChild(div);
  });
});

/* MODAL */
function openModal(symbol){
  const el = elements[symbol];
  if(!el) return;

  modal.classList.add("show");

  title.innerText = el.name;

  content.innerHTML = `
    Atomic No: ${el.number}<br>
    Mass: ${el.atomic_mass}<br>
    Category: ${el.category}<br>
    Config: ${el.electron_configuration}
  `;
}

/* CLOSE MODAL */
document.getElementById("close").onclick = ()=>modal.classList.remove("show");

/* SEARCH */
search.addEventListener("input", ()=>{
  const v = search.value.toLowerCase();

  document.querySelectorAll(".element").forEach(el=>{
    el.style.opacity =
      !v ||
      el.dataset.name.toLowerCase().includes(v) ||
      el.dataset.symbol.toLowerCase().includes(v)
      ? "1":"0.2";
  });
});

/* QUIZ */
const quizPanel = document.getElementById("quizPanel");

document.getElementById("quizBtn").onclick = ()=>{
  quizPanel.classList.add("show");
  loadQuiz();
};

document.getElementById("closeQuiz").onclick = ()=>{
  quizPanel.classList.remove("show");
};

/* QUIZ LOGIC */
const allQuestions = [
  { q:"Symbol of Hydrogen?", options:["H","He"], answer:"H" },
  { q:"Atomic number of Helium?", options:["1","2"], answer:"2" }
];

let selected = [];

function loadQuiz(){
  selected = allQuestions.sort(()=>0.5-Math.random()).slice(0,2);
  const quiz = document.getElementById("quiz");
  quiz.innerHTML="";

  selected.forEach((q,i)=>{
    let div=document.createElement("div");
    div.innerHTML = `<p>${q.q}</p>`;
    q.options.forEach(o=>{
      div.innerHTML += `<input type="radio" name="q${i}" value="${o}">${o}<br>`;
    });
    quiz.appendChild(div);
  });
}

window.checkAnswers = function(){
  let score=0;
  selected.forEach((q,i)=>{
    let sel=document.querySelector(`input[name=q${i}]:checked`);
    if(sel && sel.value===q.answer) score++;
  });
  alert("Score: "+score);
}

window.resetQuiz = loadQuiz;

});
