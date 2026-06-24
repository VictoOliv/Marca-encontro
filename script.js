const botaoNao = document.getElementById("nao");
const palco = document.getElementById("palco");

const botaoSim =
document.getElementById("sim");

const modal =
document.getElementById("modalEncontro");

const conteudoModal =
document.getElementById("conteudoModal");

let etapa = 1;

let dadosEncontro = {

    data: "",
    hora: "",
    comida: ""

};

let podeFugir = false;
let fugindo = false;
let ultimaFuga = 0;

window.addEventListener("load", () => {

    setTimeout(() => {
        podeFugir = true;
    }, 1000);

});

// ================================
// BOTÃO FUGITIVO
// ================================

function getMargemFuga() {
    return window.innerWidth <= 600 ? 14 : 28;
}

function getAreaFuga() {

    const caixa = document.getElementById("caixa");
    const palcoRect = palco.getBoundingClientRect();
    const caixaRect = caixa.getBoundingClientRect();

    const btnW = botaoNao.offsetWidth || 120;
    const btnH = botaoNao.offsetHeight || 45;
    const extra = getMargemFuga();

    let minX = caixaRect.left - palcoRect.left - extra;
    let maxX = caixaRect.right - palcoRect.left - btnW + extra;
    let minY = caixaRect.top - palcoRect.top - extra;
    let maxY = caixaRect.bottom - palcoRect.top - btnH + extra;

    const limite = 4;
    const palcoW = palco.offsetWidth;
    const palcoH = palco.offsetHeight;

    minX = Math.max(limite, minX);
    minY = Math.max(limite, minY);
    maxX = Math.min(palcoW - btnW - limite, maxX);
    maxY = Math.min(palcoH - btnH - limite, maxY);

    if (maxX < minX) {
        const centro = caixaRect.left - palcoRect.left + caixaRect.width / 2 - btnW / 2;
        minX = maxX = Math.max(limite, Math.min(centro, palcoW - btnW - limite));
    }

    if (maxY < minY) {
        const centro = caixaRect.top - palcoRect.top + caixaRect.height / 2 - btnH / 2;
        minY = maxY = Math.max(limite, Math.min(centro, palcoH - btnH - limite));
    }

    return { minX, maxX, minY, maxY, btnW, btnH };
}

function iniciarFuga() {

    const pos = botaoNao.getBoundingClientRect();
    const palcoRect = palco.getBoundingClientRect();

    botaoNao.classList.add("fugindo");
    palco.appendChild(botaoNao);

    botaoNao.style.width = pos.width + "px";
    botaoNao.style.height = pos.height + "px";
    botaoNao.style.left = (pos.left - palcoRect.left) + "px";
    botaoNao.style.top = (pos.top - palcoRect.top) + "px";
    fugindo = true;
}

function fugir() {

    if (!podeFugir) return;

    const agora = Date.now();
    if (agora - ultimaFuga < 100) return;
    ultimaFuga = agora;

    if (!fugindo) {
        iniciarFuga();
    }

    const area = getAreaFuga();
    const palcoRect = palco.getBoundingClientRect();
    const atual = botaoNao.getBoundingClientRect();

    const centroAtualX = atual.left - palcoRect.left + atual.width / 2;
    const centroAtualY = atual.top - palcoRect.top + atual.height / 2;

    let x = area.minX;
    let y = area.minY;
    let tentativas = 0;
    const distanciaMinima = 36;

    do {
        x = area.minX + Math.random() * (area.maxX - area.minX);
        y = area.minY + Math.random() * (area.maxY - area.minY);

        const centroNovoX = x + area.btnW / 2;
        const centroNovoY = y + area.btnH / 2;

        const distancia = Math.hypot(
            centroNovoX - centroAtualX,
            centroNovoY - centroAtualY
        );

        if (distancia >= distanciaMinima) break;

        tentativas++;
    } while (tentativas < 10);

    x = Math.max(area.minX, Math.min(x, area.maxX));
    y = Math.max(area.minY, Math.min(y, area.maxY));

    botaoNao.style.left = Math.round(x) + "px";
    botaoNao.style.top = Math.round(y) + "px";
}

// Desktop e mobile (toque)
document.addEventListener("mousemove", (e) => {

    if (!podeFugir) return;

    const rect = botaoNao.getBoundingClientRect();

    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    const distancia = Math.hypot(
        e.clientX - centroX,
        e.clientY - centroY
    );

    if (distancia < 80) {
        fugir();
    }

});

document.addEventListener("touchmove", (e) => {

    if (!podeFugir) return;

    const toque = e.touches[0];
    if (!toque) return;

    const rect = botaoNao.getBoundingClientRect();

    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    const distancia = Math.hypot(
        toque.clientX - centroX,
        toque.clientY - centroY
    );

    if (distancia < 90) {
        fugir();
    }

}, { passive: true });

// Eventos extras
botaoNao.addEventListener(
    "pointerenter",
    fugir
);

botaoNao.addEventListener(
    "pointerdown",
    (e) => {
        e.preventDefault();
        fugir();
    }
);

botaoNao.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    fugir();
});
// ================================
// CORAÇÕES
// ================================

const containerCoracoes =
document.getElementById("coracoes");

