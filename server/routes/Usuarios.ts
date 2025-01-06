import { Request, Response, Router } from "express";
import { PrismaClient  } from "@prisma/client";
import { verifyToken } from "./Clientes";

/* Inicialização do Prisma Cliente para a gente ter acesso a base de dados e criação da rota de usuarios(Tela de usuarios do painel) no Express */
const prisma = new PrismaClient();
const usuariosRouter = Router();

/* Rota GET para buscar todos os usuarios dentro do banco de dados
 * Nesta rota a gente utiliza a verificação de token para ter acesso a rota
 * A rota retorna todos os usuarios cadastrados no banco de dados
 */
usuariosRouter.get("/usuarios", verifyToken, async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);    
    }
    catch (error) {
        res.status(500).json({ message: "Erro de buscar dados dos usuarios" });
    }
})

usuariosRouter.post("/usuarios", verifyToken, async (req: Request, res: Response) => {
    try {
        const { nome, email, senha, tipo, idAssociado } = req.body;

        const existingEmail = await prisma.usuario.findUnique({
            where:{
              email,
            }
          })
      
        if(existingEmail){
            return res.status(400).json({ message: "O email fornecido já está em uso." });
        }

        const newUser = await prisma.usuario.create({
            data: {
                nome: nome,
                email: email,
                senha: senha,
                tipo: tipo,
                ...(tipo === 'EMPREGADO' ? { empregadoId: idAssociado } : {}),
                ...(tipo === 'ESTAGIARIO' ? { estagiarioId: idAssociado } : {}),
            },
        });
        res.status(201).json({ message: "Usuario criado com sucesso", usuario: newUser });
    } catch (error) {
        console.error("Erro ao criar usuario", error);
        res.status(500).json({ message: "Erro ao criar usuario" });
    }
})

/* Exporta as rotas criadas para o Express ter acesso */
export default usuariosRouter