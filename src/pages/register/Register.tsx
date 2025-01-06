import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { registerUser } from "@/shared/services/User";
import { useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Swal from "sweetalert2";

interface handleForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { register, handleSubmit } = useForm<handleForm>();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Registrar | Fintrack";
  }, []);

  const handleRegister = async (data: handleForm) => {
    if (!data.name) {
      Swal.fire({
        title: "Por favor, informe sua nome",
        text: "Preencha o campo de nome corretamente",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    if (!data.email) {
      Swal.fire({
        title: "Por favor, informe seu email",
        text: "Preencha o campo de email corretamente",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    if (!data.password) {
      Swal.fire({
        title: "Por favor, informe sua senha",
        text: "Preencha o campo de senha corretamente",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: "Por favor, confirme sua senha",
        text: "As senhas digitadas não conferem",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
      showLoader();
      const response = await registerUser(data);
      console.log(response);
      if (response?.success === true) {
        const result = await Swal.fire({
          title: "Sucesso!",
          text: "Conta criada com sucesso!",
          icon: "success",
          confirmButtonText: "Ok",
        });
        if (result.isConfirmed) {
          navigate("/login");
        }
      } else if (response?.message === "Email já existe!") {
        hideLoader()
        Swal.fire({
          title: "Erro!",
          text: "E-mail já cadastrado!",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } 
      else {
        hideLoader()
        Swal.fire({
          title: "Erro!",
          text: "Falha na criação da conta!",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
  };

  const hideLoader = () => {
    const loaderContainer = document.getElementById('hidden');

    if (loaderContainer) {
        loaderContainer.classList.remove('hidden');

        const loaderDiv = loaderContainer.querySelector('.text-center');
        if (loaderDiv) {
            loaderContainer.removeChild(loaderDiv);
        }
    }
};

  const showLoader = () => {
    const loaderContainer = document.getElementById("hidden");

    if (loaderContainer) {
      const loaderDiv = document.createElement("div");
      loaderDiv.classList.add("text-center");

      loaderDiv.innerHTML = `
            <div role="status">
                <svg aria-hidden="true" class="mt-4 inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        `;

      loaderContainer.appendChild(loaderDiv);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <BaseLayout>
        <span className="text-white text-xl mb-4 font-medium">Cadastrar Conta</span>
        <div className="flex flex-col mb-4 w-1/3">
          <Label className="text-white pr-20">Nome Completo</Label>
          <Input
            placeholder="Digite seu Nome Completo"
            type="text"
            className="flex"
            {...register("name")}
          />
        </div>
        <div className="flex flex-col mb-4 w-1/3">
          <Label className="text-white pr-20">Email</Label>
          <Input
            placeholder="Digite seu Email"
            type="email"
            className="flex"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col mb-4 w-1/3">
          <Label className="text-white semibold">Senha</Label>
          <div className="relative">
            <Input
              placeholder="Digite sua Senha"
              type="password"
              className="flex"
              {...register("password")}
            />
          </div>
        </div>

        <div className="flex flex-col mb-4 w-1/3">
          <Label className="text-white semibold">Confirmar Senha</Label>
          <div className="relative">
            <Input
              placeholder="Digite sua senha novamente"
              type="password"
              className="flex"
              {...register("confirmPassword")}
            />
          </div>
          <span className="mt-2 ml-12 text-white font-medium">Já possui uma conta? <Link to="/login" className="text-blue-400 hover:text-blue-600">Entrar</Link></span>
          <div id="hidden" className=""></div>
        </div>
        <Button
          className="flex bg-blue-400 text-white ml-4 mt-4 w-40 h-11 text-base font-semibold shadow transition duration-300"
          type="submit"
        >
          Cadastrar
        </Button>
      </BaseLayout>
    </form>
  );
};

export default Register;
