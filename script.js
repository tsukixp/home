document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        });
    }

    // ===== CURSOR CUSTOMIZADO =====
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
        const interactiveElements = document.querySelectorAll('a, button, .burger, .gallery-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseover', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseout', () => cursorOutline.classList.remove('hover'));
        });
    }

    // ===== NAVEGAÇÃO MOBILE =====
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');
        if (burger && nav) {
            burger.addEventListener('click', () => {
                nav.classList.toggle('nav-active');
                navLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = '';
                    } else {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
                    }
                });
                burger.classList.toggle('toggle');
            });
        }
    }
    navSlide();

    // ===== LÓGICA DO LIVRO DE REGRAS =====
    const prevBtn = document.querySelector("#prev-btn");
    const nextBtn = document.querySelector("#next-btn");
    const book = document.querySelector("#book");
    const papers = [
        document.querySelector("#p1"),
        document.querySelector("#p2"),
        document.querySelector("#p3")
    ];
    if (prevBtn && nextBtn && book) { // Verifica se os elementos existem
        prevBtn.addEventListener("click", goPrevPage);
        nextBtn.addEventListener("click", goNextPage);
        let currentLocation = 1;
        const maxLocation = papers.length + 1;
        prevBtn.disabled = true;

        function openBook() {
            book.style.transform = "translateX(50%)";
            prevBtn.style.transform = "translateX(-180px)";
            nextBtn.style.transform = "translateX(180px)";
        }
        function closeBook(isAtBeginning) {
            const transformValue = isAtBeginning ? "translateX(0%)" : "translateX(100%)";
            book.style.transform = transformValue;
            prevBtn.style.transform = "translateX(0px)";
            nextBtn.style.transform = "translateX(0px)";
        }
        function goNextPage() {
            if (currentLocation < maxLocation) {
                if (currentLocation === 1) openBook();
                papers[currentLocation - 1].classList.add("flipped");
                papers[currentLocation - 1].style.zIndex = currentLocation;
                if (currentLocation === maxLocation - 1) closeBook(false);
                currentLocation++;
                updateButtons();
            }
        }
        function goPrevPage() {
            if (currentLocation > 1) {
                currentLocation--;
                if (currentLocation === 1) closeBook(true);
                papers[currentLocation - 1].classList.remove("flipped");
                papers[currentLocation - 1].style.zIndex = papers.length - (currentLocation - 1);
                if (currentLocation < maxLocation - 1) openBook();
                updateButtons();
            }
        }
        function updateButtons() {
            prevBtn.disabled = currentLocation === 1;
            nextBtn.disabled = currentLocation === maxLocation;
        }
    }


    // ===== FUNCIONALIDADE DE COPIAR COMANDO =====
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    function showCopySuccess(button) {
        const icon = button.querySelector('i');
        button.classList.add('copied');
        icon.classList.remove('fa-copy');
        icon.classList.add('fa-check');
        setTimeout(() => {
            button.classList.remove('copied');
            icon.classList.remove('fa-check');
            icon.classList.add('fa-copy');
        }, 2000);
    }

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const commandToCopy = button.dataset.command;
            
            // Método moderno (preferencial)
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(commandToCopy)
                    .then(() => showCopySuccess(button))
                    .catch(err => console.error('Falha ao copiar com API moderna: ', err));
            } else {
                // Método reserva (fallback) para ambientes não seguros (http, file://)
                const textArea = document.createElement("textarea");
                textArea.value = commandToCopy;
                textArea.style.position = "absolute";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showCopySuccess(button);
                } catch (err) {
                    console.error('Falha ao copiar com método reserva: ', err);
                }
                document.body.removeChild(textArea);
            }
        });
    });

    // ===== ANIMAÇÃO DE SCROLL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const elementsToAnimate = document.querySelectorAll('.section-title, .schedule-day, .book-container, .gallery-item, .command-card, .social-icon');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // ===== LÓGICA DO LIGHTBOX DA GALERIA =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').getAttribute('src');
                lightboxImg.setAttribute('src', imgSrc);
                lightbox.classList.add('active');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            // Limpa o src após a transição para não carregar imagem desnecessariamente
            setTimeout(() => {
                lightboxImg.setAttribute('src', '');
            }, 400);
        };

        // Fechar clicando no 'X'
        lightboxClose.addEventListener('click', closeLightbox);

        // Fechar clicando fora da imagem (no fundo)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // ===== INICIALIZAÇÃO DO VANILLA TILT =====
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15, speed: 400, glare: true, "max-glare": 0.3
        });
    }
});