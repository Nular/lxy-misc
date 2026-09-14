/* KickBazar ToC Web Prototype — PRD v1.11 */

const CATEGORIES = [
  { id: "women", name: "Women", icon: "W" },
  { id: "men", name: "Men", icon: "M" },
  { id: "kids", name: "Kids", icon: "K" },
  { id: "beauty", name: "Beauty", icon: "B" },
  { id: "home", name: "Home", icon: "H" },
  { id: "electronics", name: "Electronics", icon: "E" },
  { id: "sports", name: "Sports", icon: "S" },
];

const CATEGORY_TREE = {
  women: {
    children: {
      dresses: {
        name: "Dresses",
        l3: [
          { id: "midi-dresses", name: "Midi Dresses" },
          { id: "maxi-dresses", name: "Maxi Dresses" },
          { id: "party-dresses", name: "Party Dresses" },
          { id: "casual-dresses", name: "Casual Dresses" },
          { id: "work-dresses", name: "Work Dresses" },
        ],
      },
      tops: {
        name: "Tops & Blouses",
        l3: [
          { id: "blouses", name: "Blouses" },
          { id: "t-shirts", name: "T-Shirts" },
          { id: "tank-tops", name: "Tank Tops" },
          { id: "shirts", name: "Shirts" },
        ],
      },
      bottoms: {
        name: "Bottoms",
        l3: [
          { id: "jeans", name: "Jeans" },
          { id: "skirts", name: "Skirts" },
          { id: "shorts", name: "Shorts" },
          { id: "trousers", name: "Trousers" },
        ],
      },
    },
  },
  men: {
    children: {
      shirts: {
        name: "Shirts",
        l3: [
          { id: "formal-shirts", name: "Formal Shirts" },
          { id: "casual-shirts", name: "Casual Shirts" },
          { id: "polo-shirts", name: "Polo Shirts" },
        ],
      },
      pants: {
        name: "Pants",
        l3: [
          { id: "jeans", name: "Jeans" },
          { id: "chinos", name: "Chinos" },
          { id: "joggers", name: "Joggers" },
        ],
      },
      outerwear: {
        name: "Outerwear",
        l3: [
          { id: "jackets", name: "Jackets" },
          { id: "hoodies", name: "Hoodies" },
          { id: "coats", name: "Coats" },
        ],
      },
    },
  },
  kids: {
    children: {
      girls: { name: "Girls", l3: [{ id: "dresses", name: "Dresses" }, { id: "tops", name: "Tops" }, { id: "sets", name: "Sets" }] },
      boys: { name: "Boys", l3: [{ id: "t-shirts", name: "T-Shirts" }, { id: "shorts", name: "Shorts" }, { id: "sets", name: "Sets" }] },
      baby: { name: "Baby", l3: [{ id: "onesies", name: "Onesies" }, { id: "rompers", name: "Rompers" }, { id: "accessories", name: "Accessories" }] },
    },
  },
  beauty: {
    children: {
      skincare: {
        name: "Skincare",
        l3: [
          { id: "serum", name: "Serum" },
          { id: "moisturizer", name: "Moisturizer" },
          { id: "cleanser", name: "Cleanser" },
          { id: "sunscreen", name: "Sunscreen" },
        ],
      },
      makeup: {
        name: "Makeup",
        l3: [
          { id: "lipstick", name: "Lipstick" },
          { id: "foundation", name: "Foundation" },
          { id: "mascara", name: "Mascara" },
        ],
      },
    },
  },
  home: {
    children: {
      kitchen: { name: "Kitchen", l3: [{ id: "cookware", name: "Cookware" }, { id: "storage", name: "Storage" }, { id: "utensils", name: "Utensils" }] },
      decor: { name: "Decor", l3: [{ id: "wall-art", name: "Wall Art" }, { id: "candles", name: "Candles" }, { id: "rugs", name: "Rugs" }] },
    },
  },
  electronics: {
    children: {
      audio: { name: "Audio", l3: [{ id: "earbuds", name: "Earbuds" }, { id: "headphones", name: "Headphones" }, { id: "speakers", name: "Speakers" }] },
      mobile: { name: "Mobile", l3: [{ id: "cases", name: "Cases" }, { id: "chargers", name: "Chargers" }, { id: "cables", name: "Cables" }] },
    },
  },
  sports: {
    children: {
      footwear: { name: "Footwear", l3: [{ id: "running", name: "Running" }, { id: "training", name: "Training" }, { id: "casual", name: "Casual" }] },
      apparel: { name: "Apparel", l3: [{ id: "tops", name: "Tops" }, { id: "shorts", name: "Shorts" }, { id: "tracksuits", name: "Tracksuits" }] },
    },
  },
};

const STORES = {
  "Fashion Hub": { id: "s1", abbr: "FH", color: "#E53E3E", rating: 4.8, followers: "12.5k" },
  "Denim Co": { id: "s2", abbr: "DC", color: "#3182CE", rating: 4.6, followers: "8.2k" },
  "Tech Store": { id: "s3", abbr: "TS", color: "#805AD5", rating: 4.9, followers: "20k" },
  "Sports BD": { id: "s4", abbr: "SB", color: "#38A169", rating: 4.7, followers: "5.1k" },
  "Bag World": { id: "s5", abbr: "BW", color: "#DD6B20", rating: 4.5, followers: "3.8k" },
  "Kids Zone": { id: "s6", abbr: "KZ", color: "#D53F8C", rating: 4.8, followers: "6.4k" },
  "Beauty Plus": { id: "s7", abbr: "BP", color: "#319795", rating: 4.9, followers: "9.9k" },
};

