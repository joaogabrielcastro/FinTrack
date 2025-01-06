import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./Clientes";
import dotenv from "dotenv";

/* Inicio da configuração do dotenv
 * Biblioteca que serve para conseguir usar as variaveis do arquivo .env
 * Exemplo de uso: process.env.VARIAVEL
 */
dotenv.config();

/* Inicialização do Prisma Cliente para a gente ter acesso a base de dados e criação da rota de funcionarios no Express */
const prisma = new PrismaClient();
const funcionariosRouter = Router();

/* Rota GET para fazer a busca de todos os funcionarios dentro do banco de dados
 * Faz a verificação de token para ter acesso a rota e retorna um json com todos os funcionarios com o status 200
 */
funcionariosRouter.get("/funcionarios", verifyToken, async (req: Request, res: Response) => {
  try {
    const funcionarios = await prisma.empregado.findMany();
    res.status(200).json(funcionarios);
    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
  } catch (error) {
    res.status(500).json({ message: "Erro de buscar dados do funcionario" });
  }
});

/* Rota POST para criar um novo funcionario dentro do banco de dados
 * Recebe dentro do corpo da requisição o nome do funcionario, email, telefone, endereco e o id da filial
 * Faz a verificação do token e se o token estiver correto, ele cria um novo funcionario dentro do banco de dados
 * Retornando uma mensagem de sucesso + os dados do novo funcionario
 */
funcionariosRouter.post("/funcionarios", verifyToken, async (req: Request, res: Response) => {
  try {
    const { nome, email, telefone, endereco } = req.body;
    let { filialId } = req.body;

    filialId = parseInt(filialId);

    const newFuncionario = await prisma.empregado.create({
      data: {
        nome: nome,
        email: email,
        telefone: telefone,
        endereco: endereco,
        filialId: filialId,
      },
    });
    res.status(201).json({ message: "Funcionario criado com sucesso", empregado: newFuncionario });

    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
  } catch (error) {
    console.error("Erro ao criar funcionário", error);
    res.status(500).json({ message: "Erro ao criar Funcionario" });
  }
});

/* Rota PUT para atualizar os dados de um funcionario dentro do banco de dados
 * Recebe dentro do parametros o id do funcionario e dentro do corpo da requisição
 * O nome, email, telefone e o endereço do funcionario atualizados
 * Verifica se o funcionário existe no banco de dados e se o token estiver correto, ele atualiza o funcionário
 */
funcionariosRouter.put("/funcionarios/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    /* Recebe o id do funcionario e o dados do funcionario */
    const { id } = req.params;
    const { nome, email, telefone, endereco } = req.body;
    let { filialId } = req.body;

    filialId = parseInt(filialId);

    /* Verifica se o funcionário existe dentro do banco de dados */
    const funcionarioExistente = await prisma.empregado.findUnique({
      where: { id: parseInt(id) },
    });

    /* Se o funcionário não existir, ele retorna uma mensagem de erro e status 404 */
    if (!funcionarioExistente) {
      return res.status(404).json({ message: "Funcionario não encontrado" });
    }

    /* Se o token estiver correto, ele atualiza o funcionário dentro do banco passando o id e as novas informações */
    const funcionarioAtualizado = await prisma.empregado.update({
      where: { id: parseInt(id) },
      data: {
        nome: nome,
        email: email,
        telefone: telefone,
        endereco: endereco,
        filialId: filialId,
      },
    });

    /* Retorna uma mensagem de sucesso + os dados do funcionário atualizados */
    res
      .status(200)
      .json({ message: "Funcionario atualizado com sucesso", empregado: funcionarioAtualizado });

    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
  } catch (error) {
    console.error("Erro ao atualizar funcionário", error);
    res.status(500).json({ message: "Erro ao atualizar Funcionario" });
  }
});

/* Função POST para criar um novo estagiario no banco de dados
 * Recebe dentro do corpo da requisição o nome do estagiario, email, nome do curso, data de inicio, responsavel e o id da filial
 * Faz a verificação do token e se o token estiver correto, ele cria um novo estagiario dentro do banco de dados
 * Retornando uma mensagem de sucesso + os dados do novo estagiario
 */
funcionariosRouter.post("/estagiario", verifyToken, async (req: Request, res: Response) => {
  try {
    /* Recebe os dados do estagiario pelo corpo da requisição */
    const { nome, email, nomeCurso, dataInicio } = req.body;
    console.log(req.body);
    let { filialId, responsavel } = req.body;
    filialId = parseInt(filialId);
    responsavel = parseInt(responsavel);
    /* Verifica se o email do estagiario ja existe no banco de dados */
    const existingEmail = await prisma.estagiario.findUnique({
      where: {
        email,
      },
    });

    /* Se o email existir, ele retorna uma mensagem de erro */
    if (existingEmail) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    /* Se o email não existir, ele cria um novo estagiario dentro do banco de dados */
    const newEstagiario = await prisma.estagiario.create({
      data: {
        nome: nome,
        email: email,
        nomeCurso: nomeCurso,
        dataInicio: dataInicio,
        responsavel: String(responsavel),
        filialId: filialId,
        empregadoId: responsavel,
      },
    });

    /* Retorna uma mensagem de sucesso + os dados do novo estagiario */
    res.status(201).json({ message: "Estagiario criado com sucesso", estagiario: newEstagiario });

    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
  } catch (error) {
    console.error("Erro ao criar estagiario", error);
    res.status(500).json({ message: "Erro ao criar estagiario" });
  }
});

funcionariosRouter.get("/estagiarios", verifyToken, async (req: Request, res: Response) => {
  try {
    const estagiarios = await prisma.estagiario.findMany();
    res.status(200).json(estagiarios);
    /* Caso o algo de errado dentro do try, ele retorna uma mensagem de erro */
  } catch (error) {
    console.error("Erro ao buscar estagiarios", error);
    res.status(500).json({ message: "Erro ao buscar estagiarios" });
  }
});
/* Exporta as rotas criadas para o Express ter acesso */
export default funcionariosRouter;
