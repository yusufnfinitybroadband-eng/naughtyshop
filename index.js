const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const IMG1 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_1.jpg?v=1782295394";
const IMG2 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_2.webp?v=1782295392";
const IMG3 = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Image_3.webp?v=1782295393";
const LOGO = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/Logo_9b05c0db-95d9-4ad1-89e5-1682f42a98c1.png?v=1782295395";
const BANNER = "https://cdn.shopify.com/s/files/1/0661/7953/0831/files/banner2.png?v=1782295395";
const FUSION_CHECKOUT = "https://fusionprime.in/apps/fusion/checkout";

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
<title>King Sleeve Pro | NaughtyShop</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:linear-gradient(135deg,#0a0a0a 0%,#1a0a0a 100%);color:#f0ece4;font-family:'Inter','-apple-system',sans-serif;line-height:1.6}
.nav{background:rgba(8,8,8,0.98);backdrop-filter:blur(10px);padding:0 24px;border-bottom:1px solid rgba(192,0,26,0.3);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;height:64px}
.nav-logo{height:40px;object-fit:contain}
.nav-btn{background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:12px 28px;font-size:11px;font-weight:800;cursor:pointer;border-radius:6px;transition:all 0.3s}
.nav-btn:hover{transform:translateY(-2px)}
.hero{position:relative;width:100%;height:480px;overflow:hidden;display:flex;align-items:center}
.hero-bg{position:absolute;inset:0;object-fit:cover}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,8,8,0.95) 0%,rgba(8,8,8,0.5) 50%,rgba(8,8,8,0) 100%)}
.hero-content{position:relative;z-index:2;padding:0 48px;max-width:620px}
.hero-title{font-size:64px;font-weight:900;color:#fff;margin-bottom:16px;text-shadow:0 4px 20px rgba(0,0,0,0.5)}
.hero-title span{background:linear-gradient(135deg,#ff0033,#ff6666);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-sub{font-size:16px;color:rgba(240,236,228,0.7);line-height:1.8;margin-bottom:32px}
.hero-buy-btn{background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:18px 48px;font-weight:800;cursor:pointer;border-radius:8px}
.pg-main{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(192,0,26,0.2)}
.pg-images{padding:32px;background:rgba(15,15,15,0.5);border-right:1px solid rgba(192,0,26,0.2);position:sticky;top:64px;height:fit-content}
.pg-carousel{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;border-radius:12px;background:#111;border:1px solid rgba(192,0,26,0.2);touch-action:pan-y}
.pg-main-img{width:100%;height:100%;object-fit:cover;cursor:grab;user-select:none}
.pg-thumbs{display:flex;gap:10px;margin-top:16px}
.pg-thumb{width:80px;height:80px;object-fit:cover;border-radius:8px;border:3px solid transparent;cursor:pointer;filter:brightness(0.7);transition:all 0.3s}
.pg-thumb.active{border-color:#ff0033;filter:brightness(1)}
.pg-details{padding:36px 40px 60px;background:linear-gradient(135deg,rgba(15,15,15,0.8) 0%,rgba(20,10,10,0.6) 100%);overflow-y:auto;max-height:calc(100vh - 64px)}
.pg-title{font-size:24px;font-weight:800;color:#fff;margin-bottom:8px}
.pg-meta{font-size:13px;color:rgba(240,236,228,0.4);margin-bottom:20px}
.pg-price-row{display:flex;gap:12px;align-items:baseline;margin:20px 0}
.pg-price{font-size:44px;font-weight:900;color:#fff}
.pg-price-mrp{font-size:16px;color:rgba(240,236,228,0.25);text-decoration:line-through}
.pg-price-off{color:#4ade80;font-weight:800}
.pg-prepaid{font-size:13px;color:#4ade80;margin-bottom:16px;padding:12px;background:rgba(34,197,94,0.08);border-left:3px solid #4ade80;border-radius:4px}
.size-box{margin:16px 0;padding:16px;background:rgba(192,0,26,0.1);border:2px solid #ff0033;border-radius:8px}
.size-label{font-size:13px;font-weight:700;color:#fff;margin-bottom:12px;display:block}
.pg-sizes{display:flex;gap:10px;flex-wrap:wrap}
.pg-size-btn{padding:12px 22px;border-radius:8px;font-weight:700;cursor:pointer;border:2px solid rgba(192,0,26,0.3);background:transparent;color:rgba(240,236,228,0.6);transition:all 0.3s;font-size:14px;text-transform:uppercase}
.pg-size-btn:hover{border-color:#ff0033;color:#ff0033}
.pg-size-btn.active{border-color:#ff0033;color:#fff;background:linear-gradient(135deg,rgba(192,0,26,0.3),rgba(192,0,26,0.15));box-shadow:0 4px 15px rgba(192,0,26,0.2)}
.pg-buy-btn{width:100%;padding:20px;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;font-size:17px;font-weight:900;cursor:pointer;border-radius:10px;margin:24px 0}
.short-desc{font-size:15px;color:rgba(240,236,228,0.6);margin:20px 0;padding:16px;background:rgba(192,0,26,0.08);border-left:3px solid #ff0033;border-radius:4px}
.toggle-link{color:#ff4444;cursor:pointer;font-weight:700;display:block;margin-top:12px}
.detailed-desc{display:none;margin:20px 0;padding:20px;background:rgba(192,0,26,0.05);border-radius:8px;line-height:1.8}
.detailed-desc.show{display:block}
.review-box{margin-top:40px;padding:20px;background:rgba(192,0,26,0.08);border:1px solid rgba(192,0,26,0.2);border-radius:10px}
.review-box h3{color:#fff;margin-bottom:16px;font-size:16px}
.review-input{width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,0,26,0.2);border-radius:6px;color:#fff;font-family:inherit;margin-bottom:12px}
.review-input::placeholder{color:rgba(240,236,228,0.3)}
.stars{display:flex;gap:8px;margin-bottom:12px}
.star{font-size:28px;cursor:pointer;opacity:0.3;transition:opacity 0.2s}
.star.active{opacity:1}
.review-submit{width:100%;padding:12px;background:#ff0033;color:#fff;border:none;font-weight:700;border-radius:6px;cursor:pointer}
.reviews-list{margin-top:20px;max-height:300px;overflow-y:auto}
.review-item{background:rgba(192,0,26,0.05);padding:12px;border-radius:6px;margin-bottom:10px;font-size:13px;color:rgba(240,236,228,0.6)}
.review-item strong{color:#fff;display:block;margin-bottom:4px}
.review-item .stars-sm{color:#f59e0b;font-size:12px;margin-bottom:4px}
.official-reviews{margin-top:40px;padding:20px;background:rgba(192,0,26,0.05);border-radius:8px}
.official-reviews h3{color:#fff;margin-bottom:16px}
.rev-item{background:rgba(192,0,26,0.08);padding:12px;border-radius:6px;margin-bottom:10px;font-size:13px;color:rgba(240,236,228,0.6)}
.rev-item strong{color:#fff;display:block;margin-bottom:4px}
.rev-item .verified{background:rgba(34,197,94,0.15);color:#4ade80;font-size:10px;padding:2px 6px;border-radius:3px;margin-left:8px}
.pg-mobile-cta{display:none;position:fixed;bottom:0;left:0;right:0;background:linear-gradient(180deg,rgba(8,8,8,0.95),rgba(8,8,8,0.98));border-top:1px solid rgba(192,0,26,0.3);padding:14px 16px;z-index:99;flex-direction:column;gap:8px}
.pg-mobile-buy-btn{width:100%;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:16px;font-weight:900;cursor:pointer;border-radius:10px}
@media(max-width:768px){
  .pg-main{grid-template-columns:1fr}.pg-images{position:static;border-right:none;padding:20px}
  .pg-carousel{aspect-ratio:3/4}.pg-details{padding:20px 20px 140px}
  .pg-buy-btn{display:none}.pg-mobile-cta{display:flex}
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
    <h1 class="hero-title">King Sleeve <span>Pro</span></h1>
    <p class="hero-sub">Instantly add real size, girth & 10x stamina. Medical-grade silicone with secure waist belt.</p>
    <button class="hero-buy-btn" onclick="document.getElementById('ps').scrollIntoView({behavior:'smooth'})">Shop Now ↓</button>
  </div>
</div>
<div id="ps" class="pg-main">
  <div class="pg-images">
    <div class="pg-carousel" ontouchstart="handleTouchStart(event)" ontouchend="handleTouchEnd(event)">
      <img id="mainImg" class="pg-main-img" src="${IMG1}" alt="King Sleeve Pro"/>
    </div>
    <div class="pg-thumbs">
      <img class="pg-thumb active" src="${IMG1}" onclick="switchImg(this, 0)" alt="v1"/>
      <img class="pg-thumb" src="${IMG2}" onclick="switchImg(this, 1)" alt="v2"/>
      <img class="pg-thumb" src="${IMG3}" onclick="switchImg(this, 2)" alt="v3"/>
    </div>
  </div>
  <div class="pg-details">
    <h2 class="pg-title">King Sleeve Pro</h2>
    <p class="pg-meta">⭐⭐⭐⭐⭐ 4.8 (1,247 reviews) • COD Available • Free Shipping</p>
    
    <div class="pg-price-row">
      <span class="pg-price" id="cp">₹${dp.toLocaleString('en-IN')}</span>
      <span class="pg-price-mrp" id="cm">₹${dm.toLocaleString('en-IN')}</span>
      <span class="pg-price-off" id="co">${dof}% off</span>
    </div>
    <div class="pg-prepaid">💰 Pay online & get <strong>25% extra off</strong> → ₹<span id="pp">${dpr}</span></div>

    <div class="size-box">
      <label class="size-label">📏 Select Size: <span id="sl" style="color:#ff0033">${sl}</span></label>
      <div class="pg-sizes">
        <button class="pg-size-btn" onclick="ss(this,6,1978)">6"</button>
        <button class="pg-size-btn" onclick="ss(this,7,1978)">7"</button>
        <button class="pg-size-btn active" onclick="ss(this,8,1978)">8"</button>
        <button class="pg-size-btn" onclick="ss(this,9,1978)">9"</button>
        <button class="pg-size-btn" onclick="ss(this,11,2749)">11"</button>
      </div>
    </div>

    <button class="pg-buy-btn" onclick="goToCheckout()">🛒 Buy Now - ₹<span id="bp">${dp}</span></button>

    <div class="short-desc">🔥 Premium silicone extension sleeve with secure waist belt. Adds real size, girth & 10x stamina. Discreet delivery, COD available.</div>
    
    <a class="toggle-link" onclick="toggleDesc()">📖 Read full details ↓</a>
    <div id="detailedDesc" class="detailed-desc">
      <h3>📦 What You Get</h3>
      <p>✓ Medical-grade silicone extension sleeve — 100% body-safe<br/>✓ Adjustable waist belt — Secure fit, no slipping<br/>✓ Realistic anatomical design — Maximum pleasure<br/>✓ 5 size options — 6" to 11"</p>
      
      <h3 style="margin-top:16px">💪 Performance Benefits</h3>
      <p>📏 Instantly adds real length & girth<br/>⚡ 10x stamina enhancement<br/>🔒 Hands-free performance with secure belt<br/>🎯 Confidence boost</p>
      
      <h3 style="margin-top:16px">🚚 Delivery & Privacy</h3>
      <p>📦 Plain, unmarked packaging — 100% discreet<br/>⚡ Ships within 24 hours — Fast delivery<br/>💵 Cash on Delivery available<br/>↩️ 7-day easy returns if unopened</p>
    </div>

    <div class="review-box">
      <h3>✍️ Write Your Review</h3>
      <p style="font-size:12px;color:rgba(240,236,228,0.4);margin-bottom:12px">(Your review will only appear on your device)</p>
      <div style="margin-bottom:12px">
        <label style="display:block;margin-bottom:8px;font-size:12px">Rating:</label>
        <div class="stars" id="starRating">
          <span class="star" onclick="setRating(1)">★</span>
          <span class="star" onclick="setRating(2)">★</span>
          <span class="star" onclick="setRating(3)">★</span>
          <span class="star" onclick="setRating(4)">★</span>
          <span class="star" onclick="setRating(5)">★</span>
        </div>
      </div>
      <input class="review-input" id="reviewName" placeholder="Your name (optional)" type="text" maxlength="30"/>
      <textarea class="review-input" id="reviewText" placeholder="Share your experience..." maxlength="200" rows="3"></textarea>
      <button class="review-submit" onclick="submitReview()">Post Review</button>
      <div class="reviews-list" id="reviewsList"></div>
    </div>

    <div class="official-reviews">
      <h3>⭐ Customer Reviews (Official)</h3>
      <div id="officialReviews"></div>
    </div>
  </div>
</div>
<div class="pg-mobile-cta">
  <div style="display:flex;gap:12px;align-items:center">
    <span style="font-size:24px;font-weight:900;color:#fff">₹<span id="mp">${dp.toLocaleString('en-IN')}</span></span>
    <span style="font-size:12px;color:#4ade80;font-weight:800">-<span id="mo">${dof}</span>%</span>
  </div>
  <button class="pg-mobile-buy-btn" onclick="goToCheckout()">🛒 Buy Now</button>
</div>
<script>
var IMGS=['${IMG1}','${IMG2}','${IMG3}'];
var VIDS={6:'${VARIANT_IDS[6]}',7:'${VARIANT_IDS[7]}',8:'${VARIANT_IDS[8]}',9:'${VARIANT_IDS[9]}',11:'${VARIANT_IDS[11]}'};
var OFFICIAL_REVIEWS=${JSON.stringify(REVIEWS)};
var FUSION_CHECKOUT='${FUSION_CHECKOUT}';
var mrps={6:3999,7:3999,8:3999,9:3999,11:5499};
var cs=8,cp=${dp},imgIdx=0,currentRating=0,touchStart=0,touchEnd=0;

function handleTouchStart(e){touchStart=e.changedTouches[0].clientX}
function handleTouchEnd(e){
  touchEnd=e.changedTouches[0].clientX;
  if(Math.abs(touchStart-touchEnd)>50){
    if(touchStart-touchEnd>0 && imgIdx<2){imgIdx++;switchImg(document.querySelectorAll('.pg-thumb')[imgIdx],imgIdx)}
    else if(touchStart-touchEnd<0 && imgIdx>0){imgIdx--;switchImg(document.querySelectorAll('.pg-thumb')[imgIdx],imgIdx)}
  }
}
function ss(btn,size,price){
  document.querySelectorAll('.pg-size-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  cs=size;cp=price;
  var m=mrps[size],of=Math.round((1-price/m)*100),pr=Math.round(price*0.75);
  document.getElementById('cp').textContent='₹'+price.toLocaleString('en-IN');
  document.getElementById('cm').textContent='₹'+m.toLocaleString('en-IN');
  document.getElementById('co').textContent=of+'% off';
  document.getElementById('pp').textContent=pr;
  document.getElementById('bp').textContent=price;
  document.getElementById('sl').textContent=size+' Inch'+(size==8?' (Most Popular)':(size==11?' (Biggest Size)':''));
  document.getElementById('mp').textContent=price.toLocaleString('en-IN');
  document.getElementById('mo').textContent=of;
}
function switchImg(t,idx){
  document.querySelectorAll('.pg-thumb').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  imgIdx=idx;
  document.getElementById('mainImg').src=IMGS[idx];
}
function goToCheckout(){
  window.location.href=FUSION_CHECKOUT+'?source=naughtyshop&shop=p91iux-zw.myshopify.com&size='+cs+'&price='+cp;
}
function toggleDesc(){document.getElementById('detailedDesc').classList.toggle('show')}
function setRating(n){
  currentRating=n;
  document.querySelectorAll('#starRating .star').forEach((s,i)=>{s.classList.toggle('active',i<n)});
}
function submitReview(){
  var name=document.getElementById('reviewName').value||'Anonymous';
  var text=document.getElementById('reviewText').value.trim();
  if(!currentRating||!text){alert('Please rate & write a review');return}
  var reviews=JSON.parse(localStorage.getItem('naughtyshop_reviews')||'[]');
  reviews.unshift({name,rating:currentRating,text,time:'just now'});
  localStorage.setItem('naughtyshop_reviews',JSON.stringify(reviews));
  document.getElementById('reviewName').value='';
  document.getElementById('reviewText').value='';
  currentRating=0;
  document.querySelectorAll('#starRating .star').forEach(s=>s.classList.remove('active'));
  loadReviews();
}
function loadReviews(){
  var reviews=JSON.parse(localStorage.getItem('naughtyshop_reviews')||'[]');
  var html='';
  reviews.slice(0,5).forEach(r=>{html+='<div class="review-item"><strong>'+r.name+'</strong><div class="stars-sm">'+('★'.repeat(r.rating))+'</div>'+r.text+'<br/><span style="opacity:0.5;font-size:11px">'+r.time+'</span></div>'});
  document.getElementById('reviewsList').innerHTML=html;
}
function loadOfficialReviews(){
  var html='';
  OFFICIAL_REVIEWS.slice(0,8).forEach(r=>{
    var badge=r.verified?'<span class="verified">✓ Verified</span>':'';
    html+='<div class="rev-item"><strong>'+r.name+badge+'</strong><div class="stars-sm">'+('★'.repeat(r.rating))+'</div>'+r.text+'<br/><span style="opacity:0.5;font-size:11px">'+r.time+'</span></div>';
  });
  document.getElementById('officialReviews').innerHTML=html;
}
loadReviews();
loadOfficialReviews();
ss(document.querySelectorAll('.pg-size-btn')[2],8,1978);
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