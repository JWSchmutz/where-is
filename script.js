const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemLocations = document.getElementById("itemLocations");
const itemList = document.getElementById("itemList");

// Load items from localStorage
let items = JSON.parse(localStorage.getItem("houseItems")) || [];

// Render items
function renderItems() {
  itemList.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");

    // Display each location on its own line
    const locationsHtml = item.locations
      .map((loc) => `<div>${loc}</div>`)
      .join("");

    li.innerHTML = `
            <strong>${item.name}</strong>
            <span class="locations">${locationsHtml}</span>
            <div>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
    itemList.appendChild(li);
  });
}

// Add or update item
itemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = itemName.value.trim();
  const locations = itemLocations.value
    .split(",")
    .map((loc) => loc.trim())
    .filter(Boolean);

  if (!name || locations.length === 0) return;

  // Editing
  if (itemForm.dataset.editIndex) {
    const index = itemForm.dataset.editIndex;
    items[index] = { name, locations };
    delete itemForm.dataset.editIndex;
  } else {
    items.push({ name, locations });
  }

  localStorage.setItem("houseItems", JSON.stringify(items));
  itemForm.reset();
  renderItems();
});

// Edit item
function editItem(index) {
  const item = items[index];
  itemName.value = item.name;
  itemLocations.value = item.locations.join(", ");
  itemForm.dataset.editIndex = index;
}

// Delete item
function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    items.splice(index, 1);
    localStorage.setItem("houseItems", JSON.stringify(items));
    renderItems();
  }
}

// Initial render
renderItems();
