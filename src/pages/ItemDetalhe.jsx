import { useState } from "react"

/**
 * Tela de detalhe do item
 * - Mostra informações
 * - Mostra histórico
 * - Permite entrada/saída
 */
function ItemDetalhe({
  item,
  voltar,
  registrarMovimentacao,
  usuario,
  removerHistorico,
  removerItem,
}) {

  // tipo de movimentação (entrada ou saída)
  const [tipo, setTipo] = useState("entrada")

  // quantidade digitada
  const [quantidade, setQuantidade] = useState(1)

  // comentário da movimentação
  const [comentario, setComentario] = useState("")

  /**
   * Salva movimentação no sistema
   */
  async function salvar() {
    if (!comentario.trim()) {
      alert("Informe o motivo da movimentação. Ex: Sobra ordem 1563")
      return
    }

    await registrarMovimentacao(item.id, tipo, quantidade, comentario)

    setQuantidade(1)
    setComentario("")
  }

  /**
   * Excluir registro do histórico
   */
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

  /**
   * Excluir item inteiro
   */
  async function excluirItem() {
    if (!removerItem) return

    if (usuario?.perfil !== "admin") {
      alert("Somente admin pode excluir itens")
      return
    }

    await removerItem(item.id)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >

      {/* botão voltar */}
      <button
        onClick={voltar}
        style={{
          marginBottom: "16px",
          background: "#e5e7eb",
          border: "none",
          borderRadius: "6px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

      {/* topo */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <p style={{ color: "#16a34a", fontWeight: "bold", margin: 0 }}>
            {item.codigo}
          </p>
          <h2 style={{ margin: "4px 0 0 0", fontSize: "20px" }}>
            {item.nome}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              padding: "6px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {item.quantidade} UND
          </div>

          {usuario?.perfil === "admin" && (
            <button
              onClick={excluirItem}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Excluir Item
            </button>
          )}
        </div>
      </div>

      {/* layout */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>

        {/* HISTÓRICO */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            flex: 1,
            minWidth: "300px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <h3>Histórico de Uso</h3>

          {item.historico.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Nenhuma movimentação ainda.</p>
          ) : (
            [...(item.historico || [])]
              .sort((a, b) => new Date(b.data) - new Date(a.data))
              .map((mov, index) => (
                <div
                  key={`${mov.data}-${index}`}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                      {mov.usuario} —{" "}
                      <span
                        style={{
                          color:
                            mov.tipo === "entrada" ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {mov.tipo === "entrada" ? "adicionou" : "retirou"}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      {mov.quantidade} UND — {mov.data}
                    </div>

                    {mov.comentario && (
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
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
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))
          )}
        </div>

        {/* FORMULÁRIO */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            flex: 1,
            minWidth: "300px",
          }}
        >
          <h3>Registrar Movimentação</h3>

          <p>Ação</p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <button
              onClick={() => setTipo("entrada")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: tipo === "entrada" ? "#16a34a" : "#f3f4f6",
                color: tipo === "entrada" ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              Entrada
            </button>

            <button
              onClick={() => setTipo("saida")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: tipo === "saida" ? "#dc2626" : "#f3f4f6",
                color: tipo === "saida" ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              Saída
            </button>
          </div>

          <p>Quantidade</p>

          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              marginBottom: "12px",
            }}
          />

          <p>Comentário</p>

          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Ex: Sobra ordem 1563"
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              marginBottom: "12px",
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
              borderRadius: "6px",
              padding: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Salvar
          </button>
        </div>

      </div>
    </div>
  )
}

export default ItemDetalhe
