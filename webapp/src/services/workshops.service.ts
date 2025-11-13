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

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const TOKEN =
  import.meta.env.VITE_API_TOKEN ??
  localStorage.getItem('auth_token') ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkta25vdy1oYWxsIiwiaWF0IjoxNzYyOTAwNjYwLCJleHAiOjE3NjI5MDQyNjAsInN1YiI6ImdhYnJpZWwubWFyYXNzaUBlbWFpbC5jb20iLCJ0eXAiOiJhY2Nlc3MifQ.-FcRyBA4Fh7iwsHzb9sp5vawGRgokiUUixTzRepSnJY';

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
  };
}

export async function listWorkshops(opts?: {
  scope?: 'all' | 'enrolled' | 'mine';
  instructorId?: number;
}): Promise<UiWorkshop[]> {
  const { scope = 'all', instructorId } = opts ?? {};
  const res = await fetch(`${BASE_URL}/api/workshops`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
  });
  if (res.status === 401 || res.status === 403)
    throw new Error('Não autorizado. Verifique o token.');
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  const data: ApiWorkshop[] = await res.json();
  const ui = data.map((w) => mapToUi(w, instructorId));
  if (scope === 'enrolled') return ui.filter((w) => w.enrolled);
  if (scope === 'mine') return ui.filter((w) => w.mine);
  return ui;
}

export async function createWorkshop(payload: {
  titulo: string;
  descricao: string;
  instrutorId: number;
  dataInicio: string;
  dataTermino: string;
  linkMeet?: string;
}): Promise<UiWorkshop> {
  const res = await fetch(`${BASE_URL}/api/workshops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Erro ao criar workshop (${res.status})`);
  const created: ApiWorkshop = await res.json();
  return mapToUi(created, payload.instrutorId);
}
