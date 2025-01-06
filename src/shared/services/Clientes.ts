import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { clienteHandle } from "../types/Clients";
import { delay } from "./Auth";


export const registerCliente = async ({
  nomeDaEmpresa,
  cnpj,
  email,
  telefone,
  filialID,
  informacoesAdicionais,
}: clienteHandle) => {
  try {
    const { token } = parseCookies();
    const headers = {
        Authorization : `Bearer ${token}`
    }
    await delay(1300);

    const response = await axios.post("http://127.0.0.1:8000/api/clientes", {
      nomeDaEmpresa,
      cnpj,
      email,
      telefone,
      filialID,
      informacoesAdicionais,
    }, {headers: headers});
    
    if (response.status === 201) {
      return { success: true, message: "Cliente criado com sucesso!" };
    }
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

export const getAllClients = async () => {
  try {
    const { token } = parseCookies();
    const headers = {
        Authorization : `Bearer ${token}`
    }
    const response = await axios.get("http://127.0.0.1:8000/api/clientes", {headers: headers});
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
}