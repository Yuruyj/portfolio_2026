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

// 開啟燈箱
function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // 獲取被點擊卡片內的圖片來源
    const src = element.querySelector('img').src;
    
    lightboxImg.src = src;
    lightbox.classList.add('active');
    
    // 鎖定背景滾動
    document.body.style.overflow = 'hidden';
}

// 關閉燈箱
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    
    // 恢復背景滾動
    document.body.style.overflow = '';
}

// 鍵盤 ESC 關閉支援
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeLightbox();
    }
        });

// 函數名稱也改得比較特殊一點
function initiateZoom(element) {
    const overlay = document.getElementById('overlay-viewer');
    const targetImg = document.getElementById('overlay-img-target');
    const src = element.querySelector('img').src;
    
    targetImg.src = src;
    overlay.classList.add('is-active-mode');
    document.body.style.overflow = 'hidden';
}

function dismissZoom() {
    const overlay = document.getElementById('overlay-viewer');
    overlay.classList.remove('is-active-mode');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        dismissZoom();
    }
});

function openPDF(githubUrl) {
    const modal = document.getElementById('pdf-modal');
    const frame = document.getElementById('pdf-frame');
    
    // 步驟 1：將一般的 GitHub 網址轉成 "Raw" (原始檔案) 網址
    // 輸入：https://github.com/user/repo/blob/main/file.pdf
    // 目標：https://raw.githubusercontent.com/user/repo/main/file.pdf
    
    let rawUrl = githubUrl;
    
    if (githubUrl.includes('github.com')) {
        rawUrl = githubUrl
            .replace('github.com', 'raw.githubusercontent.com')
            .replace('/blob/', '/'); // 移除 blob 路徑
    }

    // 步驟 2：使用 Google Docs Viewer 來預覽該 Raw 連結
    // 這是目前最穩定的 PDF 嵌入方式
    const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(rawUrl)}`;
    
    // 設定並顯示
    frame.src = viewerUrl;
    modal.classList.add('active');
}

function closePDF(event) {
    if (event.target.id === 'pdf-modal' || event.target.classList.contains('close-btn')) {
        const modal = document.getElementById('pdf-modal');
        const frame = document.getElementById('pdf-frame');
        
        modal.classList.remove('active');
        setTimeout(() => { frame.src = ""; }, 300); 
    }
}
