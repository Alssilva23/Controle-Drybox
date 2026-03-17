import { useState } from "react"
import usuariosPadrao from "../data/usuarios"

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")

  function entrar() {
    const usuariosSalvos = localStorage.getItem("drybox_usuarios")

    const usuarios = usuariosSalvos
      ? JSON.parse(usuariosSalvos)
      : usuariosPadrao

    if (!usuariosSalvos) {
      localStorage.setItem("drybox_usuarios", JSON.stringify(usuariosPadrao))
    }

    if (!usuario || !senha) {
      alert("Preencha usuário e senha")
      return
    }

    const usuarioEncontrado = usuarios.find(
      (u) => u.usuario === usuario && u.senha === senha
    )

    if (!usuarioEncontrado) {
      alert("Usuário ou senha inválidos")
      return
    }

    onLogin(usuarioEncontrado)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#22c55e", margin: 0, fontSize: "42px" }}>
          Intelbras
        </h1>

        <h2 style={{ marginTop: "8px", marginBottom: "8px" }}>
          Técnico de Reparo
        </h2>

        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Insira suas credenciais para gerenciar o inventário DryBox
        </p>

        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Usuário
        </label>

        <input
          type="text"
          placeholder="Digite seu usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "18px",
            boxSizing: "border-box",
          }}
        />

        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Senha
        </label>

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={entrar}
          style={{
            width: "100%",
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Login