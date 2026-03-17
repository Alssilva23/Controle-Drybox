import { useState } from "react"
import Login from "./Login"
import Dashboard from "./Dashboard"
import AdminUsuarios from "./AdminUsuarios"
import NovoItem from "./NovoItem"

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [modoTela, setModoTela] = useState("dashboard")
  const [itemSelecionadoId, setItemSelecionadoId] = useState(null)

  const [usuarios, setUsuarios] = useState([
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

  const [itens, setItens] = useState([
    {
      id: 1,
      codigo: "3030",
      nome: "Base",
      local: "Caixa 2",
      quantidade: 10,
    },
  ])

  function sair() {
    setUsuarioLogado(null)
    setModoTela("dashboard")
  }

  function abrirItem(id) {
    setItemSelecionadoId(id)
    alert("Item selecionado: " + id)
  }

  if (!usuarioLogado) {
    return (
      <Login
        usuarios={usuarios}
        onLogin={(usuario) => {
          setUsuarioLogado(usuario)
          setModoTela("dashboard")
        }}
      />
    )
  }

  if (modoTela === "admin-usuarios") {
    return (
      <AdminUsuarios
        usuarioLogado={usuarioLogado}
        usuarios={usuarios}
        salvarUsuarios={setUsuarios}
        voltar={() => setModoTela("dashboard")}
      />
    )
  }

  if (modoTela === "novo-item") {
    return (
      <NovoItem
        itens={itens}
        salvarItens={setItens}
        voltar={() => setModoTela("dashboard")}
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
