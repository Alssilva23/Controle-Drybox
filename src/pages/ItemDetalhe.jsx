import { useState } from "react"
import "./ItemDetalhe.css"

/**
 * Tela de detalhe do item
 * Aqui você:
 * - vê informações do item
 * - vê histórico
 * - registra entrada/saída
 */
function ItemDetalhe({
  item,
  voltar,
  registrarMovimentacao,
  usuario,
  removerHistorico,
  removerItem,
}) {

  // controla se é entrada ou saída
  const [tipo, setTipo] = useState("entrada")

  // quantidade digitada
  const [quantidade, setQuantidade] = useState(1)

  // comentário da movimentação
  const [comentario, setComentario] = useState("")

  /**
   * Salvar movimentação
   */
  async function salvar() {
    if (!comentario.trim()) {
      alert("Informe o motivo da movimentação")
      return
    }

    await registrarMovimentacao(item.id, tipo, quantidade, comentario)

    // reset dos campos
    setQuantidade(1)
    setComentario("")
  }

  /**
   * Excluir registro do histórico
   */
  async function excluirRegistro(index) {
    if (usuario?.perfil !== "admin") return
    if (!window.confirm("Excluir registro?")) return

    await removerHistorico(item.id, index)
  }

  /**
   * Excluir item inteiro
   */
  async function excluirItem() {
    if (usuario?.perfil !== "admin") return

    await removerItem(item.id)
  }

  return (
    <div className="item-page">

      {/* botão voltar */}
      <button onClick={voltar} className="item-voltar">
        ← Voltar
      </button>

      {/* topo com nome e código */}
      <div className="item-topo">
        <div>
          <p className="item-codigo">{item.codigo}</p>
          <h2 className="item-nome">{item.nome}</h2>
        </div>

        {/* quantidade + botão excluir */}
        <div className="item-info">
          <div className="item-qtd">{item.quantidade} UND</div>

          {usuario?.perfil === "admin" && (
            <button onClick={excluirItem} className="item-excluir">
              Excluir Item
            </button>
          )}
        </div>
      </div>

      {/* container principal */}
      <div className="item-container">

        {/* HISTÓRICO */}
        <div className="card historico">
          <h3>Histórico</h3>

          {item.historico.length === 0 ? (
            <p>Sem movimentação</p>
          ) : (
            item.historico.map((mov, index) => (
              <div key={index} className="historico-item">

                <div>
                  <b>{mov.usuario}</b> —{" "}

                  {/* cor muda conforme tipo */}
                  <span className={
                    mov.tipo === "entrada"
                      ? "historico-tipo-entrada"
                      : "historico-tipo-saida"
                  }>
                    {mov.tipo === "entrada" ? "entrada" : "saída"}
                  </span>

                  <br />
                  {mov.quantidade} UND
                </div>

                {/* botão excluir só admin */}
                {usuario?.perfil === "admin" && (
                  <button
                    onClick={() => excluirRegistro(index)}
                    className="historico-excluir"
                  >
                    X
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* FORMULÁRIO */}
        <div className="card">
          <h3>Registrar</h3>

          <p>Ação</p>

          {/* botões entrada/saida */}
          <div style={{ display: "flex", gap: "10px" }}>

            <button
              className={`mov-btn mov-btn-entrada ${tipo === "entrada" ? "active" : ""}`}
              onClick={() => setTipo("entrada")}
            >
              Entrada
            </button>

            <button
              className={`mov-btn mov-btn-saida ${tipo === "saida" ? "active" : ""}`}
              onClick={() => setTipo("saida")}
            >
              Saída
            </button>

          </div>

          <p>Quantidade</p>

          {/* input quantidade */}
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="input"
          />

          <p>Comentário</p>

          {/* campo comentário */}
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="textarea"
          />

          {/* botão salvar */}
          <button onClick={salvar} className="btn-salvar">
            Salvar
          </button>
        </div>

      </div>
    </div>
  )
}

export default ItemDetalhe
