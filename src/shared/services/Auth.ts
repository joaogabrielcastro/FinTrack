import { setCookie } from "nookies";
import axios from 'axios'

interface AuthenticateInterface {
  email: string;
  password: string;
}

export const delay  = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const authenticateUser = async ({ email, password }: AuthenticateInterface) => {

    await delay(1000);

    const response = await axios.post("http://127.0.0.1:8000/api/auth", { email: email, password: password });

    if(response.status === 200){
        console.log(response.data)
        const token = response.data.token

        setCookie(null, "token", token, {
            maxAge: 60 * 60 * 24
        })

        return {success: true, message: "Usuário autenticado com sucesso!"}
    }
    
    else{
        return {success: false, message: "Falha na autenticação"}
    }
}

export async function recoverUserInformation(token: string){
    const headers = {
        Authorization : `Bearer ${token}`
    }

    try{
        const response = await axios.get("http://127.0.0.1:8000/api/user", {headers: headers})
        const data = response.data
        return data.user;
    } catch(error){
        console.error("Erro ao autenticar o usuário", error)
        throw error
    }
}