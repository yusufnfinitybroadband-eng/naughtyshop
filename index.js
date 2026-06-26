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

const CHECKOUT_BASE = `https://fusionprime.in/cart`;

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
html{scroll-behavior:smooth}
body{background:linear-gradient(135deg,#0a0a0a 0%,#1a0a0a 100%);color:#f0ece4;font-family:'Inter','-apple-system','BlinkMacSystemFont','Segoe UI',sans-serif;line-height:1.6}
.nav{background:rgba(8,8,8,0.98);backdrop-filter:blur(10px);padding:0 24px;border-bottom:1px solid rgba(192,0,26,0.3);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;height:64px;box-shadow:0 2px 20px rgba(192,0,26,0.1)}
.nav-logo{height:40px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))}
.nav-btn{background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:12px 28px;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;border-radius:6px;box-shadow:0 4px 15px rgba(192,0,26,0.3);transition:all 0.3s ease}
.nav-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(192,0,26,0.4)}
.hero{position:relative;width:100%;height:480px;overflow:hidden;display:flex;align-items:center}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;animation:zoomIn 0.8s ease}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,8,8,0.95) 0%,rgba(8,8,8,0.5) 50%,rgba(8,8,8,0) 100%)}
.hero-content{position:relative;z-index:2;padding:0 48px;max-width:620px}
.hero-eyebrow{font-size:12px;letter-spacing:0.15em;color:#ff4444;text-transform:uppercase;margin-bottom:16px;font-weight:700;animation:slideInLeft 0.8s ease 0.1s both}
.hero-title{font-size:64px;font-weight:900;line-height:1.05;color:#fff;margin-bottom:16px;animation:slideInLeft 0.8s ease 0.2s both;text-shadow:0 4px 20px rgba(0,0,0,0.5)}
.hero-title span{background:linear-gradient(135deg,#ff0033,#ff6666);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:16px;color:rgba(240,236,228,0.7);line-height:1.8;margin-bottom:32px;max-width:480px;animation:slideInLeft 0.8s ease 0.3s both}
.hero-buy-btn{background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:18px 48px;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;border-radius:8px;box-shadow:0 6px 20px rgba(192,0,26,0.4);transition:all 0.3s ease;animation:slideInLeft 0.8s ease 0.4s both}
.hero-buy-btn:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(192,0,26,0.5)}
.hero-trust{display:flex;gap:24px;margin-top:28px;flex-wrap:wrap;animation:slideInLeft 0.8s ease 0.5s both}
.hero-trust-item{font-size:12px;color:rgba(240,236,228,0.5);letter-spacing:0.05em;display:flex;align-items:center;gap:8px;font-weight:600}
.hero-trust-dot{width:6px;height:6px;background:linear-gradient(135deg,#ff0033,#c0001a);border-radius:50%;box-shadow:0 0 10px rgba(192,0,26,0.4)}
.pg-main{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(192,0,26,0.2);gap:0}
.pg-images{padding:32px;background:rgba(15,15,15,0.5);border-right:1px solid rgba(192,0,26,0.2);position:sticky;top:64px;height:fit-content;overflow:hidden}
.pg-carousel{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;border-radius:12px;background:#111;border:1px solid rgba(192,0,26,0.2);box-shadow:0 10px 40px rgba(0,0,0,0.5)}
.pg-main-img{width:100%;height:100%;object-fit:cover;cursor:grab;user-select:none}
.pg-main-img:active{cursor:grabbing}
.pg-thumbs{display:flex;gap:10px;margin-top:16px;overflow-x:auto;padding:4px}
.pg-thumb{width:80px;height:80px;object-fit:cover;border-radius:8px;border:3px solid transparent;cursor:pointer;background:#111;flex-shrink:0;transition:all 0.3s ease;filter:brightness(0.7)}
.pg-thumb:hover{filter:brightness(0.9)}
.pg-thumb.active{border-color:#ff0033;filter:brightness(1);box-shadow:0 4px 15px rgba(192,0,26,0.3)}
.pg-details{padding:36px 40px 60px;background:linear-gradient(135deg,rgba(15,15,15,0.8) 0%,rgba(20,10,10,0.6) 100%);overflow-y:auto;max-height:calc(100vh - 64px)}
.pg-badge-row{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.pg-badge{font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:6px 12px;border-radius:6px}
.pg-badge-bs{background:linear-gradient(135deg,rgba(192,0,26,0.2),rgba(192,0,26,0.1));color:#ff6666;border:1px solid rgba(192,0,26,0.4)}
.pg-badge-cod{background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.3);font-weight:700}
.pg-badge-free{background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);font-weight:700}
.pg-title{font-size:26px;font-weight:800;line-height:1.3;color:#fff;margin-bottom:14px;text-shadow:0 2px 8px rgba(0,0,0,0.3)}
.pg-rating-row{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.pg-stars{color:#f59e0b;font-size:16px;letter-spacing:2px}
.pg-rating-num{font-size:14px;color:#ff6666;font-weight:800}
.pg-review-count{font-size:12px;color:rgba(240,236,228,0.4);cursor:pointer;text-decoration:underline;font-weight:600;transition:color 0.3s}
.pg-review-count:hover{color:#ff6666}
.pg-divider{height:1px;background:linear-gradient(90deg,rgba(192,0,26,0.2),transparent);margin:18px 0}
.pg-price-label{font-size:11px;color:rgba(240,236,228,0.4);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;font-weight:700}
.pg-price-row{display:flex;align-items:baseline;gap:14px;margin-bottom:6px;flex-wrap:wrap}
.pg-price{font-size:44px;font-weight:900;color:#fff;text-shadow:0 2px 10px rgba(192,0,26,0.3)}
.pg-price-mrp{font-size:16px;color:rgba(240,236,228,0.25);text-decoration:line-through;font-weight:600}
.pg-price-off{font-size:16px;color:#4ade80;font-weight:800;background:rgba(34,197,94,0.1);padding:4px 10px;border-radius:4px}
.pg-prepaid-note{background:linear-gradient(135deg,rgba(34,197,94,0.1),rgba(34,197,94,0.05));border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:12px 16px;font-size:13px;color:rgba(240,236,228,0.7);margin-top:12px;line-height:1.7}
.pg-prepaid-note strong{color:#4ade80;font-weight:800}
.pg-size-label{font-size:13px;font-weight:700;color:#fff;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.05em}
.pg-size-label span{color:rgba(240,236,228,0.5);font-weight:600}
.pg-sizes{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}
.pg-size-btn{padding:11px 20px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;border:2px solid rgba(192,0,26,0.3);background:transparent;color:rgba(240,236,228,0.6);font-family:inherit;transition:all 0.3s ease;text-transform:uppercase;letter-spacing:0.05em}
.pg-size-btn:hover{border-color:#ff0033;color:#ff0033;background:rgba(192,0,26,0.05)}
.pg-size-btn.active{border-color:#ff0033;color:#fff;background:linear-gradient(135deg,rgba(192,0,26,0.3),rgba(192,0,26,0.15));box-shadow:0 4px 15px rgba(192,0,26,0.2)}
.pg-buy-btn{width:100%;padding:20px;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;font-size:17px;font-weight:900;text-transform:uppercase;cursor:pointer;border-radius:10px;font-family:inherit;letter-spacing:0.08em;margin-bottom:12px;box-shadow:0 6px 20px rgba(192,0,26,0.3);transition:all 0.3s ease}
.pg-buy-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(192,0,26,0.4)}
.pg-buy-note{text-align:center;font-size:12px;color:rgba(240,236,228,0.35);margin-bottom:24px}
.pg-delivery-box{background:linear-gradient(135deg,rgba(192,0,26,0.08),rgba(10,10,10,0.5));border:1px solid rgba(192,0,26,0.2);border-radius:10px;padding:16px 18px;margin-bottom:20px;backdrop-filter:blur(5px)}
.pg-delivery-row{display:flex;align-items:flex-start;gap:12px;padding:8px 0;font-size:12px;color:rgba(240,236,228,0.6);line-height:1.6;font-weight:600}
.pg-delivery-row:not(:last-child){border-bottom:1px solid rgba(192,0,26,0.1)}
.pg-delivery-row strong{color:#fff;font-weight:700}
.pg-features-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.pg-feature-card{background:linear-gradient(135deg,rgba(192,0,26,0.1),rgba(10,10,10,0.5));border:1px solid rgba(192,0,26,0.15);border-radius:8px;padding:14px;display:flex;align-items:flex-start;gap:10px;transition:all 0.3s ease}
.pg-feature-card:hover{border-color:#ff0033;background:linear-gradient(135deg,rgba(192,0,26,0.15),rgba(10,10,10,0.6))}
.pg-feature-icon{font-size:20px;flex-shrink:0}
.pg-feature-text{font-size:11px;color:rgba(240,236,228,0.5);line-height:1.6}
.pg-feature-text strong{color:#fff;display:block;font-size:13px;margin-bottom:2px}
.pg-desc-title{font-size:13px;font-weight:800;color:#fff;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.05em}
.pg-desc-list{list-style:none;display:flex;flex-direction:column;gap:9px}
.pg-desc-list li{display:flex;gap:11px;font-size:12px;color:rgba(240,236,228,0.6);line-height:1.6;font-weight:500}
.pg-desc-list li::before{content:"✓";color:#4ade80;font-weight:900;flex-shrink:0;font-size:14px}
.rv-section{background:linear-gradient(135deg,#0a0a0a 0%,#1a0a0a 100%);border-top:1px solid rgba(192,0,26,0.2);padding:56px 40px}
.rv-header{display:flex;align-items:flex-start;gap:56px;margin-bottom:48px;flex-wrap:wrap}
.rv-score-block{text-align:center;min-width:140px;background:rgba(192,0,26,0.1);border:1px solid rgba(192,0,26,0.2);border-radius:12px;padding:20px;backdrop-filter:blur(5px)}
.rv-score-num{font-size:72px;font-weight:900;color:#fff;line-height:1;text-shadow:0 4px 15px rgba(192,0,26,0.3)}
.rv-score-stars{color:#f59e0b;font-size:24px;margin:10px 0;letter-spacing:3px}
.rv-score-count{font-size:12px;color:rgba(240,236,228,0.4);font-weight:700}
.rv-bars{flex:1;min-width:220px;display:flex;flex-direction:column;gap:10px}
.rv-bar-row{display:flex;align-items:center;gap:12px;font-size:12px;color:rgba(240,236,228,0.45);font-weight:600}
.rv-bar-track{flex:1;height:8px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;border:1px solid rgba(192,0,26,0.1)}
.rv-bar-fill{height:100%;background:linear-gradient(90deg,#ff0033,#c0001a);border-radius:4px}
.rv-bar-pct{width:32px;text-align:right;font-size:12px;color:rgba(240,236,228,0.3);font-weight:700}
.rv-title-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid rgba(192,0,26,0.2);flex-wrap:wrap;gap:12px}
.rv-title{font-size:20px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.05em}
.rv-page-info{font-size:13px;color:rgba(240,236,228,0.35);font-weight:600}
.rv-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}
.rv-card{background:linear-gradient(135deg,rgba(192,0,26,0.08),rgba(10,10,10,0.5));border:1px solid rgba(192,0,26,0.15);border-radius:10px;padding:18px;transition:all 0.3s ease;backdrop-filter:blur(5px)}
.rv-card:hover{border-color:#ff0033;background:linear-gradient(135deg,rgba(192,0,26,0.12),rgba(10,10,10,0.6));transform:translateY(-2px)}
.rv-top{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
.rv-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,rgba(192,0,26,0.3),rgba(192,0,26,0.1));border:2px solid rgba(192,0,26,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#ff4444;flex-shrink:0;font-style:italic}
.rv-meta{flex:1;min-width:0}
.rv-name-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px}
.rv-name{font-size:13px;font-weight:700;color:#fff}
.rv-verified{font-size:10px;color:#4ade80;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);padding:3px 8px;border-radius:4px;font-weight:700;white-space:nowrap}
.rv-time{font-size:11px;color:rgba(240,236,228,0.2);flex-shrink:0;white-space:nowrap}
.rv-stars-sm{color:#f59e0b;font-size:12px;letter-spacing:1px}
.rv-text{font-size:13px;color:rgba(240,236,228,0.65);line-height:1.7;font-weight:500}
.rv-pagination{display:flex;align-items:center;justify-content:center;gap:14px}
.rv-pg-btn{background:rgba(192,0,26,0.1);border:1px solid rgba(192,0,26,0.2);color:#f0ece4;padding:12px 28px;font-size:13px;font-weight:700;cursor:pointer;border-radius:8px;font-family:inherit;transition:all 0.3s ease;text-transform:uppercase;letter-spacing:0.05em}
.rv-pg-btn:hover:not(:disabled){border-color:#ff0033;color:#ff0033;background:rgba(192,0,26,0.15)}
.rv-pg-btn:disabled{opacity:0.25;cursor:not-allowed}
.rv-pg-dots{display:flex;gap:8px}
.rv-pg-dot{width:10px;height:10px;border-radius:50%;background:rgba(192,0,26,0.2);cursor:pointer;border:none;transition:all 0.3s ease}
.rv-pg-dot:hover{background:rgba(192,0,26,0.4)}
.rv-pg-dot.active{background:linear-gradient(135deg,#ff0033,#c0001a);box-shadow:0 0 12px rgba(192,0,26,0.4)}
.pg-mobile-cta{display:none;position:fixed;bottom:0;left:0;right:0;background:linear-gradient(180deg,rgba(8,8,8,0.95),rgba(8,8,8,0.98));border-top:1px solid rgba(192,0,26,0.3);padding:14px 16px;z-index:99;flex-direction:column;gap:8px;backdrop-filter:blur(10px)}
.pg-mobile-price-row{display:flex;align-items:center;gap:12px}
.pg-mobile-price{font-size:24px;font-weight:900;color:#fff}
.pg-mobile-mrp{font-size:13px;color:rgba(240,236,228,0.3);text-decoration:line-through}
.pg-mobile-off{font-size:12px;color:#4ade80;font-weight:800;background:rgba(34,197,94,0.1);padding:3px 8px;border-radius:4px}
.pg-mobile-buy-btn{width:100%;background:linear-gradient(135deg,#ff0033,#c0001a);color:#fff;border:none;padding:16px;font-size:15px;font-weight:900;text-transform:uppercase;cursor:pointer;border-radius:10px;font-family:inherit;letter-spacing:0.08em;box-shadow:0 4px 15px rgba(192,0,26,0.3)}
.pg-footer{background:linear-gradient(135deg,#000,#0a0a0a);border-top:1px solid rgba(192,0,26,0.2);padding:24px 40px;display:flex;justify-content:space-between;font-size:11px;color:rgba(240,236,228,0.18);font-weight:600}
@keyframes zoomIn{from{transform:scale(1.05);opacity:0.8}to{transform:scale(1);opacity:1}}
@keyframes slideInLeft{from{transform:translateX(-30px);opacity:0}to{transform:translateX(0);opacity:1}}
@media(max-width:768px){
  .hero{height:360px;padding:0 20px}.hero-content{padding:0}.hero-title{font-size:44px}.hero-sub{font-size:15px}.hero-buy-btn{padding:14px 32px;font-size:13px}
  .pg-main{grid-template-columns:1fr}.pg-images{position:static;border-right:none;border-bottom:1px solid rgba(192,0,26,0.2);padding:20px}
  .pg-carousel{aspect-ratio:3/4}.pg-thumb{width:70px;height:70px}
  .pg-details{padding:20px 20px 120px}
  .pg-title{font-size:20px}
  .pg-price{font-size:36px}
  .pg-buy-btn{display:none}.pg-buy-note{display:none}.pg-mobile-cta{display:flex}
  .nav-btn{display:none}
  .pg-features-grid{grid-template-columns:1fr}
  .pg-sizes{gap:8px}
  .pg-size-btn{padding:9px 16px;font-size:12px}
  .rv-section{padding:32px 16px}
  .rv-grid{grid-template-columns:1fr}
  .rv-header{gap:24px}
  .pg-footer{flex-direction:column;gap:8px;text-align:center;font-size:10px}
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
    <div class="hero-eyebrow">🔥 New Launch • Discreet Delivery 🔥</div>
    <h1 class="hero-title">King Sleeve <span>Pro</span></h1>
    <p class="hero-sub">Instantly add real size, girth & 10x stamina. Medical-grade silicone with secure waist belt.</p>
    <button class="hero-buy-btn" onclick="document.getElementById('ps').scrollIntoView({behavior:'smooth'})">Shop Now ↓</button>
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
    <div class="pg-carousel" id="carousel" ontouchstart="handleTouchStart(event)" ontouchmove="handleTouchMove(event)" ontouchend="handleTouchEnd(event)">
      <img id="mainImg" class="pg-main-img" src="${IMG1}" alt="King Sleeve Pro"/>
    </div>
    <div class="pg-thumbs" id="thumbs">
      <img class="pg-thumb active" src="${IMG1}" onclick="switchImg(this, 0)" alt="v1"/>
      <img class="pg-thumb" src="${IMG2}" onclick="switchImg(this, 1)" alt="v2"/>
      <img class="pg-thumb" src="${IMG3}" onclick="switchImg(this, 2)" alt="v3"/>
    </div>
  </div>
  <div class="pg-details">
    <div class="pg-badge-row">
      <span class="pg-badge pg-badge-bs">★ Bestseller</span>
      <span class="pg-badge pg-badge-cod">COD Available</span>
      <span class="pg-badge pg-badge-free">Free Shipping</span>
    </div>
    <h1 class="pg-title">King Sleeve Pro</h1>
    <p style="font-size:13px;color:rgba(240,236,228,0.5);margin-bottom:14px">Silicone Extension Sleeve with Waist Belt</p>
    <div class="pg-rating-row">
      <span class="pg-stars">★★★★★</span>
      <span class="pg-rating-num">4.8</span>
      <span class="pg-review-count" onclick="document.getElementById('rv').scrollIntoView({behavior:'smooth'})">(1,247 reviews)</span>
    </div>
    <div class="pg-divider"></div>
    <div class="pg-price-label">Price</div>
    <div class="pg-price-row">
      <span class="pg-price" id="cp">₹${dp.toLocaleString('en-IN')}</span>
      <span class="pg-price-mrp" id="cm">₹${dm.toLocaleString('en-IN')}</span>
      <span class="pg-price-off" id="co">${dof}% off</span>
    </div>
    <div class="pg-prepaid-note">💰 Pay online & get <strong>25% extra off</strong> → <strong id="pp">₹${dpr.toLocaleString('en-IN')}</strong></div>
    <div class="pg-divider"></div>
    <div class="pg-size-label">Size: <span id="sl">${sl}</span></div>
    <div class="pg-sizes">
      <button class="pg-size-btn" onclick="ss(this,6,1978)">6"</button>
      <button class="pg-size-btn" onclick="ss(this,7,1978)">7"</button>
      <button class="pg-size-btn active" onclick="ss(this,8,1978)">8"</button>
      <button class="pg-size-btn" onclick="ss(this,9,1978)">9"</button>
      <button class="pg-size-btn" onclick="ss(this,11,2749)">11"</button>
    </div>
    <button class="pg-buy-btn" onclick="goToCheckout()">🛒 Buy Now</button>
    <div class="pg-buy-note">COD & Online Payment both available at checkout</div>
    <div class="pg-delivery-box">
      <div class="pg-delivery-row">📦 <div><strong>Plain Packaging</strong> — 100% discreet.</div></div>
      <div class="pg-delivery-row">⚡ <div><strong>Free Delivery</strong> — Ships within 24 hrs.</div></div>
      <div class="pg-delivery-row">💵 <div><strong>Cash on Delivery</strong> — Pay when you receive.</div></div>
      <div class="pg-delivery-row">↩️ <div><strong>Easy Returns</strong> — 7-day return if unopened.</div></div>
    </div>
    <div class="pg-features-grid">
      <div class="pg-feature-card"><span class="pg-feature-icon">📏</span><div class="pg-feature-text"><strong>Real Size</strong>Length & girth</div></div>
      <div class="pg-feature-card"><span class="pg-feature-icon">⚡</span><div class="pg-feature-text"><strong>10x Stamina</strong>Longer sessions</div></div>
      <div class="pg-feature-card"><span class="pg-feature-icon">🔒</span><div class="pg-feature-text"><strong>Secure Belt</strong>No slipping</div></div>
      <div class="pg-feature-card"><span class="pg-feature-icon">✓</span><div class="pg-feature-text"><strong>Medical Grade</strong>Body safe</div></div>
    </div>
    <div class="pg-divider"></div>
    <div class="pg-desc-title">Why Choose Us?</div>
    <ul class="pg-desc-list">
      <li>Life-like anatomical design</li>
      <li>Available in 6" to 11" sizes</li>
      <li>Adjustable secure waist belt</li>
      <li>Premium medical-grade silicone</li>
      <li>Plain, unmarked packaging</li>
      <li>Fast discreet delivery</li>
    </ul>
  </div>
</div>
<div class="rv-section" id="rv">
  <div class="rv-header">
    <div class="rv-score-block"><div class="rv-score-num">4.8</div><div class="rv-score-stars">★★★★★</div><div class="rv-score-count">1,247 Ratings</div></div>
    <div class="rv-bars">
      <div class="rv-bar-row">5★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:74%"></div></div><span class="rv-bar-pct">74%</span></div>
      <div class="rv-bar-row">4★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:16%"></div></div><span class="rv-bar-pct">16%</span></div>
      <div class="rv-bar-row">3★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:5%;background:#666"></div></div><span class="rv-bar-pct">5%</span></div>
      <div class="rv-bar-row">2★ <div class="rv-bar-track"><div class="rv-bar-fill" style="width:3%;background:#555"></div></div><span class="rv-bar-pct">3%</span></div>
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
<div class="pg-footer"><span>© 2025 NaughtyShop. All rights reserved.</span><span>🔒 100% Private & Discreet</span></div>
<div class="pg-mobile-cta">
  <div class="pg-mobile-price-row">
    <span class="pg-mobile-price" id="mp">₹${dp.toLocaleString('en-IN')}</span>
    <span class="pg-mobile-mrp" id="mm">₹${dm.toLocaleString('en-IN')}</span>
    <span class="pg-mobile-off" id="mo">${dof}% off</span>
  </div>
  <button class="pg-mobile-buy-btn" onclick="goToCheckout()">🛒 Buy Now</button>
</div>
<script>
var IMGS=['${IMG1}','${IMG2}','${IMG3}'];
var VIDS={6:'45973012250703',7:'45973012316239',8:'45973012349007',9:'45973017002063',11:'45973017034831'};
var SHOP='https://fusionprime.in';
var RV=${JSON.stringify(REVIEWS)};
var mrps={6:3999,7:3999,8:3999,9:3999,11:5499};
var pop={8:" (Most Popular)",11:" (Biggest Size)"};
var cs=8,cp=${dp},imgIdx=0;
var PP=6,pg=1,tp=Math.ceil(RV.length/PP);
var touchStart=0,touchEnd=0;
function handleTouchStart(e){touchStart=e.changedTouches[0].clientX}
function handleTouchMove(e){e.preventDefault()}
function handleTouchEnd(e){
  touchEnd=e.changedTouches[0].clientX;
  var diff=touchStart-touchEnd;
  if(Math.abs(diff)>50){
    if(diff>0 && imgIdx<IMGS.length-1){imgIdx++;switchImg(document.querySelectorAll('.pg-thumb')[imgIdx],imgIdx)}
    else if(diff<0 && imgIdx>0){imgIdx--;switchImg(document.querySelectorAll('.pg-thumb')[imgIdx],imgIdx)}
  }
}
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
function switchImg(t,idx){
  document.querySelectorAll('.pg-thumb').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  imgIdx=idx;
  document.getElementById('mainImg').src=IMGS[idx];
}
function goToCheckout(){window.location.href=SHOP+'/cart/'+VIDS[cs]+':1'}
function sh(n){return '★'.repeat(n)+'☆'.repeat(5-n)}
function rr(){
  var s=(pg-1)*PP,e=Math.min(s+PP,RV.length),h='';
  for(var i=s;i<e;i++){var r=RV[i];var v=r.verified?'<span class="rv-verified">✓ Verified</span>':'';h+='<div class="rv-card"><div class="rv-top"><div class="rv-avatar">'+r.name[0]+'</div><div class="rv-meta"><div class="rv-name-row"><span class="rv-name">'+r.name+'</span>'+v+'</div><div class="rv-stars-sm">'+sh(r.rating)+'</div></div><div class="rv-time">'+r.time+'</div></div><p class="rv-text">'+r.text+'</p></div>'}
  document.getElementById('rg').innerHTML=h;
  document.getElementById('rpi').textContent='Page '+pg+' of '+tp;
  document.getElementById('rpb').disabled=pg===1;
  document.getElementById('rnb').disabled=pg===tp;
  var d='';for(var p=1;p<=tp;p++)d+='<button class="rv-pg-dot'+(p===pg?' active':'')+'" onclick="gp('+p+')"></button>';
  document.getElementById('rd').innerHTML=d;
}
function cp2(dir){var n=pg+dir;if(n<1||n>tp)return;pg=n;rr();document.getElementById('rv').scrollIntoView({behavior:'smooth'})}
function gp(p){pg=p;rr();document.getElementById('rv').scrollIntoView({behavior:'smooth'})}
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