const SEARCH_DISCOVERY = ["dress", "sneakers", "phone case", "handbag", "skincare", "jeans", "watch", "t-shirt"];

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
    viewAll: "View All",
    addedSuccess: "Added successfully",
  },
  bn: {
    searchPlaceholder: "পণ্য খুঁজুন",
    addToCart: "কার্টে যোগ করুন",
    buyNow: "এখনই কিনুন",
    checkout: "চেকআউট",
    viewMore: "আরও দেখুন",
    viewAll: "View All",
    addedSuccess: "Added successfully",
  },
};

const MEGA_REC_COLS = 5;
const MEGA_REC_ROWS = 2;
const MEGA_REC_SLOTS = MEGA_REC_COLS * MEGA_REC_ROWS;

const TRUST_CONTENT = {
  return: { title: "Easy Return", body: "30-day hassle-free returns on eligible items. Same policy as the KickBazar App." },
  support: { title: "24/7 Support", body: "Our support team is available around the clock via chat and phone." },
};

const state = {
  locale: "en",
  auth: "guest",
  user: { name: "Rahul Ahmed", avatar: "" },
  cart: [],
  feedRows: 2,
  route: parseRoute(),
  recentSearches: ["jeans", "dress"],
  cartEditMode: false,
  appliedCoupon: 50,
  megaL1: CATEGORIES[0]?.id || "women",
  megaL2: null,
  l1FilterExpanded: {},
};

function formatBDT(n) {
  return "৳" + Math.round(n).toLocaleString("en-BD");
}

function getL1(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, name: id };
}

function getL2(l1Id, l2Id) {
  const node = CATEGORY_TREE[l1Id]?.children?.[l2Id];
  if (!node) return null;
  return { id: l2Id, name: node.name, l3: node.l3 || [] };
}

function getL3List(l1Id, l2Id) {
  return getL2(l1Id, l2Id)?.l3 || [];
}

function categoryL2Path(l1Id, l2Id, l3Id) {
  let path = `/category/${l1Id}/${l2Id}`;
  if (l3Id) path += `?l3=${encodeURIComponent(l3Id)}`;
  return path;
}

function filterProductsByL3(products, l3Id, l3List) {
  if (!l3Id || !l3List.length) return products;
  const idx = l3List.findIndex((item) => item.id === l3Id);
  if (idx < 0) return products;
  return products.filter((_, i) => i % l3List.length === idx);
}

function categoryL2Path(l1Id, l2Id, l3Id) {
  let path = `/category/${l1Id}/${l2Id}`;
  if (l3Id) path += `?l3=${encodeURIComponent(l3Id)}`;
  return path;
}

function categoryL1Path(l1Id, l2Id, l3Id) {
  const params = new URLSearchParams();
  if (l2Id) params.set("l2", l2Id);
  if (l3Id) params.set("l3", l3Id);
  const qs = params.toString();
  return qs ? `/category/${l1Id}?${qs}` : `/category/${l1Id}`;
}

function getL2Keys(l1Id) {
  return Object.keys(CATEGORY_TREE[l1Id]?.children || {});
}

function filterProductsForL1(products, l1Id, l2Id, l3Id) {
  if (!l2Id) return products;
  const l2Keys = getL2Keys(l1Id);
  const l2Idx = l2Keys.indexOf(l2Id);
  if (l2Idx < 0) return products;
  const l3List = getL3List(l1Id, l2Id);
  if (l3Id && l3List.length) return filterProductsByL3(products, l3Id, l3List);
  return products.filter((_, i) => i % l2Keys.length === l2Idx);
}

function categoryFilterL1HTML(l1Id, selectedL2, selectedL3) {
  const l2Map = CATEGORY_TREE[l1Id]?.children || {};
  const l2Keys = Object.keys(l2Map);
  if (!l2Keys.length) return "";

  if (selectedL2) state.l1FilterExpanded[selectedL2] = true;

  const groups = l2Keys
    .map((l2Id) => {
      const l2 = l2Map[l2Id];
      const l3List = l2.l3 || [];
      const expanded = !!state.l1FilterExpanded[l2Id];
      const l2Active = selectedL2 === l2Id && !selectedL3;
      const hasL3 = l3List.length > 0;
      return `
        <li class="category-filter__l2">
          <div class="category-filter__l2-row">
            ${
              hasL3
                ? `<button type="button" class="category-filter__expand${expanded ? " expanded" : ""}" data-expand-l2="${l2Id}" aria-expanded="${expanded}" aria-label="Expand ${l2.name}">▾</button>`
                : `<span class="category-filter__expand-spacer"></span>`
            }
            <button type="button" class="category-filter__item category-filter__item--l2${l2Active ? " active" : ""}" data-l2="${l2Id}">${l2.name}</button>
          </div>
          ${
            hasL3
              ? `<ul class="category-filter__l3-list${expanded ? "" : " hidden"}">
              ${l3List
                .map(
                  (item) =>
                    `<li><button type="button" class="category-filter__item category-filter__item--l3${selectedL2 === l2Id && selectedL3 === item.id ? " active" : ""}" data-l2="${l2Id}" data-l3="${item.id}">${item.name}</button></li>`
                )
                .join("")}
            </ul>`
              : ""
          }
        </li>`;
    })
    .join("");

  return `
    <aside class="category-filter" aria-label="Filters">
      <h3 class="category-filter__title">Filter</h3>
      <div class="category-filter__group">
        <p class="category-filter__label">Categories</p>
        <ul class="category-filter__accordion">
          <li>
            <button type="button" class="category-filter__item${!selectedL2 ? " active" : ""}" data-l2="">All</button>
          </li>
          ${groups}
        </ul>
      </div>
    </aside>`;
}

