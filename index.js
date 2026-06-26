const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Image URLs from Shopify CDN
const IMG1 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_1.jpg?v=1782295394";
const IMG2 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_2.webp?v=1782295392";
const IMG3 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_3.webp?v=1782295393";
const LOGO = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Logo_9b05c0db-95d9-4ad1-89e5-1682f42a98c1.png?v=1782295395";
const BANNER = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/banner2.png?v=1782295395";

// Shopify variant IDs
const VARIANT_IDS = {
  6: "45973012250703",
  7: "45973012316239",
  8: "45973012349007",
  9: "45973017002063",
  11: "45973017034831"
};

const REVIEWS = [
  {name:"Rahul Sharma",rating:5,verified:true,text:"Bhai ekdum mast product hai, delivery bhi bahut fast thi. Packaging bilkul plain thi. Highly recommend karta hun!",time:"2 din pehle"},
  {name:"Vikram Singh",rating:5,verified:true,text:"Quality bahut achi hai yaar. Product dekh ke dil khush ho gaya. Belt bhi strong hai. 5 star pakka!",time:"1 hafta pehle"},
  {name:"Amit Yadav",rating:4,verified:true,text:"Product acha hai bhai. Overall quality ke hisaab se sahi price hai.",time:"1 hafta pehle"},
  {name:"Suresh Kumar",rating:5,verified:true,text:"Bahut badhiya product hai. 8 inch wala liya tha, bilkul fit aaya. Full discreet delivery.",time:"2 hafte pehle"},
  {name:"Deepak Verma",rating:5,verified:true,text:"Excellent product! Silicone quality is top notch and belt is very sturdy.",time:"2 hafte pehle"},
  {name:"Rohit Gupta",rating:4,verified:true,text:"Bhai product toh sahi hai lekin delivery thodi late thi. Quality wise koi complaint nahi.",time:"3 hafte pehle"},
  {name:"Manoj Tiwari",rating:5,verified:true,text:"Kya maal hai bhai! Box pe sirf ek plain sticker tha. Full marks!",time:"3 hafte pehle"},
  {name:"Rajesh Patel",rating:5,verified:true,text:"Yaar ye product ne life change kar di. Quality bahut solid hai. Pakka 5 star.",time:"1 mahina pehle"},
  {name:"Sanjay Mishra",rating:4,verified:true,text:"Product bahut accha hai. Silicone material ekdum soft aur realistic hai.",time:"1 mahina pehle"},
  {name:"Arjun Nair",rating:5,verified:true,text:"Ordered the 9 inch variant. Absolutely love it. 100% satisfied!",time:"1 mahina pehle"},
  {name:"Pradeep Joshi",rating:5,verified:true,text:"Bhai COD ka option tha isliye trust hua. Product real mein bahut acha nikla.",time:"6 hafte pehle"},
  {name:"Gaurav Shukla",rating:5,verified:true,text:"Sahi mein paise wasool product hai. Stamina wala fayda amazing hai.",time:"5 hafte pehle"},
  {name:"Hemant Dubey",rating:5,verified:true,text:"Itne din se dhoondh raha tha aisa product. Quality ekdum first class hai.",time:"7 hafte pehle"},
  {name:"Naresh Verma",rating:5,verified:true,text:"11 inch wala manga tha, aaya bhi wahi. Stamina mein fark clearly dikh raha hai.",time:"2 mahine pehle"},
  {name:"Santosh Yadav",rating:5,verified:true,text:"Superb quality hai bhai. Amazon pe nahi mila, yahan se mila aur quality bhi better hai.",time:"2 mahine pehle"},
  {name:"Pramod Singh",rating:5,verified:true,text:"This is literally the best purchase. Quality is superb, packaging was discreet.",time:"3 mahine pehle"},
  {name:"Kamlesh P",rating:4,verified:true,text:"Good product overall. Quality exceeded expectations. Super discreet packaging.",time:"2 mahine pehle"},
  {name:"Dinesh C",rating:4,verified:true,text:"Ek dum sahi product hai. Silicone quality aur belt dono first class hain.",time:"2 mahine pehle"},
  {name:"Ramesh T",rating:5,verified:true,text:"Zabardast product hai bhai. Packaging dekh ke relief mila. 5 star!",time:"3 mahine pehle"},
  {name:"Yogesh K",rating:5,verified:true,text:"Very good product. Material quality is excellent. Belt system is very secure.",time:"3 mahine pehle"},
  {name:"Mukesh Rawat",rating:3,verified:false,text:"Product theek thaak hai. But price ke hisaab se okay hai.",time:"6 hafte pehle"},
  {name:"Bharat Lal",rating:2,verified:false,text:"Mujhe thoda disappointment hua. Size guide sahi nahi thi.",time:"1 mahina pehle"},
  {name:"Ravi K",rating:5,verified:false,text:"Awesome product!",time:"3 din pehle"},
  {name:"Lokesh B",rating:4,verified:false,text:"Nice product. Order kar diya hai.",time:"5 din pehle"},
  {name:"Sunny",rating:5,verified:false,text:"Solid hai bhai!",time:"1 hafte pehle"},
  {name:"Akash M",rating:5,verified:false,text:"Mast product",time:"2 hafte pehle"},
  {name:"Dinesh R",rating:4,verified:false,text:"Nice product, fast delivery.",time:"3 hafte pehle"},
  {name:"Pawan S",rating:5,verified:false,text:"Best product ever bhai!",time:"4 hafte pehle"},
  {name:"Arun T",rating:5,verified:false,text:"Mast hai yaar, recommend karunga",time:"5 hafte pehle"},
  {name:"Vivek N",rating:3,verified:false,text:"Theek hai",time:"6 hafte pehle"},
];

