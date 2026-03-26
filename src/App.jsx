import { useState, useEffect } from "react"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ItemDetalhe from "./pages/ItemDetalhe.jsx"
import NovoItem from "./pages/NovoItem.jsx"
import AdminUsuarios from "./pages/AdminUsuarios.jsx"
import Indicadores from "./pages/Indicadores.jsx"
import { supabase } from "./supabase.js"

function App() {
  // Usuário atualmente logado no sistema
  const [usuarioLogado, setUsuarioLogado] = useState(null)

 // Controla qual tela está sendo exibida
// Possíveis valores:
// "dashboard", "item", "novo-item", "admin-usuarios", "indicadores"
const [modoTela, setModoTela] = useState("dashboard")

  // Guarda o ID do item selecionado para abrir a tela de detalhes
  const [itemSelecionadoId, setItemSelecionadoId] = useState(null)

  // Lista de usuários cadastrados
  const [usuarios, setUsuarios] = useState([])

  // Lista de itens do estoque com seus históricos
  const [itens, setItens] = useState([])

  // Controla o estado de carregamento inicial da aplicação
  const [carregando, setCarregando] = useState(true)

  /**
   * Carrega os usuários da tabela "usuarios" no Supabase.
   *
   * Se der erro ou a tabela estiver vazia, cria usuários padrão
   * para garantir que o sistema tenha pelo menos um admin e um técnico.
   */
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

  /**
   * Carrega os itens e o histórico do banco.
   *
   * Depois junta os dados para que cada item fique com
   * sua lista de movimentações associada.
   */
  async function carregarItens() {
    const { data: itensData } = await supabase.from("itens").select("*")
    const { data: historicoData } = await supabase.from("historico").select("*")

    const itensComHistorico = (itensData || []).map((item) => ({
      ...item,
      historico: (historicoData || []).filter((h) => h.item_id === item.id),
    }))

    setItens(itensComHistorico)
  }

  /**
   * Função central de carregamento inicial.
   *
   * Executa:
   * 1. carregamento de usuários
   * 2. carregamento de itens
   * 3. controle do estado visual de carregamento
   */
  async function carregarDados() {
    setCarregando(true)
    await carregarUsuarios()
    await carregarItens()
    setCarregando(false)
  }

  /**
   * Executa uma vez ao iniciar a aplicação.
   *
   * Recupera do localStorage:
   * - usuário logado
   * - tela atual
   * - item selecionado
   *
   * Depois disso carrega os dados do Supabase.
   */
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

  /**
   * Sempre que o usuário logado mudar,
   * salva o usuário no localStorage.
   *
   * Se não houver usuário, remove o registro salvo.
   */
  useEffect(() => {
    if (usuarioLogado) {
      localStorage.setItem("drybox_usuario_logado", JSON.stringify(usuarioLogado))
    } else {
      localStorage.removeItem("drybox_usuario_logado")
    }
  }, [usuarioLogado])

  /**
   * Sempre que a tela atual mudar,
   * salva o modo de tela no localStorage.
   */
  useEffect(() => {
    localStorage.setItem("drybox_modo_tela", modoTela)
  }, [modoTela])

  /**
   * Sempre que o item selecionado mudar,
   * salva o ID no localStorage.
   *
   * Se nenhum item estiver selecionado, remove o valor salvo.
   */
  useEffect(() => {
    if (itemSelecionadoId !== null) {
      localStorage.setItem("drybox_item_selecionado", String(itemSelecionadoId))
    } else {
      localStorage.removeItem("drybox_item_selecionado")
    }
  }, [itemSelecionadoId])

  /**
   * Registra uma nova movimentação no histórico de um item.
   *
   * Regras:
   * - a quantidade deve ser válida e maior que zero
   * - se for saída, não pode deixar o estoque negativo
   *
   * Fluxo:
   * 1. valida a quantidade
   * 2. encontra o item correspondente
   * 3. calcula a nova quantidade do estoque
   * 4. atualiza a tabela "itens"
   * 5. grava a movimentação na tabela "historico"
   * 6. recarrega os itens para atualizar a tela
   */
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

  /**
   * Remove um registro do histórico de um item.
   *
   * Observação:
   * Esta função remove apenas o registro do histórico
   * com base no índice exibido na interface.
   */
  async function removerHistorico(itemId, indexHistorico) {
    const item = itens.find((i) => i.id === itemId)
    if (!item) return

    const registro = item.historico[indexHistorico]
    if (!registro) return

    await supabase.from("historico").delete().eq("id", registro.id)
    await carregarItens()
  }

  /**
   * Remove um item do sistema.
   *
   * Fluxo:
   * 1. remove todo o histórico relacionado ao item
   * 2. remove o item da tabela "itens"
   * 3. volta para o dashboard
   * 4. limpa o item selecionado
   * 5. recarrega os itens
   */
  async function removerItem(itemId) {
    await supabase.from("historico").delete().eq("item_id", itemId)
    await supabase.from("itens").delete().eq("id", itemId)

    setModoTela("dashboard")
    setItemSelecionadoId(null)
    await carregarItens()
  }

  /**
   * Adiciona um novo item no estoque.
   *
   * Depois do cadastro:
   * - volta para o dashboard
   * - recarrega a lista de itens
   */
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

  /**
   * Abre a tela de detalhes de um item específico.
   */
  function abrirItem(id) {
    setItemSelecionadoId(id)
    setModoTela("item")
  }

  /**
   * Retorna para a tela principal do dashboard
   * e limpa o item selecionado.
   */
  function voltarDashboard() {
    setModoTela("dashboard")
    setItemSelecionadoId(null)
  }

  /**
   * Faz logout do usuário atual.
   *
   * Também limpa os dados salvos no localStorage
   * para evitar reabertura automática de sessão/tela.
   */
  function sair() {
    setUsuarioLogado(null)
    setModoTela("dashboard")
    setItemSelecionadoId(null)
    localStorage.removeItem("drybox_usuario_logado")
    localStorage.removeItem("drybox_modo_tela")
    localStorage.removeItem("drybox_item_selecionado")
  }

  // Enquanto os dados iniciais estão sendo carregados,
  // exibe uma mensagem simples de carregamento
  if (carregando) return <div>Carregando...</div>

  // Se não houver usuário logado, mostra a tela de login
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

   // Tela de administração de usuários
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

  /**
   * Tela de indicadores e performance
   *
   * Serve para abrir a nova página de indicadores.
   * Essa página vai receber:
   * - o usuário logado, para vincular os lançamentos ao técnico certo
   * - a função voltar, para retornar ao dashboard principal
   */
  if (modoTela === "indicadores") {
    return (
      <Indicadores
        usuarioLogado={usuarioLogado}
        voltar={voltarDashboard}
      />
    )
  }

  // Tela de cadastro de novo item
  if (modoTela === "novo-item") {
    return <NovoItem voltar={voltarDashboard} adicionarItem={adicionarItem} />
  }

  // Tela de detalhes do item selecionado
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

   // Tela principal do sistema
  return (
    <Dashboard
      usuario={usuarioLogado}
      itens={itens}
      aoSelecionarItem={abrirItem}
      aoNovoItem={() => setModoTela("novo-item")}
      aoAbrirAdmin={() => setModoTela("admin-usuarios")}
      aoAbrirIndicadores={() => setModoTela("indicadores")}
      aoSair={sair}
    />
  )
}

export default App
