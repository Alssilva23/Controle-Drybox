import { useState, useEffect } from "react"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ItemDetalhe from "./pages/ItemDetalhe.jsx"
import NovoItem from "./pages/NovoItem.jsx"
import AdminUsuarios from "./pages/AdminUsuarios.jsx"
import usuariosPadrao from "./data/usuarios.js"

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [modoTela, setModoTela] = useState("dashboard")
  const [itemSelecionadoId, setItemSelecionadoId] = useState(null)

  const [usuarios, setUsuarios] = useState(() => {
    const usuariosSalvos = localStorage.getItem("drybox_usuarios")

    if (usuariosSalvos) {
      return JSON.parse(usuariosSalvos)
    }

    localStorage.setItem("drybox_usuarios", JSON.stringify(usuariosPadrao))
    return usuariosPadrao
  })

  const [itens, setItens] = useState(() => {
    const dadosSalvos = localStorage.getItem("drybox_itens")

    if (dadosSalvos) {
      return JSON.parse(dadosSalvos)
    }

    return [
      {
        id: 1,
        codigo: "RES-10K-0603",
        nome: "Resistor 10k 0603",
        local: "Caixa A1",
        quantidade: 145,
        historico: [
          {
            usuario: "Alessandra",
            tipo: "saida",
            quantidade: 5,
            comentario: "Sobra ordem 1563",
            data: "16/03/2026 09:35",
          },
        ],
      },
      {
        id: 2,
        codigo: "CAP-10UF-16V",
        nome: "Capacitor 10uF 16V",
        local: "Caixa B2",
        quantidade: 0,
        historico: [],
      },
      {
        id: 3,
        codigo: "REG-3V3",
        nome: "Regulador 3.3V",
        local: "Caixa C1",
        quantidade: 12,
        historico: [],
      },
      {
        id: 4,
        codigo: "USB-C-24P",
        nome: "Conector USB-C 24 pinos",
        local: "Caixa D3",
        quantidade: 8,
        historico: [],
      },
    ]
  })

  useEffect(() => {
    localStorage.setItem("drybox_itens", JSON.stringify(itens))
  }, [itens])

  useEffect(() => {
    localStorage.setItem("drybox_usuarios", JSON.stringify(usuarios))
  }, [usuarios])

  function registrarMovimentacao(itemId, tipo, quantidade, comentario) {
    const qtd = Number(quantidade)

    if (!qtd || qtd <= 0) {
      alert("Digite uma quantidade válida")
      return
    }

    setItens((listaAtual) =>
      listaAtual.map((item) => {
        if (item.id !== itemId) return item

        const novaQuantidade =
          tipo === "entrada" ? item.quantidade + qtd : item.quantidade - qtd

        const novoHistorico = [
          {
            usuario: usuarioLogado.nome,
            tipo,
            quantidade: qtd,
            comentario,
            data: new Date().toLocaleString("pt-BR"),
          },
          ...item.historico,
        ]

        return {
          ...item,
          quantidade: novaQuantidade,
          historico: novoHistorico,
        }
      })
    )
  }

  function removerHistorico(itemId, indexHistorico) {
    if (usuarioLogado.perfil !== "admin") {
      alert("Somente admin pode excluir registros do histórico")
      return
    }

    setItens((listaAtual) => {
      return listaAtual.map((item) => {
        if (item.id !== itemId) return item

        const novoHistorico = [...item.historico]
        novoHistorico.splice(indexHistorico, 1)

        return {
          ...item,
          historico: novoHistorico,
        }
      })
    })
  }

  function removerItem(itemId) {
    if (usuarioLogado.perfil !== "admin") {
      alert("Somente admin pode excluir itens")
      return
    }

    const confirmar = window.confirm("Deseja realmente excluir este item do sistema?")
    if (!confirmar) return

    setItens((listaAtual) => listaAtual.filter((item) => item.id !== itemId))
    setItemSelecionadoId(null)
    setModoTela("dashboard")
  }

  function adicionarItem(novoItem) {
    const item = {
      id: Date.now(),
      codigo: novoItem.codigo,
      nome: novoItem.nome,
      local: novoItem.local,
      quantidade: Number(novoItem.quantidade),
      historico: [
        {
          usuario: usuarioLogado.nome,
          tipo: "entrada",
          quantidade: Number(novoItem.quantidade),
          comentario: "Cadastro inicial do item",
          data: new Date().toLocaleString("pt-BR"),
        },
      ],
    }

    setItens((listaAtual) => [item, ...listaAtual])
    setModoTela("dashboard")
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

  if (!usuarioLogado) {
    return <Login onLogin={setUsuarioLogado} />
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