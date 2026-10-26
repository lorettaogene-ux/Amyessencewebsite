// AMY ESSENCE - Store & Backoffice Interactive Script Engine

let defaultProducts = [
    {
        id: 1,
        name: "Rose Royale Extrait",
        price: 35000,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
        desc: "A luxurious blend of damask rose, warm amber, and sweet vanilla. Long-lasting elegance."
    },
    {
        id: 2,
        name: "Midnight Velvet EDP",
        price: 42000,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
        desc: "Sensual dark orchid, black coffee, and warm patchouli notes for unforgettable evenings."
    }
];

let products = JSON.parse(localStorage.getItem("amy_essence_products")) || defaultProducts;
let cart = [];

function saveProducts() {
    localStorage.setItem("amy_essence_products", JSON.stringify(products));
    renderProducts();
    renderBackofficeTable();
}

// Render Customer Store Catalog Grid
function renderProducts() {
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    grid.innerHTML = "";
    if (products.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400">No perfumes in catalog yet. Open Backoffice to add your first perfume!</div>`;
        return;
    }
    products.forEach(product => {
        grid.innerHTML += `
            <div class="bg-white border border-pink-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <div class="cursor-pointer overflow-hidden rounded-2xl bg-pink-50 mb-4 h-64 flex items-center justify-center" onclick="openModal(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover group-hover:scale-105 transition duration-500">
                </div>
                <div class="cursor-pointer" onclick="openModal(${product.id})">
                    <h3 class="font-serif font-bold text-lg text-slate-900">${product.name}</h3>
                    <p class="text-xs text-slate-500 line-clamp-2 mt-1">${product.desc}</p>
                </div>
                <div class="mt-4 flex items-center justify-between">
                    <span class="font-bold text-brandDarkPink text-base">₦${Number(product.price).toLocaleString()}</span>
                    <button onclick="addToCart(${product.id})" class="bg-pink-100 hover:bg-brandDarkPink hover:text-white text-brandDarkPink px-4 py-2 rounded-xl text-xs font-bold transition">
                        Add to Bag 🛍️
                    </button>
                </div>
            </div>
        `;
    });
}

// Render Owner Backoffice Inventory Table
function renderBackofficeTable() {
    const tbody = document.getElementById("backoffice-inventory-table");
    if (!tbody) return;
    tbody.innerHTML = "";
    products.forEach(p => {
        tbody.innerHTML += `
            <tr class="border-b text-xs text-slate-700">
                <td class="p-3">
                    <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover">
                </td>
                <td class="p-3 font-semibold text-slate-900">${p.name}</td>
                <td class="p-3 font-bold text-brandDarkPink">₦${Number(p.price).toLocaleString()}</td>
                <td class="p-3">
                    <button onclick="deleteProduct(${p.id})" class="bg-red-100 hover:bg-red-200 text-red-600 font-bold px-3 py-1.5 rounded-lg transition">
                        Delete 🗑️
                    </button>
                </td>
            </tr>
        `;
    });
}

