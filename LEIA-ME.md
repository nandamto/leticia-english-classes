# Formulário → planilha (passo a passo para a Letícia)

Tudo isso é feito na conta Google da Letícia. Leva uns 10 minutos.

1. Abra o **Google Sheets** e crie uma planilha em branco chamada **Interessados · English Classes**.
2. Na planilha, clique em **Extensões → Apps Script**.
3. Apague o código que aparece, cole todo o conteúdo do arquivo `Code.gs` e troque `COLOQUE_O_EMAIL_DA_LETICIA_AQUI` pelo e-mail que vai receber os avisos. Clique em **Salvar** (ícone de disquete).
4. Clique em **Implantar → Nova implantação**. Na engrenagem, escolha **App da Web** e preencha:
   - **Executar como:** Eu (o e-mail dela)
   - **Quem pode acessar:** Qualquer pessoa
5. Clique em **Implantar**. O Google vai pedir autorização: **Autorizar acesso → escolha a conta → Avançado → Acessar (não seguro) → Permitir**. O aviso aparece porque o código é dela e não foi verificado pelo Google; é normal.
6. Copie o **URL do app da Web** (termina em `/exec`) e mande para a Nanda.
7. Teste: cole esse URL no navegador. Deve aparecer `{"ok":true,"status":"online"}`.

## Depois de publicado
- Cada envio vira uma linha na aba **Interessados** e chega um e-mail de aviso (o Gmail gratuito envia até 100 e-mails por dia).
- Se o código for alterado, é preciso **Implantar → Gerenciar implantações → editar → Nova versão**; o URL continua o mesmo.
- Para parar de receber envios, vá em **Gerenciar implantações** e arquive a implantação.
