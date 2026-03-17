import { useState } from "react"

function NovoItem({ voltar, adicionarItem }) {
  const [codigo, setCodigo] = useState("")
  const [nome, setNome] = useState("")
  const [local, setLocal] = useState("")
  const [quantidade, setQuantidade] = useState("")

  function cadastrarItem() {
    if (!codigo || !nome || !local || quantidade === "") {
      alert("Preencha todos os campos")
      return
    }

    adicionarItem({
      codigo: codigo.trim(),
      nome: nome.trim(),
      local: local.trim(),
      quantidade: Number(quantidade),
    })
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "30px" }}>
      <button onClick={voltar}>← Voltar</button>

      <div style={{ background: "white", padding: "20px", marginTop: "20px" }}>
        <h1>Novo Item</h1>

        <input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Local" value={local} onChange={(e) => setLocal(e.target.value)} />
        <input type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />

        <button onClick={cadastrarItem}>Cadastrar</button>
      </div>
    </div>
  )
}

export default NovoItem
