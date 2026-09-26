import { api } from './api.js';

export async function getToken(userName, passUser) {
    const res = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: userName, senha: passUser });

    if (!res.body.token) {
        throw new Error(`Falha no login de "${userName}": status ${res.status} - ${res.body.error}`);
    }
    return res.body.token;
}

let cachedAdminToken = null;

// Login do Admin: credenciais vêm do .env (ADMIN_EMAIL / ADMIN_PASSWORD).
export async function comTokenDeAdmin() {
    if(!cachedAdminToken) {
        const  loginResposta = await getToken(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
        cachedAdminToken = loginResposta;
    }
    return `Bearer ${cachedAdminToken}`;
}

// Login do Aluno: as credenciais são as do aluno cadastrado no próprio teste,
// por isso não há cache (cada aluno tem o seu token).
export async function comTokenDeAluno(email, senha) {
    return `Bearer ${await getToken(email, senha)}`;
}