export function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const bar = loader.querySelector('.loader-bar-fill');
  const percent = loader.querySelector('.loader-percent');
  const loaderText = loader.querySelector('.loader-text');

  const lines = ['INICIALIZANDO...', 'CARGANDO EFECTOS...', 'LISTO'];
  let lineIdx = 0;
  let prog = 0;

  const interval = setInterval(() => {
    prog += Math.random() * 18 + 8;
    if (prog > 100) prog = 100;

    if (bar) bar.style.width = prog + '%';
    if (percent) percent.textContent = Math.floor(prog) + '%';

    if (prog >= 33 && lineIdx === 0) { lineIdx = 1; if (loaderText) loaderText.textContent = lines[1]; }
    if (prog >= 80 && lineIdx === 1) { lineIdx = 2; if (loaderText) loaderText.textContent = lines[2]; }

    if (prog >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('loader-out');
        setTimeout(() => loader.remove(), 700);
      }, 400);
    }
  }, 120);
}
