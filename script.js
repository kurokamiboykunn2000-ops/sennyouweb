// ===== DOM要素 =====
const nav = document.querySelector('.nav');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const scrollTopBtn = document.getElementById('scrollTop');
const ruleCards = document.querySelectorAll('.rule-card');
const faqCards = document.querySelectorAll('.faq-card');

// ===== ナビゲーション =====
// ハンバーガーメニュー
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // メニューリンククリックで閉じる
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// スクロール時のナビゲーション
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== 統計カウンターアニメーション =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer でカウンター開始
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            entry.target.dataset.counted = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statObserver.observe(stat);
});

// ===== ルールアコーディオン =====
ruleCards.forEach(card => {
    const header = card.querySelector('.rule-header');
    
    header.addEventListener('click', () => {
        // 他のカードを閉じる
        ruleCards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('active')) {
                otherCard.classList.remove('active');
            }
        });

        // クリックされたカードをトグル
        card.classList.toggle('active');

        // スムーズスクロール（アクティブになった場合のみ）
        if (card.classList.contains('active')) {
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    });
});

// ===== FAQ アコーディオン =====
faqCards.forEach(card => {
    const question = card.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // 他のFAQを閉じる
        faqCards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('active')) {
                otherCard.classList.remove('active');
            }
        });

        // クリックされたFAQをトグル
        card.classList.toggle('active');
    });
});

// ===== スムーズスクロール =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== トップに戻るボタン =====
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== パーティクル背景 =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(88, 101, 242, 0.8), transparent);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
            pointer-events: none;
        `;

        particlesContainer.appendChild(particle);
    }
}

// パーティクルアニメーション用CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
        }
    }
`;
document.head.appendChild(particleStyle);

// パーティクル生成
createParticles();

// ===== スクロールアニメーション =====
const scrollElements = document.querySelectorAll('.rule-card, .faq-card, .stat-card');

const elementInView = (el, offset = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
};

const displayScrollElement = (element) => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
};

const hideScrollElement = (element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            displayScrollElement(el);
        }
    });
};

// 初期状態設定
scrollElements.forEach(el => {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    hideScrollElement(el);
});

// スクロールイベント
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation(); // 初期チェック

// ===== キーボードショートカット =====
document.addEventListener('keydown', (e) => {
    // Escapeキーで全て閉じる
    if (e.key === 'Escape') {
        ruleCards.forEach(card => card.classList.remove('active'));
        faqCards.forEach(card => card.classList.remove('active'));
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Ctrl+Homeでトップへ
    if (e.ctrlKey && e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ===== マウスカーソルエフェクト（デスクトップのみ） =====
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            width: 25px;
            height: 25px;
            border: 2px solid rgba(88, 101, 242, 0.6);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            transition: all 0.15s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        }
        
        .custom-cursor.hover {
            transform: translate(-50%, -50%) scale(1.5);
            background: rgba(88, 101, 242, 0.2);
            border-color: rgba(235, 69, 158, 0.8);
        }

        .custom-cursor.click {
            transform: translate(-50%, -50%) scale(0.8);
        }
    `;
    document.head.appendChild(cursorStyle);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // ホバー可能な要素
    const hoverElements = document.querySelectorAll('a, button, .rule-header, .faq-question');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // クリック時
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

// ===== スクロールプログレスバー =====
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px var(--glow-primary);
    }
`;
document.head.appendChild(progressStyle);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ===== ボタンリップルエフェクト =====
document.querySelectorAll('.hero-btn, .cta-btn, .nav-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===== 外部リンクの処理 =====
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ===== パフォーマンス最適化 =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// リサイズ処理
const handleResize = debounce(() => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250);

window.addEventListener('resize', handleResize);

// ===== ローディング完了 =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // コンソールメッセージ
    console.log('%c🎮 フォートナイト取引サーバー', 
        'color: #5865F2; font-size: 28px; font-weight: bold; text-shadow: 0 0 10px rgba(88, 101, 242, 0.8);');
    console.log('%c✨ ルールを守って楽しく取引しよう！', 
        'color: #EB459E; font-size: 16px; font-weight: bold;');
    console.log('%c🔥 Made with ❤️ for Fortnite Community', 
        'color: #57F287; font-size: 14px;');
});

// ===== イースターエッグ =====
let clickCount = 0;
const logo = document.querySelector('.nav-brand');

if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount === 5) {
            const celebration = document.createElement('div');
            celebration.textContent = '🎉 隠し要素発見！ 🎉';
            celebration.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 3rem;
                font-weight: bold;
                color: var(--text);
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                padding: 2rem 4rem;
                border-radius: 20px;
                z-index: 10000;
                animation: popIn 0.5s ease;
                box-shadow: 0 20px 60px var(--glow-primary);
            `;
            
            document.body.appendChild(celebration);
            
            setTimeout(() => {
                celebration.style.animation = 'popOut 0.5s ease';
                setTimeout(() => celebration.remove(), 500);
            }, 2000);
            
            clickCount = 0;
        }
    });
}

const easterEggStyle = document.createElement('style');
easterEggStyle.textContent = `
    @keyframes popIn {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes popOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
        }
    }
`;
document.head.appendChild(easterEggStyle);

// ===== Visibility API（タブ切り替え時） =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '🔴 戻ってきて！ | フォートナイト取引';
    } else {
        document.title = '🎮 フォートナイト取引サーバー | 公式ガイドライン';
    }
});

// ===== 初期化メッセージ =====
console.log('%cシステム初期化完了 ✓', 'color: #57F287; font-size: 14px; font-weight: bold;');
