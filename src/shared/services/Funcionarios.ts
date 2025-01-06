import axios, { AxiosError } from "axios";
import { delay } from "./Auth";
import { parseCookies } from "nookies";

interface empregadoHandler {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface estagiarioHandler {
  id: number;
  nome: string;
  email: string;
  nomeCurso: string;
  dataInicio: string;
  responsavel: string;
}

export const createFuncionarios = async (funcionarios: empregadoHandler) => {
  try {
    await delay(1300);
    const { token } = parseCookies();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post("http://127.0.0.1:8000/api/funcionarios", funcionarios, {
      headers,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        return { success: false, message: "Não autorizado" };
      } else {
        return { success: false, message: `Erro desconhecido: ${status}` };
      }
    } else if (err.request) {
      return { success: false, message: "Sem resposta do servidor" };
    } else {
      return { success: false, message: "Erro desconhecido ao enviar solicitação" };
    }
  }
};

export const createEstagario = async (estagiarios: estagiarioHandler) => {
  try {
    await delay(1300);
    const { token } = parseCookies();
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    const response = await axios.post("http://127.0.0.1:8000/api/estagiario", estagiarios, {
      headers,
    })
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if(err.response){
      const status = err.response.status;
      if(status === 401){
        return { success: false, message: "Não autorizado" };
      } else {
        return { success: false, message: `Erro desconhecido: ${status}` };
      }
    }
  }
}

export const getFuncionarios = async () => {
  try {
    const { token } = parseCookies();
    const response = await axios.get("http://127.0.0.1:8000/api/funcionarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        return { success: false, message: "Não autorizado" };
      } else {
        return { success: false, message: `Erro desconhecido: ${status}` };
      }
    } else if (err.request) {
      return { success: false, message: "Sem resposta do servidor" };
    } else {
      return { success: false, message: "Erro desconhecido ao enviar solicitação" };
    }
  }
};

export const updateFuncionarios = async (idFuncionario: number, funcionarios: empregadoHandler) => {
  try {
    const { token } = parseCookies();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.put(
      `http://127.0.0.1:8000/api/funcionarios/${idFuncionario}`,
      funcionarios,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        return { success: false, message: "Não autorizado" };
      } else {
        return { success: false, message: `Erro desconhecido: ${status}` };
      }
    } else if (err.request) {
      return { success: false, message: "Sem resposta do servidor" };
    } else {
      return { success: false, message: "Erro desconhecido ao enviar solicitação" };
    }
  }
};
