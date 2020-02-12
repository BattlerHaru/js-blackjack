(() => {
    'use strict'

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small');

    // Funcion inicializar el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;

        console.clear();
    }

    // Funcion crear un nuevo deck
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }

        return _.shuffle(deck);
    }

    // Funcion pedir una carta
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck'
        }
        return deck.pop();
    }

    // Funcion obtener el valor de carta
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A' ? 11 : 10) :
            valor * 1;
    }

    // Acumular puntos del jugador
    // Turno: 0 = primer jugador y el ultimo sera la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        // carta corregida por problemas del navegador
        carta === 'AD' ? carta = 'ADD' : null;

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/img/${ carta }.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                console.log("Nadie gana");
            } else if (puntosMinimos > 21) {
                console.warn('Computadora Gana');
                console.warn('Buuuu Perdiste');
            } else if (puntosComputadora > 21) {
                console.log('%c Ganaste!!', 'background: #ce910e; color: white;');
            } else {
                console.warn('Computadora Gana');
                console.warn('Buuuu Perdiste');
            }

            btnPedir.disabled = 'true';
            btnDetener.disabled = 'true';
        }, 10);
    }

    // Funcion turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();

            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);

            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosComputadora < puntosMinimos) && puntosMinimos <= 21);

        determinarGanador();
    }

    //Eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();

        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            determinarGanador(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = 'true';
        btnDetener.disabled = 'true';
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });

})();