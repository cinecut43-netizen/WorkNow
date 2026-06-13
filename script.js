const button = document.querySelector(".form button");
const form = document.querySelector(".form");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

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
  }
];

button.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input");
  const select = form.querySelector("select");

  const job = {
    id: Date.now(),
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

  localStorage.setItem(
    "worknow_jobs",
    JSON.stringify(jobs)
  );

  renderJobs();

  inputs.forEach(input => input.value = "");
  select.selectedIndex = 0;

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
      job.district.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "Все" ||
      job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filteredJobs.length === 0) {
    jobList.innerHTML =
      "<p>Заданий не найдено.</p>";
    return;
  }

  filteredJobs.forEach(job => {
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

      <button onclick="showContact('${job.contact}')">
        Откликнуться
      </button>

      <button
        style="
          background:#ef4444;
          color:white;
          margin-top:8px;
        "
        onclick="deleteJob(${job.id})"
      >
        Удалить
      </button>
    </div>
  `;

  jobList.appendChild(card);
}

function deleteJob(id) {
  jobs = jobs.filter(job => job.id !== id);

  localStorage.setItem(
    "worknow_jobs",
    JSON.stringify(jobs)
  );

  renderJobs();

  showMessage("🗑️ Задание удалено");
}

function showContact(contact) {
  showMessage(
    "Контакт заказчика: " + contact
  );
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "Все";

  renderJobs();
}

function showMessage(text) {
  const message =
    document.createElement("div");

  message.innerText = text;

  message.style.position = "fixed";
  message.style.bottom = "20px";
  message.style.right = "20px";
  message.style.background = "#39e75f";
  message.style.color = "#071936";
  message.style.padding = "15px 20px";
  message.style.borderRadius = "12px";
  message.style.fontWeight = "bold";
  message.style.boxShadow =
    "0 8px 25px rgba(0,0,0,0.2)";
  message.style.zIndex = "9999";

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

renderJobs();
