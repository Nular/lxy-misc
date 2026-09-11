/* KickBazar ToC Web Prototype — PRD v1.10 */

const CATEGORIES = [
  { id: "women", name: "Women", icon: "W" },
  { id: "men", name: "Men", icon: "M" },
  { id: "kids", name: "Kids", icon: "K" },
  { id: "beauty", name: "Beauty", icon: "B" },
  { id: "home", name: "Home", icon: "H" },
  { id: "electronics", name: "Electronics", icon: "E" },
  { id: "sports", name: "Sports", icon: "S" },
  { id: "more", name: "More", icon: "+" },
];

const ZONES = [
  { id: "brand", title: "Brand Zone", route: "#/topic/brand" },
  { id: "global", title: "Global", route: "#/topic/global" },
  { id: "featured", title: "Featured", route: "#/topic/featured" },
  { id: "trending", title: "Trending", route: "#/topic/trending" },
];

const PRODUCTS = [
  { id: "p1", title: "Cotton Blend Midi Dress", price: 1299, orig: 1899, tag: "Trending", store: "Fashion Hub" },
  { id: "p2", title: "Classic Slim Fit Jeans", price: 899, orig: 1199, tag: "", store: "Denim Co" },
  { id: "p3", title: "Wireless Earbuds Pro", price: 2499, orig: 3299, tag: "Brand Zone", store: "Tech Store" },
  { id: "p4", title: "Floral Print Blouse", price: 599, orig: 799, tag: "Featured", store: "Fashion Hub" },
  { id: "p5", title: "Running Sneakers Lite", price: 1599, orig: 1999, tag: "", store: "Sports BD" },
  { id: "p6", title: "Leather Crossbody Bag", price: 1799, orig: 2299, tag: "Global", store: "Bag World" },
  { id: "p7", title: "Kids Cartoon T-Shirt Set", price: 449, orig: 599, tag: "", store: "Kids Zone" },
  { id: "p8", title: "Hydrating Face Serum", price: 699, orig: 899, tag: "Featured", store: "Beauty Plus" },
];

const I18N = {
  en: {
    searchPlaceholder: "Search products",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    checkout: "Checkout",
    viewMore: "View More",
    homeEmpty: "Browse categories to discover more",
  },
  bn: {
    searchPlaceholder: "পণ্য খুঁজুন",
    addToCart: "কার্টে যোগ করুন",
    buyNow: "এখনই কিনুন",
    checkout: "চেকআউট",
    viewMore: "আরও দেখুন",
    homeEmpty: "আরও আবিষ্কার করতে ক্যাটাগরি ব্রাউজ করুন",
  },
};

const TRUST_CONTENT = {
  replace: { title: "Product Replace", body: "Easy product replacement within the return window. Same as App policy." },
  support: { title: "24/7 Support", body: "Our support team is available around the clock via chat and phone." },
};

const state = {
  locale: "en",
  auth: "guest", // resolving | guest | logged_in
  user: { name: "Rahul Ahmed", avatar: "" },
  cart: [],
  feedRows: 2,
  route: parseRoute(),
  searchQuery: "",
  selectedProduct: null,
  skuModal: null,
};

function formatBDT(n) {
  return "৳" + n.toLocaleString("en-BD");
}

function parseRoute() {
  const hash = location.hash.slice(1) || "/";
  const [path, qs] = hash.split("?");
  const params = new URLSearchParams(qs || "");
  return { path, params };
}

function navigate(path) {
  location.hash = path;
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add("hidden"), 2800);
}

function openModal(html, className = "") {
  const modal = document.getElementById("modal");
  const panel = document.getElementById("modal-panel");
  panel.className = "modal__panel " + className;
  panel.innerHTML = html;
  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  state.skuModal = null;
}

function t(key) {
  return I18N[state.locale][key] || I18N.en[key] || key;
}

function cartCount() {
  return state.cart.reduce((s, l) => s + l.qty, 0);
}

function cartSelectedTotal() {
  return state.cart.filter((l) => l.selected && l.valid).reduce((s, l) => s + l.price * l.qty, 0);
}

