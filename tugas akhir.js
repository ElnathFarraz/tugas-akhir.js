// Data produk
const products = [
    { name: "KFC Puas Burger", price: 13636, img: "11162-removebg-preview.png" },
    { name: "Super Komplit 1", price: 46819, img: "14897-removebg-preview.png" },
    { name: "Bucket 9 Pcs", price: 99091, img: "4842-removebg-preview.png" },
    { name: "Nasi Uduk KFC", price: 17273, img: "13649-removebg-preview.png" },
    { name: "Coca Cola Regular", price: 8182, img: "11940-removebg-preview.png" },
    { name: "Soft Ice Cream", price: 6818, img: "MenuImages2F4918-removebg-preview.png" }
];

function renderProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img class="product-img" src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">Rp ${p.price.toLocaleString('id-ID')}</p>
            <button class="btn-add" onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">+ Tambah</button>
        </div>
    `).join('');
}

// Cart functions
function getCart() {
    return JSON.parse(localStorage.getItem('kfcCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('kfcCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

function addToCart(name, price, img) {
    let cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }
    saveCart(cart);
    alert(name + ' berhasil ditambahkan ke keranjang!');
}

function changeQty(index, change) {
    let cart = getCart();
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    renderCheckoutCart();
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:40px;">Keranjang masih kosong. <span style="color:#E4002B; cursor:pointer;" onclick="showPage(\'menu\')">Mulai belanja</span></p>';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</p>
                </div>
                <div class="qty-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
                <div><strong>Rp ${itemTotal.toLocaleString('id-ID')}</strong></div>
            </div>
        `;
    });
    html += `<h2 style="text-align:right; margin-top:20px;">Total: Rp ${total.toLocaleString('id-ID')}</h2>`;
    container.innerHTML = html;
    if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
}

function renderCheckoutCart() {
    const cart = getCart();
    const container = document.getElementById('checkout-cart');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;">Keranjang kosong</p>';
        return;
    }
    let total = 0;
    let html = '<h3 style="margin-bottom:15px;">Ringkasan Pesanan</h3>';
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>${item.name} x${item.qty}</span><span>Rp ${itemTotal.toLocaleString('id-ID')}</span></div>`;
    });
    html += `<hr style="margin:15px 0;"><h3 style="text-align:right;">Total: Rp ${total.toLocaleString('id-ID')}</h3>`;
    container.innerHTML = html;
}

function selesaiPesanan() {
    alert('Pesanan berhasil dibuat! (Simulasi)');
    localStorage.removeItem('kfcCart');
    updateCartCount();
    showPage('home');
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');

    document.querySelectorAll('.nav span').forEach(s => s.classList.remove('active'));
    const activeNav = document.querySelector(`.nav span[data-page="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');

    if (pageId === 'keranjang') renderCart();
    if (pageId === 'checkout') renderCheckoutCart();

    window.scrollTo(0, 0);
}

// Init
document.addEventListener('DOMContentLoaded', function() {
    renderProducts('home-products');
    renderProducts('menu-products');
    updateCartCount();
});

// ==================== FORM VALIDATION ====================

function showError(input, message) {
    const formGroup = input.parentElement;
    let error = formGroup.querySelector('.error-message');
    
    if (!error) {
        error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#E4002B';
        error.style.fontSize = '13px';
        error.style.marginTop = '-10px';
        error.style.marginBottom = '10px';
        formGroup.appendChild(error);
    }
    error.textContent = message;
    input.style.borderColor = '#E4002B';
}

function clearError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    if (error) error.remove();
    input.style.borderColor = '#ddd';
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10,13}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validasi Checkout
function validateCheckout() {
    const nama = document.querySelector('#checkout input[placeholder="Nama Lengkap"]');
    const hp = document.querySelector('#checkout input[placeholder="Nomor HP"]');
    const alamat = document.querySelector('#checkout textarea');
    
    let isValid = true;
    
    // Nama
    if (!nama.value.trim()) {
        showError(nama, 'Nama lengkap wajib diisi');
        isValid = false;
    } else if (nama.value.trim().length < 3) {
        showError(nama, 'Nama minimal 3 karakter');
        isValid = false;
    } else {
        clearError(nama);
    }
    
    // Nomor HP
    if (!hp.value.trim()) {
        showError(hp, 'Nomor HP wajib diisi');
        isValid = false;
    } else if (!validatePhone(hp.value)) {
        showError(hp, 'Nomor HP harus 10-13 digit angka');
        isValid = false;
    } else {
        clearError(hp);
    }
    
    // Alamat
    if (!alamat.value.trim()) {
        showError(alamat, 'Alamat wajib diisi');
        isValid = false;
    } else if (alamat.value.trim().length < 10) {
        showError(alamat, 'Alamat terlalu singkat');
        isValid = false;
    } else {
        clearError(alamat);
    }
    
    return isValid;
}

// Validasi Login
function validateLogin() {
    const emailOrHp = document.querySelector('#akun input[placeholder="Email atau Nomor HP"]');
    const password = document.querySelector('#akun input[placeholder="Password"]');
    
    let isValid = true;
    
    if (!emailOrHp.value.trim()) {
        showError(emailOrHp, 'Email atau Nomor HP wajib diisi');
        isValid = false;
    } else {
        const value = emailOrHp.value.trim();
        if (value.includes('@')) {
            if (!validateEmail(value)) {
                showError(emailOrHp, 'Format email tidak valid');
                isValid = false;
            } else {
                clearError(emailOrHp);
            }
        } else {
            if (!validatePhone(value)) {
                showError(emailOrHp, 'Nomor HP tidak valid');
                isValid = false;
            } else {
                clearError(emailOrHp);
            }
        }
    }
    
    if (!password.value.trim()) {
        showError(password, 'Password wajib diisi');
        isValid = false;
    } else if (password.value.length < 6) {
        showError(password, 'Password minimal 6 karakter');
        isValid = false;
    } else {
        clearError(password);
    }
    
    return isValid;
}

// Update fungsi selesaiPesanan
function selesaiPesanan() {
    if (!validateCheckout()) {
        alert('Mohon lengkapi data dengan benar!');
        return;
    }
    
    alert('Pesanan berhasil dibuat! (Simulasi)');
    localStorage.removeItem('kfcCart');
    updateCartCount();
    showPage('home');
    
    // Reset form
    document.querySelector('#checkout input[placeholder="Nama Lengkap"]').value = '';
    document.querySelector('#checkout input[placeholder="Nomor HP"]').value = '';
    document.querySelector('#checkout textarea').value = '';
}

// Tambahkan event listener untuk login
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    renderProducts('home-products');
    renderProducts('menu-products');
    updateCartCount();
    
    // Login button
    const loginBtn = document.querySelector('#akun .btn-add');
    if (loginBtn) {
        loginBtn.onclick = function() {
            if (validateLogin()) {
                alert('Login berhasil! (Simulasi)');
                showPage('home');
            }
        };
    }
});