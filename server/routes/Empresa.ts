import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./Clientes";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const empresaRouter = Router();

/* Rota GET para buscar todas as empresas dentro do banco de dados
 * Recebe o token dentro do cabecalho da requisição HTTP, verifica se o token esta correto
 * Faz a decodificação do token para buscar as informações dentro do token
 * Se o token estiver correto, ele retorna todos os dados da empresa em um json com o status 200
 */
empresaRouter.get("/empresas", verifyToken, async (req: Request, res: Response) => {
  try {
    const empresas = await prisma.filial.findMany();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados da empresa" });
  }
});

/* Rota POST para cadastrar uma nova empresa dentro do banco de dados
 * Recebe dentro do corpo da requisição o nome da empresa e o tipo da filial
 * Retorna uma mensagem de sucesso + os dados da nova empresa
 */
empresaRouter.post("/empresas", verifyToken, async (req: Request, res: Response) => {
  try {
    /* Recebe os campos de nome da empresa e o tipo da filial */
    const { nome, tipo } = req.body;

    /* Cria uma nova empresa dentro do banco de dados usando o Prisma */
    const empresa = await prisma.filial.create({
      data: {
        nome: nome,
        tipo: tipo,
      },
    });

    /* Retorna uma mensagem de sucesso + os dados da nova empresa */
    res.status(200).json({ message: "Empresa criada com sucesso", empresa: empresa });
    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
} catch (error) {
    console.error("Erro ao criar empresa: " + error);
    res.status(500).json({ message: "Erro ao buscar dados da empresa" });
  }
});

/* Exporta as rotas criadas para o Express ter acesso */
export default empresaRouter;
