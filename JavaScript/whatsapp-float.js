document.addEventListener('DOMContentLoaded', function () {
    const whatsappFloat = document.querySelector('.whatsapp-float');

    // Add tooltip to the WhatsApp button
    const tooltip = document.createElement('div');
    tooltip.className = 'whatsapp-tooltip';
    tooltip.textContent = 'Fale Conosco!';
    whatsappFloat.appendChild(tooltip);

    // Show tooltip on hover
    whatsappFloat.addEventListener('mouseenter', function () {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
    });

    // Hide tooltip when not hovering
    whatsappFloat.addEventListener('mouseleave', function () {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });

    // Add a bounce effect on page load
    setTimeout(function () {
        whatsappFloat.classList.add('bounce');

        setTimeout(function () {
            whatsappFloat.classList.remove('bounce');
        }, 1000);
    }, 2000);

    // Repeat bounce effect every 30 seconds to draw attention
    setInterval(function () {
        whatsappFloat.classList.add('bounce');

        setTimeout(function () {
            whatsappFloat.classList.remove('bounce');
        }, 1000);
    }, 30000);
}); 