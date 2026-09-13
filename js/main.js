
/*=================================================
Loading
===================================================*/

$(window).on('load', function () {
    $("#loading").delay(3000).fadeOut('slow');
});



$(function () {
  // ===== NEWS Slick =====
$('.news-list').slick({
    centerMode: true,
    centerPadding: '80px',
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    arrows: false,

    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '60px',
                slidesToShow: 1,
            }
        },

        {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '35px',
                slidesToShow: 1,
            }
        }
    ]
});

  // 他のjsを追加したいときはここのラインから追加すること

//
/*=================================================
スムーススクロール
===================================================*/
  // ページ内のリンクをクリックした時に動作する
$(function () {
$('a[href^="#"]').click(function () {
    // クリックしたaタグのリンクを取得
    let href = $(this).attr("href");
    // ジャンプ先のid名をセット hrefの中身が#もしくは空欄なら,htmlタグをセット
    let target = $(href == "#" || href == "" ? "html" : href);
    // ページトップからジャンプ先の要素までの距離を取得
    let position = target.offset().top;
    // animateでスムーススクロールを行う   ページトップからpositionだけスクロールする
    // 600はスクロール速度で単位はミリ秒  swingはイージングのひとつ
    $("html, body").animate({ scrollTop:  position }, 1000, "swing");
    // urlが変化しないようにfalseを返す
    return false;
  });
});


/*=================================================
スマホ版のハンバーガーメニュー
===================================================*/

// $(function () {
//   // ハンバーガーメニューをクリックした時
//   $(".hamburger").on("click", function () {
//     $("header").toggleClass("open");
//   });
//   // ヘッダーに対してopenクラスを付与
//   // openクラスがついているときはopenクラスを削除
//   // toogleClassメソッドはその両方を行う

//   // メニューリンクまたは背景をクリックしたら閉じる
//   $(".nav-menu a, .mask").on("click", function () {
//     $("header").removeClass("open");
//   });
// });

$(function () {

/*=================================================
ハンバーガーメニュー
===================================================*/

$(".hamburger").on("click", function () {
    $("header").toggleClass("open");
});

  // メニューリンクまたは背景をクリックしたら閉じる
$(".nav-menu a").on("click", function () {
    $("header").removeClass("open");
});

});

// 

/*=================================================
Swiper + Timeline Heart
===================================================*/

const timelineHeart = document.getElementById("timelineHeart");
const timelineTrack = document.querySelector(".timeline-track");

let isDraggingHeart = false;
let targetProgress = 0;
let rafId = null;


// ==========================
// Swiper
// ==========================
const swiper = new Swiper(".js-launchSlider", {

    slidesPerView: "auto",
    centeredSlides: false,
    spaceBetween: 30,
    slidesOffsetBefore: 40,

    allowTouchMove: true,
    simulateTouch: true,

    freeMode: true,

    on: {

        // 最初のハート位置
        init: (s) => {
            updateHeartFromSwiper(s);
        },

        // 写真をドラッグしたらハートも動く
        progress: (s) => {

            // ハートを操作中はSwiper側からハートを動かさない
            if (isDraggingHeart) return;

            updateHeartFromSwiper(s);
        },

        resize: (s) => {
            updateHeartFromSwiper(s);
        }
    }
});


// ==========================
// Swiper → ハート
// ==========================
function updateHeartFromSwiper(swiperInstance) {

    if (!timelineHeart) return;

    let progress = swiperInstance.progress;

    // 0〜1の範囲に収める
    progress = Math.max(0, Math.min(progress, 1));

    timelineHeart.style.left = `${progress * 100}%`;
}


// ==========================
// ハート → Swiper
// ==========================
function updateSwiperFromHeart() {

    const minTranslate = swiper.minTranslate();
    const maxTranslate = swiper.maxTranslate();

    const translate =
        minTranslate +
        (maxTranslate - minTranslate) * targetProgress;

    swiper.setTranslate(translate);
    swiper.updateProgress(translate);

    rafId = null;
}


// ==========================
// ハートを押したとき
// ==========================
timelineHeart.addEventListener("pointerdown", (e) => {

    // 画像の標準ドラッグなどを防ぐ
    e.preventDefault();

    isDraggingHeart = true;

    timelineHeart.classList.add("is-dragging");

    // 押した瞬間の位置も反映
    moveHeart(e.clientX);
});


// ==========================
// ハートを動かす共通処理
// ==========================
function moveHeart(clientX) {

    const rect = timelineTrack.getBoundingClientRect();

    // タイムライン左端からの距離
    let x = clientX - rect.left;

    // タイムラインからはみ出さない
    x = Math.max(0, Math.min(x, rect.width));

    // 0〜1に変換
    targetProgress = x / rect.width;


    // ==========================
    // ハートを動かす
    // ==========================
    timelineHeart.style.left =
        `${targetProgress * 100}%`;


    // ==========================
    // Swiperを動かす
    // ==========================
    if (rafId === null) {

        rafId = requestAnimationFrame(
            updateSwiperFromHeart
        );
    }
}


// ==========================
// ドラッグ中
// windowでマウス位置を取得する
// ==========================
window.addEventListener("pointermove", (e) => {

    if (!isDraggingHeart) return;

    e.preventDefault();

    moveHeart(e.clientX);
});


// ==========================
// ハートを離したとき
// ==========================
window.addEventListener("pointerup", () => {

    if (!isDraggingHeart) return;

    isDraggingHeart = false;

    timelineHeart.classList.remove("is-dragging");

    updateHeartFromSwiper(swiper);
});


// ==========================
// ドラッグがキャンセルされたとき
// ==========================
window.addEventListener("pointercancel", () => {

    isDraggingHeart = false;

    timelineHeart.classList.remove("is-dragging");

    updateHeartFromSwiper(swiper);
});


// ==========================
// 画像そのもののドラッグを禁止
// ==========================
timelineHeart.addEventListener("dragstart", (e) => {
    e.preventDefault();
});
})