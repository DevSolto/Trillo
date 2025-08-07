import pandas as pd

src = "respostas_completo_rows (2).csv"   # caminho de entrada
out = "respostas_pivot.csv"               # caminho de saída

# Lê o CSV (ajuste o encoding se precisar)
df = pd.read_csv(src, encoding="utf-8")

# Seu arquivo tem: telefone_entrevistado, nome_pesquisa, conteudo_pergunta, resposta
# Renomeia para "numero" (como você quer na saída)
df = df.rename(columns={"telefone_entrevistado": "numero"})

# Higieniza perguntas (evita espaços extras)
df["conteudo_pergunta"] = df["conteudo_pergunta"].astype(str).strip()

# Se houver múltiplas respostas da mesma pessoa para a mesma pergunta,
# mantém a última não-nula.
def last_non_null(s: pd.Series):
    s = s.dropna()
    return s.iloc[-1] if not s.empty else None

wide = (
    df.pivot_table(
        index="numero",
        columns="conteudo_pergunta",
        values="resposta",
        aggfunc=last_non_null,
    )
    .reset_index()
)

# Garante "numero" como primeira coluna
cols = ["numero"] + [c for c in wide.columns if c != "numero"]
wide = wide[cols]

# Salva
wide.to_csv(out, index=False, encoding="utf-8-sig")
print(f"Gerado: {out}  | linhas={len(wide)}  colunas={len(wide.columns)}")
