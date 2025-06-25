import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, 
    onSnapshot, collection, query, getDocs, writeBatch 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Global Variables & State ---
let db, auth;
let userId, appId;
let productsUnsubscribe, transactionsUnsubscribe, settingsUnsubscribe;
let html5QrCode;

const state = {
    products: [],
    transactions: [],
    settings: {
        name: 'Toko Sembako Sejahtera',
        tagline: 'Melayani dengan hati',
        address: 'Jl. Merdeka No. 123, Jakarta',
        phone: '021-1234567',
        logo: 'https://placehold.co/100x100/4CAF50/FFFFFF?text=Toko',
        receiptFooter: 'Terima kasih telah berbelanja\nBarang yang sudah dibeli tidak dapat ditukar',
        showLogoOnReceipt: true,
        theme: 'default',
    },
    currentCart: [],
    editingProductId: null,
};

const elements = {};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    cacheDOMElements();
    setupEventListeners();
    initFirebase();
});

/**
 * Initializes Firebase and handles the main application loading flow.
 */
async function initFirebase() {
    try {
        const firebaseConfig = JSON.parse(__firebase_config);
        appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (userId === user.uid) return; // Already initialized for this user
                userId = user.uid;
                console.log("User authenticated with UID:", userId);
                elements.appIdDisplay.textContent = appId;
                elements.userIdDisplay.textContent = userId;
                
                // **PERFORMANCE OVERHAUL**
                await initialDataFetchAndRender(); // Fetch data once, then render
                attachRealtimeListeners(); // Attach listeners for live updates *after* initial load
                
            } else {
                console.log("Signing in...");
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token).catch(() => signInAnonymously(auth));
                } else {
                    await signInAnonymously(auth);
                }
            }
        });

    } catch (error) {
        console.error("Firebase initialization failed:", error);
        elements.loadingOverlay.style.display = 'none';
        showToast("Gagal terhubung ke database.", "error");
    }
}

/**
 * **PERFORMANCE STRATEGY: ONE-TIME FETCH**
 * Fetches all necessary data from Firestore in one go for a fast initial load.
 */
async function initialDataFetchAndRender() {
    await checkAndSeedData(); // Ensure default data exists for new users

    const basePath = `/artifacts/${appId}/users/${userId}/data`;
    const settingsPromise = getDoc(doc(db, `${basePath}/settings`));
    const productsPromise = getDocs(query(collection(db, `${basePath}/products`)));
    const transactionsPromise = getDocs(query(collection(db, `${basePath}/transactions`)));

    try {
        const [settingsSnap, productsSnap, transactionsSnap] = await Promise.all([
            settingsPromise,
            productsPromise,
            transactionsPromise,
        ]);

        // Process and store data in state
        if (settingsSnap.exists()) {
            Object.assign(state.settings, settingsSnap.data());
        }
        state.products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.name.localeCompare(b.name));
        state.transactions = transactionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Now render the entire application
        updateStoreUI();
        applyTheme(state.settings.theme);
        renderDashboard();
        renderProducts();
        renderProductList();
        
        console.log("Initial data fetched and rendered successfully.");
        elements.loadingOverlay.style.display = 'none';

    } catch (error) {
        console.error("Error during initial data fetch:", error);
        elements.loadingOverlay.style.display = 'none';
        showToast("Gagal memuat data toko.", "error");
    }
}

/**
 * **PERFORMANCE STRATEGY: ATTACH LISTENERS**
 * Attaches real-time listeners after the initial data has been loaded and rendered.
 */
function attachRealtimeListeners() {
    if (productsUnsubscribe) productsUnsubscribe();
    if (transactionsUnsubscribe) transactionsUnsubscribe();
    if (settingsUnsubscribe) settingsUnsubscribe();

    const basePath = `/artifacts/${appId}/users/${userId}/data`;

    settingsUnsubscribe = onSnapshot(doc(db, `${basePath}/settings`), (docSnap) => {
        if (docSnap.exists()) Object.assign(state.settings, docSnap.data());
        updateStoreUI();
        applyTheme(state.settings.theme);
    });

    productsUnsubscribe = onSnapshot(query(collection(db, `${basePath}/products`)), (snapshot) => {
        state.products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.name.localeCompare(b.name));
        renderProducts();
        renderProductList();
        renderDashboard(); 
    });

    transactionsUnsubscribe = onSnapshot(query(collection(db, `${basePath}/transactions`)), (snapshot) => {
        state.transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderDashboard();
    });
    
    console.log("Real-time listeners attached.");
}

