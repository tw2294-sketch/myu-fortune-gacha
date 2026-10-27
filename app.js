// ミューの今日の運勢ガチャ
// 仕様: 日本時間の日付をシードにして、その日の運勢を決める（誰が開いても同じ日に同じ結果）。
// 1日1回は端末側の記録（localStorage）でも担保する。日付が変われば再び引ける。
(function () {
"use strict";

function todayJST() {
return new Intl.DateTimeFormat("en-CA", {
timeZone: "Asia/Tokyo",
year: "numeric",
month: "2-digit",
day: "2-digit"
}).format(new Date());
}

function hashCode(str) {
var h = 0;
for (var i = 0; i < str.length; i++) {
h = (h * 31 + str.charCodeAt(i)) | 0;
}
return Math.abs(h);
}

function fortuneFor(dateStr) {
var list = window.FORTUNES;
return list[hashCode("myu-fortune-" + dateStr) % list.length];
}

var today = todayJST();
var key = "myu-fortune-drawn";
var drawnDate = null;
try {
drawnDate = window.localStorage.getItem(key);
} catch (e) {
drawnDate = null;
}

var drawBtn = document.getElementById("drawBtn");
var note = document.getElementById("note");
var card = document.getElementById("card");
var copied = document.getElementById("copied");

document.getElementById("heroImg").src = window.MYU_IMAGES.wave;

function showCard() {
var f = fortuneFor(today);
document.getElementById("cardImg").src = window.MYU_IMAGES[f.image];
document.getElementById("rank").textContent = f.rank;
document.getElementById("message").textContent = f.message;
document.getElementById("luckyItem").textContent = f.luckyItem;
document.getElementById("luckyColor").textContent = f.luckyColor;
document.getElementById("advice").textContent = "ミューからのひとこと：" + f.advice;
card.classList.remove("hidden");
return f;
}

function lockButton() {
drawBtn.disabled = true;
drawBtn.textContent = "今日の運勢は表示中です";
note.textContent = "日付が変わると、また引けます。";
}

if (drawnDate === today) {
showCard();
lockButton();
}

drawBtn.addEventListener("click", function () {
if (drawBtn.disabled) return;
drawBtn.classList.add("shake");
drawBtn.disabled = true;
window.setTimeout(function () {
drawBtn.classList.remove("shake");
showCard();
try {
window.localStorage.setItem(key, today);
} catch (e) {
// localStorageが使えない環境では、その日の固定結果のみで続行する
}
lockButton();
}, 1100);
});

document.getElementById("shareBtn").addEventListener("click", function () {
var f = fortuneFor(today);
var text =
"" + today + "\n" +
"運勢：" + f.rank + "\n" +
f.message + "\n" +
"ラッキーアイテム：" + f.luckyItem + "／ラッキーカラー：" + f.luckyColor;
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(text).then(function () {
copied.textContent = "コピーしました。";
}, function () {
copied.textContent = "コピーできませんでした。";
});
} else {
copied.textContent = "このブラウザではコピーに未対応です。";
}
});
})();
