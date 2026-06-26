const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const IMG1 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_1.jpg?v=1782295394";
const IMG2 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_2.webp?v=1782295392";
const IMG3 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_3.webp?v=1782295393";
const LOGO = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Logo_9b05c0db-95d9-4ad1-89e5-1682f42a98c1.png?v=1782295395";
const BANNER = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/banner2.png?v=1782295395";
const FUSION_CHECKOUT = "https://fusionprime.in/apps/fusion/checkout";

const VARIANT_IDS = {6:"45973012250703",7:"45973012316239",8:"45973012349007",9:"45973017002063",11:"45973017034831"};

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
];

function getPageHTML(defaultSize="8"){
  const dp=defaultSize==="11"?2749:1978,dm=defaultSize==="11"?5499:3999,dof=Math.round((1-dp/dm)*100),dpr=Math.round(dp*0.75);
  
  return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>King Sleeve Pro | NaughtyShop</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:#0a0a0a;color:#f0ece4;font-family:'Segoe UI',sans-serif;line-height:1.6;overflow-x:hidden}
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideInRight{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
@keyframes fadeOut{from{opacity:1}to{opacity:0}}
.spin-popup{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:none;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(5px);animation:fadeInUp 0.5s ease}
.spin-popup.show{display:flex}
.spin-popup.hide{animation:fadeOut 0.5s ease forwards}
.spin-container{background:linear-gradient(135deg,#1a0a0a,#2a0a0a);border:3px solid #ff0033;border-radius:20px;padding:40px;text-align:center;max-width:400px;animation:popIn 0.6s ease}
.spin-title{font-size:28px;font-weight:900;color:#fff;margin-bottom:20px}
.spin-wheel{width:280px;height:280px;margin:0 auto 30px;position:relative;cursor:pointer}
.wheel{width:100%;height:100%;border-radius:50%;border:8px solid #ff0033;background:conic-gradient(from 0deg,#ff0033 0deg 45deg,#ff4444 45deg 90deg,#ff6666 90deg 135deg,#ff0033 135deg 180deg,#ff4444 180deg 225deg,#ff6666 225deg 270deg,#ff0033 270deg 315deg,#ff4444 315deg 360deg);display:flex;align-items:center;justify-content:center;transition:transform 0.1s;box-shadow:0 0 30px rgba(255,0,51,0.4)}
.wheel.spinning{animation:spin 4s cubic-bezier(0.25,0.46,0.45,0.94) forwards}
.wheel-center{width:60px;height:60px;background:#0a0a0a;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:24px}
.spin-pointer{position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-top:30px solid #ff0033;z-index:10}
.spin-text{font-size:16px;color:rgba(240,236,228,0.7);margin-bottom:20px}
.spin-btn{width:100%;padding:15px;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;font-weight:900;font-size:16px;cursor:pointer;border-radius:10px;transition:all 0.3s;text-transform:uppercase;letter-spacing:1px}
.spin-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px rgba(192,0,26,0.4)}
.spin-btn:disabled{opacity:0.5;cursor:not-allowed}
.spin-result{margin-top:20px;padding:15px;background:rgba(34,197,94,0.15);border:2px solid #4ade80;border-radius:10px;display:none}
.spin-result.show{display:block;animation:popIn 0.5s ease}
.result-code{font-size:24px;font-weight:900;color:#4ade80;margin-bottom:10px;font-family:monospace;letter-spacing:2px}
.copy-btn{width:100%;padding:10px;background:#4ade80;color:#000;border:none;font-weight:800;cursor:pointer;border-radius:6px;margin-top:10px}
.copy-btn:hover{background:#22c55e}

.nav{background:rgba(8,8,8,0.98);padding:16px 24px;border-bottom:1px solid rgba(192,0,26,0.3);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
.nav-logo{height:40px;object-fit:contain}
.nav-btn{background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:10px 24px;font-weight:800;cursor:pointer;border-radius:6px;transition:all 0.3s;font-size:12px}
.nav-btn:hover{transform:translateY(-2px)}
.hero{position:relative;height:400px;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:fadeInUp 0.8s ease}
.hero-bg{position:absolute;inset:0;object-fit:cover}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,8,8,0.95),rgba(8,8,8,0.5),transparent)}
.hero-content{position:relative;z-index:2;max-width:500px;padding:0 40px;text-align:left}
.hero-title{font-size:56px;font-weight:900;margin-bottom:16px}
.hero-title span{color:#ff0033}
.hero-sub{font-size:15px;color:rgba(240,236,228,0.7);margin-bottom:24px}
.hero-btn{background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:14px 40px;font-weight:800;cursor:pointer;border-radius:6px;transition:all 0.3s}
.hero-btn:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(192,0,26,0.4)}
.container{max-width:900px;margin:0 auto;padding:40px 20px}
.section{animation:fadeInUp 0.8s ease;margin-bottom:40px}
.section h2{font-size:20px;font-weight:800;margin-bottom:20px;color:#fff}
.img-slider{position:relative;border-radius:12px;overflow:hidden;background:#111;margin-bottom:16px;aspect-ratio:1/1.2;animation:slideInRight 0.8s ease}
.main-img{width:100%;height:100%;object-fit:cover;cursor:grab}
.thumbs{display:flex;gap:12px;overflow-x:auto;padding:8px 0}
.thumb{width:70px;height:70px;object-fit:cover;border-radius:8px;cursor:pointer;border:3px solid transparent;transition:all 0.3s;opacity:0.6}
.thumb.active{border-color:#ff0033;opacity:1}
.price-section{background:rgba(192,0,26,0.08);padding:20px;border-radius:10px;margin-bottom:20px;border-left:4px solid #ff0033;animation:slideInRight 0.8s ease 0.1s both}
.price-row{display:flex;gap:12px;align-items:baseline;margin-bottom:8px}
.price-big{font-size:40px;font-weight:900;color:#fff}
.price-old{font-size:16px;color:rgba(240,236,228,0.25);text-decoration:line-through}
.price-off{color:#4ade80;font-weight:800;font-size:14px}
.prepaid-note{font-size:13px;color:#4ade80;margin-top:12px;padding:12px;background:rgba(34,197,94,0.08);border-radius:6px}
.sizes-box{background:rgba(192,0,26,0.1);padding:20px;border-radius:10px;margin-bottom:20px;border:2px solid #ff0033;animation:slideInRight 0.8s ease 0.2s both}
.sizes-label{font-size:13px;font-weight:700;color:#fff;margin-bottom:12px}
.sizes{display:flex;gap:10px;flex-wrap:wrap}
.size-btn{padding:10px 18px;border:2px solid rgba(192,0,26,0.3);background:transparent;color:rgba(240,236,228,0.6);font-weight:700;cursor:pointer;border-radius:6px;transition:all 0.3s;font-size:13px;text-transform:uppercase}
.size-btn:hover{border-color:#ff0033;color:#ff0033}
.size-btn.active{border-color:#ff0033;background:linear-gradient(135deg,rgba(192,0,26,0.3),rgba(192,0,26,0.15));color:#fff;box-shadow:0 4px 12px rgba(192,0,26,0.2);animation:pulse 0.3s ease}
.buy-btn{width:100%;padding:18px;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;font-size:16px;font-weight:900;cursor:pointer;border-radius:8px;transition:all 0.3s;margin-bottom:20px;text-transform:uppercase;letter-spacing:1px;animation:slideInRight 0.8s ease 0.3s both}
.buy-btn:hover{transform:translateY(-3px);box-shadow:0 8px 25px rgba(192,0,26,0.4)}
.desc-box{background:rgba(192,0,26,0.05);padding:20px;border-radius:10px;line-height:1.8;color:rgba(240,236,228,0.7);animation:fadeInUp 0.8s ease 0.4s both}
.desc-box h3{color:#fff;margin-bottom:12px;font-size:15px}
.desc-box p{margin-bottom:12px;font-size:14px}
.desc-box ul{margin-left:20px;margin-bottom:12px}
.desc-box li{margin-bottom:8px;font-size:14px}
.review-write{background:rgba(192,0,26,0.08);padding:20px;border-radius:10px;margin-bottom:20px;border:1px solid rgba(192,0,26,0.2);animation:fadeInUp 0.8s ease 0.5s both}
.review-write h3{color:#fff;margin-bottom:12px;font-size:15px}
.review-write p{font-size:12px;color:rgba(240,236,228,0.4);margin-bottom:12px}
.stars{display:flex;gap:8px;margin-bottom:12px}
.star{font-size:32px;cursor:pointer;opacity:0.3;transition:all 0.2s}
.star:hover{opacity:1}
.star.active{opacity:1;animation:pulse 0.3s ease}
.input-field{width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,0,26,0.2);border-radius:6px;color:#fff;font-family:inherit;margin-bottom:12px;font-size:14px}
.input-field::placeholder{color:rgba(240,236,228,0.3)}
.submit-btn{width:100%;padding:12px;background:#ff0033;color:#fff;border:none;font-weight:700;cursor:pointer;border-radius:6px;transition:all 0.3s}
.submit-btn:hover{background:#c0001a;transform:translateY(-2px)}
.user-reviews{margin-top:16px;max-height:200px;overflow-y:auto;padding:8px}
.review-item{background:rgba(192,0,26,0.05);padding:10px;border-radius:6px;margin-bottom:8px;font-size:12px;color:rgba(240,236,228,0.6);border-left:2px solid #ff0033}
.review-name{color:#fff;font-weight:700;display:block;margin-bottom:4px}
.review-stars{color:#f59e0b;font-size:11px}
.official-reviews{background:rgba(192,0,26,0.05);padding:20px;border-radius:10px;animation:fadeInUp 0.8s ease 0.6s both}
.official-reviews h3{color:#fff;margin-bottom:16px;font-size:15px}
.rev-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.rev-card{background:rgba(192,0,26,0.08);padding:12px;border-radius:8px;font-size:12px;color:rgba(240,236,228,0.6);border-left:3px solid #ff0033;animation:fadeInUp 0.8s ease}
.rev-name{color:#fff;font-weight:700;margin-bottom:4px}
.rev-badge{background:rgba(34,197,94,0.15);color:#4ade80;font-size:10px;padding:2px 6px;border-radius:3px;margin-left:4px}
.rev-stars{color:#f59e0b;font-size:11px;margin-bottom:6px}
.footer{text-align:center;padding:20px;font-size:12px;color:rgba(240,236,228,0.2);border-top:1px solid rgba(192,0,26,0.2);margin-top:40px}
.mobile-cta{display:none;position:fixed;bottom:0;left:0;right:0;background:linear-gradient(180deg,rgba(8,8,8,0.95),rgba(8,8,8,0.98));padding:16px;border-top:1px solid rgba(192,0,26,0.3);z-index:50;flex-direction:column;gap:10px}
.mobile-price{font-size:20px;font-weight:900;color:#fff}
.mobile-btn{width:100%;padding:14px;background:#ff0033;color:#fff;border:none;font-weight:900;border-radius:8px;cursor:pointer}
@media(max-width:768px){
  .hero{height:300px}.hero-title{font-size:36px}
  .hero-content{padding:0 20px}
  .rev-grid{grid-template-columns:1fr}
  .buy-btn{display:none}
  .mobile-cta{display:flex}
  .spin-container{max-width:320px;padding:30px}
}
</style>
</head>
<body>

<div class="spin-popup" id="sp">
  <div class="spin-container">
    <div class="spin-title">🎁 Try Your Luck!</div>
    <div class="spin-pointer"></div>
    <div class="spin-wheel" id="sw">
      <div class="wheel" id="wh"></div>
      <div class="wheel-center">🎯</div>
    </div>
    <div class="spin-text">Spin the wheel & get instant discount!</div>
    <button class="spin-btn" id="sb" onclick="spinWheel()">SPIN NOW</button>
    <div class="spin-result" id="sr"></div>
  </div>
</div>

<nav class="nav">
  <img class="nav-logo" src="${LOGO}"/>
  <button class="nav-btn" onclick="goCheckout()">Buy Now</button>
</nav>
<div class="hero">
  <img class="hero-bg" src="${BANNER}"/>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">King Sleeve <span>Pro</span></h1>
    <p class="hero-sub">Real size + girth + 10x stamina. Discreet delivery. COD available.</p>
    <button class="hero-btn" onclick="document.querySelector('.container').scrollIntoView({behavior:'smooth'})">Explore ↓</button>
  </div>
</div>

<div class="container">
  <div class="section">
    <div class="img-slider">
      <img id="mainImg" class="main-img" src="${IMG1}" ontouchstart="ts(event)" ontouchend="te(event)"/>
    </div>
    <div class="thumbs">
      <img class="thumb active" src="${IMG1}" onclick="switchImg(0)"/>
      <img class="thumb" src="${IMG2}" onclick="switchImg(1)"/>
      <img class="thumb" src="${IMG3}" onclick="switchImg(2)"/>
    </div>
  </div>

  <div class="section">
    <h2>King Sleeve Pro ⭐⭐⭐⭐⭐ (1,247 reviews)</h2>
    
    <div class="price-section">
      <div class="price-row">
        <span class="price-big" id="p">₹${dp.toLocaleString('en-IN')}</span>
        <span class="price-old" id="m">₹${dm.toLocaleString('en-IN')}</span>
        <span class="price-off" id="o">${dof}% off</span>
      </div>
      <div class="prepaid-note">💰 Pay online & get 25% extra → ₹${dpr}</div>
    </div>

    <div class="sizes-box">
      <div class="sizes-label">📏 Select Size: <span id="sl" style="color:#ff0033">${defaultSize}"</span></div>
      <div class="sizes">
        <button class="size-btn" onclick="ss(this,6,1978)">6"</button>
        <button class="size-btn" onclick="ss(this,7,1978)">7"</button>
        <button class="size-btn ${defaultSize==='8'?'active':''}" onclick="ss(this,8,1978)">8"</button>
        <button class="size-btn" onclick="ss(this,9,1978)">9"</button>
        <button class="size-btn" onclick="ss(this,11,2749)">11"</button>
      </div>
    </div>

    <button class="buy-btn" onclick="goCheckout()">🛒 Buy Now - ₹<span id="bp">${dp}</span></button>

    <div class="desc-box">
      <h3>📦 What's Inside</h3>
      <p>🔥 Premium medical-grade silicone extension sleeve — 100% body-safe, hypoallergenic</p>
      <p>🔒 Secure adjustable waist belt — No slipping during activity</p>
      <p>💪 Instant size, girth & 10x stamina boost — Noticeable difference</p>
      
      <h3 style="margin-top:16px">💪 Performance Benefits</h3>
      <p>📏 Instantly adds real length & girth — Visible & noticeable</p>
      <p>⚡ 10x stamina enhancement — Perform longer, every time</p>
      <p>🔒 Hands-free performance — Secure belt keeps everything in place</p>
      <p>🎯 Confidence boost — Feel bigger, perform better</p>

      <h3 style="margin-top:16px">🚚 Delivery & Privacy</h3>
      <ul>
        <li>📦 Plain, unmarked packaging — 100% discreet, no product name on box</li>
        <li>⚡ Ships within 24 hours — Fast delivery across India</li>
        <li>💵 Cash on Delivery available — Pay when you receive</li>
        <li>↩️ 7-day easy returns — If unopened, full refund</li>
      </ul>

      <h3 style="margin-top:16px">🧪 Material & Safety</h3>
      <p>Made from premium medical-grade silicone that's tested & approved for intimate use. Soft, flexible, and durable. Safe for all skin types.</p>

      <h3 style="margin-top:16px">📏 Size Guide</h3>
      <p><strong>6"</strong> — Compact, discreet | <strong>7"</strong> — Standard add-on | <strong>8"</strong> — Most popular choice ⭐ | <strong>9"</strong> — Premium size | <strong>11"</strong> — Maximum girth & length 💪</p>
    </div>

    <div class="review-write">
      <h3>✍️ Share Your Review</h3>
      <p>(Only visible to you)</p>
      <div style="margin-bottom:12px">
        <label style="font-size:12px;color:rgba(240,236,228,0.5)">Rate it:</label>
        <div class="stars" id="sr">
          <span class="star" onclick="rt(1)">★</span>
          <span class="star" onclick="rt(2)">★</span>
          <span class="star" onclick="rt(3)">★</span>
          <span class="star" onclick="rt(4)">★</span>
          <span class="star" onclick="rt(5)">★</span>
        </div>
      </div>
      <input class="input-field" id="rn" placeholder="Your name (optional)" maxlength="30"/>
      <textarea class="input-field" id="rt" placeholder="Your review..." maxlength="200" rows="3"></textarea>
      <button class="submit-btn" onclick="submit_review()">Post Review</button>
      <div class="user-reviews" id="ur"></div>
    </div>

    <div class="official-reviews">
      <h3>⭐ What People Say</h3>
      <div class="rev-grid" id="rg"></div>
    </div>
  </div>
</div>

<div class="footer">© 2025 NaughtyShop • 🔒 100% Private</div>

<div class="mobile-cta">
  <div class="mobile-price">₹<span id="mp">${dp.toLocaleString('en-IN')}</span></div>
  <button class="mobile-btn" onclick="goCheckout()">🛒 Buy Now</button>
</div>

<script>
var IMGS=['${IMG1}','${IMG2}','${IMG3}'],VIDS={6:'${VARIANT_IDS[6]}',7:'${VARIANT_IDS[7]}',8:'${VARIANT_IDS[8]}',9:'${VARIANT_IDS[9]}',11:'${VARIANT_IDS[11]}'},REV=${JSON.stringify(REVIEWS)};
var cs=8,cp=${dp},idx=0,cRat=0,ts_x=0,spun=false;
var mrps={6:3999,7:3999,8:3999,9:3999,11:5499};
var spinCount=parseInt(localStorage.getItem('spinCount')||'0');

function ts(e){ts_x=e.changedTouches[0].clientX}
function te(e){
  var te_x=e.changedTouches[0].clientX,diff=ts_x-te_x;
  if(Math.abs(diff)>50){if(diff>0&&idx<2){idx++;sw()}else if(diff<0&&idx>0){idx--;sw()}}
}
function sw(){document.getElementById('mainImg').src=IMGS[idx];document.querySelectorAll('.thumb').forEach((t,i)=>{t.classList.toggle('active',i===idx)})}
function switchImg(i){idx=i;sw()}
function ss(btn,sz,pr){
  document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  cs=sz;cp=pr;
  var m=mrps[sz],o=Math.round((1-pr/m)*100),pp=Math.round(pr*0.75);
  document.getElementById('p').textContent='₹'+pr.toLocaleString('en-IN');
  document.getElementById('m').textContent='₹'+m.toLocaleString('en-IN');
  document.getElementById('o').textContent=o+'% off';
  document.getElementById('sl').textContent=sz+'"';
  document.getElementById('bp').textContent=pr;
  document.getElementById('mp').textContent=pr.toLocaleString('en-IN');
}
function rt(r){cRat=r;document.querySelectorAll('#sr .star').forEach((s,i)=>{s.classList.toggle('active',i<r)})}
function submit_review(){
  var nm=document.getElementById('rn').value||'Anonymous',tx=document.getElementById('rt').value.trim();
  if(!cRat||!tx){alert('Please rate & review');return}
  var revs=JSON.parse(localStorage.getItem('ns_rev')||'[]');
  revs.unshift({name:nm,rating:cRat,text:tx,time:'just now'});
  localStorage.setItem('ns_rev',JSON.stringify(revs));
  document.getElementById('rn').value='';
  document.getElementById('rt').value='';
  cRat=0;
  document.querySelectorAll('#sr .star').forEach(s=>s.classList.remove('active'));
  load_user_reviews();
}
function load_user_reviews(){
  var revs=JSON.parse(localStorage.getItem('ns_rev')||'[]');
  var h='';
  revs.slice(0,5).forEach(r=>{h+='<div class="review-item"><span class="review-name">'+r.name+'</span><span class="review-stars">'+('★'.repeat(r.rating))+'</span><div>'+r.text+'</div><div style="opacity:0.5;font-size:11px">'+r.time+'</div></div>'});
  document.getElementById('ur').innerHTML=h;
}
function load_official(){
  var h='';
  REV.forEach(r=>{
    var bd=r.verified?'<span class="rev-badge">✓ Verified</span>':'';
    h+='<div class="rev-card"><div class="rev-name">'+r.name+bd+'</div><div class="rev-stars">'+('★'.repeat(r.rating))+'</div><div>'+r.text+'</div><div style="opacity:0.5;font-size:10px;margin-top:6px">'+r.time+'</div></div>';
  });
  document.getElementById('rg').innerHTML=h;
}
function spinWheel(){
  if(spun){alert('You already spun! Come back later');return}
  var btn=document.getElementById('sb');
  btn.disabled=true;
  var wheel=document.getElementById('wh');
  var rotation=Math.floor(Math.random()*360)+720;
  wheel.style.transition='transform 4s cubic-bezier(0.25,0.46,0.45,0.94)';
  wheel.style.transform='rotate('+rotation+'deg)';
  setTimeout(function(){
    spun=true;
    spinCount++;
    localStorage.setItem('spinCount',spinCount);
    var sr=document.getElementById('sr');
    sr.classList.add('show');
    if(spinCount%20===0){
      sr.innerHTML='<div style="font-size:14px;color:rgba(240,236,228,0.6);margin-bottom:10px">🎉 Congratulations!</div><div class="result-code">HAPPY2026</div><button class="copy-btn" onclick="copyCode()">📋 Copy Code</button>';
    }else{
      sr.innerHTML='<div style="font-size:14px;color:rgba(240,236,228,0.6)">You won a spin! Come back at '+((21-spinCount%20)+spinCount)+'th spin</div>';
    }
    setTimeout(function(){closeSpin()},2000);
  },4000);
}
function copyCode(){
  navigator.clipboard.writeText('HAPPY2026');
  alert('Code copied! ✅');
}
function closeSpin(){
  var popup=document.getElementById('sp');
  popup.classList.add('hide');
  setTimeout(function(){popup.classList.remove('show','hide')},500);
}
function goCheckout(){window.location.href='${FUSION_CHECKOUT}?source=naughtyshop&shop=p91iux-zw.myshopify.com&size='+cs+'&price='+cp}

window.addEventListener('load',function(){
  if(!localStorage.getItem('spinShown')){
    document.getElementById('sp').classList.add('show');
    localStorage.setItem('spinShown','true');
  }
});

load_user_reviews();
load_official();
if('${defaultSize}'==='8')ss(document.querySelectorAll('.size-btn')[2],8,1978);
</script>
</body>
</html>`;
}
app.get('/',(req,res)=>{res.send(getPageHTML(req.query.size||'8'))});
app.listen(PORT,()=>{console.log('NaughtyShop running on '+PORT)});