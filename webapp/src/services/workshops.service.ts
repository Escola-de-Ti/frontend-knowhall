export type ApiWorkshop = {
    id: number
    titulo: string
    linkMeet: string
    status: string
    instrutorId: number
    instrutorNome: string
    dataCriacao: string
    dataInicio: string
    dataTermino: string
    descricao: {
      id: number
      tema: string
      descricao: string
    }
  }
  
  export type UiWorkshop = {
    id: string
    title: string
    description: string
    mentor: { name: string }
    date: string
    durationHours: number
    startTime: string
    endTime: string
    enrolled?: boolean
  }
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"
  const TOKEN =
    localStorage.getItem("auth_token") ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkta25vdy1oYWxsIiwiaWF0IjoxNzYyOTAwNjYwLCJleHAiOjE3NjI5MDQyNjAsInN1YiI6ImdhYnJpZWwubWFyYXNzaUBlbWFpbC5jb20iLCJ0eXAiOiJhY2Nlc3MifQ.-FcRyBA4Fh7iwsHzb9sp5vawGRgokiUUixTzRepSnJY"
  
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }
  
  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }
  
  function diffHours(startIso: string, endIso: string) {
    const ms = new Date(endIso).getTime() - new Date(startIso).getTime()
    return Math.round((ms / 1000 / 60 / 60) * 10) / 10
  }
  
  function mapToUi(w: ApiWorkshop): UiWorkshop {
    return {
      id: String(w.id),
      title: w.titulo,
      description: w.descricao?.descricao ?? "",
      mentor: { name: w.instrutorNome },
      date: formatDate(w.dataInicio),
      durationHours: diffHours(w.dataInicio, w.dataTermino),
      startTime: formatTime(w.dataInicio),
      endTime: formatTime(w.dataTermino),
      enrolled: false,
    }
  }
  
  export async function listWorkshops(): Promise<UiWorkshop[]> {
    const response = await fetch(`${BASE_URL}/api/workshops`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    })
  
    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`)
  
    const data: ApiWorkshop[] = await response.json()
    return data.map(mapToUi)
  }