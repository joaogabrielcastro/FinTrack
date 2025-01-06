import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SideBar from "@/pages/painel/components/SideBar";
import { useEffect } from "react";

const SobreIob = () => {
  useEffect(() => {
    document.title = "Sobre IOB | Fintrack";
  });

  return (
    <SideBar>
      <div className="bg-gray-800 w-full h-full flex flex-col justify-center items-center py-10">
        <div className="w-[97%] max-w-[100%] bg-white rounded-lg shadow-lg p-6">
          <Card className="bg-white">
            <CardHeader className="bg-white">
              <CardTitle className="text-2xl font-bold text-[#3c8294]">Sobre IOB</CardTitle>
              <CardDescription className="text-lg text-gray-700">
                Explore e descubra como funciona o IOB
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-800 leading-relaxed bg-white">
              <p className="text-xl font-semibold mb-4">
                A Revista IOB é uma publicação de grande prestígio no universo jurídico e contábil, amplamente reconhecida por sua excelência e pela abrangência de seu conteúdo. Dedicada a profissionais das áreas tributária, contábil e empresarial, a IOB se destaca ao oferecer informações relevantes e constantemente atualizadas sobre legislação, jurisprudência, doutrina e práticas empresariais.
              </p>

              <SectionTitle title="Abrangência Temática" />
              <p className="mt-2">
                A Revista IOB cobre uma vasta gama de tópicos que são essenciais para os profissionais dessas áreas. Entre os principais temas abordados estão:
              </p>
              <ListItems items={[
                "Questões Fiscais: Análises detalhadas de mudanças na legislação tributária, interpretações de normas fiscais e orientações práticas para o cumprimento das obrigações fiscais.",
                "Assuntos Trabalhistas: Discussões sobre a legislação trabalhista, direitos e deveres dos empregados e empregadores, e análises de decisões judiciais relevantes.",
                "Contabilidade: Artigos sobre normas contábeis, auditoria, controladoria, e melhores práticas para a gestão contábil das empresas.",
                "Gestão Empresarial: Dicas e estratégias para a administração eficiente de negócios, incluindo planejamento financeiro, gestão de riscos e compliance."
              ]} />

              <SectionTitle title="Contribuições de Especialistas" />
              <p className="mt-2">
                Os artigos publicados na Revista IOB são elaborados por especialistas de renome, que trazem uma riqueza de conhecimento e experiência para seus textos. Estes profissionais compartilham análises aprofundadas, interpretações de normas e discussões sobre casos práticos, oferecendo aos leitores uma compreensão clara e aplicável das complexas legislações vigentes. Além disso, as contribuições incluem:
              </p>
              <ListItems items={[
                "Estudos de Caso: Exemplos práticos que ilustram a aplicação de normas e regulamentos em situações reais, ajudando os leitores a entender como lidar com desafios similares em suas próprias práticas profissionais.",
                "Entrevistas: Conversas com autoridades e figuras influentes nas áreas jurídica e contábil, proporcionando insights exclusivos sobre tendências e mudanças no mercado."
              ]} />

              <SectionTitle title="Atualizações e Tendências" />
              <p className="mt-2">
                A Revista IOB se mantém na vanguarda ao acompanhar de perto as atualizações legislativas e as tendências do mercado. Os leitores recebem informações sobre:
              </p>
              <ListItems items={[
                "Mudanças Legislativas: Atualizações sobre novas leis e regulamentos, bem como sobre alterações em legislações existentes que impactam diretamente as áreas contábil e jurídica.",
                "Tendências do Mercado: Análises de tendências emergentes que podem afetar as práticas empresariais, incluindo novas tecnologias, mudanças econômicas e inovações no campo da contabilidade e gestão empresarial."
              ]} />

              <SectionTitle title="Público-Alvo" />
              <p className="mt-2">
                A Revista IOB é uma ferramenta valiosa para uma ampla gama de profissionais, incluindo:
              </p>
              <ListItems items={[
                "Advogados: Que buscam se manter informados sobre mudanças legislativas e decisões judiciais que possam impactar seus clientes.",
                "Contadores: Que necessitam de atualizações constantes sobre normas contábeis e práticas de auditoria.",
                "Gestores Empresariais: Que procuram orientações para melhorar a eficiência e a conformidade de suas operações.",
                "Estudantes: Que estão se preparando para entrar no mercado de trabalho e desejam complementar sua formação acadêmica com conhecimentos práticos e atualizados."
              ]} />

              <SectionTitle title="Compromisso com a Qualidade" />
              <p className="mt-2">
                Com um histórico de qualidade e compromisso com a excelência editorial, a Revista IOB continua a ser uma referência fundamental para os profissionais que buscam se manter atualizados e bem informados em um ambiente empresarial e jurídico em constante evolução. A revista se destaca por sua:
              </p>
              <ListItems items={[
                "Rigor Editorial: A seleção criteriosa dos artigos e a revisão por pares garantem a alta qualidade do conteúdo publicado.",
                "Relevância: A capacidade de abordar temas atuais e relevantes, proporcionando informações que realmente fazem a diferença na prática profissional dos leitores.",
                "Confiabilidade: A reputação construída ao longo dos anos como uma fonte confiável e respeitada de conhecimento e informação."
              ]} />

              <p className="mt-4">
                Em resumo, a Revista IOB se firma como uma publicação indispensável para qualquer profissional que deseja se manter na dianteira do conhecimento jurídico e contábil, fornecendo as ferramentas e informações necessárias para enfrentar os desafios e aproveitar as oportunidades em suas respectivas áreas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SideBar>
  );
};

const SectionTitle = ({ title }: { title: string }): JSX.Element => (
  <h2 className="text-xl font-bold text-[#3c8294] mt-6">{title}</h2>
);

const ListItems = ({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside ml-6 mt-2">
    {items.map((item, index) => (
      <li key={index} className="mt-2"><strong>{item.split(":")[0]}:</strong> {item.split(":")[1]}</li>
    ))}
  </ul>
);

export default SobreIob;
