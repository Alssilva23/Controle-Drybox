import { useState } from "react"

function AdminUsuarios({ usuarioLogado, usuarios, salvarUsuarios, voltar }) {
  const [nome, setNome] = useState("")
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [perfil, setPerfil] = useState("tecnico")

  function cadastrarUsuario() {
    if (!nome || !usuario || !senha || !perfil) {
      alert("Preencha todos os campos")
      return
    }

    const usuarioJaExiste = usuarios.some(
      (u) => u.usuario.toLowerCase() === usuario.toLowerCase()
    )

    if (usuarioJaExiste) {
      alert("Esse usuário já existe")
      return
    }

    const novoUsuario = {
      id: Date.now(),
      nome,
      usuario,
      senha,
      perfil,
    }

    salvarUsuarios([...usuarios, novoUsuario])

    setNome("")
    setUsuario("")
    setSenha("")
    setPerfil("tecnico")
  }

  function excluirUsuario(id) {
    if (id === usuarioLogado.id) {
      alert("Você não pode excluir o usuário que está logado")
      return
    }

    const novaLista = usuarios.filter((u) => u.id !== id)
    salvarUsuarios(novaLista)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial",
        padding: "30px",
      }}
    >
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
        <h1 style={{ marginTop: 0 }}>Administração de Usuários</h1>
        <p style={{ color: "#6b7280", marginBottom: 0 }}>
          Apenas admin pode cadastrar e excluir usuários.
        </p>
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
          <h2 style={{ marginTop: 0 }}>Cadastrar Usuário</h2>

          <p style={{ marginBottom: "8px" }}>Nome</p>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <p style={{ marginBottom: "8px" }}>Usuário</p>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <p style={{ marginBottom: "8px" }}>Senha</p>
          <input
            type="text"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <p style={{ marginBottom: "8px" }}>Perfil</p>
          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "20px",
              boxSizing: "border-box",
            }}
          >
            <option value="tecnico">Técnico</option>
            <option value="lider">Líder</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={cadastrarUsuario}
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
            Cadastrar Usuário
          </button>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Usuários Cadastrados</h2>

          {usuarios.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Nenhum usuário cadastrado.</p>
          ) : (
            usuarios.map((u) => (
              <div
                key={u.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{u.nome}</div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    usuário: {u.usuario} | perfil: {u.perfil}
                  </div>
                </div>

                <button
                  onClick={() => excluirUsuario(u.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsuarios