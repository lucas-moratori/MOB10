const telaSnake = document.getElementById('telaSnake');
const ctxSnake = telaSnake.getContext('2d');
const TAM = 20;                 // tamanho de cada célula
const COLUNAS = telaSnake.width / TAM;
const LINHAS = telaSnake.height / TAM;

let cobra, direcao, comida, pontos, intervaloSnake, rodandoSnake;

function iniciarSnake() {
    cobra = [{ x: 10, y: 10 }];
    direcao = { x: 1, y: 0 };
    pontos = 0;
    rodandoSnake = true;
    gerarComida();
    atualizarStatusSnake('rodando');

    clearInterval(intervaloSnake);
    intervaloSnake = setInterval(tickSnake, 120);
}

function pausarSnake() {
    if (rodandoSnake) {
        clearInterval(intervaloSnake);
        rodandoSnake = false;
        atualizarStatusSnake('pausado');
    } else if (cobra) {
        rodandoSnake = true;
        intervaloSnake = setInterval(tickSnake, 120);
        atualizarStatusSnake('rodando');
    }
}

function gerarComida() {
    comida = {
        x: Math.floor(Math.random() * COLUNAS),
        y: Math.floor(Math.random() * LINHAS)
    };
}

function tickSnake() {
    // Nova cabeça
    const cabeca = { x: cobra[0].x + direcao.x, y: cobra[0].y + direcao.y };

    // Colisão com parede
    if (cabeca.x < 0 || cabeca.x >= COLUNAS || cabeca.y < 0 || cabeca.y >= LINHAS) {
        return fimDeJogo();
    }

    // Colisão com o próprio corpo
    if (cobra.some(p => p.x === cabeca.x && p.y === cabeca.y)) {
        return fimDeJogo();
    }

    cobra.unshift(cabeca);

    // Comeu?
    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontos++;
        gerarComida();
        atualizarStatusSnake('rodando');
    } else {
        cobra.pop();
    }

    desenharSnake();
}

function desenharSnake() {
    ctxSnake.fillStyle = '#1a1a2e';
    ctxSnake.fillRect(0, 0, telaSnake.width, telaSnake.height);

    // Comida
    ctxSnake.fillStyle = '#e74c3c';
    ctxSnake.fillRect(comida.x * TAM, comida.y * TAM, TAM - 2, TAM - 2);

    // Cobra
    cobra.forEach((p, i) => {
        ctxSnake.fillStyle = i === 0 ? '#f7971e' : '#ffd200';
        ctxSnake.fillRect(p.x * TAM, p.y * TAM, TAM - 2, TAM - 2);
    });
}

function fimDeJogo() {
    clearInterval(intervaloSnake);
    rodandoSnake = false;
    atualizarStatusSnake('fim de jogo');
    alert('Fim de jogo! Pontos: ' + pontos);
}

function atualizarStatusSnake(estado) {
    document.getElementById('statusSnake').innerHTML =
        `Pontos: ${pontos}<br>Estado: ${estado}`;
}

document.addEventListener('keydown', e => {
    if (!rodandoSnake) return;
    const mapa = {
        ArrowUp:    { x: 0, y: -1 },
        ArrowDown:  { x: 0, y: 1 },
        ArrowLeft:  { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };
    const nova = mapa[e.key];
    if (!nova) return;
    if (nova.x === -direcao.x && nova.y === -direcao.y) return;
    direcao = nova;
});
