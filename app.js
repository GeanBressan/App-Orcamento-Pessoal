class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let despesas = Array()

        let id = localStorage.getItem('id')
        
        //recuperar todas as despesas cadastradas em localstorage
        for(let i = 1; i <= id; i++) {
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            
            if(despesa === null) {
                continue
            }
            
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descriçao
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value, 
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()) {
        bd.gravar(despesa)
        //dialog sucesso
        document.getElementById('modalLabel').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modalLabel').className = 'text-success'
        document.getElementById('modalText').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modalBtn').innerHTML = 'Voltar'
        document.getElementById('modalBtn').className = 'btn btn-success'
        $('#modalRegistraDespesa').modal('show')

        //limpar campos do formulario
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        //dialog erro
        document.getElementById('modalLabel').innerHTML = 'Erro na Gravação'
        document.getElementById('modalLabel').className = 'text-danger'
        document.getElementById('modalText').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
        document.getElementById('modalBtn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modalBtn').className = 'btn btn-danger'
        $('#modalRegistraDespesa').modal('show')
    }
}

function carregarListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    //limpa tabela
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d) {
        //formatando data
        if(parseInt(d.dia) < '10') {
            d.dia = '0' + d.dia
        }
        
        if(parseInt(d.mes) < '10') {
            d.mes = '0' + d.mes
        }

        //formatando tipo
        if(d.tipo === '1') {
            d.tipo = 'Alimentação'
        } else if(d.tipo === '2') {
            d.tipo = 'Educação'
        } else if(d.tipo === '3') {
            d.tipo = 'Lazer'
        } else if(d.tipo === '4') {
            d.tipo = 'Saúde'
        } else if(d.tipo === '5') {
            d.tipo = 'Transporte'
        }

        //formatando valor 
        valor = parseFloat(d.valor)

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criando as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        //criar o botao de exclusão
        let btn = document.createElement('button')
        btn.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>'
        btn.className = 'btn btn-danger'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            document.getElementById('modalLabel').innerHTML = 'Registro deletado com sucesso'
            document.getElementById('modalLabel').className = 'text-success'
            document.getElementById('modalText').innerHTML = 'Despesa foi deletada com sucesso!'
            document.getElementById('modalBtn').innerHTML = 'Voltar'
            document.getElementById('modalBtn').className = 'btn btn-success'
            $('#modalDeletaDespesa').modal('show')
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    let despesas = bd.pesquisar(despesa)

    carregarListaDespesas(despesas, true)
}