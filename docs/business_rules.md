# Regras de Negócio - Sistema de Gestão TWENT

## 1. Regras de Hierarquia e Permissões

### 1.1 Tipos de Usuários e Acessos

#### Administrador do Sistema (Matriz)
- **Acesso total e irrestrito** a todos os dados e funcionalidades
- Pode visualizar dados de **qualquer filial** individualmente
- Único perfil autorizado a **cadastrar novas lojas**
- Acesso a **relatórios consolidados** de toda a rede
- Pode gerenciar usuários de todos os níveis
- Pode definir configurações globais do sistema

#### Funcionário da Matriz
- Acesso a dados consolidados da matriz
- Pode consultar relatórios financeiros da sede
- Pode gerenciar catálogo global de produtos
- Não pode acessar dados específicos das filiais
- Pode criar e editar usuários internos da matriz

#### Gerente de Filial
- **Acesso restrito apenas à sua própria loja**
- Pode gerenciar funcionários da sua filial
- Controla estoque, vendas e fluxo de caixa local
- Pode gerar relatórios detalhados da sua loja
- Autoriza inicialização do PDV
- Pode ajustar preços dentro dos limites definidos pela matriz

#### Funcionário de Filial
- Acesso apenas aos seus próprios dados
- Pode registrar movimentações simples de estoque
- Pode registrar despesas locais básicas
- Acesso a relatórios básicos de desempenho individual
- Pode operar PDV quando autorizado pelo gerente

#### Vendedor/Caixa (PDV)
- **Acesso exclusivo ao módulo PDV**
- Pode realizar vendas e controlar caixa
- Baixa automática de produtos do estoque
- Emissão de comprovantes simplificados
- Relatórios básicos de vendas diárias

### 1.2 Isolamento de Dados por Loja

- Usuários de filiais **não podem visualizar dados de outras filiais**
- Cada query deve filtrar por `store_id` quando o usuário não for da matriz
- Logs de auditoria registram todas as tentativas de acesso
- Violações de acesso são bloqueadas e registradas

## 2. Regras de Cadastros e Controle

### 2.1 Gestão de Lojas
- Apenas **administradores** podem cadastrar novas filiais
- Toda loja deve ter um código único
- Lojas podem ser **ativas** ou **inativas**, mas não deletadas
- Coordenadas geográficas são opcionais, mas recomendadas para localização
- Horário de funcionamento deve ser armazenado em formato JSON

### 2.2 Gestão de Usuários
- Email deve ser **único** em todo o sistema
- CPF/documento deve ser **único** quando informado
- Usuários inativos mantêm histórico, mas não podem fazer login
- Token de reset de senha expira em 24 horas
- Tentativas de login são auditadas

### 2.3 Gestão de Funcionários
- Todo funcionário deve estar vinculado a um usuário
- Código do funcionário deve ser **único**
- Salário e moeda são obrigatórios
- Data de contratação não pode ser futura
- Funcionário inativo não pode operar PDV

### 2.4 Gestão de Férias e Licenças
- Funcionário tem direito a férias após 12 meses de trabalho
- Período de férias não pode exceder 30 dias consecutivos
- Solicitações de férias devem ser feitas com **antecedência mínima** de 15 dias
- Status inicial de toda solicitação é **PENDING**
- Apenas gerentes e administradores podem **aprovar** ou **rejeitar** solicitações
- Funcionário não pode solicitar férias para período já aprovado
- Licenças médicas (SICK_LEAVE) podem ser retroativas com atestado
- Licença maternidade: 120 dias (configurável por legislação)
- Licença paternidade: 5 dias (configurável por legislação)
- Funcionário pode **cancelar** suas próprias solicitações pendentes
- Sobreposição de períodos de férias deve gerar alerta
- Sistema deve calcular automaticamente saldo de férias disponível
- Férias não gozadas devem gerar alerta após 12 meses do direito adquirido
- Aprovação de férias não pode deixar a loja sem cobertura mínima de funcionários

## 3. Regras de Produtos e Estoque

### 3.1 Catálogo de Produtos
- SKU deve ser **único** em todo o sistema
- Preço deve ser sempre maior que zero
- Produtos inativos não aparecem no PDV
- Apenas matriz pode criar novos produtos
- Filiais podem ajustar preços dentro de limites pré-definidos

### 3.2 Controle de Estoque
- Estoque não pode ficar **negativo**
- Movimentações de estoque são **auditadas**
- Transferências entre lojas requerem aprovação
- Alertas automáticos quando estoque atinge o mínimo
- Inventário físico deve ser realizado periodicamente

