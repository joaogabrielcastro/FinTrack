import { AxiosError } from "axios";
import { delay } from "@/shared/services/Auth";
import axios from "axios";

interface RegisterInterface {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
}: RegisterInterface) => {
  try {
    await delay(1000);

    if (password !== confirmPassword) {
      return { success: false, message: "Senhas não conferem" };
    }

    const response = await axios.post("http://127.0.0.1:8000/api/user", { name, email, password });

    if (response.status === 201) {
      return { success: true, message: "Usuário criado com sucesso!" };
    }
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      const status = err.response.status;
      if (status === 400) {
        return { success: false, message: "Email já existe!" };
      } else if (status === 401) {
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
