import { expect } from 'chai';
import { api } from './helpers/api.js';
import { comTokenDeAdmin, comTokenDeAluno } from './helpers/auth.js';
import { comDadosUnicos } from './factories/dadosDeAcessoFactory.js';
import { validarRespostaEntrega, validarRespostaLista } from './helpers/validarRepostas.js';
import fixtureEntrega from './fixtures/entregaTrabalho.json' with { type: 'json' };

const { cenarios } = fixtureEntrega;

describe('Fluxo: admin cadastra aluno e aluno registra a entrega de um trabalho', () => {

    cenarios.forEach((cenario) => {
        it(cenario.titulo, async () => {

            // Arrange: cadastro de aluno e disciplina
            const { aluno, disciplina } = comDadosUnicos(cenario);
            const authAdmin = await comTokenDeAdmin();

            const cadastroAlunoRes = await api()
                .post('/api/admin/alunos')
                .set('Authorization', authAdmin)
                .send(aluno);

            expect(cadastroAlunoRes.status).to.equal(201);
            expect(cadastroAlunoRes.body.email).to.equal(aluno.email);
            const alunoId = cadastroAlunoRes.body.id;

            const cadastroDisciplinaRes = await api()
                .post('/api/admin/disciplinas')
                .set('Authorization', authAdmin)
                .send(disciplina);

            expect(cadastroDisciplinaRes.status).to.equal(201);
            const disciplinaId = cadastroDisciplinaRes.body.id;

            if (cenario.matricular) {
                const matriculaRes = await api()
                    .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                    .set('Authorization', authAdmin)
                    .send({ alunoId });

                expect(matriculaRes.status).to.equal(201);
            }

            // Act: login do aluno, entrega do trabalho
            const authAluno = await comTokenDeAluno(aluno.email, aluno.senha);

            const entregaRespostas = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Authorization', authAluno)
                .send({ disciplinaId, ...cenario.trabalho });

            // Assert
            expect(entregaRespostas.status).to.equal(cenario.esperado.status);

            const listaResposta = await api()
                .get(`/api/alunos/${alunoId}/trabalhos`)
                .set('Authorization', authAluno);

            expect(listaResposta.status).to.equal(200);

            validarRespostaEntrega(entregaRespostas, alunoId, disciplinaId, cenario.trabalho, cenario.esperado);
            validarRespostaLista(listaResposta, entregaRespostas.body.id);

        });
    });
});