function getPageHTML(defaultSize = "8") {
  const dp  = defaultSize === "11" ? 2749 : 1978;
  const dm  = defaultSize === "11" ? 5499 : 3999;
  const dof = Math.round((1 - dp / dm) * 100);
  const dpr = Math.round(dp * 0.75);
  const sl  = defaultSize === "8" ? "8 Inch (Most Popular)" : defaultSize === "11" ? "11 Inch (Biggest Size)" : `${defaultSize} Inch`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="description" content="King Sleeve Pro — Silicone Extension Sleeve. Discreet delivery across India. COD available."/>
<title>King Sleeve Pro | NaughtyShop</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#080808;color:#f0ece4;font-family:Inter,'Segoe UI',sans-serif}
.nav{background:rgba(8,8,8,0.97);padding:0 24px;border-bottom:1px solid rgba(180,0,0,0.2);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:50;height:64px}
.nav-logo{height:44px;object-fit:contain}
.nav-btn{background:#c0001a;color:#fff;border:none;padding:10px 22px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;border-radius:3px}
.hero{position:relative;width:100%;height:420px;overflow:hidden;display:flex;align-items:center}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,8,8,0.93) 0%,rgba(8,8,8,0.6) 55%,rgba(8,8,8,0.15) 100%)}
.hero-content{position:relative;z-index:2;padding:0 48px;max-width:580px}
.hero-eyebrow{font-size:11px;letter-spacing:0.2em;color:#c0001a;text-transform:uppercase;margin-bottom:14px;font-weight:600}
.hero-title{font-size:52px;font-weight:800;line-height:1.05;color:#fff;margin-bottom:12px}
.hero-title span{color:#c0001a}
.hero-sub{font-size:15px;color:rgba(240,236,228,0.6);line-height:1.7;margin-bottom:28px;max-width:420px}
.hero-buy-btn{background:#c0001a;color:#fff;border:none;padding:16px 44px;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;border-radius:4px}
.hero-trust{display:flex;gap:20px;margin-top:22px;flex-wrap:wrap}
.hero-trust-item{font-size:11px;color:rgba(240,236,228,0.38);letter-spacing:0.06em;display:flex;align-items:center;gap:6px}
.hero-trust-dot{width:4px;height:4px;background:#c0001a;border-radius:50%}
.pg-main{display:grid;grid-template-columns:440px 1fr;border-top:1px solid rgba(180,0,0,0.12)}
.pg-images{padding:24px;border-right:0.5px solid rgba(255,255,255,0.06);position:sticky;top:64px;height:fit-content}
.pg-main-img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:6px;border:0.5px solid rgba(255,255,255,0.08);background:#111;display:block}
.pg-thumbs{display:flex;gap:8px;margin-top:12px}
.pg-thumb{width:76px;height:76px;object-fit:cover;border-radius:4px;border:2px solid transparent;cursor:pointer;background:#111;flex-shrink:0}
.pg-thumb.active{border-color:#c0001a}
.pg-details{padding:28px 36px 40px}
.pg-badge-row{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.pg-badge{font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:2px}
.pg-badge-bs{background:rgba(192,0,26,0.12);color:#ff4444;border:0.5px solid rgba(192,0,26,0.3)}
.pg-badge-cod{background:rgba(34,197,94,0.1);color:#4ade80;border:0.5px solid rgba(34,197,94,0.2)}
.pg-badge-free{background:rgba(59,130,246,0.1);color:#60a5fa;border:0.5px solid rgba(59,130,246,0.2)}
.pg-title{font-size:22px;font-weight:700;line-height:1.35;color:#f0ece4;margin-bottom:10px}
.pg-rating-row{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.pg-stars{color:#f59e0b;font-size:14px}.pg-rating-num{font-size:13px;color:#ff4444;font-weight:600}
.pg-review-count{font-size:12px;color:rgba(240,236,228,0.4);cursor:pointer;text-decoration:underline}
.pg-divider{height:0.5px;background:rgba(255,255,255,0.07);margin:14px 0}
.pg-price-label{font-size:10px;color:rgba(240,236,228,0.4);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px}
.pg-price-row{display:flex;align-items:baseline;gap:12px;margin-bottom:4px;flex-wrap:wrap}
.pg-price{font-size:34px;font-weight:800;color:#f0ece4}
.pg-price-mrp{font-size:15px;color:rgba(240,236,228,0.25);text-decoration:line-through}
.pg-price-off{font-size:15px;color:#4ade80;font-weight:700}
.pg-prepaid-note{background:rgba(34,197,94,0.06);border:0.5px solid rgba(34,197,94,0.18);border-radius:4px;padding:10px 14px;font-size:13px;color:rgba(240,236,228,0.6);margin-top:10px;line-height:1.6}
.pg-prepaid-note strong{color:#4ade80}
.pg-size-label{font-size:13px;font-weight:600;color:#f0ece4;margin-bottom:10px}
.pg-size-label span{color:rgba(240,236,228,0.45);font-weight:400}
.pg-sizes{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
.pg-size-btn{padding:9px 18px;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid rgba(255,255,255,0.12);background:transparent;color:rgba(240,236,228,0.65);font-family:inherit;min-width:52px;text-align:center}
.pg-size-btn.active{border-color:#c0001a;color:#ff4444;background:rgba(192,0,26,0.08)}
.pg-buy-btn{width:100%;padding:18px;background:#c0001a;color:#fff;border:none;font-size:16px;font-weight:800;text-transform:uppercase;cursor:pointer;border-radius:6px;font-family:inherit;letter-spacing:0.08em;margin-bottom:10px}
.pg-buy-note{text-align:center;font-size:12px;color:rgba(240,236,228,0.35);margin-bottom:20px}
.pg-delivery-box{background:#0f0f0f;border:0.5px solid rgba(255,255,255,0.06);border-radius:6px;padding:14px 16px;margin-bottom:16px}
.pg-delivery-row{display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:12px;color:rgba(240,236,228,0.55);line-height:1.5}
.pg-delivery-row:not(:last-child){border-bottom:0.5px solid rgba(255,255,255,0.04)}
.pg-delivery-row strong{color:#f0ece4}
.pg-features-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.pg-feature-card{background:#0f0f0f;border:0.5px solid rgba(255,255,255,0.06);border-radius:4px;padding:12px 13px;display:flex;align-items:flex-start;gap:8px}
.pg-feature-icon{font-size:16px;flex-shrink:0}
.pg-feature-text{font-size:11px;color:rgba(240,236,228,0.45);line-height:1.6}
.pg-feature-text strong{color:#f0ece4;display:block;font-size:12px;margin-bottom:2px}
.pg-desc-title{font-size:13px;font-weight:700;color:#f0ece4;margin-bottom:10px}
.pg-desc-list{list-style:none;display:flex;flex-direction:column;gap:7px}
.pg-desc-list li{display:flex;gap:9px;font-size:12px;color:rgba(240,236,228,0.5);line-height:1.6}
.pg-desc-list li::before{content:"✓";color:#c0001a;font-weight:700;flex-shrink:0}
.rv-section{background:#060606;border-top:1px solid rgba(180,0,0,0.12);padding:48px 32px}
.rv-header{display:flex;align-items:flex-start;gap:48px;margin-bottom:36px;flex-wrap:wrap}
.rv-score-block{text-align:center;min-width:110px}
.rv-score-num{font-size:60px;font-weight:800;color:#f0ece4;line-height:1}
.rv-score-stars{color:#f59e0b;font-size:20px;margin:8px 0}
.rv-score-count{font-size:12px;color:rgba(240,236,228,0.3)}
.rv-bars{flex:1;min-width:200px;display:flex;flex-direction:column;gap:8px}
.rv-bar-row{display:flex;align-items:center;gap:10px;font-size:12px;color:rgba(240,236,228,0.45)}
.rv-bar-track{flex:1;height:6px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden}
.rv-bar-fill{height:100%;background:#c0001a;border-radius:3px}
.rv-bar-pct{width:28px;text-align:right;font-size:11px;color:rgba(240,236,228,0.3)}
.rv-title-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:14px;border-bottom:0.5px solid rgba(255,255,255,0.06);flex-wrap:wrap;gap:10px}
.rv-title{font-size:17px;font-weight:700;color:#f0ece4}
.rv-page-info{font-size:13px;color:rgba(240,236,228,0.35)}
.rv-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px}
.rv-card{background:#0f0f0f;border:0.5px solid rgba(255,255,255,0.06);border-radius:6px;padding:16px}
.rv-top{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
.rv-avatar{width:36px;height:36px;border-radius:50%;background:rgba(192,0,26,0.12);border:1px solid rgba(192,0,26,0.25);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#ff4444;flex-shrink:0}
.rv-meta{flex:1;min-width:0}
.rv-name-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px}
.rv-name{font-size:13px;font-weight:600;color:#f0ece4}
.rv-verified{font-size:10px;color:#4ade80;background:rgba(34,197,94,0.08);border:0.5px solid rgba(34,197,94,0.2);padding:2px 7px;border-radius:2px;font-weight:600;white-space:nowrap}
.rv-time{font-size:11px;color:rgba(240,236,228,0.2);flex-shrink:0;white-space:nowrap}
.rv-stars-sm{color:#f59e0b;font-size:12px}
.rv-text{font-size:13px;color:rgba(240,236,228,0.55);line-height:1.7}
.rv-pagination{display:flex;align-items:center;justify-content:center;gap:12px}
.rv-pg-btn{background:#0f0f0f;border:0.5px solid rgba(255,255,255,0.1);color:#f0ece4;padding:10px 24px;font-size:13px;font-weight:500;cursor:pointer;border-radius:4px;font-family:inherit}
.rv-pg-btn:hover{border-color:#c0001a;color:#ff4444}
.rv-pg-btn:disabled{opacity:0.25;cursor:not-allowed}
.rv-pg-dots{display:flex;gap:6px}
.rv-pg-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.12);cursor:pointer;border:none}
.rv-pg-dot.active{background:#c0001a}
.pg-mobile-cta{display:none;position:fixed;bottom:0;left:0;right:0;background:#080808;border-top:1px solid rgba(192,0,26,0.3);padding:12px 16px;z-index:100;flex-direction:column;gap:6px}
.pg-mobile-price-row{display:flex;align-items:center;gap:10px}
.pg-mobile-price{font-size:22px;font-weight:800;color:#f0ece4}
.pg-mobile-mrp{font-size:13px;color:rgba(240,236,228,0.3);text-decoration:line-through}
.pg-mobile-off{font-size:12px;color:#4ade80;font-weight:600}
.pg-mobile-buy-btn{width:100%;background:#c0001a;color:#fff;border:none;padding:14px;font-size:14px;font-weight:800;text-transform:uppercase;cursor:pointer;border-radius:4px;font-family:inherit;letter-spacing:0.06em}
.pg-footer{background:#040404;border-top:0.5px solid rgba(255,255,255,0.04);padding:20px 32px;display:flex;justify-content:space-between;font-size:11px;color:rgba(240,236,228,0.18)}
@media(max-width:768px){
  .hero{height:auto;min-height:280px}.hero-content{padding:32px 20px}.hero-title{font-size:34px}
  .pg-main{grid-template-columns:1fr}.pg-images{position:static;border-right:none;border-bottom:0.5px solid rgba(255,255,255,0.05);padding:16px}
  .pg-main-img{aspect-ratio:4/3}.pg-thumb{width:64px;height:64px}
  .pg-details{padding:16px 16px 110px}.pg-title{font-size:18px}.pg-price{font-size:30px}
  .pg-buy-btn{display:none}.pg-buy-note{display:none}.pg-mobile-cta{display:flex}
  .nav-btn{display:none}.pg-features-grid{grid-template-columns:1fr}
  .rv-section{padding:28px 16px}.rv-grid{grid-template-columns:1fr}.rv-header{gap:20px}
  .pg-footer{flex-direction:column;gap:6px;text-align:center}
}
</style>
</head>
<body>
<nav class="nav">
  <img class="nav-logo" src="${LOGO}" alt="NaughtyShop"/>
  <button class="nav-btn" onclick="goToCheckout()">Buy Now</button>
</nav>
<div class="hero">
  <img class="hero-bg" src="${BANNER}" alt="NaughtyShop"/>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-eyebrow">New Launch &bull; Discreet Delivery</div>
    <h1 class="hero-title">King Sleeve <span>Pro</span></h1>
    <p class="hero-sub">Instantly add real size, girth &amp; 10x stamina. Medical-grade silicone with secure waist belt.</p>
    <button class="hero-buy-btn" onclick="document.getElementById('ps').scrollIntoView({behavior:'smooth'})">Buy Now ↓</button>
    <div class="hero-trust">
      <div class="hero-trust-item"><div class="hero-trust-dot"></div>Plain packaging</div>
      <div class="hero-trust-item"><div class="hero-trust-dot"></div>Ships in 24 hrs</div>
      <div class="hero-trust-item"><div class="hero-trust-dot"></div>COD available</div>
      <div class="hero-trust-item"><div class="hero-trust-dot"></div>100% private</div>
    </div>
  </div>
</div>
<div id="ps" class="pg-main">
  <div class="pg-images">
    <img id="mainImg" class="pg-main-img" src="${IMG1}" alt="King Sleeve Pro"/>
    <div class="pg-thumbs">
      <img class="pg-thumb active" src="${IMG1}" onclick="switchImg(this)" alt="v1"/>
      <img class="pg-thumb" src="${IMG2}" onclick="switchImg(this)" alt="v2"/>
      <img class="pg-thumb" src="${IMG3}" onclick="switchImg(this)" alt="v3"/>
    </div>
  </div>
  <div class="pg-details">
    <div class="pg-badge-row">
      <span class="pg-badge pg-badge-bs">★ Bestseller</span>
      <span class="pg-badge pg-badge-cod">COD Available</span>
      <span class="pg-badge pg-badge-free">Free Shipping</span>
    </div>
    <h1 class="pg-title">King Sleeve Pro — Silicone Extension Sleeve with Waist Belt</h1>
    <div class="pg-rating-row">
      <span class="pg-stars">★★★★★</span>
      <span class="pg-rating-num">4.8</span>
      <span class="pg-review-count" onclick="document.getElementById('rv').scrollIntoView({behavior:'smooth'})">(1,247 ratings) — Reviews dekhein ↓</span>
    </div>
    <div class="pg-divider"></div>
    <div class="pg-price-label">Price</div>
    <div class="pg-price-row">
      <span class="pg-price" id="cp">₹${dp.toLocaleString('en-IN')}</span>
      <span class="pg-price-mrp" id="cm">₹${dm.toLocaleString('en-IN')}</span>
      <span class="pg-price-off" id="co">${dof}% off</span>
    </div>
    <div class="pg-prepaid-note">💰 Pay online &amp; get <strong>25% extra off</strong> — Prepaid price: <strong id="pp">₹${dpr.toLocaleString('en-IN')}</strong></div>
    <div class="pg-divider"></div>
    <div class="pg-size-label">Size: <span id="sl">${sl}</span></div>
    <div class="pg-sizes">
      <button class="pg-size-btn" onclick="ss(this,6,1978)">6"</button>
      <button class="pg-size-btn" onclick="ss(this,7,1978)">7"</button>
      <button class="pg-size-btn active" onclick="ss(this,8,1978)">8"</button>
      <button class="pg-size-btn" onclick="ss(this,9,1978)">9"</button>
      <button class="pg-size-btn" onclick="ss(this,11,2749)">11"</button>
    </div>
    <button class="pg-buy-btn" onclick="goToCheckout()">★ Buy Now</button>
    <div class="pg-buy-note">COD &amp; Online Payment both available at checkout</div>
    <div class="pg-delivery-box">
      <div class="pg-delivery-row">📦 <div><strong>Plain Packaging</strong> — 100% discreet.</div></div>
      <div class="pg-delivery-row">⏱ <div><strong>Free Delivery</strong> — Ships within 24 hrs across India.</div></div>
      <div class="pg-delivery-row">💵 <div><strong>Cash on Delivery</strong> — Pay when you receive.</div></div>
      <div class="pg-delivery-row">↩ <div><strong>Easy Returns</strong> — 7-day return if unopened.</div></div>
    </div>
    <div class="pg-features-grid">
      <div class="pg-feature-card"><span class="pg-feature-icon">📏</span><div class="pg-feature-text"><strong>Real Size Gain</strong>Adds length &amp; girth instantly.</div></div>
      <div class="pg-feature-card"><span class="pg-feature-icon">⏱</span><div class="pg-feature-text"><strong>10x Stamina</strong>Perform longer, every night.</div></div>
      <div class="pg-feature-card"><span class="pg-feature-icon">🔒</span><div class="pg-feature-text"><strong>Secure Waist Belt</strong>Stays firm, no slipping.</div></div>
      <div class="pg-feature-card"><span class="pg-feature-icon">✓</span><div class="pg-feature-text"><strong>Medical-Grade</strong>Hypoallergenic silicone.</div></div>
    </div>
    <div class="pg-divider"></div>
    <div class="pg-desc-title">Product Highlights</div>
    <ul class="pg-desc-list">
      <li>Life-like anatomical design — identical feel &amp; appearance</li>
      <li>Adds real length &amp; girth — available in 6" to 11" sizes</li>
      <li>Secure adjustable waist belt for hands-free performance</li>
      <li>10x stamina enhancement — built for longer sessions</li>
      <li>Premium medical-grade silicone — body safe &amp; durable</li>
      <li>Ships in plain, unmarked packaging — 100% private</li>
    </ul>
  </div>
</div>
<div class="rv-section" id="rv">
  <div class="rv-header">
    <div class="rv-score-block"><div class="rv-score-num">4.8</div><div class="rv-score-stars">★★★★★</div><div class="rv-score-count">1,247 ratings</div></div>
    <div class="rv-bars">
      <div class="rv-bar-row">5★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:74%"></div></div><span class="rv-bar-pct">74%</span></div>
      <div class="rv-bar-row">4★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:16%"></div></div><span class="rv-bar-pct">16%</span></div>
      <div class="rv-bar-row">3★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:5%;background:#444"></div></div><span class="rv-bar-pct">5%</span></div>
      <div class="rv-bar-row">2★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:3%;background:#444"></div></div><span class="rv-bar-pct">3%</span></div>
      <div class="rv-bar-row">1★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:2%;background:#444"></div></div><span class="rv-bar-pct">2%</span></div>
    </div>
  </div>
  <div class="rv-title-row"><div class="rv-title">Customer Reviews</div><div class="rv-page-info" id="rpi">Page 1 of 5</div></div>
  <div class="rv-grid" id="rg"></div>
  <div class="rv-pagination">
    <button class="rv-pg-btn" id="rpb" onclick="cp2(-1)" disabled>← Prev</button>
    <div class="rv-pg-dots" id="rd"></div>
    <button class="rv-pg-btn" id="rnb" onclick="cp2(1)">Next →</button>
  </div>
</div>
<div class="pg-footer"><span>© 2025 NaughtyShop. All rights reserved.</span><span>naughtyshop.in</span></div>
<div class="pg-mobile-cta">
  <div class="pg-mobile-price-row">
    <span class="pg-mobile-price" id="mp">₹${dp.toLocaleString('en-IN')}</span>
    <span class="pg-mobile-mrp" id="mm">₹${dm.toLocaleString('en-IN')}</span>
    <span class="pg-mobile-off" id="mo">${dof}% off</span>
  </div>
  <button class="pg-mobile-buy-btn" onclick="goToCheckout()">★ Buy Now</button>
</div>
<script>
var CB="${CHECKOUT_BASE}";
var RV=${JSON.stringify(REVIEWS)};
var mrps={6:3999,7:3999,8:3999,9:3999,11:5499};
var pop={8:" (Most Popular)",11:" (Biggest Size)"};
var cs=8,cp=${dp},qty=1;
var PP=6,pg=1,tp=Math.ceil(RV.length/PP);
function ss(btn,size,price){
  document.querySelectorAll('.pg-size-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');cs=size;cp=price;
  var m=mrps[size],of=Math.round((1-price/m)*100),pr=Math.round(price*0.75);
  document.getElementById('cp').textContent='₹'+price.toLocaleString('en-IN');
  document.getElementById('cm').textContent='₹'+m.toLocaleString('en-IN');
  document.getElementById('co').textContent=of+'% off';
  document.getElementById('pp').textContent='₹'+pr.toLocaleString('en-IN');
  document.getElementById('sl').textContent=size+' Inch'+(pop[size]||'');
  document.getElementById('mp').textContent='₹'+price.toLocaleString('en-IN');
  document.getElementById('mm').textContent='₹'+m.toLocaleString('en-IN');
  document.getElementById('mo').textContent=of+'% off';
}
function switchImg(t){document.querySelectorAll('.pg-thumb').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById('mainImg').src=t.src;}
function goToCheckout(){window.location.href=CB+'&size='+cs;}
function sh(n){return '★'.repeat(n)+'☆'.repeat(5-n);}
function rr(){
  var s=(pg-1)*PP,e=Math.min(s+PP,RV.length),h='';
  for(var i=s;i<e;i++){var r=RV[i];var v=r.verified?'<span class="rv-verified">✓ Verified Buyer</span>':'';h+='<div class="rv-card"><div class="rv-top"><div class="rv-avatar">'+r.name[0]+'</div><div class="rv-meta"><div class="rv-name-row"><span class="rv-name">'+r.name+'</span>'+v+'</div><div class="rv-stars-sm">'+sh(r.rating)+'</div></div><div class="rv-time">'+r.time+'</div></div><p class="rv-text">'+r.text+'</p></div>';}
  document.getElementById('rg').innerHTML=h;
  document.getElementById('rpi').textContent='Page '+pg+' of '+tp+' ('+RV.length+' reviews)';
  document.getElementById('rpb').disabled=pg===1;
  document.getElementById('rnb').disabled=pg===tp;
  var d='';for(var p=1;p<=tp;p++)d+='<button class="rv-pg-dot'+(p===pg?' active':'')+'" onclick="gp('+p+')"></button>';
  document.getElementById('rd').innerHTML=d;
}
function cp2(dir){var n=pg+dir;if(n<1||n>tp)return;pg=n;rr();document.getElementById('rv').scrollIntoView({behavior:'smooth'});}
function gp(p){pg=p;rr();document.getElementById('rv').scrollIntoView({behavior:'smooth'});}
rr();
</script>
</body>
</html>`;
}

app.get('/', (req, res) => {
  const size = req.query.size || '8';
  res.send(getPageHTML(size));
});

app.listen(PORT, () => {
  console.log(`NaughtyShop server running on port ${PORT}`);
});