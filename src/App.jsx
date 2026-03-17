import { useState, useEffect } from "react"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ItemDetalhe from "./pages/ItemDetalhe.jsx"
import NovoItem from "./pages/NovoItem.jsx"
import AdminUsuarios from "./pages/AdminUsuarios.jsx"
import usuariosPadrao from "./data/usuarios.js"
import { supabase } from "./supabase.js"

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [modoTela, setModoTela] = useState("dashboard")
  const [itemSelecionadoId, setItemSelecionadoId] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)

  async function carregarUsuarios() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      alert("ERRO SUPABASE: " + error.message)
      return
    }

    if (!data || data.length === 0) {
      const usuariosParaInserir = usuariosPadrao.map((u) => ({
        nome: u.nome,
        usuario: u.usuario,
        senha: u.senha,
        perfil: u.perfil,
      }))

      await supabase.from("usuarios").insert(usuariosParaInserir)

      const { data: novosUsuarios } = await supabase
        .from("usuarios")
        .select("*")

      setUsuarios(novosUsuarios || [])
      return
    }

    setUsuarios(data)
  }

  async function carregarItens() {
    const { data } = await supabase
      .from("itens")
      .select("*")

    setItens(data || [])
  }

  async function carregarDados() {
    setCarregando(true)
    await carregarUsuarios()
    await carregarItens()
    setCarregando(false)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function sair() {
    setUsuarioLogado(null)
  }

  if (carregando) return <div>Carregando...</div>

  if (!usuarioLogado) {
    return <Login onLogin={setUsuarioLogado} usuarios={usuarios} />
  }

  return (
    <Dashboard
      usuario={usuarioLogado}
      itens={itens}
      aoSelecionarItem={() => {}}
      aoNovoItem={() => {}}
      aoAbrirAdmin={() => {}}
      aoSair={sair}
    />
  )
}

export default App
