export function getRelativeTime(isoDate: string): string {
  const now = new Date();
  const past = new Date(isoDate);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'agora';
  } else if (minutes < 60) {
    return `${minutes}min atrás`;
  } else if (hours < 24) {
    return `${hours}h atrás`;
  } else if (days < 7) {
    return days === 1 ? '1 dia atrás' : `${days} dias atrás`;
  } else if (weeks < 4) {
    return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`;
  } else if (months < 12) {
    return months === 1 ? '1 mês atrás' : `${months} meses atrás`;
  } else {
    return years === 1 ? '1 ano atrás' : `${years} anos atrás`;
  }
}

export function getInitials(nomeCompleto: string): string {
  if (!nomeCompleto || nomeCompleto.trim() === '') {
    return '??';
  }

  const partes = nomeCompleto.trim().split(/\s+/);

  if (partes.length === 1) {
    const nome = partes[0];
    return nome.length > 1
      ? (nome[0] + nome[1]).toUpperCase()
      : (nome[0] + nome[0]).toUpperCase();
  }

  const primeiroNome = partes[0];
  const ultimoNome = partes[partes.length - 1];

  return (primeiroNome[0] + ultimoNome[0]).toUpperCase();
}


export function calculateLevel(qntdXp: number): number {
  if (!qntdXp || qntdXp <= 0) return 1;
  return Math.max(1, Math.floor(Math.sqrt(qntdXp / 100)));
}