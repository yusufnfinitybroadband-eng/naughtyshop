const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const LOGO   = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Your_Privacy._Our_Priority._1200_x_400_px.png?v=1786611605";
const BANNER = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/banner2.png?v=1782295395";
const SHOP   = "p91iux-zw.myshopify.com";
const WELLNESS_API    = "https://fusionprime.in/apps/fusion/wellness-products?shop=" + SHOP;
const FUSION_CHECKOUT = "https://fusionprime.in/apps/fusion/checkout";

// ─── Facebook Pixel (client-side base tracking) ────────────
const FB_PIXEL_ID = "1987208335349377";

// ─── Must match WELLNESS_DISCOUNT_MULT in Fusion Prime's proxy.create-order.jsx ──
// so the price shown here is exactly what gets charged at checkout for Prepaid.
const PREPAID_DISCOUNT_MULT = 0.54; // 46% off

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

// ─── Safely escape a string for use inside a single-quoted JS string
// literal that itself sits inside a double-quoted HTML attribute.
// Fixes titles/variants containing " (e.g. 8" inch sizes) breaking onclick.
function escForOnclick(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\n/g, ' ');
}

function productCardHTML(p, idx) {
  const hasCompareDiscount = p.discountPct > 0;
  const prepaidPrice = Math.round(p.price * PREPAID_DISCOUNT_MULT);
  const safeTitle   = escForOnclick(p.title);
  const safeVariant = escForOnclick(p.variantTitle);
  const safeImage   = escForOnclick(p.image);

  return `
    <div class="p-card" style="animation-delay:${idx * 0.06}s">
      <div class="p-img-wrap" onclick="openQuickView(${idx})">
        <img class="p-img" src="${p.image || ''}" alt="${(p.title||'').replace(/"/g,'&quot;')}" loading="lazy" onerror="this.style.display='none'"/>
        <span class="p-badge">🔥 ONLINE OFFER</span>
        <div class="p-img-shine"></div>
      </div>
      <div class="p-info">
        <div class="p-title" onclick="openQuickView(${idx})" style="cursor:pointer">${(p.title||'').replace(/</g,'&lt;')}</div>
        ${p.variantTitle ? `<div class="p-variant">${String(p.variantTitle).replace(/</g,'&lt;')}</div>` : ''}

        <div class="p-offer-block">
          <div class="p-offer-label">💳 Pay Online & Get</div>
          <div class="p-offer-price">₹${prepaidPrice.toLocaleString('en-IN')}</div>
        </div>

        <div class="p-price-meta">
          ${hasCompareDiscount ? `<span class="p-old-price">₹${p.compareAtPrice.toLocaleString('en-IN')}</span>` : ''}
          <span class="p-cod-price">🚚 COD Price: ₹${p.price.toLocaleString('en-IN')}</span>
        </div>

        <button class="p-buy-btn" onclick="event.stopPropagation();goCheckout('${p.variantId}',${p.price},'${safeTitle}','${safeVariant}','${safeImage}')">🛒 Buy Now</button>
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

  // Safe JSON for embedding in a <script> tag (escape closing tags)
  const productsJSON = JSON.stringify(products).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>NaughtyShop | Your Privacy. Our Priority.</title>

<!-- ─── Facebook Pixel ─────────────────────────────────── -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1"/>
</noscript>
<!-- ────────────────────────────────────────────────────── -->

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
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}

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
.p-card{background:linear-gradient(160deg,#141416,#0e0e10);border:1px solid rgba(255,0,51,0.15);border-radius:16px;overflow:hidden;transition:all 0.35s cubic-bezier(.2,.8,.2,1);position:relative;opacity:0;animation:cardIn 0.6s ease forwards}
.p-card:hover{transform:translateY(-8px);border-color:rgba(255,0,51,0.55);animation:cardIn 0.6s ease forwards,pulseGlow 1.6s ease infinite}
.p-img-wrap{position:relative;aspect-ratio:1/1;background:#1a1a1c;overflow:hidden;cursor:pointer}
.p-img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease}
.p-card:hover .p-img{transform:scale(1.08)}
.p-img-shine{position:absolute;top:0;left:0;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);opacity:0;pointer-events:none}
.p-card:hover .p-img-shine{opacity:1;animation:shine 1s ease}
.p-badge{position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#ff0033,#a3001f);color:#fff;font-size:10.5px;font-weight:800;padding:5px 10px;border-radius:20px;box-shadow:0 4px 14px rgba(255,0,51,0.5);letter-spacing:0.3px}
.p-info{padding:16px}
.p-title{font-size:14.5px;font-weight:700;color:#fff;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.p-variant{font-size:11px;color:rgba(240,236,228,0.4);margin-bottom:10px}

.p-offer-block{background:linear-gradient(135deg,rgba(255,0,51,0.15),rgba(163,0,31,0.08));border:1.5px solid rgba(255,0,51,0.4);border-radius:10px;padding:10px 12px;margin-bottom:8px;text-align:center}
.p-offer-label{font-size:10.5px;font-weight:700;color:#ff8fa3;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:2px}
.p-offer-price{font-size:24px;font-weight:900;background:linear-gradient(135deg,#fff,#ffd9de);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.2}

.p-price-meta{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.p-old-price{font-size:12px;color:rgba(240,236,228,0.35);text-decoration:line-through}
.p-cod-price{font-size:11.5px;color:rgba(240,236,228,0.55);font-weight:600}

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

/* ─── Quick View Modal ────────────────────────────────── */
.qv-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:500;display:none;align-items:flex-end;justify-content:center}
.qv-overlay.show{display:flex}
.qv-sheet{background:#111113;border-radius:20px 20px 0 0;width:100%;max-width:520px;max-height:88vh;overflow-y:auto;transform:translateY(100%);transition:transform 0.3s cubic-bezier(.2,.8,.2,1)}
.qv-overlay.show .qv-sheet{transform:translateY(0)}
.qv-close-row{display:flex;justify-content:flex-end;padding:14px 16px 0;position:sticky;top:0;background:#111113;z-index:1}
.qv-close-btn{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.08);border:none;color:#fff;font-size:18px;cursor:pointer}
.qv-gallery-main{width:100%;aspect-ratio:1;object-fit:cover;background:#1a1a1c;display:block}
.qv-thumbs{display:flex;gap:8px;padding:10px 16px;overflow-x:auto}
.qv-thumbs::-webkit-scrollbar{display:none}
.qv-thumb{width:56px;height:56px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid transparent;flex-shrink:0;opacity:0.6}
.qv-thumb.active{border-color:#ff0033;opacity:1}
.qv-content{padding:6px 20px 24px}
.qv-title{font-size:19px;font-weight:800;color:#fff;line-height:1.35;margin-bottom:6px}
.qv-variant{font-size:12px;color:rgba(240,236,228,0.45);margin-bottom:14px}
.qv-offer-block{background:linear-gradient(135deg,rgba(255,0,51,0.15),rgba(163,0,31,0.08));border:1.5px solid rgba(255,0,51,0.4);border-radius:12px;padding:14px;margin-bottom:10px;text-align:center}
.qv-offer-label{font-size:11px;font-weight:700;color:#ff8fa3;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px}
.qv-offer-price{font-size:30px;font-weight:900;background:linear-gradient(135deg,#fff,#ffd9de);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.qv-price-meta{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:18px;flex-wrap:wrap}
.qv-old-price{font-size:13px;color:rgba(240,236,228,0.35);text-decoration:line-through}
.qv-cod-price{font-size:12.5px;color:rgba(240,236,228,0.6);font-weight:600}
.qv-desc-title{font-size:12px;font-weight:700;color:rgba(240,236,228,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.qv-desc{font-size:13.5px;color:rgba(240,236,228,0.75);line-height:1.7;margin-bottom:22px}
.qv-buy-btn{width:100%;padding:15px;background:linear-gradient(135deg,#ff0033,#a3001f);color:#fff;border:none;font-size:14px;font-weight:800;border-radius:10px;cursor:pointer;text-transform:uppercase;letter-spacing:0.6px}
.qv-buy-btn:hover{box-shadow:0 6px 20px rgba(255,0,51,0.45)}

@media(max-width:768px){
  .hero{min-height:340px}
  .hero-title{font-size:32px}
  .hero-sub{font-size:13px}
  .container{padding:40px 16px}
  .product-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .p-info{padding:11px}
  .p-title{font-size:12.5px}
  .p-offer-price{font-size:19px}
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

<!-- ─── Quick View Modal ───────────────────────────────── -->
<div class="qv-overlay" id="qvOverlay" onclick="closeQuickViewOnOverlay(event)">
  <div class="qv-sheet">
    <div class="qv-close-row"><button class="qv-close-btn" onclick="closeQuickView()">✕</button></div>
    <img class="qv-gallery-main" id="qvMainImg" src="" alt=""/>
    <div class="qv-thumbs" id="qvThumbs"></div>
    <div class="qv-content">
      <div class="qv-title" id="qvTitle"></div>
      <div class="qv-variant" id="qvVariant"></div>

      <div class="qv-offer-block">
        <div class="qv-offer-label">💳 Pay Online & Get</div>
        <div class="qv-offer-price" id="qvOfferPrice"></div>
      </div>
      <div class="qv-price-meta">
        <span class="qv-old-price" id="qvOldPrice"></span>
        <span class="qv-cod-price" id="qvCodPrice"></span>
      </div>

      <div class="qv-desc-title">Product Details</div>
      <div class="qv-desc" id="qvDesc"></div>

      <button class="qv-buy-btn" id="qvBuyBtn">🛒 Buy Now</button>
    </div>
  </div>
</div>

<script>
const PRODUCTS = ${productsJSON};

function openQuickView(idx) {
  const p = PRODUCTS[idx];
  if (!p) return;
  const imgs = (p.images && p.images.length) ? p.images : [p.image];
  document.getElementById('qvMainImg').src = imgs[0] || '';
  const thumbs = document.getElementById('qvThumbs');
  thumbs.innerHTML = imgs.length > 1 ? imgs.map((src, i) =>
    '<img class="qv-thumb' + (i === 0 ? ' active' : '') + '" src="' + src + '" onclick="setQvMainImg(this,\\'' + src + '\\')"/>'
  ).join('') : '';

  document.getElementById('qvTitle').textContent = p.title;
  document.getElementById('qvVariant').textContent = p.variantTitle || '';

  const prepaidPrice = Math.round(p.price * ${PREPAID_DISCOUNT_MULT});
  document.getElementById('qvOfferPrice').textContent = '₹' + prepaidPrice.toLocaleString('en-IN');
  document.getElementById('qvCodPrice').textContent = '🚚 COD Price: ₹' + p.price.toLocaleString('en-IN');
  const oldEl = document.getElementById('qvOldPrice');
  if (p.discountPct > 0) { oldEl.textContent = '₹' + p.compareAtPrice.toLocaleString('en-IN'); oldEl.style.display = 'inline'; }
  else { oldEl.style.display = 'none'; }

  document.getElementById('qvDesc').textContent = p.desc || 'Premium quality wellness product, delivered discreetly.';

  const buyBtn = document.getElementById('qvBuyBtn');
  buyBtn.onclick = function() {
    goCheckout(p.variantId, p.price, p.title, p.variantTitle || '', p.image || '');
  };

  document.getElementById('qvOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function setQvMainImg(thumb, src) {
  document.getElementById('qvMainImg').src = src;
  document.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function closeQuickView() {
  document.getElementById('qvOverlay').classList.remove('show');
  document.body.style.overflow = '';
}
function closeQuickViewOnOverlay(e) {
  if (e.target === document.getElementById('qvOverlay')) closeQuickView();
}

function goCheckout(variantId, price, title, variantTitle, image) {
  // ─── Facebook Pixel: track InitiateCheckout before redirect ──
  if (typeof fbq === 'function') {
    fbq('track', 'InitiateCheckout', {
      value: price,
      currency: 'INR',
      content_type: 'product',
      content_name: title,
      content_ids: [String(variantId)]
    });
  }

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