// Общий скрипт для всех страниц
document.addEventListener("DOMContentLoaded", () => {
    initRegistrationPage();
    initShopPage();
});

function initRegistrationPage() {
    const registerForm = document.getElementById("pet-register-form");
    const loginForm = document.getElementById("pet-login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegisterSubmit);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }
}

function handleRegisterSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const messageEl = document.getElementById("registerMessage");

    const petData = {
        ownerName: form.ownerName.value.trim(),
        ownerEmail: form.ownerEmail.value.trim().toLowerCase(),
        ownerPassword: form.ownerPassword.value,
        petName: form.petName.value.trim(),
        petBreed: form.petBreed.value.trim(),
        petAge: form.petAge.value.trim(),
        petBirthdate: form.petBirthdate.value,
        chipNumber: form.chipNumber.value.trim(),
        ownerContacts: form.ownerContacts.value.trim(),
        city: form.city.value.trim(),
        vetInfo: form.vetInfo.value.trim(),
        food: form.food.value.trim(),
        character: form.character.value.trim(),
        createdAt: new Date().toISOString()
    };

    if (!petData.ownerEmail || !petData.ownerPassword || !petData.petName) {
        setFormMessage(messageEl, "Пожалуйста, заполните обязательные поля.", false);
        return;
    }

    const pets = getPetsFromStorage();

    const existing = pets.find(p => p.ownerEmail === petData.ownerEmail);
    if (existing) {
        setFormMessage(messageEl, "Пользователь с таким email уже существует. Используйте другой email или войдите.", false);
        return;
    }

    pets.push(petData);
    localStorage.setItem("rafli_pets", JSON.stringify(pets));

    setFormMessage(messageEl, "Профиль питомца успешно сохранён! Теперь можно войти в личный кабинет.", true);
    form.reset();
}

function handleLoginSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.loginEmail.value.trim().toLowerCase();
    const password = form.loginPassword.value;
    const messageEl = document.getElementById("loginMessage");
    const dashboard = document.getElementById("pet-dashboard");

    const pets = getPetsFromStorage();
    const found = pets.find(p => p.ownerEmail === email && p.ownerPassword === password);

    if (!found) {
        if (dashboard) dashboard.classList.add("hidden");
        setFormMessage(messageEl, "Неверный email или пароль. Попробуйте снова.", false);
        return;
    }

    setFormMessage(messageEl, "Успешный вход в личный кабинет.", true);
    if (dashboard) {
        fillDashboard(dashboard, found);
        dashboard.classList.remove("hidden");
    }
}

function getPetsFromStorage() {
    try {
        const raw = localStorage.getItem("rafli_pets");
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error("Ошибка чтения базы питомцев:", e);
        return [];
    }
}

function fillDashboard(dashboardEl, pet) {
    const fields = dashboardEl.querySelectorAll("[data-field]");
    fields.forEach(el => {
        const key = el.getAttribute("data-field");
        el.textContent = pet[key] || "—";
    });
}

function setFormMessage(el, text, isSuccess) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove("success", "error");
    el.classList.add(isSuccess ? "success" : "error");
}

const ADMIN_PASSWORD = "rafliAdmin2025";

let tempProductImageData = null;

function initShopPage() {
    const productsGrid = document.getElementById("products-grid");
    if (!productsGrid) return;

    ensureDefaultProducts();
    renderProducts();

    const adminLoginForm = document.getElementById("admin-login-form");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", handleAdminLogin);
    }

    const imageInput = document.getElementById("productImage");
    if (imageInput) {
        imageInput.addEventListener("change", handleProductImageChange);
    }

    const addProductForm = document.getElementById("add-product-form");
    if (addProductForm) {
        addProductForm.addEventListener("submit", handleAddProduct);
    }
}

