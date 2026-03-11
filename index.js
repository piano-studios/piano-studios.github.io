
document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '526673290264';

  document.getElementById('btn-whatsapp').addEventListener('click', () => {
    const nombre   = document.getElementById('f-nombre').value.trim();
    const telefono = document.getElementById('f-telefono').value.trim();
    const nivel    = document.getElementById('f-nivel').value;
    const mensaje  = document.getElementById('f-mensaje').value.trim();
    const errorEl  = document.getElementById('form-error');

    // Validación: nombre y nivel son obligatorios
    if (!nombre || !nivel) {
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';

    // Construir el mensaje
    let texto = `¡Hola! Me interesa tomar clases en Luca's Piano Studios 🎹\n\n`;
    texto += `👤 Mi nombre es  ${nombre}\n`;
    texto += `🎵 Mi nivel es  ${nivel}\n`;
    if (mensaje)  texto += `💬 *Mensaje:* ${mensaje}\n`;
    texto += `\n¿Me pueden dar más información? ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  });

  // ── HAMBURGER MENU ──
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.addEventListener('scroll', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
  }, { passive: true });
});