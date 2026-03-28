import { useState } from "react"
import "./Login.css"

/**
 * Tela de Login
 *
 * Responsável por:
 * - capturar usuário e senha
 * - validar com lista de usuários
 * - chamar função onLogin quando válido
 *
 * Props:
 * - onLogin: função chamada quando login dá certo
 * - usuarios: lista de usuários do sistema
 */
function Login({ onLogin, usuarios = [] }) {
  // Estados dos inputs
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")

  /**
   * Função executada ao clicar em "Entrar"
   */
  function entrar(e) {
    if (e) e.preventDefault()

    // Normaliza os valores digitados
    const loginDigitado = usuario.trim().toLowerCase()
    const senhaDigitada = senha.trim()

    // Validação básica
    if (!loginDigitado || !senhaDigitada) {
      alert("Preencha usuário e senha")
      return
    }

    /**
     * Procura usuário na lista
     * Pode logar usando:
     * - usuário (login)
     * - nome
     */
    const usuarioEncontrado = usuarios.find((u) => {
      const usuarioBanco = String(u.usuario || "").trim().toLowerCase()
      const nomeBanco = String(u.nome || "").trim().toLowerCase()
      const senhaBanco = String(u.senha || "").trim()

      return (
        (usuarioBanco === loginDigitado || nomeBanco === loginDigitado) &&
        senhaBanco === senhaDigitada
      )
    })

    // Se não encontrar
    if (!usuarioEncontrado) {
      alert("Usuário ou senha inválidos")
      return
    }

    // Login válido → envia pro App
    onLogin(usuarioEncontrado)
  }

  return (
    <div className="login-container">
      <form onSubmit={entrar} className="login-box">
        {/* Título */}
        <h1 className="login-logo">Intelbras</h1>
        <h2 className="login-subtitle">Técnico de Reparo</h2>

        <p className="login-text">
          Insira suas credenciais para gerenciar o inventário DryBox
        </p>

        {/* Campo usuário */}
        <label className="login-label">Usuário</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Digite seu usuário"
          className="login-input"
        />

        {/* Campo senha */}
        <label className="login-label">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          className="login-input"
        />

        {/* Botão */}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  )
}

export default Login
