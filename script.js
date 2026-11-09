const casas = document.querySelectorAll(".casa");
const statusJogo = document.getElementById("status");

let tabuleiro = ["", "", "", "", "", "", "", "", ""];
let jogoAtivo = true;
let vezDaIA = false;

const jogador = "X";
const computador = "O";

const combinacoes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

casas.forEach(casa => {
    casa.addEventListener("click", () => {

        const index = Number(casa.dataset.index);

        if (!jogoAtivo || vezDaIA || tabuleiro[index] !== "") {
            return;
        }

        fazerJogada(index, jogador);

        if (!jogoAtivo) return;

        vezDaIA = true;
        statusJogo.textContent = "🧚 A fadinha está pensando...";

        setTimeout(() => {

            const melhorJogada = escolherJogada();

            if (melhorJogada !== -1 && jogoAtivo) {
                fazerJogada(melhorJogada, computador);
            }

            vezDaIA = false;

        }, 600);
    });
});

function fazerJogada(index, simbolo) {

    tabuleiro[index] = simbolo;

    casas[index].textContent = simbolo;

    verificarResultado();
}

function verificarResultado() {

    for (const combinacao of combinacoes) {

        const [a, b, c] = combinacao;

        if (
            tabuleiro[a] &&
            tabuleiro[a] === tabuleiro[b] &&
            tabuleiro[b] === tabuleiro[c]
        ) {

            jogoAtivo = false;

            combinacao.forEach(index => {
                casas[index].classList.add("vencedora");
            });

            if (tabuleiro[a] === jogador) {
                statusJogo.textContent = "🌟 Você venceu! Que magia!";
            } else {
                statusJogo.textContent = "🧚 A fadinha venceu!";
            }

            bloquearCasas();
            return;
        }
    }

    if (!tabuleiro.includes("")) {

        jogoAtivo = false;

        statusJogo.textContent = "🌸 Empate! Que partida mágica!";

        bloquearCasas();
        return;
    }

    if (!vezDaIA) {
        statusJogo.textContent = "🌷 Sua vez de jogar!";
    }
}

function bloquearCasas() {

    casas.forEach(casa => {
        casa.disabled = true;
    });

}

function minimax(tabuleiroAtual, profundidade, maximizando) {

    const resultado = avaliar(tabuleiroAtual);

    if (resultado !== null) {
        return resultado;
    }

    if (maximizando) {

        let melhorValor = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (tabuleiroAtual[i] === "") {

                tabuleiroAtual[i] = computador;

                const valor = minimax(
                    tabuleiroAtual,
                    profundidade + 1,
                    false
                );

                tabuleiroAtual[i] = "";

                melhorValor = Math.max(melhorValor, valor);
            }
        }

        return melhorValor;

    } else {

        let melhorValor = Infinity;

        for (let i = 0; i < 9; i++) {

            if (tabuleiroAtual[i] === "") {

                tabuleiroAtual[i] = jogador;

                const valor = minimax(
                    tabuleiroAtual,
                    profundidade + 1,
                    true
                );

                tabuleiroAtual[i] = "";

                melhorValor = Math.min(melhorValor, valor);
            }
        }

        return melhorValor;
    }
}

function avaliar(tabuleiroAtual) {

    for (const combinacao of combinacoes) {

        const [a, b, c] = combinacao;

        if (
            tabuleiroAtual[a] &&
            tabuleiroAtual[a] === tabuleiroAtual[b] &&
            tabuleiroAtual[b] === tabuleiroAtual[c]
        ) {

            if (tabuleiroAtual[a] === computador) {
                return 10;
            }

            if (tabuleiroAtual[a] === jogador) {
                return -10;
            }
        }
    }

    if (!tabuleiroAtual.includes("")) {
        return 0;
    }

    return null;
}

function escolherJogada() {

    let melhorValor = -Infinity;
    let melhoresJogadas = [];

    for (let i = 0; i < 9; i++) {

        if (tabuleiro[i] === "") {

            tabuleiro[i] = computador;

            const valor = minimax(tabuleiro, 0, false);

            tabuleiro[i] = "";

            if (valor > melhorValor) {

                melhorValor = valor;
                melhoresJogadas = [i];

            } else if (valor === melhorValor) {

                melhoresJogadas.push(i);
            }
        }
    }

    if (melhoresJogadas.length > 0) {

        const sorteada = Math.floor(
            Math.random() * melhoresJogadas.length
        );

        return melhoresJogadas[sorteada];
    }

    return -1;
}

function reiniciarJogo() {

    tabuleiro = ["", "", "", "", "", "", "", "", ""];

    jogoAtivo = true;
    vezDaIA = false;

    casas.forEach(casa => {

        casa.textContent = "";
        casa.disabled = false;
        casa.classList.remove("vencedora");

    });

    statusJogo.textContent = "🌷 Sua vez de jogar!";
}