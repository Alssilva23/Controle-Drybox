import { useState } from "react"
import "./Dashboard.css"

/**
 * Tela principal do sistema DryBox
 *
 * Responsável por:
 * - mostrar informações do usuário logado
 * - exibir os cards com resumo do estoque
 * - permitir busca de itens
 * - abrir detalhes do item
 * - abrir tela de novo item
 * - abrir administração
 */
function Dashboard({
  usuario,
  itens,
  aoSelecionarItem,
  aoNovoItem,
  aoAbrirAdmin,
  aoSair,
}) {
  // Controla o texto digitado na busca
  const [busca, setBusca] = useState("")

  // Guarda qual linha da tabela está com hover
  const [linhaHover, setLinhaHover] = useState(null)

  /**
   * Filtra os itens de acordo com o texto da busca.
   *
   * A busca verifica:
   * - código
   * - nome
   * - local
   */
  const itensFiltrados = itens.filter((item) => {
    const termo = busca.toLowerCase()

    return (
      String(item.codigo || "").toLowerCase().includes(termo) ||
      String(item.nome || "").toLowerCase().includes(termo) ||
      String(item.local || "").toLowerCase().includes(termo)
    )
  })

  // Total de registros cadastrados
  const totalItens = itens.length

  // Soma total das quantidades em estoque
  const totalPecas = itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0)

  // Quantidade de itens zerados
  const esgotados = itens.filter((item) => Number(item.quantidade || 0) === 0).length

  /**
   * Abre uma janela para impressão/exportação da lista atual de componentes.
   */
  function exportarLista() {
    const janela = window.open("", "", "width=900,height=700")

    if (!janela) {
      alert("Não foi possível abrir a janela de impressão")
      return
    }

    janela.document.write(`
      <html>
        <head>
          <title>Lista DryBox</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
            }
            h1 {
              margin-bottom: 20px;
            }
            .linha {
              padding: 8px 0;
              border-bottom: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <h1>Lista de Componentes - DryBox</h1>
          ${itens
            .map(
              (item) => `
                <div class="linha">
                  <strong>${item.codigo}</strong> | ${item.nome} | ${item.local} | ${item.quantidade}
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `)

    janela.document.close()
    janela.print()
  }

  /**
   * Abre a área de administração.
   *
   * Somente usuários com perfil "admin" podem acessar.
   */
  function abrirAdministracao() {
    if (String(usuario?.perfil || "").trim().toLowerCase() !== "admin") {
      alert("Somente admin pode acessar essa área")
      return
    }

    aoAbrirAdmin()
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* Barra lateral do sistema */}
        <aside className="dashboard-sidebar">
          <h2 className="dashboard-logo">DryBox</h2>
          <p className="dashboard-subtitle">Sistema de Estoque</p>

          {/* Card com dados do usuário logado */}
          <div className="dashboard-user-card">
            <div className="dashboard-user-name">{usuario?.nome}</div>
            <div className="dashboard-user-role">Perfil: {usuario?.perfil}</div>

            <button
              type="button"
              onClick={aoSair}
              className="dashboard-menu-item dashboard-btn-danger"
            >
              Sair
            </button>
          </div>

          {/* Menu lateral */}
  <div className="dashboard-menu">
  <button
    onClick={abrirAdministracao}
    className="dashboard-menu-item dashboard-menu-item-active"
  >
    Administração
  </button>
</div>
</aside>

        {/* Conteúdo principal */}
        <main className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Bem-vindo, {usuario?.nome}</h1>
            <p className="dashboard-description">Gerencie o inventário local do DryBox</p>
          </div>

          {/* Cards com resumo do estoque */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <p className="dashboard-card-label">Total de Itens</p>
              <h2 className="dashboard-card-value">{totalItens}</h2>
            </div>

            <div className="dashboard-card">
              <p className="dashboard-card-label">Peças em Estoque</p>
              <h2 className="dashboard-card-value">{totalPecas}</h2>
            </div>

            <div className="dashboard-card">
              <p className="dashboard-card-label">Itens Esgotados</p>
              <h2 className="dashboard-card-value dashboard-card-value-danger">{esgotados}</h2>
            </div>
          </div>

          {/* Bloco principal da tabela */}
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <h2 className="dashboard-panel-title">Inventário de Componentes</h2>

              <div className="dashboard-actions">
                <button
                  type="button"
                  onClick={exportarLista}
                  className="dashboard-btn dashboard-btn-primary"
                >
                  Exportar Lista
                </button>

                <button
                  type="button"
                  onClick={aoNovoItem}
                  className="dashboard-btn dashboard-btn-success"
                >
                  + Novo Item
                </button>
              </div>
            </div>

            {/* Campo de pesquisa */}
            <div className="dashboard-search-wrapper">
              <span className="dashboard-search-icon">🔍</span>

              <input
                type="text"
                placeholder="Pesquisar por código, nome ou local"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="dashboard-search-input"
              />
            </div>

            {/* Tabela de itens */}
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Local</th>
                  <th>Quantidade</th>
                </tr>
              </thead>

              <tbody>
                {itensFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="dashboard-empty-state">
                      Nenhum componente encontrado.
                    </td>
                  </tr>
                ) : (
                  itensFiltrados.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => aoSelecionarItem(item.id)}
                      onMouseEnter={() => setLinhaHover(item.id)}
                      onMouseLeave={() => setLinhaHover(null)}
                      className={
                        linhaHover === item.id
                          ? "dashboard-table-row dashboard-table-row-hover"
                          : "dashboard-table-row"
                      }
                    >
                      <td>{item.codigo}</td>
                      <td>{item.nome}</td>
                      <td>{item.local}</td>
                      <td>
                        {Number(item.quantidade || 0) === 0 ? (
                          <span className="dashboard-out-of-stock">Esgotado</span>
                        ) : (
                          item.quantidade
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
