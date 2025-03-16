let isMagicActive = false;
const particlesContainer = document.createElement('div');
particlesContainer.className = 'magic-particles-global';
document.body.appendChild(particlesContainer);

const PARTICLES_PER_TICK = 5; 
const FALL_DURATION = 3000; 
let animationFrameId = null;

function createFallingParticle(x, headerBottom) {
    const particle = document.createElement('div');
    particle.className = 'magic-particle';
    particle.style.cssText = `
      left: ${x}px;
      top: ${headerBottom}px;
      background-color: hsl(${Math.random() * 360}, 70%, 50%);
    `;
    particlesContainer.appendChild(particle);

    const startTime = performance.now();

    function animateFall(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / FALL_DURATION, 1);

        const fallDistance = window.innerHeight - headerBottom + 50;
        particle.style.transform = `translateY(${progress * fallDistance}px)`;
        particle.style.opacity = 1 - progress;

        if (progress < 1) {
            requestAnimationFrame(animateFall);
        } else {
            particle.remove();
        }
    }

    requestAnimationFrame(animateFall);
}

function spawnParticlesFromHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    const headerRect = header.getBoundingClientRect();
    const headerBottom = headerRect.bottom;
    const headerWidth = headerRect.width;

    for (let i = 0; i < PARTICLES_PER_TICK; i++) {
        const x = headerRect.left + Math.random() * headerWidth;
        createFallingParticle(x, headerBottom);
    }
}

function animateParticles(timestamp) {
    if (isMagicActive) {
        spawnParticlesFromHeader();
    }
    animationFrameId = requestAnimationFrame(animateParticles);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!isMagicActive) {
            isMagicActive = true;
            animationFrameId = requestAnimationFrame(animateParticles);
        }
    } else if (e.key === 'Escape') {
        isMagicActive = false;
        cancelAnimationFrame(animationFrameId);
        particlesContainer.innerHTML = '';
    }
});

const heroImage = document.querySelector('.hero img');
let heroParticlesContainer = null; 

if (heroImage) {
    heroParticlesContainer = document.createElement('div');
    heroParticlesContainer.className = 'magic-particles';
    heroParticlesContainer.style.cssText = `
      position: absolute;
      pointer-events: none;
    `;
    document.body.appendChild(heroParticlesContainer);

    heroImage.addEventListener('mouseover', () => {
        heroImage.style.transition = 'transform 0.3s ease';
        heroImage.style.transform = 'scale(1.1)';
        createHeroParticles(heroImage); 
    });

    heroImage.addEventListener('mouseout', () => {
        heroImage.style.transform = 'scale(1)';
    });

    function updateHeroContainerPosition() {
        const rect = heroImage.getBoundingClientRect();
        heroParticlesContainer.style.left = `${rect.left}px`;
        heroParticlesContainer.style.top = `${rect.top}px`;
        heroParticlesContainer.style.width = `${rect.width}px`;
        heroParticlesContainer.style.height = `${rect.height}px`;
    }

    updateHeroContainerPosition();
    window.addEventListener('resize', updateHeroContainerPosition); 
}

function createHeroParticles(image) {
    const rect = image.getBoundingClientRect();

    heroParticlesContainer.innerHTML = '';

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.cssText = `
        left: ${Math.random() * rect.width}px;
        top: ${Math.random() * rect.height}px;
        background-color: hsl(${Math.random() * 360}, 70%, 50%);
      `;
        heroParticlesContainer.appendChild(particle);

        requestAnimationFrame(() => {
            const scatterX = (Math.random() - 0.5) * 100;
            const scatterY = (Math.random() - 0.5) * 100;
            particle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            particle.style.transform = `translate(${scatterX}px, ${scatterY}px)`;
            particle.style.opacity = '0';

            setTimeout(() => particle.remove(), 600);
        });
    }
}

function addHoverEffect(element) {
    element.addEventListener('mouseover', () => {
        element.style.transition = 'transform 0.3s ease';
        element.style.transform = 'scale(1.1)';
    });
    element.addEventListener('mouseout', () => {
        element.style.transform = 'scale(1)';
    });
}

[document.querySelector('.hero h2'), document.querySelector('#about h2'),
document.querySelector('.btn-primary'), document.querySelector('#join h2'),
document.querySelector('.btn-success')].forEach((el) => el && addHoverEffect(el));