const featuresSection = document.querySelector('#features');
let isPulsing = false;

featuresSection.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.col-md-4');
    if (!card) return;
    applyHoverEffect(card, true);
}, true);

featuresSection.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.col-md-4');
    if (!card) return;
    applyHoverEffect(card, false);
}, true);

function applyHoverEffect(card, isHover) {
    const glow = card.querySelector('.glow-effect');
    const title = card.querySelector('h4');
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    card.style.transform = isHover ? 'translateY(-10px) rotate(2deg)' : 'translateY(0) rotate(0deg)';
    card.style.boxShadow = isHover ? '0 10px 20px rgba(0, 0, 0, 0.2)' : 'none';
    title.style.color = isHover ? '#ffd700' : '#333';
    glow.style.opacity = isHover ? '1' : '0';
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || isPulsing) return;
    isPulsing = true;

    const cards = featuresSection.querySelectorAll('.col-md-4');
    cards.forEach((card) => {
        card.classList.add('pulse');
        createParticles(card, 10);
        setTimeout(() => createParticles(card, 10), 500);
        setTimeout(() => createParticles(card, 10), 1000);
    });

    setTimeout(() => {
        cards.forEach((card) => card.classList.remove('pulse'));
        isPulsing = false;
    }, 1500);
});

function createParticles(element, count) {
    const rect = element.getBoundingClientRect();
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'magic-particles';
    particlesContainer.style.cssText = `
      position: absolute;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
    `;
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.cssText = `
        left: ${Math.random() * rect.width}px;
        top: ${Math.random() * rect.height}px;
        background-color: hsl(${Math.random() * 360}, 70%, 50%);
      `;
        particlesContainer.appendChild(particle);

        requestAnimationFrame(() => {
            const scatterX = (Math.random() - 0.5) * 80;
            const scatterY = (Math.random() - 0.5) * 80;
            particle.style.transform = `translate(${scatterX}px, ${scatterY}px)`;
            particle.style.opacity = '0';
        });
    }

    setTimeout(() => particlesContainer.remove(), 600);
}

featuresSection.querySelectorAll('.col-md-4').forEach((card) => {
    if (!card.querySelector('.glow-effect')) {
        const glow = document.createElement('div');
        glow.className = 'glow-effect';
        card.appendChild(glow);
    }
});