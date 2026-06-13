const button = document.querySelector(".form button");
const form = document.querySelector(".form");
const jobsSection = document.getElementById("jobs");

let jobs = JSON.parse(localStorage.getItem("worknow_jobs")) || [];

button.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input");

  const job = {
    title: inputs[0].value,
    price: inputs[1].value,
    district: inputs[2].value,
    contact: inputs[3].value
  };

  if (!job.title || !job.price || !job.contact) {
    showMessage("Заполни название, оплату и контакт");
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
    <div>
      <span class="tag">Новое</span>
      <h3>${job.title}</h3>
      <p>${job.district}</p>
      <p><b>Контакт:</b> ${job.contact}</p>
    </div>
    <div class="job-side">
      <b>${job.price}</b>
      <button onclick="respondJob()">Откликнуться</button>
    </div>
  `;

  jobsSection.appendChild(card);
}

function respondJob() {
  showMessage("Свяжитесь с заказчиком по указанному контакту");
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

jobs.forEach(job => createJobCard(job));
