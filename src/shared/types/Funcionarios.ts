export interface Funcionario {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    filialId?: string;
    endereco: string;
  }
  
  interface Estagiario extends Funcionario {
    id: number;
    nome: string;
    email: string;
    nomeCurso: string;
    dataInicio: string;
    filialId?: string;
    responsavel: number;
  }
  
  interface Empregado extends Funcionario {
    cargo: string;
  }
  
  export type FuncionarioForm = Funcionario | Estagiario | Empregado;