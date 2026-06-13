const button = document.querySelector(".form button");
const form = document.querySelector(".form");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let jobs = JSON.parse(localStorage.getItem("worknow_jobs")) || [
  {
    id: 1,
    title: "Помочь с переездом",
    price: "5000 ₽",
    district: "м. Сокол • Сегодня 18:00",
    category: "Переезд",
    contact: "+7 999 000-00-00",
    description: "Нужно помочь перенести коробки. Работа примерно на 3 часа."
  },
  {
    id: 2,
    title: "Курьер на 2 часа",
    price: "1800 ₽",
    district: "Центр • Сегодня до 16:00",
    category: "Курьер",
    contact: "@worknow_test",
    description: "Нужно отвезти документы по двум адресам."
  }
];

let responses = JSON.parse(localStorage.getItem("worknow_responses")) || [];
let profile = JSON.parse(localStorage.getItem("worknow_profile")) || {
  name: "",
  phone: "",
  role: ""
};

button.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input");
  const select = form.querySelector("select");
  const textarea = form.querySelector("textarea");

  const job = {
    id: Date.now(),
    title: inputs[0].value,
    price: inputs[1].value,
    district: inputs[2].value,
    category: select.value,
    contact: inputs[3].value,
    description: textarea.value
  };

  if (!job.title || !job.price || !job.district || !job.contact) {
    showMessage("Заполни название, оплату, район и контакт");
    return;
  }

  jobs.unshift(job);
  localStorage.setItem("worknow_jobs", JSON.stringify(jobs));

  inputs.forEach(input => input.value = "");
  textarea.value = "";
  select.selectedIndex = 0;

  renderJobs();
  showMessage("✅ Задание опубликовано!");
});

searchInput.addEventListener("input", renderJobs);
categoryFilter.addEventListener("change", renderJobs);

function renderJobs() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  jobList.innerHTML = "";

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText) ||
      job.district.toLowerCase().includes(searchText) ||
      (job.description || "").toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "Все" || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filteredJobs.length === 0) {
    jobList.innerHTML = "<p>Заданий не найдено.</p>";
    return;
  }

  filteredJobs.forEach(job => createJobCard(job));
}

function createJobCard(job) {
  const card = document.createElement("div");
  card.className = "job";

  card.innerHTML = `
    <div>
      <span class="tag">${job.category}</span>
      <h3>${job.title}</h3>
      <p>${job.district}</p>
      <p class="description">${job.description || "Описание не указано."}</p>
    </div>

    <div class="job-side">
      <b>${job.price}</b>
      <button onclick="respondToJob(${job.id})">Откликнуться</button>
    </div>
  `;

  jobList.appendChild(card);
}

function respondToJob(id) {
  const job = jobs.find(item => item.id === id);

  responses.unshift({
    id: Date.now(),
    title: job.title,
    price: job.price,
    contact: job.contact
  });

  localStorage.setItem("worknow_responses", JSON.stringify(responses));
  renderResponses();

  showMessage("✅ Отклик отправлен. Контакт: " + job.contact);
}

function renderResponses() {
  const responsesList = document.getElementById("responsesList");

  if (responses.length === 0) {
    responsesList.innerHTML = "<p>Откликов пока нет.</p>";
    return;
  }

  responsesList.innerHTML = "";

  responses.forEach(response => {
    const item = document.createElement("div");
    item.className = "message";
    item.innerHTML = `
      <b>${response.title}</b>
      <p>${response.price}</p>
      <p>Контакт: ${response.contact}</p>
    `;
    responsesList.appendChild(item);
  });
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "Все";
  renderJobs();
}

function setRole(role) {
  profile.role = role;
  localStorage.setItem("worknow_profile", JSON.stringify(profile));
  renderProfile();
  showMessage("Роль выбрана: " + role);
}

function saveProfile() {
  profile.name = document.getElementById("userName").value;
  profile.phone = document.getElementById("userPhone").value;

  localStorage.setItem("worknow_profile", JSON.stringify(profile));
  renderProfile();

  showMessage("✅ Профиль сохранён");
}

function renderProfile() {
  document.getElementById("savedName").innerText = profile.name || "Не указано";
  document.getElementById("savedPhone").innerText = profile.phone || "Не указан";
  document.getElementById("savedRole").innerText = profile.role || "Не выбрана";

  document.getElementById("roleBadge").innerText = profile.role
    ? "Роль: " + profile.role
    : "Москва";
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
renderResponses();
renderProfile();
