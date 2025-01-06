import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import SideBar from "@pages/painel/components/SideBar";
import TopBar from "@pages/painel/components/TopBar";
import Swal from "sweetalert2";
import { createEmpresa, getAllEmpresa } from "@/shared/services/Empresas";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empresa } from "@/shared/types/Empresas";

const Empresas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, control, reset } = useForm<Empresa>();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitForm = async (data: Empresa) => {
    setIsLoading(true);
    let campoFaltando = "";

    if(data.nome === "") {
      setIsLoading(false);
      campoFaltando = "Nome";
    }
    if(data.tipo === ""){
      setIsLoading(false);
      campoFaltando = "Tipo";
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
      if('tipo' in data && 'nome' in data){
        const result = await createEmpresa(data);
        if(result?.message === "Empresa criada com sucesso"){
          setIsLoading(false);
          Swal.fire({
            title: "Sucesso!",
            text: "Empresa cadastrada com sucesso!",
            icon: "success",
            confirmButtonText: "Ok",
          });
          fetchData();
        } else{
          setIsLoading(false);
          Swal.fire({
            title: "Erro!",
            text: result?.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
          return;
        }
      }
    } catch (error) {
      console.log("Erro ao criar a empesa:", error);
      setIsLoading(false);
    }
  } 

  const onSubmit = () => {
    if (formRef.current) {
      handleSubmit(handleSubmitForm)();
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllEmpresa();
      if(typeof response === "object"){
        setEmpresas(response);
      }
      else{
        const data = await response.json();
        setEmpresas(data);
      }
    } catch (error) {
      console.log("Erro ao obter os dados das empresas:", error);
    }
  }

  useEffect(() => {
    fetchData();
    document.title = "Empresas | Fintrack";
  }, []);
  
  return (
    <SideBar>
      <div className="bg-gray-800 w-full">
        <TopBar />
        <form ref={formRef} onSubmit={handleSubmit(handleSubmitForm)}> 
        <div className="flex flex-col gap-4 p-3 mt-4">
          <div className="w-full flex justify-end">
            <div className="w-72 px-3 py-1.5 border border-white/30 rounded-lg font-sm flex items-center gap-3">
              <Search className="size-4 text-white"/>
              <input
                className="bg-transparent flex-1 outline-none text-sm border-0 p-0 focus:ring-0 text-white"
                placeholder="Buscar Empresa..."
              />
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                className="ml-4 font-semibold text-white bg-[#3C8294] hover:bg-[#0E5265] transition-all duration-200"
                >
                  <span className="text-white font-semibold">Adicionar Empresa</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px] bg-zinc-600">
                <DialogHeader>
                  <DialogTitle className="font-semibold text-white">Adicionar Empresa</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-5">
                    <Label className="text-white">Nome</Label>     
                    <Input
                      className="col-span-3"
                      placeholder="Nome da Empresa"
                      {...register("nome")}
                    /> 

                    <Label className="text-white">Tipo da Empresa</Label>
                    <Controller
                      name="tipo"
                      control={control}
                      render={({ field }) => (
                        <Select {...field.ref} onValueChange={(value) => {
                          field.onChange(value);
                        }}>
                        <SelectTrigger className="col-span-3 text-white">
                          <SelectValue placeholder="Selecione" />  
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matriz">Matriz</SelectItem>
                          <SelectItem value="Filial">Filial</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
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
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">ID</th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">
                  Nome da Empresa
                </th>
                <th className="py-3 px-2.5 font-sm font-semibold text-white text-left">Tipo da Empresa</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa, i) => {
                return(
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{empresa.id}</td>
                    <td className="py px-2.5 font-sm text-zinc-300">{empresa.nome}</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">{empresa.tipo}</td>
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
                              console.log(empresas);
                              setEmpresas(empresas);
                              setIsModalOpen(true);
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
                )
              })}
              {/* {Array.from({ length: 6 }).map((_, i) => {
                return (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-2.5 font-sm text-zinc-300">1</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-white">Nome da Empresa</span>
                        <span>teste@teste.com</span>
                      </div>
                    </td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">MATRIZ</td>
                    <td className="py-3 px-2.5 font-sm text-zinc-300">
                      <button className="bg-black/20 border border-white/10 rounded-md p-1.5 ">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })} */}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-3 px-2.5 font-sm text-zinc-300">
                  Mostrando 10 de 229 resultados
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

export default Empresas;
