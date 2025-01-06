import { Request, Response, NextFunction, Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

/* Inicio da configuração do dotenv
 * Biblioteca que serve para conseguir usar as variaveis do arquivo .env
 * Exemplo de uso: process.env.VARIAVEL
 */
dotenv.config();

/* Inicialização do Prisma Cliente para a gente ter acesso a base de dados e criação da rota de clientes no Express */
const prisma = new PrismaClient();
const clientesRouter = Router();

/* Função para verificar se o usuario está passando o token de autenticação no cabeçalho da requisição HTTP
 * Caso o token esteja correto, ele passa para a funcionalidade da rota, caso contrário, retorna uma mensagem de erro
 * Cada rota da API tem que ter essa verificação para garantir que o usuário esteja autenticado
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Recebe o token de autenticação do cabeçalho da requisição HTTP
  const authorizationHeader = req.headers.authorization;

  // Verifica se o token de autenticação existe, se nao existir, retorna uma mensagem de erro
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Token Invalido" });
  }

  // Recebe o token de autenticação
  const token = authorizationHeader.split(" ")[1];
  // Verifica se o token de autenticação esta correto
  if (!token) {
    return res.status(401).json({ message: "Token Invalido" });
  }

  // Verifica se o token de autenticação esta correto passando a função verify do jsonwebtoken, a chave secreta do arquivo .env e o token de autenticação
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT as string);
    
    // Caso o token esteja correto, ele passa para a funcionalidade da rota
    if (decoded) {
      next();
    }

    // Caso o token esteja incorreto, retorna uma mensagem de erro
  } catch (error) {
    return res.status(401).json({ message: "Token Invalido" });
  }
};

/* Rota GET para buscar todos os clientes dentro do banco de dados
 * Recebe o token de autenticação e se o token estiver correto, ele retorna todos os dados do cliente
 * Caso o token esteja incorreto, ele retorna uma mensagem de erro
 */
clientesRouter.get("/clientes", verifyToken, async (req: Request, res: Response) => {
  try {
    // Busca todos os clientes dentro do banco de dados
    const clientes = await prisma.cliente.findMany({
      include: {
        contatos: true,
      },
    });
    // Retorna todos os dados do cliente
    res.status(200).json(clientes);

    // Caso o algo de errado dentro do try, ele retorna uma mensagem de erro
  } catch (error) {
    res.status(500).json({ message: "Erro de buscar dados do cliente" });
  }
});

/* Rota POST para criar um novo cliente dentro do banco de dados
 * Recebe dentro do corpo da requisição os campos de nome da empresa, id da filial, cnpj, email, telefone e informações adicionais
 * Cria um novo cliente dentro do banco de dados
 * Precisa implementar uma verificação de dados e tambem se caso o cnpj já estiver cadastrado
 */
clientesRouter.post("/clientes", verifyToken, async (req: Request, res: Response) => {
  try {
    /* Recebe os campos de nome da empresa, id da filial, cnpj, email, telefone e informações adicionais */
    const { nomeDaEmpresa, cnpj, email, telefone, informacoesAdicionais } = req.body;
    /* Cria um novo cliente dentro do banco de dados */
    const NewCliente = await prisma.cliente.create({
      data: {
        nomeEmpresa: nomeDaEmpresa,
        filialId: parseInt(req.body.filialID),
        cnpj: cnpj,
        descricao: informacoesAdicionais,
        contatos: {
          create: {
            email: email,
            telefone: telefone,
          },
        },
      },
    });
    // Retorna os dados do cliente criado com status 201
    res.status(201).json(NewCliente);

    // Caso o algo de errado dentro do try, ele retorna uma mensagem de erro
  } catch (error) {
    console.error("Erro ao criar cliente", error);
    res.status(500).json({ message: "Erro ao criar cliente" });
  }
});

/* Exporta as rotas criadas para o Express ter acesso */
export default clientesRouter;
