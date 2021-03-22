import axios from 'axios'
import { mostrarMensagem } from './mensagemReducer'

const http = axios.create({
    baseURL: 'https://minhastarefas-api.herokuapp.com'
})

const ACTIONS = {
    LISTAR: 'TAREFAS_LISTAR',
    ADD: 'TAREFAS_ADD',
    REMOVER: 'TAREFAS_REMOVER',
    UPDATE_STATUS: 'TAREFAS_UPDATE_STATUS'
}

const ESTADO_INICIAL = {
    tarefas: []
}

export const tarefaReducer = (state = ESTADO_INICIAL, action) => {
    switch(action.type){
        case ACTIONS.LISTAR:
            return {...state, tarefas: action.tarefas }
        case ACTIONS.ADD:
            return {...state, tarefas: [...state.tarefas, action.tarefa] }
        case ACTIONS.REMOVER:
            const id = action.id
            const tarefas = state.tarefas.filter( tarefas => tarefas.id !== id)
            return {...state, tarefas: tarefas}
        case ACTIONS.UPDATE_STATUS:
            const lista = [...state.tarefas]
            lista.forEach(tarefa => {
                if(tarefa.id === action.id){
                    tarefa.done = true;
                }
            })
            return {...state, tarefas: lista}
        default:
            return state;
    }
}

export function listar(){
    return dispach => {
        http.get('/tarefas', {
            headers: {'x-tenant-id' : localStorage.getItem('email_usuario_logado')}
        }).then(response => {
            dispach({
                type: ACTIONS.LISTAR,
                tarefas: response.data
            })
        })
    }
}

export function salvar(tarefa){
    return dispach => {
        http.post('/tarefas', tarefa, {
            headers: {'x-tenant-id' : localStorage.getItem('email_usuario_logado')}
        }).then(response => {
            dispach([{
                type: ACTIONS.ADD,
                tarefa: response.data
            }, mostrarMensagem('Tarefa salva com sucesso!')])
        })
    }
}

export function deletar (id){
    return dispatch => {
        http.delete(`/tarefas/${id}`, {
            headers: {'x-tenant-id' : localStorage.getItem('email_usuario_logado')}
        }).then(response => {
            dispatch([{
                type: ACTIONS.REMOVER,
                id: id
            }, mostrarMensagem('Tarefa excluida com sucesso!')])
        })
    }
}

export function alterarStatus(id){
    return dispach => {
        http.patch(`tarefas/${id}`, null, {
            headers: {'x-tenant-id' : localStorage.getItem('email_usuario_logado')}
        }).then(response => {
            dispach([{
                type: ACTIONS.UPDATE_STATUS,
                id: id
            }, mostrarMensagem('Tarefa alterada com sucesso!')])            
        })
    }

    
}