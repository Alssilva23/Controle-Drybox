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
        return
      }

      const { data: novosUsuarios, error: novoErro } = await supabase
        .from("usuarios")
        .select("*")
        .order("id", { ascending: true })

      if (!novoErro) {
        setUsuarios(novosUsuarios || [])
      }
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

  async function registrarMovimentacao(itemId, tipo, quantidade, comentario) {
    const qtd = Number(quantidade)

    if (!qtd || qtd <= 0) {
      alert("Digite uma quantidade válida")
      return
    }

    const item = itens.find((i) => i.id === itemId)
    if (!item) return

    const novaQuantidade =
      tipo === "entrada" ? item.quantidade + qtd : item.quantidade - qtd

    if (novaQuantidade < 0) {
      alert("Quantidade insuficiente em estoque")
      return
    }

    const { error: updateError } = await supabase
      .from("itens")
      .update({ quantidade: novaQuantidade })
      .eq("id", itemId)

    if (updateError) {
      console.error("Erro ao atualizar item:", updateError)
      alert("Erro ao atualizar quantidade")
      return
    }

    const { error: historicoError } = await supabase
      .from("historico")
      .insert([
        {
          item_id: itemId,
          usuario: usuarioLogado.nome,
          tipo,
          quantidade: qtd,
          comentario,
          data: new Date().toLocaleString("pt-BR"),
        },
      ])

    if (historicoError) {
      console.error("Erro ao salvar histórico:", historicoError)
      alert("Erro ao registrar histórico")
      return
    }

    await carregarItens()
  }

  async function removerHistorico(itemId, indexHistorico) {
    if (usuarioLogado.perfil !== "admin") {
      alert("Somente admin pode excluir registros do histórico")
      return
    }

    const item = itens.find((i) => i.id === itemId)
    if (!item) return

    const registro = item.historico[indexHistorico]
    if (!registro) return

    const { error } = await supabase
      .from("historico")
      .delete()
      .eq("id", registro.id)

    if (error) {
      console.error("Erro ao remover histórico:", error)
      alert("Erro ao remover histórico")
      return
    }

    await carregarItens()
  }

  async function removerItem(itemId) {
    if (usuarioLogado.perfil !== "admin") {
      alert("Somente admin pode excluir itens")
      return
    }

    const confirmar = window.confirm("Deseja realmente excluir este item do sistema?")
    if (!confirmar) return

    const { error: historicoError } = await supabase
      .from("historico")
      .delete()
      .eq("item_id", itemId)

    if (historicoError) {
      console.error("Erro ao excluir histórico do item:", historicoError)
      alert("Erro ao excluir histórico do item")
      return
    }

    const { error: itemError } = await supabase
      .from("itens")
      .delete()
      .eq("id", itemId)

    if (itemError) {
      console.error("Erro ao excluir item:", itemError)
      alert("Erro ao excluir item")
      return
    }

    setItemSelecionadoId(null)
    setModoTela("dashboard")
    await carregarItens()
  }

  async function adicionarItem(novoItem) {
    const { data: itemCriado, error: itemError } = await supabase
      .from("itens")
      .insert([
        {
          codigo: novoItem.codigo,
          nome: novoItem.nome,
          local: novoItem.local,
          quantidade: Number(novoItem.quantidade),
        },
      ])
      .select()
      .single()

    if (itemError) {
      console.error("Erro ao adicionar item:", itemError)
      alert("Erro ao adicionar item")
      return
    }

    const { error: historicoError } = await supabase
      .from("historico")
      .insert([
        {
          item_id: itemCriado.id,
          usuario: usuarioLogado.nome,
          tipo: "entrada",
          quantidade: Number(novoItem.quantidade),
          comentario: "Cadastro inicial do item",
          data: new Date().toLocaleString("pt-BR"),
        },
      ])

    if (historicoError) {
      console.error("Erro ao salvar histórico inicial:", historicoError)
      alert("Erro ao salvar histórico inicial")
      return
    }

    setModoTela("dashboard")
    await carregarItens()
  }

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
        adicionarItem={adicionarItem}
      />
    )
  }

  if (modoTela === "item") {
    const itemSelecionado = itens.find((item) => item.id === itemSelecionadoId)

    if (!itemSelecionado) {
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
