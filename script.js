const formButton = document.querySelector(".form button");
const form = document.querySelector(".form");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const categoryFilter = document.getElementById("categoryFilter");

let currentUser = null;
let jobs = [];
let responses = JSON.parse(localStorage.getItem("worknow_responses")) || [];

let profile = JSON.parse(localStorage.getItem("worknow_profile")) || {
  name: "",
  city: "",
  phone: "",
  role: ""
};

setTimeout(() => {
  if (window.onAuthStateChanged) {
    window.onAuthStateChanged(window.auth, (user) => {
      currentUser = user;

      const status = document.getElementById("authStatus");
      const authBox = document.querySelector(".auth-box");

      if (status) {
        status.innerText = user ? user.email : "Не выполнен вход";
      }

      if (authBox) {
        authBox.style.display = user ? "none" : "block";
      }

      renderMyJobs();
    });
  }

  loadJobsFromFirebase();
  renderResponses();
  renderProfile();
}, 1000);

async function registerUser() {
  const email = document.getElementById("authEmail")?.value;
  const password = document.getElementById("authPassword")?.value;

  if (!email || !password) {
    showMessage("Введите email и пароль");
    return;
  }

  try {
    await window.createUserWithEmailAndPassword(window.auth, email, password);
    showMessage("✅ Аккаунт создан");
  } catch (error) {
    showMessage("Ошибка регистрации: " + error.message);
  }
}

async function loginUser() {
  const email = document.getElementById("authEmail")?.value;
  const password = document.getElementById("authPassword")?.value;

  if (!email || !password) {
    showMessage("Введите email и пароль");
    return;
  }

  try {
    await window.signInWithEmailAndPassword(window.auth, email, password);
    showMessage("✅ Вход выполнен");
  } catch (error) {
    showMessage("Ошибка входа: " + error.message);
  }
}

async function logoutUser() {
  try {
    await window.signOut(window.auth);
    showMessage("Вы вышли из аккаунта");
  } catch (error) {
    showMessage("Ошибка выхода: " + error.message);
  }
}

async function loadJobsFromFirebase() {
  if (!jobList && !document.getElementById("myJobsList")) return;

  if (jobList) {
    jobList.innerHTML = "<p>Загружаем задания...</p>";
  }

  try {
    const querySnapshot = await window.getDocs(
      window.collection(window.db, "jobs")
    );

    jobs = [];

    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    renderJobs();
    renderMyJobs();
  } catch (error) {
    console.error(error);

    if (jobList) {
      jobList.innerHTML = "<p>Ошибка загрузки заданий из Firebase.</p>";
    }
  }
}

if (formButton && form) {
  formButton.addEventListener("click", async () => {
    if (!currentUser) {
      showMessage("Сначала войдите в аккаунт");
      return;
    }

    const inputs = form.querySelectorAll("input");
    const select = form.querySelector("select");
    const textarea = form.querySelector("textarea");

    const job = {
      title: inputs[0].value,
      price: inputs[1].value,
      city: inputs[2].value,
      district: inputs[3].value,
      category: select.value,
      contact: inputs[4].value,
      description: textarea.value,
      userEmail: currentUser.email,
      userId: currentUser.uid,
      createdAt: new Date().toISOString()
    };

    if (!job.title || !job.price || !job.city || !job.district || !job.contact) {
      showMessage("Заполни название, оплату, город, район и контакт");
      return;
    }

    try {
      await window.addDoc(window.collection(window.db, "jobs"), job);

      inputs.forEach(input => input.value = "");
      textarea.value = "";
      select.selectedIndex = 0;

      showMessage("✅ Задание опубликовано!");
      loadJobsFromFirebase();
    } catch (error) {
      console.error(error);
      showMessage("Ошибка публикации задания");
    }
  });
}

if (searchInput) searchInput.addEventListener("input", renderJobs);
if (cityFilter) cityFilter.addEventListener("input", renderJobs);
if (categoryFilter) categoryFilter.addEventListener("change", renderJobs);

function renderJobs() {
  if (!jobList) return;

  const searchText = searchInput ? searchInput.value.toLowerCase() : "";
  const cityText = cityFilter ? cityFilter.value.toLowerCase() : "";
  const selectedCategory = categoryFilter ? categoryFilter.value : "Все";

  jobList.innerHTML = "";

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      (job.title || "").toLowerCase().includes(searchText) ||
      (job.district || "").toLowerCase().includes(searchText) ||
      (job.description || "").toLowerCase().includes(searchText);

    const matchesCity =
      !cityText || (job.city || "").toLowerCase().includes(cityText);

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
  if (!jobList) return;

  const card = document.createElement("div");
  card.className = "job";

  card.innerHTML = `
    <div class="job-icon">${getCategoryIcon(job.category)}</div>

    <div>
      <span class="tag">${job.category || "Задание"}</span>
      <span class="city-tag">${job.city || "Город не указан"}</span>
      <h3>${job.title || "Без названия"}</h3>
      <p class="description">${job.description || "Описание не указано."}</p>
      <p>📍 ${job.district || "Район не указан"}</p>
    </div>

    <div class="job-side">
      <b>${job.price || "Цена не указана"}</b>
      <button onclick="respondToJob('${job.id}')">Откликнуться</button>
    </div>
  `;

  jobList.appendChild(card);
}

