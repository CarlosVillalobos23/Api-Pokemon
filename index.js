let currentPokemon = null;
const team = [];

const searchInput = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnRandom = document.getElementById("btnRandom");
const cardContainer = document.getElementById("cardContainer");
const teamTableBody = document.getElementById("teamTableBody");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

btnSearch.addEventListener("click", searchPokemon);
btnRandom.addEventListener("click", getRandomPokemon);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchPokemon();
});

async function fetchPokemon(param) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${param}`);
    if (!response.ok) throw new Error("Pokémon no encontrado");
    const data = await response.json();
    currentPokemon = data;
    renderCard(data);
  } catch (err) {
    alert(err.message);
  }
}

function searchPokemon() {
  const query = searchInput.value.trim().toLowerCase();
  if (query) fetchPokemon(query);
}

function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 150) + 1;
  fetchPokemon(randomId);
}

function renderCard(pokemon) {
  const types = pokemon.types.map((t) => t.type.name).join(", ");
  const defaultImg = "https://via.placeholder.com/150?text=No+Image";

  cardContainer.innerHTML = `
    <div class="col-md-4">
      <div class="card shadow-sm text-center">
        <img src="${pokemon.sprites.front_default || defaultImg}" class="card-img-top p-3" alt="${pokemon.name}">
        <div class="card-body">
          <h5 class="card-title text-capitalize">${pokemon.name} (#${pokemon.id})</h5>
          <p class="card-text"><strong>Tipo:</strong> ${types}</p>
          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#detailsModal" onclick="showDetails()">Ver más</button>
            <button class="btn btn-success" onclick="addToTable()">Añadir a Tabla</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showDetails() {
  if (!currentPokemon) return;

  modalTitle.innerText = `${currentPokemon.name.toUpperCase()} (#${currentPokemon.id})`;

  const stats = currentPokemon.stats
    .map((s) => `<li><strong>${s.stat.name}:</strong> ${s.base_stat}</li>`)
    .join("");
  const abilities = currentPokemon.abilities.map((a) => a.ability.name).join(", ");

  modalBody.innerHTML = `
    <div class="text-center mb-3">
      <img src="${currentPokemon.sprites.front_default}" alt="${currentPokemon.name}">
      <img src="${currentPokemon.sprites.back_default}" alt="${currentPokemon.name}">
    </div>
    <p><strong>Altura:</strong> ${currentPokemon.height / 10} m</p>
    <p><strong>Peso:</strong> ${currentPokemon.weight / 10} kg</p>
    <p><strong>Habilidades:</strong> ${abilities}</p>
    <h6>Estadísticas base:</h6>
    <ul>${stats}</ul>
  `;
}

function addToTable() {
  if (!currentPokemon) return;

  if (team.length >= 6) {
    alert("La tabla ya contiene el límite máximo de 6 Pokémon.");
    return;
  }

  const exists = team.some((p) => p.id === currentPokemon.id);
  if (exists) {
    alert("Este Pokémon ya existe en la tabla.");
    return;
  }

  team.push(currentPokemon);
  renderTable();
}

function renderTable() {
  teamTableBody.innerHTML = team
    .map(
      (p, index) => `
    <tr>
      <td>#${p.id}</td>
      <td><img src="${p.sprites.front_default}" height="40" alt="${p.name}"></td>
      <td class="text-capitalize">${p.name}</td>
      <td>${p.types.map((t) => t.type.name).join(", ")}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="removeFromTable(${index})">Eliminar</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function removeFromTable(index) {
  team.splice(index, 1);
  renderTable();
}