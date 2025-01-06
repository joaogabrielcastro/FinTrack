import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import SideBar from "@/pages/painel/components/SideBar";
import TopBar from "@/pages/painel/components/TopBar";
import {
  createEstagario,
  createFuncionarios,
  estagiarioHandler,
  getFuncionarios,
} from "@/shared/services/Funcionarios";
import Swal from "sweetalert2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Funcionario, FuncionarioForm } from "@/shared/types/Funcionarios";
import { Empresa } from "@/shared/types/Empresas";
import { getAllEmpresa } from "@/shared/services/Empresas";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarUi } from "@/components/ui/calendar";

const Funcionarios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFunc, setSelectedFunc] = useState<Funcionario | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [funcionarioCargo, setFuncionarioCargo] = useState<string>("");
  const { register, handleSubmit, control, reset } = useForm<FuncionarioForm>();
  const formRef = useRef<HTMLFormElement>(null);

  const clearModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedFunc(null);
  };

  const handleSubmitForm = async (data: FuncionarioForm) => {
    setIsLoading(true);
    let campoFaltando = "";

    if (data.nome === "") {
      setIsLoading(false);
      campoFaltando = "Nome";
    } else if (data.email === "") {
      campoFaltando = "Email";
      setIsLoading(false);
    } else if (data.telefone === "") {
      campoFaltando = "Telefone";
      setIsLoading(false);
    } else if (data.endereco === "") {
      campoFaltando = "Endereço";
      setIsLoading(false);
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
      if ("cargo" in data) {
        if (data.cargo === "ESTAGIARIO") {
          if ("nomeCurso" in data && "dataInicio" in data && "responsavel" in data) {
            const result = await createEstagario(data as estagiarioHandler);
            console.log(result);
            if (result?.message === "Estagiario criado com sucesso") {
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
          }
        }
        if (data.cargo === "EMPREGADO") {
          const result = await createFuncionarios(data);
          console.log(result);
          if (result?.message === "Funcionario criado com sucesso") {
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
        }
      }
      setIsLoading(false);
      clearModal();
    } catch (error) {
      console.log("Erro ao criar o funcionario:", error);
      setIsLoading(false);
    }
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

  const handleFuncionarioCargoChange = (value: string) => {
    setFuncionarioCargo(value);
  };

  const onSubmit = () => {
    if (formRef.current) {
      handleSubmit(handleSubmitForm)();
    }
  };

  const fetchData = async () => {
    try {
      const response = await getFuncionarios();
      const responseEmpresas = await getAllEmpresa();
      if (typeof response === "object") {
        setFuncionarios(response);
        setEmpresas(responseEmpresas);
      } else {
        const data = await response.json();
        setFuncionarios(data);
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
    document.title = "Funcionários | Fintrack";
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
                  placeholder="Buscar Funcionário..."
                />
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="ml-4 font-semibold text-white bg-[#3C8294] hover:bg-[#0E5265] transition-all duration-200"
                    onClick={() => {
                      setIsModalOpen(true);
                      clearModal();
                      setDialogTitle("Adicionar Funcionário");
                    }}
                  >
                    <span className="text-white font-semibold">Adicionar Funcionario</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-zinc-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">{dialogTitle}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-5">
                      <Label className="text-white">Cargo</Label>
                      <Controller
                        name="cargo"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field.ref}
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleFuncionarioCargoChange(value);
                            }}
                          >
                            <SelectTrigger className="col-span-3 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ESTAGIARIO">Estagiario</SelectItem>
                              <SelectItem value="EMPREGADO">Funcionario</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {funcionarioCargo === "ESTAGIARIO" && (
                        <>
                          <Label className="text-white">Nome Completo</Label>
                          <Input
                            className="col-span-3"
                            placeholder="Nome Completo"
                            value={selectedFunc?.nome}
                            {...register("nome")}
                          />

                          <Label className="text-white">Email</Label>
                          <Input
                            className="col-span-3"
                            placeholder="Email"
                            value={selectedFunc?.email}
                            {...register("email")}
                          />

                          <Label className="text-white">Nome do Curso</Label>
                          <Input
                            className="col-span-3"
                            placeholder="Nome do Curso"
                            {...register("nomeCurso")}
                          />

                          <Label className="text-white">Data de Inicio</Label>
                          <Controller
                            name="dataInicio"
                            control={control}
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild className="col-span-3">
                                  <Button className="w-full bg-zinc-600 border-white border text-white">
                                    {field.value
                                      ? format(field.value, "dd/MM/yyyy")
                                      : "Selecione a data"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <CalendarUi
                                    mode="single"
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          />

                          <Label className="text-white">Empresa</Label>
                          <Controller
                            name="filialId"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field.ref}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger className="col-span-3 text-white">
                                  <SelectValue placeholder="Selecione uma empresa..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {empresas.map((empresa) => (
                                    <SelectItem key={empresa?.id} value={`${empresa.id}`}>
                                      {empresa?.nome} - {empresa?.tipo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />

                          <Label className="text-white">Responsavel</Label>
                          <Controller
                            name="responsavel"
                            control={control}
                            defaultValue={undefined}
                            render={({ field }) => (
                              <Select
                                {...field.ref}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger className="col-span-3 text-white">
                                  <SelectValue placeholder="Selecione um empregado..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {funcionarios.map((funcionario) => (
                                      <SelectItem
                                        key={funcionario?.id.toString()}
                                        value={funcionario?.id.toString()}
                                      >
                                        {funcionario?.nome}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </>
                      )}

                      {funcionarioCargo === "EMPREGADO" && (
                        <>
                          <Label className="text-white">Nome Completo</Label>
                          <Input
                            className="col-span-3"
                            placeholder="Nome Completo"
                            value={selectedFunc?.nome}
                            {...register("nome")}
                          />

                          <Label className="text-white">Email</Label>
                          <Input
                            className="col-span-3"
                            placeholder="Email"
                            value={selectedFunc?.email}
                            {...register("email")}
                          />

                          <Label className="text-white">Telefone</Label>
                          <Input
                            className="col-span-3"
                            placeholder="Telefone"
                            value={selectedFunc?.telefone}
                            {...register("telefone")}
                            onChange={handleTelefoneChange}
                          />

                          <Label className="text-white">Endereço</Label>
                          <Input
                            className="col-span-3"
                            placeholder="Endereço"
                            value={selectedFunc?.endereco}
                            {...register("endereco")}
                          />

                          <Label className="text-white">Empresa</Label>
                          <Controller
                            name="filialId"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field.ref}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger className="col-span-3 text-white">
                                  <SelectValue placeholder="Selecione uma empresa..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {empresas.map((empresa) => (
                                    <SelectItem key={empresa?.id} value={`${empresa.id}`}>
                                      {empresa?.nome} - {empresa?.tipo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={onSubmit}
                      className="bg-[#3C8294] hover:bg-[#0E5265] text-white transition-all duration-200 font-semibold"
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
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Nome</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Telefone</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Endereço</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionarios, i) => {
                return (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{funcionarios.id}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-white">{funcionarios.nome}</span>
                        <span>{funcionarios.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{funcionarios.telefone}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{funcionarios.endereco}</td>
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
                              console.log(funcionarios);
                              setSelectedFunc(funcionarios);
                              setIsModalOpen(true);
                              setDialogTitle("Editar Funcionario");
                              reset();
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
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
                  Mostrando {funcionarios.length} de {funcionarios.length} resultados
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

export default Funcionarios;
