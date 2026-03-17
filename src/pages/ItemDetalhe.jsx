import { useState } from "react"

function ItemDetalhe({
  item,
  voltar,
  registrarMovimentacao,
  usuario,
  removerHistorico,
  removerItem,
}) {
  const [tipo, setTipo] = useState("entrada")
  const [quantidade, setQuantidade] = useState(1)
  const [comentario, setComentario] = useState("")

  async function salvar() {
    if (!comentario.trim()) {
      alert("Informe o motivo da movimentação. Ex: Sobra ordem 1563")
      return
    }

    await registrarMovimentacao(item.id, tipo, quantidade, comentario)
    setQuantidade(1)
    setComentario("")
  }

  async function excluirRegistro(index) {
    if (!removerHistorico) return

    if (usuario?.perfil !== "admin") {
      alert("Somente admin pode excluir registros")
      return
    }

    const confirmar = window.confirm("Deseja realmente excluir este registro?")
    if (!confirmar) return

    await removerHistorico(item.id, index)
  }

  async function excluirItem() {
    if (!removerItem) return

    if (usuario?.perfil !== "admin") {
      alert("Somente admin pode excluir itens")
      return
    }

    await removerItem(item.id)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Arial", padding: "30px" }}>
      <button
        onClick={voltar}
        style={{
          marginBottom: "20px",
          background: "#e5e7eb",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          marginBottom: "20px",
        }}
      >
        <p style={{ color: "#16a34a", fontWeight: "bold", marginBottom: "8px" }}>
          CÓDIGO: {item.codigo}
        </p>

        <h1 style={{ marginTop: 0 }}>{item.nome}</h1>

        <div
          style={{
            display: "inline-block",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            padding: "12px 18px",
            marginTop: "10px",
          }}
        >
          <span style={{ color: "#6b7280" }}>Quantidade atual </span>
          <strong style={{ fontSize: "24px", marginLeft: "8px" }}>
            {item.quantidade} UND
          </strong>
        </div>

        {usuario?.perfil === "admin" && (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={excluirItem}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Excluir Item
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Histórico de Uso</h2>

          {item.historico.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Nenhuma movimentação ainda.</p>
          ) : (
            item.historico.map((mov, index) => (
              <div
                key={`${mov.data}-${index}`}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>
                    {mov.usuario} —{" "}
                    <span style={{ color: mov.tipo === "entrada" ? "#16a34a" : "#dc2626" }}>
                      {mov.tipo === "entrada" ? "adicionou" : "retirou"}
                    </span>
                  </div>

                  <div style={{ marginTop: "4px" }}>
                    {mov.quantidade} UND — {mov.data}
                  </div>

                  {mov.comentario && (
                    <div style={{ color: "#6b7280", marginTop: "4px" }}>
                      {mov.comentario}
                    </div>
                  )}
                </div>

                {usuario?.perfil === "admin" && (
                  <button
                    onClick={() => excluirRegistro(index)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Excluir
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Registrar Movimentação</h2>

          <p style={{ marginBottom: "8px" }}>Ação</p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button
              onClick={() => setTipo("entrada")}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: tipo === "entrada" ? "#d1fae5" : "#f3f4f6",
              }}
            >
              Entrada
            </button>

            <button
              onClick={() => setTipo("saida")}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: tipo === "saida" ? "#fee2e2" : "#f3f4f6",
              }}
            >
              Saída
            </button>
          </div>

          <p style={{ marginBottom: "8px" }}>Quantidade</p>

          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <p style={{ marginBottom: "8px" }}>Comentário</p>

          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Ex: Sobra ordem 1563"
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
              resize: "none",
            }}
          />

          <button
            onClick={salvar}
            style={{
              width: "100%",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Registrar Movimentação
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemDetalhe
