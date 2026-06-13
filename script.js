const button = document.querySelector("button");
const form = document.querySelector(".form");

button.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input");

  const title = inputs[0].value;
  const price = inputs[1].value;
  const district = inputs[2].value;
  const contact = inputs[3].value;

  if (!title || !price) {
    showMessage("Заполни название задания и оплату");
    return;
  }

  const card = document.createElement("div");
  card.className = "job";

  card.innerHTML = `
    <h3>${title}</h3>
    <b>${price}</b>
    <p>${district}</p>
    <p>Контакт: ${contact}</p>
  `;

  document.getElementById("jobs").appendChild(card);

  inputs.forEach(input => {
    input.value = "";
  });

  showMessage("✅ Задание опубликовано!");
});

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
