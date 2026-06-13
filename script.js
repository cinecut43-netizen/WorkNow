const button = document.querySelector("button");
const form = document.querySelector(".form");
const jobsSection = document.getElementById("jobs");

let jobs = JSON.parse(localStorage.getItem("worknow_jobs")) || [];

function renderJobs() {
  jobs.forEach(job => {
    createJobCard(job);
  });
}

button.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input");

  const job = {
    title: inputs[0].value,
    price: inputs[1].value,
    district: inputs[2].value,
    contact: inputs[3].value
  };

  if (!job.title || !job.price) {
    showMessage("Заполни название задания и оплату");
    return;
  }

  jobs.push(job);
  localStorage.setItem("worknow_jobs", JSON.stringify(jobs));

  createJobCard(job);

  inputs.forEach(input => input.value = "");

  showMessage("✅ Задание опубликовано!");
});

function createJobCard(job) {
  const card = document.createElement("div");
  card.className = "job";

  card.innerHTML = `
    <h3>${job.title}</h3>
    <b>${job.price}</b>
    <p>${job.district}</p>
    <p>Контакт: ${job.contact}</p>
  `;

  jobsSection.appendChild(card);
}

function showMessage(text) {
  const message = document.createElement("div");
  message.innerText = text;

  message.style.position = "fixed";
  message.style.bottom = "20px";
  message.style.right = "20px";
  message.style.background = "#39e75f";
  message.style.color = "#071936";
  message.style.padding = "15px 20px";
  message.style.borderRadius = "12px";
  message.style.fontWeight = "bold";
  message.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
  message.style.zIndex = "9999";

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

renderJobs();
