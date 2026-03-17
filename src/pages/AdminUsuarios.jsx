import { useState } from "react"
import { supabase } from "../supabase"

function AdminUsuarios({ usuarioLogado, usuarios, salvarUsuarios, voltar }) {
  const [nome, setNome] = useState("")
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [perfil, setPerfil] = useState("tecnico")

  async function cadastrarUsuario() {
    if (!nome || !usuario || !senha || !perfil) {
      alert("Preencha todos os campos")
      return
    }

    const usuarioJaExiste = usuarios.some(
      (u) => String(u.usuario || "").toLowerCase() === usuario.toLowerCase()
    )

    if (usuarioJaExiste) {
      alert("Esse usuário já existe")
      return
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nome,
          usuario,
          senha,
          perfil,
        },
      ])
      .select()
      .single()

    if (error) {
      alert("Erro ao salvar usuário")
      return
    }

    salvarUsuarios([...usuarios, data])

    setNome("")
    setUsuario("")
    setSenha("")
    setPerfil("tecnico")

    alert("Usuário cadastrado com sucesso")
  }

  async function excluirUsuario(id) {
    if (id === usuarioLogado.id) {
      alert("Você não pode excluir o usuário logado")
      return
    }

    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Erro ao excluir usuário")
      return
    }

    salvarUsuarios(usuarios.filter((u) => u.id !== id))
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
        <h1 style={{ marginTop: 0 }}>Administração de Usuários</h1>
        <p style={{ color: "#6b7280" }}>
          Apenas admin pode cadastrar e excluir usuários.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
          <h2>Cadastrar Usuário</h2>

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={inputStyle}
          />

          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            style={inputStyle}
          >
            <option value="tecnico">Técnico</option>
            <option value="lider">Líder</option>
            <option value="operador">Operador</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={cadastrarUsuario} style={btnGreen}>
            Cadastrar Usuário
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
          <h2>Usuários Cadastrados</h2>

          {usuarios.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Nenhum usuário cadastrado.</p>
          ) : (
            usuarios.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div>
                  <strong>{u.nome}</strong>
                  <br />
                  <small>
                    {u.usuario} | {u.perfil}
                  </small>
                </div>

                <button onClick={() => excluirUsuario(u.id)} style={btnRed}>
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

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
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
  padding: "12px",
  cursor: "pointer",
}

const btnRed = {
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
}

export default AdminUsuarios
