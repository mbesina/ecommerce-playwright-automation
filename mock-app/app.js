const products = [
  { id: 'penguin-key-chain', name: 'Penguin key chain', price: 12 },
  { id: 'penguin-eco-bag', name: 'Penguin eco bag', price: 18 },
  { id: 'penguin-medium-plush-toy', name: 'Penguin medium plush toy', price: 34 },
  { id: 'penguin-travel-neck-pillow', name: 'Penguin Travel Neck Pillow', price: 42 }
];

function getSession() {
  return JSON.parse(localStorage.getItem('session') || 'null');
}

function setSession(user) {
  localStorage.setItem('session', JSON.stringify(user));
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function slug(name) {
  return name.toLowerCase().replaceAll(' ', '-');
}

function renderHeader() {
  const user = getSession();
  const header = document.querySelector('[data-header]');
  if (!header) return;
  header.innerHTML = `
    <a href="/products.html">Penguin Picks</a>
    <form data-search-form>
      <input aria-label="Search penguin products" placeholder="Search penguin products" name="q" />
    </form>
    <a href="/cart.html">Waddle cart (${getCart().length})</a>
    <span data-testid="account-label">${user ? user.firstName : 'Guest'}</span>
  `;
  header.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('q');
    window.location.href = `/products.html?q=${encodeURIComponent(value)}`;
  });
}

async function login() {
  const form = document.querySelector('[data-login-form]');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      document.querySelector('[role="alert"]').textContent = 'Invalid email or password';
      return;
    }
    setSession(await response.json());
    window.location.href = '/products.html';
  });
}

function renderProducts() {
  const list = document.querySelector('[data-product-list]');
  if (!list) return;
  const term = new URLSearchParams(window.location.search).get('q')?.toLowerCase() || '';
  const filtered = products.filter((product) => product.name.toLowerCase().includes(term));
  list.innerHTML = filtered
    .map(
      (product) => `
      <article data-testid-product-card id="${product.id}" data-product-id="${product.id}">
        <h2>${product.name}</h2>
        <p>$${product.price}</p>
        <button data-add="${product.id}">Add to waddle cart</button>
      </article>`
    )
    .join('');
  for (const product of filtered) {
    const card = list.querySelector(`[data-product-id="${product.id}"]`);
    card.setAttribute('data-testid', `product-${slug(product.name)}`);
    card.querySelector('button').addEventListener('click', () => {
      setCart([...getCart(), product]);
      renderHeader();
    });
  }
  document.querySelector('[data-empty]').hidden = filtered.length > 0;
}

function renderCart() {
  const cart = getCart();
  const list = document.querySelector('[data-cart-list]');
  if (!list) return;
  list.innerHTML = cart
    .map((item) => `<li data-testid="cart-item">${item.name} - $${item.price}</li>`)
    .join('');
  document.querySelector('[data-empty-cart]').hidden = cart.length > 0;
  document.querySelector('[data-checkout-link]').hidden = cart.length === 0;
}

async function checkout() {
  const form = document.querySelector('[data-checkout-form]');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const shipping = Object.fromEntries(new FormData(form));
    if (Object.values(shipping).some((value) => !String(value).trim())) {
      document.querySelector('[role="alert"]').textContent = 'Complete all shipping fields';
      return;
    }
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: getCart(), shipping })
    });
    setCart([]);
    document.querySelector('[data-testid="order-confirmation"]').textContent = 'Order confirmed';
  });
}

renderHeader();
login();
renderProducts();
renderCart();
checkout();
