import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';
import { authService } from './authService';

export type ApiWorkshop = {
  id: number;
  titulo: string;
  linkMeet: string;
  status: 'ABERTO' | 'INSCRITO' | 'CONCLUIDO' | string;
  instrutorId: number;
  instrutorNome: string;
  dataCriacao: string;
  dataInicio: string;
  dataTermino: string;
  descricao?: {
    id: number;
    tema?: string;
    descricao?: string;
  };
  custo: number;
  capacidade: number;
};

export type UiWorkshop = {
  id: string;
  title: string;
  description: string;
  mentor: { name: string; id?: number };
  date: string;
  durationHours: number;
  startTime: string;
  endTime: string;
  enrolled?: boolean;
  completed?: boolean;
  status?: string;
  linkMeet?: string;
  mine?: boolean;
  tokens?: number;
};

const MONTH_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')} ${MONTH_PT[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function diffHours(a: string, b: string) {
  return Math.round(((new Date(b).getTime() - new Date(a).getTime()) / 36e5) * 10) / 10;
}

function mapToUi(w: ApiWorkshop, currentInstructorId?: number): UiWorkshop {
  const statusNorm = (w.status ?? '').toUpperCase();
  const enrolled = statusNorm === 'INSCRITO' || statusNorm === 'CONCLUIDO';
  const completed = statusNorm === 'CONCLUIDO';
  const mine = currentInstructorId != null ? w.instrutorId === currentInstructorId : undefined;

  return {
    id: String(w.id),
    title: w.titulo,
    description: w.descricao?.descricao ?? '',
    mentor: { name: w.instrutorNome, id: w.instrutorId },
    date: formatDate(w.dataInicio),
    durationHours: diffHours(w.dataInicio, w.dataTermino),
    startTime: formatTime(w.dataInicio),
    endTime: formatTime(w.dataTermino),
    enrolled,
    completed,
    status: w.status,
    linkMeet: w.linkMeet,
    mine,
    tokens: w.custo,
  };
}

export async function listWorkshops(opts?: {
  scope?: 'all' | 'enrolled' | 'mine';
  status?: 'ABERTO' | 'CONCLUIDO' | 'INSCRITO';
}): Promise<UiWorkshop[]> {
  const { scope = 'all', status } = opts ?? {};

  const usuario = authService.getUsuario?.();
  const currentInstructorId =
    usuario && usuario.tipoUsuario === 'INSTRUTOR' ? Number(usuario.id) : undefined;

  let url = API_CONFIG.ENDPOINTS.WORKSHOPS;
  const params: string[] = [];

  if (status) params.push(`status=${encodeURIComponent(status)}`);

  if (scope === 'mine' && currentInstructorId != null) {
    params.push(`instrutorId=${encodeURIComponent(String(currentInstructorId))}`);
  }

  if (params.length) url += `?${params.join('&')}`;

  const data = await apiService.get<ApiWorkshop[]>(url);
  const ui = data.map((w) => mapToUi(w, currentInstructorId));

  if (scope === 'enrolled') return ui.filter((w) => w.enrolled);
  if (scope === 'mine') return ui.filter((w) => w.mine);
  return ui;
}

export async function createWorkshop(payload: {
  titulo: string;
  tema: string;
  descricao: string;
  dataInicio: string;
  dataTermino: string;
  linkMeet?: string;
  custo: number;
  capacidade: number;
}): Promise<UiWorkshop> {
  const body: any = {
    titulo: payload.titulo,
    linkMeet: payload.linkMeet,
    dataInicio: payload.dataInicio,
    dataTermino: payload.dataTermino,
    descricao: {
      tema: payload.tema,
      descricao: payload.descricao,
    },
    custo: payload.custo,
    capacidade: payload.capacidade,
  };

  const created = await apiService.post<ApiWorkshop>(API_CONFIG.ENDPOINTS.WORKSHOPS, body);

  return mapToUi(created);
}
