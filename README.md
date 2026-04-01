# 🎮 Quem sou eu? (Jogo de Adivinhação)

Um jogo de adivinhação local baseado em turnos e times, construído com **React** e **Tailwind CSS**. Reúna os amigos, dividam-se em duas equipes e testem seus conhecimentos em diferentes temas!

## ✨ Funcionalidades

* **Multijogador Local:** Jogue com dois times disputando frente a frente no mesmo dispositivo.
* **Sistema de Rounds Personalizável:** Escolha a quantidade de rounds antes de iniciar a partida (de 1 a 99).
* **Gestão de Turnos:** Telas dedicadas de "Contagem Regressiva" e "Troca de Vez" para garantir que ninguém trapaceie espiando a tela na vez do outro time.
* **Placar Dinâmico:** Acompanhamento de pontuação em tempo real no topo da tela.
* **Temas Dinâmicos:** As imagens e categorias são carregadas de um arquivo JSON facilmente customizável.
* **Design Responsivo:** Interface fluida, moderna e focada no mobile, mas que funciona perfeitamente no PC.
* **Animação de Vitória:** Efeito de confete programado do zero utilizando `useMemo` e animações CSS nativas para celebrar o time vencedor!

## 🛠️ Tecnologias Utilizadas

* **React:** Gerenciamento de estado (`useState`, `useEffect`, `useCallback`, `useMemo`) e renderização da interface.
* **Tailwind CSS:** Para toda a estilização e animações rápidas (`animate-bounce`, `animate-ping`).
* **JavaScript (ES6+):** Lógica do jogo, embaralhamento de arrays e controle de tempo.

## 🚀 Como rodar o projeto localmente

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/KauanEdS/Jogo_Adivinhe_a_Imagem

2. **Acesse a pasta do projeto:**
    ```bash
   cd SEU_REPOSITORIO

3. **Instale as dependências:**   
    ```bash
    npm install

4.**Inicie o servidor de desenvolvimento:**
    ```bash
    npm start

O aplicativo será aberto no seu navegador padrão no endereço http://localhost:3000.

📁 Como adicionar novos temas e imagens
O jogo é alimentado pelo arquivo dados_temas.json. Para adicionar novas imagens ou categorias, basta seguir esta estrutura no arquivo:

```bash

{
  "Filmes de Animação": [
    "./caminho/para/imagem1.jpg",
    "./caminho/para/imagem2.jpg"
  ],
  "Animais": [
    "./caminho/para/cachorro.jpg",
    "./caminho/para/leao.jpg"
  ]
}

Dica: O jogo extrai o nome automaticamente do link/caminho do arquivo. Por exemplo, um arquivo nomeado O_Rei_Leao.jpg será formatado e exibido na tela como "O Rei Leao".

Desenvolvido por Kauan