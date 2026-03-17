import { useState } from "react"

function Login({ onLogin, usuarios = [] }) {
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")

  function entrar(e) {
    e.preventDefault()

    const loginDigitado = usuario.trim().toLowerCase()
    const senhaDigitada = senha.trim()

    if (!loginDigitado || !senhaDigitada) {
      alert("Preencha usuário e senha")
      return
    }

    const usuarioEncontrado = usuarios.find((u) => {
      const usuarioBanco = String(u.usuario || "").trim().toLowerCase()
      const nomeBanco = String(u.nome || "").trim().toLowerCase()
      const senhaBanco = String(u.senha || "").trim()

      return (
        (usuarioBanco === loginDigitado || nomeBanco === loginDigitado) &&
        senhaBanco === senhaDigitada
      )
    })

    if (!usuarioEncontrado) {
      alert("Usuário ou senha inválidos")
      return
    }

    onLogin(usuarioEncontrado)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={entrar}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ color: "#22c55e", margin: 0, fontSize: "42px" }}>Intelbras</h1>
        <h2 style={{ marginTop: "8px", marginBottom: "8px" }}>Técnico de Reparo</h2>

        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Insira suas credenciais para gerenciar o inventário DryBox
        </p>

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Usuário
        </label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Digite seu usuário"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "18px",
            boxSizing: "border-box",
          }}
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Senha
        </label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  )
}

