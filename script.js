/* =========================================================
   FLOW MALANDRO — Lógica del sitio
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- CONFIGURACIÓN ---------------- */
  const WA_NUMBER = '527445356084';           // WhatsApp destino
  const PRECIOS = {
    'Corte Normal': 120,
    'Corte Desvanecido': 130
  };

  /* ---------------- ELEMENTOS ---------------- */
  const hamburger   = document.getElementById('hamburger');
  const nav         = document.getElementById('nav');
  const modal       = document.getElementById('modal');
  const form        = document.getElementById('formCita');
  const inputNombre = document.getElementById('nombre');
  const selectCorte = document.getElementById('corte');
  const selectHora  = document.getElementById('hora');
  const anticipoEl  = document.getElementById('anticipo');
  const header      = document.getElementById('header');

  /* =========================================================
     MENÚ HAMBURGUESA
     ========================================================= */
  function cerrarMenu() {
    if (!nav || !hamburger) return;
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    if (!modal || !modal.classList.contains('open')) {
      document.body.classList.remove('lock');
    }
  }

  function toggleMenu() {
    if (!nav || !hamburger) return;
    const abierto = nav.classList.toggle('open');
    hamburger.classList.toggle('active', abierto);
    hamburger.setAttribute('aria-expanded', abierto ? 'true' : 'false');

    if (abierto && (!modal || !modal.classList.contains('open'))) {
      document.body.classList.add('lock');
    } else if (!abierto && (!modal || !modal.classList.contains('open'))) {
      document.body.classList.remove('lock');
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', cerrarMenu);
    });
  }

  /* =========================================================
     MODAL DE AGENDADO
     ========================================================= */
  function abrirModal(cortePreseleccionado) {
    if (!modal) return;

    if (cortePreseleccionado && selectCorte && PRECIOS[cortePreseleccionado]) {
      selectCorte.value = cortePreseleccionado;
    }
    actualizarAnticipo();

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    cerrarMenu();

    setTimeout(function () {
      if (inputNombre) inputNombre.focus();
    }, 320);
  }

  function cerrarModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
  }

  /* Botones que abren el formulario (en Precios y en Cortes) */
  document.querySelectorAll('.open-modal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      abrirModal(btn.getAttribute('data-corte'));
    });
  });

  /* Cierre del modal: fondo, botón X y tecla ESC */
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', cerrarModal);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('open')) cerrarModal();
      if (nav && nav.classList.contains('open')) cerrarMenu();
    }
  });

  /* =========================================================
     CÁLCULO DEL ANTICIPO (50%)
     ========================================================= */
  function actualizarAnticipo() {
    if (!selectCorte || !anticipoEl) return;
    const corte = selectCorte.value;
    const precio = PRECIOS[corte] || 0;
    const anticipo = Math.round(precio / 2);
    anticipoEl.textContent = '$' + anticipo + ' MXN';
  }

  if (selectCorte) {
    selectCorte.addEventListener('change', actualizarAnticipo);
    actualizarAnticipo();
  }

  /* =========================================================
     ENVÍO DEL FORMULARIO A WHATSAPP
     ========================================================= */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = (inputNombre && inputNombre.value || '').trim();
      const corte  = selectCorte ? selectCorte.value : 'Corte Normal';
      const hora   = selectHora ? selectHora.value : '';
      const precio = PRECIOS[corte] || 0;
      const anticipo = Math.round(precio / 2);

      /* ---- Validación manual ---- */
      if (!nombre) {
        alert('Por favor escribe tu nombre.');
        if (inputNombre) inputNombre.focus();
        return;
      }
      if (!hora) {
        alert('Por favor selecciona la hora de tu cita.');
        if (selectHora) selectHora.focus();
        return;
      }

      /* ---- Mensaje de WhatsApp ---- */
      const mensaje =
        '¡Hola Alexis Barber! 👋\n' +
        'Ya transferí el 50% y quiero agendar mi cita en FLOW MALANDRO.\n\n' +
        '👤 Nombre: ' + nombre + '\n' +
        '✂️ Tipo de corte: ' + corte + '\n' +
        '💵 Precio: $' + precio + ' MXN\n' +
        '💳 Anticipo (50%): $' + anticipo + ' MXN\n' +
        '⏰ Hora de la cita: ' + hora + '\n' +
        '📍 Sucursal: Colonia La Frontera, Aguacatillo\n\n' +
        '📎 Adjunto mi comprobante de transferencia.\n' +
        'Quedo atento a la confirmación. 🙌';

      const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(mensaje);

      window.open(url, '_blank', 'noopener');

      setTimeout(function () {
        cerrarModal();
        form.reset();
        actualizarAnticipo();
      }, 400);
    });
  }

  /* =========================================================
     HEADER CON SOMBRA AL HACER SCROLL
     ========================================================= */
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 30) {
        header.style.boxShadow = '0 8px 40px rgba(0,0,0,.9), 0 0 26px rgba(255,0,51,.22)';
      } else {
        header.style.boxShadow = '0 6px 30px rgba(0,0,0,.7)';
      }
    }, { passive: true });
  }

})();