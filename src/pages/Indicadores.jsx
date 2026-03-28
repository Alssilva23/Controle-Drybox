import "./Indicadores.css"

/* tela de itens mais utilizados */
function Indicadores({ itens, aoVoltar }) {
  /* itens mais utilizados (menor quantidade) */
  const itensMaisUsados = [...itens]
    .sort((a, b) => Number(a.quantidade || 0) - Number(b.quantidade || 0))
    .slice(0, 5)

  return (
    <div className="indicadores-page">
      <div className="indicadores-container">

        {/* botão voltar */}
        <button onClick={aoVoltar} className="indicadores-voltar">
          ← Voltar
        </button>

        {/* título */}
        <h1 className="indicadores-titulo">Alta rotatividade</h1>

        {/* lista */}
        <div className="indicadores-card">
          {itensMaisUsados.length === 0 ? (
            <p>Sem dados</p>
          ) : (
            itensMaisUsados.map((item, index) => (
              <div key={item.id} className="indicadores-item">
                <span className="indicadores-rank">#{index + 1}</span>
                <span className="indicadores-nome">{item.nome}</span>
                <span className="indicadores-qtd">{item.quantidade}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default Indicadores
