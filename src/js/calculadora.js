import { cuotas, descuentoSegunda, disciplinasSinDescuento } from '../data/tarifas.js';

// Disciplinas de adultos que entran en la calculadora.
// Las clases infantiles NO entran: "Precio infantil: consultar".
const DISCIPLINAS = ['K1', 'Boxeo', 'BJJ'];

// Estado: disciplina -> id de cuota elegida, o null si no la hace.
const estado = {};
DISCIPLINAS.forEach((d) => {
  estado[d] = null;
});

const contenedorTabla = document.querySelector('.tarifas__tabla');
const contenedorControles = document.querySelector('.calculadora__controles');
const contenedorResultado = document.querySelector('.calculadora__resultado');

const euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const formatoEuro = (n) => euro.format(n);

const precioCuota = (id) => cuotas.find((c) => c.id === id)?.precio ?? 0;
const nombreCuota = (id) => cuotas.find((c) => c.id === id)?.nombre ?? '';

// PROVISIONAL: la disciplina más cara se paga entera y las demás al 50 %,
// salvo las de disciplinasSinDescuento (BJJ), que siempre van enteras.
function calcular() {
  const seleccion = DISCIPLINAS.filter((d) => estado[d]).map((d) => ({
    disciplina: d,
    cuota: estado[d],
    base: precioCuota(estado[d]),
  }));

  if (seleccion.length === 0) return { lineas: [], total: 0 };

  const precioMax = Math.max(...seleccion.map((s) => s.base));
  let enteraAsignada = false;

  const lineas = seleccion.map((s) => {
    const sinDescuento = disciplinasSinDescuento.includes(s.disciplina);
    let entera;
    if (sinDescuento) {
      entera = true;
    } else if (s.base === precioMax && !enteraAsignada) {
      entera = true;
      enteraAsignada = true;
    } else {
      entera = false;
    }
    const importe = entera ? s.base : s.base * descuentoSegunda;
    return { ...s, entera, importe };
  });

  const total = lineas.reduce((acc, l) => acc + l.importe, 0);
  return { lineas, total };
}

function pintarTabla() {
  contenedorTabla.innerHTML = `
    <div class="tarifas__cuotas">
      ${cuotas
        .map((c) => {
          const destacada = c.id === 'ilimitado';
          return `
        <div class="tarifa${destacada ? ' tarifa--destacada' : ''}">
          ${destacada ? '<span class="tarifa__etiqueta">La más completa</span>' : ''}
          <h3 class="tarifa__nombre">${c.nombre}</h3>
          <p class="tarifa__precio">${formatoEuro(c.precio)}</p>
          <p class="tarifa__periodo">al mes</p>
        </div>`;
        })
        .join('')}
    </div>`;
}

function pintarControles() {
  contenedorControles.innerHTML = DISCIPLINAS.map(
    (d) => `
      <div class="calculadora__disciplina">
        <label for="cal-${d}">${d}</label>
        <select id="cal-${d}" class="calculadora__select" data-disciplina="${d}">
          <option value="">No la hago</option>
          ${cuotas
            .map(
              (c) =>
                `<option value="${c.id}">${c.nombre} · ${formatoEuro(c.precio)}</option>`
            )
            .join('')}
        </select>
      </div>`
  ).join('');
}

function pintarResultado() {
  const { lineas, total } = calcular();

  if (lineas.length === 0) {
    contenedorResultado.innerHTML =
      '<p class="calculadora__vacio">Elige al menos una disciplina para ver tu cuota.</p>';
    return;
  }

  const filas = lineas
    .map(
      (l) => `
        <li class="calculadora__linea">
          <span>${l.disciplina} · ${nombreCuota(l.cuota)}</span>
          <span>${formatoEuro(l.importe)}${l.entera ? '' : ' <small>(−50 %)</small>'}</span>
        </li>`
    )
    .join('');

  contenedorResultado.innerHTML = `
    <ul class="calculadora__desglose">${filas}</ul>
    <p class="calculadora__total"><span>Total</span> <span>${formatoEuro(total)}/mes</span></p>
    <p class="calculadora__nota">Precio infantil: consultar.</p>`;
}

contenedorControles?.addEventListener('change', (e) => {
  const select = e.target.closest('.calculadora__select');
  if (!select) return;
  estado[select.dataset.disciplina] = select.value || null;
  pintarResultado();
});

if (contenedorTabla) pintarTabla();
if (contenedorControles && contenedorResultado) {
  pintarControles();
  pintarResultado();
}
