import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SideBar from "@pages/painel/components/SideBar";
import TopBar from "@pages/painel/components/TopBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { createPeriodico, getAllPeriodicos } from "@/shared/services/Periodicos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllClients } from "@/shared/services/Clientes";
import { Cliente } from "@/shared/types/Clients";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface periodicosForm {
  nomeRevista: string;
  autor: string;
  editora: string;
  exemplar: string;
  clienteId: string;
}

const Periodicos = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [periodicos, setPeriodicos] = useState<periodicosForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, control, reset } = useForm<periodicosForm>();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitForm = async (data: periodicosForm) => {
    setIsLoading(true);

    let campoFaltando = "";

    if (data.nomeRevista === "") {
      setIsLoading(false);
      campoFaltando = "Nome da Revista";
    }
    if (data.autor === "") {
      setIsLoading(false);
      campoFaltando = "Autor";
    }
    if (data.editora === "") {
      setIsLoading(false);
      campoFaltando = "Editora";
    }
    if (data.exemplar === "") {
      setIsLoading(false);
      campoFaltando = "Exemplar";
    }

    if (campoFaltando !== "") {
      setIsLoading(false);
      Swal.fire({
        title: "Erro!",
        text: `Por favor, preencha o campo ${campoFaltando} corretamente.`,
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    try {
      const result = await createPeriodico(data as periodicosForm);
      if (result?.message === "Periodico criado com sucesso") {
        setIsLoading(false);
        Swal.fire({
          title: "Sucesso!",
          text: result?.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        fetchData();
        reset();
      } else {
        Swal.fire({
          title: "Erro!",
          text: result?.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.log("Erro ao criar o funcionario:", error);
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllClients();
      const responsePeriodicos = await getAllPeriodicos();
      if (typeof response === "object") {
        setClientes(response);
        setPeriodicos(responsePeriodicos);
      } else {
        const data = await response.json();
        setClientes(data);
        setPeriodicos(responsePeriodicos);
      }
    } catch (error) {
      console.log("Erro ao obter dados dos clientes:", error);
    }
  };

  const onSubmit = () => {
    if (formRef.current) {
      handleSubmit(handleSubmitForm)();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Periodicos | Fintrack";
  }, []);

  return (
    <SideBar>
      <div className="bg-gray-800 w-full">
        <TopBar />
        <form ref={formRef} onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex flex-col gap-4 p-3 mt-4">
            <div className="w-full flex justify-end">
              <div className="w-72 px-3 py-1.5 border border-white/30 rounded-lg font-sm flex items-center gap-3">
                <Search className="size-4 text-white" />
                <input
                  className="bg-transparent flex-1 outline-none text-sm border-0 p-0 focus:ring-0 text-white"
                  placeholder="Buscar Periodico..."
                />
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-4 font-semibold text-white bg-[#3C8294] hover:bg-[#0E5265] transition-all duration-200">
                    <span className="text-white font-semibold">Adicionar Periodico</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-zinc-600">
                  <DialogHeader>
                    <DialogTitle className="font-semibold text-white">
                      Adicionar Periodico
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 item-center gap-5">
                      <Label className="text-white p-1">Nome da Revista</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Nome da Revista"
                        {...register("nomeRevista")}
                      />

                      <Label className="text-white p-2">Autor</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Nome do Autor"
                        {...register("autor")}
                      />

                      <Label className="text-white p-2">Editora</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Nome da Editora"
                        {...register("editora")}
                      />

                      <Label className="text-white p-2">Exemplar</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Nome do Exemplar"
                        {...register("exemplar")}
                      />

                      <Label className="text-white p-2">Cliente</Label>
                      <Controller
                        control={control}
                        name="clienteId"
                        render={({ field }) => (
                          <Select {...field.ref} onValueChange={(value) => field.onChange(value)}>
                            <SelectTrigger className="col-span-3 text-white">
                              <SelectValue placeholder="Selecione o cliente" />
                            </SelectTrigger>
                            <SelectContent>
                              {clientes.map((cliente) => (
                                <SelectItem key={cliente.id} value={`${cliente.id}`}>
                                  {cliente.nomeEmpresa}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      className="bg-[#6BB2C4] hover:bg-[#3C8294] text-white transition-all duration-200 font-semibold"
                      type="submit"
                      onClick={onSubmit}
                    >
                      {isLoading ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                          >
                            <animateTransform
                              attributeName="transform"
                              dur="0.75s"
                              repeatCount="indefinite"
                              type="rotate"
                              values="0 12 12;360 12 12"
                            />
                          </path>
                        </svg>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#6BB2C4] hover:bg-[#3C8294] text-white transition-all duration-200 font-semibold"
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                    >
                      Fechar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>

        <div className="border border-white/20 rounded-lg m-4">
          <table className="w-full p-2">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">
                  Nome da Revista
                </th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Autor</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Editora</th>
              </tr>
            </thead>
            <tbody>
              {periodicos.map((periodico, i) => {
                return (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{periodico.nomeRevista}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{periodico.autor}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{periodico.editora}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <button className="bg-black/20 border border-white/10 rounded-md p-1.5 hover:bg-white/20">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-200">
                          <DropdownMenuLabel>Opções</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Excluir</DropdownMenuItem>
                          <DropdownMenuItem>Copiar E-mail</DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-3 px-2.5 font-sm text-zinc-300">
                  Mostrando {periodicos.length} de {periodicos.length}
                </td>
                <td colSpan={3} className="py-3 px-2.5 font-sm text-zinc-300 text-right">
                  <div className="inline-flex items-center gap-8">
                    <span>Pagina 1 de 24</span>

                    <div className="flex gap-1.5">
                      <button className="bg-white/10 border border-white/10 rounded-md p-1.5 hover:bg-white/20">
                        <ChevronsLeft className="size-4" />
                      </button>
                      <button className="bg-white/10 border border-white/10 rounded-md p-1.5 hover:bg-white/20">
                        <ChevronLeft className="size-4" />
                      </button>
                      <button className="bg-white/10 border border-white/10 rounded-md p-1.5 hover:bg-white/20">
                        <ChevronRight className="size-4" />
                      </button>
                      <button className="bg-white/10 border border-white/10 rounded-md p-1.5 hover:bg-white/20">
                        <ChevronsRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </SideBar>
  );
};

export default Periodicos;