function categoryFilterL2HTML(l1Id, l2Id, selectedL3) {
  const l3List = getL3List(l1Id, l2Id);
  if (!l3List.length) return "";
  return `
    <aside class="category-filter" aria-label="Filters">
      <h3 class="category-filter__title">Filter</h3>
      <div class="category-filter__group">
        <p class="category-filter__label">Categories</p>
        <ul class="category-filter__list">
          <li>
            <button type="button" class="category-filter__item${!selectedL3 ? " active" : ""}" data-l3="">All</button>
          </li>
          ${l3List
            .map(
              (item) =>
                `<li><button type="button" class="category-filter__item${selectedL3 === item.id ? " active" : ""}" data-l3="${item.id}">${item.name}</button></li>`
            )
            .join("")}
        </ul>
      </div>
    </aside>`;
}

function bindCategoryFilterL1(l1Id) {
  document.querySelectorAll("[data-expand-l2]").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.expandL2;
      state.l1FilterExpanded[id] = !state.l1FilterExpanded[id];
      render();
    };
  });

  document.querySelectorAll(".category-filter__item[data-l2]").forEach((btn) => {
    btn.onclick = () => {
      const l2 = btn.dataset.l2 || null;
      const l3 = btn.dataset.l3 || null;
      if (l2) state.l1FilterExpanded[l2] = true;
      navigate(categoryL1Path(l1Id, l2, l3));
    };
  });
}

function bindCategoryFilterL2(l1Id, l2Id) {
  document.querySelectorAll(".category-filter__item").forEach((btn) => {
    btn.onclick = () => navigate(categoryL2Path(l1Id, l2Id, btn.dataset.l3 || null));
  });
}

function parseRoute() {
  const hash = location.hash.slice(1) || "/";
  const [path, qs] = hash.split("?");
  const params = new URLSearchParams(qs || "");
  return { path, params };
}

function navigate(path) {
  const route = path.startsWith("/") ? path : `/${path}`;
  location.hash = route;
}

function resolveNavHref(href) {
  if (!href) return "/";
  const hashIdx = href.indexOf("#");
  if (hashIdx >= 0) {
    const route = href.slice(hashIdx + 1);
    return route || "/";
  }
  return href.startsWith("/") ? href : `/${href}`;
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add("hidden"), 2800);
}

