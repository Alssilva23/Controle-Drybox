import { useState } from "react"

function NovoItem({ itens, salvarItens, voltar }) {
  const [codigo, setCodigo] = useState("")
  const [nome, setNome] = useState("")
  const [local, setLocal] = useState("")
  const [quantidade, setQuantidade] = useState("")

  function cadastrarItem() {
    if (!codigo || !nome || !local || quantidade === "") {
      alert("Preencha todos os campos")
      return
    }

    const novoItem = {
      id: Date.now(),
      codigo: codigo.trim(),
      nome: nome.trim(),
      local: local.trim(),
      quantidade: Number(quantidade),
    }

    salvarItens([...itens, novoItem])

    setCodigo("")
    setNome("")
    setLocal("")
    setQuantidade("")
    alert("Item cadastrado com sucesso")
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
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Novo Item</h1>

        <p style={{ marginBottom: "8px" }}>Código</p>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", marginBottom: "16px", boxSizing: "border-box" }}
        />

        <p style={{ marginBottom: "8px" }}>Nome</p>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", marginBottom: "16px", boxSizing: "border-box" }}
        />

        <p style={{ marginBottom: "8px" }}>Local</p>
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", marginBottom: "16px", boxSizing: "border-box" }}
        />

        <p style={{ marginBottom: "8px" }}>Quantidade</p>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", marginBottom: "20px", boxSizing: "border-box" }}
        />

        <button
          onClick={cadastrarItem}
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
          Cadastrar Item
        </button>
      </div>
    </div>
  )
}

export default NovoItem