function criarCoracao() {

    const coracao =
        document.createElement("div");

    coracao.classList.add("coracao");

    coracao.innerHTML = "❤";

    coracao.style.left =
        Math.random() * 100 + "vw";

    coracao.style.top =
        (100 + Math.random() * 15) + "vh";

    coracao.style.fontSize =
        (15 + Math.random() * 20) + "px";

    coracao.style.animationDuration =
        (4 + Math.random() * 4) + "s";

    containerCoracoes.appendChild(coracao);

    setTimeout(() => {
        coracao.remove();
    }, 8000);

}

// Cria alguns imediatamente
for(let i = 0; i < 20; i++){
    criarCoracao();
}

setInterval(
    criarCoracao,
    150
);

botaoSim.addEventListener(
    "click",
    abrirModal
);

function abrirModal(){

    modal.classList.remove("oculto");

    etapa = 1;

    renderizarEtapa();
}

function renderizarEtapa(){

    if(etapa === 1){

        conteudoModal.innerHTML = `

            <h2>📅 Qual dia você prefere?</h2>

            <input
            type="date"
            id="campoData"
            value="${dadosEncontro.data}"
            min="${new Date().toISOString().split('T')[0]}"
            >

            <div class="botoes-modal">

                <button
                    class="btn-modal btn-proximo"
                    onclick="proximaEtapa()"
                >
                    Próximo
                </button>

            </div>

        `;
    }

    if(etapa === 2){

        conteudoModal.innerHTML = `

            <h2>🚗 A que horas eu te busco?</h2>

            <input
            type="time"
            id="campoHora"
            value="${dadosEncontro.hora}"
            step="1800"
            >

            <div class="botoes-modal">

                <button
                    class="btn-modal btn-voltar"
                    onclick="voltarEtapa()"
                >
                    Voltar
                </button>

                <button
                    class="btn-modal btn-proximo"
                    onclick="proximaEtapa()"
                >
                    Próximo
                </button>

            </div>

        `;
    }

    if(etapa === 3){

        conteudoModal.innerHTML = `

            <h2>🍽 O que você gostaria de comer?</h2>

            <div class="opcoes-comida">

                <button class="opcao-comida">🍝 Italiana</button>
                <button class="opcao-comida">🍣 Japonesa</button>
                <button class="opcao-comida">🥡 Chinesa</button>
                <button class="opcao-comida">🍕 Pizza</button>
                <button class="opcao-comida">🍔 Hambúrguer</button>
                <button class="opcao-comida">🥩 Churrasco</button>
                <button class="opcao-comida">🌮 Mexicana</button>
                <button class="opcao-comida">🍗 Frango Frito</button>
                <button class="opcao-comida">🥙 Árabe</button>
                <button class="opcao-comida">🍛 Indiana</button>
                <button class="opcao-comida">🦐 Frutos do Mar</button>
                <button class="opcao-comida">🥞 Café da Manhã</button>
                <button class="opcao-comida">🍰 Cafeteria</button>
                <button class="opcao-comida">🍨 Sorveteria</button>
                <button class="opcao-comida">✨ Surpresa</button>

            </div>

            <div class="botoes-modal">

                <button
                    class="btn-modal btn-voltar"
                    onclick="voltarEtapa()"
                >
                    Voltar
                </button>

            </div>

        `;

        document
        .querySelectorAll(".opcao-comida")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    dadosEncontro.comida =
                    botao.textContent;

                    etapa = 4;

                    renderizarEtapa();

                }
            );

        });

    }

    if(etapa === 4){

        conteudoModal.innerHTML = `

            <h2>❤️ Confirmar encontro</h2>

            <div class="resumo">

                <p>
                    📅 ${new Date(dadosEncontro.data)
                        .toLocaleDateString('pt-BR')}
                </p>

                <p>
                    🕒 ${dadosEncontro.hora}
                </p>

                <p>
                    🍽 ${dadosEncontro.comida}
                </p>

            </div>

            <div class="botoes-modal">

                <button
                    class="btn-modal btn-voltar"
                    onclick="voltarEtapa()"
                >
                    Voltar
                </button>

                <button
                    class="btn-modal btn-confirmar"
                    onclick="confirmarEncontro()"
                >
                    Confirmar
                </button>

            </div>

        `;
    }

}

function proximaEtapa(){

    if(etapa === 1){

        dadosEncontro.data =
        document.getElementById("campoData").value;

        if(!dadosEncontro.data){
            return;
        }

    }

    if(etapa === 2){

        dadosEncontro.hora =
        document.getElementById("campoHora").value;

        if(!dadosEncontro.hora){
            return;
        }

    }

    etapa++;

    renderizarEtapa();
}

function voltarEtapa(){

    etapa--;

    renderizarEtapa();
}

function confirmarEncontro(){

    conteudoModal.innerHTML = `

        <div class="sucesso">

            <h2>❤️ Nosso encontro está quase marcado!</h2>

            <p>Clique em "Enviar detalhes" para marcar</p>

            <button class="btn-modal btn-confirmar" onclick="enviarWhatsApp()">
                Enviar detalhes
            </button>

        </div>

    `;
}

function enviarWhatsApp(){

    const numero = "553171906379";

    const mensagem = `
    ♡ Novo encontro marcado!

    ♡ Data: ${dadosEncontro.data}
    ♡ Hora: ${dadosEncontro.hora}
    ♡ Comida: ${dadosEncontro.comida}
    `;

    const url =
        "https://wa.me/" +
        numero +
        "?text=" +
        encodeURIComponent(mensagem);

    window.open(url, "_blank");
}