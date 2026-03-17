import { useState, useEffect } from "react"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ItemDetalhe from "./pages/ItemDetalhe.jsx"
import NovoItem from "./pages/NovoItem.jsx"
import AdminUsuarios from "./pages/AdminUsuarios.jsx"
import { supabase } from "./supabase.js"

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [modoTela, setModoTela] = useState("dashboard")
  const [itemSelecionadoId, setItemSelecionadoId] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)

  // ✅ CARREGAR USUÁRIOS
  async function carregarUsuarios() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error("Erro ao carregar usuários:", error)

      // fallback local
      setUsuarios([
        {
          id: 1,
          nome: "Alessandra",
          usuario: "alessandra",
          senha: "123",
          perfil: "admin",
        },
        {
          id: 2,
          nome: "Carlos",
          usuario: "carlos",
          senha: "123",
          perfil: "tecnico",
        },
      ])
      return
    }

    // 🔥 SE BANCO ESTIVER VAZIO
    if (!data || data.length === 0) {
      const usuariosPadrao = [
        {
          nome: "Alessandra",
          usuario: "alessandra",
          senha: "123",
          perfil: "admin",
        },
        {
          nome: "Carlos",
          usuario: "carlos",
          senha: "123",
          perfil: "tecnico",
        },
      ]

      await supabase.from("usuarios").insert(usuariosPadrao)

      const { data: novosUsuarios } = await supabase
        .from("usuarios")
        .select("*")

      setUsuarios(novosUsuarios || [])
      return
    }

    setUsuarios(data)
  }

  // ✅ CARREGAR ITENS
  async function carregarItens() {
    const { data, error } = await supabase
      .from("itens")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.error("Erro ao carregar itens:", error)
      return
    }

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

  function abrirItem(id) {
    setItemSelecionadoId(id)
    setModoTela("item")
  }

  function voltarDashboard() {
    setItemSelecionadoId(null)
    setModoTela("dashboard")
  }

  function sair() {
    setUsuarioLogado(null)
    setModoTela("dashboard")
    setItemSelecionadoId(null)
  }

  async function adicionarItem(novoItem) {
    const { error } = await supabase.from("itens").insert([
      {
        codigo: novoItem.codigo,
        nome: novoItem.nome,
        local: novoItem.local,
        quantidade: Number(novoItem.quantidade),
      },
    ])

    if (error) {
      alert("Erro ao adicionar item")
      return
    }

    setModoTela("dashboard")
    await carregarItens()
  }

  if (carregando) {
    return <div style={{ padding: "20px" }}>Carregando...</div>
  }

  if (!usuarioLogado) {
    return <Login onLogin={setUsuarioLogado} usuarios={usuarios} />
  }

  if (modoTela === "admin-usuarios") {
    return (
      <AdminUsuarios
        usuarioLogado={usuarioLogado}
        usuarios={usuarios}
        salvarUsuarios={setUsuarios}
        voltar={voltarDashboard}
      />
    )
  }

  if (modoTela === "novo-item") {
    return (
      <NovoItem
        voltar={voltarDashboard}
        adicionarItem={adicionarItem}
      />
    )
  }

  if (modoTela === "item") {
    const itemSelecionado = itens.find((i) => i.id === itemSelecionadoId)

    return (
      <ItemDetalhe
        item={itemSelecionado}
        voltar={voltarDashboard}
        usuario={usuarioLogado}
      />
    )
  }

  return (
    <Dashboard
      usuario={usuarioLogado}
      itens={itens}
      aoSelecionarItem={abrirItem}
      aoNovoItem={() => setModoTela("novo-item")}
      aoAbrirAdmin={() => setModoTela("admin-usuarios")}
      aoSair={sair}
    />
  )
}

export default App