/**
 * Caches all necessary DOM elements for faster access.
 */
function cacheDOMElements() {
    const ids = [
        'loadingOverlay', 'storeLogo', 'storeName', 'storeTagline', 'toastContainer',
        'dashboard', 'todaySales', 'salesComparison', 'weeklyIncome', 'soldProducts',
        'outOfStock', 'salesChart', 'cashier', 'productSearch', 'productList', 'cartItems',
        'cartTotal', 'subtotal', 'discount', 'grandTotal', 'paymentBtn', 'resetBtn', 'products',
        'addProductBtn', 'productsTableBody', 'settings', 'productModal', 'productModalTitle',
        'productForm', 'productBarcode', 'generateBarcodeBtn', 'scanBarcodeBtn', 'productName',
        'productCategory', 'productBuyPrice', 'productSellPrice', 'productStock', 'productImage',
        'productImagePreview', 'paymentModal', 'paymentTotal', 'paymentAmount', 'paymentChange',
        'confirmPayment', 'receiptModal', 'receiptPrint', 'receiptLogo', 'receiptStoreName',
        'receiptStoreAddress', 'receiptStorePhone', 'receiptDate', 'receiptItems', 'receiptTotal',
        'receiptFooter', 'printReceipt', 'storeProfileModal', 'storeProfileForm', 'storeNameInput',
        'storeTaglineInput', 'storeAddressInput', 'storePhoneInput', 'storeLogoInput',
        'storeLogoPreview', 'receiptSettingsModal', 'receiptSettingsForm', 'receiptFooterInput',
        'receiptShowLogo', 'backupModal', 'createBackupBtn', 'restoreFileInput', 'restoreBackupBtn',
        'barcodeGeneratorModal', 'barcodeCodeInput', 'barcodeFormatInput', 'barcodePreview',
        'barcodeSvg', 'downloadBarcodeBtn', 'themeModal', 'themeOptions', 'applyTheme',
        'barcodeScannerModal', 'reader', 'appIdDisplay', 'userIdDisplay', 'table-container',
        'outOfStockCard', 'restockModal', 'restockList'
    ];
    ids.forEach(id => elements[id] = document.getElementById(id));
    
    elements.navItems = document.querySelectorAll('.nav-item');
    elements.pages = document.querySelectorAll('.page');
    elements.closeModalButtons = document.querySelectorAll('.close-modal');
    elements.closeModalBtns = document.querySelectorAll('.close-modal-btn');
}


/**
 * Creates initial data for first-time users.
 */
