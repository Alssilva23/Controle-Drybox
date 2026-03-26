
import { useState } from "react"
import { supabase } from "../supabase.js"
import "./Indicadores.css"

/**
 * Tela de Indicadores / Performance
 *
 * Responsável por:
 * - mostrar o técnico logado
 * - preencher o formulário de reparo
 * - preencher automaticamente o defeito com base no código
 * - salvar os dados na tabela "indicadores_reparo" do Supabase
 */
function Indicadores({ usuarioLogado, voltar }) {
  /**
   * Estado do formulário.
   *
   * Cada campo representa uma coluna da tabela indicadores_reparo.
   * O campo "tecnico" não é digitado manualmente:
   * ele vem automaticamente do usuário logado.
   */
  const [form, setForm] = useState({
    ordem: "",
    seguimento: "",
    modelo: "",
    codigo: "",
    defeito: "",
    pmec: "",
    falha: "",
    linha: "",
    qtd: "",
    data: "",
  })

  /**
   * Controla o estado do botão salvar.
   *
   * Quando true:
   * - evita clique duplo
   * - mostra que está salvando
   */
  const [salvando, setSalvando] = useState(false)

  /**
   * Tabela local de códigos e defeitos.
   *
   * Serve para preencher automaticamente o defeito
   * quando o usuário informar um código conhecido.
   *
   * Depois, se você quiser, isso pode virar uma tabela no banco.
   */
  const defeitosPorCodigo = {
    95: "CORRENTE BAIXA",
    63: "INTERFERÊNCIA NA IMAGEM",
    1: "NÃO LIGA",
  }

  /**
   * Lista padronizada de linhas/origens.
   *
   * Isso evita erro de digitação
   * e ajuda muito nos gráficos depois.
   */
  const linhasDisponiveis = [
    "MFAN1-01",
    "MFAN1-04",
    "SMT03-01",
    "SMT04",
  ]

  /**
   * Atualiza os campos do formulário.
   *
   * Regras especiais:
   * - se o campo alterado for "codigo",
   *   o sistema tenta preencher o "defeito" automaticamente
   * - se o código não existir no mapa local, o defeito fica vazio
   */
  function handleChange(evento) {
    const { name, value } = evento.target

    setForm((estadoAnterior) => {
      const novoEstado = {
        ...estadoAnterior,
        [name]: value,
      }

      if (name === "codigo") {
        novoEstado.defeito = defeitosPorCodigo[value] || ""
      }

      return novoEstado
    })
  }

  /**
   * Limpa o formulário após salvar.
   *
   * Mantém todos os campos vazios para um novo lançamento.
   */
  function limparFormulario() {
    setForm({
      ordem: "",
      seguimento: "",
      modelo: "",
      codigo: "",
      defeito: "",
      pmec: "",
      falha: "",
      linha: "",
      qtd: "",
      data: "",
    })
  }

  /**
   * Salva o lançamento no Supabase.
   *
   * Fluxo:
   * 1. valida os campos obrigatórios
   * 2. monta o objeto com o técnico logado
   * 3. insere na tabela indicadores_reparo
   * 4. avisa se salvou com sucesso
   * 5. limpa o formulário
   */
  async function salvarLancamento() {
    if (!form.ordem || !form.codigo || !form.qtd || !form.linha) {
      alert("Preencha pelo menos: ordem, código, linha e quantidade.")
      return
    }

    setSalvando(true)

    const dadosParaSalvar = {
      tecnico: usuarioLogado?.nome || "",
      ordem: form.ordem,
      seguimento: form.seguimento,
      modelo: form.modelo,
      codigo: Number(form.codigo),
      defeito: form.defeito,
      pmec: form.pmec,
      falha: form.falha,
      linha: form.linha,
      qtd: Number(form.qtd),
      data: form.data || new Date().toLocaleString("pt-BR"),
    }

    const { error } = await supabase
      .from("indicadores_reparo")
      .insert([dadosParaSalvar])

    setSalvando(false)

    if (error) {
      console.error("Erro ao salvar lançamento:", error)
      alert("Erro ao salvar no banco.")
      return
    }

    alert("Lançamento salvo com sucesso.")
    limparFormulario()
  }

  return (
    <div className="indicadores-page">
      <div className="indicadores-container">
        <div className="indicadores-topo">
          <div>
            <h1 className="indicadores-titulo">Indicadores / Performance</h1>
            <p className="indicadores-subtitulo">
              Lançamento de reparos do técnico logado
            </p>
          </div>

          <button
            type="button"
            onClick={voltar}
            className="indicadores-botao-voltar"
          >
            Voltar
          </button>
        </div>

        <div className="indicadores-card">
          <p className="indicadores-tecnico">
            <strong>Técnico responsável:</strong> {usuarioLogado?.nome}
          </p>

          <div className="indicadores-grid">
            <div className="indicadores-campo">
              <label>Ordem</label>
              <input
                type="text"
                name="ordem"
                value={form.ordem}
                onChange={handleChange}
                placeholder="Ex: 10251090"
              />
            </div>

            <div className="indicadores-campo">
              <label>Seguimento</label>
              <input
                type="text"
                name="seguimento"
                value={form.seguimento}
                onChange={handleChange}
                placeholder="Ex: PCI"
              />
            </div>

            <div className="indicadores-campo">
              <label>Modelo</label>
              <input
                type="text"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ex: U25"
              />
            </div>

            <div className="indicadores-campo">
              <label>Código</label>
              <input
                type="number"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Ex: 95"
              />
            </div>

            <div className="indicadores-campo">
              <label>Defeito</label>
              <input
                type="text"
                name="defeito"
                value={form.defeito}
                onChange={handleChange}
                placeholder="Preenchido automático pelo código"
              />
            </div>

            <div className="indicadores-campo">
              <label>P.Mec</label>
              <input
                type="text"
                name="pmec"
                value={form.pmec}
                onChange={handleChange}
                placeholder="Ex: R181"
              />
            </div>

            <div className="indicadores-campo">
              <label>Falha</label>
              <input
                type="text"
                name="falha"
                value={form.falha}
                onChange={handleChange}
                placeholder="Ex: TOMBSTONE"
              />
            </div>

            <div className="indicadores-campo">
              <label>Linha</label>
              <select
                name="linha"
                value={form.linha}
                onChange={handleChange}
              >
                <option value="">Selecione a linha</option>
                {linhasDisponiveis.map((linha) => (
                  <option key={linha} value={linha}>
                    {linha}
                  </option>
                ))}
              </select>
            </div>

            <div className="indicadores-campo">
              <label>Quantidade</label>
              <input
                type="number"
                name="qtd"
                value={form.qtd}
                onChange={handleChange}
                placeholder="Ex: 2"
              />
            </div>

            <div className="indicadores-campo">
              <label>Data</label>
              <input
                type="text"
                name="data"
                value={form.data}
                onChange={handleChange}
                placeholder="Se deixar vazio, usa a data atual"
              />
            </div>
          </div>

          <div className="indicadores-acoes">
            <button
              type="button"
              onClick={salvarLancamento}
              className="indicadores-botao-salvar"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar lançamento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Indicadores
