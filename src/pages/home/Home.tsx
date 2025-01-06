import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";

const Home = () => {
  useEffect(() => {
    document.title = "Home | Fintrack";
  }, []);

  return (
    <BaseLayout>
    <span className="text-white text-xl mb-4 font-bold">Inicie Aqui!!</span>
      <div className="flex">
        <Link to="/login">
          <Button className="flex ml-4 mt-4 w-40 h-11 text-base text-white font-semibold shadow transition duration-200 bg-[#3c8294] hover:bg-[#0e5265]">
            Entrar
          </Button>
        </Link>
        <Link to="/register">
          <Button className="flex ml-4 mt-4 w-40 h-11 text-base text-white font-semibold shadow transition duration-200 bg-[#3c8294] hover:bg-[#0e5265]">
            Cadastrar
          </Button>
        </Link>
      </div>
    </BaseLayout>
  );
};

export default Home;