async function checkAndSeedData() {
    const settingsDocRef = doc(db, `${basePath()}/settings`);
    const settingsSnapshot = await getDoc(settingsDocRef);
    
    if (!settingsSnapshot.exists()) {
        showToast("Menyiapkan toko Anda...", "info");
        const batch = writeBatch(db);
        batch.set(settingsDocRef, state.settings);
        const sampleProducts = [
            { barcode: '8999999012345', name: 'Beras Premium 5kg', category: 'Sembako', buyPrice: 55000, sellPrice: 65000, stock: 5, image: '' },
            { barcode: '8999999012346', name: 'Minyak Goreng 2L', category: 'Sembako', buyPrice: 28000, sellPrice: 32000, stock: 0, image: '' },
            { barcode: '8999999012347', name: 'Gula Pasir 1kg', category: 'Sembako', buyPrice: 12000, sellPrice: 15000, stock: 30, image: '' },
        ];
        sampleProducts.forEach(product => {
            const docRef = doc(collection(db, `${basePath()}/products`));
            batch.set(docRef, product);
        });
        await batch.commit();
    }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    elements.navItems.forEach(item => item.addEventListener('click', (e) => {
        e.preventDefault();
        switchPage(e.currentTarget.dataset.page);
    }));

    const allCloseButtons = [...elements.closeModalButtons, ...elements.closeModalBtns];
    allCloseButtons.forEach(btn => btn.addEventListener('click', (e) => {
        const modal = e.currentTarget.closest('.modal');
        if (modal.id === 'barcodeScannerModal') stopBarcodeScanner();
        modal.classList.remove('active');
    }));
    document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            if (modal.id === 'barcodeScannerModal') stopBarcodeScanner();
            modal.classList.remove('active');
        }
    }));
    
    elements.outOfStockCard.addEventListener('click', openRestockModal);

    elements.productSearch.addEventListener('input', searchProducts);
    elements.paymentBtn.addEventListener('click', openPaymentModal);
    elements.resetBtn.addEventListener('click', resetCart);
    elements.paymentAmount.addEventListener('input', calculateChange);
    elements.confirmPayment.addEventListener('click', processPayment);

    elements.addProductBtn.addEventListener('click', () => openProductModal());
    elements.productForm.addEventListener('submit', handleProductSubmit);

    elements.generateBarcodeBtn.addEventListener('click', generateRandomBarcode);
    elements.scanBarcodeBtn.addEventListener('click', () => openBarcodeScanner(true));
    elements.productImage.addEventListener('change', (e) => previewImage(e, elements.productImagePreview));

    elements.printReceipt.addEventListener('click', printReceipt);

    document.querySelector('[data-setting="profile"]').addEventListener('click', openStoreProfileModal);
    document.querySelector('[data-setting="receipt"]').addEventListener('click', openReceiptSettingsModal);
    document.querySelector('[data-setting="backup"]').addEventListener('click', () => elements.backupModal.classList.add('active'));
    document.querySelector('[data-setting="barcode"]').addEventListener('click', openBarcodeGenerator);
    document.querySelector('[data-setting="theme"]').addEventListener('click', openThemeModal);
    
    elements.storeProfileForm.addEventListener('submit', saveStoreProfile);
    elements.storeLogoInput.addEventListener('change', (e) => previewImage(e, elements.storeLogoPreview));
    elements.receiptSettingsForm.addEventListener('submit', saveReceiptSettings);
    elements.createBackupBtn.addEventListener('click', createBackup);
    elements.restoreBackupBtn.addEventListener('click', restoreBackup);
    elements.barcodeCodeInput.addEventListener('input', updateBarcodePreview);
    elements.barcodeFormatInput.addEventListener('change', updateBarcodePreview);
    elements.downloadBarcodeBtn.addEventListener('click', downloadBarcode);
    elements.applyTheme.addEventListener('click', applySelectedTheme);

     elements.themeOptions.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            elements.themeOptions.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}


// --- Page & UI Management ---

function switchPage(pageId) {
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
    elements.pages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
    });

    switch (pageId) {
        case 'dashboard': renderDashboard(); break;
        case 'cashier': renderProductList(); renderCart(); break;
        case 'products': renderProducts(); break;
    }
}

function updateStoreUI() {
    const { name, tagline, logo } = state.settings;
    document.title = name;
    elements.storeName.textContent = name;
    elements.storeTagline.textContent = tagline;
    elements.storeLogo.src = logo || 'https://placehold.co/100x100/4CAF50/FFFFFF?text=Toko';
    elements.storeLogo.onerror = () => { elements.storeLogo.src = 'https://placehold.co/100x100/4CAF50/FFFFFF?text=Error'; };
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconClass = type === 'success' ? 'fa-check-circle' :
                      type === 'error' ? 'fa-times-circle' :
                      type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- Dashboard ---

function renderDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = state.transactions.filter(t => t.date.startsWith(today));
    const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    elements.todaySales.textContent = formatCurrency(todaySales);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayTransactions = state.transactions.filter(t => t.date.startsWith(yesterdayStr));
    const yesterdaySales = yesterdayTransactions.reduce((sum, t) => sum + t.total, 0);
    
    const salesDiff = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales * 100) : (todaySales > 0 ? 100 : 0);
    elements.salesComparison.textContent = `${salesDiff >= 0 ? '+' : ''}${salesDiff.toFixed(0)}% dari kemarin`;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyTransactions = state.transactions.filter(t => new Date(t.date) >= oneWeekAgo);
    const weeklyIncome = weeklyTransactions.reduce((sum, t) => sum + t.total, 0);
    elements.weeklyIncome.textContent = formatCurrency(weeklyIncome);
    
    const soldCount = todayTransactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    elements.soldProducts.textContent = soldCount;
    
    const outOfStockCount = state.products.filter(p => p.stock <= 0).length;
    elements.outOfStock.textContent = outOfStockCount;
    
    renderSalesChart();
}

