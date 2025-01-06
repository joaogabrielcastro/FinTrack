import axios, { AxiosError } from "axios";
import { delay } from "./Auth";
import { parseCookies } from "nookies";

interface periodicosForm {
  nomeRevista: string;
  autor: string;
  editora: string;
  exemplar: string;
  clienteId: string;
}

export const getAllPeriodicos = async () => {
  try {
    const { token } = parseCookies();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get("http://127.0.0.1:8000/api/periodicos", {
      headers: headers,
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

export const createPeriodico = async (data: periodicosForm) => {
  try {
    await delay(1300);
    const { token } = parseCookies();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post("http://127.0.0.1:8000/api/periodicos", data, {
      headers: headers,
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
