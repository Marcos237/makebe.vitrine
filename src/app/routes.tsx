import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../features/Home";
import { PrivacyPolicyPage, TermsOfUsePage } from "../features/Legal";
import { MeusAgendamentosPage } from "../features/MeusAgendamentos";
import { PesquisaAgendamentoPage } from "../features/PesquisaAgendamento";
import { VitrinePage } from "../features/Vitrine";
import {
  AgendamentoColaboradorPage,
  ColaboradorVitrinePage,
  VitrineLojaPage,
} from "../features/VitrineLoja";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/vitrine" element={<VitrinePage />} />
      <Route path="/vitrine/pesquisa" element={<PesquisaAgendamentoPage />} />
      <Route path="/vitrineLoja/:vitrine" element={<VitrineLojaPage />} />
      <Route
        path="/colaboradorVitrine/:lojaId/:colaboradorId"
        element={<ColaboradorVitrinePage />}
      />
      <Route
        path="/agendamento/:lojaId/:colaboradorId"
        element={<AgendamentoColaboradorPage />}
      />
      <Route path="/meus-agendamentos" element={<MeusAgendamentosPage />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
      <Route path="/termos-de-uso" element={<TermsOfUsePage />} />
    </Routes>
  );
}