function renderSalesChart() {
    if (window.salesChart instanceof Chart) window.salesChart.destroy();
    
    const ctx = elements.salesChart.getContext('2d');
    const labels = [];
    const salesData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }));
        const dateStr = d.toISOString().split('T')[0];
        const daySales = state.transactions
            .filter(t => t.date.startsWith(dateStr))
            .reduce((sum, t) => sum + t.total, 0);
        salesData.push(daySales);
    }
    
    window.salesChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{
            label: 'Penjualan (Rp)',
            data: salesData,
            backgroundColor: 'rgba(76, 175, 80, 0.7)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderRadius: 4,
            borderWidth: 1
        }]},
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value).replace(',00','') }}},
            plugins: { tooltip: { callbacks: { label: context => formatCurrency(context.raw) }}}
        }
    });
}

function openRestockModal() {
    const productsToRestock = state.products.filter(p => p.stock <= 0);
    elements.restockList.innerHTML = ''; 
    
    if (productsToRestock.length === 0) {
        elements.restockList.innerHTML = '<p style="text-align:center; padding: 1rem;">Semua stok aman!</p>';
    } else {
        productsToRestock.forEach(product => {
            const item = document.createElement('div');
            item.className = 'restock-item';
            item.innerHTML = `
                <span class="restock-item-name">${product.name}</span>
                <span class="restock-item-stock">Stok: ${product.stock}</span>
            `;
            elements.restockList.appendChild(item);
        });
    }
    
    elements.restockModal.classList.add('active');
}

// --- Cashier & Product Logic (mostly unchanged) ---
function searchProducts(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    const productByBarcode = state.products.find(p => p.barcode === searchTerm);
    if (productByBarcode) {
        addToCart(productByBarcode.id);
        e.target.value = ''; 
        renderProductList();
        return;
    }

    const filtered = state.products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    renderProductList(searchTerm ? filtered : state.products);
}

function renderProductList(products = state.products) {
    elements.productList.innerHTML = '';
    if (products.length === 0) {
        elements.productList.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: 1rem;">Produk tidak ditemukan</p>`;
        return;
    }
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.dataset.id = product.id;
        if(product.stock <= 0) item.classList.add('out-of-stock');
        item.innerHTML = `
            <img src="${product.image || 'https://placehold.co/150x150/f0f0f0/999999?text=Produk'}" alt="${product.name}" class="product-img">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatCurrency(product.sellPrice)}</div>
            <div class="product-stock ${product.stock <= 0 ? 'product-stock out-of-stock-text' : ''}">
                Stok: ${product.stock > 0 ? product.stock : 'Habis'}
            </div>
        `;
        item.addEventListener('click', () => addToCart(product.id));
        elements.productList.appendChild(item);
    });
}

function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
        showToast('Stok produk ini habis', 'error'); return;
    }
    const cartItem = state.currentCart.find(item => item.productId === productId);
    if (cartItem) {
        if (cartItem.quantity >= product.stock) {
            showToast('Stok tidak mencukupi', 'error'); return;
        }
        cartItem.quantity++;
    } else {
        state.currentCart.push({
            productId: product.id, name: product.name, price: product.sellPrice, quantity: 1
        });
    }
    renderCart();
}

function updateCartItemQuantity(productId, change) {
    const itemIndex = state.currentCart.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return;
    
    const product = state.products.find(p => p.id === productId);
    const newQuantity = state.currentCart[itemIndex].quantity + change;

    if (newQuantity < 1) {
        state.currentCart.splice(itemIndex, 1);
    } else if (product && newQuantity > product.stock) {
        showToast('Stok tidak mencukupi', 'error');
    } else {
        state.currentCart[itemIndex].quantity = newQuantity;
    }
    renderCart();
}

