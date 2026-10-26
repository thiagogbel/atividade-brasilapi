// Atividade 1 - Calendário de feriados com a BrasilAPI
// Aluno(a): ________________________

const campoAno = document.getElementById('ano')
const tabela = document.getElementById('tabelaFeriados')
const mensagem = document.getElementById('mensagem')
const total = document.getElementById('total')
const proximo = document.getElementById('proximo')

const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// TODO 1: preencher o campo com o ano atual
campoAno.value = new Date().getFullYear()

function consultarFeriados() {
    const ano = campoAno.value
    tabela.innerHTML = ''
    mensagem.innerHTML = ''
    mensagem.className = ''
    total.innerHTML = ''
    proximo.innerHTML = ''

    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(resposta => {
            // TODO 2: se a resposta nao for ok, lanca um erro
            if (!resposta.ok) {
                throw new Error('Ano inválido! Digite um ano entre 1900 e 2199.')
            }
            return resposta.json()
        })
        .then(feriados => {
            console.log(feriados)

            // TODO 3: total de feriados
            total.innerHTML = `Total de feriados em ${ano}: <strong>${feriados.length}</strong>`

            feriados.forEach(feriado => {
                // Dica: o 'T12:00:00' evita erro de fuso horario
                const data = new Date(feriado.date + 'T12:00:00')

                // TODO 4: data no padrao brasileiro
                const dataBR = data.toLocaleDateString('pt-BR')

                // TODO 5: dia da semana
                const numeroDia = data.getDay()
                const diaSemana = diasDaSemana[numeroDia]

                // TODO 6: destacar sabado (6) e domingo (0)
                let classe = ''
                if (numeroDia === 0 || numeroDia === 6) {
                    classe = 'fim-de-semana'
                }

                tabela.innerHTML += `
                    <tr class="${classe}">
                        <td>${dataBR}</td>
                        <td>${diaSemana}</td>
                        <td>${feriado.name}</td>
                    </tr>`
            })

            mostrarProximoFeriado(feriados)
        })
        .catch(erro => {
            // TODO 7: mostrar a mensagem de erro na pagina
            mensagem.className = 'erro'
            mensagem.innerHTML = erro.message
            console.log(erro)
        })
}

// Desafio extra: proximo feriado a partir de hoje
function mostrarProximoFeriado(feriados) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    // find devolve o primeiro feriado que ainda nao passou
    const feriado = feriados.find(f => new Date(f.date + 'T12:00:00') >= hoje)

    if (feriado) {
        const data = new Date(feriado.date + 'T12:00:00')
        data.setHours(0, 0, 0, 0)

        // diferenca em milissegundos convertida para dias
        const dias = Math.round((data - hoje) / (1000 * 60 * 60 * 24))

        let texto = `Faltam <strong>${dias}</strong> dias`
        if (dias === 0) texto = '<strong>É hoje!</strong>'
        if (dias === 1) texto = 'Falta <strong>1</strong> dia'

        proximo.innerHTML = `
            <p>Próximo feriado: <strong>${feriado.name}</strong> (${data.toLocaleDateString('pt-BR')})</p>
            <p>${texto}</p>`
        proximo.className = 'destaque'
    } else {
        proximo.className = ''
    }
}

document.getElementById('btnConsultar').addEventListener('click', consultarFeriados)

// Consulta o ano atual assim que a pagina abre
consultarFeriados()
