const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const LOGO   = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Your_Privacy._Our_Priority._1200_x_400_px.png?v=1786611605";
const BANNER = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/banner2.png?v=1782295395";
const SHOP   = "p91iux-zw.myshopify.com";
const WELLNESS_API    = "https://fusionprime.in/apps/fusion/wellness-products?shop=" + SHOP;
const FUSION_CHECKOUT = "https://fusionprime.in/apps/fusion/checkout";

const TESTIMONIALS = [
  { name: "R.K.", text: "Packaging bilkul plain thi, ghar walo ko kuch pata nahi chala. Product bhi genuine tha.", rating: 5 },
  { name: "A.S.", text: "Fast delivery aur COD ka option — full trust ban gaya. Highly recommend.", rating: 5 },
  { name: "V.M.", text: "Quality solid hai, price bhi reasonable. Doosri baar order kar chuka hoon.", rating: 5 },
  { name: "P.J.", text: "Discreet delivery ka wada nibhaya. Box pe kuch likha hi nahi tha.", rating: 5 },
];

async function fetchWellnessProducts() {
  try {
    const res = await fetch(WELLNESS_API, { headers: { "Accept": "application/json" } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (e) {
    console.error("Wellness fetch failed:", e);
    return [];
  }
}

function productCardHTML(p, idx) {
  const hasDiscount = p.discountPct > 0;
  return `
    <div class="p-card" style="animation-delay:${idx * 0.06}s" onclick="goCheckout('${p.variantId}',${p.price},'${(p.title||'').replace(/'/g,"\\'")}','${(p.variantTitle||'').replace(/'/g,"\\'")}','${p.image||''}')">
      <div class="p-img-wrap">
        <img class="p-img" src="${p.image || ''}" alt="${(p.title||'').replace(/"/g,'&quot;')}" loading="lazy" onerror="this.style.display='none'"/>
        ${hasDiscount ? `<span class="p-badge">${p.discountPct}% OFF</span>` : ''}
        <div class="p-img-shine"></div>
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

function testimonialHTML(t) {
  return `
    <div class="t-card">
      <div class="t-stars">${'★'.repeat(t.rating)}</div>
      <p class="t-text">"${t.text}"</p>
      <div class="t-name">— ${t.name}</div>
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
body{background:#08080a;color:#f0ece4;font-family:'Segoe UI',sans-serif;line-height:1.6;overflow-x:hidden;position:relative}

@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 20px rgba(255,0,51,0.15)}50%{box-shadow:0 0 40px rgba(255,0,51,0.35)}}
@keyframes floatBlob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.08)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shine{0%{transform:translateX(-100%) rotate(20deg)}100%{transform:translateX(200%) rotate(20deg)}}

.bg-blob{position:fixed;border-radius:50%;filter:blur(90px);z-index:0;pointer-events:none;opacity:0.35}
.blob1{width:420px;height:420px;background:#ff0033;top:-120px;left:-100px;animation:floatBlob 12s ease-in-out infinite}
.blob2{width:360px;height:360px;background:#7a0016;bottom:10%;right:-120px;animation:floatBlob 15s ease-in-out infinite reverse}

.nav{background:rgba(6,6,8,0.85);backdrop-filter:blur(14px);padding:16px 24px;border-bottom:1px solid rgba(255,0,51,0.2);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
.nav-logo{height:36px;object-fit:contain}
.nav-badge{font-size:11px;color:#4ade80;font-weight:700;letter-spacing:0.5px;display:flex;align-items:center;gap:6px;background:rgba(74,222,128,0.08);padding:6px 12px;border-radius:20px;border:1px solid rgba(74,222,128,0.2)}

.hero{position:relative;min-height:420px;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:fadeInUp 0.8s ease;z-index:1}
.hero-bg{position:absolute;inset:0;object-fit:cover;width:100%;height:100%;opacity:0.35}
.hero-overlay{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(20,4,8,0.4),rgba(8,8,10,0.97))}
.hero-content{position:relative;z-index:2;max-width:720px;padding:0 20px;text-align:center}
.hero-eyebrow{font-size:12px;font-weight:800;color:#ff3355;letter-spacing:4px;text-transform:uppercase;margin-bottom:18px;text-shadow:0 0 20px rgba(255,0,51,0.5)}
.hero-title{font-size:48px;font-weight:900;margin-bottom:18px;line-height:1.15;letter-spacing:-1px}
.hero-title span{background:linear-gradient(135deg,#ff0033,#ff8fa3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:15px;color:rgba(240,236,228,0.6);margin-bottom:30px;max-width:540px;margin-left:auto;margin-right:auto}
.trust-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px}
.trust-pill{background:rgba(255,255,255,0.05);border:1px solid rgba(255,0,51,0.3);padding:9px 18px;border-radius:30px;font-size:12px;font-weight:600;color:rgba(240,236,228,0.9);display:flex;align-items:center;gap:6px;transition:all 0.3s}
.trust-pill:hover{background:rgba(255,0,51,0.1);border-color:rgba(255,0,51,0.6);transform:translateY(-2px)}

.container{max-width:1140px;margin:0 auto;padding:60px 20px;position:relative;z-index:1}
.section-header{text-align:center;margin-bottom:40px;animation:fadeInUp 0.8s ease}
.section-header .tag{font-size:11px;font-weight:800;color:#ff3355;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
.section-header h2{font-size:28px;font-weight:900;margin-bottom:8px}
.section-header p{font-size:13px;color:rgba(240,236,228,0.5)}

.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:22px}
.p-card{background:linear-gradient(160deg,#141416,#0e0e10);border:1px solid rgba(255,0,51,0.15);border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.35s cubic-bezier(.2,.8,.2,1);position:relative;opacity:0;animation:cardIn 0.6s ease forwards}
.p-card:hover{transform:translateY(-8px);border-color:rgba(255,0,51,0.55);animation:cardIn 0.6s ease forwards,pulseGlow 1.6s ease infinite}
.p-img-wrap{position:relative;aspect-ratio:1/1;background:#1a1a1c;overflow:hidden}
.p-img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease}
.p-card:hover .p-img{transform:scale(1.08)}
.p-img-shine{position:absolute;top:0;left:0;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);opacity:0;pointer-events:none}
.p-card:hover .p-img-shine{opacity:1;animation:shine 1s ease}
.p-badge{position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#ff0033,#a3001f);color:#fff;font-size:11px;font-weight:800;padding:5px 11px;border-radius:20px;box-shadow:0 4px 14px rgba(255,0,51,0.5)}
.p-info{padding:16px}
.p-title{font-size:14.5px;font-weight:700;color:#fff;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.p-variant{font-size:11px;color:rgba(240,236,228,0.4);margin-bottom:10px}
.p-price-row{display:flex;align-items:baseline;gap:9px;margin-bottom:14px}
.p-price{font-size:20px;font-weight:900;background:linear-gradient(135deg,#fff,#ffd9de);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.p-old-price{font-size:12px;color:rgba(240,236,228,0.3);text-decoration:line-through}
.p-buy-btn{width:100%;padding:11px;background:linear-gradient(135deg,#ff0033,#a3001f);color:#fff;border:none;font-size:12px;font-weight:800;border-radius:8px;cursor:pointer;text-transform:uppercase;letter-spacing:0.6px;transition:all 0.25s}
.p-buy-btn:hover{transform:scale(1.03);box-shadow:0 6px 20px rgba(255,0,51,0.45)}

.empty-state{grid-column:1/-1;text-align:center;padding:70px 20px;color:rgba(240,236,228,0.4);font-size:14px;border:1px dashed rgba(255,0,51,0.2);border-radius:14px}

.features-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:24px}
.feature-card{background:rgba(255,0,51,0.04);border:1px solid rgba(255,0,51,0.15);border-radius:14px;padding:26px 20px;text-align:center;transition:all 0.3s}
.feature-card:hover{background:rgba(255,0,51,0.08);border-color:rgba(255,0,51,0.35);transform:translateY(-4px)}
.feature-icon{font-size:30px;margin-bottom:12px}
.feature-card h4{font-size:14.5px;font-weight:700;color:#fff;margin-bottom:6px}
.feature-card p{font-size:12px;color:rgba(240,236,228,0.5);line-height:1.5}

.testimonials{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.t-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:22px}
.t-stars{color:#f59e0b;font-size:14px;margin-bottom:10px}
.t-text{font-size:13px;color:rgba(240,236,228,0.75);line-height:1.6;margin-bottom:12px;font-style:italic}
.t-name{font-size:12px;color:rgba(240,236,228,0.4);font-weight:600}

.footer{text-align:center;padding:34px 20px;font-size:12px;color:rgba(240,236,228,0.25);border-top:1px solid rgba(255,0,51,0.15);margin-top:20px;position:relative;z-index:1}
.footer-links{display:flex;justify-content:center;gap:22px;margin-bottom:16px;flex-wrap:wrap}
.footer-links span{color:rgba(240,236,228,0.4);cursor:default}

.loading-overlay{position:fixed;inset:0;background:rgba(8,8,10,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999}
.loading-spinner{width:50px;height:50px;border-radius:50%;border:4px solid rgba(255,0,51,0.2);border-top-color:#ff0033;animation:spin 0.8s linear infinite}
.loading-overlay p{margin-top:16px;font-size:13px;color:rgba(240,236,228,0.6)}

@media(max-width:768px){
  .hero{min-height:340px}
  .hero-title{font-size:32px}
  .hero-sub{font-size:13px}
  .container{padding:40px 16px}
  .product-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .p-info{padding:11px}
  .p-title{font-size:12.5px}
  .p-price{font-size:16px}
  .p-buy-btn{padding:9px;font-size:11px}
  .section-header h2{font-size:22px}
  .blob1,.blob2{display:none}
}
</style>
</head>
<body>

<div class="bg-blob blob1"></div>
<div class="bg-blob blob2"></div>

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
    <div class="tag">The Collection</div>
    <h2>Explore Our Products</h2>
    <p>Handpicked. Discreet. Delivered to your doorstep.</p>
  </div>
  <div class="product-grid">
    ${productsGrid}
  </div>
</div>

<div class="container" style="padding-top:0">
  <div class="section-header">
    <div class="tag">Why NaughtyShop</div>
    <h2>Built On Trust</h2>
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

<div class="container" style="padding-top:0">
  <div class="section-header">
    <div class="tag">Customer Voices</div>
    <h2>What People Say</h2>
  </div>
  <div class="testimonials">
    ${TESTIMONIALS.map(testimonialHTML).join('')}
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