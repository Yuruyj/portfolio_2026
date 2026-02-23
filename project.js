// 1. 返回上一頁或回列表
function goBackOrHome() {
    // 1. 執行返回上一頁
    history.back();
    
    // 2. 防呆機制：如果上一頁真的回不去 (例如沒有歷史紀錄)
    // 頁面就不會切換，這時候 100 毫秒後就會強制執行下方的跳轉
    // 反之，如果 history.back() 成功了，離開了此頁面，這段 setTimeout 就會被銷毀，不會執行。
    setTimeout(function() {
        window.location.href = 'work.html';
    }, 100);
}
// --- 燈箱與放大功能 (整合重複邏輯) ---
// 將 lightbox 和 zoom 抽離成共用函式，符合 DRY (Don't Repeat Yourself) 原則
const toggleModal = (modalId, imgSrcId, src, activeClass = 'active') => {
    const modal = document.getElementById(modalId);
    if (!modal) return; // 避免找不到 DOM 節點時報錯
    
    if (src) {
        // 開啟狀態
        const img = document.getElementById(imgSrcId);
        if (img) img.src = src;
        modal.classList.add(activeClass);
        document.body.style.overflow = 'hidden';
    } else {
        // 關閉狀態
        modal.classList.remove(activeClass);
        document.body.style.overflow = '';
    }
};

// 一般燈箱操作 (使用可選串連 ?. 避免沒有 img 標籤時報錯)
const openLightbox = (element) => toggleModal('lightbox', 'lightbox-img', element.querySelector('img')?.src);
const closeLightbox = () => toggleModal('lightbox', null, null);

// 特殊放大燈箱操作
const initiateZoom = (element) => toggleModal('overlay-viewer', 'overlay-img-target', element.querySelector('img')?.src, 'is-active-mode');
const dismissZoom = () => toggleModal('overlay-viewer', null, null, 'is-active-mode');

// --- PDF 預覽功能 ---
const openPDF = (githubUrl) => {
    const modal = document.getElementById('pdf-modal');
    const frame = document.getElementById('pdf-frame');
    if (!modal || !frame) return;

    // 將 GitHub 網址轉成 Raw 網址
    const rawUrl = githubUrl.includes('github.com') 
        ? githubUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
        : githubUrl;

    frame.src = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(rawUrl)}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 建議開啟 PDF 時也鎖定背景滾動
};

const closePDF = (event) => {
    // 支援 ESC 關閉 (沒有 event) 或是點擊背景/關閉按鈕
    if (!event || event.target.id === 'pdf-modal' || event.target.classList.contains('close-btn')) {
        const modal = document.getElementById('pdf-modal');
        const frame = document.getElementById('pdf-frame');
        
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = ''; // 恢復背景滾動
        
        if (frame) {
            setTimeout(() => { frame.src = ""; }, 300);
        }
    }
};

// --- 全域事件監聽 (整合 ESC 關閉功能) ---
// 將原本分散的 keydown 事件合併成一個，提升效能並避免重複觸發
document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        // 判斷目前哪個視窗是開啟的，就關閉對應的視窗
        if (document.getElementById('lightbox')?.classList.contains('active')) closeLightbox();
        if (document.getElementById('overlay-viewer')?.classList.contains('is-active-mode')) dismissZoom();
        if (document.getElementById('pdf-modal')?.classList.contains('active')) closePDF();
    }
});
