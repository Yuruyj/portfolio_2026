document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Update Year (自動更新年份) ---
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // --- 2. Mobile Menu Logic (手機版選單) ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        if (!mobileMenu) return;
        const isOpen = mobileMenu.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : ''; // 防止背景捲動
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // --- 3. Scroll Reveal Animation (捲動出現動畫) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- 4. 核心功能：導航滑動與內容切換 (整合版) ---
    // 這段程式碼負責：1. 滑動亮點位置 2. 切換下方顯示的內容 3. 處理從首頁跳轉過來的 Hash
    
    const navItems = document.querySelectorAll('.nav-item-bt');
    const highlight = document.getElementById('sliding-highlight-bt');
    
    // 假設你的內容區塊有統一的 class (例如 .tab-content) 或者是直接透過 ID 抓取
    // 為了通用性，這裡建議你確保你的內容區塊有 id="ux", id="ui-ux", id="visual"
    // 並且這三個區塊都在同一個父層容器下
    
    if (highlight && navItems.length > 0) {

        // A. 更新亮點位置的函式
        function updateHighlight(element) {
            const offsetLeft = element.offsetLeft;
            const width = element.offsetWidth;
            highlight.style.transform = `translateX(${offsetLeft}px)`;
            highlight.style.width = `${width}px`;
        }

        // B. 切換頁籤的主要邏輯
        function activateTab(targetLink) {
            // 1. 處理導覽列樣式 (移除舊的，加上新的)
            navItems.forEach(nav => nav.classList.remove('active-bt'));
            targetLink.classList.add('active-bt');
            
            // 2. 移動亮點
            updateHighlight(targetLink);

            // 3. 處理內容切換 (根據 href="#ux" 抓取 id="ux")
            const targetId = targetLink.getAttribute('href').substring(1); // 取得 id 名稱
            
            // 先隱藏所有可能的內容區塊 (這裡假設你有給內容區塊一個共同 class 叫 .tab-content)
            // 如果沒有共同 class，你可以手動列出所有可能的 ID
            const allContents = document.querySelectorAll('#ux, #ui-ux, #visual, .tab-content'); 
            allContents.forEach(section => {
                section.style.display = 'none'; // 或者移除 active class
                section.classList.remove('active-content');
            });

            // 顯示目標區塊
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block'; // 或者加上 active class
                targetSection.classList.add('active-content');
                
                // 讓畫面捲動到內容頂端 (可選)
                // targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // C. 綁定點擊事件
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // 防止頁面直接跳轉，改由 JS 控制
                activateTab(item);
                
                // 更新網址 Hash (方便使用者分享連結，且不觸發頁面刷新)
                const hash = item.getAttribute('href');
                history.pushState(null, null, hash);
            });
        });

        // D. 視窗大小改變時，重新計算亮點位置
        window.addEventListener('resize', () => {
            const currentActive = document.querySelector('.nav-item-bt.active-bt');
            if (currentActive) updateHighlight(currentActive);
        });

        // --- E. 關鍵初始化邏輯 (解決你的問題) ---
        // 頁面載入時，檢查網址 Hash
        function init() {
            const currentHash = window.location.hash; // 取得網址上的 #ux
            let startTab = null;

            // 1. 如果有 Hash，嘗試找到對應的按鈕
            if (currentHash) {
                startTab = document.querySelector(`.nav-item-bt[href="${currentHash}"]`);
            }

            // 2. 如果沒有 Hash 或找不到，就用預設的第一個
            if (!startTab) {
                startTab = navItems[0];
            }

            if (startTab) {
                // 暫時關閉動畫，避免初始載入時的「飛入」效果
                highlight.style.transition = 'none';
                
                // 執行切換
                activateTab(startTab);

                // 稍微延遲後把動畫開回來
                setTimeout(() => {
                    highlight.style.transition = ''; 
                }, 100);
            }
        }

        // 執行初始化
        // 使用 setTimeout 0 確保 DOM 渲染完成後才計算寬度
        setTimeout(init, 0);
    }
});