function respondToJob(id) {
  if (!currentUser) {
    showMessage("Сначала войдите в аккаунт");
    return;
  }

  const job = jobs.find(item => item.id === id);

  if (!job) {
    showMessage("Задание не найдено");
    return;
  }

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

  if (!responsesList) return;

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
  if (searchInput) searchInput.value = "";
  if (cityFilter) cityFilter.value = "";
  if (categoryFilter) categoryFilter.value = "Все";

  renderJobs();
}

function setRole(role) {
  profile.role = role;
  localStorage.setItem("worknow_profile", JSON.stringify(profile));
  renderProfile();
  showMessage("Роль выбрана: " + role);
}

function saveProfile() {
  const nameInput = document.getElementById("userName");
  const cityInput = document.getElementById("userCity");
  const phoneInput = document.getElementById("userPhone");

  if (!nameInput || !cityInput || !phoneInput) return;

  profile.name = nameInput.value;
  profile.city = cityInput.value;
  profile.phone = phoneInput.value;

  localStorage.setItem("worknow_profile", JSON.stringify(profile));

  renderProfile();
  hideProfileForm();

  showMessage("✅ Профиль сохранён");
}

function renderProfile() {
  const savedName = document.getElementById("savedName");
  const savedCity = document.getElementById("savedCity");
  const savedPhone = document.getElementById("savedPhone");
  const savedRole = document.getElementById("savedRole");
  const roleBadge = document.getElementById("roleBadge");

  if (savedName) savedName.innerText = profile.name || "Не указано";
  if (savedCity) savedCity.innerText = profile.city || "Не указан";
  if (savedPhone) savedPhone.innerText = profile.phone || "Не указан";
  if (savedRole) savedRole.innerText = profile.role || "Не выбрана";

  if (roleBadge) {
    roleBadge.innerText = profile.city ? profile.city : "Город не выбран";
  }

  if (profile.name) {
    hideProfileForm();
  }
}

function hideProfileForm() {
  const userName = document.getElementById("userName");
  const userCity = document.getElementById("userCity");
  const userPhone = document.getElementById("userPhone");
  const saveBtn = document.getElementById("saveProfileBtn");
  const editBtn = document.getElementById("editProfileBtn");

  if (userName) userName.style.display = "none";
  if (userCity) userCity.style.display = "none";
  if (userPhone) userPhone.style.display = "none";
  if (saveBtn) saveBtn.style.display = "none";
  if (editBtn) editBtn.style.display = "inline-block";
}

function editProfile() {
  const userName = document.getElementById("userName");
  const userCity = document.getElementById("userCity");
  const userPhone = document.getElementById("userPhone");
  const saveBtn = document.getElementById("saveProfileBtn");
  const editBtn = document.getElementById("editProfileBtn");

  if (userName) {
    userName.style.display = "block";
    userName.value = profile.name || "";
  }

  if (userCity) {
    userCity.style.display = "block";
    userCity.value = profile.city || "";
  }

  if (userPhone) {
    userPhone.style.display = "block";
    userPhone.value = profile.phone || "";
  }

  if (saveBtn) saveBtn.style.display = "inline-block";
  if (editBtn) editBtn.style.display = "none";
}

function renderMyJobs() {
  const myJobsList = document.getElementById("myJobsList");

  if (!myJobsList) return;

  if (!currentUser) {
    myJobsList.innerHTML = "<p>Войдите в аккаунт, чтобы увидеть свои задания.</p>";
    return;
  }

  const myJobs = jobs.filter(job => job.userId === currentUser.uid);

  if (myJobs.length === 0) {
    myJobsList.innerHTML = "<p>У вас пока нет заданий.</p>";
    return;
  }

  myJobsList.innerHTML = "";

  myJobs.forEach(job => {
    const item = document.createElement("div");
    item.className = "message";

    item.innerHTML = `
      <b>${job.title}</b>
      <p>${job.price} • ${job.city}</p>
      <p>${job.description || "Описание не указано."}</p>
    `;

    myJobsList.appendChild(item);
  });
}

function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab");

  tabs.forEach(tab => tab.classList.remove("active-content"));
  buttons.forEach(button => button.classList.remove("active"));

  const activeTab = document.getElementById(tabId);

  if (activeTab) {
    activeTab.classList.add("active-content");
  }

  if (tabId === "profileTab" && buttons[0]) {
    buttons[0].classList.add("active");
  }

  if (tabId === "myJobsTab" && buttons[1]) {
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
