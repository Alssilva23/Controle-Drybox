import { useState } from "react"
import { supabase } from "../supabase.js"
import "./Indicadores.css"

/**
 * Tela de Indicadores / Performance
 *
 * Essa tela foi pensada para lançar:
 * - dados gerais da ordem (cabeçalho)
 * - vários defeitos / reparos na mesma ordem
 *
 * Estrutura da tela:
 * 1. Cabeçalho fixo da ordem
 * 2. Tabela com múltiplas linhas de lançamento
 *
 * Cada linha da tabela representa um lançamento separado,
 * mas todos compartilham os dados gerais da mesma ordem.
 */
function Indicadores({ usuarioLogado, voltar }) {
  /**
   * Estado do cabeçalho.
   *
   * Esses campos ficam no topo da tela
   * e valem para todos os lançamentos da ordem.
   */
  const [cabecalho, setCabecalho] = useState({
    ordem: "",
    seguimento: "",
    modelo: "",
    codigoItem: "",
    data: "",
  })

  /**
   * Função auxiliar para criar uma linha vazia.
   *
   * Foi separada assim para evitar repetir o mesmo objeto
   * em vários lugares do código.
   */
  function criarLinhaVazia() {
    return {
      codigo: "",
      defeito: "",
      pmec: "",
      falha: "",
      linha: "",
      qtd: "",
    }
  }

  /**
   * Estado com as linhas de lançamento.
   *
   * Cada item desse array representa uma linha da tabela.
   * O sistema começa com 2 linhas vazias por padrão.
   */
  const [lancamentos, setLancamentos] = useState([
    criarLinhaVazia(),
    criarLinhaVazia(),
  ])

  /**
   * Controla o botão de salvar.
   *
   * Quando estiver true:
   * - evita múltiplos cliques
   * - mostra "Salvando..."
   */
  const [salvando, setSalvando] = useState(false)

  /**
   * Tabela local que relaciona código -> defeito.
   *
   * Quando o usuário digita um código conhecido,
   * o defeito é preenchido automaticamente.
   *
   * Depois isso pode virar uma tabela no banco,
   * mas por enquanto está fixo no sistema.
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
   * e mantém o padrão para futuros relatórios e gráficos.
   */
  const linhasDisponiveis = [
    "MFAN1-01",
    "MFAN1-04",
    "SMT03-01",
    "SMT04",
  ]

  /**
   * Atualiza os campos do cabeçalho.
   *
   * Exemplo:
   * - ordem
   * - seguimento
   * - modelo
   * - código do item
   * - data
   */
  function handleCabecalhoChange(evento) {
    const { name, value } = evento.target

    setCabecalho((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }))
  }

  /**
   * Atualiza um campo de uma linha específica da tabela.
   *
   * Parâmetros:
   * - index: posição da linha no array
   * - campo: nome do campo que será alterado
   * - valor: novo valor digitado pelo usuário
   *
   * Regra especial:
   * - se o campo alterado for "codigo",
   *   o sistema tenta preencher o defeito automaticamente.
   */
  function handleLinhaChange(index, campo, valor) {
    setLancamentos((estadoAnterior) => {
      const novasLinhas = [...estadoAnterior]

      novasLinhas[index] = {
        ...novasLinhas[index],
        [campo]: valor,
      }

      /**
       * Auto preenchimento do defeito com base no código.
       *
       * Se o código existir no mapa local,
       * o defeito é preenchido automaticamente.
       * Caso contrário, fica vazio.
       */
      if (campo === "codigo") {
        novasLinhas[index].defeito = defeitosPorCodigo[valor] || ""
      }

      return novasLinhas
    })
  }

  /**
   * Adiciona uma nova linha vazia à tabela.
   *
   * Isso permite lançar mais de um defeito/reparo
   * dentro da mesma ordem.
   */
  function adicionarLinha() {
    setLancamentos((estadoAnterior) => [
      ...estadoAnterior,
      criarLinhaVazia(),
    ])
  }

  /**
   * Remove uma linha da tabela pelo índice.
   *
   * Regra:
   * - o sistema precisa manter pelo menos 2 linhas visíveis,
   *   então não permite remover se só existirem 2.
   */
  function removerLinha(index) {
    if (lancamentos.length <= 2) {
      alert("É preciso manter pelo menos 2 linhas.")
      return
    }

    setLancamentos((estadoAnterior) =>
      estadoAnterior.filter((_, i) => i !== index)
    )
  }

  /**
   * Limpa todo o formulário após salvar com sucesso.
   *
   * Reseta:
   * - cabeçalho
   * - linhas de lançamento
   */
  function limparFormulario() {
    setCabecalho({
      ordem: "",
      seguimento: "",
      modelo: "",
      codigoItem: "",
      data: "",
    })

    setLancamentos([criarLinhaVazia(), criarLinhaVazia()])
  }

  /**
   * Salva os lançamentos no Supabase.
   *
   * Fluxo:
   * 1. valida o cabeçalho
   * 2. separa apenas as linhas preenchidas
   * 3. monta um array de objetos para salvar
   * 4. envia tudo de uma vez para o banco
   * 5. limpa o formulário se der certo
   */
  async function salvarLancamento() {
    /**
     * Validação mínima do cabeçalho.
     *
     * Sem ordem, não faz sentido salvar.
     */
    if (!cabecalho.ordem) {
      alert("Preencha a ordem.")
      return
    }

    /**
     * Filtra apenas as linhas válidas.
     *
     * Uma linha só será salva se tiver:
     * - código
     * - linha/origem
     * - quantidade
     */
    const linhasValidas = lancamentos.filter(
      (item) => item.codigo && item.linha && item.qtd
    )

    if (linhasValidas.length === 0) {
      alert("Preencha pelo menos uma linha com código, origem e quantidade.")
      return
    }

    setSalvando(true)

    /**
     * Se o usuário não preencher a data,
     * o sistema usa a data/hora atual em pt-BR.
     */
    const dataFinal = cabecalho.data || new Date().toLocaleString("pt-BR")

    /**
     * Monta os dados no formato esperado pela tabela do banco.
     *
     * Importante:
     * Cada linha da tabela gera um registro separado no Supabase.
     * Porém, os dados do cabeçalho são repetidos em todos.
     */
    const dadosParaSalvar = linhasValidas.map((item) => ({
      tecnico: usuarioLogado?.nome || "",
      ordem: cabecalho.ordem,
      seguimento: cabecalho.seguimento,
      modelo: cabecalho.modelo,

      /**
       * Código do item / produto da ordem.
       *
       * Atenção:
       * essa coluna precisa existir no banco.
       * Se não existir, remova essa linha
       * ou crie a coluna no Supabase.
       */
      codigo_item: cabecalho.codigoItem || null,

      /**
       * Código do defeito/reparo da linha.
       */
      codigo: Number(item.codigo),

      defeito: item.defeito,
      pmec: item.pmec,
      falha: item.falha,
      linha: item.linha,
      qtd: Number(item.qtd),
      data: dataFinal,
    }))

    /**
     * Envia todos os registros para o banco de uma vez.
     */
    const { error } = await supabase
      .from("indicadores_reparo")
      .insert(dadosParaSalvar)

    setSalvando(false)

    /**
     * Tratamento de erro.
     */
    if (error) {
      console.error("Erro ao salvar lançamento:", error)
      alert("Erro ao salvar no banco.")
      return
    }

    /**
     * Sucesso.
     */
    alert("Lançamentos salvos com sucesso.")
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

          {/* ========================================================
              BLOCO 1 - CABEÇALHO DA ORDEM
              Esses campos ficam no topo e valem para todos os lançamentos
             ======================================================== */}
          <div className="indicadores-grid-topo">
            <div className="indicadores-campo">
              <label>Ordem</label>
              <input
                type="text"
                name="ordem"
                value={cabecalho.ordem}
                onChange={handleCabecalhoChange}
                placeholder="Ex: 10265524"
              />
            </div>

            <div className="indicadores-campo">
              <label>Seguimento</label>
              <input
                type="text"
                name="seguimento"
                value={cabecalho.seguimento}
                onChange={handleCabecalhoChange}
                placeholder="Ex: ANALÓGICA"
              />
            </div>

            <div className="indicadores-campo">
              <label>Modelo</label>
              <input
                type="text"
                name="modelo"
                value={cabecalho.modelo}
                onChange={handleCabecalhoChange}
                placeholder="Ex: 4560052"
              />
            </div>

            <div className="indicadores-campo">
              <label>Código do item</label>
              <input
                type="text"
                name="codigoItem"
                value={cabecalho.codigoItem}
                onChange={handleCabecalhoChange}
                placeholder="Ex: 2102168"
              />
            </div>

            <div className="indicadores-campo">
              <label>Data</label>
              <input
                type="text"
                name="data"
                value={cabecalho.data}
                onChange={handleCabecalhoChange}
                placeholder="Se vazio, usa a atual"
              />
            </div>
          </div>

          {/* ========================================================
              BLOCO 2 - TABELA DE LANÇAMENTOS
              Cada linha representa um defeito/reparo da mesma ordem
             ======================================================== */}
          <div className="indicadores-tabela-wrap">
            <table className="indicadores-tabela">
              <thead>
                <tr>
                  <th>CÓD</th>
                  <th>DEFEITO</th>
                  <th>P.MEC</th>
                  <th>FALHA</th>
                  <th>ORIGEM</th>
                  <th>QTD</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>

              <tbody>
                {lancamentos.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        value={item.codigo}
                        onChange={(e) =>
                          handleLinhaChange(index, "codigo", e.target.value)
                        }
                        placeholder="95"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={item.defeito}
                        onChange={(e) =>
                          handleLinhaChange(index, "defeito", e.target.value)
                        }
                        placeholder="Automático"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={item.pmec}
                        onChange={(e) =>
                          handleLinhaChange(index, "pmec", e.target.value)
                        }
                        placeholder="Ex: R181"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={item.falha}
                        onChange={(e) =>
                          handleLinhaChange(index, "falha", e.target.value)
                        }
                        placeholder="Ex: TOMBSTONE"
                      />
                    </td>

                    <td>
                      <select
                        value={item.linha}
                        onChange={(e) =>
                          handleLinhaChange(index, "linha", e.target.value)
                        }
                      >
                        <option value="">Selecione</option>
                        {linhasDisponiveis.map((linha) => (
                          <option key={linha} value={linha}>
                            {linha}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        value={item.qtd}
                        onChange={(e) =>
                          handleLinhaChange(index, "qtd", e.target.value)
                        }
                        placeholder="2"
                      />
                    </td>

                    <td>
                      <button
                        type="button"
                        className="indicadores-botao-remover"
                        onClick={() => removerLinha(index)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ========================================================
              AÇÕES DA TELA
              - adicionar nova linha
              - salvar todos os lançamentos
             ======================================================== */}
          <div className="indicadores-acoes">
            <button
              type="button"
              onClick={adicionarLinha}
              className="indicadores-botao-secundario"
            >
              + Adicionar linha
            </button>

            <button
              type="button"
              onClick={salvarLancamento}
              className="indicadores-botao-salvar"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar lançamentos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Indicadores
