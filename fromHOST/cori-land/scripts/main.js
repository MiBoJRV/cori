document.addEventListener('DOMContentLoaded', function () {

    // Video loading functionality
    initVideoLoading();

    // logo scrollers
    const scrollers = document.querySelectorAll(".scroller");

    // Если пользователь не выбрал уменьшенное движение, добавляем анимацию
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // добавляем data-animated="true" ко всем элементам .scroller на странице
            scroller.setAttribute("data-animated", true);

            // создаем массив из элементов внутри .scroller-inner
            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            // Для каждого элемента в массиве клонируем его и добавляем три копии
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem.cloneNode(true)); // первая копия
            });
        });
    }







//mobile menu
const buttonMobileMenu = document.querySelector('.button-mobile-menu');
const mobileContent = document.querySelector('.mobile-content');
const mobileMenuLinks = document.querySelectorAll('.mobile-content a');

let isMobileMenuOpen = false;

// Функція для відкриття/закриття мобільного меню
function toggleMobileMenu() {
    if (mobileContent) {
        mobileContent.classList.toggle('open');
        document.body.style.overflow = mobileContent.classList.contains('open') ? 'hidden' : '';
    }
}

// Обробник кліку на кнопку мобільного меню
if (buttonMobileMenu) {
    buttonMobileMenu.addEventListener('click', function () {
        toggleMobileMenu();
        buttonMobileMenu.classList.toggle('open');
    });
}

