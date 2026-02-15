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

// function openPDF(githubUrl) {
//             const modal = document.getElementById('pdf-modal');
//             const frame = document.getElementById('pdf-frame');
            
//             // --- 自動網址轉換魔法 (GitHub -> jsDelivr) ---
//             // 讓瀏覽器可以預覽而不是下載
//             let finalUrl = githubUrl;
            
//             // 檢查是否為 GitHub 網址
//             if (githubUrl.includes('github.com')) {
//                 // 將 "github.com/user/repo/blob/branch/file" 
//                 // 轉換為 "cdn.jsdelivr.net/gh/user/repo@branch/file"
//                 finalUrl = githubUrl
//                     .replace('github.com', 'cdn.jsdelivr.net/gh')
//                     .replace('/blob/', '@');
//             }
            
//             // 設定 iframe 並顯示
//             frame.src = finalUrl;
//             modal.classList.add('active');
//         }

//         function closePDF(event) {
//             if (event.target.id === 'pdf-modal' || event.target.classList.contains('close-btn')) {
//                 const modal = document.getElementById('pdf-modal');
//                 const frame = document.getElementById('pdf-frame');
                
//                 modal.classList.remove('active');
//                 setTimeout(() => { frame.src = ""; }, 300); 
//             }
//         }