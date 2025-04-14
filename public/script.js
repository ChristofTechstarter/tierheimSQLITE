const buttonShowAnimals = document.getElementById("button_show_animals");
const showAnimals = document.getElementById("show_animals");

const tierartInput = document.getElementById("tierartInput");
const NameInput = document.getElementById("NameInput");
const KrankheitInput = document.getElementById("KrankheitInput");
const ageInput = document.getElementById("ageInput");
const gewichtInput = document.getElementById("gewichtInput");
const buttonAddAnimal = document.getElementById("addAnimal");
const addAnswerContainer = document.getElementById("addAnswerContainer");

function convertDataToTable(array) {
  let table = `<table border="1">
                    <thead>
                      <tr>
                        <th>Tierart</th>
                        <th>Name</th>
                        <th>Krankheit</th>
                        <th>Alter</th>
                        <th>Gewicht</th>
                      </tr>
                    </thead>
                    <tbody>`;

  array.forEach((tier) => {
    table += `<tr>
                    <td>${tier.tierart}</td>
                    <td>${tier.name}</td>
                    <td>${tier.krankheit}</td>
                    <td>${tier.age}</td>
                    <td>${tier.gewicht}</td>
            </tr>`;
  });

  table += `</tbody></table>`;
  return table;
}

buttonShowAnimals.addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/tiere");
  const data = await res.json();
  showAnimals.innerHTML = convertDataToTable(data);
});

buttonAddAnimal.addEventListener("click", async () => {
  addAnswerContainer.innerHTML = "";

  if (
    !tierartInput.value ||
    !NameInput.value ||
    !KrankheitInput.value ||
    !ageInput.value ||
    !gewichtInput.value
  ) {
    return (addAnswerContainer.innerHTML = `<p style="color: red">Du hast nicht alle Felder ausgefüllt!</p>`);
  }

  const res = await fetch("http://localhost:3000/tiere", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tierart: tierartInput.value,
      name: NameInput.value,
      krankheit: KrankheitInput.value,
      age: ageInput.value,
      gewicht: gewichtInput.value,
    }),
  });

  return (addAnswerContainer.innerHTML = `<p style="color: green">${NameInput.value} wurde erfolgreich hinzugefügt!</p>`);
});