function openModal(html, className = "") {
  const panel = document.getElementById("modal-panel");
  panel.className = "modal__panel " + className;
  panel.innerHTML = html;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function openAppDownloadModal() {
  openModal(
    `<div class="modal__head"><h2>Get the Kickbazar APP</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
    <p>Shop faster with exclusive app deals, order tracking, and push notifications.</p>
    <div class="app-download-modal__stores">
      <a href="#" class="app-download-modal__store">App Store</a>
      <a href="#" class="app-download-modal__store">Google Play</a>
    </div>
    <div class="modal__foot"><button type="button" class="btn" data-close-modal>Maybe Later</button></div>`
  );
}

function t(key) {
  return I18N[state.locale][key] || I18N.en[key] || key;
}

function cartCount() {
  return state.cart.filter((l) => l.valid).reduce((s, l) => s + l.qty, 0);
}

function getSelectedCartLines() {
  return state.cart.filter((l) => l.valid && l.selected);
}

function computeOrderSummary(lines) {
  const selected = lines || getSelectedCartLines();
  if (!selected.length) {
    return { subtotal: 0, promotion: 0, coupon: 0, shipping: 0, codFee: 0, payable: 0 };
  }
  const subtotal = selected.reduce((s, l) => s + (l.orig || l.price) * l.qty, 0);
  const merchandise = selected.reduce((s, l) => s + l.price * l.qty, 0);
  const promotion = Math.max(0, subtotal - merchandise);
  const coupon = state.appliedCoupon;
  const shipping = 60;
  const codFee = 0;
  const payable = merchandise - coupon + shipping + codFee;
  return { subtotal, promotion, coupon, shipping, codFee, payable };
}

function orderSummaryHTML(summary, { showPayableLabel = true, totalLabel = "Payable" } = {}) {
  return `
    <div class="summary-row"><span>Subtotal <small title="VAT included">(?)</small></span><span>${formatBDT(summary.subtotal)}</span></div>
    <div class="summary-row"><span>Promotion</span><span>-${formatBDT(summary.promotion)}</span></div>
    <div class="summary-row"><span>Coupon</span><span>-${formatBDT(summary.coupon)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${formatBDT(summary.shipping)}</span></div>
    <div class="summary-row"><span>COD Fee</span><span>${summary.codFee === 0 ? "Free" : formatBDT(summary.codFee)}</span></div>
    <div class="summary-row total"><span>${totalLabel}</span><span>${formatBDT(summary.payable)}</span></div>`;
}

function productCard(p) {
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

function showCartBubble() {
  const bubble = document.getElementById("cart-bubble");
  bubble.textContent = t("addedSuccess");
  bubble.classList.remove("hidden");
  void bubble.offsetWidth;
  bubble.style.animation = "none";
  void bubble.offsetWidth;
  bubble.style.animation = "";
  clearTimeout(showCartBubble._t);
  showCartBubble._t = setTimeout(() => bubble.classList.add("hidden"), 2000);
}

function animateCartBadge() {
  const badge = document.getElementById("cart-badge");
  badge.classList.add("badge--pop");
  setTimeout(() => badge.classList.remove("badge--pop"), 400);
}

function renderHeader() {
  const badge = document.getElementById("cart-badge");
  const count = cartCount();
  badge.textContent = count;
  badge.dataset.zero = count === 0 ? "true" : "false";

  const avatar = document.getElementById("account-avatar");
  const btn = document.getElementById("account-btn");

  if (state.auth === "resolving") {
    avatar.innerHTML = `<span style="font-size:12px">…</span>`;
    avatar.classList.remove("logged");
    btn.disabled = true;
  } else if (state.auth === "logged_in") {
    avatar.innerHTML = state.user.avatar
      ? `<img src="${state.user.avatar}" alt="">`
      : `<span style="font-weight:700;font-size:12px">R</span>`;
    avatar.classList.add("logged");
    btn.disabled = false;
  } else {
    avatar.innerHTML = `<svg class="icon icon--avatar" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
    avatar.classList.remove("logged");
    btn.disabled = false;
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    if (I18N[state.locale][k]) el.textContent = I18N[state.locale][k];
  });

  document.querySelectorAll("#lang-dropdown [data-locale]").forEach((b) => {
    b.classList.toggle("active", b.dataset.locale === state.locale);
  });

  const path = state.route?.path || "/";
  let catId = null;
  if (path.startsWith("/category/")) {
    const parts = path.split("/").filter(Boolean);
    catId = parts[1] || null;
  }
  document.querySelectorAll(".sub-nav__link").forEach((a) => {
    a.classList.toggle("active", a.dataset.cat === catId);
  });
}

function renderSubNav() {
  document.getElementById("sub-nav").innerHTML = CATEGORIES.map(
    (c) => `<a href="#/category/${c.id}" class="sub-nav__link" data-nav data-cat="${c.id}">${c.name}</a>`
  ).join("");
}

function openCategoryMega() {
  if (!state.megaL2) {
    const first = CATEGORY_TREE[state.megaL1];
    state.megaL2 = first ? Object.keys(first.children)[0] : null;
  }
  renderCategoryMega();
  document.getElementById("category-mega").classList.remove("hidden");
  document.getElementById("categories-btn").setAttribute("aria-expanded", "true");
}

function closeCategoryMega() {
  document.getElementById("category-mega").classList.add("hidden");
  document.getElementById("categories-btn").setAttribute("aria-expanded", "false");
}

function renderCategoryMega() {
  const l1El = document.getElementById("cat-l1");
  const l2El = document.getElementById("cat-l2");
  const recEl = document.getElementById("cat-rec");
  if (!l1El) return;

  l1El.innerHTML = CATEGORIES.map(
    (c) =>
      `<li><button type="button" class="${c.id === state.megaL1 ? "active" : ""}" data-l1="${c.id}">${c.name}</button></li>`
  ).join("");

  const l2Map = CATEGORY_TREE[state.megaL1]?.children || {};
  const l2Keys = Object.keys(l2Map);
  if (!state.megaL2 || !l2Map[state.megaL2]) state.megaL2 = l2Keys[0] || null;

  l2El.innerHTML =
    `<li><a href="#/category/${state.megaL1}" class="category-mega__view-all" data-nav>${t("viewAll")}</a></li>` +
    l2Keys
      .map(
        (k) =>
          `<li><a href="#/category/${state.megaL1}/${k}" class="${k === state.megaL2 ? "active" : ""}" data-nav data-l2="${k}">${l2Map[k].name}</a></li>`
      )
      .join("");

  const recProducts = PRODUCTS.slice(0, MEGA_REC_SLOTS);
  recEl.innerHTML = recProducts
    .map(
      (p) =>
        `<div class="category-mega__rec-item" data-product="${p.id}">
          <div class="category-mega__rec-thumb"></div>
          <div class="category-mega__rec-title">${p.title}</div>
          <div class="category-mega__rec-price">${formatBDT(p.price)}</div>
        </div>`
    )
    .join("");

  l1El.querySelectorAll("[data-l1]").forEach((btn) => {
    btn.onmouseenter = () => {
      state.megaL1 = btn.dataset.l1;
      state.megaL2 = Object.keys(CATEGORY_TREE[state.megaL1]?.children || {})[0] || null;
      renderCategoryMega();
    };
  });
  l2El.querySelectorAll("[data-l2]").forEach((el) => {
    el.onmouseenter = () => {
      state.megaL2 = el.dataset.l2;
      renderCategoryMega();
    };
  });
  l2El.querySelectorAll("[data-nav]").forEach((a) => {
    a.onclick = (e) => {
      e.preventDefault();
      closeCategoryMega();
      navigate(resolveNavHref(a.getAttribute("href")));
    };
  });
  recEl.querySelectorAll("[data-product]").forEach((el) => {
    el.onclick = () => {
      closeCategoryMega();
      navigate("/product/" + el.dataset.product);
    };
  });
}

function renderSearchDropdown() {
  const recentEl = document.getElementById("search-recent");
  const recentSection = document.getElementById("search-recent-section");
  if (state.recentSearches.length) {
    recentSection.classList.remove("hidden");
    recentEl.innerHTML = state.recentSearches
      .map((k) => `<button type="button" class="search-tag" data-search="${k}">${k}</button>`)
      .join("");
  } else {
    recentSection.classList.add("hidden");
  }
  document.getElementById("search-discovery").innerHTML = SEARCH_DISCOVERY.map(
    (k) => `<button type="button" class="search-tag" data-search="${k}">${k}</button>`
  ).join("");
}

function performSearch(keyword) {
  const q = keyword.trim();
  if (!q) return;
  state.recentSearches = [q, ...state.recentSearches.filter((r) => r !== q)].slice(0, 8);
  closeSearchDropdown();
  navigate("/search?q=" + encodeURIComponent(q));
}

function openSearchDropdown() {
  renderSearchDropdown();
  document.getElementById("search-dropdown").classList.remove("hidden");
  document.getElementById("search-entry").setAttribute("aria-expanded", "true");
}

function closeSearchDropdown() {
  document.getElementById("search-dropdown").classList.add("hidden");
  document.getElementById("search-entry").setAttribute("aria-expanded", "false");
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

function renderHome() {
  const rows = state.feedRows;
  const items = PRODUCTS.slice(0, rows * 4);
  document.getElementById("app").innerHTML = `
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
  });
  bindProductCards();
  bindServiceCards();
}

function renderSearch() {
  const q = state.route.params.get("q") || "dress";
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <nav class="breadcrumb"><a href="#/" data-nav>Home</a> › Search</nav>
    <h1 class="page-title">Search: "${q}"</h1>
    <div class="search-toolbar">
      <select><option>Best Match</option><option>Price: Low to High</option><option>Newest</option></select>
      <select><option>Filter</option></select>
      <span class="result-count">128 results</span>
    </div>
    <div class="product-grid">${PRODUCTS.map(productCard).join("")}</div>`;
  bindProductCards();
}

function renderCategoryL1(l1Id) {
  const cat = getL1(l1Id);
  const selectedL2 = state.route.params.get("l2") || "";
  const selectedL3 = state.route.params.get("l3") || "";
  const filtered = filterProductsForL1(PRODUCTS, l1Id, selectedL2, selectedL3);
  const filterHTML = categoryFilterL1HTML(l1Id, selectedL2, selectedL3);

  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <nav class="breadcrumb"><a href="#/" data-nav>Home</a> › ${cat.name}</nav>
    <h1 class="page-title">${cat.name}</h1>
    <div class="category-layout${filterHTML ? "" : " category-layout--no-filter"}">
      ${filterHTML}
      <div class="category-main">
        <div class="search-toolbar">
          <select><option>Best Match</option><option>Price</option><option>Newest</option></select>
          <span class="result-count">${filtered.length} results</span>
        </div>
        <div class="product-grid">${filtered.map(productCard).join("")}</div>
      </div>
    </div>`;
  bindCategoryFilterL1(l1Id);
  bindProductCards();
}

function renderCategoryL2(l1Id, l2Id) {
  const l1 = getL1(l1Id);
  const l2 = getL2(l1Id, l2Id) || { id: l2Id, name: l2Id, l3: [] };
  const l3List = l2.l3 || [];
  const selectedL3 = state.route.params.get("l3") || "";
  const filtered = filterProductsByL3(PRODUCTS, selectedL3, l3List);
  const filterHTML = categoryFilterL2HTML(l1Id, l2Id, selectedL3);

  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <nav class="breadcrumb">
      <a href="#/" data-nav>Home</a> ›
      <a href="#/category/${l1.id}" data-nav>${l1.name}</a> ›
      ${l2.name}
    </nav>
    <h1 class="page-title">${l2.name}</h1>
    <div class="category-layout${filterHTML ? "" : " category-layout--no-filter"}">
      ${filterHTML}
      <div class="category-main">
        <div class="search-toolbar">
          <select><option>Best Match</option><option>Price: Low to High</option><option>Newest</option></select>
          <span class="result-count">${filtered.length} results</span>
        </div>
        <div class="product-grid">${filtered.map(productCard).join("")}</div>
      </div>
    </div>`;

  bindCategoryFilterL2(l1Id, l2Id);
  bindProductCards();
}

function storeEntryHTML(storeName) {
  const s = STORES[storeName] || {
    id: "s0",
    abbr: storeName.slice(0, 2).toUpperCase(),
    color: "#718096",
    rating: 4.5,
    followers: "—",
  };
  return `
    <a href="#/store/${s.id}" class="store-entry" data-nav>
      <span class="store-entry__logo" style="background:linear-gradient(135deg,${s.color},${s.color}cc)">${s.abbr}</span>
      <span class="store-entry__info">
        <span class="store-entry__label">Sold by</span>
        <span class="store-entry__name">${storeName}</span>
        <span class="store-entry__meta">★ ${s.rating} · ${s.followers} followers</span>
      </span>
      <span class="store-entry__chevron">›</span>
    </a>`;
}

function getPdpSelections() {
  const colorBtn = document.querySelector('.pdp-info [data-sku="color"] .sku-opt.active:not(.disabled)');
  const sizeBtn = document.querySelector('.pdp-info [data-sku="size"] .sku-opt.active:not(.disabled)');
  const qty = parseInt(document.getElementById("pdp-qty")?.textContent || "1", 10);
  return {
    color: colorBtn?.textContent?.trim() || "",
    size: sizeBtn?.textContent?.trim() || "",
    qty: Math.max(1, qty),
  };
}

function renderPDP(id) {
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;
  document.getElementById("sticky-fab").classList.add("hidden");
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
        ${storeEntryHTML(p.store)}
        <div class="form-block" style="margin-top:16px"><h3>Additional Information</h3><p style="font-size:13px;color:#555">Material: Cotton blend · Origin: Imported</p></div>
        <div class="form-block"><h3>Description</h3><p style="font-size:13px;color:#555">Comfortable everyday wear with modern fit.</p></div>
      </div>
      <div class="pdp-info">
        <h1>${p.title}</h1>
        <div class="price-row">
          <span class="sale">${formatBDT(p.price)}</span>
          ${p.orig ? `<span class="orig">${formatBDT(p.orig)}</span>` : ""}
          ${disc ? `<span class="discount-pill">-${disc}%</span>` : ""}
        </div>
        ${p.tag === "Brand Zone" ? `<div class="authentic">100% Authentic Guarantee</div>` : p.tag ? `<div class="authentic">${p.tag}</div>` : ""}
        <div class="sku-group" data-sku="color"><label>Color</label><div class="sku-options"><button type="button" class="sku-opt active">Red</button><button type="button" class="sku-opt">Blue</button><button type="button" class="sku-opt disabled">Green</button></div></div>
        <div class="sku-group" data-sku="size"><label>Size</label><div class="sku-options"><button type="button" class="sku-opt">S</button><button type="button" class="sku-opt active">M</button><button type="button" class="sku-opt">L</button></div></div>
        <div class="sku-group"><label>Quantity</label><div class="qty-stepper"><button type="button" id="pdp-qty-minus">−</button><span id="pdp-qty">1</span><button type="button" id="pdp-qty-plus">+</button></div></div>
        <p class="pdp-meta">Delivery: Local · 3–5 business days · Shipping from ৳60</p>
        <div class="pdp-actions">
          <button type="button" class="btn btn--primary" id="pdp-add">${t("addToCart")}</button>
          <button type="button" class="btn btn--accent" id="pdp-buy">${t("buyNow")}</button>
        </div>
      </div>
    </div>
    <h2 style="margin-top:40px;font-size:18px">You May Also Like</h2>
    <div class="product-grid" style="margin-top:12px">${PRODUCTS.slice(0, 4).map(productCard).join("")}</div>`;

  document.getElementById("pdp-add").addEventListener("click", () => {
    const sel = getPdpSelections();
    if (!sel.color || !sel.size) {
      showToast("Please select all options");
      return;
    }
    addToCart(p, sel.color, sel.size, sel.qty, { animate: true });
  });

  document.getElementById("pdp-buy").addEventListener("click", () => {
    const sel = getPdpSelections();
    if (!sel.color || !sel.size) {
      showToast("Please select all options");
      return;
    }
    addToCart(p, sel.color, sel.size, sel.qty);
    if (state.auth !== "logged_in") {
      showToast("Sign in required — redirect to /login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  });

  document.getElementById("pdp-qty-minus")?.addEventListener("click", () => {
    const el = document.getElementById("pdp-qty");
    el.textContent = Math.max(1, parseInt(el.textContent, 10) - 1);
  });
  document.getElementById("pdp-qty-plus")?.addEventListener("click", () => {
    const el = document.getElementById("pdp-qty");
    el.textContent = Math.min(5, parseInt(el.textContent, 10) + 1);
  });

  bindProductCards();
  bindSkuOptions();
}

function addToCart(product, color, size, qty, { animate = false } = {}) {
  const key = `${product.id}-${color}-${size}`;
  const existing = state.cart.find((l) => l.key === key && l.valid);
  if (existing) existing.qty += qty;
  else
    state.cart.push({
      key,
      id: product.id,
      title: product.title,
      price: product.price,
      orig: product.orig || product.price,
      tag: product.tag || "",
      color,
      size,
      qty,
      selected: true,
      valid: true,
    });
  renderHeader();
  if (animate) {
    showCartBubble();
    animateCartBadge();
  }
}

function deleteCartLine(index) {
  state.cart.splice(index, 1);
  render();
}

function deleteSelectedCartLines() {
  state.cart = state.cart.filter((l) => !l.selected || !l.valid);
  state.cartEditMode = false;
  render();
}

function renderCart() {
  document.getElementById("sticky-fab").classList.add("hidden");
  const validLines = state.cart.filter((l) => l.valid);
  if (!validLines.length) {
    document.getElementById("app").innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items</p>
        <a href="#/" class="btn btn--primary" data-nav>Continue Shopping</a>
      </div>`;
    return;
  }

  const summary = computeOrderSummary();
  const allSelected = validLines.every((l) => l.selected);

  document.getElementById("app").innerHTML = `
    <h1 class="page-title">Shopping Cart</h1>
    <div class="cart-layout">
      <div>
        <div class="cart-toolbar">
          <label><input type="checkbox" id="select-all" ${allSelected ? "checked" : ""}> Select All</label>
          <button type="button" class="btn" id="edit-mode">${state.cartEditMode ? "Done" : "Edit"}</button>
          ${state.cartEditMode ? `<button type="button" class="btn btn--danger" id="delete-selected">Delete Selected</button>` : ""}
        </div>
        ${state.cart
          .map((l, i) => {
            if (!l.valid) return "";
            return `
          <div class="cart-line" data-line-index="${i}">
            <input type="checkbox" ${l.selected ? "checked" : ""} data-line="${i}" class="line-check">
            <div class="cart-line__thumb"></div>
            <div>
              ${l.tag ? `<span class="cart-line__tag">${l.tag}</span>` : ""}
              <strong>${l.title}</strong>
              <p style="font-size:12px;color:#888;margin:4px 0">${l.color} / ${l.size}</p>
              <p style="font-weight:700;color:var(--brand)">${formatBDT(l.price)}</p>
            </div>
            <div class="qty-stepper"><button type="button" data-line-qty="${i}" data-d="-1">−</button><span>${l.qty}</span><button type="button" data-line-qty="${i}" data-d="1">+</button></div>
            <button type="button" class="cart-line__delete" data-delete-line="${i}" title="Remove">Remove</button>
          </div>`;
          })
          .join("")}
        <div class="cart-line invalid" style="margin-top:16px">
          <input type="checkbox" disabled>
          <div class="cart-line__thumb"></div>
          <div><strong>Sold Out Item (demo)</strong><p style="font-size:12px;color:#888">Unavailable</p></div>
          <button type="button" class="cart-line__delete" disabled>Remove</button>
        </div>
      </div>
      <div class="summary-card">
        <h3 style="margin:0 0 12px">Order Summary</h3>
        ${orderSummaryHTML(summary, { totalLabel: "Payable" })}
        <button type="button" class="btn btn--accent btn--block" style="margin-top:16px" id="go-checkout">${t("checkout")}</button>
      </div>
    </div>`;

  document.getElementById("select-all").onchange = (e) => {
    const checked = e.target.checked;
    state.cart.forEach((l) => {
      if (l.valid) l.selected = checked;
    });
    render();
  };

  document.querySelectorAll(".line-check").forEach((cb) => {
    cb.onchange = () => {
      state.cart[+cb.dataset.line].selected = cb.checked;
      render();
    };
  });

  document.getElementById("edit-mode").onclick = () => {
    state.cartEditMode = !state.cartEditMode;
    render();
  };

  document.getElementById("delete-selected")?.addEventListener("click", () => {
    const n = getSelectedCartLines().length;
    if (!n) {
      showToast("No items selected");
      return;
    }
    if (confirm(`Delete ${n} selected item(s)?`)) deleteSelectedCartLines();
  });

  document.querySelectorAll("[data-delete-line]").forEach((btn) => {
    btn.onclick = () => deleteCartLine(+btn.dataset.deleteLine);
  });

  document.querySelectorAll("[data-line-qty]").forEach((btn) => {
    btn.onclick = () => {
      const i = +btn.dataset.lineQty;
      const d = +btn.dataset.d;
      state.cart[i].qty = Math.max(1, state.cart[i].qty + d);
      render();
    };
  });

  document.getElementById("go-checkout").onclick = () => {
    if (!getSelectedCartLines().length) {
      showToast("Please select at least one item");
      return;
    }
    if (state.auth !== "logged_in") {
      showToast("Sign in required — redirect to /login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };
}

function renderCheckout() {
  if (state.auth !== "logged_in") {
    document.getElementById("app").innerHTML = `
      <div class="empty-state">
        <h2>Login Required (BR619)</h2>
        <p>Checkout requires sign in.</p>
        <button type="button" class="btn btn--primary" id="demo-login">Demo: Sign In</button>
      </div>`;
    document.getElementById("demo-login").onclick = () => {
      state.auth = "logged_in";
      renderHeader();
      render();
    };
    return;
  }

  const summary = computeOrderSummary();
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
        <div class="form-block"><h3>Order Items</h3><p style="font-size:13px"><strong>Fashion Hub</strong> — Cotton Blend Dress × 1</p></div>
        <div class="form-block"><h3>Payment</h3><div class="payment-option"><input type="radio" checked> Cash on Delivery (COD)</div></div>
      </div>
      <div class="summary-card">
        <h3 style="margin:0 0 12px">Coupon & Code</h3>
        <div class="coupon-row"><input placeholder="Enter coupon code"><button type="button" class="btn">Apply</button></div>
        <button type="button" class="btn btn--block" id="open-coupons" style="margin-bottom:16px">Select from My Coupons</button>
        ${orderSummaryHTML(summary)}
        <button type="button" class="btn btn--accent btn--block" style="margin-top:16px" id="place-order">Place Order</button>
      </div>
    </div>`;

  document.getElementById("change-addr").onclick = () =>
    openModal(`<div class="modal__head"><h2>Saved Addresses</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
      <p style="padding:12px;border:1px solid #111;border-radius:4px">Gulshan, Dhaka (Default)</p>
      <button type="button" class="btn btn--block" data-close-modal style="margin-top:12px">Close</button>`);

  document.getElementById("open-coupons").onclick = () =>
    openModal(`<div class="modal__head"><h2>My Coupons</h2><button type="button" class="modal__close" data-close-modal>×</button></div>
      <label style="display:block;padding:12px;border:2px solid #111;border-radius:4px;margin-bottom:8px"><input type="radio" checked> SAVE50 — ৳50 off</label>
      <button type="button" class="btn btn--primary btn--block" data-close-modal>Confirm</button>`);

  document.getElementById("place-order").onclick = () => {
    document.getElementById("lang-overlay").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("lang-overlay").classList.add("hidden");
      navigate("/checkout/result");
    }, 1200);
  };
}

function renderCheckoutResult() {
  const summary = computeOrderSummary();
  document.getElementById("app").innerHTML = `
    <div class="empty-state" style="padding:64px 16px">
      <h2>Order Placed Successfully</h2>
      <p>Order #KB20260911001 · COD ${formatBDT(summary.payable || 1299)}</p>
      <button type="button" class="btn btn--primary" style="margin-top:16px">View Order List</button>
      <a href="#/" class="btn" style="margin-top:8px;display:inline-flex" data-nav>Continue Shopping</a>
    </div>`;
}

function renderStore() {
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <div class="store-header">
      <div class="store-logo" id="store-info"></div>
      <div><h1 style="margin:0;font-size:20px">Fashion Hub</h1><p style="color:#888">★ 4.8</p></div>
    </div>
    <div class="tabs"><button type="button" class="tab active">Home</button><button type="button" class="tab">Items</button></div>
    <div class="product-grid">${PRODUCTS.map(productCard).join("")}</div>`;
  bindProductCards();
}

function renderTopic(id) {
  const titles = { brand: "Brand Zone", global: "Global", featured: "Featured", trending: "Trending" };
  document.getElementById("sticky-fab").classList.add("hidden");
  document.getElementById("app").innerHTML = `
    <nav class="breadcrumb"><a href="#/" data-nav>Home</a> › ${titles[id] || id}</nav>
    <h1 class="page-title">${titles[id] || id}</h1>
    <div class="product-grid">${PRODUCTS.map(productCard).join("")}</div>`;
  bindProductCards();
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
        <p>${btn.querySelector("span")?.textContent || ""}</p>
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
  renderSubNav();

  if (path === "/" || path === "") renderHome();
  else if (path.startsWith("/search")) renderSearch();
  else if (path.startsWith("/category/")) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length >= 3) renderCategoryL2(parts[1], parts[2]);
    else renderCategoryL1(parts[1] || "women");
  }
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
      navigate(resolveNavHref(a.getAttribute("href")));
    };
  });
}

function initEvents() {
  window.addEventListener("hashchange", render);

  renderSubNav();
  renderSearchDropdown();

  document.getElementById("search-entry").onclick = (e) => {
    e.stopPropagation();
    const open = !document.getElementById("search-dropdown").classList.contains("hidden");
    if (open) closeSearchDropdown();
    else {
      closeDropdowns(["search-dropdown"]);
      openSearchDropdown();
    }
  };

  document.getElementById("search-dropdown").addEventListener("click", (e) => {
    const tag = e.target.closest("[data-search]");
    if (tag) performSearch(tag.dataset.search);
  });

  document.getElementById("lang-btn").onclick = (e) => {
    e.stopPropagation();
    closeDropdowns(["lang-dropdown"]);
    document.getElementById("lang-dropdown").classList.toggle("hidden");
  };

  document.querySelectorAll("#lang-dropdown [data-locale]").forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.locale === state.locale) return;
      document.getElementById("lang-overlay").classList.remove("hidden");
      setTimeout(() => {
        state.locale = btn.dataset.locale;
        document.getElementById("lang-overlay").classList.add("hidden");
        render();
        showToast("Language updated");
      }, 900);
    };
  });

  const subNav = document.querySelector(".site-header__sub");
  subNav?.addEventListener("mouseleave", closeCategoryMega);
  document.getElementById("categories-wrap")?.addEventListener("mouseenter", openCategoryMega);
  document.getElementById("category-mega")?.addEventListener("mouseenter", openCategoryMega);

  document.getElementById("account-btn").onmouseenter = () => {
    if (state.auth === "resolving") return;
    renderAccountDropdown();
    closeDropdowns(["account-dropdown"]);
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
      renderHeader();
      showToast("Signed out");
    } else if (["orders", "coupons", "account"].includes(action)) {
      if (state.auth !== "logged_in") showToast("Sign in required");
      else showToast("Redirect → /account/" + action);
    }
  };

  document.getElementById("cart-btn").onclick = () => navigate("/cart");

  ["support-btn", "footer-support", "sticky-fab"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => showToast("Redirect → supportEntryUrl"));
  });

  ["app-download-trigger", "footer-app-download"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", (e) => {
      e.preventDefault();
      openAppDownloadModal();
    });
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
    if (e.target.matches("[data-close-modal]") || e.target.classList.contains("modal__backdrop")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDropdowns();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#search-wrap")) closeSearchDropdown();
    if (!e.target.closest("#lang-switch")) document.getElementById("lang-dropdown").classList.add("hidden");
    if (!e.target.closest("#account-wrap")) document.getElementById("account-dropdown").classList.add("hidden");
  });

  window.addEventListener(
    "scroll",
    () => {
      document.getElementById("trust-bar").classList.toggle("collapsed", window.scrollY > 80);
    },
    { passive: true }
  );

  document.getElementById("account-wrap").addEventListener("dblclick", () => {
    state.auth = state.auth === "logged_in" ? "guest" : "logged_in";
    renderHeader();
    showToast(state.auth === "logged_in" ? "Logged in (demo)" : "Logged out");
  });
}

function closeDropdowns(except = []) {
  if (!except.includes("search-dropdown")) closeSearchDropdown();
  if (!except.includes("lang-dropdown")) document.getElementById("lang-dropdown")?.classList.add("hidden");
  if (!except.includes("account-dropdown")) document.getElementById("account-dropdown")?.classList.add("hidden");
}

initEvents();
render();
