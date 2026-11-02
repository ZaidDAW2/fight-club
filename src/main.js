import './styles/main.scss';
import './js/pintarHorario.js';
import './js/calculadora.js';

// Número de WhatsApp PROVISIONAL. Cámbialo aquí, en un único sitio.
const WHATSAPP = '34600000000';
const MENSAJE_PRUEBA = 'Hola, vengo de la web y quiero probar una clase';

const enlacePrueba = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAJE_PRUEBA)}`;
const enlaceChat = `https://wa.me/${WHATSAPP}`;

document.querySelectorAll('.js-whatsapp').forEach((a) => {
  a.href = enlacePrueba;
});
document.querySelectorAll('.js-whatsapp-contacto').forEach((a) => {
  a.href = enlaceChat;
});
