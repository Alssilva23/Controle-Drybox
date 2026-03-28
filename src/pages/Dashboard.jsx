import { useState } from "react"
import "./Dashboard.css"

/* tela principal */
function Dashboard({
  usuario,
  itens,
  aoSelecionarItem,
  aoNovoItem,
  aoAbrirAdmin,
  aoAbrirIndicadores,
  aoSair,
}) {
  /* texto da busca */
  const [busca, setBusca] = useState("")

  /* linha com hover */
  const [linhaHover, setLinhaHover] = useState(null)

  /* itens filtrados */
  const itensFiltrados = itens.filter((item) => {
    const termo = busca.toLowerCase()

    return (
      String(item.codigo || "").toLowerCase().includes(termo) ||
      String(item.nome || "").toLowerCase().includes(termo) ||
      String(item.local || "").toLowerCase().includes(termo)
    )
  })

  /* total de itens */
  const totalItens = itens.length

  /* total de peças */
  const totalPecas = itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0)

  /* itens esgotados */
  /* itens esgotados */
const esgotados = itens.filter((item) => Number(item.quantidade || 0) === 0).length

/* itens mais utilizados (menor quantidade em estoque) */
const itensMaisUsados = [...itens]
  .sort((a, b) => Number(a.quantidade || 0) - Number(b.quantidade || 0))
  .slice(0, 5)

/* botão exportar lista */
function exportarLista() {
   
  /* botão exportar lista */
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

  /* botão administração */
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
        {/* menu lateral */}
        <aside className="dashboard-sidebar">
          {/* logo do sistema */}
          <h2 className="dashboard-logo">DryBox</h2>
          <p className="dashboard-subtitle">Sistema de Estoque</p>

          {/* botões do menu */}
<div className="dashboard-menu">

  {/* botão administração */}
  <button
    type="button"
    onClick={abrirAdministracao}
    className="dashboard-menu-item dashboard-menu-item-active"
  >
    Administração
  </button>

  {/* botão para ver itens mais utilizados */}
  <button
    type="button"
    onClick={aoAbrirIndicadores}
    className="dashboard-menu-item"
  >
    Mais utilizados
  </button>

</div>
          {/* card com usuario logado */}
          <div className="dashboard-user-card">
            <div className="dashboard-user-name">{usuario?.nome}</div>
            <div className="dashboard-user-role">Perfil: {usuario?.perfil}</div>

            {/* botão sair */}
            <button
              type="button"
              onClick={aoSair}
              className="dashboard-menu-item dashboard-btn-danger"
            >
              Sair
            </button>
          </div>
        </aside>

        {/* conteudo principal */}
        <main className="dashboard-content">
          {/* topo da pagina */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Bem-vindo, {usuario?.nome}</h1>
            <p className="dashboard-description">Gerencie o inventário local do DryBox</p>
          </div>

          {/* cards de resumo */}
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

          {/* bloco principal */}
          <section className="dashboard-panel">
            {/* topo do bloco */}
            <div className="dashboard-panel-header">
              <h2 className="dashboard-panel-title">Inventário de Componentes</h2>

              {/* botões do topo */}
              <div className="dashboard-actions">
                {/* botão exportar lista */}
                <button
                  type="button"
                  onClick={exportarLista}
                  className="dashboard-btn dashboard-btn-primary"
                >
                  Exportar Lista
                </button>

                {/* botão novo item */}
                <button
                  type="button"
                  onClick={aoNovoItem}
                  className="dashboard-btn dashboard-btn-success"
                >
                  + Novo Item
                </button>
              </div>
            </div>

            {/* campo de busca */}
            <div className="dashboard-search-wrapper">
              <span className="dashboard-search-icon"></span>

              <input
                type="text"
                placeholder="Pesquisar por código, nome ou local"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="dashboard-search-input"
              />
            </div>

            {/* tabela */}
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