// Open Product Modal
function openModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
        <div class="h-72 bg-pink-50 overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-6 space-y-4">
            <h2 class="font-serif text-2xl font-bold text-slate-900">${product.name}</h2>
            <p class="text-xs text-slate-600 leading-relaxed">${product.desc}</p>
            <div class="flex items-center justify-between pt-2">
                <span class="text-xl font-bold text-brandDarkPink">₦${Number(product.price).toLocaleString()}</span>
                <button onclick="addToCart(${product.id}); closeModal();" class="bg-brandDarkPink text-white px-6 py-3 rounded-xl font-bold text-xs shadow hover:bg-pink-700 transition">
                    Add to Bag 🛍️
                </button>
            </div>
        </div>
    `;
    document.getElementById("product-modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("product-modal").classList.add("hidden");
}

// Cart Actions
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    toggleCartDrawer();
}

function updateCartUI() {
    const countEl = document.getElementById("cart-count");
    const itemsEl = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (countEl) countEl.textContent = totalCount;
    if (totalEl) totalEl.textContent = `₦${totalPrice.toLocaleString()}`;

    if (cart.length === 0) {
        if (itemsEl) itemsEl.innerHTML = `<p class="text-slate-400 text-center py-8 text-xs">Your bag is empty.</p>`;
        return;
    }

    if (itemsEl) {
        itemsEl.innerHTML = "";
        cart.forEach(item => {
            itemsEl.innerHTML += `
                <div class="flex items-center justify-between bg-pink-50/50 border border-pink-100 p-3 rounded-2xl">
                    <div class="flex items-center gap-3">
                        <img src="${item.image}" class="w-10 h-10 rounded-xl object-cover">
                        <div>
                            <h4 class="font-bold text-xs text-slate-800">${item.name}</h4>
                            <p class="text-xs text-brandDarkPink font-semibold">₦${Number(item.price).toLocaleString()} x ${item.qty}</p>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 font-bold text-xs px-2 py-1">Remove</button>
                </div>
            `;
        });
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function toggleCartDrawer() {
    document.getElementById("cart-drawer").classList.toggle("hidden");
}

// Navigation Views Toggle
function toggleBackoffice() {
    const backofficeView = document.getElementById("backoffice-view");
    const customerView = document.getElementById("customer-store-view");
    const btnText = document.getElementById("backoffice-btn-text");

    if (backofficeView.classList.contains("hidden")) {
        backofficeView.classList.remove("hidden");
        customerView.classList.add("hidden");
        btnText.textContent = "Close Backoffice";
        renderBackofficeTable();
    } else {
        showCustomerStore();
    }
}

function showCustomerStore() {
    document.getElementById("backoffice-view").classList.add("hidden");
    document.getElementById("customer-store-view").classList.remove("hidden");
    document.getElementById("backoffice-btn-text").textContent = "Owner Backoffice";
}

// Backoffice Item Management
function handleAddNewProduct(e) {
    e.preventDefault();
    const name = document.getElementById("new-name").value.trim();
    const price = parseFloat(document.getElementById("new-price").value);
    const image = document.getElementById("new-image").value.trim();
    const desc = document.getElementById("new-desc").value.trim();

    const newProduct = {
        id: Date.now(),
        name,
        price,
        image,
        desc
    };

    products.push(newProduct);
    saveProducts();
    document.getElementById("add-product-form").reset();
    alert(`"${name}" has been added to AMY ESSENCE catalog!`);
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this perfume from your store?")) {
        products = products.filter(p => p.id !== id);
        saveProducts();
    }
}

function copyAccountNumber() {
    const acctNo = document.getElementById("account-number").textContent;
    navigator.clipboard.writeText(acctNo);
    alert("GTBank account number copied: " + acctNo);
}

function checkoutViaWhatsApp() {
    if (cart.length === 0) {
        alert("Your bag is empty!");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    if (!name || !address) {
        alert("Please enter your Full Name and Delivery Address.");
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    let message = `🌸 *NEW ORDER - AMY ESSENCE* 🌸

`;
    message += `👤 *Customer Name:* ${name}
`;
    message += `📍 *Delivery Address:* ${address}

`;
    message += `📦 *Items Ordered:* 
`;
    
    cart.forEach(item => {
        message += `- ${item.name} (x${item.qty}) - ₦${(item.price * item.qty).toLocaleString()}
`;
    });

    message += `
💰 *Total Amount:* ₦${totalPrice.toLocaleString()}
`;
    message += `🏦 *Payment Method:* Direct Bank Transfer (GTBank)

`;
    message += `📎 *Attached:* [Please attach your payment receipt screenshot here]`;

    const whatsappNumber = "2348000000000"; // Replace with your WhatsApp phone number
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// Initialize Store View on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});