function productCard(p) {
  const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;
  return `
    <article class="product-card" data-product="${p.id}">
      <div class="product-card__img">
        ${p.tag ? `<span class="product-card__tag">${p.tag}</span>` : ""}
      </div>
      <p class="product-card__title">${p.title}</p>
      <p>
        <span class="product-card__price">${formatBDT(p.price)}</span>
        ${p.orig ? `<span class="product-card__orig">${formatBDT(p.orig)}</span>` : ""}
      </p>
    </article>`;
}

function renderHeader() {
  const badge = document.getElementById("cart-badge");
  const count = cartCount();
  badge.textContent = count;
  badge.dataset.zero = count === 0 ? "true" : "false";

  const avatar = document.getElementById("account-avatar");
  const label = document.getElementById("account-label");
  const btn = document.getElementById("account-btn");

  if (state.auth === "resolving") {
    avatar.textContent = "…";
    avatar.classList.remove("logged");
    label.textContent = "";
    btn.disabled = true;
  } else if (state.auth === "logged_in") {
    avatar.innerHTML = state.user.avatar
      ? `<img src="${state.user.avatar}" alt="">`
      : "R";
    avatar.classList.add("logged");
    label.textContent = "Hi, " + state.user.name.split(" ")[0];
    btn.disabled = false;
  } else {
    avatar.textContent = "○";
    avatar.classList.remove("logged");
    label.textContent = "";
    btn.disabled = false;
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    if (I18N[state.locale][k]) el.textContent = I18N[state.locale][k];
  });

  document.querySelectorAll("#lang-dropdown [data-locale]").forEach((b) => {
    b.classList.toggle("active", b.dataset.locale === state.locale);
  });
  document.getElementById("lang-btn").textContent = state.locale === "bn" ? "BN" : "EN";
}

function renderAccountDropdown() {
  const dd = document.getElementById("account-dropdown");
  if (state.auth === "resolving") {
    dd.innerHTML = `<div class="dropdown__item">Loading…</div>`;
    return;
  }
  if (state.auth === "guest") {
    dd.innerHTML = `
      <button type="button" class="dropdown__item cta" data-action="login">Sign In</button>
      <button type="button" class="dropdown__item" data-action="orders">My Orders</button>
      <button type="button" class="dropdown__item" data-action="coupons">My Coupons</button>`;
  } else {
    dd.innerHTML = `
      <div class="user-info">${state.user.name}</div>
      <button type="button" class="dropdown__item" data-action="account">My Account</button>
      <button type="button" class="dropdown__item" data-action="orders">My Orders</button>
      <button type="button" class="dropdown__item" data-action="coupons">My Coupons</button>
      <button type="button" class="dropdown__item" data-action="logout">Sign Out</button>`;
  }
}

function renderCategoryDrawer() {
  document.getElementById("category-drawer").innerHTML = CATEGORIES.map(
    (c) => `<a href="#/category/${c.id}" data-nav>${c.name}</a>`
  ).join("");
}

function renderCartPreview() {
  const preview = document.getElementById("cart-preview");
  if (!state.cart.length) {
    preview.innerHTML = `<p style="color:#888;font-size:13px">Your cart is empty</p>`;
    return;
  }
  preview.innerHTML =
    state.cart
      .slice(0, 3)
      .map(
        (l) =>
          `<div style="display:flex;gap:8px;margin-bottom:8px;font-size:12px">
            <div style="width:48px;height:60px;background:#e8e8e8;border-radius:2px"></div>
            <div><strong>${l.title}</strong><br>${formatBDT(l.price)} × ${l.qty}</div>
          </div>`
      )
      .join("") +
    `<a href="#/cart" class="btn btn--primary btn--block" style="margin-top:8px" data-nav>View Cart</a>`;
}

