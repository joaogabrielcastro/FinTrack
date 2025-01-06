import axios, { AxiosError } from "axios";
import { delay } from "./Auth";
import { parseCookies } from "nookies";

interface empresaHandler {
  id?: number;
  nome: string;
  tipo: string;
}

export const createEmpresa = async (empresa: empresaHandler) => {
  try {
    await delay(1300);
    const { token } = parseCookies();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.post("http://127.0.0.1:8000/api/empresas", empresa, {
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

export const getAllEmpresa = async () => {
  try {
    const { token } = parseCookies();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get("http://127.0.0.1:8000/api/empresas", { headers: headers });
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
