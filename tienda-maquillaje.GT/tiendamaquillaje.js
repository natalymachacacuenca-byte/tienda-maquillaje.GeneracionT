/* ==========================================================================
   OBSIDIANA · Lógica de la tienda
   Índice:
   1. Datos (productos y portadas)
   2. Utilidades (precios, imágenes)
   3. Estado (favoritos y carrito con localStorage)
   4. Renderizado (portadas y tarjetas)
   5. Interacciones (favoritos, carrito, filtros, navegación)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. DATOS ---------- */

  // Carpeta de imágenes (en la raíz del proyecto)
  const IMG = 'imagenes/';

  // Atajo para definir productos: id, categoría, nombre, línea, descripción, precio ARS, archivo, ¿tendencia?
  const p = (id, cat, name, line, desc, price, file, trend = false) =>
    ({ id, cat, name, line, desc, price, file, trend });

  /* NOTA: las líneas son de la marca propia "Obsidiana" y los precios son referenciales
     en pesos argentinos. Ajustá nombres, tonos y valores según el producto real de cada foto. */
  const PRODUCTS = [
    // ---- RUBOR ----
    p('rb1', 'rubor', 'Rubor en polvo "Rosa Peonía"', 'Velvet Blush', 'Polvo sedoso de acabado satinado.', 11900, 'rubor-01.webp'),
    // IMPORTANTE: verificar si la imagen real es .jpg o .webp (el JS prueba la otra extensión si falla)
    p('rb2', 'rubor', 'Rubor en crema "Durazno Rocío"', 'Glow Cream', 'Textura jugosa para mejillas luminosas.', 12500, 'rubor-02.jpg', true),
    p('rb3', 'rubor', 'Rubor líquido "Coral Atardecer"', 'Liquid Bloom', 'Color intenso que se difumina fácil.', 13800, 'rubor-03.webp', true),
    p('rb4', 'rubor', 'Rubor en barra "Malva Suave"', 'Petal Stick', 'Multiuso para mejillas y labios.', 10900, 'rubor-04.webp'),
    p('rb5', 'rubor', 'Rubor horneado "Rosé Dorado"', 'Baked Light', 'Con destello sutil de larga duración.', 15900, 'rubor-05.webp'),
    p('rb6', 'rubor', 'Trío de rubores "Primavera"', 'Velvet Blush', 'Tres tonos pastel para combinar.', 18900, 'rubor-06.webp'),
    p('rb7', 'rubor', 'Rubor mousse "Frambuesa"', 'Cloud Mousse', 'Efecto aireado y liviano.', 12900, 'rubor-07.webp'),
    p('rb8', 'rubor', 'Rubor compacto "Nude Rosado"', 'Velvet Blush', 'Básico natural para todos los días.', 9900, 'rubor-08.webp'),

    // ---- LABIALES ----
    p('lb1', 'labiales', 'Labial cremoso "Rosa Nude"', 'Silk Lips', 'Hidratación y color cómodo.', 8900, 'labial.01.webp', true),
    p('lb2', 'labiales', 'Labial mate "Rojo Obsidiana"', 'Matte Muse', 'Mate aterciopelado de alta pigmentación.', 9900, 'labial-007.webp', true),
    p('lb3', 'labiales', 'Labial satinado "Coral Dulce"', 'Silk Lips', 'Acabado satinado, no reseca.', 9200, 'labial-009.webp', true),
    p('lb4', 'labiales', 'Labial líquido "Ciruela"', 'Velvet Tint', 'Larga duración, efecto terciopelo.', 10500, 'labial-010.webp'),
    p('lb5', 'labiales', 'Labial cremoso "Malva"', 'Silk Lips', 'Tono rosado lila fácil de usar.', 8900, 'labial-011.webp'),
    p('lb6', 'labiales', 'Gloss voluminizador "Cristal"', 'Juicy Gloss', 'Brillo espejo con efecto jugoso.', 7900, 'labial-015.webp'),
    p('lb7', 'labiales', 'Labial mate "Terracota"', 'Matte Muse', 'Cobrizo cálido para el día a día.', 9900, 'labial-016.webp'),
    p('lb8', 'labiales', 'Labial en barra "Frambuesa"', 'Silk Lips', 'Color vibrante con confort total.', 8900, 'labial-019.webp'),

    // ---- MÁSCARA DE PESTAÑAS ----
    p('ms1', 'mascaras', 'Máscara volumen "Noche Negra"', 'Lash Drama', 'Volumen extremo sin grumos.', 11500, 'mascara-12.webp'),
    p('ms2', 'mascaras', 'Máscara alargadora "Infinito"', 'Lash Lift', 'Pestañas largas y definidas.', 10900, 'mascara-13.webp'),
    p('ms3', 'mascaras', 'Máscara a prueba de agua', 'Lash Drama', 'Resiste humedad todo el día.', 12900, 'mascara-14.webp'),
    p('ms4', 'mascaras', 'Máscara curvadora "Abanico"', 'Lash Lift', 'Curvatura que dura horas.', 11200, 'mascara-15.webp', true),
    p('ms5', 'mascaras', 'Máscara 2 en 1 "Dúo"', 'Lash Duo', 'Base fortalecedora + color.', 13500, 'mascara-16.webp'),
    p('ms6', 'mascaras', 'Máscara separadora "Natural"', 'Lash Lift', 'Look natural pestaña por pestaña.', 9900, 'mascara-17.webp'),
    p('ms7', 'mascaras', 'Máscara marrón "Chocolate"', 'Lash Drama', 'Suaviza la mirada con tono café.', 10500, 'mascara-18.webp'),
    p('ms8', 'mascaras', 'Máscara mini "Viaje"', 'Lash Duo', 'Tamaño compacto para llevar.', 7500, 'mascara-19.webp'),

    // ---- DELINEADORES ----
    p('dl1', 'delineadores', 'Delineador líquido "Trazo Fino"', 'Line Master', 'Punta precisa, negro intenso.', 8500, 'deliniador1.webp'),
    p('dl2', 'delineadores', 'Delineador en gel "Cremoso"', 'Gel Glide', 'Se desliza y se difumina.', 9500, 'deliniador2.webp', true),
    p('dl3', 'delineadores', 'Lápiz delineador "Kajal"', 'Line Master', 'Ideal para línea de agua.', 6900, 'deliniador3.webp', true),
    p('dl4', 'delineadores', 'Delineador fibra "Pincel"', 'Line Master', 'Control total del gatito.', 8900, 'deliniador4.webp'),
    p('dl5', 'delineadores', 'Delineador marrón "Cacao"', 'Gel Glide', 'Alternativa suave al negro.', 8200, 'deliniador 5.webp'),
    p('dl6', 'delineadores', 'Delineador de color "Lila"', 'Pop Liner', 'Un toque pastel para tu mirada.', 7900, 'deliniador6.webp'),
    p('dl7', 'delineadores', 'Delineador a prueba de agua', 'Line Master', 'No se corre, no se mancha.', 9200, 'deliniador7.webp'),
    p('dl8', 'delineadores', 'Lápiz retráctil "Click"', 'Gel Glide', 'Sin sacapuntas, siempre listo.', 6500, 'deliniador8.webp'),

    // ---- SOMBRAS ----
    p('sb1', 'sombras', 'Paleta de sombras "Atardecer"', 'Eye Dream', '9 tonos cálidos mate y shimmer.', 18900, 'sombras-10.webp'),
    p('sb2', 'sombras', 'Paleta "Rosa Cuarzo"', 'Eye Dream', 'Rosados y corales suaves.', 17500, 'sombras-11.webp'),
    p('sb3', 'sombras', 'Paleta "Lavanda"', 'Eye Dream', 'Lilas y malvas pastel.', 17900, 'sombras-12.webp', true),
    p('sb4', 'sombras', 'Dúo de sombras "Brillo"', 'Shimmer Duo', 'Dos tonos metalizados.', 9900, 'sombras-13.webp'),
    p('sb5', 'sombras', 'Paleta nude "Básicos"', 'Eye Dream', 'Neutros para todos los días.', 16900, 'sombras-14.webp'),
    p('sb6', 'sombras', 'Sombra en crema "Perla"', 'Shimmer Duo', 'Aplicación con el dedo, ultra brillo.', 8900, 'sombras-15.webp', true),
    p('sb7', 'sombras', 'Paleta "Amanecer"', 'Eye Dream', 'Amarillos y duraznos luminosos.', 18500, 'sombras-16.webp', true),
    p('sb8', 'sombras', 'Paleta glitter "Fiesta"', 'Party Glow', 'Con destellos para eventos.', 19900, 'sombras-17.webp'),
    p('sb9', 'sombras', 'Paleta edición limitada "Obsidiana"', 'Limited Edition', 'Tonos profundos y brillantes.', 22900, 'sombras-18.webp'),
  ];

  // Portadas con título grande + consejos debajo (sección "Consejos")
  const COVERS = [
    { title: 'Rostro y piel', file: 'rubor-03.webp', color: 'var(--pink)',
      tips: ['Aplicá el rubor sonriendo, sobre la parte más alta de las mejillas.',
             'Los rubores en crema se funden mejor con los dedos o una esponja húmeda.',
             'Hidratá la piel antes de maquillar para un acabado parejo.'] },
    { title: 'Mirada magnética', file: 'sombras-12.webp', color: 'var(--lilac)',
      tips: ['Empezá por un tono neutro en todo el párpado como base.',
             'Difuminá siempre los bordes para evitar cortes marcados.',
             'Un toque de brillo en el centro agranda la mirada.'] },
    { title: 'Labios con estilo', file: 'labial-007.webp', color: 'var(--coral)',
      tips: ['Exfoliá suavemente los labios antes de pintarlos.',
             'Delineá primero y rellená después: dura mucho más.',
             'Un toque de gloss en el centro da efecto de volumen.'] },
    { title: 'Novedades', file: 'mascara-15.webp', color: 'var(--yellow)',
      tips: ['Mové la máscara en zigzag desde la raíz para más volumen.',
             'Esperá unos segundos entre capas para evitar grumos.',
             'Probá una máscara curvadora si tus pestañas son rectas.'] },
    { title: 'Edición limitada', file: 'sombras-18.webp', color: 'var(--lilac)',
      tips: ['Guardala para ocasiones especiales: se agota rápido.',
             'Combiná un tono mate de transición con uno brillante.',
             'Fijá con un spray para que dure toda la noche.'] },
    { title: 'Básicos infaltables', file: 'deliniador2.webp', color: 'var(--pink)',
      tips: ['Un buen delineador, máscara y labial nude arman un look completo.',
             'Elegí delineador marrón para un efecto más natural.',
             'Limpiá el pincel seguido para trazos prolijos.'] },
  ];

  /* ---------- 2. UTILIDADES ---------- */

  // Impuestos nacionales (IVA 21%): precio sin impuestos nacionales = precio / 1,21
  const IVA = 1.21;
  const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  const priceNet = (price) => fmt.format(Math.round(price / IVA));

  // encodeURI convierte el espacio de "deliniador 5.webp" en %20 para que cargue bien
  const imgSrc = (file) => encodeURI(IMG + file);

  // Si una imagen falla, prueba la otra extensión (.jpg <-> .webp); si también falla, la oculta
  function attachImageFallback(img) {
    img.addEventListener('error', function onError() {
      if (img.dataset.retried) {
        img.classList.add('img-missing');
        return;
      }
      img.dataset.retried = '1';
      const src = img.getAttribute('src');
      if (/\.jpg$/i.test(src)) img.src = src.replace(/\.jpg$/i, '.webp');
      else if (/\.webp$/i.test(src)) img.src = src.replace(/\.webp$/i, '.jpg');
      else img.classList.add('img-missing');
    });
  }

  /* ---------- 3. ESTADO ---------- */

  // Lectura/escritura segura en localStorage (puede no estar disponible)
  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin persistencia */ }
  };

  let favorites = new Set(load('obsidiana_favs', []));   // ids de favoritos
  let cart = load('obsidiana_cart', {});                 // { id: cantidad }

  const byId = (id) => PRODUCTS.find((x) => x.id === id);
  const cartTotal = () => Object.values(cart).reduce((a, b) => a + b, 0);

  /* ---------- 4. RENDERIZADO ---------- */

  // Crea el HTML de una tarjeta de producto
  function cardHTML(prod) {
    const isFav = favorites.has(prod.id);
    return `
      <article class="card card--${prod.cat}${prod.trend ? ' card--trend' : ''}" data-id="${prod.id}" tabindex="0">
        <div class="card__media">
          ${prod.trend ? '<span class="badge">✦ En tendencia</span>' : ''}
          <button class="fav${isFav ? ' is-on' : ''}" type="button" data-action="fav"
                  aria-pressed="${isFav}" aria-label="Agregar ${prod.name} a favoritos">${isFav ? '♥' : '♡'}</button>
          <img src="${imgSrc(prod.file)}" alt="${prod.name}" loading="lazy">
        </div>
        <div class="card__body">
          <p class="card__line">${prod.line}</p>
          <h4 class="card__name">${prod.name}</h4>
          <p class="card__desc">${prod.desc}</p>
          <div class="card__price">
            <strong>${fmt.format(prod.price)}</strong>
            <small>Sin imp. nac.: ${priceNet(prod.price)}</small>
          </div>
          <button class="add" type="button" data-action="add">Agregar al carrito</button>
        </div>
      </article>`;
  }

  // Rellena cada grilla de categoría; "tendencia" reúne productos de todas
  function renderCatalog() {
    document.querySelectorAll('[data-grid]').forEach((grid) => {
      const cat = grid.dataset.grid;
      const list = cat === 'tendencia' ? PRODUCTS.filter((x) => x.trend) : PRODUCTS.filter((x) => x.cat === cat);
      grid.innerHTML = list.map(cardHTML).join('');
      grid.querySelectorAll('img').forEach(attachImageFallback);
    });
  }

  // Portadas con título grande y consejos debajo
  function renderCovers() {
    const grid = document.getElementById('coversGrid');
    grid.innerHTML = COVERS.map((c) => `
      <article class="cover" style="--cover-color:${c.color}">
        <div class="cover__photo">
          <img src="${imgSrc(c.file)}" alt="${c.title}" loading="lazy">
          <h3 class="cover__name">${c.title}</h3>
        </div>
        <div class="cover__tips">
          <h4>Consejos</h4>
          <ul>${c.tips.map((t) => `<li>${t}</li>`).join('')}</ul>
        </div>
      </article>`).join('');
    grid.querySelectorAll('img').forEach(attachImageFallback);
  }

  /* ---------- 5. INTERACCIONES ---------- */

  // Contadores superiores (con pequeña animación) + refresco de los paneles
  function updateCounters() {
    const favEl = document.getElementById('favCount');
    const cartEl = document.getElementById('cartCount');
    favEl.textContent = favorites.size;
    cartEl.textContent = cartTotal();
    [favEl, cartEl].forEach((el) => {
      el.classList.remove('is-bump');
      void el.offsetWidth;                // reinicia la animación
      el.classList.add('is-bump');
    });
    renderCart();
    renderFavs();
    if (modalId) renderModalInfo();       // mantiene al día el detalle si está abierto
  }

  /* ----- Detalle de producto (ventana al tocar una tarjeta) ----- */
  let modalId = null;                     // id del producto abierto, o null

  // Bloquea el scroll de fondo si hay un panel o el detalle abiertos
  function syncScrollLock() {
    const anyOpen = document.querySelector('.drawer.is-open, .modal.is-open');
    document.body.classList.toggle('no-scroll', Boolean(anyOpen));
  }

  // Parte de texto, precios y botones del detalle
  function renderModalInfo() {
    const prod = byId(modalId);
    if (!prod) return;
    const isFav = favorites.has(prod.id);
    const inCart = cart[prod.id] || 0;
    document.getElementById('pmInfo').innerHTML = `
      ${prod.trend ? '<span class="pm__badge">✦ En tendencia</span>' : ''}
      <p class="pm__line">${prod.line}</p>
      <h3 class="pm__name">${prod.name}</h3>
      <p class="pm__desc">${prod.desc}</p>
      <div class="pm__price">${fmt.format(prod.price)}</div>
      <p class="pm__net">Precio sin impuestos nacionales: ${priceNet(prod.price)}</p>
      ${inCart ? `<p class="pm__incart">🛍 Ya tenés ${inCart} en tu carrito</p>` : ''}
      <div class="pm__actions">
        <button class="btn btn--primary btn--full" type="button" data-act="modal-add">Agregar al carrito</button>
        <button class="btn btn--ghost btn--full" type="button" data-act="modal-fav">${isFav ? '♥ Quitar de favoritos' : '♡ Agregar a favoritos'}</button>
      </div>
      <p class="pm__ship">🚚 Envío gratis desde ${fmt.format(FREE_SHIPPING)} · 3 cuotas sin interés</p>`;
  }

  function openModal(id) {
    const prod = byId(id);
    if (!prod) return;
    modalId = id;
    const media = document.getElementById('pmMedia');
    media.innerHTML = `<img src="${imgSrc(prod.file)}" alt="${prod.name}">`;
    attachImageFallback(media.querySelector('img'));
    renderModalInfo();
    const modal = document.getElementById('productModal');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    modal.querySelector('.modal__close').focus();
  }

  function closeModal() {
    modalId = null;
    const modal = document.getElementById('productModal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    syncScrollLock();
  }

  /* ----- Paneles laterales: carrito y favoritos ----- */
  const FREE_SHIPPING = 60000;            // mismo monto que anuncia la franja superior

  const cartMoney = () => Object.keys(cart).reduce((sum, id) => sum + (byId(id) ? byId(id).price * cart[id] : 0), 0);

  const thumbHTML = (prod) =>
    `<div class="item__thumb"><img src="${imgSrc(prod.file)}" alt="${prod.name}"></div>`;

  const emptyHTML = (icon, text) =>
    `<div class="empty"><span class="empty__icon" aria-hidden="true">${icon}</span>${text}</div>`;

  // Dibuja el contenido del carrito, totales y barra de envío gratis
  function renderCart() {
    const list = document.getElementById('cartList');
    const ids = Object.keys(cart).filter((id) => byId(id) && cart[id] > 0);

    list.innerHTML = ids.length
      ? ids.map((id) => {
          const prod = byId(id);
          return `
          <div class="item" data-id="${id}">
            ${thumbHTML(prod)}
            <div>
              <p class="item__line">${prod.line}</p>
              <h4 class="item__name">${prod.name}</h4>
              <p class="item__price">${fmt.format(prod.price * cart[id])}</p>
              <div class="item__row">
                <div class="qty">
                  <button type="button" data-act="dec" aria-label="Quitar una unidad">−</button>
                  <span>${cart[id]}</span>
                  <button type="button" data-act="inc" aria-label="Agregar una unidad">+</button>
                </div>
                <button class="link-btn" type="button" data-act="remove">Eliminar</button>
              </div>
            </div>
          </div>`;
        }).join('')
      : emptyHTML('🛍', 'Tu carrito está vacío.<br>¡Sumá tus productos favoritos!');
    list.querySelectorAll('img').forEach(attachImageFallback);

    const total = cartMoney();
    document.getElementById('cartTotal').textContent = fmt.format(total);
    document.getElementById('cartNet').textContent = priceNet(total);

    const missing = FREE_SHIPPING - total;
    document.getElementById('shipMsg').textContent = total === 0
      ? `Envío gratis desde ${fmt.format(FREE_SHIPPING)}`
      : missing > 0 ? `Te faltan ${fmt.format(missing)} para el envío gratis 🚚` : '¡Conseguiste envío gratis! 🎉';
    document.getElementById('shipBar').style.width = Math.min(100, (total / FREE_SHIPPING) * 100) + '%';
  }

  // Dibuja la lista de favoritos
  function renderFavs() {
    const list = document.getElementById('favList');
    const ids = [...favorites].filter((id) => byId(id));

    list.innerHTML = ids.length
      ? ids.map((id) => {
          const prod = byId(id);
          return `
          <div class="item" data-id="${id}">
            ${thumbHTML(prod)}
            <div>
              <p class="item__line">${prod.line}</p>
              <h4 class="item__name">${prod.name}</h4>
              <p class="item__price">${fmt.format(prod.price)}</p>
              <div class="item__row">
                <button class="mini-btn" type="button" data-act="fav-add">Agregar al carrito</button>
                <button class="link-btn" type="button" data-act="fav-remove">Quitar</button>
              </div>
            </div>
          </div>`;
        }).join('')
      : emptyHTML('♡', 'Todavía no tenés favoritos.<br>Tocá el ♡ en los productos que te gusten.');
    list.querySelectorAll('img').forEach(attachImageFallback);
  }

  // Abrir / cerrar paneles
  function openDrawer(id) {
    closeDrawers();
    document.getElementById(id).classList.add('is-open');
    document.getElementById(id).setAttribute('aria-hidden', 'false');
    document.getElementById('overlay').classList.add('is-open');
    syncScrollLock();
  }
  function closeDrawers() {
    document.querySelectorAll('.drawer').forEach((d) => {
      d.classList.remove('is-open');
      d.setAttribute('aria-hidden', 'true');
    });
    document.getElementById('overlay').classList.remove('is-open');
    syncScrollLock();
  }

  // Cambia la cantidad de un producto en el carrito (0 = eliminar)
  function setQty(id, qty) {
    if (qty <= 0) delete cart[id]; else cart[id] = qty;
    save('obsidiana_cart', cart);
    updateCounters();
  }

  // Acciones de los botones dentro de los paneles
  function handleDrawerAction(btn) {
    const act = btn.dataset.act;
    const itemEl = btn.closest('.item');
    const id = itemEl ? itemEl.dataset.id : null;

    switch (act) {
      case 'close': closeDrawers(); break;
      case 'close-modal': closeModal(); break;
      case 'modal-add': addToCart(modalId); break;
      case 'modal-fav': toggleFav(modalId); break;
      case 'inc': setQty(id, (cart[id] || 0) + 1); break;
      case 'dec': setQty(id, (cart[id] || 0) - 1); break;
      case 'remove': setQty(id, 0); toast('Producto eliminado del carrito'); break;
      case 'clear-cart':
        if (cartTotal() === 0) { toast('El carrito ya está vacío'); break; }
        cart = {}; save('obsidiana_cart', cart); updateCounters(); toast('Carrito vaciado');
        break;
      case 'checkout':
        if (cartTotal() === 0) { toast('Agregá productos para continuar'); break; }
        toast('✨ ¡Gracias por tu compra en Obsidiana! (demo)');
        break;
      case 'fav-add': addToCart(id); break;
      case 'fav-remove': toggleFav(id); break;
      case 'favs-to-cart':
        if (favorites.size === 0) { toast('No tenés favoritos para agregar'); break; }
        favorites.forEach((fid) => { cart[fid] = (cart[fid] || 0) + 1; });
        save('obsidiana_cart', cart); updateCounters();
        toast('Favoritos agregados al carrito 🛍');
        break;
    }
  }

  // Notificación visual temporal
  function toast(message) {
    const zone = document.getElementById('toastZone');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    zone.appendChild(el);
    setTimeout(() => el.classList.add('is-out'), 2300);
    setTimeout(() => el.remove(), 2700);
  }

  // Favoritos: alterna ♡/♥ en todas las tarjetas del mismo producto (también en Tendencia)
  function toggleFav(id) {
    const prod = byId(id);
    const nowFav = !favorites.has(id);
    nowFav ? favorites.add(id) : favorites.delete(id);
    save('obsidiana_favs', [...favorites]);

    document.querySelectorAll(`.card[data-id="${id}"] .fav`).forEach((btn) => {
      btn.classList.toggle('is-on', nowFav);
      btn.setAttribute('aria-pressed', String(nowFav));
      btn.textContent = nowFav ? '♥' : '♡';
    });
    updateCounters();
    toast(nowFav ? `♥ ${prod.name} agregado a favoritos` : `Quitaste ${prod.name} de favoritos`);
  }

  // Carrito: suma una unidad
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    save('obsidiana_cart', cart);
    updateCounters();
    toast(`🛍 ${byId(id).name} agregado al carrito`);
  }

  // Filtrado por categoría (muestra/oculta secciones sin romper el diseño)
  function setFilter(filter) {
    document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === filter));
    document.querySelectorAll('.category').forEach((sec) => {
      sec.hidden = !(filter === 'todo' || sec.dataset.cat === filter);
    });
  }

  // Desplazamiento suave a una sección, asegurando que esté visible
  function goTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const section = target.classList.contains('category') ? target : null;
    if (section && section.hidden) setFilter('todo');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  }

  // Resalta en el menú la sección que se está viendo
  function observeSections() {
    const links = document.querySelectorAll('[data-nav]');
    const ids = [...links].map((a) => a.dataset.nav);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === entry.target.id));
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
  }

  function bindEvents() {
    // Delegación de eventos: favoritos y agregar al carrito
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = btn.closest('.card').dataset.id;
      if (btn.dataset.action === 'fav') toggleFav(id);
      if (btn.dataset.action === 'add') addToCart(id);
    });

    // Chips de filtro
    document.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        setFilter(chip.dataset.filter);
        const target = chip.dataset.filter === 'todo' ? 'catalogo' : chip.dataset.filter;
        goTo(target);
      });
    });

    // Navegación suave del menú
    document.querySelectorAll('[data-nav]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(a.dataset.nav);
      });
    });

    // Contadores del header: abren los paneles de favoritos y carrito
    document.getElementById('favCounter').addEventListener('click', () => openDrawer('favDrawer'));
    document.getElementById('cartCounter').addEventListener('click', () => openDrawer('cartDrawer'));

    // Acciones dentro de los paneles (data-act) y cierre por fondo oscuro o tecla Esc
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (btn) handleDrawerAction(btn);
    });
    document.getElementById('overlay').addEventListener('click', closeDrawers);

    // Abrir el detalle al tocar una tarjeta (o la miniatura/nombre dentro de los paneles)
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, a, [data-act]')) return;   // los botones hacen lo suyo
      const card = e.target.closest('.card');
      const item = e.target.closest('.item__thumb, .item__name');
      const id = card ? card.dataset.id : item ? item.closest('.item').dataset.id : null;
      if (id) openModal(id);
    });

    // Teclado: Enter sobre una tarjeta enfocada abre el detalle; Esc cierra detalle o paneles
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('card')) openModal(e.target.dataset.id);
      if (e.key === 'Escape') { if (modalId) closeModal(); else closeDrawers(); }
    });
  }

  /* ---------- Inicio ---------- */
  function init() {
    renderCovers();
    renderCatalog();
    bindEvents();
    observeSections();
    // Sin animación al cargar: solo fija los números iniciales
    document.getElementById('favCount').textContent = favorites.size;
    document.getElementById('cartCount').textContent = cartTotal();
    renderCart();
    renderFavs();
  }

  document.addEventListener('DOMContentLoaded', init);
})();