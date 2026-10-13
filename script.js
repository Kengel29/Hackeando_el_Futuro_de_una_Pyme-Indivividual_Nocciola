document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);
    const body = document.body;
    const preloader = $('preloader');
    const popup = $('popup');
    const modoOscuroToggle = $('modo-oscuro-toggle');
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    };

    // --- Preloader (solo existe en el inicio) ---
    if (preloader) {
        setTimeout(() => { preloader.classList.add('hidden'); }, 2000);
        // --- Ventana Emergente (solo en el inicio) ---
        preloader.addEventListener('transitionend', () => {
            if (preloader.classList.contains('hidden') && popup) {
                popup.style.display = 'flex';
                setTimeout(() => { popup.classList.remove('hidden'); }, 100);
            }
        });
    }
    if (popup) {
        const closeButton = popup.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            popup.classList.add('hidden');
            setTimeout(() => { popup.style.display = 'none'; }, 500);
        });
    }

    // --- Modo Oscuro Persistente (funciona en TODAS las páginas) ---
    function enableDarkMode() {
        body.classList.add('dark-mode');
        store.set('darkMode', 'enabled');
        if (modoOscuroToggle) modoOscuroToggle.textContent = 'Modo Claro';
    }
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        store.set('darkMode', 'disabled');
        if (modoOscuroToggle) modoOscuroToggle.textContent = 'Modo Oscuro';
    }
    if (store.get('darkMode') === 'enabled') enableDarkMode();
    if (modoOscuroToggle) {
        modoOscuroToggle.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.contains('dark-mode') ? disableDarkMode() : enableDarkMode();
        });
    }

    // --- Easter Egg (5 clics al logo) ---
    let logoClicks = 0;
    const logo = document.querySelector('.main-header .logo');
    if (logo) {
        logo.addEventListener('click', () => {
            logoClicks++;
            if (logoClicks === 5) { showEasterEgg(); logoClicks = 0; }
        });
    }
    function showEasterEgg() {
        const easterEggDiv = document.createElement('div');
        easterEggDiv.id = 'easter-egg';
        easterEggDiv.classList.add('easter-egg-container');
        easterEggDiv.innerHTML = `
            <span class="easter-egg-close">&times;</span>
            <h3>¡Has encontrado el Secreto Oculto!</h3>
            <p>¡Felicidades! Tu curiosidad ha sido recompensada. Como muestra de nuestro agradecimiento por explorar cada rincón, te regalamos un 10% de descuento en tu próxima compra usando el código: <strong>RESURRECTION10</strong></p>
            <img src="images/easter-egg-gift.png" alt="Regalo Secreto">`;
        document.body.appendChild(easterEggDiv);
        setTimeout(() => easterEggDiv.classList.add('visible'), 50);
        easterEggDiv.querySelector('.easter-egg-close').addEventListener('click', () => {
            easterEggDiv.classList.remove('visible');
            setTimeout(() => easterEggDiv.remove(), 500);
        });
    }

    // --- Mapa: cambiar de sucursal ---
    const mapFrame = $('mapa-frame');
    document.querySelectorAll('[data-map]').forEach((b) => b.addEventListener('click', () => {
        mapFrame.src = b.dataset.map;
        document.querySelectorAll('[data-map]').forEach((x) => x.classList.add('secondary'));
        b.classList.remove('secondary');
    }));

    // --- Chatbot "Nocci" ---
    const container = $('chatbot-container');
    if (!container) return;
    const launcher = $('chatbot-launcher'), box = $('chatbot-messages'), input = $('chatbot-input'), chips = $('chatbot-chips');
    // Asistente por reglas con la información real del Menú 2025 (precios en RD$, impuestos no incluidos).
  // nombre | precio | página del menú | palabras clave extra
  const ITEMS = `Espresso|120|2|cafe
Nocciola Espresso|210|2|nutella avellanas
Dominicano|130|2|cafe dominicano
Americano|140|2|cafe
Macchiato|140|2|
Cortadito|145|2|
Latte|190|2|
Capuccino Italiano|200|2|capuchino cappuccino
Capuccino Americano|230|2|capuchino cappuccino
Caramel Capuccino|295|2|
Café Mocano|230|2|mocano
Estela Iced Latte|295|2|
Chocolate Caliente|210|2|
White Hot Chocolate|295|2|chocolate blanco
Frappe de Caramelo|350|2|
Frappe con Nutella|395|2|
Café de Origen|395|2|prensa francesa
Matcha|195|2|te verde
Té Caliente|170|2|
Agua Mineral|100|3|
Refresco|110|3|
Jugo Natural|190|3|
Jugo de Naranja|200|3|china
Pink Lemonade|215|3|limonada fresa
Green Lemonade|230|3|limonada
Detox|240|3|
Jarra de Jugo|850|3|
Como buen Dominicano|545|4|mangu desayuno
Low Carb|565|4|mangu guineito
Camionero|670|4|mangu
Vegetariano|565|4|
Nocciola Croissant Nutella|245|4|croissant
Croissant Ham & Cheese|215|4|croissant jamon queso
Croissant Plain|125|4|croissant
Rustic Benedicts|550|5|benedictinos huevos
Nocciola Madame|540|5|croque
Truffle Croque Madame|595|5|trufa
Avocado Toast|495|5|aguacate tostada
Carbonara Eggs|420|5|huevos
Rise and Shine Burrito|495|5|burrito
Morning Vibes Burger|540|5|
The Morning Crepe|525|5|crepe desayuno
Open Faced Omelette|525|5|omelette tortilla
Cast Iron Pancake|680|6|pancake panqueque
Nutella Pancakes|525|6|pancake panqueque
Classic Pancakes|450|6|panqueque
Healthy Pancakes|525|6|panqueque saludable
Nutella French Toast|575|6|tostada francesa
Classic French Toast|450|6|tostada francesa
Nutella Waffle|525|6|waffle
Classic Waffle|450|6|waffle
American Breakfast|545|6|desayuno americano
Trío de Catibías|425|7|catibia empanada yuca
Pot de Cielito Lindo|895|7|compartir nachos
Crema de Auyama|395|7|sopa
Burrata Dip|625|7|
Salmon Toasts|625|7|salmon
Canasticas de Ossobuco|540|7|
Mofongo Balls de Camarones|625|7|mofongo
Pulled Pork Taquitos|540|7|tacos
Pork Dumplings|495|7|
Spanish Croquettes|425|7|croquetas
Dip de Filete y Hongos|675|7|
Picaderas 4 unidades|195|7|pastelito quipe croqueta
Picaderas 12 unidades|575|7|
Turquitos|150|7|
Cabra Chicken Sandwich|495|8|sandwich
Nocciola Club Sandwich|530|8|club sandwich
Mexican Chicken Wrap|475|8|
Feeling Hot Hot Hot Sandwich|495|8|
Prosciutto Punch Sandwich|495|8|
Panini Italiano|395|8|
Ali-Oli Chicken Sandwich|460|8|
Classic Grilled Cheese|425|8|queso
Egg Sandwich|420|8|
Pechuga Rellena|695|9|pollo
Pechuga de Pollo|545|9|
Mexican Chicken Salad|585|9|ensalada
Cabra Chicken Salad|615|9|ensalada
Mexican Churrasco Bowl|895|9|
Crispy Chicken Tenders|495|9|
Filete de Salmón|1100|9|pescado
Filete de Res|875|9|carne
Crepe de Res a la Fondue|695|9|
Nocciola Chow Fan|550|9|arroz
Churrasco Angus 8 onzas|1300|9|carne
Churrasco Angus 12 onzas|1900|9|carne
Ultimate Smash Burger|545|10|hamburguesa
Nocciola Burger|650|10|hamburguesa
Chicken Crunch Burger|545|10|hamburguesa
Cabra Mushroom Burger|650|10|hamburguesa
Risotto de Churrasco|895|10|
Spicy Rigatoni a la Vodka|795|10|pasta
Orzotto de Camarones|795|10|
Shrimp Fetuccini|750|10|pasta camarones
Homemade Lasagna|625|10|lasana
Penne alla Boscaiola|630|10|pasta
Fetuccini Porcini Trufa|750|10|pasta
Galletón con Nutella|230|11|galleton
Nocciola Brownie con Nutella|160|11|brownie
Blondie con Nutella|160|11|
Lotus Blondie|210|11|biscoff
Hazelnut Bomb|395|11|
Nocciola Macaron|110|11|
Brownie Pop|125|11|
Brigadeiro|110|11|
Nocciola Crunch Cake con Nutella|410|11|
Volcán Coco Horneado|235|11|
Nutella Baklava|235|11|
Vegan Chocochip Cookie|220|11|
Vegan Brownie|220|11|
Pistacchio Cheesecake Vasco|550|12|pistacho
Better Half Brownie Cheesecake|450|12|
Nutella Harvest|325|12|
Oreo Cheesecake|395|12|
Espresso Cheesecake|435|12|
Cheesecake Tradicional|435|12|
Creamy Lotus Cheesecake|450|12|biscoff
Cast Iron Chocolate Chip Cookie|575|13|galleta cookie
Dulce de Leche Lava|525|13|
Crispy Churros|495|13|
Homemade Crepe|450|13|
Jorge's Fondant|525|13|
Ultimate Fudge Coco Horneado|525|13|
Milkshake Dulce de Leche Bliss|545|14|batida
Milkshake Nocciola's Bomb|545|14|batida
Milkshake M&M's Chocolate|545|14|batida
Cerveza Nacional|225|16|
Cerveza Internacional|275|16|corona modelo stella
Mimosa (copa)|325|16|
Cava (copa)|350|16|prosecco
Vino de la Casa (copa)|425|16|
Limoncello|325|16|
Micheladas|450|16|
Cocteles|450|17|margarita mojito negroni sangria
Mocktails|325|17|sin alcohol
Simple Nutella Dulce de Leche Cake (1/4)|1200|18|bizcocho
Snicker & Dulce de Leche Cake (1/4)|1450|18|bizcocho
Hazelnut Madness Cake (1/4)|1450|18|bizcocho
Crunch Cake (1/2)|2350|18|bizcocho
Menú Infantil|395|10|ninos kids
Lunch Menu|399|15|almuerzo
Menú de Temporada para 2|2400|20|pareja`.split('\n').map((l) => { const [n, p, pg, k] = l.split('|'); return { n, p: +p, pg: +pg, k: norm(n + ' ' + (k || '')) }; });

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
  const has = (t, ...w) => w.some((x) => t.includes(x));
  const money = (n) => 'RD$' + n.toLocaleString('en-US');
  const link = (pg, txt) => `<a href="menu.html#p${pg}">${txt || 'página ' + pg + ' del menú'}</a>`;
  const SECCIONES = { 2: 'Café', 3: 'Bebidas y jugos', 4: 'Desayunos', 7: 'Para compartir', 8: 'Sandwiches', 9: 'Platos fuertes', 10: 'Burgers y pastas', 11: 'Sweet bites', 12: 'Cheesecakes', 14: 'Milkshakes', 15: 'Lunch', 17: 'Cocteles', 18: 'Cakes', 19: 'Ofertas' };

  function findItems(t) {
    const stop = new Set(['cuanto', 'cuesta', 'precio', 'tienen', 'tiene', 'que', 'hay', 'los', 'las', 'del', 'con', 'una', 'uno', 'por', 'para', 'quiero', 'cual', 'valor', 'el', 'la', 'de', 'en', 'me', 'es', 'son', 'y', 'un']);
    const words = t.split(' ').filter((w) => w.length > 2 && !stop.has(w));
    if (!words.length) return [];
    const scored = ITEMS.map((i) => ({ i, s: words.filter((w) => i.k.split(' ').some((kw) => kw === w || (w.length > 4 && kw.startsWith(w)))).length })).filter((x) => x.s > 0);
    const max = Math.max(0, ...scored.map((x) => x.s));
    return scored.filter((x) => x.s === max).map((x) => x.i).slice(0, 5);
  }

  function reply(raw) {
    const t = norm(raw);
    if (has(t, 'quien eres', 'quien es', 'que eres', 'eres una ia', 'eres humano', 'robot', 'tu nombre', 'como te llamas'))
      return '¡Soy <b>Nocci</b>, el asistente virtual de Nocciola Digital! No soy una persona: respondo con la información del Menú 2025 (precios, horarios, opciones sin gluten, ofertas) y te guío por el sitio. Para pedidos o reservas, el equipo te atiende por <a href="contacto.html">Contacto</a>.';
    if (has(t, 'hola', 'buenas', 'saludos', 'hey', 'buenos dias')) return '¡Hola! 👋 Soy Nocci. Puedo decirte precios, qué hay para desayunar o almorzar, opciones sin gluten o veganas, ofertas y dónde estamos. ¿Qué se te antoja?';
    if (has(t, 'gracias')) return '¡Con gusto! Si necesitas algo más, aquí estoy. 🍫';
    if (has(t, 'adios', 'chao', 'hasta luego')) return '¡Hasta pronto! Te esperamos en Nocciola.';
    if (has(t, 'secreto', 'easter', 'egg', 'oculto')) return 'Mmm… dicen que si haces clic 5 veces en el logo del inicio pasa algo dulce. 😉';
    if (has(t, 'historia real', 'quienes son', 'fundad', '2015', 'sucursal', 'sucursales', 'naco', 'bella vista', 'arroyo hondo'))
      return `Nocciola nació en 2015 como el sueño de una pareja joven. Hoy hay sucursales en <b>Naco</b> (2015), <b>Bella Vista</b> (2020) y <b>Arroyo Hondo</b> (2021). Lee la historia en la ${link(1, 'página 1 del menú')}.`;
    if (has(t, 'misterio', 'incidente', 'desaparic', 'resurrec', 'renacer', 'usb', 'hackeo', 'ataque'))
      return 'Nuestra web desapareció un día y un USB dejó un mensaje enigmático. Lo reinventamos todo. Cuéntalo completo en <a href="historia.html">Historia del Misterio</a>.';
    if (has(t, 'menu', 'carta', 'pdf', 'ver todo', 'todo lo que tienen'))
      return 'Puedes ver el <a href="menu.html">Menú 2025 completo</a> aquí mismo (20 páginas) o descargarlo en PDF. También está en <a href="https://nocciolard.com/menu-arroyo-hondo/" target="_blank" rel="noopener">nocciolard.com</a>. Todos los precios son en RD$ y no incluyen impuestos (los cakes sí).';
    if (has(t, 'gluten', 'celiac')) return 'Opciones <b>sin gluten</b>: Open Faced Omelette, Trío de Catibías, Pot de Cielito Lindo, Pechuga de Pollo, Filete de Salmón, Filete de Res, Healthy Pancakes, Nocciola Macaron, Brigadeiro, y la Vegan Chocochip Cookie y Vegan Brownie.';
    if (has(t, 'vegano', 'vegana', 'vegan', 'vegetarian')) return 'Opciones veganas: <b>Vegan Chocochip Cookie</b> y <b>Vegan Brownie</b> (RD$220, también sin gluten) y el <b>Make Your Own</b> del desayuno dominicano. Para vegetariano hay el desayuno Vegetariano (RD$565).';
    if (has(t, 'picante', 'picoso', 'spicy')) return 'Con picante 🌶️: Avocado Toast, Salmon Toasts, Rise and Shine Burrito, Morning Vibes Burger, Mexican Chicken Wrap, Feeling Hot Hot Hot Sandwich, Chicken Crunch Burger, Mexican Chicken Salad, Mexican Churrasco Bowl y Spicy Rigatoni a la Vodka.';
    if (has(t, 'nino', 'ninos', 'infantil', 'kids', 'hijo')) return `El <b>Menú Infantil</b> cuesta RD$395 (hasta 12 años): Popcorn Chicken, Tiritas de Pollo o Pasta Infantil. ${link(10)}.`;
    if (has(t, 'cheers', '2x1', 'happy', 'oferta', 'promo', 'membresia', 'descuento'))
      return `Ofertas: <ul><li><b>Cheers O'Clock 2x1</b> en cocteles seleccionados, lunes a viernes de 4:00 a 7:00 PM.</li><li><b>Membresía de café ilimitado</b>: RD$999 + impuestos al mes, en todas las sucursales.</li></ul>${link(19, 'Ver ofertas')}`;
    if (has(t, 'temporada', 'pareja', 'dos personas', 'romantic', 'cita')) return `El <b>Menú de Temporada para 2</b> (entrada, plato fuerte y postre) cuesta RD$2,400 por pareja + impuestos. ${link(20)}.`;
    if (has(t, 'almuerzo', 'lunch', 'mediodia')) return `El <b>Lunch Menu</b> cuesta RD$399 e incluye refresco o agua. Solo en el restaurante, lunes a viernes de 11:30 AM a 3:00 PM. ${link(15)}.`;
    if (has(t, 'desayuno', 'breakfast', 'manana') && has(t, 'horario', 'hora', 'abren', 'cuando')) return 'Desayunos: lunes a viernes de 8:00 AM a 12:00 PM y sábados y domingos de 8:00 AM a 12:30 PM.';
    if (has(t, 'horario', 'hora', 'abren', 'cierran', 'abierto', 'cuando'))
      return 'Horarios de servicio: <ul><li>Desayunos: L–V 8:00–12:00, fin de semana 8:00–12:30</li><li>Lunch: L–V 11:30 AM–3:00 PM</li><li>Cheers O\'Clock 2x1: L–V 4:00–7:00 PM</li></ul>Horario general de las sucursales: lunes a jueves 9:00 AM–10:00 PM, viernes a domingo 9:00 AM–10:30 PM.';
    if (has(t, 'donde', 'ubicacion', 'direccion', 'llegar', 'mapa', 'telefono', 'llamar', 'correo', 'email', 'contacto', 'whatsapp', 'reserva'))
      return 'Tenemos 3 sucursales:<ul><li><b>Naco</b>: C/ Dr. Gilberto Gómez #32 · (809) 227-3444</li><li><b>Bella Vista</b>: Av. Sarasota esq. Las Caobas #62, Bella Vista Mall · (809) 227-3446</li><li><b>Arroyo Hondo</b>: C/ Luis Amiama Tió #60, Plaza Camino Chiquito · (809) 227-3443</li></ul>Correo: nocciolafoodhall@gmail.com. Mapa y WhatsApp en <a href="contacto.html">Contacto</a>.';
    if (has(t, 'pedir', 'pedido', 'delivery', 'domicilio', 'ordenar', 'comprar', 'encargo')) return '<b>Delivery</b>: descarga la app (iOS y Android), llama al 809-908-6010 o escribe por WhatsApp al 829-870-1674. Para <b>órdenes personalizadas</b> (cakes, eventos) llama al 809-227-3444. Más en <a href="contacto.html">Contacto</a>.';
    if (has(t, 'impuesto', 'itbis', 'propina')) return 'Los precios del menú son en RD$ y <b>no incluyen impuestos</b>, excepto la sección de Cakes y Cheesecakes por porción completa, que sí los incluye.';
    if (has(t, 'nutella')) return 'Nutella es nuestra estrella: Brownie con Nutella (RD$160), Galletón (RD$230), Nutella Pancakes (RD$525), Nutella Baklava (RD$235), Nocciola Bomb Milkshake (RD$545) y más. Busca el ícono "Nutella Experiencia" en el menú de postres. ' + link(11);

    if (has(t, 'phoenix', 'glitch', 'pixelad', 'nebulosa')) return 'De nuestra <a href="servicios.html">Carta Reinventada</a>: Pastel "Phoenix" de Chocolate $35, Tarta "Glitch" de Frutas Frescas $30, Macarons "Pixelados" $18 (por 6) y Cheesecake "Nebulosa" $40. El menú completo del restaurante está en <a href="menu.html">Menú</a>.';
    // Categorías por palabra general
    const cats = [
      [['cafe', 'espresso', 'capuchino', 'latte', 'matcha', 'te '], 2, 'Café, espresso, matcha y té'],
      [['jugo', 'limonada', 'bebida', 'refresco', 'agua'], 3, 'Bebidas y jugos'],
      [['desayuno', 'mangu', 'croissant'], 4, 'Desayunos y croissants'],
      [['compartir', 'entrada', 'picadera', 'picar', 'snack'], 7, 'Para compartir y Salty Bites'],
      [['sandwich', 'wrap', 'panini'], 8, 'Sandwiches'],
      [['plato fuerte', 'platos', 'comida', 'ensalada', 'carne', 'pollo', 'pescado'], 9, 'Platos fuertes'],
      [['burger', 'hamburguesa', 'pasta', 'risotto'], 10, 'Burgers, pastas y risottos'],
      [['postre', 'dulce', 'brownie', 'galleta', 'sweet'], 11, 'Sweet bites'],
      [['cheesecake'], 12, 'Cheesecakes'],
      [['milkshake', 'batida', 'malteada'], 14, 'Milkshakes (RD$545 c/u)'],
      [['cerveza', 'vino', 'cocteles', 'coctel', 'trago', 'alcohol', 'margarita', 'mimosa', 'bar'], 16, 'Cervezas, vinos y cocteles (cocteles RD$450)'],
      [['cake', 'bizcocho', 'torta', 'pastel'], 18, 'Cakes completos']
    ];

    const found = findItems(t);
    const asksPrice = has(t, 'cuanto', 'precio', 'cuesta', 'vale', 'costo', 'valor');
    if (found.length && (asksPrice || found.length <= 3)) {
      if (found.length === 1) { const i = found[0]; return `<b>${i.n}</b>: ${money(i.p)}. ${link(i.pg)}.`; }
      return 'Esto es lo que encontré:<ul>' + found.map((i) => `<li><b>${i.n}</b>: ${money(i.p)} (${link(i.pg, 'p. ' + i.pg)})</li>`).join('') + '</ul>';
    }
    for (const [w, pg, name] of cats) if (has(t, ...w)) return `Mira la sección <b>${name}</b> en la ${link(pg)}. Dime el nombre de un plato y te doy el precio.`;
    if (found.length) return 'Quizá te refieres a:<ul>' + found.map((i) => `<li><b>${i.n}</b>: ${money(i.p)}</li>`).join('') + '</ul>';
    return 'No estoy seguro de haberte entendido. Puedo ayudarte con precios, horarios, sin gluten, ofertas, ubicación o con ver el <a href="menu.html">menú completo</a>. ¿Cuál te sirve?';
  }


    const SUGGEST = ['Ver el menú', 'Horarios', 'Opciones sin gluten', 'Ofertas', '¿Cuánto cuesta el cheesecake?', 'Menú infantil', '¿Quién eres?'];
    chips.innerHTML = SUGGEST.map((s) => `<button type="button">${s}</button>`).join('');
    function add(who, html, isHtml) {
        const d = document.createElement('div');
        d.className = 'message ' + who;
        if (isHtml) d.innerHTML = html; else d.textContent = html;
        box.appendChild(d); box.scrollTop = box.scrollHeight; return d;
    }
    function send(text) {
        text = text.trim(); if (!text) return;
        add('user', text); input.value = '';
        const typing = document.createElement('div');
        typing.className = 'message bot typing'; typing.innerHTML = '<span></span><span></span><span></span>';
        box.appendChild(typing); box.scrollTop = box.scrollHeight;
        setTimeout(() => { typing.remove(); add('bot', reply(text), true); }, 600 + Math.random() * 400);
    }
    function openChat(open) {
        container.classList.toggle('collapsed', !open);
        launcher.style.display = open ? 'none' : 'flex';
        if (open) { input.focus(); box.scrollTop = box.scrollHeight; }
    }
    add('bot', '¡Hola! Soy <b>Nocci</b>, el asistente virtual de Nocciola. Te ayudo con precios, horarios, opciones sin gluten, ofertas y a encontrar lo que buscas en el menú. 🍫', true);
    launcher.addEventListener('click', () => openChat(true));
    $('chatbot-toggle').addEventListener('click', () => openChat(false));
    $('chatbot-input-area').addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });
    chips.addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') send(e.target.textContent); });
});
