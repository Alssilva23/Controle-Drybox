import { useState, useEffect } from "react"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ItemDetalhe from "./pages/ItemDetalhe.jsx"
import NovoItem from "./pages/NovoItem.jsx"
import AdminUsuarios from "./pages/AdminUsuarios.jsx"
import { supabase } from "./supabase.js"

function App() {
  // Guarda o usuário que está logado no sistema
  const [usuarioLogado, setUsuarioLogado] = useState(null)

  // Controla qual tela está aberta no momento
  // Pode ser: dashboard, item, novo-item, admin-usuarios
  const [modoTela, setModoTela] = useState("dashboard")

  // Guarda o ID do item selecionado para abrir os detalhes dele
  const [itemSelecionadoId, setItemSelecionadoId] = useState(null)

  // Lista de usuários cadastrados
  const [usuarios, setUsuarios] = useState([])

  // Lista de itens com seus históricos
  const [itens, setItens] = useState([])

  // Controla a tela de carregamento inicial
  const [carregando, setCarregando] = useState(true)

  /**
   * Carrega os usuários do banco.
   * Se não existir nenhum usuário, cria usuários padrão.
   */
  async function carregarUsuarios() {
    const { data, error } = await supabase.from("usuarios").select("*")

    // Se der erro ou a tabela estiver vazia, cria usuários padrão
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
   * Carrega todos os itens e também o histórico de movimentações.
   * Depois junta os dois, deixando cada item com seu histórico.
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
   * Carrega todos os dados principais da aplicação.
   * Usado na inicialização e quando for necessário atualizar tudo.
   */
  async function carregarDados() {
    setCarregando(true)
    await carregarUsuarios()
    await carregarItens()
    setCarregando(false)
  }

  /**
   * Executa uma vez ao abrir o app.
   * Recupera dados salvos no localStorage:
   * - usuário logado
   * - tela atual
   * - item selecionado
   * E depois carrega os dados do Supabase.
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
   * salva ou remove do localStorage.
   */
  useEffect(() => {
    if (usuarioLogado) {
      localStorage.setItem("drybox_usuario_logado", JSON.stringify(usuarioLogado))
    } else {
      localStorage.removeItem("drybox_usuario_logado")
    }
  }, [usuarioLogado])

  /**
   * Sempre que a tela mudar,
   * salva a tela atual no localStorage.
   */
  useEffect(() => {
    localStorage.setItem("drybox_modo_tela", modoTela)
  }, [modoTela])

  /**
   * Sempre que o item selecionado mudar,
   * salva ou remove do localStorage.
   */
  useEffect(() => {
    if (itemSelecionadoId !== null) {
      localStorage.setItem("drybox_item_selecionado", String(itemSelecionadoId))
    } else {
      localStorage.removeItem("drybox_item_selecionado")
    }
  }, [itemSelecionadoId])

  /**
   * Converte uma movimentação em impacto numérico no estoque.
   *
   * Exemplo:
   * entrada 5 => +5
   * saída 5   => -5
   *
   * Isso ajuda principalmente na edição de uma movimentação,
   * porque precisamos "desfazer" o efeito antigo e aplicar o novo.
   */
  function calcularEfeitoMovimentacao(tipo, quantidade) {
    const qtd = Number(quantidade)

    if (tipo === "entrada") {
      return qtd
    }

    return -qtd
  }

  /**
   * Registra uma nova movimentação no item.
   *
   * Fluxo:
   * 1. valida a quantidade
   * 2. encontra o item
   * 3. calcula a nova quantidade em estoque
   * 4. atualiza a tabela de itens
   * 5. grava no histórico
   * 6. recarrega os itens para atualizar a tela
   */
  async function registrarMovimentacao(itemId, tipo, quantidade, comentario) {
    const qtd = Number(quantidade)

    // Impede quantidade vazia, zero ou negativa
    if (!qtd || qtd <= 0) {
      alert("Quantidade inválida")
      return
    }

    const item = itens.find((i) => i.id === itemId)
    if (!item) return

    // Se for entrada soma, se for saída subtrai
    const novaQuantidade =
      tipo === "entrada" ? item.quantidade + qtd : item.quantidade - qtd

    // Não deixa o estoque ficar negativo
    if (novaQuantidade < 0) {
      alert("Estoque insuficiente")
      return
    }

    // Atualiza a quantidade atual do item
    const { error: erroItem } = await supabase
      .from("itens")
      .update({ quantidade: novaQuantidade })
      .eq("id", itemId)

    if (erroItem) {
      alert("Erro ao atualizar quantidade do item")
      return
    }

    // Grava o lançamento no histórico
    const { error: erroHistorico } = await supabase.from("historico").insert([
      {
        item_id: itemId,
        usuario: usuarioLogado.nome,
        tipo,
        quantidade: qtd,
        comentario,
        data: new Date().toLocaleString("pt-BR"),
      },
    ])

    if (erroHistorico) {
      alert("Erro ao salvar histórico")
      return
    }

    // Recarrega os itens para refletir na tela
    await carregarItens()
  }

  /**
   * Edita uma movimentação já existente.
   *
   * Como funciona:
   * 1. pega o registro antigo
   * 2. remove o efeito antigo do estoque atual
   * 3. aplica o novo efeito
   * 4. atualiza o estoque do item
   * 5. atualiza o histórico
   *
   * Exemplo:
   * estoque atual: 10
   * registro antigo: saída 2  => efeito antigo = -2
   * sem o antigo: 10 - (-2) = 12
   * novo registro: entrada 3 => efeito novo = +3
   * resultado final: 12 + 3 = 15
   */
  async function editarMovimentacao(itemId, historicoId, novoTipo, novaQuantidade, novoComentario) {
    const qtdNova = Number(novaQuantidade)

    // Impede quantidade inválida
    if (!qtdNova || qtdNova <= 0) {
      alert("Quantidade inválida")
      return
    }

    const item = itens.find((i) => i.id === itemId)
    if (!item) return

    const registroAntigo = item.historico.find((h) => h.id === historicoId)
    if (!registroAntigo) return

    // Calcula o efeito da movimentação antiga no estoque
    const efeitoAntigo = calcularEfeitoMovimentacao(
      registroAntigo.tipo,
      registroAntigo.quantidade
    )

    // Calcula o efeito da nova movimentação editada
    const efeitoNovo = calcularEfeitoMovimentacao(novoTipo, qtdNova)

    // Remove o impacto antigo do estoque atual
    const quantidadeBaseSemRegistroAntigo = item.quantidade - efeitoAntigo

    // Aplica o novo impacto
    const quantidadeFinal = quantidadeBaseSemRegistroAntigo + efeitoNovo

    // Bloqueia se a edição deixar estoque negativo
    if (quantidadeFinal < 0) {
      alert("Estoque insuficiente para salvar essa edição")
      return
    }

    // Atualiza a quantidade final do item
    const { error: erroItem } = await supabase
      .from("itens")
      .update({ quantidade: quantidadeFinal })
      .eq("id", itemId)

    if (erroItem) {
      alert("Erro ao atualizar quantidade do item")
      return
    }

    // Atualiza o registro no histórico
    const { error: erroHistorico } = await supabase
      .from("historico")
      .update({
        tipo: novoTipo,
        quantidade: qtdNova,
        comentario: novoComentario,
      })
      .eq("id", historicoId)

    if (erroHistorico) {
      alert("Erro ao atualizar movimentação")
      return
    }

    // Recarrega os itens para atualizar a tela
    await carregarItens()
  }

  /**
   * Remove um registro do histórico pelo índice visual.
   *
   * Observação:
   * essa função apenas apaga o histórico.
   * Se você quiser, depois eu posso ajustar para também
   * devolver a quantidade ao estoque corretamente ao excluir.
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
   * Remove um item inteiro.
   *
   * Primeiro remove o histórico relacionado,
   * depois remove o próprio item.
   */
  async function removerItem(itemId) {
    await supabase.from("historico").delete().eq("item_id", itemId)
    await supabase.from("itens").delete().eq("id", itemId)

    setModoTela("dashboard")
    setItemSelecionadoId(null)
    await carregarItens()
  }

  /**
   * Adiciona um novo item ao estoque.
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
   * Abre a tela de detalhe de um item.
   */
  function abrirItem(id) {
    setItemSelecionadoId(id)
    setModoTela("item")
  }

  /**
   * Volta para o dashboard principal.
   */
  function voltarDashboard() {
    setModoTela("dashboard")
    setItemSelecionadoId(null)
  }

  /**
   * Faz logout do usuário e limpa os dados salvos localmente.
   */
  function sair() {
    setUsuarioLogado(null)
    setModoTela("dashboard")
    setItemSelecionadoId(null)
    localStorage.removeItem("drybox_usuario_logado")
    localStorage.removeItem("drybox_modo_tela")
    localStorage.removeItem("drybox_item_selecionado")
  }

  // Enquanto carrega os dados iniciais, mostra mensagem simples
  if (carregando) return <div>Carregando...</div>

  // Se não tiver usuário logado, mostra tela de login
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

  // Tela de cadastro de novo item
  if (modoTela === "novo-item") {
    return <NovoItem voltar={voltarDashboard} adicionarItem={adicionarItem} />
  }

  // Tela de detalhe do item selecionado
  if (modoTela === "item") {
    const itemSelecionado = itens.find((i) => i.id === itemSelecionadoId)

    return (
      <ItemDetalhe
        item={itemSelecionado}
        voltar={voltarDashboard}
        registrarMovimentacao={registrarMovimentacao}
        editarMovimentacao={editarMovimentacao}
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
      aoSair={sair}
    />
  )
}

export default App
