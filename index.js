const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const LOGO   = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Your_Privacy._Our_Priority._1200_x_400_px.png?v=1786611605";
const BANNER = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/banner2.png?v=1782295395";
const SHOP   = "p91iux-zw.myshopify.com";
const FUSION_CHECKOUT = "https://fusionprime.in/apps/fusion/checkout";

// ─── Fetch products directly from Shopify public storefront JSON, filter by "wellness" tag ──
async function fetchWellnessProducts() {
  try {
    const res = await fetch(`https://${SHOP}/products.json?limit=250`, { headers: { "Accept": "application/json" } });
    if (!res.ok) return [];
    const data = await res.json();

    return (data.products || [])
      .filter(p => (p.tags || []).map(t => String(t).toLowerCase()).includes("wellness"))
      .map(p => {
        const v         = p.variants?.[0] || {};
        const price     = parseFloat(v.price || 0);
        const compareAt = parseFloat(v.compare_at_price || 0);
        const discount  = (compareAt > price && compareAt > 0) ? Math.round((1 - price / compareAt) * 100) : 0;
        return {
          id:             p.id,
          title:          p.title || "",
          image:          p.images?.[0]?.src || "",
          variantId:      String(v.id || ""),
          variantTitle:   v.title && v.title !== "Default Title" ? v.title : "",
          price,
          compareAtPrice: compareAt,
          discountPct:    discount,
        };
      })
      .filter(p => p.variantId && p.price > 0);
  } catch (e) {
    console.error("Wellness fetch failed:", e);
    return [];
  }
}

function productCardHTML(p) {
  const hasDiscount = p.discountPct > 0;
  return `
    <div class="p-card" onclick="goCheckout('${p.variantId}',${p.price},'${(p.title||'').replace(/'/g,"\\'")}','${(p.variantTitle||'').replace(/'/g,"\\'")}','${p.image||''}')">
      <div class="p-img-wrap">
        <img class="p-img" src="${p.image || ''}" alt="${(p.title||'').replace(/"/g,'&quot;')}" loading="lazy" onerror="this.style.display='none'"/>
        ${hasDiscount ? `<span class="p-badge">${p.discountPct}% OFF</span>` : ''}
      </div>
      <div class="p-info">
        <div class="p-title">${p.title}</div>
        ${p.variantTitle ? `<div class="p-variant">${p.variantTitle}</div>` : ''}
        <div class="p-price-row">
          <span class="p-price">₹${p.price.toLocaleString('en-IN')}</span>
          ${hasDiscount ? `<span class="p-old-price">₹${p.compareAtPrice.toLocaleString('en-IN')}</span>` : ''}
        </div>
        <button class="p-buy-btn">🛒 Buy Now</button>
      </div>
    </div>
  `;
}

