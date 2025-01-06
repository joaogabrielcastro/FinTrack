import { Controller, useForm } from "react-hook-form";
import SideBar from "@pages/painel/components/SideBar";
import TopBar from "@pages/painel/components/TopBar";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { createUsuario, getAllUsuarios } from "@/shared/services/Usuarios";
import { getFuncionarios } from "@/shared/services/Funcionarios";
import { Funcionario, usuarioHandler } from "@/shared/types/Usuarios";

const Usuarios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<usuarioHandler[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmpregadoSelect, setShowEmpregadoSelect] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { register, handleSubmit, control, reset } = useForm<usuarioHandler>();

  const clearModal = () => {
    setIsModalOpen(false);
    setShowEmpregadoSelect(false);
    reset();
  };

  const fetchFuncionarios = async () => {
    try {
      const response = await getFuncionarios();
      if (typeof response === "object") {
        setFuncionarios(response);
      }else{
        const data = await response.json();
        setFuncionarios(data);
      }
    } catch (error) {
      console.error("Erro ao obter os dados dos clientes:", error);
    }
  }

  const fetchData = async () => {
    try {
      const response = await getAllUsuarios();
      if (typeof response === "object") {
        setUsers(response);
      } else {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erro ao obter os dados dos clientes:", error);
    }
  };

  const handleSubmitForm = async (data: usuarioHandler) => {
    setIsLoading(true);
    if(data.senha !== data.confirmSenha) {
      setIsLoading(false);
      Swal.fire({
        title: "Erro!",
        text: "As senhas devem ser iguais.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    let campoFaltando = "";

    if (data.nome === "") {
      setIsLoading(false);
      campoFaltando = "Nome";
    }
    else if (data.email === "") {
      campoFaltando = "Email";
      setIsLoading(false);
    }
    else if (data.senha === "") {
      campoFaltando = "Senha";
      setIsLoading(false);
    }
    else if (data.confirmSenha === "") {
      campoFaltando = "Confirmar Senha";
      setIsLoading(false);
    }
    else if (data.tipo === null) {
      campoFaltando = "Tipo";
      setIsLoading(false);
    }
    else if (data.tipo === "EMPREGADO" && data.empregadoId === "") {
      campoFaltando = "Empregado";
      setIsLoading(false);
    }
    else if (data.tipo === "ESTAGIARIO" && data.estagiarioId === "") {
      campoFaltando = "Estagiário";
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
      const result = await createUsuario(data);
      console.log(result);
      if(result.message === "Usuario criado com sucesso"){
        Swal.fire({
          title: "Sucesso!",
          text: result.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        setIsLoading(false);
        fetchData();
        return;
      }
      else{
        Swal.fire({
          title: "Erro!",
          text: result.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
        setIsLoading(false);
        clearModal();
      }
    } catch (error) {
      console.log("Erro ao criar o funcionario:", error);
      setIsLoading(false);
    }
  };

  const handleUserTypeChange = (value: string) => {
    setShowEmpregadoSelect(value === 'ESTAGIARIO' || value === 'EMPREGADO');
 };

  const onSubmit = () => {
    if (formRef.current) {
      handleSubmit(handleSubmitForm)();
    }
  };

  useEffect(() => {
    document.title = "Usuários | Fintrack";
  }, []);

  useEffect(() => {
    fetchData();
    fetchFuncionarios();
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
                  placeholder="Buscar usuario..."
                />
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-4 text-white bg-[#3C8294] hover:bg-[#0E5265] transition-all duration-200">
                    <span className="text-white font-semibold">Adicionar Usuario</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-zinc-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Adicionar Usuario</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-5">

                      <Label className="text-white">Nome</Label>
                      <Input
                        className="col-span-3"
                        placeholder="Nome do Usuario"
                        {...register("nome")}
                      />

                      <Label className="text-white">Email</Label>
                      <Input className="col-span-3" placeholder="Email" {...register("email")} />

                      <Label className="text-white">Senha</Label>
                      <Input className="col-span-3" placeholder="Senha" type="password" {...register("senha")} />

                      <Label className="text-white">Confirme Senha</Label>
                      <Input
                        className="col-span-3"
                        type="password"
                        placeholder="Confirme Senha"
                        {...register("confirmSenha")}
                      />

                      <Label className="text-white">Tipo de Usuário</Label>
                      <Controller
                        name="tipo"
                        control={control}
                        defaultValue="EMPREGADO"
                        render={({ field }) => (
                          <Select {...field.ref} onValueChange={(value) => {
                            field.onChange(value);
                            handleUserTypeChange(value);
                           }}>
                            <SelectTrigger className="col-span-3 text-white">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                                <SelectItem value="EMPREGADO">Empregado</SelectItem>
                                <SelectItem value="ESTAGIARIO">Estagiario</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {showEmpregadoSelect && (
                        <>
                          <label className="text-white trasition-all">Empregado</label>
                          <Controller
                            name="empregadoId"
                            control={control}
                            defaultValue={undefined}
                            render={({ field }) => (
                              <Select {...field.ref} onValueChange={(value) => field.onChange(value)}>
                                <SelectTrigger className="col-span-3 text-white">
                                  <SelectValue placeholder="Selecione um empregado..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                  {funcionarios.map(funcionario => (
                                    <SelectItem key={funcionario?.id} value={funcionario?.id}>
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
              <tr className="borde-b border-white/20">
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Código</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Nome</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Email</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                return(
                <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-2.5 font-sm text-zinc-300">{user.id}</td>
                  <td className="py-3 px-2.5 font-sm text-zinc-300">{user.nome}	</td>
                  <td className="py-3 px-2.5 font-sm text-zinc-300">{user.email}</td>
                  <td className="py-3 px-2.5 font-sm text-zinc-300">{user.tipo}</td>
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                        <DropdownMenuItem>Copiar E-mail</DropdownMenuItem>
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
                  Mostrando de 1 a 10 de 100 registros
                </td>
                <td colSpan={3} className="py-3 px-2.5 font-sm text-zinc-300 text-right">
                  <div className="inline-flex items-center gap-8">
                    <span>Pagina 1 de 10</span>

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

export default Usuarios;
