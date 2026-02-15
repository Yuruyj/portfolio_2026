document.addEventListener('DOMContentLoaded', () => {
    // 1. Update Year (加入防呆)
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    // --- 1. 滑動底線邏輯 (Active Line) ---
    const marker = document.getElementById('nav-marker');
    const navLinks = document.querySelectorAll('.nav-links a');

    function indicator(e) {
        // e 是當前的 HTML 元素
        marker.style.left = e.offsetLeft + "px";
        marker.style.width = e.offsetWidth + "px";
    }

    // 初始化：找到目前有 .active 的連結並移動線條
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink && marker) {
        indicator(activeLink);
    }

    // 點擊事件監聽
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 移除所有 active
            navLinks.forEach(l => l.classList.remove('active'));
            // 點擊的加上 active
            e.currentTarget.classList.add('active');
            // 移動線條
            indicator(e.currentTarget);
        });
    });

    // --- 2. Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : ''; // 防止背景捲動
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    // 點擊手機版連結後，自動關閉選單
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // --- 3. (Optional) Resize 監聽 ---
    // 當視窗大小改變時，重新計算底線位置 (因為文字可能會換行或間距改變)
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-links a.active');
        if (currentActive && marker) {
            indicator(currentActive);
        }
    });

    // // 2. Mobile Menu Logic (加入變數檢查)
    // const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    // const closeMenuBtn = document.getElementById('close-menu-btn');
    // const mobileMenu = document.getElementById('mobile-menu');
    // const mobileLinks = document.querySelectorAll('.mobile-link');

    // // 確保關鍵元素都存在才執行
    // if (mobileMenuBtn && mobileMenu) {
    //     function toggleMenu() {
    //         const isOpen = mobileMenu.classList.toggle('open');
    //         // 鎖定背景捲動
    //         document.body.style.overflow = isOpen ? 'hidden' : '';
    //     }

    //     mobileMenuBtn.addEventListener('click', toggleMenu);
        
    //     // 只有當關閉按鈕存在時才監聽 (有些設計沒有獨立關閉按鈕)
    //     if (closeMenuBtn) {
    //         closeMenuBtn.addEventListener('click', toggleMenu);
    //     }

    //     mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    // }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    // 檢查瀏覽器是否支援 IntersectionObserver
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // 如果希望動畫只跑一次，可以在這裡停止觀察：
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 4. 頁籤切換 (優化邏輯：同時切換按鈕與內容)
    // 假設 HTML 結構：<button class="tab" data-target="#content1">
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. 移除所有 tab 的 active
            // 找到父層容器，確保只影響同一組頁籤
            const parent = tab.parentElement; 
            parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // 2. 自己加上 active
            tab.classList.add('active');

            // 3. 切換內容 (如果有設定 data-target)
            const targetSelector = tab.getAttribute('data-target');
            if (targetSelector) {
                // 隱藏所有內容
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none'; // 或移除 active class
                });
                // 顯示對應內容
                const targetContent = document.querySelector(targetSelector);
                if (targetContent) {
                    targetContent.style.display = 'block'; // 或加上 active class
                }
            }
        });
    });
});