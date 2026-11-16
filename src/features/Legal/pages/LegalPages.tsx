import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import styles from "../styles/LegalPage.module.css";

interface LegalPageLayoutProps { children: ReactNode; title: string; }

function LegalPageLayout({ children, title }: LegalPageLayoutProps) {
  return <main className={styles.page}>
    <Banner />
    <section className={styles.content} aria-labelledby="legal-page-title">
      <article className={styles.document}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>MakeBe</p>
          <h1 id="legal-page-title" className={styles.title}>{title}</h1>
          <p className={styles.updatedAt}>Última atualização: 17/11/2026</p>
        </header>
        <div className={styles.body}>{children}</div>
        <Link className={styles.backLink} to="/">Voltar para a página inicial</Link>
      </article>
    </section>
    <Footer />
  </main>;
}

export function PrivacyPolicyPage() {
  return <LegalPageLayout title="Política de Privacidade — MakeBe">
    <section><h2>1. Apresentação</h2><p>O MakeBe é uma plataforma de agendamento online que conecta clientes a salões de beleza, barbearias e profissionais cadastrados.</p><p>Por meio da plataforma, os usuários podem consultar estabelecimentos, conhecer serviços disponíveis e realizar solicitações de agendamento.</p><p>Esta Política de Privacidade explica como os dados pessoais são coletados, utilizados, armazenados e compartilhados durante a utilização dos serviços MakeBe.</p></section>
    <section><h2>2. Dados que podemos coletar</h2><p>Para disponibilizar os serviços, o MakeBe poderá coletar:</p><ul><li>Nome do usuário.</li><li>Número de telefone.</li><li>Informações enviadas durante conversas pelo WhatsApp.</li><li>Informações relacionadas aos agendamentos.</li><li>Estabelecimento escolhido.</li><li>Serviço e profissional selecionados.</li><li>Datas e horários dos agendamentos.</li><li>Informações técnicas necessárias ao funcionamento e à segurança da plataforma.</li></ul><p>Os dados efetivamente coletados dependerão das funcionalidades utilizadas pelo usuário.</p></section>
    <section><h2>3. Como utilizamos os dados</h2><p>Os dados pessoais poderão ser utilizados para:</p><ul><li>Identificar o usuário durante o atendimento.</li><li>Processar solicitações de agendamento.</li><li>Consultar a disponibilidade de horários.</li><li>Registrar e confirmar agendamentos.</li><li>Permitir que o estabelecimento escolhido consulte os agendamentos.</li><li>Enviar informações relacionadas ao atendimento.</li><li>Melhorar a segurança e o funcionamento da plataforma.</li><li>Cumprir obrigações legais e regulatórias.</li></ul></section>
    <section><h2>4. Utilização do WhatsApp</h2><p>O MakeBe poderá utilizar a API oficial do WhatsApp Business, disponibilizada pela Meta, para receber e enviar mensagens relacionadas aos agendamentos.</p><p>O usuário inicia o atendimento por meio do número oficial do MakeBe.</p><p>Durante a conversa, o sistema poderá identificar o estabelecimento escolhido e encaminhar as informações necessárias para realizar o agendamento.</p><p>A utilização do WhatsApp também está sujeita às políticas e condições da Meta e do próprio WhatsApp.</p></section>
    <section><h2>5. Compartilhamento de dados com estabelecimentos</h2><p>Quando o usuário escolhe um salão, barbearia ou profissional cadastrado, as informações necessárias para realizar o atendimento e administrar o agendamento poderão ser compartilhadas com o estabelecimento selecionado.</p><p>Essas informações poderão incluir:</p><ul><li>Nome do cliente.</li><li>Telefone de contato.</li><li>Serviço solicitado.</li><li>Profissional escolhido.</li><li>Data e horário do agendamento.</li></ul><p>O compartilhamento ocorre para viabilizar a prestação do serviço solicitado.</p></section>
    <section><h2>6. Compartilhamento com fornecedores e serviços de terceiros</h2><p>Para disponibilizar e manter o funcionamento da plataforma, o MakeBe poderá utilizar serviços tecnológicos de terceiros, incluindo infraestrutura de hospedagem, armazenamento, comunicação e integração com plataformas externas.</p><p>Quando necessário, dados poderão ser tratados por esses fornecedores exclusivamente para viabilizar as funcionalidades contratadas e o funcionamento dos serviços.</p><p>Esses tratamentos deverão observar as finalidades informadas nesta política e a legislação aplicável.</p></section>
    <section><h2>7. Armazenamento e segurança</h2><p>O MakeBe adota medidas técnicas e organizacionais destinadas a proteger os dados pessoais contra acessos não autorizados, perda, alteração ou divulgação indevida.</p><p>O acesso às informações é limitado conforme as necessidades de funcionamento da plataforma e das atividades dos estabelecimentos.</p><p>Os dados serão mantidos pelo período necessário para cumprir as finalidades informadas nesta política, respeitando as obrigações legais aplicáveis.</p></section>
    <section><h2>8. Direitos dos titulares</h2><p>Nos termos da Lei Geral de Proteção de Dados Pessoais (LGPD), o usuário poderá solicitar, observadas as condições legais:</p><ul><li>Confirmação da existência de tratamento de dados.</li><li>Acesso aos dados pessoais.</li><li>Correção de informações incompletas ou desatualizadas.</li><li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a legislação.</li><li>Informações sobre compartilhamento de dados.</li><li>Eliminação dos dados pessoais, quando aplicável.</li><li>Revogação do consentimento, quando o tratamento estiver baseado nele.</li></ul></section>
    <section><h2>9. Solicitações de privacidade e exclusão de dados</h2><p>Para solicitar informações, correções ou exclusão de dados pessoais, o usuário poderá entrar em contato pelo seguinte endereço:</p><p><strong>E-mail: makebeapp@gmail.com</strong></p><p>As solicitações serão avaliadas conforme a legislação aplicável e poderão estar sujeitas à necessidade de manutenção de informações para cumprimento de obrigações legais ou regulatórias.</p></section>
    <section><h2>10. Alterações nesta política</h2><p>Esta Política de Privacidade poderá ser atualizada para refletir mudanças nos serviços, funcionalidades ou requisitos legais.</p><p>A versão atualizada será disponibilizada nesta página, acompanhada da respectiva data de atualização.</p></section>
    <section><h2>11. Legislação aplicável</h2><p>Esta política é regida pela legislação brasileira, especialmente pela Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD).</p></section>
    <section><h2>12. Contato</h2><p>Para dúvidas, solicitações ou informações relacionadas à privacidade:</p><p><strong>E-mail: makebeapp@gmail.com</strong></p></section>
  </LegalPageLayout>;
}

