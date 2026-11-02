import { diasSemana, horario } from '../data/horario.js';

// Filtros: "todas" muestra todo, "infantil" filtra por la marca infantil,
// el resto filtra por disciplina (incluyendo clases mixtas con .includes).
const FILTROS = [
  { id: 'todas', etiqueta: 'Todas' },
  { id: 'K1', etiqueta: 'K1' },
  { id: 'Boxeo', etiqueta: 'Boxeo' },
  { id: 'BJJ', etiqueta: 'BJJ' },
  { id: 'infantil', etiqueta: 'Infantil' },
];

const estado = { filtro: 'todas' };

const contenedorFiltros = document.querySelector('.horario__filtros');
const contenedorDias = document.querySelector('.horario__dias');

function coincide(clase, filtro) {
  if (filtro === 'todas') return true;
  if (filtro === 'infantil') return clase.infantil;
  return clase.disciplinas.includes(filtro);
}

function clasesDeDia(dia) {
  return horario
    .filter((clase) => clase.dias.includes(dia) && coincide(clase, estado.filtro))
    .toSorted((a, b) => a.inicio.localeCompare(b.inicio));
}

function pintarClase(clase) {
  return `
    <article class="horario__clase">
      <span class="horario__disciplina">${clase.disciplinas.join(' / ')}</span>
      <span class="horario__hora">${clase.inicio}–${clase.fin}</span>
      ${clase.infantil ? '<span class="horario__infantil">Clase infantil</span>' : ''}
    </article>`;
}

function pintarDias() {
  contenedorDias.innerHTML = diasSemana
    .map((dia) => {
      const clases = clasesDeDia(dia);
      const contenido = clases.length
        ? clases.map(pintarClase).join('')
        : '<p class="horario__vacio">No hay clases de este tipo este día.</p>';
      return `
        <div class="horario__dia">
          <h3 class="horario__nombre-dia">${dia}</h3>
          ${contenido}
        </div>`;
    })
    .join('');
}

function pintarFiltros() {
  contenedorFiltros.innerHTML = FILTROS.map(
    (f) =>
      `<button type="button" class="horario__filtro" data-filtro="${f.id}" aria-pressed="${f.id === estado.filtro}">${f.etiqueta}</button>`
  ).join('');
}

contenedorFiltros?.addEventListener('click', (e) => {
  const boton = e.target.closest('.horario__filtro');
  if (!boton) return;
  estado.filtro = boton.dataset.filtro;
  pintarFiltros();
  pintarDias();
});

if (contenedorFiltros && contenedorDias) {
  pintarFiltros();
  pintarDias();
}
