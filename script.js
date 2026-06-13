const button = document.querySelector(".form button");
const form = document.querySelector(".form");
const jobsSection = document.getElementById("jobs");

let jobs = JSON.parse(localStorage.getItem("worknow_jobs")) || [
  {
    title: "Помочь с переездом",
    price: "5000 ₽",
    district: "м. Сокол • Сегодня 18:00",
    category: "Переезд",
    contact: "+7 999 000-00-00"
  },
  {
    title: "Разгрузить машину",
    price: "3000 ₽",
    district: "Люблино • Завтра утром",
    category: "Разгрузка",
    contact: "+7 999 111-11-11"
  },
  {
    title: "Курьер на 2 часа",
    price: "1800 ₽",
    district: "Центр • Сегодня до 16:00",
    category: "Курьер",
    contact: "@worknow_test"
  }
];

button.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input");
  const select = form.querySelector("select");

  const job = {
    title: inputs[0].value,
    price: inputs[1].value,
    district: inputs[2].value,
    category: select.value,
    contact: inputs[3].value
  };

  if (!job.title || !job.price || !job.district || !job.contact) {
    showMessage("Заполни все поля");
    return;
  }

  jobs.unshift(job);
  localStorage.setItem("worknow_jobs", JSON.stringify(jobs));

  renderJobs();

  inputs.forEach(input => input.value = "");
  select.selectedIndex = 0;

  showMessage("✅ Задание опубликовано!");
});

function renderJobs() {
  jobsSection.innerHTML = "<h2>Свежие задания</h2>";

  jobs.forEach(job => {
    createJobCard(job);
  });
}

function createJobCard(job) {
  const card = document.createElement("div");
  card.className = "job";

  card.innerHTML = `
    <div>
      <span class="tag">${job.category}</span>
      <h3>${job.title}</h3>
      <p>${job.district}</p>
    </div>
    <div class="job-side">
      <b>${job.price}</b>
      <button onclick="showContact('${job.contact}')">Откликнуться</button>
    </div>
  `;

  jobsSection.appendChild(card);
}

function showContact(contact) {
  showMessage("Контакт заказчика: " + contact);
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
