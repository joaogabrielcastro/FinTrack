import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import SideBar from "@/pages/painel/components/SideBar";
import TopBar from "./components/TopBar";
import { useEffect } from "react";

const Painel = () => {  
  const data = [
    { name: 'Jan', income: 5000, expenses: 2000, profit: 3000 },
    { name: 'Feb', income: 4000, expenses: 1500, profit: 2500 },
    { name: 'Mar', income: 6000, expenses: 2500, profit: 3500 },
    { name: 'Apr', income: 7000, expenses: 3000, profit: 4000 },
    { name: 'May', income: 8000, expenses: 4000, profit: 4000 },
    { name: 'Jun', income: 7500, expenses: 3500, profit: 4000 },
    { name: 'Jul', income: 8500, expenses: 4500, profit: 4000 },
  ];
  
  useEffect(() => {
    document.title = "Painel | Fintrack";
  }, []);

  return (
    <SideBar>
      <div className="bg-gray-800 w-full">
        <TopBar/>
        <div className="flex ml-5 mt-5 mr-4">
          <Card className="w-[60%]">
            <CardHeader>
              <CardTitle>Clientes Ativos</CardTitle>
              <CardDescription>Quantidade atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150</div>
              <p className="text-sm text-muted-foreground text-lime-500 font-bold">
                +5% desde o mês passado
              </p>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>

          <Card className="ml-5 w-[60%]">
            <CardHeader>
              <CardTitle>Periódicos Publicados</CardTitle>
              <CardDescription>Quantidade no último mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-sm text-muted-foreground text-lime-500 font-bold">
                +10% desde o mês passado
              </p>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>

          <Card className="ml-5 w-[60%]">
            <CardHeader>
              <CardTitle>Faturamento Mensal</CardTitle>
              <CardDescription>Comparativo dos últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 50,000</div>
              <p className="text-sm text-muted-foreground text-lime-500 font-bold">
                +8% desde o mês passado
              </p>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>

          <Card className="ml-5 w-[60%]">
            <CardHeader>
              <CardTitle>Despesas Mensais</CardTitle>
              <CardDescription>Comparativo dos últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 20,000</div>
              <p className="text-sm text-muted-foreground text-red-500 font-bold">
                - 2% desde o mês passado
              </p>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>

        <div className="flex">
        <Card className="ml-5 w-[50%] mt-7 mr-4">
          <CardHeader>
            <CardTitle>Visão Geral Financeira</CardTitle>
            <CardDescription>Análise do rendimento e despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              width={700}
              height={300}
              data={data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expenses" fill="#ff7300" />
              <Bar dataKey="profit" fill="#8884d8" />
            </BarChart>            
          </CardContent>
          <CardFooter>
            <p className="text-sm">Dados baseados nos últimos sete meses</p>
          </CardFooter>
        </Card>
        
        <Card className="ml-5 w-[50%] mt-7 mr-4">
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
              <CardDescription>Rendimento e despesas ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                width={700}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#82ca9d" />
                <Line type="monotone" dataKey="expenses" stroke="#ff7300" />
                <Line type="monotone" dataKey="profit" stroke="#8884d8" />
              </LineChart>
            </CardContent>
            <CardFooter>
              <p className="text-sm">Dados baseados nos últimos sete meses</p>
            </CardFooter>
          </Card>
        </div>
        
      </div>
    </SideBar>
  );
};

export default Painel;
