/**
 * English Classes · Letícia Araújo
 * Recebe os envios da página agendar.html, grava uma linha na planilha
 * e avisa a Letícia por e-mail.
 *
 * Use este código dentro da planilha: Extensões → Apps Script.
 */

// ▼ Troque pelo e-mail que vai receber os avisos
const NOTIFY_EMAIL = 'leticiasaraujo93@gmail.com';

const SHEET_NAME = 'Interessados';
const HEADERS = [
  'Data', 'Nome', 'Sobrenome', 'E-mail', 'WhatsApp', 'Já estudou inglês?', 'Como foi',
  'Período', 'Dias', 'Primeiro sentimento sobre inglês'
];
const MAX_LEN = 2000;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const p = (e && e.parameter) || {};

    // campo escondido: se vier preenchido, é robô. Responde "ok" e ignora.
    if (p.website) return json_({ ok: true });

    const nome = clean_(p.nome), email = clean_(p.email), whats = clean_(p.whatsapp);
    if (!nome || !email || !whats) return json_({ ok: false, error: 'Campos obrigatórios ausentes.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ ok: false, error: 'E-mail inválido.' });
    if (p.consent !== 'on') return json_({ ok: false, error: 'Consentimento ausente.' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#F4E9DB');
    }

    const row = [
      new Date(), nome, clean_(p.sobrenome), email, whats, clean_(p.estudou), clean_(p.como_foi),
      clean_(p.periodo), clean_(p.dia), clean_(p.sentimento)
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL && NOTIFY_EMAIL.indexOf('@') > 0) {
      const linhas = HEADERS.map(function (h, i) {
        return h + ': ' + (i === 0 ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') : row[i]);
      });
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: email,
        subject: 'Novo interessado em aulas: ' + nome + ' ' + clean_(p.sobrenome),
        body: linhas.join('\n') + '\n\n(Todas as respostas ficam na planilha, aba "' + SHEET_NAME + '".)'
      });
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Abrir o endereço /exec no navegador deve mostrar {"ok":true,"status":"online"}
function doGet() {
  return json_({ ok: true, status: 'online' });
}

function clean_(v) {
  let s = String(v == null ? '' : v).replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, MAX_LEN);
  // evita que a planilha trate o texto como fórmula
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
