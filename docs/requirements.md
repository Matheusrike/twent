# Documento de Fluxo do Sistema de Gestão

## 1. Site (Front-office Público)

### Público-alvo

-   Usuários comuns (clientes).

### Funcionalidades

-   Consulta de produtos disponíveis (catálogo geral ou por loja).
-   Localização de lojas/boutiques no mapa.
-   Agendamento de visitas em loja.
-   Criação de conta de cliente para salvar favoritos, histórico e agendamentos.

---

## 2. Sistema de Gestão (Back-office)

### 2.1. Back-office da Matriz

#### Público-alvo

-   Administradores e funcionários da matriz.

#### Funcionalidades

-   **Gestão de Lojas:**

    -   Cadastrar novas filiais.
    -   Editar e desativar filiais.
    -   Associar funcionários a cada filial.

-   **Gestão de Funcionários (Matriz e Filiais):**

    -   Cadastro e edição de dados dos funcionários de todas as lojas.
    -   Gestão de remuneração (sem comissionamento).
    -   Controle de férias e afastamentos.
    -   Acompanhamento dos custos totais de cada funcionário (salário, encargos, benefícios).
    -   Relatórios consolidados de despesas com pessoal.

-   **Gestão Financeira Global:**

    -   Fluxo de caixa consolidado.
    -   Relatórios financeiros de toda a rede.
    -   Controle central de contas a pagar (fornecedores, despesas, salários).

-   **Relatórios Estratégicos:**

    -   Visão consolidada de todas as lojas.
    -   Relatórios comparativos por filial.

-   **Gestão de Catálogo:**

    -   Cadastro global de produtos (SKU, categorias, preços sugeridos).
    -   Definição de preços base.
    -   Bloqueio de produtos obsoletos.

-   **Controle de Permissões:**

    -   Definir perfis de acesso para matriz e filiais.

---

### 2.2. Back-office das Filiais

#### Público-alvo

-   Gerentes e funcionários de cada filial.

#### Funcionalidades

-   **Gestão de Loja Local:**

    -   Controle de funcionários da filial.
    -   Atribuição de funções e permissões.

-   **Gestão de Funcionários (Filial):**

    -   Cadastro e edição de dados apenas dos funcionários da própria filial.
    -   Gestão de remuneração (sem comissionamento).
    -   Controle de férias e afastamentos.
    -   Relatórios de custos de pessoal da filial.

-   **Gestão de Estoque:**

    -   Acompanhamento e atualização do estoque local.
    -   Requisição de reposição para a matriz.

-   **Gestão Financeira Local:**

    -   Fluxo de caixa da filial.
    -   Registro de despesas locais (contas operacionais, pequenas compras).

-   **Relatórios Locais:**

    -   Vendas e desempenho apenas da própria loja.

-   **Execução de Preços:**

    -   Aplicar ajustes dentro dos limites definidos pela matriz.

---

## 3. PDV (Frente de Caixa)

### Público-alvo

-   Vendedores/Caixas da loja.

### Funcionalidades

-   Abertura e fechamento de caixa.
-   Registro de vendas (busca, carrinho, pagamento).
-   Emissão de comprovante simplificado.
-   Integração automática com estoque e fluxo de caixa.

### Regras

-   O modo PDV só pode ser iniciado por funcionários autorizados.
-   Requer validação de um superior (gerente ou administrador).

---

## 4. Administrador do Sistema

### Gestão de Usuários e Permissões

-   Criar, editar e desativar contas de colaboradores.
-   Definir perfis de acesso (Administrador, Funcionário da matriz, Gerente de filial, Funcionário de filial).
-   Configurar políticas de segurança (2FA, redefinição de senha, logs de acesso).

### Gestão de Lojas

-   Cadastrar novas filiais.
-   Associar funcionários às filiais.
-   Definir hierarquia organizacional.
-   Bloquear ou encerrar uma filial.

### Supervisão de Operações

-   Monitorar status de caixas, vendas e estoques.
-   Validar abertura de PDV, cancelamentos e estornos.

### Gestão Financeira Consolidada

-   Acessar e consolidar o fluxo de caixa global.
-   Controlar contas a pagar (fornecedores, despesas recorrentes).
-   Integrar com sistemas contábeis/fiscais externos.

### Gestão de Catálogo e Fornecedores

-   Gerenciar produtos (SKU, preços, categorias).
-   Cadastrar fornecedores.
-   Definir preços sugeridos.
-   Bloquear produtos obsoletos.

### Governança do Sistema

-   Monitorar logs e auditoria de atividades.
-   Definir políticas de backup e recuperação.
-   Manter parâmetros gerais (moeda, impostos, integrações).
-   Garantir conformidade legal (LGPD e normas fiscais).

---

## 5. Quadro Comparativo de Permissões

| Função/Seção               | Matriz (Administrador)                            | Funcionário da Matriz                                | Gerente da Filial                                       | Funcionário da Filial                         | PDV (Caixa/Vendedor)                     |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| **Gestão de Lojas**        | Cadastrar, editar e desativar filiais             | Consultar informações de filiais já cadastradas      | Gerenciar apenas dados da própria filial                | Sem acesso                                    | Sem acesso                               |
| **Gestão de Usuários**     | Criar/editar/excluir qualquer usuário             | Criar e editar usuários internos da matriz           | Criar e editar usuários apenas da própria filial        | Acessar apenas seus próprios dados            | Sem acesso                               |
| **Gestão de Funcionários** | Acompanhar custos de todos os funcionários        | Visualizar custos e dados dos funcionários da matriz | Visualizar e gerenciar funcionários da filial           | Consultar e editar apenas seus próprios dados | Sem acesso                               |
| **Gestão Financeira**      | Fluxo de caixa consolidado + relatórios completos | Visualizar relatórios financeiros da matriz          | Visualizar e gerenciar fluxo de caixa da filial         | Registrar pequenas despesas locais            | Registrar vendas                         |
| **Gestão de Estoque**      | Visualizar e gerenciar estoque global             | Consultar relatórios de estoque da matriz            | Controlar estoque da filial (entradas, saídas, alertas) | Registrar entradas/saídas manuais simples     | Baixa automática de produtos vendidos    |
| **Relatórios**             | Relatórios globais e comparativos entre filiais   | Relatórios da matriz                                 | Relatórios detalhados da própria filial                 | Relatórios básicos (desempenho individual)    | Relatório simplificado de vendas diárias |
| **Catálogo/Produtos**      | Criar, editar e bloquear produtos globalmente     | Consultar catálogo global                            | Ajustar preços dentro do limite definido pela matriz    | Consultar catálogo da filial                  | Aplicar preços já definidos              |
| **Operações PDV**          | Aprovar, auditar e supervisionar                  | Sem acesso                                           | Autorizar inicialização do PDV da filial                | Operar PDV quando autorizado pelo gerente     | Operar PDV (venda e fechamento de caixa) |

---

## Resumo

O sistema é estruturado em três camadas principais:

1. **Front-office (Site):** experiência do cliente final.
2. **Back-office (Gestão):** dividido entre **matriz** (gestão estratégica e consolidada) e **filiais** (gestão local).
3. **PDV:** operação diária de vendas.

O **administrador do sistema** atua como elo central, garantindo:

-   **Estratégia:** visão consolidada da rede.
-   **Operação:** regras e supervisão de processos.
-   **Técnica:** segurança, integridade e governança do sistema.
