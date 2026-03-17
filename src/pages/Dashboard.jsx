import { useState } from "react"

function Dashboard({
  usuario = {},
  itens = [],
  aoSelecionarItem,
  aoNovoItem,
  aoAbrirAdmin,
  aoSair,
}) {
  const [busca, setBusca] = useState("")

  const itensFiltrados = itens.filter((item) => {
    const termo = busca.trim().toLowerCase()

    const codigo = String(item.codigo || "").toLowerCase()
    const nome = String(item.nome || "").toLowerCase()
    const local = String(item.local || "").toLowerCase()

    return (
      codigo.includes(termo) ||
      nome.includes(termo) ||
      local.includes(termo)
    )
  })

  const totalItens = itens.length
  const totalPecas = itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0)
  const esgotados = itens.filter((item) => Number(item.quantidade || 0) === 0).length

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
            body { font-family: Arial, sans-serif; padding: 30px; }
            h1 { margin-bottom: 20px; }
            .linha { padding: 8px 0; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Lista de Componentes - DryBox</h1>
          ${itens
            .map(
              (item) => `
                <div class="linha">
                  <strong>${item.codigo ?? ""}</strong> | ${item.nome ?? ""} | ${item.local ?? ""} | ${item.quantidade ?? 0}
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `)

    janela.document.close()
    janela.focus()
    janela.print()
  }

  function abrirAdministracao() {
    if (usuario?.perfil !== "admin") {
      alert("Somente admin pode acessar essa área")
      return
    }

    if (typeof aoAbrirAdmin === "function") {
      aoAbrirAdmin()
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "260px",
            minHeight: "100vh",
            background: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            padding: "24px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, color: "#16a34a" }}>DryBox</h2>
          <p style={{ color: "#6b7280", marginTop: "6px" }}>Sistema de Estoque</p>

          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f9fafb",
              borderRadius: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#111827" }}>
              {usuario?.nome || "Usuário"}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
              Perfil: {usuario?.perfil || "-"}
            </div>

            <button
              type="button"
              onClick={aoSair}
              style={{
                marginTop: "12px",
                width: "100%",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              Sair
            </button>
          </div>

          <div style={{ marginTop: "30px" }}>
            <div
              style={{
                background: "#16a34a",
                color: "white",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              Controle de Componentes
            </div>

            <button
              type="button"
              onClick={abrirAdministracao}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                color: "#374151",
                marginBottom: "10px",
                background: "#f9fafb",
                cursor: "pointer",
                border: "none",
                textAlign: "left",
              }}
            >
              Administração
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "30px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                lineHeight: "1.1",
                color: "#111827",
              }}
            >
              Bem-vindo, {usuario?.nome || "Usuário"}
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
                fontSize: "18px",
              }}
            >
              Gerencie o inventário local do DryBox
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
              <p style={{ color: "#6b7280", marginTop: 0 }}>Total de Itens</p>
              <h2>{totalItens}</h2>
            </div>

            <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
              <p style={{ color: "#6b7280", marginTop: 0 }}>Peças em Estoque</p>
              <h2>{totalPecas}</h2>
            </div>

            <div style={{ background: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
              <p style={{ color: "#6b7280", marginTop: 0 }}>Itens Esgotados</p>
              <h2 style={{ color: "#dc2626" }}>{esgotados}</h2>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0 }}>Inventário de Componentes</h2>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={exportarLista}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Exportar Lista
                </button>

                <button
                  type="button"
                  onClick={aoNovoItem}
                  style={{
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  + Novo Item
                </button>
              </div>
            </div>

            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Pesquisar por código, nome ou local"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box",
                  fontSize: "15px",
                }}
              />
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Código</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Nome</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Local</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Quantidade</th>
                </tr>
              </thead>

              <tbody>
                {itensFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                      Nenhum componente encontrado.
                    </td>
                  </tr>
                ) : (
                  itensFiltrados.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => aoSelecionarItem(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.codigo}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.nome}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.local}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                        {Number(item.quantidade || 0) === 0 ? (
                          <span style={{ color: "#dc2626", fontWeight: "bold" }}>Esgotado</span>
                        ) : (
                          item.quantidade
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
