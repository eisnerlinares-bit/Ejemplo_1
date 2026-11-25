// Para cambiar las preguntas, edita este arreglo.
// type: "text" (respuesta escrita) o "choice" (opción múltiple).
const questions = [
  {
  {
    type: "text",
    text: "¿Cuál es el segundo nombre de Eisner?",
    answers: ["smith"],
    fact: "Su segundo nombre es Smith."
  },
  },
  {
    type: "choice",
    text: "¿Cuál es su color favorito?",
    options: ["Azul", "Morado", "Verde", "Rojo"],
    answer: "Morado",
    fact: "El morado es su color favorito (y el de esta página)."
  },
  {
    type: "choice",
    text: "¿Qué videojuego juega?",
    options: ["Celeste", "Hades", "Hollow Knight", "Undertale"],
    answer: "Hollow Knight",
    fact: "Juega Hollow Knight. De ahí el recipiente de alma."
  },
  {
    type: "choice",
    text: "¿A qué cantante canta o escucha?",
    options: ["YOASOBI", "Ado", "Aimer", "LiSA"],
    answer: "Ado",
    fact: "Le gusta cantar y escuchar a Ado."
  },
  {
    type: "choice",
    text: "¿Cuál es su comida favorita?",
    options: ["Bandeja paisa", "Ajiaco", "Sancocho", "Arepas"],
    answer: "Sancocho",
    fact: "Su comida favorita es el sancocho."
  }
];

const $ = (id) => document.getElementById(id);

const startView = $("startView");
const questionView = $("questionView");
const resultView = $("resultView");
const vesselFill = $("vesselFill");
const optionsEl = $("options");
const textForm = $("textForm");
const textInput = $("textInput");
const feedback = $("feedback");
const feedbackText = $("feedbackText");
const nextBtn = $("nextBtn");

let current = 0;
let score = 0;

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function updateVessel() {
  vesselFill.style.height = (score / questions.length) * 100 + "%";
}

function show(view) {
  [startView, questionView, resultView].forEach((v) => (v.hidden = v !== view));
}

function startQuiz() {
  current = 0;
  score = 0;
  updateVessel();
  $("progressText").textContent = "Cada respuesta correcta llena el recipiente.";
  show(questionView);
  renderQuestion();
}

function renderQuestion() {
  const q = questions[current];
  $("counter").textContent = "Pregunta " + (current + 1) + " de " + questions.length;
  $("questionText").textContent = q.text;
  feedback.hidden = true;
  optionsEl.innerHTML = "";
  textInput.value = "";

  if (q.type === "text") {
    optionsEl.hidden = true;
    textForm.hidden = false;
    textInput.disabled = false;
    textForm.querySelector("button").disabled = false;
    textInput.focus();
  } else {
    textForm.hidden = true;
    optionsEl.hidden = false;
    q.options.forEach((option) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = option;
      btn.addEventListener("click", () => answerChoice(btn, option));
      li.appendChild(btn);
      optionsEl.appendChild(li);
    });
  }
}

function finishAnswer(isCorrect) {
  const q = questions[current];
  if (isCorrect) {
    score++;
    updateVessel();
  }
  feedbackText.className = isCorrect ? "ok" : "no";
  feedbackText.textContent = (isCorrect ? "Correcto. " : "No exactamente. ") + q.fact;
  nextBtn.textContent = current === questions.length - 1 ? "Ver resultado" : "Siguiente pregunta";
  feedback.hidden = false;
  nextBtn.focus();
}

function answerChoice(btn, option) {
  const q = questions[current];
  const isCorrect = option === q.answer;
  optionsEl.querySelectorAll("button").forEach((b) => {
    b.disabled = true;
    if (b.textContent === q.answer) b.classList.add("correct");
  });
  if (!isCorrect) btn.classList.add("wrong");
  finishAnswer(isCorrect);
}

textForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const q = questions[current];
  const isCorrect = q.answers.includes(normalize(textInput.value));
  textInput.disabled = true;
  textForm.querySelector("button").disabled = true;
  finishAnswer(isCorrect);
});

nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  const total = questions.length;
  let message;
  if (score === total) message = "Lo sabes todo. Conoces muy bien a Eisner.";
  else if (score >= total - 1) message = "Casi perfecto. Solo se te escapó un detalle.";
  else if (score >= Math.ceil(total / 2)) message = "Vas bien, pero aún te falta conocerlo un poco más.";
  else message = "Todavía te falta. Pregúntale por sus gustos y vuelve a intentarlo.";

  $("scoreText").textContent = score + " de " + total;
  $("resultMessage").textContent = message;
  $("progressText").textContent = "Quiz terminado.";
  show(resultView);
}

$("startBtn").addEventListener("click", startQuiz);
$("restartBtn").addEventListener("click", startQuiz);
