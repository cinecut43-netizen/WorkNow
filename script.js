const button = document.querySelector("button");
const form = document.querySelector(".form");

button.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input");

  const title = inputs[0].value;
  const price = inputs[1].value;
  const district = inputs[2].value;
  const contact = inputs[3].value;

  if (!title || !price) {
    alert("Заполни название задания и оплату");
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

  inputs.forEach(input => input.value = "");

  alert("Задание опубликовано!");
});
