async function carregarUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("id", { ascending: true })

  if (error) {
    console.error("Erro ao carregar usuários:", error)
    alert("ERRO SUPABASE: " + error.message)
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
      alert("ERRO INSERT: " + insertError.message)
      return
    }

    const { data: novosUsuarios, error: novoErro } = await supabase
      .from("usuarios")
      .select("*")
      .order("id", { ascending: true })

    if (novoErro) {
      alert("ERRO AO BUSCAR NOVOS: " + novoErro.message)
      return
    }

    setUsuarios(novosUsuarios || [])
    return
  }

  setUsuarios(data)
}
