let VariacaoPontos = 0;
let PontosTotais = 0;
let HeroiSelecionado = "";

const personagens = ["Caua", "Osana", "Ramirez"];
const personagensRespondidos = {
    Caua: false,
    Osana: false,
    Ramirez: false
};

/* =========================================
   INICIALIZAÇÃO AUTOMÁTICA DAS PÁGINAS
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    // Se estiver na tela inicial, carrega o Top 3 salvo
    if (document.getElementById("top1")) {
        CarregarRanking();
    }

    // Se estiver na sala de aula, exibe os dados do jogador no topo
    const hudJogador = document.getElementById("hudJogador");
    if (hudJogador) {
        const nome = localStorage.getItem("jogadorNome") || "Visitante";
        const curso = localStorage.getItem("jogadorCurso") || "---";
        const heroi = localStorage.getItem("jogadorHeroi") || "Herói";
        hudJogador.textContent = `${nome} (${curso}) • Herói: ${heroi}`;
        AtualizarHUD();
    }
});

/* =========================================
   FUNÇÕES DA TELA INICIAL (index.html)
   ========================================= */
function SelecionarHeroi(nomeHeroi) {
    HeroiSelecionado = nomeHeroi;

    const btnMilly = document.getElementById("Milly");
    const btnLucas = document.getElementById("Lucas");
    const inputHeroi = document.getElementById("heroiEscolhido");

    if (btnMilly) btnMilly.classList.remove("selecionado");
    if (btnLucas) btnLucas.classList.remove("selecionado");

    const escolhido = document.getElementById(nomeHeroi);
    if (escolhido) {
        escolhido.classList.add("selecionado");
    }

    if (inputHeroi) {
        inputHeroi.value = nomeHeroi;
    }
}

function PrepararInicio(event) {
    event.preventDefault();

    if (!HeroiSelecionado) {
        alert("Toque na Milly ou no Lucas para escolher seu herói antes de começar!");
        return;
    }

    const nome = document.getElementById("nomeCompleto").value.trim();
    const cursoSelecionado = document.querySelector('input[name="curso"]:checked');
    const curso = cursoSelecionado ? cursoSelecionado.value : "";

    localStorage.setItem("jogadorNome", nome);
    localStorage.setItem("jogadorCurso", curso);
    localStorage.setItem("jogadorHeroi", HeroiSelecionado);

    // Redireciona para a fase da sala de aula
    window.location.href = "AcademiadaInclusao.html";
}

function CarregarRanking() {
    const rankingSalvo = JSON.parse(localStorage.getItem("rankingAcademia")) || [];

    for (let i = 0; i < 3; i++) {
        const item = document.getElementById("top" + (i + 1));
        if (!item) continue;

        const dadosSpan = item.querySelector(".DadosAluno");
        const pontosSpan = item.querySelector(".PontosAluno");

        if (rankingSalvo[i]) {
            dadosSpan.textContent = `${rankingSalvo[i].nome} (${rankingSalvo[i].curso})`;
            pontosSpan.textContent = `${rankingSalvo[i].pontos} pts`;
        }
    }
}

/* =========================================
   FUNÇÕES DA SALA DE AULA (AcademiadaInclusao.html)
   ========================================= */
function AbrirDialogo(nomePersonagem) {
    if (personagensRespondidos[nomePersonagem]) {
        alert("Você já conversou com este colega! Toque nos outros colegas da sala.");
        return;
    }

    FecharDialogo();

    const overlay = document.getElementById("overlayFoco");
    const setor = document.getElementById("setor" + nomePersonagem);
    const menu = document.getElementById("menu" + nomePersonagem);

    if (overlay && setor && menu) {
        overlay.style.display = "block";
        setor.classList.add("em-destaque");
        menu.style.display = "flex";
    }
}

function FecharDialogo() {
    const overlay = document.getElementById("overlayFoco");
    if (overlay) {
        overlay.style.display = "none";
    }

    personagens.forEach((nome) => {
        const setor = document.getElementById("setor" + nome);
        const menu = document.getElementById("menu" + nome);

        if (setor) setor.classList.remove("em-destaque");
        if (menu) menu.style.display = "none";
    });
}

function Responder(nomePersonagem, pontos) {
    if (personagensRespondidos[nomePersonagem]) return;

    personagensRespondidos[nomePersonagem] = true;
    const botaoPersonagem = document.getElementById(nomePersonagem);
    if (botaoPersonagem) {
        botaoPersonagem.classList.add("respondido");
    }

    VariacaoPontos = pontos;
    AtualizarPontos();
    FecharDialogo();

    // Verifica se todos os 3 colegas já foram respondidos
    const todosRespondidos = personagens.every((nome) => personagensRespondidos[nome]);
    if (todosRespondidos) {
        setTimeout(() => {
            alert(`Você conversou com todos os colegas! Pontuação final: ${PontosTotais} pts.`);
            FinalizarJogo();
        }, 300);
    }
}

function AtualizarPontos() {
    PontosTotais = Number(PontosTotais) + VariacaoPontos;
    VariacaoPontos = 0;
    AtualizarHUD();
}

function AtualizarHUD() {
    const hudPontos = document.getElementById("hudPontos");
    if (hudPontos) {
        hudPontos.textContent = `Pontos: ${PontosTotais}`;
    }
}

function FinalizarJogo() {
    const nome = localStorage.getItem("jogadorNome") || "Visitante";
    const curso = localStorage.getItem("jogadorCurso") || "GERAL";

    const rankingSalvo = JSON.parse(localStorage.getItem("rankingAcademia")) || [];
    rankingSalvo.push({
        nome: nome,
        curso: curso,
        pontos: PontosTotais
    });

    // Ordena do maior para o menor e mantém os 3 melhores
    rankingSalvo.sort((a, b) => b.pontos - a.pontos);
    localStorage.setItem("rankingAcademia", JSON.stringify(rankingSalvo.slice(0, 3)));

    // Volta para a tela inicial para o próximo participante do totem
    window.location.href = "index.html";
}