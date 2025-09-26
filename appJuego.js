let victorias = 0;
let derrotas = 0;
let empates = 0;

function jugar(eleccionJugador) {
  const opciones = ['piedra', 'papel', 'tijera'];
  const eleccionComputadora = opciones[Math.floor(Math.random() * 3)];

  let resultadoTexto = `Elegiste: ${eleccionJugador} | Computadora eligió: ${eleccionComputadora}<br>`;

  if (eleccionJugador === eleccionComputadora) {
    resultadoTexto += "🤝 ¡Empate!";
    empates++;
  } else if (
    (eleccionJugador === 'piedra' && eleccionComputadora === 'tijera') ||
    (eleccionJugador === 'papel' && eleccionComputadora === 'piedra') ||
    (eleccionJugador === 'tijera' && eleccionComputadora === 'papel')
  ) {
    resultadoTexto += "✅ ¡Ganaste!";
    victorias++;
  } else {
    resultadoTexto += "❌ ¡Perdiste!";
    derrotas++;
  }

  document.getElementById("resultado").innerHTML = resultadoTexto;
  document.getElementById("victorias").textContent = victorias;
  document.getElementById("derrotas").textContent = derrotas;
  document.getElementById("empates").textContent = empates;
}
