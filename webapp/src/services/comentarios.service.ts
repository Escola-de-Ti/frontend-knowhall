import { http } from '../api/http';

export type ComentarioDTO = {
    comentarioId: number;
    postId: number;
    texto: string;
};

export async function getComentariosDoUsuario(usuarioId: number) {
    return (await http.get<ComentarioDTO[]>(`/api/comentarios/usuario/${usuarioId}`)).data;
}

export async function criarComentario(postId: number, texto: string) {
    return (await http.post<ComentarioDTO>('/api/comentarios', { postId, texto })).data;
}

export async function excluirComentario(comentarioId: number) {
    return (await http.delete(`/api/comentarios/${comentarioId}`)).data;
}

export async function editarComentario(comentarioId: number, conteudo: string) {
    return (await http.put<ComentarioDTO>(`/api/comentarios/${comentarioId}`, { conteudo })).data;
}
