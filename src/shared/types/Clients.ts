export interface clienteHandle {
  nomeDaEmpresa: string;
  cnpj: string;
  email: string;
  telefone: string;
  filialID?: number;
  informacoesAdicionais: string;
}

export interface Contato {
    id: number;
    email: string;
    telefone: string;
    clienteId: number;
  }
  
export interface Cliente {
    contatos: Contato[];
    id: number;
    nomeEmpresa: string;
    cnpj: string;
    email: string;
    telefone: string;
    informacoesAdicionais: string;
  }
  
export interface clienteHandle {
    nomeDaEmpresa: string;
    cnpj: string;
    email: string;
    telefone: string;
    filialID?: number;
    informacoesAdicionais: string;
  }