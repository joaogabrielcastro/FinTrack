import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import userLogo from "/svg/user.svg";
import { useContext } from "react";
import { AuthContext } from "@/shared/contexts/AuthContext";

const TopBar = () => {
    const { user, signOutUser } = useContext(AuthContext);
    return(
        <header className="w-full h-24 bg-[#0E5265] flex justify-end items-center shadow-md">
          <div className="text-white mr-3">{user && user.nome}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full w-11 h-11 mr-3">
                <img src={userLogo} alt="user image" className="w-auto h-auto" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-200">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOutUser()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
    )
}
export default TopBar