function renderHome() {
  const rows = state.feedRows;
  const items = PRODUCTS.slice(0, rows * 4);
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="banner">
      <span class="banner__label">Summer Sale — Up to 50% OFF</span>
      <div class="banner__dots"><span class="banner__dot active"></span><span class="banner__dot"></span><span class="banner__dot"></span></div>
    </div>

    <p class="section-label">Quick Access — App L1 Categories</p>
    <div class="quick-grid">
      ${CATEGORIES.map(
        (c) =>
          `<a href="#/category/${c.id}" class="quick-item" data-nav>
            <div class="quick-item__icon">${c.icon}</div>${c.name}
          </a>`
      ).join("")}
    </div>

    <p class="section-label">Campaign Zones</p>
    <div class="zone-grid">
      ${ZONES.map((z) => `<a href="${z.route}" class="zone-card" data-nav>${z.title}</a>`).join("")}
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h2 style="margin:0;font-size:18px">Recommended For You</h2>
    </div>
    <div class="product-grid">${items.map(productCard).join("")}</div>
    ${
      rows < 3
        ? `<div class="view-more-wrap"><button type="button" class="btn" id="view-more">${t("viewMore")} (+10 rows)</button></div>`
        : ""
    }

    <div class="service-cards">
      <button type="button" class="service-card" data-service="Easy Return"><strong>Easy Return</strong><span>30-day hassle-free returns</span></button>
      <button type="button" class="service-card" data-service="24/7 Support"><strong>24/7 Support</strong><span>Always here to help</span></button>
      <button type="button" class="service-card" data-service="Secure Payment"><strong>Secure Payment</strong><span>COD available on Web</span></button>
    </div>`;

  document.getElementById("sticky-fab").classList.remove("hidden");

  document.getElementById("view-more")?.addEventListener("click", () => {
    state.feedRows += 1;
    render();
    showToast("Loaded 10 more rows");
  });

  bindProductCards();
  bindServiceCards();
}

function renderSearch() {
  const q = state.route.params.get("q") || state.searchQuery || "dress";
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <h1 class="page-title">Search: "${q}"</h1>
    <div class="search-toolbar">
      <select id="sort-select"><option>Best Match</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Newest</option></select>
      <select><option>Filter</option><option>Category</option></select>
      <span class="result-count">128 results</span>
    </div>
    <div class="product-grid">${PRODUCTS.map(productCard).join("")}</div>`;
  bindProductCards();
}

