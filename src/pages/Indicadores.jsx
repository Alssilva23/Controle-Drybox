/* tela de itens mais utilizados */
function Indicadores({ itens, aoVoltar }) {
  /* itens mais utilizados (baseado em saídas) */
  const itensMaisUsados = itens
    .map((item) => {
      const totalSaidas = (item.historico || [])
        .filter((h) => h.tipo === "saida")
        .reduce((acc, h) => acc + Number(h.quantidade || 0), 0)

      return {
        ...item,
        totalSaidas,
      }
    })
    .sort((a, b) => b.totalSaidas - a.totalSaidas)
    .slice(0, 5)

  return (
    <div className="indicadores-page">
      <div className="indicadores-container">

        {/* botão voltar */}
        <button onClick={aoVoltar} className="indicadores-voltar">
          ← Voltar
        </button>

        {/* título */}
        <h1 className="indicadores-titulo">Itens mais utilizados</h1>

        {/* lista */}
        <div className="indicadores-card">
          {itensMaisUsados.length === 0 ? (
            <p>Sem dados</p>
          ) : (
            itensMaisUsados.map((item, index) => (
              <div key={item.id} className="indicadores-item">
                <span className="indicadores-rank">#{index + 1}</span>
                <span className="indicadores-nome">{item.nome}</span>

                {/* agora mostra SAÍDAS */}
                <span className="indicadores-qtd">
                  {item.totalSaidas}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default Indicadores
