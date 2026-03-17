import { useState } from "react"

function NovoItem({ voltar, adicionarItem }) {
  const [codigo, setCodigo] = useState("")
  const [nome, setNome] = useState("")
  const [local, setLocal] = useState("")
  const [quantidade, setQuantidade] = useState("")

  async function cadastrarItem() {
    if (!codigo || !nome || !local || quantidade === "") {
      alert("Preencha todos os campos")
      return
    }

    await adicionarItem({
      codigo,
      nome,
      local,
      quantidade,
    })

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

      <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
        <h1 style={{ marginTop: 0 }}>Novo Item</h1>
        <p style={{ color: "#6b7280" }}>
          Cadastre um novo componente no sistema
        </p>
      </div>

      <div style={{ maxWidth: "600px" }}>
        <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
          
          <p>Código</p>
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} style={inputStyle} />

          <p>Nome</p>
          <input value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />

          <p>Local</p>
          <input value={local} onChange={(e) => setLocal(e.target.value)} style={inputStyle} />

          <p>Quantidade</p>
          <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} style={inputStyle} />

          <button onClick={cadastrarItem} style={btnGreen}>
            Cadastrar Item
          </button>

        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
}

const btnGreen = {
  width: "100%",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "14px",
  cursor: "pointer",
  fontWeight: "bold",
}

export default NovoItem
