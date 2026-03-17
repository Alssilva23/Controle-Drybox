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

  async function carregarUsuarios() {
    const { data, error } = await supabase.from("usuarios").select("*")

    if (error || !data || data.length === 0) {
      const padrao = [
        { nome: "Alessandra", usuario: "alessandra", senha: "123", perfil: "admin" },
        { nome: "Carlos", usuario: "carlos", senha: "123", perfil: "tecnico" },
      ]

      await supabase.from("usuarios").insert(padrao)

      const { data: novos } = await supabase.from("usuarios").select("*")
      setUsuarios(novos || [])
      return
    }

    setUsuarios(data)
  }

  async function carregarItens() {
    const { data: itensData } = await supabase.from("itens").select("*")
    const { data: historicoData } = await supabase.from("historico").select("*")

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
    const usuarioSalvo = localStorage.getItem("drybox_usuario_logado")
    const telaSalva = localStorage.getItem("drybox_modo_tela")
    const itemSalvo = localStorage.getItem("drybox_item_selecionado")

    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo))
    }

    if (telaSalva) {
      setModoTela(telaSalva)
    }

    if (itemSalvo) {
      setItemSelecionadoId(Number(itemSalvo))
    }

    carregarDados()
  }, [])

  useEffect(() => {
    if (usuarioLogado) {
      localStorage.setItem("drybox_usuario_logado", JSON.stringify(usuarioLogado))
    } else {
      localStorage.removeItem("drybox_usuario_logado")
    }
  }, [usuarioLogado])

  useEffect(() => {
    localStorage.setItem("drybox_modo_tela", modoTela)
  }, [modoTela])

  useEffect(() => {
    if (itemSelecionadoId !== null) {
      localStorage.setItem("drybox_item_selecionado", String(itemSelecionadoId))
    } else {
      localStorage.removeItem("drybox_item_selecionado")
    }
  }, [itemSelecionadoId])

  async function registrarMovimentacao(itemId, tipo, quantidade, comentario) {
    const qtd = Number(quantidade)

    if (!qtd || qtd <= 0) {
      alert("Quantidade inválida")
      return
    }

    const item = itens.find((i) => i.id === itemId)
    if (!item) return

    const novaQuantidade =
      tipo === "entrada" ? item.quantidade + qtd : item.quantidade - qtd

    if (novaQuantidade < 0) {
      alert("Estoque insuficiente")
      return
    }

    await supabase
      .from("itens")
      .update({ quantidade: novaQuantidade })
      .eq("id", itemId)

    await supabase.from("historico").insert([
      {
        item_id: itemId,
        usuario: usuarioLogado.nome,
        tipo,
        quantidade: qtd,
        comentario,
        data: new Date().toLocaleString("pt-BR"),
      },
    ])

    await carregarItens()
  }

  async function removerHistorico(itemId, indexHistorico) {
    const item = itens.find((i) => i.id === itemId)
    if (!item) return

    const registro = item.historico[indexHistorico]
    if (!registro) return

    await supabase.from("historico").delete().eq("id", registro.id)
    await carregarItens()
  }

  async function removerItem(itemId) {
    await supabase.from("historico").delete().eq("item_id", itemId)
    await supabase.from("itens").delete().eq("id", itemId)

    setModoTela("dashboard")
    setItemSelecionadoId(null)
    await carregarItens()
  }

  async function adicionarItem(novoItem) {
    await supabase.from("itens").insert([
      {
        codigo: novoItem.codigo,
        nome: novoItem.nome,
        local: novoItem.local,
        quantidade: Number(novoItem.quantidade),
      },
    ])

    setModoTela("dashboard")
    await carregarItens()
  }

  function abrirItem(id) {
    setItemSelecionadoId(id)
    setModoTela("item")
  }

  function voltarDashboard() {
    setModoTela("dashboard")
    setItemSelecionadoId(null)
  }

  function sair() {
    setUsuarioLogado(null)
    setModoTela("dashboard")
    setItemSelecionadoId(null)
    localStorage.removeItem("drybox_usuario_logado")
    localStorage.removeItem("drybox_modo_tela")
    localStorage.removeItem("drybox_item_selecionado")
  }

  if (carregando) return <div>Carregando...</div>

  if (!usuarioLogado) {
    return (
      <Login
        onLogin={(usuario) => {
          setUsuarioLogado(usuario)
          setModoTela("dashboard")
        }}
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
    return <NovoItem voltar={voltarDashboard} adicionarItem={adicionarItem} />
  }

  if (modoTela === "item") {
    const itemSelecionado = itens.find((i) => i.id === itemSelecionadoId)

    return (
      <ItemDetalhe
        item={itemSelecionado}
        voltar={voltarDashboard}
        registrarMovimentacao={registrarMovimentacao}
        usuario={usuarioLogado}
        removerHistorico={removerHistorico}
        removerItem={removerItem}
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
