import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clienteHandle, Cliente } from "@/shared/types/Clients";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getAllClients, registerCliente } from "@/shared/services/Clientes";
import SideBar from "@/pages/painel/components/SideBar";
import TopBar from "@/pages/painel/components/TopBar";
import Swal from "sweetalert2";
import { Empresa } from "@/shared/types/Empresas";
import { getAllEmpresa } from "@/shared/services/Empresas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Clientes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const { register, handleSubmit, reset, control } = useForm<clienteHandle>();
  const formRef = useRef<HTMLFormElement>(null);

  const clearModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedClient(null);
  };

  const handleCnpjChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    value = value.replace(/(-\d{2})\d+?$/, "$1");
    event.target.value = value;
  };

  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "$1 $2");
    value = value.replace(/(\d{6})(\d)/, "$1 $2");
    value = value.replace(/(\d{10})(\d)/, "$1-$2");
    value = value.replace(/(-\d{4})\d+?$/, "$1");
    value = value.substring(0, 14);
    event.target.value = value;
  };

  const handleSubmitForm = async (data: clienteHandle) => {
    setIsLoading(true);
    let campoFaltando = "";

    if (data.nomeDaEmpresa === "") {
      setIsLoading(false);
      campoFaltando = "Nome da Empresa";
    } else if (data.cnpj === "") {
      setIsLoading(false);
      campoFaltando = "CNPJ";
    } else if (data.email === "") {
      setIsLoading(false);
      campoFaltando = "Email";
    } else if (data.telefone === "") {
      setIsLoading(false);
      campoFaltando = "Telefone";
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
      console.log(data);
      const result = await registerCliente(data);
      if (result?.success) {
        Swal.fire({
          title: "Sucesso!",
          text: result?.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        fetchData();
      } else {
        Swal.fire({
          title: "Erro!",
          text: result?.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
      setIsLoading(false);
      clearModal();
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    if (formRef.current) {
      handleSubmit(handleSubmitForm)();
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllClients();
      const responseEmpresas = await getAllEmpresa();
      if (typeof response === "object") {
        setClientes(response);
        setEmpresas(responseEmpresas);
      } else {
        const data = await response.json();
        setClientes(data);
        setEmpresas(responseEmpresas);
      }
    } catch (error) {
      console.error("Erro ao obter os dados dos clientes:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Clientes | Fintrack";
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
                  placeholder="Buscar participante..."
                />
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="ml-4 text-white bg-[#3c8294] hover:bg-[#0e5265] transition-all duration-200"
                    onClick={() => {
                      setDialogTitle("Adicionar Cliente");
                      setIsModalOpen(true);
                      clearModal();
                    }}
                  >
                    <span className="text-white font-semibold">Adicionar Cliente</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-zinc-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">{dialogTitle}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-5">
                      <Label className="text-white">Nome da Empresa</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Nome da Empresa"
                        value={selectedClient?.nomeEmpresa}
                        {...register("nomeDaEmpresa")}
                      />

                      <Label className="text-white">CNPJ</Label>
                      <Input
                        className="col-span-3"
                        placeholder="CNPJ"
                        {...register("cnpj")}
                        maxLength={18}
                        onChange={handleCnpjChange}
                        value={selectedClient?.cnpj}
                      />

                      <Label className="text-white">Email</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Email"
                        {...register("email")}
                        value={selectedClient?.contatos[0]?.email}
                      />

                      <Label className="text-white">Telefone</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Telefone"
                        value={selectedClient?.contatos[0]?.telefone}
                        {...register("telefone")}
                        onChange={handleTelefoneChange}
                      />

                      <Label className="text-white">Empresa</Label>
                      <Controller
                        name="filialID"
                        control={control}
                        render={({ field }) => (
                          <Select {...field.ref} onValueChange={(value) => field.onChange(value)}>
                            <SelectTrigger className="col-span-3 text-white">
                              <SelectValue placeholder="Selecione uma empresa..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {empresas.map((empresa) => (
                                  <SelectItem key={empresa.id} value={`${empresa.id}`}>
                                    {empresa.nome} - {empresa.tipo}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      <Label className="text-white">Informações Adicionais</Label>
                      <Textarea
                        className="col-span-3"
                        placeholder="Descrição"
                        value={selectedClient?.informacoesAdicionais}
                        {...register("informacoesAdicionais")}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={onSubmit}
                      className="bg-white hover:bg-white/20 hover:text-white transition-all duration-200"
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
                      className="bg-white hover:bg-white/20 hover:text-white transition-all duration-200"
                      onClick={() => {
                        setIsModalOpen(false);
                        clearModal();
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
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Código</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">
                  Nome da Empresa
                </th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">CNPJ</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, i) => {
                const contato = cliente.contatos[0];
                return (
                  <tr key={i} className="border-b border-white/20 hover:bg-white/5">
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{cliente.id}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-white">{cliente.nomeEmpresa}</span>
                        <span>{contato.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{cliente.cnpj}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{contato.telefone}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="bg-black/20 border border-white/10 rounded-md p-1.5 hover:bg-white/20">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-200">
                          <DropdownMenuLabel>Opções</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              console.log(cliente);
                              setSelectedClient(cliente);
                              setIsModalOpen(true);
                              setDialogTitle("Editar Cliente");
                              reset();
                            }}
                          >
                            Editar
                          </DropdownMenuItem>{" "}
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
                  Mostrando {clientes.length} de 229 resultados
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

export default Clientes;
