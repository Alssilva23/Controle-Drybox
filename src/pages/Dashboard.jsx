import { useState } from "react"
import "./Dashboard.css"

/**
 * Tela principal do sistema
 */
function Dashboard({
  usuario,
  itens,
  aoSelecionarItem,
  aoNovoItem,
  aoAbrirAdmin,
  aoSair,
}) {
  // campo de busca
  const [busca, setBusca] = useState("")

  // linha que está com hover
  const [linhaHover, setLinhaHover] = useState(null)

  // filtra itens pela busca
  const itensFiltrados = itens.filter((item) => {
    const termo = busca.toLowerCase()

    return (
      String(item.codigo || "").toLowerCase().includes(termo) ||
      String(item.nome || "").toLowerCase().includes(termo) ||
      String(item.local || "").toLowerCase().includes(termo)
    )
  })

  // totais
  const totalItens = itens.length
  const totalPecas = itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0)
  const esgotados = itens.filter((item) => Number(item.quantidade || 0) === 0).length

  // exportar lista
  function exportarLista() {
    const janela = window.open("", "", "width=900,height=700")

    if (!janela) {
      alert("Erro ao abrir impressão")
      return
    }

    janela.document.write(`
      <html>
        <head>
          <title>Lista DryBox</title>
        </head>
        <body>
          <h1>Lista de Componentes</h1>
          ${itens.map(item => `
            <div>
              ${item.codigo} | ${item.nome} | ${item.local} | ${item.quantidade}
            </div>
          `).join("")}
        </body>
      </html>
    `)

    janela.document.close()
    janela.print()
  }

  // abrir admin (só admin entra)
  function abrirAdministracao() {
    if (String(usuario?.perfil || "").trim().toLowerCase() !== "admin") {
      alert("Somente admin pode acessar")
      return
    }

    aoAbrirAdmin()
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">

        {/* sidebar / menu lateral */}
        <aside className="dashboard-sidebar">

          {/* logo */}
          <h2 className="dashboard-logo">DryBox</h2>
          <p className="dashboard-subtitle">Sistema de Estoque</p>

          {/* botão de administração (fica em cima) */}
          <div className="dashboard-menu">
            <button
              onClick={abrirAdministracao}
              className="dashboard-menu-item dashboard-menu-item-active"
            >
              Administração
            </button>
          </div>

          {/* card com usuário logado (fica embaixo) */}
          <div className="dashboard-user-card">
            <div className="dashboard-user-name">{usuario?.nome}</div>
            <div className="dashboard-user-role">Perfil: {usuario?.perfil}</div>

            {/* botão sair */}
            <button
              onClick={aoSair}
              className="dashboard-menu-item dashboard-btn-danger"
            >
              Sair
            </button>
          </div>

        </aside>

        {/* conteúdo principal */}
        <main className="dashboard-content">

          {/* título da página */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Bem-vindo, {usuario?.nome}</h1>
            <p className="dashboard-description">
              Gerencie o inventário do DryBox
            </p>
          </div>

          {/* cards resumo */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <p>Total de Itens</p>
              <h2>{totalItens}</h2>
            </div>

            <div className="dashboard-card">
              <p>Peças em Estoque</p>
              <h2>{totalPecas}</h2>
            </div>

            <div className="dashboard-card">
              <p>Esgotados</p>
              <h2 className="dashboard-card-value-danger">{esgotados}</h2>
            </div>
          </div>

          {/* tabela */}
          <section className="dashboard-panel">

            {/* topo da tabela */}
            <div className="dashboard-panel-header">
              <h2>Inventário</h2>

              <div className="dashboard-actions">
                <button onClick={exportarLista} className="dashboard-btn dashboard-btn-primary">
                  Exportar
                </button>

                <button onClick={aoNovoItem} className="dashboard-btn dashboard-btn-success">
                  + Novo
                </button>
              </div>
            </div>

            {/* busca */}
            <div className="dashboard-search-wrapper">
              <input
                type="text"
                placeholder="Buscar..."
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
                  <th>Qtd</th>
                </tr>
              </thead>

              <tbody>
                {itensFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4">Nenhum item</td>
                  </tr>
                ) : (
                  itensFiltrados.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => aoSelecionarItem(item.id)}
                      onMouseEnter={() => setLinhaHover(item.id)}
                      onMouseLeave={() => setLinhaHover(null)}
                    >
                      <td>{item.codigo}</td>
                      <td>{item.nome}</td>
                      <td>{item.local}</td>
                      <td>
                        {item.quantidade === 0 ? "Esgotado" : item.quantidade}
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
