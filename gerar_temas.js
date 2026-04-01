const fs = require('fs');
const path = require('path');

const dirImagens = path.join(__dirname, 'public', 'assets', 'imagens');
const arquivoSaida = path.join(__dirname, 'src', 'dados_temas.json');

const DADOS_TEMAS = {};

if (!fs.existsSync(dirImagens)) {
    console.warn("⚠️  Aviso: Pasta de imagens não encontrada em public/assets/imagens/");
    fs.writeFileSync(arquivoSaida, JSON.stringify({}, null, 2));
    process.exit(0);
}

const temas = fs.readdirSync(dirImagens);

temas.forEach(tema => {
    const caminhoTema = path.join(dirImagens, tema);
    
    if (fs.statSync(caminhoTema).isDirectory()) {
        DADOS_TEMAS[tema] = [];
        const arquivos = fs.readdirSync(caminhoTema);
        
        arquivos.forEach(arquivo => {
            if (arquivo.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                DADOS_TEMAS[tema].push(`/assets/imagens/${tema}/${arquivo}`);
            }
        });

        if (DADOS_TEMAS[tema].length === 0) {
            delete DADOS_TEMAS[tema];
        }
    }
});

fs.writeFileSync(arquivoSaida, JSON.stringify(DADOS_TEMAS, null, 2));
console.log('✅ Temas atualizados com sucesso no src/dados_temas.json!');