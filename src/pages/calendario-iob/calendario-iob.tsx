import React, { useEffect, useRef, useState } from "react";
import SideBar from "@pages/painel/components/SideBar";
import TopBar from "@pages/painel/components/TopBar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format as dateFnsFormat,
  parse as dateFnsParse,
  startOfWeek,
  getDay,
  format,
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./css/calendar-custom.css";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarUi } from "@/components/ui/calendar";
import { Cliente } from "@/shared/types/Clients";

// Tipagem para eventos
interface Event {
  title: string;
  start: Date;
  end: Date;
  clienteId?: string;
  periodicoId?: string;
  filialId?: string;
}

const CalendarioIOB: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([])
  const { register, handleSubmit, control, reset } = useForm<Event>();

  const locales = {
    "pt-BR": ptBR,
  };

  const localizer = dateFnsLocalizer({
    format: (date: Date, formatStr: string, options: any) =>
      dateFnsFormat(date, formatStr, { locale: ptBR }),
    parse: (dateStr: string, formatStr: string, options: any) =>
      dateFnsParse(dateStr, formatStr, new Date(), { locale: ptBR }),
    startOfWeek: (date: Date, options: any) => startOfWeek(date, { locale: ptBR }),
    getDay,
    locales,
  });

  const events: Event[] = [
    {
      title: "IOB Empresa 1 - 2024",
      start: new Date(2024, 5, 15, 10, 0),
      end: new Date(2024, 5, 15, 12, 0),
    },
    {
      title: "IOB Empresa 2 - 2024",
      start: new Date(2024, 5, 16, 12, 0),
      end: new Date(2024, 5, 22, 13, 0),
    },
    {
      title: "IOB Teste - 2023",
      start: new Date(2023, 5, 16, 12, 0),
      end: new Date(2023, 5, 17, 13, 0),
    },
    {
      title: "IOB A",
      start: new Date(2024, 6, 1, 9, 0),
      end: new Date(2024, 6, 1, 11, 0),
    },
    {
      title: "IOB B",
      start: new Date(2024, 6, 2, 14, 0),
      end: new Date(2024, 6, 4, 16, 0),
    },
    {
      title: "Teste",
      start: new Date(2024, 6, 5, 10, 0),
      end: new Date(2024, 6, 8, 18, 0),
    },
  ];
  

  useEffect(() => {
    document.title = "Calendário | Fintrack";
  }, []);

  return (
    <SideBar>
      <div className="bg-gray-800 w-full">
        <TopBar />
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4 p-3 mt-4">
            <div className="w-full flex justify-end">
              <div className="w-72 px-3 py-1.5 border border-white/30 rounded-lg font-sm flex items-center gap-3">
                <Search className="size-4 text-white" />
                <input
                  className="bg-transparent flex-1 outline-none text-sm border-0 p-0 focus:ring-0 text-white"
                  placeholder="Buscar Emprestimo..."
                />
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-4 font-semibold text-white bg-[#3c8294] hover:bg-[#0e5265] transition-all duration-200">
                    <span className="text-white font-semibold">Adicionar Emprestimo</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-zinc-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Adicionar Emprestimo</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Label className="text-white">Data de Emprestimo</Label>
                      <Controller
                        name="start"
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

                      <Label className="text-white">Data de Devolução</Label>
                      <Controller
                        name="end"
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
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
        <div className="p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, color: "white" }}
            messages={{
              allDay: "Dia inteiro",
              previous: "Anterior",
              next: "Próximo",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Lista",
              date: "Data",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "Não há eventos neste período.",
              showMore: (total) => `+ Ver mais (${total})`,
            }}
          />
        </div>
      </div>
    </SideBar>
  );
};

export default CalendarioIOB;