function renderCategory(id) {
  const cat = CATEGORIES.find((c) => c.id === id) || { name: id };
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <h1 class="page-title">${cat.name}</h1>
    <div class="search-toolbar">
      <select><option>Best Match</option><option>Price</option><option>Newest</option></select>
    </div>
    <div class="product-grid">${PRODUCTS.map(productCard).join("")}</div>`;
  bindProductCards();
}

function renderPDP(id) {
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  state.selectedProduct = p;
  document.getElementById("sticky-fab").classList.add("hidden");
  const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;
  document.getElementById("app").innerHTML = `
    <nav class="breadcrumb"><a href="#/" data-nav>Home</a> › <a href="#/category/women" data-nav>Women</a> › ${p.title}</nav>
    <div class="pdp-layout">
      <div>
        <div class="gallery"></div>
        <div class="gallery__thumbs">
          <div class="gallery__thumb active"></div>
          <div class="gallery__thumb"></div>
          <div class="gallery__thumb"></div>
        </div>
        <p class="pdp-meta" style="margin-top:16px"><a href="#/store/s1" data-nav>Visit ${p.store} ›</a></p>
        <div class="form-block" style="margin-top:16px"><h3>Additional Information</h3><p style="font-size:13px;color:#555">Material: Cotton blend · Origin: Imported</p></div>
        <div class="form-block"><h3>Description</h3><p style="font-size:13px;color:#555">Comfortable everyday wear with modern fit. Machine washable.</p></div>
        <p class="pdp-meta">24/7 Support · Product Replace</p>
      </div>
      <div class="pdp-info">
        <h1>${p.title}</h1>
        <div class="price-row">
          <span class="sale">${formatBDT(p.price)}</span>
          ${p.orig ? `<span class="orig">${formatBDT(p.orig)}</span>` : ""}
          ${disc ? `<span class="discount-pill">-${disc}%</span>` : ""}
        </div>
        ${p.tag === "Brand Zone" ? `<div class="authentic">100% Authentic Guarantee</div>` : p.tag ? `<div class="authentic">${p.tag}</div>` : ""}
        <div class="sku-group"><label>Color</label><div class="sku-options"><button type="button" class="sku-opt active">Red</button><button type="button" class="sku-opt">Blue</button><button type="button" class="sku-opt disabled">Green</button></div></div>
        <div class="sku-group"><label>Size</label><div class="sku-options"><button type="button" class="sku-opt">S</button><button type="button" class="sku-opt active">M</button><button type="button" class="sku-opt">L</button></div></div>
        <div class="sku-group"><label>Quantity</label><div class="qty-stepper"><button type="button" data-qty="-1">−</button><span id="pdp-qty">1</span><button type="button" data-qty="1">+</button></div></div>
        <p class="pdp-meta">Delivery: Local · 3–5 business days · Shipping from ৳60</p>
        <div class="pdp-actions">
          <button type="button" class="btn btn--primary" id="pdp-add">${t("addToCart")}</button>
          <button type="button" class="btn btn--accent" id="pdp-buy">${t("buyNow")}</button>
        </div>
      </div>
    </div>
    <h2 style="margin-top:40px;font-size:18px">You May Also Like</h2>
    <div class="product-grid" style="margin-top:12px">${PRODUCTS.slice(0, 4).map(productCard).join("")}</div>`;

  document.getElementById("pdp-add").addEventListener("click", () => openSkuModal(p, "cart"));
  document.getElementById("pdp-buy").addEventListener("click", () => openSkuModal(p, "buy"));
  bindProductCards();
  bindSkuOptions();
}

function openSkuModal(product, mode) {
  state.skuModal = { product, mode, color: "Red", size: "M", qty: 1 };
  const modal = document.getElementById("modal");
  modal.classList.add("sku-sheet");
  openModal(
    `<div class="modal__head"><h2>Select Options</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
    <p><strong>${product.title}</strong></p>
    <p style="color:#e6531a;font-weight:700;font-size:18px">${formatBDT(product.price)}</p>
    <div class="sku-group"><label>Color</label><div class="sku-options" id="modal-colors"><button type="button" class="sku-opt active" data-v="Red">Red</button><button type="button" class="sku-opt" data-v="Blue">Blue</button></div></div>
    <div class="sku-group"><label>Size</label><div class="sku-options" id="modal-sizes"><button type="button" class="sku-opt" data-v="S">S</button><button type="button" class="sku-opt active" data-v="M">M</button><button type="button" class="sku-opt" data-v="L">L</button></div></div>
    <div class="sku-group"><label>Quantity</label><div class="qty-stepper"><button type="button" id="mq-minus">−</button><span id="mq-val">1</span><button type="button" id="mq-plus">+</button></div></div>
    <button type="button" class="btn btn--accent btn--block" id="sku-confirm">${mode === "buy" ? t("buyNow") : t("addToCart")}</button>`,
    "wide"
  );

  const syncQty = (n) => {
    state.skuModal.qty = Math.max(1, Math.min(5, n));
    document.getElementById("mq-val").textContent = state.skuModal.qty;
  };
  document.getElementById("mq-minus").onclick = () => syncQty(state.skuModal.qty - 1);
  document.getElementById("mq-plus").onclick = () => syncQty(state.skuModal.qty + 1);

  document.querySelectorAll("#modal-colors .sku-opt, #modal-sizes .sku-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll(".sku-opt").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.parentElement.id === "modal-colors") state.skuModal.color = btn.dataset.v;
      else state.skuModal.size = btn.dataset.v;
    });
  });

  document.getElementById("sku-confirm").onclick = () => {
    const { product, mode, color, size, qty } = state.skuModal;
    if (!color || !size) {
      showToast("Please select all options");
      return;
    }
    addToCart(product, color, size, qty);
    closeModal();
    modal.classList.remove("sku-sheet");
    showToast(mode === "buy" ? "Added — redirecting to checkout" : "Added to cart");
    if (mode === "buy") {
      if (state.auth !== "logged_in") {
        showToast("Please sign in to checkout");
        state.auth = "guest";
        renderHeader();
      } else navigate("/checkout");
    } else {
      renderHeader();
    }
  };
}

function addToCart(product, color, size, qty) {
  const existing = state.cart.find((l) => l.id === product.id && l.color === color && l.size === size);
  if (existing) existing.qty += qty;
  else
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      color,
      size,
      qty,
      selected: true,
      valid: true,
    });
  renderHeader();
  renderCartPreview();
}

function renderCart() {
  document.getElementById("sticky-fab").classList.add("hidden");
  if (!state.cart.length) {
    document.getElementById("app").innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items</p>
        <a href="#/" class="btn btn--primary" data-nav>Continue Shopping</a>
      </div>`;
    return;
  }
  const total = cartSelectedTotal();
  document.getElementById("app").innerHTML = `
    <h1 class="page-title">Shopping Cart</h1>
    <div class="cart-layout">
      <div>
        <div class="cart-toolbar">
          <label><input type="checkbox" id="select-all" checked> Select All</label>
          <button type="button" class="btn" id="edit-mode">Edit</button>
        </div>
        ${state.cart
          .map(
            (l, i) => `
          <div class="cart-line ${l.valid ? "" : "invalid"}">
            <input type="checkbox" ${l.selected ? "checked" : ""} data-line="${i}" class="line-check">
            <div class="cart-line__thumb"></div>
            <div>
              <strong>${l.title}</strong>
              <p style="font-size:12px;color:#888;margin:4px 0">${l.color} / ${l.size}</p>
              <p style="font-weight:700;color:#e6531a">${formatBDT(l.price)}</p>
            </div>
            <div class="qty-stepper"><button type="button" data-line-qty="${i}" data-d="-1">−</button><span>${l.qty}</span><button type="button" data-line-qty="${i}" data-d="1">+</button></div>
          </div>`
          )
          .join("")}
        <div class="cart-line invalid" style="margin-top:16px">
          <input type="checkbox" disabled>
          <div class="cart-line__thumb"></div>
          <div><strong>Sold Out Item (demo)</strong><p style="font-size:12px;color:#888">Unavailable</p></div>
          <button type="button" class="btn" style="font-size:12px">Delete</button>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-row"><span>Merchandise</span><span>${formatBDT(total)}</span></div>
        <div class="summary-row"><span>Discount</span><span>-৳0</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatBDT(total)}</span></div>
        <button type="button" class="btn btn--accent btn--block" style="margin-top:16px" id="go-checkout">${t("checkout")}</button>
      </div>
    </div>`;

  document.getElementById("go-checkout").onclick = () => {
    if (state.auth !== "logged_in") {
      showToast("Sign in required — redirect to /login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  document.querySelectorAll("[data-line-qty]").forEach((btn) => {
    btn.onclick = () => {
      const i = +btn.dataset.lineQty;
      const d = +btn.dataset.d;
      state.cart[i].qty = Math.max(1, state.cart[i].qty + d);
      render();
    };
  });
}

