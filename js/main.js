// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Mobile Navigation Toggle
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ==========================================================================
       Sticky Navbar & Active Path Highlighting
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const navItems = document.querySelectorAll('.nav-link');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-link');

    // Sticky Navbar styling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting based on URL
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '') currentPath = 'index.html'; // Default to root

    const updateLinks = (items) => {
        items.forEach(link => {
            link.classList.remove('active');
            let itemHref = link.getAttribute('href');
            if (itemHref === currentPath || itemHref.endsWith(currentPath)) {
                link.classList.add('active');
            }
        });
    };

    updateLinks(navItems);
    updateLinks(mobileNavItems);

    /* ==========================================================================
       Contact Form Submission (FormSubmit AJAX)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';

            const formData = new FormData(contactForm);

            fetch('https://formsubmit.co/ajax/andrewanderleyporto@gmail.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'all';

                // Clear form
                contactForm.reset();

                // Show success toast
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            })
            .catch(error => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'all';
                alert('Erro ao enviar mensagem. Verifique a conexão ou tente novamente mais tarde.');
                console.error(error);
            });
        });
    }

    /* ==========================================================================
       Language & Theme Toggle Logic
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    const rootEl = document.documentElement;

    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Function to apply theme UI
    function applyTheme(theme) {
        if (theme === 'light') {
            rootEl.classList.add('light-mode');
            if(themeToggleBtn) {
                themeToggleBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                `;
            }
        } else {
            rootEl.classList.remove('light-mode');
            if(themeToggleBtn) {
                themeToggleBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                `;
            }
        }
    }

    // Apply initially
    applyTheme(savedTheme);

    // Toggle click handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = rootEl.classList.contains('light-mode');
            const newTheme = isLight ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Language Toggle Logic
    const langToggleBtn = document.getElementById('langToggle');

    // Check saved lang or default to pt
    const savedLang = localStorage.getItem('lang') || 'pt';

    // Function to apply lang UI flag and translate text
    function applyLang(lang) {
        if(langToggleBtn) {
            const imgEl = langToggleBtn.querySelector('img');
            if(imgEl) {
                if(lang === 'en') {
                    imgEl.src = 'https://flagcdn.com/w40/us.png';
                    imgEl.alt = 'English';
                } else {
                    imgEl.src = 'https://flagcdn.com/w40/br.png';
                    imgEl.alt = 'Português';
                }
            }
        }
        updateTranslations(lang);
    }

    // Function to update all text nodes with data-i18n
    function updateTranslations(lang) {
        if (!window.translations || !window.translations[lang]) return;
        const dict = window.translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = dict[key];
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });
    }

    // Apply initially
    applyLang(savedLang);

    // Toggle click handler
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('lang') || 'pt';
            const newLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('lang', newLang);
            applyLang(newLang);
        });
    }

});
