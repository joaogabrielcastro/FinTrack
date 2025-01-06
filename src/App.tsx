import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "@/shared/contexts/AuthContext"
import Home from "@pages/home/Home.tsx"
import Clientes from "@pages/clients/Clients"
import Login from "@pages/login/Login"
import Register from "@/pages/register/Register"
import Painel from "@/pages/painel/Painel"
import SobreIob from '@/pages/sobre-iob/sobre-iob';
import CalendarioIOB from "@/pages/calendario-iob/calendario-iob"
import Funcionarios from "@/pages/funcionarios/funcionarios"
import Periodicos from "@/pages/periodicos/periodicos"
import PrivateRoutes from "@/shared/components/PrivateRoutes"
import Usuarios from "@/pages/users/usuarios"
import Empresas from "@/pages/empresas/empresas"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes Open */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Routes Close using JWT */}
          <Route element={<PrivateRoutes/>}>
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/clientes" element={<Clientes />}/>
            <Route path="/painel" element={<Painel />}/>
            <Route path="/periodicos" element={<Periodicos />}/>
            <Route path="/empresas" element={<Empresas />}/>
            <Route path="/calendario-iob" element={<CalendarioIOB />}/>
            <Route path="/sobre-iob" element={<SobreIob />}/>
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
