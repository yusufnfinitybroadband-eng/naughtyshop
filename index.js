const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Image URLs
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

const SHORT_DESCRIPTION = "🔥 Premium silicone extension sleeve with secure waist belt. Adds real size, girth & 10x stamina. Discreet delivery, COD available.";

const DETAILED_DESCRIPTION = `<div style="line-height:1.8;color:rgba(240,236,228,0.7)">
  <h3 style="color:#fff;margin-bottom:12px">📦 What You Get</h3>
  <ul style="list-style:none;margin-bottom:20px">
    <li style="margin-bottom:8px">✓ <strong>Medical-grade silicone</strong> extension sleeve — 100% body-safe, hypoallergenic</li>
    <li style="margin-bottom:8px">✓ <strong>Adjustable waist belt</strong> — Secure fit, no slipping during activity</li>
    <li style="margin-bottom:8px">✓ <strong>Realistic design</strong> — Anatomically shaped for maximum pleasure</li>
    <li style="margin-bottom:8px">✓ <strong>5 size options</strong> — 6" to 11" (choose what works for you)</li>
  </ul>

  <h3 style="color:#fff;margin-bottom:12px">💪 Performance Benefits</h3>
  <ul style="list-style:none;margin-bottom:20px">
    <li style="margin-bottom:8px">📏 Instantly adds <strong>real length & girth</strong> — visible difference</li>
    <li style="margin-bottom:8px">⚡ <strong>10x stamina enhancement</strong> — perform longer, every time</li>
    <li style="margin-bottom:8px">🔒 <strong>Hands-free performance</strong> — secure belt keeps everything in place</li>
    <li style="margin-bottom:8px">🎯 <strong>Confidence boost</strong> — feel bigger, perform better</li>
  </ul>

  <h3 style="color:#fff;margin-bottom:12px">🚚 Delivery & Privacy</h3>
  <ul style="list-style:none;margin-bottom:20px">
    <li style="margin-bottom:8px">📦 <strong>Plain, unmarked packaging</strong> — 100% discreet, no product name on box</li>
    <li style="margin-bottom:8px">⚡ <strong>Ships within 24 hours</strong> — fast delivery across India</li>
    <li style="margin-bottom:8px">💵 <strong>Cash on Delivery available</strong> — pay when you receive</li>
    <li style="margin-bottom:8px">↩️ <strong>7-day easy returns</strong> — if unopened, full refund</li>
  </ul>

  <h3 style="color:#fff;margin-bottom:12px">🧪 Material & Safety</h3>
  <p style="margin-bottom:16px">Made from premium <strong>medical-grade silicone</strong> that's been tested and approved for intimate use. Soft, flexible, and durable. Safe for all skin types.</p>

  <h3 style="color:#fff;margin-bottom:12px">💡 How to Use</h3>
  <ol style="margin-left:20px;margin-bottom:16px">
    <li>Slide the sleeve onto your anatomy</li>
    <li>Adjust waist belt for a secure, comfortable fit</li>
    <li>You're ready for enhanced performance!</li>
  </ol>

  <h3 style="color:#fff;margin-bottom:12px">❓ Size Guide</h3>
  <p><strong>6"</strong> — Compact, discreet | <strong>7"</strong> — Standard add-on | <strong>8"</strong> — Most popular choice ⭐ | <strong>9"</strong> — Premium size | <strong>11"</strong> — Maximum girth & length 💪</p>
</div>`;

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
.nav-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(192,0,26,0.4)}
.hero{position:relative;width:100%;height:480px;overflow:hidden;display:flex;align-items:center}
.hero-bg{position:absolute;inset:0;object-fit:cover}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,8,8,0.95) 0%,rgba(8,8,8,0.5) 50%,rgba(8,8,8,0) 100%)}
.hero-content{position:relative;z-index:2;padding:0 48px;max-width:620px}
.hero-title{font-size:64px;font-weight:900;color:#fff;margin-bottom:16px;text-shadow:0 4px 20px rgba(0,0,0,0.5)}
.hero-title span{background:linear-gradient(135deg,#ff0033,#ff6666);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-sub{font-size:16px;color:rgba(240,236,228,0.7);line-height:1.8;margin-bottom:32px}
.hero-buy-btn{background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:18px 48px;font-weight:800;cursor:pointer;border-radius:8px;box-shadow:0 6px 20px rgba(192,0,26,0.4)}
.pg-main{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(192,0,26,0.2)}
.pg-images{padding:32px;background:rgba(15,15,15,0.5);border-right:1px solid rgba(192,0,26,0.2);position:sticky;top:64px;height:fit-content}
.pg-carousel{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;border-radius:12px;background:#111;border:1px solid rgba(192,0,26,0.2);touch-action:pan-y}
.pg-main-img{width:100%;height:100%;object-fit:cover;cursor:grab}
.pg-thumbs{display:flex;gap:10px;margin-top:16px}
.pg-thumb{width:80px;height:80px;object-fit:cover;border-radius:8px;border:3px solid transparent;cursor:pointer;filter:brightness(0.7);transition:all 0.3s}
.pg-thumb.active{border-color:#ff0033;filter:brightness(1);box-shadow:0 4px 15px rgba(192,0,26,0.3)}
.pg-details{padding:36px 40px 60px;background:linear-gradient(135deg,rgba(15,15,15,0.8) 0%,rgba(20,10,10,0.6) 100%);overflow-y:auto;max-height:calc(100vh - 64px)}
.pg-price{font-size:44px;font-weight:900;color:#fff;margin:20px 0}
.pg-price-mrp{font-size:16px;color:rgba(240,236,228,0.25);text-decoration:line-through}
.pg-sizes{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0}
.pg-size-btn{padding:11px 20px;border-radius:8px;font-weight:700;cursor:pointer;border:2px solid rgba(192,0,26,0.3);background:transparent;color:rgba(240,236,228,0.6);transition:all 0.3s}
.pg-size-btn.active{border-color:#ff0033;color:#fff;background:linear-gradient(135deg,rgba(192,0,26,0.3),rgba(192,0,26,0.15))}
.pg-buy-btn{width:100%;padding:20px;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;font-size:17px;font-weight:900;cursor:pointer;border-radius:10px;margin-bottom:12px}
.pg-short-desc{font-size:15px;color:rgba(240,236,228,0.6);margin:20px 0;padding:16px;background:rgba(192,0,26,0.08);border-left:3px solid #ff0033;border-radius:4px}
.desc-toggle{color:#ff4444;cursor:pointer;font-weight:700;margin-top:12px;display:inline-block}
.pg-detailed-desc{display:none;margin:24px 0;padding:20px;background:rgba(192,0,26,0.05);border-radius:8px}
.pg-detailed-desc.show{display:block}
.pg-detailed-desc h3{font-size:16px;color:#fff;margin-bottom:12px}
.pg-detailed-desc ul li{margin-bottom:8px;color:rgba(240,236,228,0.6)}
.review-form{background:rgba(192,0,26,0.08);padding:20px;border-radius:10px;margin:24px 0;border:1px solid rgba(192,0,26,0.2)}
.review-form h3{color:#fff;margin-bottom:16px}
.review-input{width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(192,0,26,0.2);border-radius:6px;color:#fff;font-family:inherit;margin-bottom:12px;resize:vertical}
.review-input::placeholder{color:rgba(240,236,228,0.3)}
.review-rating{display:flex;gap:8px;margin-bottom:12px}
.star{font-size:28px;cursor:pointer;opacity:0.3;transition:opacity 0.2s}
.star.active{opacity:1}
.review-submit{width:100%;padding:12px;background:#ff0033;color:#fff;border:none;font-weight:700;border-radius:6px;cursor:pointer}
.reviews-list{margin-top:20px;max-height:300px;overflow-y:auto}
.review-item{background:rgba(192,0,26,0.05);padding:12px;border-radius:6px;margin-bottom:10px;font-size:13px;color:rgba(240,236,228,0.6)}
.review-item strong{color:#fff}
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
    <h2 style="font-size:24px;margin-bottom:8px">King Sleeve Pro</h2>
    <p style="font-size:13px;color:rgba(240,236,228,0.4);margin-bottom:16px">⭐⭐⭐⭐⭐ 4.8 (1,247 reviews) • COD Available • Free Shipping</p>
    
    <div class="pg-price-row" style="display:flex;gap:12px;align-items:baseline">
      <span class="pg-price" id="cp">₹${dp.toLocaleString('en-IN')}</span>
      <span class="pg-price-mrp" id="cm">₹${dm.toLocaleString('en-IN')}</span>
      <span style="color:#4ade80;font-weight:800" id="co">${dof}% off</span>
    </div>
    <div style="font-size:13px;color:#4ade80;margin-bottom:16px">💰 Pay online & get <strong>25% extra off</strong> → ₹<span id="pp">${dpr}</span></div>

    <div class="pg-short-desc">${SHORT_DESCRIPTION}</div>
    
    <a class="desc-toggle" onclick="toggleDesc()">📖 Read full details ↓</a>
    <div id="detailedDesc" class="pg-detailed-desc">${DETAILED_DESCRIPTION}</div>

    <label style="display:block;margin:20px 0;font-size:13px;font-weight:700">Size: <span id="sl" style="color:#ff0033">${sl}</span></label>
    <div class="pg-sizes">
      <button class="pg-size-btn" onclick="ss(this,6,1978)">6"</button>
      <button class="pg-size-btn" onclick="ss(this,7,1978)">7"</button>
      <button class="pg-size-btn active" onclick="ss(this,8,1978)">8"</button>
      <button class="pg-size-btn" onclick="ss(this,9,1978)">9"</button>
      <button class="pg-size-btn" onclick="ss(this,11,2749)">11"</button>
    </div>

    <button class="pg-buy-btn" onclick="goToCheckout()">🛒 Buy Now</button>

    <div class="review-form">
      <h3>✍️ Write a Review</h3>
      <div style="margin-bottom:12px">
        <label style="display:block;margin-bottom:8px;font-size:12px">Your Rating:</label>
        <div class="review-rating">
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
var FUSION_CHECKOUT='${FUSION_CHECKOUT}';
var mrps={6:3999,7:3999,8:3999,9:3999,11:5499};
var cs=parseInt(new URL(window.location).searchParams.get('size'))||8,cp=${dp},imgIdx=0,currentRating=0,touchStart=0,touchEnd=0;

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
function toggleDesc(){
  var desc=document.getElementById('detailedDesc');
  desc.classList.toggle('show');
}
function setRating(n){
  currentRating=n;
  document.querySelectorAll('.star').forEach((s,i)=>{s.classList.toggle('active',i<n)});
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
  document.querySelectorAll('.star').forEach(s=>s.classList.remove('active'));
  loadReviews();
}
function loadReviews(){
  var reviews=JSON.parse(localStorage.getItem('naughtyshop_reviews')||'[]');
  var html='';
  reviews.slice(0,5).forEach(r=>{
    html+='<div class="review-item"><strong>'+r.name+'</strong> '+('★'.repeat(r.rating))+'<br/>'+r.text+'<br/><span style="opacity:0.5;font-size:11px">'+r.time+'</span></div>';
  });
  document.getElementById('reviewsList').innerHTML=html;
}
loadReviews();
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