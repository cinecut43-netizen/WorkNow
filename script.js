const button = document.querySelector(".form button");
const form = document.querySelector(".form");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const categoryFilter = document.getElementById("categoryFilter");

let jobs = JSON.parse(localStorage.getItem("worknow_jobs")) || [
  {
    id: 1,
    title: "Помощь с переездом",
    price: "5000 ₽",
    city: "Москва",
    district: "м. Сокол • Сегодня 18:00",
    category: "Переезд",
    contact: "+7 999 000-00-00",
    description: "Нужно помочь перенести коробки. Работа примерно на 3 часа."
  },
  {
    id: 2,
    title: "Курьер на 2 часа",
    price: "1800 ₽",
    city: "Санкт-Петербург",
    district: "Центр • Сегодня до 16:00",
    category: "Курьер",
    contact: "@worknow_test",
    description: "Нужно отвезти документы по двум адресам."
  },
  {
    id: 3,
    title: "Разгрузить машину",
    price: "3000 ₽",
    city: "Алматы",
    district: "Бостандыкский район • Завтра утром",
    category: "Разгрузка",
    contact: "@client_almaty",
    description: "Нужен помощник для разгрузки товара."
  }
];

let responses = JSON.parse(localStorage.getItem("worknow_responses")) || [];
let profile = JSON.parse(localStorage.getItem("worknow_profile")) || {
  name: "",
  city: "",
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
    city: inputs[2].value,
    district: inputs[3].value,
    category: select.value,
    contact: inputs[4].value,
    description: textarea.value
  };

  if (!job.title || !job.price || !job.city || !job.district || !job.contact) {
    showMessage("Заполни название, оплату, город, район и контакт");
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
cityFilter.addEventListener("input", renderJobs);
categoryFilter.addEventListener("change", renderJobs);

function renderJobs() {
  const searchText = searchInput.value.toLowerCase();
  const cityText = cityFilter.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  jobList.innerHTML = "";

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText) ||
      job.district.toLowerCase().includes(searchText) ||
      (job.description || "").toLowerCase().includes(searchText);

    const matchesCity =
      !cityText || job.city.toLowerCase().includes(cityText);

    const matchesCategory =
      selectedCategory === "Все" || job.category === selectedCategory;

    return matchesSearch && matchesCity && matchesCategory;
  });

  if (filteredJobs.length === 0) {
    jobList.innerHTML = "<p>Заданий не найдено.</p>";
    return;
  }

  filteredJobs.forEach(job => createJobCard(job));
}

function getCategoryIcon(category) {
  const icons = {
    "Переезд": "📦",
    "Разгрузка": "🚚",
    "Курьер": "🛵",
    "Сборка мебели": "🪑",
    "Уборка": "🧹",
    "Мероприятия": "🎫"
  };

  return icons[category] || "⚡";
}

function createJobCard(job) {
  const card = document.createElement("div");
  card.className = "job";

  card.innerHTML = `
    <div class="job-icon">${getCategoryIcon(job.category)}</div>

    <div>
      <span class="tag">${job.category}</span>
      <span class="city-tag">${job.city}</span>
      <h3>${job.title}</h3>
      <p class="description">${job.description || "Описание не указано."}</p>
      <p>📍 ${job.district}</p>
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
    city: job.city,
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
      <p>${response.price} • ${response.city}</p>
      <p>Контакт: ${response.contact}</p>
    `;
    responsesList.appendChild(item);
  });
}

function resetFilters() {
  searchInput.value = "";
  cityFilter.value = "";
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
  profile.city = document.getElementById("userCity").value;
  profile.phone = document.getElementById("userPhone").value;

  localStorage.setItem("worknow_profile", JSON.stringify(profile));
  renderProfile();

  showMessage("✅ Профиль сохранён");
}

function renderProfile() {
  document.getElementById("savedName").innerText = profile.name || "Не указано";
  document.getElementById("savedCity").innerText = profile.city || "Не указан";
  document.getElementById("savedPhone").innerText = profile.phone || "Не указан";
  document.getElementById("savedRole").innerText = profile.role || "Не выбрана";

  document.getElementById("roleBadge").innerText = profile.city
    ? profile.city
    : "Город не выбран";
}

function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab");

  tabs.forEach(tab => tab.classList.remove("active-content"));
  buttons.forEach(button => button.classList.remove("active"));

  document.getElementById(tabId).classList.add("active-content");

  if (tabId === "profileTab") {
    buttons[0].classList.add("active");
  } else {
    buttons[1].classList.add("active");
  }
}

function showMessage(text) {
  const message = document.createElement("div");
  message.innerText = text;

  message.style.position = "fixed";
  message.style.bottom = "20px";
  message.style.right = "20px";
  message.style.background = "#22c55e";
  message.style.color = "white";
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
