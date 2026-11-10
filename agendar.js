(() => {
  /* Cole aqui o endereço do app da Web (termina em /exec). Veja apps-script/LEIA-ME.md */
  const ENDPOINT = '';

  const form = document.getElementById('leadForm');
  const msg = document.getElementById('msg');
  const send = document.getElementById('send');
  const done = document.getElementById('done');
  const fallback = document.getElementById('fallback');

  if (!ENDPOINT) { form.hidden = true; fallback.hidden = false; return; }

  const setMsg = (t) => { msg.textContent = t || ''; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMsg('');
    if (!form.checkValidity()) {
      form.reportValidity();
      setMsg('Falta preencher os campos marcados com *.');
      return;
    }

    /* junta caixinhas do mesmo grupo: "Seg, Qua" */
    const fd = new FormData(form);
    const data = {};
    for (const [k, v] of fd.entries()) {
      data[k] = data[k] ? data[k] + ', ' + v : v;
    }

    send.disabled = true;
    const label = send.innerHTML;
    send.textContent = 'Enviando…';
    try {
      /* no-cors: a página não lê a resposta do Google, só envia */
      await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) });
      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      send.disabled = false;
      send.innerHTML = label;
      setMsg('Não consegui enviar agora. Confira sua conexão e tente de novo.');
    }
  });
})();
