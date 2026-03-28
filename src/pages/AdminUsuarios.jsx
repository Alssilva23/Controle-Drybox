import { useState } from "react"
import { supabase } from "../supabase"
import "./AdminUsuarios.css"

/**
 * Tela de administração de usuários
 *
 * Responsável por:
 * - cadastrar novos usuários
 * - listar usuários cadastrados
 * - excluir usuários
 * - impedir que o usuário logado exclua a si mesmo
 */
function AdminUsuarios({ usuarioLogado, usuarios, salvarUsuarios, voltar }) {
  // Campos do formulário de cadastro
  const [nome, setNome] = useState("")
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [perfil, setPerfil] = useState("tecnico")

  /**
   * Cadastra um novo usuário no banco de dados
   */
  async function cadastrarUsuario() {
    // Verifica se todos os campos foram preenchidos
    if (!nome || !usuario || !senha || !perfil) {
      alert("Preencha todos os campos")
      return
    }

    // Verifica se já existe um usuário com o mesmo login
    const usuarioJaExiste = usuarios.some(
      (u) => String(u.usuario || "").toLowerCase() === usuario.toLowerCase()
    )

    if (usuarioJaExiste) {
      alert("Esse usuário já existe")
      return
    }

    // Envia os dados para a tabela "usuarios" no Supabase
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

    // Se der erro ao salvar no banco
    if (error) {
      alert("Erro ao salvar usuário")
      return
    }

    // Atualiza a lista local na tela com o novo usuário
    salvarUsuarios([...usuarios, data])

    // Limpa os campos do formulário
    setNome("")
    setUsuario("")
    setSenha("")
    setPerfil("tecnico")

    alert("Usuário cadastrado com sucesso")
  }

  /**
   * Exclui um usuário pelo ID
   */
  async function excluirUsuario(id) {
    // Impede que o usuário logado exclua a própria conta
    if (id === usuarioLogado.id) {
      alert("Você não pode excluir o usuário logado")
      return
    }

    // Remove o usuário da tabela "usuarios"
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id)

    // Se der erro ao excluir
    if (error) {
      alert("Erro ao excluir usuário")
      return
    }

    // Atualiza a lista local removendo o usuário excluído
    salvarUsuarios(usuarios.filter((u) => u.id !== id))
  }

  return (
    <div className="admin-container">
      {/* Botão para voltar para a tela anterior */}
      <button onClick={voltar} className="admin-voltar">
        ← Voltar
      </button>

      {/* Card de título da página */}
      <div className="admin-card">
        <h1 className="admin-titulo">Administração de Usuários</h1>
        <p className="admin-text-muted">
          Apenas admin pode cadastrar e excluir usuários.
        </p>
      </div>

      {/* Área principal dividida em duas colunas */}
      <div className="admin-grid">
        {/* Coluna da esquerda: formulário de cadastro */}
        <div className="admin-card">
          <h2 className="admin-subtitulo">Cadastrar Usuário</h2>

          <input
            className="admin-input"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="admin-input"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            className="admin-input"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <select
            className="admin-input"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
          >
            <option value="tecnico">Técnico</option>
            <option value="lider">Líder</option>
            <option value="operador">Operador</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={cadastrarUsuario} className="admin-btn-green">
            Cadastrar Usuário
          </button>
        </div>

        {/* Coluna da direita: lista de usuários */}
        <div className="admin-card">
          <h2 className="admin-subtitulo">Usuários Cadastrados</h2>

          {usuarios.length === 0 ? (
            <p className="admin-text-muted">Nenhum usuário cadastrado.</p>
          ) : (
            usuarios.map((u) => (
              <div key={u.id} className="admin-user-item">
                <div>
                  <strong>{u.nome}</strong>
                  <br />
                  <small>
                    {u.usuario} | {u.perfil}
                  </small>
                </div>

                <button
                  onClick={() => excluirUsuario(u.id)}
                  className="admin-btn-red"
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
