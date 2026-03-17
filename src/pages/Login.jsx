import { useState } from "react"

function Login({ onLogin, usuarios = [] }) {
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")

  function entrar() {
    if (!usuario || !senha) {
      alert("Preencha usuário e senha")
      return
    }

    const usuarioEncontrado = usuarios.find(
      (u) =>
        (u.usuario === usuario || u.nome === usuario) &&
        u.senha === senha
    )

    if (!usuarioEncontrado) {
      alert("Usuário ou senha inválidos")
      return
    }

    onLogin(usuarioEncontrado)
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f3f4f6" }}>
      <div style={{ width: "420px", background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
        <h1 style={{ color: "#22c55e", margin: 0, fontSize: "42px" }}>
          Intelbras
        </h1>

        <h2 style={{ marginTop: "8px", marginBottom: "8px" }}>
          Técnico de Reparo
        </h2>

        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Insira suas credenciais para gerenciar o inventário DryBox
        </p>

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Usuário
        </label>

        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", marginBottom: "18px" }}
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Senha
        </label>

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", marginBottom: "20px" }}
        />

        <button
          onClick={entrar}
          style={{ width: "100%", background: "#22c55e", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "bold" }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Login
