import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./Clientes";

const prisma = new PrismaClient();
const periodicosRouter = Router();

periodicosRouter.get("/periodicos", verifyToken, async (req: Request, res: Response) => {
  try {
    const periodicos = await prisma.periodico.findMany();
    res.status(200).json(periodicos);
  } catch (error) {
    res.status(500).json({ message: "Erro de buscar dados dos periodicos" });
  }
});

periodicosRouter.post("/periodicos", verifyToken, async (req: Request, res: Response) => {
  try {
    const { nomeRevista, autor, exemplar, editora } = req.body;
    let { clienteId } = req.body;

    clienteId = parseInt(clienteId);

    const periodico = await prisma.periodico.create({
      data: {
        nomeRevista: nomeRevista,
        autor: autor,
        exemplar: exemplar,
        editora: editora,
        clienteId: clienteId,
      },
    });

    res.status(200).json({ message: "Periodico criado com sucesso", empresa: periodico });
  } catch (error) {
    console.error("Erro ao criar empresa: " + error);
    res.status(500).json({ message: "Erro ao buscar dados da empresa" });
  }
});

export default periodicosRouter;
