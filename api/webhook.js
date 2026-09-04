// Vercel Serverless Function: Webhook InfinitePay
// Endpoint: https://andreavargas.hair/api/webhook

const FIREBASE_API_KEY = 'AIzaSyCIxpbjSupHVYpPCutkVjPlOhTLAc1bLjU';

export default async function handler(req, res) {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Se for GET, responde informando que o serviço está ativo (para testes)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      message: 'Webhook InfinitePay ativo e pronto para receber notificações da Imersão O Poder da Cor.',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body || {};
    console.log('[Webhook InfinitePay] Payload recebido:', JSON.stringify(payload));

    // Extrai o e-mail e nome do comprador em diferentes formatos possíveis da InfinitePay
    let email = null;
    let name = null;

    if (payload.customer) {
      email = payload.customer.email;
      name = payload.customer.name;
    } else if (payload.buyer) {
      email = payload.buyer.email;
      name = payload.buyer.name;
    } else if (payload.client) {
      email = payload.client.email;
      name = payload.client.name;
    } else if (payload.data?.customer) {
      email = payload.data.customer.email;
      name = payload.data.customer.name;
    } else if (payload.email) {
      email = payload.email;
      name = payload.name;
    }

    if (!email) {
      console.warn('[Webhook InfinitePay] Nenhum e-mail identificado no payload.');
      return res.status(200).json({
        received: true,
        warning: 'Nenhum e-mail encontrado para cadastrar'
      });
    }

    email = email.trim().toLowerCase();
    console.log(`[Webhook InfinitePay] Processando aluna: ${email} (${name || 'Sem nome'})`);

    // 1. Cria a conta no Firebase com uma senha inicial segura
    const defaultPassword = 'cor' + Math.floor(100000 + Math.random() * 900000);
    
    const signUpResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: defaultPassword,
          returnSecureToken: true
        })
      }
    );

    const signUpData = await signUpResponse.json();

    if (signUpData.error && signUpData.error.message !== 'EMAIL_EXISTS') {
      console.error('[Webhook InfinitePay] Erro ao criar conta no Firebase:', signUpData.error);
    } else {
      console.log(`[Webhook InfinitePay] Conta criada/verificada com sucesso no Firebase para ${email}`);
    }

    // 2. Dispara e-mail oficial do Firebase para a aluna definir a senha dela
    const resetResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email
        })
      }
    );

    const resetData = await resetResponse.json();
    console.log(`[Webhook InfinitePay] E-mail de ativação/senha disparado para ${email}:`, resetData);

    return res.status(200).json({
      success: true,
      message: `Acesso criado com sucesso para ${email}! E-mail de ativação enviado.`,
      email: email
    });

  } catch (err) {
    console.error('[Webhook InfinitePay] Erro interno no processamento:', err);
    // Sempre retorna 200 para a InfinitePay não tentar reenviar indefinidamente em caso de erro
    return res.status(200).json({
      received: true,
      error: err.message
    });
  }
}
