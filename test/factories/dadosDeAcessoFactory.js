// factory para gerar dados de acesso únicos para cada teste, evitando conflitos de email, matrícula e código de disciplina.
export function comDadosUnicos({ aluno, disciplina }) {
    const timestamp = Date.now();
    const [usuario, dominio] = aluno.email.split('@');

    return {
        aluno: {
            ...aluno,
            email: `${usuario}.${timestamp}@${dominio}`,
            matricula: `${aluno.matricula}${timestamp}`,
        },
        disciplina: {
            ...disciplina,
            codigo: `${disciplina.codigo}-${timestamp}`,
        },
    };
}