function renderCart() {
    if (state.currentCart.length === 0) {
        elements.cartItems.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Keranjang kosong</p></div>`;
        elements.cartTotal.style.display = 'none';
        elements.paymentBtn.disabled = true;
        return;
    }
    elements.cartItems.innerHTML = '';
    let subtotal = 0;
    state.currentCart.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn minus" data-id="${item.productId}"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button class="qty-btn plus" data-id="${item.productId}"><i class="fas fa-plus"></i></button>
            </div>
        `;
        itemEl.querySelector('.minus').addEventListener('click', () => updateCartItemQuantity(item.productId, -1));
        itemEl.querySelector('.plus').addEventListener('click', () => updateCartItemQuantity(item.productId, 1));
        elements.cartItems.appendChild(itemEl);
    });

    elements.subtotal.textContent = formatCurrency(subtotal);
    elements.discount.textContent = formatCurrency(0);
    elements.grandTotal.textContent = formatCurrency(subtotal);
    elements.cartTotal.style.display = 'block';
    elements.paymentBtn.disabled = false;
}

function resetCart() {
    if (state.currentCart.length > 0 && confirm('Kosongkan keranjang?')) {
        state.currentCart = [];
        renderCart();
        showToast('Keranjang dikosongkan', 'info');
    }
}

function openPaymentModal() {
    elements.paymentTotal.value = elements.grandTotal.textContent;
    elements.paymentAmount.value = '';
    elements.paymentChange.value = 'Rp 0';
    elements.paymentModal.classList.add('active');
    elements.paymentAmount.focus();
}

function calculateChange() {
    const total = parseCurrency(elements.grandTotal.textContent);
    const paid = parseFloat(elements.paymentAmount.value) || 0;
    elements.paymentChange.value = formatCurrency(Math.max(0, paid - total));
}

async function processPayment() {
    const total = parseCurrency(elements.grandTotal.textContent);
    const paid = parseFloat(elements.paymentAmount.value) || 0;

    if (paid < total) {
        showToast('Jumlah pembayaran kurang', 'error'); return;
    }

    const transaction = {
        date: new Date().toISOString(), items: state.currentCart,
        subtotal: total, discount: 0, total, payment: paid, change: paid - total
    };

    try {
        const batch = writeBatch(db);
        const newTransRef = doc(collection(db, `${basePath()}/transactions`));
        batch.set(newTransRef, transaction);

        state.currentCart.forEach(item => {
            const product = state.products.find(p => p.id === item.productId);
            if (product) {
                const productRef = doc(db, `${basePath()}/products`, product.id);
                batch.update(productRef, { stock: product.stock - item.quantity });
            }
        });

        await batch.commit();
        elements.paymentModal.classList.remove('active');
        showToast('Transaksi berhasil', 'success');
        generateReceipt({ ...transaction, id: newTransRef.id });
        elements.receiptModal.classList.add('active');
        state.currentCart = [];
        renderCart();

    } catch (error) {
        showToast("Gagal memproses transaksi.", "error");
    }
}

