const button = document.querySelector(".form button");
const form = document.querySelector(".form");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
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
      selectedCategory === "Все" || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filteredJobs.length === 0) {
    jobList.innerHTML = "<p>Заданий не найдено.</p>";
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
      <button onclick="showContact('${job.contact}')">Откликнуться</button>
    </div>
  `;

  jobList.appendChild(card);
}

function showContact(contact) {
  showMessage("Контакт заказчика: " + contact);
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "Все";
  renderJobs();
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
