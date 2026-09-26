import { expect } from 'chai';

export function validarRespostaEntrega(resposta, alunoId, disciplinaId, trabalho, esperado) {
    if (esperado.status === 201) {
        expect(resposta.body).to.include({
            alunoId,
            disciplinaId,
            titulo: trabalho.titulo,
            descricao: trabalho.descricao ?? null,
            ...esperado.trabalho,
        });
        expect(resposta.body).to.have.property('id').that.is.a('string');
        expect(resposta.body).to.have.property('dataEntrega');
    } else {
        expect(resposta.body.error).to.equal(esperado.mensagem);
    }
}

export function validarRespostaLista(listaResposta, entregaId) {
    expect(listaResposta.status).to.equal(200);
    if (entregaId) {
        expect(listaResposta.body.map((t) => t.id)).to.include(entregaId);
    } else {
        expect(listaResposta.body).to.be.empty;
    }
}