function generateReceipt(transaction) {
    const { name, address, phone, logo, showLogoOnReceipt, receiptFooter } = state.settings;
    elements.receiptStoreName.textContent = name;
    elements.receiptStoreAddress.textContent = address;
    elements.receiptStorePhone.textContent = phone ? `Telp: ${phone}` : '';
    elements.receiptLogo.src = (logo && showLogoOnReceipt) ? logo : '';
    elements.receiptLogo.style.display = (logo && showLogoOnReceipt) ? 'block' : 'none';

    const d = new Date(transaction.date);
    elements.receiptDate.textContent = `No: ${transaction.id.substring(0, 8)} | ${d.toLocaleString('id-ID')}`;
    
    elements.receiptItems.innerHTML = transaction.items.map(item => `
        <div class="receipt-item"><span>${item.name}</span></div>
        <div class="receipt-item">
            <span>${item.quantity} x ${formatCurrency(item.price)}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    elements.receiptTotal.innerHTML = `
        <div class="receipt-item"><span>Total</span><span>${formatCurrency(transaction.total)}</span></div>
        <div class="receipt-item"><span>Tunai</span><span>${formatCurrency(transaction.payment)}</span></div>
        <div class="receipt-item"><span>Kembali</span><span>${formatCurrency(transaction.change)}</span></div>
    `;

    elements.receiptFooter.innerHTML = receiptFooter.replace(/\n/g, '<br>');
}

function printReceipt() {
    const receiptContent = elements.receiptPrint.innerHTML;
    const printWindow = window.open('', '_blank', 'height=600,width=400');
    printWindow.document.write(`<html><head><title>Struk</title><style> body { font-family: 'Courier New', monospace; margin: 0; padding: 10px; color: #000; } .receipt { width: 100%; } .receipt-header { text-align: center; margin-bottom: 10px; } .receipt-logo { max-width: 80px; } .receipt-title { font-weight: bold; } .receipt-address, .receipt-date { font-size: 0.8rem; } .receipt-items, .receipt-total { font-size: 0.9rem; } .receipt-item { display: flex; justify-content: space-between; } .receipt-total { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; } .receipt-footer { text-align: center; font-size: 0.8rem; margin-top: 10px; } </style></head><body><div class="receipt">${receiptContent}</div></body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
}

function renderProducts() {
    elements.productsTableBody.innerHTML = '';
    if (state.products.length === 0) {
        elements.productsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Belum ada produk</td></tr>`;
        return;
    }
    state.products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.barcode}</td> <td>${p.name}</td> <td>${p.category}</td>
            <td>${formatCurrency(p.sellPrice)}</td>
            <td class="${p.stock <= 0 ? 'out-of-stock-text' : ''}">${p.stock > 0 ? p.stock : 'Habis'}</td>
            <td>
                <div class="product-actions">
                    <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Hapus"><i class="fas fa-trash"></i></button>
                    <button class="action-btn barcode-btn" title="Barcode"><i class="fas fa-barcode"></i></button>
                </div>
            </td>`;
        row.querySelector('.edit-btn').addEventListener('click', () => openProductModal(p.id));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(p.id, p.name));
        row.querySelector('.barcode-btn').addEventListener('click', () => showProductBarcode(p.barcode));
        elements.productsTableBody.appendChild(row);
    });
}

function openProductModal(productId = null) {
    elements.productForm.reset();
    elements.productImagePreview.innerHTML = '';
    state.editingProductId = productId;
    if (productId) {
        const p = state.products.find(prod => prod.id === productId);
        elements.productModalTitle.textContent = 'Edit Produk';
        elements.productBarcode.value = p.barcode;
        elements.productName.value = p.name;
        elements.productCategory.value = p.category;
        elements.productBuyPrice.value = p.buyPrice;
        elements.productSellPrice.value = p.sellPrice;
        elements.productStock.value = p.stock;
        if(p.image) elements.productImagePreview.innerHTML = `<img src="${p.image}" style="max-width: 100px; border-radius: 4px;">`;
    } else {
        elements.productModalTitle.textContent = 'Tambah Produk Baru';
    }
    elements.productModal.classList.add('active');
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const imageFile = elements.productImage.files[0];
    
    const productData = {
        barcode: elements.productBarcode.value.trim(), name: elements.productName.value.trim(),
        category: elements.productCategory.value, buyPrice: parseFloat(elements.productBuyPrice.value),
        sellPrice: parseFloat(elements.productSellPrice.value), stock: parseInt(elements.productStock.value),
        image: ''
    };

    if (!productData.barcode || !productData.name || !productData.category) {
        showToast('Harap isi semua kolom yang wajib diisi.', 'error'); return;
    }
    const duplicateBarcode = state.products.find(p => p.barcode === productData.barcode && p.id !== state.editingProductId);
    if (duplicateBarcode) {
        showToast('Barcode sudah digunakan produk lain.', 'error'); return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>';

    if (imageFile) {
        productData.image = await getBase64(imageFile);
    } else if (state.editingProductId) {
        productData.image = state.products.find(p => p.id === state.editingProductId).image;
    }
    
    try {
        if (state.editingProductId) {
            await updateDoc(doc(db, `${basePath()}/products`, state.editingProductId), productData);
            showToast('Produk berhasil diperbarui', 'success');
        } else {
            await addDoc(collection(db, `${basePath()}/products`), productData);
            showToast('Produk berhasil ditambahkan', 'success');
        }
        elements.productModal.classList.remove('active');
    } catch (error) {
        showToast("Gagal menyimpan produk.", "error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Simpan Produk';
    }
}


async function deleteProduct(productId, productName) {
    if (confirm(`Yakin ingin menghapus produk "${productName}"?`)) {
        try {
            await deleteDoc(doc(db, `${basePath()}/products`, productId));
            showToast('Produk berhasil dihapus', 'success');
        } catch (error) {
            showToast("Gagal menghapus produk.", "error");
        }
    }
}

function openBarcodeScanner(forProductForm = false) {
    elements.barcodeScannerModal.classList.add('active');
    
    if (!html5QrCode) html5QrCode = new Html5Qrcode("reader");
    if (html5QrCode.isScanning) return;
    
    const qrboxFunction = (w, h) => ({ width: Math.floor(w * 0.7), height: Math.floor(h * 0.4) });

    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: qrboxFunction },
        (decodedText) => handleScannedBarcode(decodedText, forProductForm),
        () => {}
    ).catch(() => showToast("Gagal memulai scanner.", "error"));
}


