export interface Funcionario {
    id:string
    nome:string
    tipo:string
  }
  
export interface usuarioHandler {
    id: number;
    nome: string;
    email: string;
    senha: string;
    confirmSenha: string;
    tipo: "ADMINISTRADOR" | "EMPREGADO" | "ESTAGIARIO";
    clienteId?: string;
    estagiarioId?: string;
    empregadoId?: string;
  }