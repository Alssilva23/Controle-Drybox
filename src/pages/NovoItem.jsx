import { useState } from "react"

function NovoItem({ voltar, adicionarItem }) {
  const [codigo, setCodigo] = useState("")
  const [nome, setNome] = useState("")
  const [local, setLocal] = useState("")
  const [quantidade, setQuantidade] = useState("")

  function salvar() {
    if (!codigo || !nome || !local || quantidade === "") {
      alert("Preencha todos os campos")
      return
    }

    adicionarItem({
      codigo,
      nome,
      local,
      quantidade: Number(quantidade),
    })

    voltar()
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
          maxWidth: "700px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Cadastrar Novo Item</h1>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Preencha os dados do componente para adicionar ao estoque.
        </p>

        <p style={{ marginBottom: "8px" }}>Código</p>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ex: RES-10K-0603"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <p style={{ marginBottom: "8px" }}>Nome</p>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Resistor 10k 0603"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <p style={{ marginBottom: "8px" }}>Local</p>
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Ex: Caixa A1"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <p style={{ marginBottom: "8px" }}>Quantidade Inicial</p>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Ex: 50"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "24px",
            boxSizing: "border-box",
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
          Salvar Item
        </button>
      </div>
    </div>
  )
}

export default NovoItem