function stopBarcodeScanner() {
     if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Scanner stop error", err));
    }
}

function handleScannedBarcode(barcode, forProductForm) {
    stopBarcodeScanner();
    elements.barcodeScannerModal.classList.remove('active');

    if (forProductForm) {
        elements.productBarcode.value = barcode;
    } else {
        const product = state.products.find(p => p.barcode === barcode);
        if (product) addToCart(product.id);
        else showToast(`Produk dengan barcode ${barcode} tidak ditemukan.`, 'warning');
    }
}


function generateRandomBarcode() {
    let barcode = '899' + Math.floor(100000000 + Math.random() * 900000000).toString();
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(barcode[i]) * ((i % 2 === 0) ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    elements.productBarcode.value = barcode + checkDigit;
}

function showProductBarcode(barcode) {
    elements.barcodeCodeInput.value = barcode;
    elements.barcodeFormatInput.value = barcode.length === 13 ? 'EAN13' : 'CODE128';
    updateBarcodePreview();
    elements.barcodeGeneratorModal.classList.add('active');
}

function updateBarcodePreview() {
    const code = elements.barcodeCodeInput.value.trim();
    if (!code) {
        elements.barcodePreview.innerHTML = '<svg id="barcodeSvg"></svg>';
        return;
    }
    try {
        JsBarcode("#barcodeSvg", code, {
            format: elements.barcodeFormatInput.value,
            lineColor: '#000', width: 2, height: 60, displayValue: true
        });
    } catch (e) { console.error("Barcode error", e); }
}

function downloadBarcode() {
    const svgEl = elements.barcodeSvg;
    if (!svgEl.innerHTML) {
        showToast("Generate barcode terlebih dahulu", "warning"); return;
    }
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width; canvas.height = img.height;
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const a = document.createElement("a");
        a.download = `barcode-${elements.barcodeCodeInput.value}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
}

function openStoreProfileModal() {
    const { name, tagline, address, phone, logo } = state.settings;
    elements.storeNameInput.value = name; elements.storeTaglineInput.value = tagline;
    elements.storeAddressInput.value = address; elements.storePhoneInput.value = phone;
    elements.storeLogoPreview.innerHTML = logo ? `<img src="${logo}" style="max-width:100px; border-radius:4px;">` : '';
    elements.storeProfileModal.classList.add('active');
}

async function saveStoreProfile(e) {
    e.preventDefault();
    const newSettings = {
        name: elements.storeNameInput.value, tagline: elements.storeTaglineInput.value,
        address: elements.storeAddressInput.value, phone: elements.storePhoneInput.value,
    };
    const logoFile = elements.storeLogoInput.files[0];
    if (logoFile) newSettings.logo = await getBase64(logoFile);

    try {
        await setDoc(doc(db, `${basePath()}/settings`), newSettings, { merge: true });
        showToast("Profil toko diperbarui", "success");
        elements.storeProfileModal.classList.remove('active');
    } catch (error) { showToast("Gagal memperbarui profil.", "error"); }
}

function openReceiptSettingsModal() {
    elements.receiptFooterInput.value = state.settings.receiptFooter;
    elements.receiptShowLogo.value = state.settings.showLogoOnReceipt ? 'yes' : 'no';
    elements.receiptSettingsModal.classList.add('active');
}

async function saveReceiptSettings(e) {
    e.preventDefault();
    const newSettings = {
        receiptFooter: elements.receiptFooterInput.value,
        showLogoOnReceipt: elements.receiptShowLogo.value === 'yes',
    };
    try {
        await updateDoc(doc(db, `${basePath()}/settings`), newSettings);
        showToast("Pengaturan struk diperbarui", "success");
        elements.receiptSettingsModal.classList.remove('active');
    } catch (error) { showToast("Gagal menyimpan pengaturan.", "error"); }
}

function openThemeModal() {
    const currentTheme = state.settings.theme || 'default';
    elements.themeOptions.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.theme === currentTheme);
    });
    elements.themeModal.classList.add('active');
}

async function applySelectedTheme() {
    const selectedTheme = elements.themeOptions.querySelector('.selected').dataset.theme;
    applyTheme(selectedTheme);
    try {
        await updateDoc(doc(db, `${basePath()}/settings`), { theme: selectedTheme });
        showToast('Tema berhasil diubah', 'success');
        elements.themeModal.classList.remove('active');
    } catch (error) { showToast("Gagal menyimpan tema.", "error"); }
}

function applyTheme(theme) {
    const themes = {
        default: { p: '#4CAF50', s: '#388E3C', a: '#8BC34A', d: '#2E7D32', l: '#C8E6C9' },
        blue:    { p: '#2196F3', s: '#1976D2', a: '#64B5F6', d: '#0D47A1', l: '#BBDEFB' },
        purple:  { p: '#9C27B0', s: '#7B1FA2', a: '#BA68C8', d: '#4A148C', l: '#E1BEE7' },
        red:     { p: '#F44336', s: '#D32F2F', a: '#E57373', d: '#B71C1C', l: '#FFCDD2' },
        orange:  { p: '#FF9800', s: '#F57C00', a: '#FFB74D', d: '#E65100', l: '#FFE0B2' },
        dark:    { p: '#607D8B', s: '#455A64', a: '#90A4AE', d: '#263238', l: '#CFD8DC' },
    };
    const t = themes[theme] || themes.default;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', t.p); root.style.setProperty('--secondary-color', t.s);
    root.style.setProperty('--accent-color', t.a); root.style.setProperty('--dark-color', t.d);
    root.style.setProperty('--light-color', t.l);
}

function createBackup() {
    const backupData = { settings: state.settings, products: state.products, transactions: state.transactions };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `toko-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup data berhasil diunduh.", "success");
}

function restoreBackup() {
    const file = elements.restoreFileInput.files[0];
    if (!file) {
        showToast("Pilih file backup terlebih dahulu", "warning"); return;
    }
    if(!confirm("PERINGATAN: Ini akan menimpa semua data saat ini. Lanjutkan?")) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const backupData = JSON.parse(e.target.result);
            if (!backupData.products || !backupData.settings) throw new Error("File backup tidak valid.");
            
            elements.loadingOverlay.style.display = 'flex';
            
            const batch = writeBatch(db);
            batch.set(doc(db, `${basePath()}/settings`), backupData.settings);
            
            const prods = await getDocs(collection(db, `${basePath()}/products`));
            prods.forEach(doc => batch.delete(doc.ref));
            const trans = await getDocs(collection(db, `${basePath()}/transactions`));
            trans.forEach(doc => batch.delete(doc.ref));
            await batch.commit(); 

            const addBatch = writeBatch(db);
            backupData.products.forEach(p => {
                const { id, ...prodData } = p;
                addBatch.set(doc(collection(db, `${basePath()}/products`)), prodData);
            });
            if(backupData.transactions) {
                backupData.transactions.forEach(t => {
                    const { id, ...transData } = t;
                    addBatch.set(doc(collection(db, `${basePath()}/transactions`)), transData);
                });
            }
            await addBatch.commit();
            showToast("Data berhasil dipulihkan", "success");
            elements.backupModal.classList.remove('active');
        } catch (err) {
            showToast("Gagal memulihkan data. File mungkin rusak.", "error");
        } finally {
             elements.loadingOverlay.style.display = 'none';
        }
    };
    reader.readAsText(file);
}

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const parseCurrency = (str) => parseFloat(String(str).replace(/[^0-9,-]+/g,"")) || 0;
const basePath = () => `/artifacts/${appId}/users/${userId}/data`;

function previewImage(e, previewElement) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            previewElement.innerHTML = `<img src="${event.target.result}" style="max-width: 100px; max-height: 100px; border-radius: 4px; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}