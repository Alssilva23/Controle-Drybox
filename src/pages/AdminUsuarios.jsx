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
      (u) =>
        String(u.usuario || "").toLowerCase() === usuario.toLowerCase()
    )

    if (usuarioJaExiste) {
      alert("Esse usuário já existe")
      return
    }

    // 🔥 SALVA NO SUPABASE
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
      console.error(error)
      alert("Erro ao salvar usuário")
      return
    }

    // atualiza tela
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
    <div style={{ padding: "30px" }}>
      <button onClick={voltar}>← Voltar</button>

      <h1>Administração de Usuários</h1>

      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input placeholder="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
      <input placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />

      <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
        <option value="tecnico">Técnico</option>
        <option value="lider">Líder</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={cadastrarUsuario}>Cadastrar</button>

      <h2>Lista</h2>

      {usuarios.map((u) => (
        <div key={u.id}>
          {u.nome} - {u.usuario}
          <button onClick={() => excluirUsuario(u.id)}>Excluir</button>
        </div>
      ))}
    </div>
  )
}

export default AdminUsuarios
