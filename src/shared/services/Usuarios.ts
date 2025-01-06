import { parseCookies } from "nookies";
import { delay } from "./Auth";
import axios, { AxiosError } from "axios";

interface Usuario {
 nome: string;
 email: string;
 senha: string;
 tipo: "ADMINISTRADOR" | "EMPREGADO" | "ESTAGIARIO";
 clienteId?: string;
 estagiarioId?: string;
 empregadoId?: string;
}

const getAuthHeaders = () => {
 const { token } = parseCookies();
 return {
    Authorization: `Bearer ${token}`,
 };
};

const handleError = (error: AxiosError) => {
 if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        return { success: false, message: "Não autorizado" };
      case 400:
        return { success: false, message: "E-mail já cadastrado!" };
      default:
        return { success: false, message: `Erro desconhecido: ${status}` };
    }
 } else if (error.request) {
    return { success: false, message: "Sem resposta do servidor" };
 } else {
    return { success: false, message: "Erro desconhecido ao enviar solicitação" };
 }
};

export const createUsuario = async (usuario: Usuario) => {
 try {
    await delay(1300);
    const headers = getAuthHeaders();
    const response = await axios.post("http://127.0.0.1:8000/api/usuarios", usuario, {
      headers: headers,
    });
    return response.data;
 } catch (error) {
    console.log(error);
    return handleError(error as AxiosError);
 }
};

export const getAllUsuarios = async () => {
 try {
    const headers = getAuthHeaders();
    const response = await axios.get("http://127.0.0.1:8000/api/usuarios", {
      headers: headers,
    })
    return response.data;
 } catch (error) {
    console.log(error);
    return handleError(error as AxiosError);
 }
};