export function TermsOfUsePage() {
  return <LegalPageLayout title="Termos de Uso — MakeBe">
    <section><h2>1. Aceitação dos termos</h2><p>Ao acessar ou utilizar a plataforma MakeBe, o usuário declara que leu e concorda com estes Termos de Uso.</p><p>Caso não concorde com alguma condição, deverá deixar de utilizar os serviços.</p></section>
    <section><h2>2. Sobre o MakeBe</h2><p>O MakeBe é uma plataforma tecnológica destinada a facilitar a busca por estabelecimentos e a realização de agendamentos em salões de beleza, barbearias e profissionais cadastrados.</p><p>A plataforma disponibiliza recursos digitais para conectar clientes e estabelecimentos.</p></section>
    <section><h2>3. Funcionamento dos agendamentos</h2><p>O usuário poderá acessar os canais disponibilizados pelo MakeBe, escolher um estabelecimento, consultar serviços, selecionar profissionais e solicitar horários disponíveis.</p><p>Os agendamentos estarão sujeitos à disponibilidade informada pelo estabelecimento.</p><p>A confirmação será realizada pelos canais disponibilizados pela plataforma.</p></section>
    <section><h2>4. Responsabilidades do usuário</h2><p>O usuário compromete-se a:</p><ul><li>Informar dados verdadeiros e atualizados.</li><li>Utilizar a plataforma de maneira adequada.</li><li>Não utilizar os serviços para atividades ilegais.</li><li>Respeitar os horários e condições dos agendamentos.</li><li>Comunicar eventuais cancelamentos ou alterações pelos canais disponíveis.</li></ul></section>
    <section><h2>5. Responsabilidades dos estabelecimentos</h2><p>Os estabelecimentos cadastrados são responsáveis pelas informações que disponibilizam na plataforma, incluindo:</p><ul><li>Serviços oferecidos.</li><li>Valores informados.</li><li>Profissionais cadastrados.</li><li>Disponibilidade de horários.</li><li>Atendimento e execução dos serviços contratados.</li></ul><p>O estabelecimento também deverá manter suas informações e disponibilidade atualizadas.</p></section>
    <section><h2>6. Cancelamentos e alterações</h2><p>Solicitações de cancelamento ou alteração de agendamento deverão ser realizadas pelos canais disponibilizados pelo MakeBe ou diretamente pelo estabelecimento, conforme as funcionalidades disponíveis.</p><p>O estabelecimento poderá estabelecer condições específicas para cancelamentos e alterações, desde que informadas ao cliente.</p></section>
    <section><h2>7. Disponibilidade da plataforma</h2><p>O MakeBe buscará manter seus serviços disponíveis, mas poderá realizar manutenções, atualizações ou interrupções técnicas necessárias ao funcionamento e à segurança da plataforma.</p><p>Não há garantia de disponibilidade ininterrupta.</p></section>
    <section><h2>8. Dados pessoais</h2><p>O tratamento de dados pessoais durante a utilização do MakeBe seguirá a Política de Privacidade da plataforma.</p><p>Ao utilizar os serviços, o usuário declara estar ciente de que os dados necessários ao agendamento poderão ser compartilhados com o estabelecimento escolhido.</p></section>
    <section><h2>9. Propriedade intelectual</h2><p>A marca MakeBe, seus elementos visuais, sistemas, interfaces, conteúdos e funcionalidades são protegidos pela legislação aplicável.</p><p>Não é permitido copiar, reproduzir ou utilizar esses elementos sem autorização, salvo nas hipóteses permitidas por lei.</p></section>
    <section><h2>10. Alterações nos termos</h2><p>Estes Termos de Uso poderão ser atualizados sempre que necessário.</p><p>A versão vigente estará disponível nesta página, com a respectiva data de atualização.</p></section>
    <section><h2>11. Contato</h2><p>Para dúvidas relacionadas à plataforma ou a estes Termos de Uso:</p><p><strong>E-mail: makebeapp@gmail.com</strong></p></section>
    <section><h2>12. Legislação aplicável</h2><p>Estes termos são regidos pelas leis da República Federativa do Brasil.</p></section>
  </LegalPageLayout>;
}