### 3.3 Movimentações de Estoque
- Toda movimentação deve ter **justificativa**
- Movimentações de SAÍDA requerem documento de referência
- Transferências devem ter origem e destino válidos
- Ajustes de estoque requerem aprovação superior

## 4. Regras do Ponto de Venda (PDV)

### 4.1 Controle de Caixa
- Caixa deve ser **aberto** antes de qualquer venda
- Apenas um caixa pode estar aberto por terminal
- Valor de abertura deve ser informado e validado
- Fechamento de caixa requer conferência de valores
- Diferenças de caixa devem ser justificadas

### 4.2 Processo de Vendas
- Venda só pode ser realizada com caixa aberto
- Produtos devem ter estoque disponível
- Desconto não pode exceder 100% do valor
- Vendas canceladas requerem justificativa
- Estorno requer aprovação de superior

### 4.3 Pagamentos
- Valor pago não pode ser menor que o total da venda
- Troco deve ser calculado automaticamente
- Pagamentos em cartão devem ter confirmação
- PIX deve ter QR Code válido
- Múltiplas formas de pagamento são permitidas

## 5. Regras Financeiras

### 5.1 Fluxo de Caixa
- Vendas geram **entrada automática** no fluxo de caixa
- Despesas devem ser categorizadas
- Transferências entre contas não alteram resultado
- Moeda padrão é configurável por loja
- Conciliação bancária deve ser feita mensalmente

### 5.2 Contas a Pagar
- Fornecedores devem estar cadastrados
- Vencimento não pode ser anterior à data atual
- Status de pagamento deve ser atualizado
- Juros e multas são calculados automaticamente
- Parcelamento deve manter referência original

### 5.3 Relatórios Financeiros
- Relatórios da matriz são **consolidados**
- Relatórios de filial são **individuais**
- Períodos podem ser personalizados
- Comparativos são gerados automaticamente
- Exportação em múltiplos formatos

## 6. Regras de Agendamentos

### 6.1 Gestão de Compromissos
- Cliente pode agendar mesmo sem cadastro
- Horários devem respeitar funcionamento da loja
- Reagendamentos mantêm histórico
- Cancelamentos requerem justificativa
- Confirmação automática via email/SMS

### 6.2 Disponibilidade
- Apenas horários futuros podem ser agendados
- Limite de agendamentos por período
- Bloqueios de agenda para manutenção
- Feriados são considerados automaticamente

## 7. Regras de Auditoria e Segurança

### 7.1 Log de Auditoria
- **Todas** as ações críticas são logadas
- Logs incluem: usuário, ação, dados antigos/novos, timestamp
- Logs são **imutáveis** após criação
- Retenção mínima de 7 anos
- Backup automático dos logs

### 7.2 Segurança de Acesso
- Senhas devem ter no mínimo 8 caracteres
- Bloqueio automático após 5 tentativas
- Sessões expiram após inatividade
- 2FA obrigatório para administradores
- IPs suspeitos são bloqueados

## 8. Regras de Integração

### 8.1 Sistema Fiscal
- Vendas podem gerar cupons fiscais (opcional)
- Integração com SAT/SPED
- Backup automático de dados fiscais
- Contingência offline obrigatória

### 8.2 Meios de Pagamento
- Integração com adquirentes de cartão
- Validação em tempo real
- Conciliação automática
- Taxa de administração por transação

## 9. Regras de Backup e Recuperação

### 9.1 Backup de Dados
- Backup automático diário
- Retenção: 30 dias locais, 7 anos em nuvem
- Teste de restauração mensal
- Backup incremental a cada 4 horas
- Notificação de falhas

### 9.2 Recuperação de Desastres
- RTO (Recovery Time Objective): 4 horas
- RPO (Recovery Point Objective): 1 hora
- Plano de contingência documentado
- Site de recuperação ativo
- Testes semestrais obrigatórios

## 10. Regras de Performance

### 10.1 Tempo de Resposta
- PDV: máximo 2 segundos por operação
- Relatórios: máximo 30 segundos
- Dashboard: carregamento em 5 segundos
- Sincronização: máximo 15 minutos

### 10.2 Disponibilidade
- Sistema deve ter 99.9% de uptime
- Manutenção programada fora do horário comercial
- Alertas automáticos de indisponibilidade
- Escalabilidade automática em picos

---

**Nota:** Estas regras de negócio devem ser respeitadas em todas as implementações do sistema, garantindo consistência, segurança e conformidade com as necessidades da rede TWENT.