function renderCheckout() {
  if (state.auth !== "logged_in") {
    document.getElementById("app").innerHTML = `
      <div class="empty-state">
        <h2>Login Required (BR619)</h2>
        <p>Checkout requires sign in. Redirect: /login?redirect=/checkout</p>
        <button type="button" class="btn btn--primary" id="demo-login">Demo: Sign In</button>
      </div>`;
    document.getElementById("demo-login").onclick = () => {
      state.auth = "logged_in";
      renderHeader();
      render();
    };
    return;
  }

  const subtotal = cartSelectedTotal() || 1299;
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <h1 class="page-title">Checkout</h1>
    <div class="checkout-layout">
      <div>
        <div class="form-block">
          <h3>Shipping Address</h3>
          <div class="form-grid">
            <div class="form-field"><label>Name</label><input value="Rahul Ahmed"></div>
            <div class="form-field"><label>Phone (+880)</label><input value="01712345678"></div>
            <div class="form-field full"><label>Region / City / District</label><input value="Dhaka · Dhaka · Gulshan"></div>
            <div class="form-field full"><label>Address</label><textarea rows="2">Road 12, Block C, Apt 4B</textarea></div>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px">
            <button type="button" class="btn btn--primary">Save</button>
            <button type="button" class="btn" id="change-addr">Change / Edit Address</button>
          </div>
        </div>
        <div class="form-block"><h3>Delivery</h3><p><strong>Local Delivery</strong> · Shipping Fee: ৳60 (fixed)</p></div>
        <div class="form-block"><h3>Order Items</h3><p style="font-size:13px"><strong>Fashion Hub</strong> — Cotton Blend Dress × 1</p><label style="font-size:12px;margin-top:8px;display:block">Remark (per seller)</label><input placeholder="Optional note for seller" style="width:100%;padding:8px;border:1px solid #e8e8e8;margin-top:4px"></div>
        <div class="form-block"><h3>Payment</h3><div class="payment-option"><input type="radio" checked> Cash on Delivery (COD) — Web P0 only</div></div>
      </div>
      <div class="summary-card">
        <h3 style="margin:0 0 12px">Coupon & Code</h3>
        <div class="coupon-row"><input placeholder="Enter coupon code"><button type="button" class="btn">Apply</button></div>
        <button type="button" class="btn btn--block" id="open-coupons" style="margin-bottom:16px">Select from My Coupons</button>
        <div class="summary-row"><span>Subtotal <small title="VAT included">(?)</small></span><span>${formatBDT(subtotal)}</span></div>
        <div class="summary-row"><span>Promotion</span><span>-৳100</span></div>
        <div class="summary-row"><span>Coupon</span><span>-৳50</span></div>
        <div class="summary-row"><span>Shipping</span><span>৳60</span></div>
        <div class="summary-row"><span>COD Fee</span><span>Free</span></div>
        <div class="summary-row total"><span>Payable</span><span>${formatBDT(subtotal - 150 + 60)}</span></div>
        <button type="button" class="btn btn--accent btn--block" style="margin-top:16px" id="place-order">Place Order</button>
      </div>
    </div>`;

  document.getElementById("change-addr").onclick = () =>
    openModal(
      `<div class="modal__head"><h2>Saved Addresses</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
      <p style="padding:12px;border:1px solid #111;border-radius:4px;margin-bottom:8px"><strong>Default</strong><br>Gulshan, Dhaka</p>
      <p style="padding:12px;border:1px solid #e8e8e8;border-radius:4px">Uttara, Dhaka</p>
      <button type="button" class="btn btn--block" data-close-modal style="margin-top:12px">Close</button>`
    );

  document.getElementById("open-coupons").onclick = () =>
    openModal(
      `<div class="modal__head"><h2>My Coupons</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
      <p style="font-size:12px;color:#888;margin-bottom:12px">Single select only · Default: max discount</p>
      <p style="font-weight:600;margin-bottom:8px">Available</p>
      <label style="display:block;padding:12px;border:2px solid #111;border-radius:4px;margin-bottom:8px"><input type="radio" name="c" checked> SAVE50 — ৳50 off (selected)</label>
      <label style="display:block;padding:12px;border:1px solid #e8e8e8;border-radius:4px;margin-bottom:8px"><input type="radio" name="c"> WELCOME20 — ৳20 off</label>
      <p style="font-weight:600;margin:16px 0 8px;color:#888">Not Available</p>
      <div style="padding:12px;background:#f5f5f5;border-radius:4px;opacity:0.6;margin-bottom:8px">MIN500 — Minimum spend not met</div>
      <button type="button" class="btn btn--primary btn--block" data-close-modal>Confirm</button>`
    );

  document.getElementById("place-order").onclick = () => {
    document.getElementById("lang-overlay").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("lang-overlay").classList.add("hidden");
      navigate("/checkout/result");
    }, 1200);
  };
}

function renderCheckoutResult() {
  document.getElementById("app").innerHTML = `
    <div class="empty-state" style="padding:64px 16px">
      <div style="width:64px;height:64px;border-radius:50%;background:#0a7a3e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 16px">✓</div>
      <h2>Order Placed Successfully</h2>
      <p>Order #KB20260911001 · COD ৳${(cartSelectedTotal() || 1299) - 150 + 60}</p>
      <button type="button" class="btn btn--primary" style="margin-top:16px">View Order List</button>
      <a href="#/" class="btn" style="margin-top:8px;display:inline-flex" data-nav>Continue Shopping</a>
    </div>`;
}

function renderStore() {
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <div class="store-header">
      <div class="store-logo" id="store-info" title="Store info"></div>
      <div><h1 style="margin:0;font-size:20px">Fashion Hub</h1><p style="color:#888;margin:4px 0 0">★ 4.8 · 12.5k followers</p></div>
    </div>
    <div class="tabs"><button type="button" class="tab active" data-tab="home">Home</button><button type="button" class="tab" data-tab="items">Items</button></div>
    <div id="store-content">
      <div class="banner" style="height:140px;margin-bottom:20px"><span class="banner__label">Store Banner</span></div>
      <h3>Featured Products</h3>
      <div class="product-grid" style="margin:12px 0 24px">${PRODUCTS.slice(0, 4).map(productCard).join("")}</div>
      <h3>Recommend</h3>
      <div class="product-grid">${PRODUCTS.map(productCard).join("")}</div>
      <div class="view-more-wrap"><button type="button" class="btn">${t("viewMore")}</button></div>
    </div>`;

  document.getElementById("store-info").onclick = () =>
    openModal(
      `<div class="modal__head"><h2>Fashion Hub</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
      <p>Premium fashion retailer based in Dhaka. Authentic products with fast local delivery.</p>
      <button type="button" class="btn btn--block" data-close-modal style="margin-top:16px">Close</button>`
    );

  bindProductCards();
}

