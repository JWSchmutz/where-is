const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemLocations = document.getElementById("itemLocations");
const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("searchInput");

// Load items from localStorage
let items = JSON.parse(localStorage.getItem("houseItems")) || [];

// Render items (with optional filtering)
function renderItems(filter = "") {
  itemList.innerHTML = "";

  // Sort items alphabetically by name
  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

  sortedItems.forEach((item, index) => {
    if (!item.name.toLowerCase().includes(filter.toLowerCase())) return;

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

  if (itemForm.dataset.editIndex) {
    const index = itemForm.dataset.editIndex;
    items[index] = { name, locations };
    delete itemForm.dataset.editIndex;
  } else {
    items.push({ name, locations });
  }

  localStorage.setItem("houseItems", JSON.stringify(items));
  itemForm.reset();
  renderItems(searchInput.value);
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
    renderItems(searchInput.value);
  }
}

// Search input
searchInput.addEventListener("input", () => {
  renderItems(searchInput.value);
});

// Initial render
renderItems();