// Обробник кліку на посилання в мобільному меню
if (mobileMenuLinks.length > 0) {
    mobileMenuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            toggleMobileMenu();
            if (buttonMobileMenu) {
                buttonMobileMenu.classList.remove('open');
            }
            document.body.style.overflow = ''; // Забираємо overflow: hidden
        });
    });
}

    /*Tabs*/

        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');
                activateTab(tabId);
            });
        });

        function activateTab(tabId) {
            tabBtns.forEach(btn => {
                btn.classList.remove('active');
            });

            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
            const activeContent = document.getElementById(tabId);

            activeBtn.classList.add('active');
            activeContent.classList.add('active');
        }

        // Activate the first tab by default
        // activateTab(tabBtns[0].getAttribute('data-tab'));


    /*Accordion*/

        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion_arr');

            header.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');

                // Закриття всіх інших відкритих секцій
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('open')) {
                        otherItem.classList.remove('open');
                        otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                        // Зміна іконки плюса на мінус
                        otherItem.querySelector('.accordion_arr').setAttribute('src', 'images/plus.svg');
                    }
                });

                if (!isOpen) {
                    // Відкриття поточної секції
                    item.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    // Зміна іконки плюса на мінус
                    icon.setAttribute('src', 'images/minus.svg');
                } else {
                    // Закриття поточної секції
                    item.classList.remove('open');
                    content.style.maxHeight = '0';
                    // Зміна іконки мінуса на плюс
                    icon.setAttribute('src', 'images/plus.svg');
                }
            });
        });

    // --------------- SWIPER ДЛЯ ВІДГУКІВ ---------------
    const reviewsSwiper = new Swiper('.review-items.swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            991: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            1350: {
                slidesPerView: 'auto',
                spaceBetween: 0
            }
        }
    });

    const reviewsSwiperMobile = new Swiper('.review-items-mobile.swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            991: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            1350: {
                slidesPerView: 'auto',
                spaceBetween: 0
            }
        }
    });

    const newsSwiperElement = document.querySelector('.news-swiper');
    if (newsSwiperElement) {
        const newsSwiper = new Swiper('.news-swiper', {
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            speed: 600,
            spaceBetween: 24,
            slidesPerView: 3,
            pagination: { el: '.news-swiper .swiper-pagination', clickable: true },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 12
                },
                576: {
                    slidesPerView: 1,
                    spaceBetween: 14
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 16
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 24
                }
            }
        });
    }

    // --------------- IMAGE SLIDER ---------------
    const imageSliderElement = document.querySelector('.image-slider');
    if (imageSliderElement) {
        const imageSlider = new Swiper('.image-slider', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            speed: 800,
            spaceBetween: 0,
            slidesPerView: 'auto',
            centeredSlides: false,
            allowTouchMove: true,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            breakpoints: {
                0: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                480: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                1200: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                1400: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                }
            }
        });
    }

    // --------------- COOKIE BANNER ---------------
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptAllCookiesBtn = document.getElementById('acceptAllCookies');
    const closeCookiesBtn = document.getElementById('closeCookies');
    
    function checkCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent && cookieBanner) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
    }
    
    function acceptAllCookies() {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
        }
    }
    
    function closeCookies() {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
    }
    
    if (acceptAllCookiesBtn) {
        acceptAllCookiesBtn.addEventListener('click', acceptAllCookies);
    }
    
    if (closeCookiesBtn) {
        closeCookiesBtn.addEventListener('click', closeCookies);
    }
    
    checkCookieConsent();

    // --------------- TESTIMONIALS SLIDER ---------------
    const testimonialsData = [
        {
            top: {
                client: "Client: Hidden, City: Toronto",
                case: "Case No. 321/23-B — \"Cryptocurrency margin trading fraud.\"",
                text: "\"I was completely lost after my trading account got wiped out by fake margin calls. The team at CORI took over my case and handled everything with real professionalism. They managed to recover about $73,000 CAD, which I never thought was possible. I'd trust them again in a heartbeat.\""
            },
            bottom: {
                client: "Client: Hidden, City: Vancouver",
                case: "Case No. 114/24-A — \"Fake withdrawal fees requested to release funds.\"",
                text: "\"My broker kept asking me to pay 'commissions' before releasing my money. That's when I reached out to The Canadian Office for Recovery & Integrity. They exposed the scam and helped me get back nearly $26,000 CAD within a few weeks. They stayed in touch and explained every step clearly.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Edmonton",
                case: "Case No. 207/25-C — \"Frozen exchange account\"",
                text: "\"My crypto account was locked for months, and customer support just ignored me. CORI contacted the platform directly and got my $34,000 CAD released. They kept me updated the whole way and never made empty promises.\""
            },
            bottom: {
                client: "Client: Hidden, City: Calgary",
                case: "Case No. 089/24-D — \"Crypto scam involving fake investment platforms.\"",
                text: "\"I put money into what looked like a real crypto project — turned out it was a total scam. CORI traced the transactions and got back roughly $80,000 CAD. I honestly didn't expect any recovery at all, but they pulled it off.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Ottawa",
                case: "Case No. 450/23-E — \"Forex scam by unlicensed offshore brokers.\"",
                text: "\"I thought I was trading with a licensed forex company, but it turned out to be offshore. The Canadian Office for Recovery & Integrity confirmed the truth and helped me recover $27,000 CAD. They know exactly how these operations work and how to deal with them.\""
            },
            bottom: {
                client: "Client: Hidden, City: Winnipeg",
                case: "Case No. 302/25-F — \"Ponzi-type investment scheme.\"",
                text: "\"I joined an 'investment club' that guaranteed weekly profits. It collapsed like a typical Ponzi scheme. MBK filed a joint action and I personally got back $68,500 CAD. They were honest and transparent from start to finish.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Halifax",
                case: "Case No. 176/24-G — \"Phishing and identity theft — stolen login credentials.\"",
                text: "\"My crypto login was stolen through a fake email asking for verification. CORI reacted quickly and recovered about $10,000 CAD. They even helped me tighten my security afterward. Fast, friendly, and efficient.\""
            },
            bottom: {
                client: "Client: Hidden, City: Hamilton",
                case: "Case No. 523/24-H — \"Crypto scam — fake trading platform.\"",
                text: "\"I was scammed by what looked like a professional crypto trading website. Everything seemed legit at first — live charts, support chat, even fake account managers. CORI reviewed my case, tracked where the money went, and helped me recover about $6,000 CAD. They were straightforward, responsive, and didn't make empty promises.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Kingston",
                case: "Case No. 244/25-J — \"Romance scam — crypto and gift-card money transfers.\"",
                text: "\"I sent around $42,000 CAD to someone I met online. The Canadian Office for Recovery & Integrity treated me with kindness and professionalism, traced the crypto wallets, and supported me through the process. They helped me recover more than I expected.\""
            },
            bottom: {
                client: "Client: Hidden, City: Mississauga",
                case: "Case No. 061/25-K — \"Online marketplace fraud — fake listings on Marketplace.\"",
                text: "\"I paid about $6,000 CAD for a laptop on Facebook Marketplace that never arrived. CORI helped me gather the right evidence and get my refund through the bank. The process was smooth and way faster than I expected.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Surrey",
                case: "Case No. 398/24-L — \"Social media investment scam — fraudulent promo accounts.\"",
                text: "\"I followed a so-called crypto mentor on Instagram who convinced me to invest. CORI investigated, took down the fake profile, and helped me recover around $20,000 CAD. They handled the case with real care.\""
            },
            bottom: {
                client: "Client: Hidden, City: Burnaby",
                case: "Case No. 287/23-M — \"Tech support scam — impersonating Microsoft/security staff.\"",
                text: "\"A fake Microsoft warning popped up on my computer, and I ended up losing about $7,000 CAD. CORI worked directly with my bank and helped reverse most of it. They never judged me and explained everything patiently.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Richmond",
                case: "Case No. 133/25-N — \"Unauthorized bank transfers / funds diversion.\"",
                text: "\"I woke up to see several wire transfers I never made — over $14,000 CAD gone. The Canadian Office for Recovery & Integrity worked with my bank and the authorities, and within three weeks, my money was back. I truly appreciated how they kept me informed through it all.\""
            },
            bottom: {
                client: "Client: Hidden, City: Victoria",
                case: "Case No. 415/24-P — \"Account takeover — hijacked exchange credentials.\"",
                text: "\"My exchange account was hacked, and about $19,000 CAD disappeared overnight. CORI helped verify my identity, file the complaint, and recover the funds. They were calm, professional, and always quick to reply.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Brampton",
                case: "Case No. 209/25-Q — \"Fake ICO\"",
                text: "\"I invested roughly $13,000 CAD in a new crypto token that vanished the next day. CORI followed the blockchain trail and managed to recover most of it. I'm honestly impressed with how deep they go into the technical side.\""
            },
            bottom: {
                client: "Client: Hidden, City: Kitchener",
                case: "Case No. 074/24-R — \"Dark-web laundering through crypto channels.\"",
                text: "\"My stolen crypto was funneled through multiple anonymous wallets. CORI worked with blockchain investigators and helped me recover close to $30,000 CAD. Their report was solid enough for the police to open a full case.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: London",
                case: "Case No. 350/23-S — \"Gift-card fraud — funds converted via retail gift codes.\"",
                text: "\"I was tricked into buying about $5,500 CAD in gift cards for 'account verification'. CORI contacted the stores directly and blocked most of the codes before they were used. They saved me a lot of money and stress.\""
            },
            bottom: {
                client: "Client: Hidden, City: Saskatoon",
                case: "Case No. 192/25-T — \"SIM-swap attack — mobile number hijacked, wallet access lost.\"",
                text: "\"My SIM card was cloned, and scammers drained nearly $34,000 CAD from my wallet. CORI coordinated with my mobile provider and the exchange to get my account restored. The whole process was handled with incredible precision.\""
            }
        },
        {
            top: {
                client: "Client: Hidden, City: Regina",
                case: "Case No. 421/24-U — \"Impersonation fraud — posing as bank or government official.\"",
                text: "\"I got a call from someone claiming to be my bank's fraud department and ended up transferring over $12,000 CAD. The Canadian Office for Recovery & Integrity stepped in, contacted the bank's fraud team, and recovered the funds. They made a stressful situation feel manageable.\""
            },
            bottom: {
                client: "Client: Hidden, City: St. John's",
                case: "Case No. 058/25-V — \"Successful chargeback recovery from fraudulent purchase.\"",
                text: "\"I lost $8,900 CAD on a fake investment course. CORI prepared all the documentation and won the chargeback dispute. Everything was handled professionally and without pressure — I truly recommend them.\""
            }
        }
    ];

    let currentTestimonialIndex = 0;
    let autoPlayInterval;
    let isAutoPlayActive = true;

    function updateTestimonials() {
        const topSlide = document.querySelector('.testimonials-slide-top .testimonial-card');
        const bottomSlide = document.querySelector('.testimonials-slide-bottom .testimonial-card');
        
        if (topSlide && bottomSlide) {
            const currentData = testimonialsData[currentTestimonialIndex];
            
            const topClientText = currentData.top.client.replace('Client: Hidden, City: ', 'Client: Hidden (') + ')';
            const bottomClientText = currentData.bottom.client.replace('Client: Hidden, City: ', 'Client: Hidden (') + ')';
            
            topSlide.querySelector('.testimonial-client').textContent = topClientText;
            topSlide.querySelector('.testimonial-case').textContent = currentData.top.case;
            topSlide.querySelector('.testimonial-text').textContent = currentData.top.text;
            
            bottomSlide.querySelector('.testimonial-client').textContent = bottomClientText;
            bottomSlide.querySelector('.testimonial-case').textContent = currentData.bottom.case;
            bottomSlide.querySelector('.testimonial-text').textContent = currentData.bottom.text;
        }
    }

    function nextTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialsData.length;
        updateTestimonials();
    }

    function prevTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialsData.length) % testimonialsData.length;
        updateTestimonials();
    }

    function startAutoPlay() {
        if (isAutoPlayActive) {
            autoPlayInterval = setInterval(nextTestimonial, 5000);
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function handleUserInteraction() {
        isAutoPlayActive = false;
        stopAutoPlay();
    }

    const prevBtn = document.querySelector('.testimonials-btn-prev');
    const nextBtn = document.querySelector('.testimonials-btn-next');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            handleUserInteraction();
            prevTestimonial();
        });

        nextBtn.addEventListener('click', () => {
            handleUserInteraction();
            nextTestimonial();
        });
    }

    updateTestimonials();
    startAutoPlay();

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (answer) {
            answer.setAttribute('aria-hidden', item.classList.contains('active') ? 'false' : 'true');
        }

        function animateHeight(element, toHeight) {
            const fromHeight = element.offsetHeight; // current rendered height
            element.style.maxHeight = fromHeight + 'px';
            // force reflow
            void element.offsetHeight;
            element.style.maxHeight = toHeight + 'px';
        }

        function closeItem(target) {
            const panel = target.querySelector('.faq-answer');
            if (!panel) return;
            const fullHeight = panel.scrollHeight;
            // If currently set to 'none', set to measured height first to enable transition
            if (panel.style.maxHeight === 'none' || panel.style.maxHeight === '') {
                panel.style.maxHeight = fullHeight + 'px';
            }
            requestAnimationFrame(() => {
                target.classList.remove('active');
                animateHeight(panel, 0);
                panel.setAttribute('aria-hidden', 'true');
            });
        }

        function openItem(target) {
            const panel = target.querySelector('.faq-answer');
            if (!panel) return;
            // Start from current state, ensure a numeric height to transition from
            const current = panel.style.maxHeight;
            if (current === 'none' || current === '') {
                panel.style.maxHeight = '0px';
            }
            target.classList.add('active');
            requestAnimationFrame(() => {
                const to = panel.scrollHeight;
                animateHeight(panel, to);
                panel.setAttribute('aria-hidden', 'false');
            });
        }

        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close others first to reduce layout thrash
                faqItems.forEach(other => {
                    if (other !== item && other.classList.contains('active')) {
                        closeItem(other);
                    }
                });

                if (isActive) {
                    closeItem(item);
                } else {
                    openItem(item);
                }
            });
        }

        if (answer) {
            answer.addEventListener('transitionend', (e) => {
                if (e.propertyName !== 'max-height') return;
                if (item.classList.contains('active')) {
                    // Let the panel auto-size after expanding to avoid future jumps on content changes
                    answer.style.maxHeight = 'none';
                } else {
                    answer.style.maxHeight = '0px';
                }
            });
        }
    });

    // Image loading functionality
    function initVideoLoading() {
        const image = document.querySelector('.gif');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const progressBar = document.getElementById('progressBar');
        const loadingPercentage = document.getElementById('loadingPercentage');

        if (!image || !loadingOverlay || !progressBar || !loadingPercentage) {
            return;
        }

        let progress = 0;
        let loadingInterval;

        // Simulate realistic loading progress
        function updateProgress() {
            progress += Math.random() * 15 + 5; // Random increment between 5-20%
            
            if (progress > 100) {
                progress = 100;
            }

            progressBar.style.width = progress + '%';
            loadingPercentage.textContent = Math.round(progress) + '%';

            // Complete loading when image is ready
            if (image.complete && progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                    }, 300);
                }, 500);
            }
        }

        // Start loading animation
        loadingInterval = setInterval(updateProgress, 200);

        // Handle image events
        image.addEventListener('load', () => {
            console.log('Image loading completed');
            progress = 100;
            progressBar.style.width = '100%';
            loadingPercentage.textContent = '100%';
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }, 500);
        });

        image.addEventListener('error', () => {
            console.error('Image loading error');
            clearInterval(loadingInterval);
            loadingOverlay.style.display = 'none';
        });

        // Fallback: hide loading after 3 seconds regardless
        setTimeout(() => {
            if (loadingOverlay.style.display !== 'none') {
                clearInterval(loadingInterval);
                progress = 100;
                progressBar.style.width = '100%';
                loadingPercentage.textContent = '100%';
                
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                    }, 300);
                }, 500);
            }
        }, 3000);
    }

});