function Dashboard({
  usuario,
  itens,
  aoSelecionarItem,
  aoNovoItem,
  aoAbrirAdmin,
  aoSair,
}) {
  const [busca, setBusca] = useState("")

  const itensFiltrados = itens.filter((item) => {
    const termo = busca.trim().toLowerCase()
    return (
      String(item.codigo || "").toLowerCase().includes(termo) ||
      String(item.nome || "").toLowerCase().includes(termo) ||
      String(item.local || "").toLowerCase().includes(termo)
    )
  })

  const totalItens = itens.length
  const totalPecas = itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0)
  const esgotados = itens.filter((item) => Number(item.quantidade || 0) === 0).length

  function exportarLista() {
    const janela = window.open("", "", "width=900,height=700")

    if (!janela) {
      alert("Não foi possível abrir a janela de impressão")
      return
    }

    janela.document.write(`
      <html>
        <head>
          <title>Lista DryBox</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            h1 { margin-bottom: 20px; }
            .linha { padding: 8px 0; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Lista de Componentes - DryBox</h1>
          ${itens
            .map(
              (item) => `
                <div class="linha">
                  <strong>${item.codigo ?? ""}</strong> | ${item.nome ?? ""} | ${item.local ?? ""} | ${item.quantidade ?? 0}
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `)

    janela.document.close()
    janela.focus()
    janela.print()
  }

  function abrirAdministracao() {
    if (usuario?.perfil !== "admin") {
      alert("Somente admin pode acessar essa área")
      return
    }
    aoAbrirAdmin()
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "260px",
            minHeight: "100vh",
            background: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            padding: "24px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, color: "#16a34a" }}>DryBox</h2>
          <p style={{ color: "#6b7280", marginTop: "6px" }}>Sistema de Estoque</p>

          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f9fafb",
              borderRadius: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#111827" }}>
              {usuario?.nome || "Usuário"}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
              Perfil: {usuario?.perfil || "-"}
            </div>

            <button
              type="button"
              onClick={aoSair}
              style={{
                marginTop: "12px",
                width: "100%",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              Sair
            </button>
          </div>

          <div style={{ marginTop: "30px" }}>
            <button
              type="button"
              style={{
                width: "100%",
                background: "#16a34a",
                color: "white",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "10px",
                border: "none",
                cursor: "default",
                fontSize: "16px",
              }}
            >
              Controle de Componentes
            </button>

            <button
              type="button"
              onClick={abrirAdministracao}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                color: "#374151",
                marginBottom: "10px",
                background: "#f9fafb",
                cursor: "pointer",
                border: "none",
                fontSize: "16px",
                textAlign: "left",
              }}
            >
              Administração
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "30px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                lineHeight: "1.1",
                color: "#111827",
              }}
            >
              Bem-vindo, {usuario?.nome || "Usuário"}
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
                fontSize: "18px",
              }}
            >
              Gerencie o inventário local do DryBox
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>Total de Itens</p>
              <h2>{totalItens}</h2>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>Peças em Estoque</p>
              <h2>{totalPecas}</h2>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#6b7280", marginTop: 0 }}>Itens Esgotados</p>
              <h2 style={{ color: "#dc2626" }}>{esgotados}</h2>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0 }}>Inventário de Componentes</h2>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={exportarLista}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Exportar Lista
                </button>

                <button
                  type="button"
                  onClick={aoNovoItem}
                  style={{
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  + Novo Item
                </button>
              </div>
            </div>

            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Pesquisar por código, nome ou local"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  boxSizing: "border-box",
                  fontSize: "15px",
                }}
              />
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Código</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Nome</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Local</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>Quantidade</th>
                </tr>
              </thead>

              <tbody>
                {itensFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      Nenhum componente encontrado.
                    </td>
                  </tr>
                ) : (
                  itensFiltrados.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => aoSelecionarItem(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                        {item.codigo}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                        {item.nome}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                        {item.local}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                        {Number(item.quantidade || 0) === 0 ? (
                          <span style={{ color: "#dc2626", fontWeight: "bold" }}>
                            Esgotado
                          </span>
                        ) : (
                          item.quantidade
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminUsuarios({ usuarioLogado, usuarios, salvarUsuarios, voltar }) {
  const [nome, setNome] = useState("")
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [perfil, setPerfil] = useState("tecnico")

  function cadastrarUsuario() {
    if (!nome || !usuario || !senha || !perfil) {
      alert("Preencha todos os campos")
      return
    }

    const usuarioJaExiste = usuarios.some(
      (u) => String(u.usuario || "").trim().toLowerCase() === usuario.trim().toLowerCase()
    )

    if (usuarioJaExiste) {
      alert("Esse usuário já existe")
      return
    }

    const novoUsuario = {
      id: Date.now(),
      nome: nome.trim(),
      usuario: usuario.trim(),
      senha: senha.trim(),
      perfil,
    }

    salvarUsuarios([...usuarios, novoUsuario])

    setNome("")
    setUsuario("")
    setSenha("")
    setPerfil("tecnico")

    alert("Usuário cadastrado com sucesso")
  }

  function excluirUsuario(id) {
    if (id === usuarioLogado.id) {
      alert("Você não pode excluir o usuário que está logado")
      return
    }

    salvarUsuarios(usuarios.filter((u) => u.id !== id))
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={voltar}
        style={{
          marginBottom: "20px",
          background: "#e5e7eb",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Administração de Usuários</h1>
        <p style={{ color: "#6b7280", marginBottom: 0 }}>
          Apenas admin pode cadastrar e excluir usuários.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Cadastrar Usuário</h2>

          <p style={{ marginBottom: "8px" }}>Nome</p>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <p style={{ marginBottom: "8px" }}>Usuário</p>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <p style={{ marginBottom: "8px" }}>Senha</p>
          <input
            type="text"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "16px",
              boxSizing: "border-box",
            }}
          />

          <p style={{ marginBottom: "8px" }}>Perfil</p>
          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginBottom: "20px",
              boxSizing: "border-box",
            }}
          >
            <option value="tecnico">Técnico</option>
            <option value="lider">Líder</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="button"
            onClick={cadastrarUsuario}
            style={{
              width: "100%",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cadastrar Usuário
          </button>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Usuários Cadastrados</h2>

          {usuarios.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Nenhum usuário cadastrado.</p>
          ) : (
            usuarios.map((u) => (
              <div
                key={u.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{u.nome}</div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    usuário: {u.usuario} | perfil: {u.perfil}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => excluirUsuario(u.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function NovoItem({ itens, salvarItens, voltar }) {
  const [codigo, setCodigo] = useState("")
  const [nome, setNome] = useState("")
  const [local, setLocal] = useState("")
  const [quantidade, setQuantidade] = useState("")

  function cadastrarItem() {
    if (!codigo || !nome || !local || quantidade === "") {
      alert("Preencha todos os campos")
      return
    }

    const novoItem = {
      id: Date.now(),
      codigo: codigo.trim(),
      nome: nome.trim(),
      local: local.trim(),
      quantidade: Number(quantidade),
    }

    salvarItens([...itens, novoItem])

    setCodigo("")
    setNome("")
    setLocal("")
    setQuantidade("")

    alert("Item cadastrado com sucesso")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={voltar}
        style={{
          marginBottom: "20px",
          background: "#e5e7eb",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Novo Item</h1>

        <p style={{ marginBottom: "8px" }}>Código</p>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <p style={{ marginBottom: "8px" }}>Nome</p>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <p style={{ marginBottom: "8px" }}>Local</p>
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <p style={{ marginBottom: "8px" }}>Quantidade</p>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="button"
          onClick={cadastrarItem}
          style={{
            width: "100%",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "14px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Cadastrar Item
        </button>
      </div>
    </div>
  )
}

function DetalheItem({ item, voltar }) {
  if (!item) {
    return (
      <div style={{ padding: "30px" }}>
        <button onClick={voltar}>Voltar</button>
        <h1>Item não encontrado</h1>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={voltar}
        style={{
          marginBottom: "20px",
          background: "#e5e7eb",
          border: "none",
          borderRadius: "8px",
          padding: "10px 14px",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          maxWidth: "700px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Detalhes do Item</h1>
        <p><strong>Código:</strong> {item.codigo}</p>
        <p><strong>Nome:</strong> {item.nome}</p>
        <p><strong>Local:</strong> {item.local}</p>
        <p><strong>Quantidade:</strong> {item.quantidade}</p>
      </div>
    </div>
  )
}

export default function App() {
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
    {
      id: 2,
      codigo: "5050",
      nome: "Capacitor",
      local: "Caixa 1",
      quantidade: 0,
    },
  ])

  function sair() {
    setUsuarioLogado(null)
    setModoTela("dashboard")
    setItemSelecionadoId(null)
  }

  function abrirItem(id) {
    setItemSelecionadoId(id)
    setModoTela("detalhe-item")
  }

  const itemSelecionado = itens.find((item) => item.id === itemSelecionadoId)

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

  if (modoTela === "detalhe-item") {
    return (
      <DetalheItem
        item={itemSelecionado}
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
