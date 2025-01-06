import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

/* Inicio da configuração do dotenv
 * Biblioteca que serve para conseguir usar as variaveis do arquivo .env
 * Exemplo de uso: process.env.VARIAVEL 
 */
dotenv.config();

/* Inicialização do Prisma Cliente para a gente ter acesso a base de dados e criação da rota de autenticação no Express */
const prisma = new PrismaClient();
const authRouter = Router();

/* Rota POST para autenticar o usuário 
 * Recebe detro do corpo da requisição o email e a senha do usuário e autentica o mesmo no banco de dados 
 * Criando um token que expira em 24 horas, caso o usuário exista 
 * Retorna um token de autenticação e os dados do usuário autenticado 
 * Se o usuário não existir, retorna uma mensagem de erro
 */
authRouter.post("/auth", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificação se recebeu todos os itens corretamente do body
    if (!email || password !== password) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
  
    // Busca o usuario no banco de dados pelo email 
    const user = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    // Verifica se o usuario existe
    if (user) {
      // Verifica se a senha esta correta comparando a senha criptografada com a senha informada
      if (user.senha === password) {
        // Cria um token que expira em 24 horas
        const expiresIn = 60 * 60 * 24;

        // Cria o token jwt com os dados do usuário e a chave secreta que vem do arquivo .env 
        const token = jwt.sign({ user }, process.env.SECRET_KEY_JWT as string, { expiresIn });

        // Retorna o token
        console.log(token);
        
        // Retorna o token e os dados do usuário se o processo de autenticação foi bem-sucedido
        res.status(200).json({
          token: `${token}`,
          user: {
            id: user.id,
            name: user.nome,
            email: user.email,
          },
        });

        // Caso o usuário não exista ou a senha esteja incorreta, retorna uma mensagem de erro
      } else {
        res.status(401).json({ message: "Credenciais inválidas" });
      }
    } else {
      res.status(401).json({ message: "Credenciais inválidas" });
    }
  } catch (error) {
    console.log("Erro de autenticação: ", error);
    res.status(500).json({ message: "Erro de autenticação" });
  }
});

/* Exporta as rotas criadas para o Express ter acesso */
export default authRouter;