function ensureDefaultProducts() {
    const products = getProductsFromStorage();
    if (products.length === 0) {
        const defaultProduct = {
            id: "bed1",
            name: "Переносная лежанка RafLi (беж)",
            price: "5 990 ₽",
            description:
                "Переносная лежанка с антислип покрытием и мягким антивандальным велюром в бежевом цвете. " +
                "Продумана до мелочей, устойчива к когтям и загрязнениям, легко собирается и не занимает много места в чемодане.",
            image: "img/bed1.jpg",
            imageData: null,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem("rafli_products", JSON.stringify([defaultProduct]));
    }
}

function getProductsFromStorage() {
    try {
        const raw = localStorage.getItem("rafli_products");
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error("Ошибка чтения каталога товаров:", e);
        return [];
    }
}

function saveProductsToStorage(products) {
    localStorage.setItem("rafli_products", JSON.stringify(products));
}

function renderProducts() {
    const productsGrid = document.getElementById("products-grid");
    if (!productsGrid) return;

    const products = getProductsFromStorage();
    productsGrid.innerHTML = "";

    if (products.length === 0) {
        productsGrid.innerHTML = "<p>Каталог пока пуст. Войдите как администратор, чтобы добавить первый товар.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "product-image-wrapper";

        const img = document.createElement("img");
        if (product.imageData) {
            img.src = product.imageData;
        } else if (product.image) {
            img.src = product.image;
        } else {
            img.src = "https://via.placeholder.com/400x250?text=RafLi+Pet+Travel";
        }
        img.alt = product.name || "Товар для питомцев";

        imageWrapper.appendChild(img);

        const body = document.createElement("div");
        body.className = "product-body";

        const title = document.createElement("div");
        title.className = "product-title";
        title.textContent = product.name;

        const price = document.createElement("div");
        price.className = "product-price";
        price.textContent = product.price;

        const description = document.createElement("div");
        description.className = "product-description";
        description.textContent = product.description;

        const actions = document.createElement("div");
        actions.className = "product-actions";

        const btn = document.createElement("button");
        btn.className = "btn primary full-width";
        btn.textContent = "Добавить в корзину";
        btn.addEventListener("click", () => {
            alert("Это учебный проект. Здесь могла бы быть ваша корзина 🐾");
        });

        actions.appendChild(btn);

        body.appendChild(title);
        body.appendChild(price);
        body.appendChild(description);
        body.appendChild(actions);

        card.appendChild(imageWrapper);
        card.appendChild(body);

        productsGrid.appendChild(card);
    });
}

function handleAdminLogin(e) {
    e.preventDefault();
    const passwordInput = document.getElementById("adminPassword");
    const messageEl = document.getElementById("adminLoginMessage");
    const panel = document.getElementById("admin-panel");

    const value = passwordInput.value;
    if (value === ADMIN_PASSWORD) {
        setFormMessage(messageEl, "Доступ к админ-панели открыт.", true);
        if (panel) panel.classList.remove("hidden");
    } else {
        setFormMessage(messageEl, "Неверный пароль администратора.", false);
        if (panel) panel.classList.add("hidden");
    }
}

function handleProductImageChange(e) {
    const file = e.target.files[0];
    tempProductImageData = null;

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        tempProductImageData = reader.result;
    };
    reader.readAsDataURL(file);
}

function handleAddProduct(e) {
    e.preventDefault();
    const messageEl = document.getElementById("addProductMessage");

    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const descriptionInput = document.getElementById("productDescription");

    const name = nameInput.value.trim();
    const price = priceInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!name || !price || !description) {
        setFormMessage(messageEl, "Пожалуйста, заполните все поля товара.", false);
        return;
    }

    const products = getProductsFromStorage();
    const newProduct = {
        id: "product_" + Date.now(),
        name,
        price,
        description,
        image: null,
        imageData: tempProductImageData || null,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    saveProductsToStorage(products);
    renderProducts();

    setFormMessage(messageEl, "Товар успешно добавлен в каталог.", true);

    e.target.reset();
    tempProductImageData = null;
}
