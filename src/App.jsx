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
      console.error("Erro ao carregar usuários:", error)
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

      const { error: insertError } = await supabase
        .from("usuarios")
        .insert(usuariosParaInserir)

      if (insertError) {
        console.error("Erro ao criar usuários padrão:", insertError)
        alert("ERRO INSERT: " + insertError.message)
        return
      }

      const { data: novosUsuarios, error: novoErro } = await supabase
        .from("usuarios")
        .select("*")
        .order("id", { ascending: true })

      if (novoErro) {
        alert("ERRO AO BUSCAR NOVOS: " + novoErro.message)
        return
      }

      setUsuarios(novosUsuarios || [])
      return
    }

    setUsuarios(data)
  }

  async function carregarItens() {
    const { data: itensData, error: itensError } = await supabase
      .from("itens")
      .select("*")
      .order("id", { ascending: false })

    if (itensError) {
      console.error("Erro ao carregar itens:", itensError)
      return
    }

    const { data: historicoData, error: historicoError } = await supabase
      .from("historico")
      .select("*")
      .order("id", { ascending: false })

    if (historicoError) {
      console.error("Erro ao carregar histórico:", historicoError)
      return
    }

    const itensComHistorico = (itensData || []).map((item) => ({
      ...item,
      historico: (historicoData || []).filter((h) => h.item_id === item.id),
    }))

    setItens(itensComHistorico)
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
    setItemSelecionadoId(null)
    setModoTela("dashboard")
  }

  if (carregando) {
    return <div style={{ padding: "20px" }}>Carregando...</div>
  }

  if (!usuarioLogado) {
    return (
      <Login
        onLogin={setUsuarioLogado}
        usuarios={usuarios}
      />
    )
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
        adicionarItem={() => {}}
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