function getPageHTML(products) {
  const productsGrid = products.length
    ? products.map(productCardHTML).join('')
    : `<div class="empty-state">🔒 New products dropping soon. Check back shortly.</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>NaughtyShop | Your Privacy. Our Priority.</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:#0a0a0a;color:#f0ece4;font-family:'Segoe UI',sans-serif;line-height:1.6;overflow-x:hidden}
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 20px rgba(255,0,51,0.15)}50%{box-shadow:0 0 35px rgba(255,0,51,0.3)}}
@keyframes spin{to{transform:rotate(360deg)}}

.nav{background:rgba(8,8,8,0.98);backdrop-filter:blur(10px);padding:16px 24px;border-bottom:1px solid rgba(192,0,26,0.3);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
.nav-logo{height:38px;object-fit:contain}
.nav-badge{font-size:11px;color:#4ade80;font-weight:700;letter-spacing:0.5px;display:flex;align-items:center;gap:6px}

.hero{position:relative;min-height:380px;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:fadeInUp 0.8s ease}
.hero-bg{position:absolute;inset:0;object-fit:cover;width:100%;height:100%;opacity:0.5}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,8,8,0.6),rgba(8,8,8,0.95))}
.hero-content{position:relative;z-index:2;max-width:700px;padding:0 20px;text-align:center}
.hero-eyebrow{font-size:12px;font-weight:800;color:#ff0033;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px}
.hero-title{font-size:44px;font-weight:900;margin-bottom:16px;line-height:1.15}
.hero-title span{background:linear-gradient(135deg,#ff0033,#ff6b8a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:15px;color:rgba(240,236,228,0.65);margin-bottom:28px;max-width:520px;margin-left:auto;margin-right:auto}
.trust-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px}
.trust-pill{background:rgba(255,255,255,0.06);border:1px solid rgba(255,0,51,0.25);padding:8px 16px;border-radius:30px;font-size:12px;font-weight:600;color:rgba(240,236,228,0.85);display:flex;align-items:center;gap:6px}

.container{max-width:1100px;margin:0 auto;padding:50px 20px}
.section-header{text-align:center;margin-bottom:36px;animation:fadeInUp 0.8s ease}
.section-header h2{font-size:26px;font-weight:900;margin-bottom:8px}
.section-header p{font-size:13px;color:rgba(240,236,228,0.5)}

.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:20px;animation:fadeInUp 0.8s ease 0.1s both}
.p-card{background:#131313;border:1px solid rgba(255,0,51,0.15);border-radius:14px;overflow:hidden;cursor:pointer;transition:all 0.3s ease;position:relative}
.p-card:hover{transform:translateY(-6px);border-color:rgba(255,0,51,0.5);animation:pulseGlow 1.5s ease infinite}
.p-img-wrap{position:relative;aspect-ratio:1/1;background:#1a1a1a;overflow:hidden}
.p-img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease}
.p-card:hover .p-img{transform:scale(1.06)}
.p-badge{position:absolute;top:10px;right:10px;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px;box-shadow:0 2px 8px rgba(255,0,51,0.4)}
.p-info{padding:14px}
.p-title{font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.p-variant{font-size:11px;color:rgba(240,236,228,0.4);margin-bottom:8px}
.p-price-row{display:flex;align-items:baseline;gap:8px;margin-bottom:12px}
.p-price{font-size:19px;font-weight:900;color:#fff}
.p-old-price{font-size:12px;color:rgba(240,236,228,0.3);text-decoration:line-through}
.p-buy-btn{width:100%;padding:10px;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;font-size:12px;font-weight:800;border-radius:7px;cursor:pointer;text-transform:uppercase;letter-spacing:0.5px;transition:all 0.2s}
.p-buy-btn:hover{transform:scale(1.02);box-shadow:0 4px 15px rgba(255,0,51,0.35)}

.empty-state{grid-column:1/-1;text-align:center;padding:60px 20px;color:rgba(240,236,228,0.4);font-size:14px}

.features-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:60px;animation:fadeInUp 0.8s ease 0.2s both}
.feature-card{background:rgba(255,0,51,0.05);border:1px solid rgba(255,0,51,0.15);border-radius:12px;padding:22px;text-align:center}
.feature-icon{font-size:28px;margin-bottom:10px}
.feature-card h4{font-size:14px;font-weight:700;color:#fff;margin-bottom:6px}
.feature-card p{font-size:12px;color:rgba(240,236,228,0.5);line-height:1.5}

.footer{text-align:center;padding:30px 20px;font-size:12px;color:rgba(240,236,228,0.25);border-top:1px solid rgba(192,0,26,0.2);margin-top:40px}
.footer-links{display:flex;justify-content:center;gap:20px;margin-bottom:14px;flex-wrap:wrap}
.footer-links span{color:rgba(240,236,228,0.4);cursor:default}

.loading-overlay{position:fixed;inset:0;background:rgba(10,10,10,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999}
.loading-spinner{width:48px;height:48px;border-radius:50%;border:4px solid rgba(255,0,51,0.2);border-top-color:#ff0033;animation:spin 0.8s linear infinite}
.loading-overlay p{margin-top:14px;font-size:13px;color:rgba(240,236,228,0.6)}

@media(max-width:768px){
  .hero{min-height:320px}
  .hero-title{font-size:30px}
  .hero-sub{font-size:13px}
  .container{padding:36px 16px}
  .product-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .p-info{padding:10px}
  .p-title{font-size:12.5px}
  .p-price{font-size:16px}
  .p-buy-btn{padding:9px;font-size:11px}
  .section-header h2{font-size:21px}
}
</style>
</head>
<body>

<nav class="nav">
  <img class="nav-logo" src="${LOGO}"/>
  <div class="nav-badge">🔒 100% Discreet</div>
</nav>

<div class="hero">
  <img class="hero-bg" src="${BANNER}"/>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-eyebrow">NaughtyShop Wellness Collection</div>
    <h1 class="hero-title">Your Privacy. <span>Our Priority.</span></h1>
    <p class="hero-sub">Premium wellness products, delivered in plain unmarked packaging. No product name on the box, no questions asked.</p>
    <div class="trust-row">
      <div class="trust-pill">📦 Plain Packaging</div>
      <div class="trust-pill">⚡ 24hr Shipping</div>
      <div class="trust-pill">💵 COD Available</div>
      <div class="trust-pill">↩️ 7-Day Returns</div>
    </div>
  </div>
</div>

<div class="container">
  <div class="section-header">
    <h2>Explore The Collection</h2>
    <p>Handpicked. Discreet. Delivered to your doorstep.</p>
  </div>
  <div class="product-grid">
    ${productsGrid}
  </div>

  <div class="features-row">
    <div class="feature-card">
      <div class="feature-icon">🔒</div>
      <h4>100% Discreet</h4>
      <p>Unmarked packaging, no branding visible from outside</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🚚</div>
      <h4>Fast Delivery</h4>
      <p>Ships within 24 hours, across India</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">💵</div>
      <h4>Cash on Delivery</h4>
      <p>Pay only when your order arrives</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">✅</div>
      <h4>Verified Quality</h4>
      <p>Every product tested & approved</p>
    </div>
  </div>
</div>

<div class="footer">
  <div class="footer-links">
    <span>Privacy Policy</span>
    <span>Terms of Service</span>
    <span>Refund Policy</span>
    <span>Contact Us</span>
  </div>
  © 2025 NaughtyShop • 🔒 100% Private & Secure
</div>

<script>
function goCheckout(variantId, price, title, variantTitle, image) {
  var overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = '<div class="loading-spinner"></div><p>Taking you to checkout...</p>';
  document.body.appendChild(overlay);

  var url = '${FUSION_CHECKOUT}'
    + '?shop=${SHOP}'
    + '&source=naughtyshop'
    + '&buyNow=true'
    + '&variantId=' + encodeURIComponent(variantId)
    + '&price=' + Math.round(price * 100)
    + '&productTitle=' + encodeURIComponent(title)
    + '&variantTitle=' + encodeURIComponent(variantTitle || '')
    + '&image=' + encodeURIComponent(image || '');

  setTimeout(function(){ window.location.href = url; }, 250);
}
</script>
</body>
</html>`;
}

app.get('/', async (req, res) => {
  try {
    const products = await fetchWellnessProducts();
    res.send(getPageHTML(products));
  } catch (e) {
    console.error("Page render error:", e);
    res.send(getPageHTML([]));
  }
});

app.listen(PORT, () => { console.log('NaughtyShop catalog running on ' + PORT); });