function renderTopic(id) {
  const titles = { brand: "Brand Zone", global: "Global", featured: "Featured", trending: "Trending" };
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <h1 class="page-title">${titles[id] || id} Topic</h1>
    <div class="banner" style="height:160px;margin-bottom:24px"><span class="banner__label">${titles[id] || id}</span></div>
    <div class="product-grid">${PRODUCTS.map(productCard).join("")}</div>`;
  bindProductCards();
}

function openSearchModal() {
  openModal(
    `<div class="modal__head"><h2>Search</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
    <input id="search-input" placeholder="${t("searchPlaceholder")}" style="width:100%;padding:12px;border:1px solid #e8e8e8;border-radius:4px;font-size:16px" autofocus>
    <p style="font-size:12px;color:#888;margin:16px 0 8px">Hot Searches</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px">${["dress", "shoes", "phone", "bag"].map((k) => `<button type="button" class="btn" data-hot="${k}">${k}</button>`).join("")}</div>
    <p style="font-size:12px;color:#888;margin:16px 0 8px">Recent</p>
    <button type="button" class="dropdown__item" style="width:100%;text-align:left;border:1px solid #e8e8e8;border-radius:4px" data-hot="jeans">jeans</button>`,
    "wide"
  );
  const input = document.getElementById("search-input");
  input.focus();
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      closeModal();
      navigate("/search?q=" + encodeURIComponent(input.value.trim()));
    }
  });
  document.querySelectorAll("[data-hot]").forEach((b) => {
    b.onclick = () => {
      closeModal();
      navigate("/search?q=" + encodeURIComponent(b.dataset.hot));
    };
  });
}

function bindProductCards() {
  document.querySelectorAll("[data-product]").forEach((el) => {
    el.onclick = () => navigate("/product/" + el.dataset.product);
  });
}

function bindServiceCards() {
  document.querySelectorAll("[data-service]").forEach((btn) => {
    btn.onclick = () =>
      openModal(
        `<div class="modal__head"><h2>${btn.dataset.service}</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
        <p>${btn.querySelector("span")?.textContent || "Service details aligned with App."}</p>
        <div class="modal__foot"><button type="button" class="btn" data-close-modal>Close</button></div>`
      );
  });
}

function bindSkuOptions() {
  document.querySelectorAll(".pdp-info .sku-options").forEach((group) => {
    group.querySelectorAll(".sku-opt:not(.disabled)").forEach((btn) => {
      btn.onclick = () => {
        group.querySelectorAll(".sku-opt").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      };
    });
  });
}

function render() {
  state.route = parseRoute();
  const { path } = state.route;
  renderHeader();
  renderCategoryDrawer();
  renderCartPreview();

  if (path === "/" || path === "") renderHome();
  else if (path.startsWith("/search")) renderSearch();
  else if (path.startsWith("/category/")) renderCategory(path.split("/")[2]);
  else if (path.startsWith("/product/")) renderPDP(path.split("/")[2]);
  else if (path === "/cart") renderCart();
  else if (path === "/checkout") renderCheckout();
  else if (path === "/checkout/result") renderCheckoutResult();
  else if (path.startsWith("/store/")) renderStore();
  else if (path.startsWith("/topic/")) renderTopic(path.split("/")[2]);
  else renderHome();

  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      navigate(a.getAttribute("href").slice(1));
    };
  });
}

function initEvents() {
  window.addEventListener("hashchange", render);

  document.getElementById("search-entry").onclick = openSearchModal;

  document.getElementById("lang-btn").onclick = (e) => {
    e.stopPropagation();
    document.getElementById("lang-dropdown").classList.toggle("hidden");
    closeDropdowns(["lang-dropdown"]);
    document.getElementById("lang-dropdown").classList.remove("hidden");
  };

  document.querySelectorAll("#lang-dropdown [data-locale]").forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.locale === state.locale) return;
      document.getElementById("lang-overlay").classList.remove("hidden");
      setTimeout(() => {
        state.locale = btn.dataset.locale;
        document.getElementById("lang-overlay").classList.add("hidden");
        render();
        showToast(state.locale === "bn" ? "ভাষা পরিবর্তন হয়েছে" : "Language updated");
      }, 900);
    };
  });

  document.getElementById("categories-btn").onmouseenter = () => {
    document.getElementById("category-drawer").classList.remove("hidden");
  };
  document.getElementById("categories-wrap").onmouseleave = () => {
    document.getElementById("category-drawer").classList.add("hidden");
  };

  document.getElementById("account-btn").onmouseenter = () => {
    if (state.auth === "resolving") return;
    renderAccountDropdown();
    document.getElementById("account-dropdown").classList.remove("hidden");
  };
  document.getElementById("account-wrap").onmouseleave = () => {
    document.getElementById("account-dropdown").classList.add("hidden");
  };

  document.getElementById("account-dropdown").onclick = (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    document.getElementById("account-dropdown").classList.add("hidden");
    if (action === "login") showToast("Redirect → /login");
    else if (action === "logout") {
      state.auth = "guest";
      showToast("Signed out → /login");
      renderHeader();
    } else if (action === "orders" || action === "coupons" || action === "account") {
      if (state.auth !== "logged_in") showToast("BR619: Sign in required");
      else showToast("Redirect → /account/" + action);
    }
  };

  document.getElementById("cart-btn").onmouseenter = () => {
    renderCartPreview();
    document.getElementById("cart-preview").classList.remove("hidden");
  };
  document.getElementById("cart-wrap").onmouseleave = () => {
    document.getElementById("cart-preview").classList.add("hidden");
  };
  document.getElementById("cart-btn").onclick = () => navigate("/cart");

  ["support-btn", "footer-support", "sticky-fab"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => showToast("Redirect → supportEntryUrl (他人 PRD)"));
  });

  document.querySelectorAll(".trust-bar__item[data-trust]").forEach((btn) => {
    btn.onclick = () => {
      const c = TRUST_CONTENT[btn.dataset.trust];
      openModal(
        `<div class="modal__head"><h2>${c.title}</h2><button type="button" class="modal__close" data-close-modal>×</button></div><p>${c.body}</p><div class="modal__foot"><button type="button" class="btn" data-close-modal>Close</button></div>`
      );
    };
  });

  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]") || e.target.classList.contains("modal__backdrop")) {
      closeModal();
      document.getElementById("modal").classList.remove("sku-sheet");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDropdowns();
    }
  });

  document.addEventListener("click", () => closeDropdowns());

  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      document.getElementById("trust-bar").classList.toggle("collapsed", y > 80);
      document.getElementById("site-header").classList.toggle("compact", y > 80 && y > lastScroll);
      lastScroll = y;
    },
    { passive: true }
  );

  // Demo: add sample cart item & resolve auth
  setTimeout(() => {
    state.auth = "guest";
    addToCart(PRODUCTS[0], "Red", "M", 1);
    addToCart(PRODUCTS[1], "Blue", "32", 2);
    render();
  }, 400);

  document.getElementById("account-wrap").addEventListener("dblclick", () => {
    state.auth = state.auth === "logged_in" ? "guest" : "logged_in";
    renderHeader();
    showToast(state.auth === "logged_in" ? "Logged in (demo)" : "Logged out");
  });
}

function closeDropdowns(except = []) {
  ["lang-dropdown", "account-dropdown", "category-drawer", "cart-preview"].forEach((id) => {
    if (!except.includes(id)) document.getElementById(id)?.classList.add("hidden");
  });
}

initEvents();
render();
