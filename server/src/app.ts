import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client'; 

const app = express();
const PORT = process.env.PORT || 8000;
const prisma = new PrismaClient();

app.use(express.static(path.join(__dirname, '../../build')));
app.use(express.json())
app.use(cors())

const routesPath = path.join(__dirname, '../routes');
fs.readdirSync(routesPath).forEach(file => {
 if (file.endsWith('.ts')) {
    const route = require(path.join(routesPath, file)).default;
    app.use('/api', route);
 }
});

async function createPredefinedUser() {
 try {
    const existingUser = await prisma.usuario.findUnique({
      where: {
        email: 'usuario@master.com',
      },
    });

    if (!existingUser) {
      const usuario = await prisma.usuario.create({
        data: {
          nome: 'Usuário Master',
          email: 'usuario@master.com',
          senha: 'semsenha123',
          tipo: 'ADMINISTRADOR',
        },
      });

      console.log(`Usuário pré-definido criado: ${usuario.id}`);
    } else {
      console.log('Usuário pré-definido já existe.');
    }
 } catch (error) {
    console.error('Erro ao criar o usuário pré-definido:', error);
 }
}

createPredefinedUser();

app.listen(PORT, () => console.log(`Server está rodando na porta: ${PORT}`));
