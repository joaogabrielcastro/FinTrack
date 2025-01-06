import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

/* Inicialização do Prisma Cliente para a gente ter acesso a base de dados e criação da rota de usuarios no Express */
const prisma = new PrismaClient();
const usersRouter = Router();

/* Rota GET para buscar todos os usuarios dentro do banco de dados
 * Recebe o token dentro do cabecalho da requisição HTTP, verifica se o token esta correto
 * Faz a decodificação do token para buscar as informações dentro do token
 * Se o token estiver correto, ele retorna todos os dados do usuario em um json
 */
usersRouter.get("/user", async (req: Request, res: Response) => {
  try {
    /* Recebe o token de autenticação do cabeçalho da requisição HTTP */
    const authorizationHeader = req.headers.authorization;

    /* Verifica se o usuario passou o token de autenticação dentro do cabeçalho */
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    /* Recebe o token de autenticação */
    const token = authorizationHeader.split(" ")[1];

    /* Se caso não tiver o token de autenticação, ele retorna uma mensagem de erro */
    if (!token) {
      return res.status(401).json({ message: "Token Invalido" });
    }

    /* Faz a decodificação do token para buscar as informações do usuario dentro do token */
    const data = jwt.decode(token);

    /* Retorna todos os dados do usuario */
    res.status(200).json(data);

    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
  } catch (error) {
    res.status(500).json({ message: "Erro de buscar dados do usuario" });
  }
});

/* Rota POST para criar um novo usuario dentro do banco de dados 
 * Recebe pelo corpo da requisição o nome, email e senha do usuario
 * Verifica se o usuario existe no banco de dados
 * Cria o novo usuario no banco de dados e retorna o usuario criado 
*/
usersRouter.post("/user", async (req: Request, res: Response) => {
  try {
    /* Recebe os dados do usuario pelo corpo da requisição */
    const { name, email, password } = req.body;

    /* Verifica se o email do usuario ja existe no banco de dados */
    const existingUser = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    /* Se o usuario existir no banco de dados, ele retorna uma mensagem de erro */
    if (existingUser) {
      return res.status(400).json({ message: "O email fornecido já está em uso." });
    }

    /* Define o tipo de usuario padrão como EMPREGADO */
    const tipo = "EMPREGADO";

    /* Cria o novo usuario no banco de dados */
    const user = await prisma.usuario.create({
      data: {
        nome: name,
        email,
        senha: password,
        tipo: tipo,
      },
    });

    /* Retorna o usuario criado com status 201 */
    res.status(201).json(user);

    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
  } catch (error) {
    console.error("Erro ao criar usuário", error);
    return res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

/* Exporta as rotas criadas para o Express ter acesso */
export default usersRouter;
