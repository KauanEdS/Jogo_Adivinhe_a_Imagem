import React, { useState, useCallback, useEffect, useMemo } from 'react';
import './index.css';
import DADOS_TEMAS from './dados_temas.json';

/* ── CONFETE ── */
function Confete({ ativo, onFim }) {
  const pieces = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: ['#818cf8','#f472b6','#34d399','#fbbf24','#60a5fa','#a78bfa'][Math.floor(Math.random() * 6)],
      size: Math.random() * 10 + 6,
      isCircle: Math.random() > 0.5,
    })), []
  );

  useEffect(() => {
    if (ativo) {
      const t = setTimeout(onFim, 2000);
      return () => clearTimeout(t);
    }
  }, [ativo, onFim]);

  if (!ativo) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute inset-0 bg-green-400/20 animate-ping"
        style={{ animationDuration: '0.4s', animationIterationCount: 1 }} />
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: '-20px',
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          borderRadius: p.isCircle ? '50%' : '2px',
          animationName: 'cair',
          animationDuration: '1.8s',
          animationTimingFunction: 'ease-in',
          animationDelay: `${p.delay}s`,
          animationFillMode: 'forwards',
        }} />
      ))}
    </div>
  );
}

/* ── TELA DE TROCA DE VEZ ── */
function TelaDeTroca({ timeDaVez, time1Nome, time2Nome, onPronto }) {
  const nomeTime = timeDaVez === 'time1' ? time1Nome : time2Nome;
  const corTime  = timeDaVez === 'time1' ? '#818cf8' : '#f472b6';
  const bgBotao  = timeDaVez === 'time1'
    ? 'bg-indigo-500 hover:bg-indigo-600'
    : 'bg-pink-500 hover:bg-pink-600';

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-[#3d3868] gap-3 p-4 text-center">
      <div className="text-4xl md:text-5xl animate-bounce">🔄</div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-purple-300 text-sm md:text-base font-bold uppercase tracking-widest">Troca de vez!</p>
        <p className="text-purple-400 text-xs md:text-sm">Passem o celular para o outro time</p>
        <span className="text-2xl md:text-4xl font-black mt-2" style={{ color: corTime }}>
          {nomeTime}
        </span>
        <p className="text-purple-300 text-lg md:text-xl font-bold">preparem-se! 🎯</p>
      </div>
      <button
        onClick={onPronto}
        className={`w-full max-w-xs text-white py-3 md:py-4 mt-2 rounded-2xl font-black text-lg md:text-xl shadow-xl active:scale-95 hover:-translate-y-1 transition-all ${bgBotao}`}
      >
        Estamos prontos! 🙌
      </button>
    </div>
  );
}

/* ── CONTAGEM REGRESSIVA ── */
function ContagemRegressiva({ timeDaVez, time1Nome, time2Nome, contador, setContador, onFim }) {
  useEffect(() => {
    if (contador <= 0) { onFim(); return; }
    const timer = setTimeout(() => setContador(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [contador, onFim, setContador]);

  const nomeTime = timeDaVez === 'time1' ? time1Nome : time2Nome;
  const corTime  = timeDaVez === 'time1' ? '#818cf8' : '#f472b6';

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-[#3d3868] gap-4">
      <p className="text-purple-300 text-sm md:text-base font-bold uppercase tracking-widest">Preparar...</p>
      <div className="flex flex-col items-center gap-1">
        <span className="text-purple-400 text-base md:text-lg font-bold">Vez de:</span>
        <span className="text-2xl md:text-4xl font-black" style={{ color: corTime }}>{nomeTime}</span>
      </div>
      <div className="relative flex items-center justify-center my-2">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#2e2a4a" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={corTime} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 42}
            strokeDashoffset={2 * Math.PI * 42 * (1 - contador / 5)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute text-4xl font-black text-white">{contador}</span>
      </div>
      <p className="text-purple-400 text-xs md:text-sm font-medium">O jogo começa em instantes!</p>
    </div>
  );
}

/* ── COMPONENTE PRINCIPAL ── */
export default function JogoDeAdivinhacao() {
  const [tela, setTela] = useState('menu');

  const [imagensEmJogo, setImagensEmJogo] = useState([]);
  const [indiceImagem, setIndiceImagem] = useState(0);

  const [time1Nome, setTime1Nome] = useState('');
  const [time2Nome, setTime2Nome] = useState('');
  const [time1Pontos, setTime1Pontos] = useState(0);
  const [time2Pontos, setTime2Pontos] = useState(0);
  const [timeDaVez, setTimeDaVez] = useState(null);
  const [mensagemSorteio, setMensagemSorteio] = useState('');
  const [totalRounds, setTotalRounds] = useState(3);
  const [roundAtual, setRoundAtual] = useState(1);
  const [turnosNaRodada, setTurnosNaRodada] = useState(0);
  const [contador, setContador] = useState(5);
  const [mostrarConfete, setMostrarConfete] = useState(false);

  const extrairNome = (url) => {
    if (!url) return '';
    return url.split('/').pop().split('.')[0].replace(/_/g, ' ');
  };

  const reiniciarMenu = () => {
    setTela('menu');
    setIndiceImagem(0);
    setTime1Pontos(0);
    setTime2Pontos(0);
    setTimeDaVez(null);
    setMensagemSorteio('');
    setImagensEmJogo([]);
    setContador(5);
    setMostrarConfete(false);
  };

  const iniciarJogo = (tema) => {
    if (!time1Nome.trim() || !time2Nome.trim()) {
      alert('Digite os nomes dos dois times para começar.');
      return;
    }
    setIndiceImagem(0);
    setTime1Pontos(0);
    setTime2Pontos(0);
    setRoundAtual(1);
    setTurnosNaRodada(0);
    setContador(5);

    const imagensEmbaralhadas = [...DADOS_TEMAS[tema]].sort(() => Math.random() - 0.5);
    setImagensEmJogo(imagensEmbaralhadas);

    const sorteio = Math.random() < 0.5 ? 'time1' : 'time2';
    setTimeDaVez(sorteio);
    setMensagemSorteio(`${sorteio === 'time1' ? time1Nome : time2Nome} começa!`);
    setTela('contagem');
  };

  const avancarTurno = useCallback((pontuou, trocarTime = false) => {
    const deveTracar = pontuou || trocarTime;
    const novoTime = timeDaVez === 'time1' ? 'time2' : 'time1';

    const pontosFinais1 = time1Pontos + (pontuou && timeDaVez === 'time1' ? 1 : 0);
    const pontosFinais2 = time2Pontos + (pontuou && timeDaVez === 'time2' ? 1 : 0);

    if (pontuou) {
      if (timeDaVez === 'time1') setTime1Pontos(p => p + 1);
      else setTime2Pontos(p => p + 1);
    }

    const novosTurnosNaRodada = turnosNaRodada + 1;

    if (novosTurnosNaRodada >= 2) {
      if (roundAtual >= totalRounds) {
        if (deveTracar) setTimeDaVez(novoTime);
        if (pontosFinais1 !== pontosFinais2) setMostrarConfete(true);
        setTela('fim');
        return;
      }
      setRoundAtual(r => r + 1);
      setTurnosNaRodada(0);
    } else {
      setTurnosNaRodada(novosTurnosNaRodada);
    }

    const total = imagensEmJogo.length;
    if (indiceImagem + 1 < total) {
      setIndiceImagem(prev => prev + 1);
    } else {
      if (pontosFinais1 !== pontosFinais2) setMostrarConfete(true);
      setTela('fim');
      return;
    }

    if (deveTracar) {
      setTimeDaVez(novoTime);
      setTela('troca');
    }
  }, [turnosNaRodada, roundAtual, totalRounds, timeDaVez, imagensEmJogo, indiceImagem, time1Pontos, time2Pontos]);

  // AÇÕES DOS BOTÕES:
  const handleAcertou = () => { avancarTurno(true); };
  
  // NOVA LÓGICA DO BOTÃO PULAR: Apenas passa para a próxima imagem.
  const handlePularImagem = () => { 
    const total = imagensEmJogo.length;
    if (indiceImagem + 1 < total) {
      setIndiceImagem(prev => prev + 1);
    } else {
      // Se acabarem as imagens do jogo enquanto pula, o jogo encerra
      if (time1Pontos !== time2Pontos) setMostrarConfete(true);
      setTela('fim');
    }
  };
  
  const handlePassarVez   = () => avancarTurno(false, true);

  return (
    <div className="w-full h-[100dvh] bg-[#2e2a4a] font-sans text-gray-800 flex flex-col overflow-hidden p-2 md:p-6 lg:p-8">

      <Confete ativo={mostrarConfete} onFim={() => setMostrarConfete(false)} />

      <div className="w-full h-full flex flex-col overflow-hidden mx-auto max-w-[1200px] bg-[#3d3868] shadow-2xl shadow-purple-950 rounded-2xl md:rounded-[2rem]">

        {/* MENU */}
        {tela === 'menu' && (
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 text-center overflow-hidden w-full mx-auto max-w-3xl gap-2 md:gap-4">
            <div>
              <div className="text-4xl md:text-5xl mb-1">🎮</div>
              <h1 className="text-2xl md:text-4xl font-black text-indigo-400 tracking-tight">Quem sou eu?</h1>
            </div>

            <p className="text-purple-300 font-bold text-xs md:text-sm">Defina os times e escolha o tema para começar</p>

            <div className="w-full max-w-sm space-y-2 p-3 md:p-4 rounded-2xl border border-purple-600/30 bg-purple-900/20">
              <input type="text" value={time1Nome} onChange={e => setTime1Nome(e.target.value)}
                placeholder="Nome do Time 1"
                className="w-full p-2 md:p-3 rounded-xl border-2 border-indigo-100 outline-none focus:border-indigo-500 font-bold text-center text-sm md:text-base transition-colors bg-white text-gray-900 placeholder-gray-400"
              />
              <input type="text" value={time2Nome} onChange={e => setTime2Nome(e.target.value)}
                placeholder="Nome do Time 2"
                className="w-full p-2 md:p-3 rounded-xl border-2 border-pink-100 outline-none focus:border-pink-500 font-bold text-center text-sm md:text-base transition-colors bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="flex items-center justify-between bg-white border-2 border-purple-100 rounded-xl p-2 md:p-3">
                <span className="font-bold text-gray-900 text-sm md:text-base">Rounds</span>
                <div className="flex items-center gap-2 md:gap-3">
                  <button onClick={() => setTotalRounds(p => Math.max(1, p - 1))}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-base md:text-lg text-gray-600 transition-all active:scale-95">−</button>
                  <input type="number" value={totalRounds}
                    onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 1 && v <= 99) setTotalRounds(v); }}
                    className="w-10 text-center text-base md:text-lg font-black text-gray-900 bg-gray-100 rounded-lg p-1 outline-none focus:ring-2 focus:ring-purple-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={() => setTotalRounds(p => Math.min(99, p + 1))}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-base md:text-lg text-gray-600 transition-all active:scale-95">+</button>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm">
              <h2 className="text-sm md:text-base text-purple-300 font-bold mb-2">Escolha o Tema:</h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(DADOS_TEMAS).map(tema => (
                  <button key={tema} onClick={() => iniciarJogo(tema)}
                    className="w-full bg-indigo-600 text-white py-2 md:py-3 rounded-xl font-black text-xs md:text-sm hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all shadow-md">
                    {tema}
                  </button>
                ))}
              </div>
            </div>

            {mensagemSorteio && <div className="text-xs md:text-sm font-bold text-green-400 animate-pulse">{mensagemSorteio}</div>}
          </div>
        )}

        {/* CONTAGEM */}
        {tela === 'contagem' && (
          <ContagemRegressiva
            timeDaVez={timeDaVez} time1Nome={time1Nome} time2Nome={time2Nome}
            contador={contador} setContador={setContador}
            onFim={() => { setContador(5); setTela('jogo'); }}
          />
        )}

        {/* TROCA DE VEZ */}
        {tela === 'troca' && (
          <TelaDeTroca
            timeDaVez={timeDaVez} time1Nome={time1Nome} time2Nome={time2Nome}
            onPronto={() => setTela('jogo')}
          />
        )}

        {/* JOGO */}
        {tela === 'jogo' && (
          <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
            <div className="pt-3 pb-2 px-3 md:px-6 border-b border-purple-700/30 shrink-0 z-10 w-full bg-[#3d3868]">
              <div className="w-full max-w-3xl mx-auto">
                <div className="text-center mb-2">
                  <span className="text-[10px] md:text-xs font-black text-purple-300 uppercase tracking-widest bg-purple-900/40 px-2 py-1 rounded-full">
                    Round {roundAtual} de {totalRounds}
                  </span>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Vez de:</span>
                    <span className={`text-lg md:text-xl font-black ${timeDaVez === 'time1' ? 'text-indigo-400' : 'text-pink-400'}`}>
                      {timeDaVez === 'time1' ? time1Nome : time2Nome}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-[#2e2a4a] border border-purple-700/40 rounded-xl p-2 max-w-lg mx-auto">
                  <div className={`flex flex-col items-center flex-1 min-w-0 transition-opacity duration-300 ${timeDaVez === 'time1' ? 'opacity-100' : 'opacity-40'}`}>
                    <span className="text-[10px] md:text-xs font-bold text-indigo-400 truncate w-full text-center px-1">{time1Nome}</span>
                    <span className="text-xl md:text-2xl font-black text-white">{time1Pontos}</span>
                  </div>
                  <div className="h-6 w-[2px] bg-purple-700/50 mx-2 shrink-0"></div>
                  <div className={`flex flex-col items-center flex-1 min-w-0 transition-opacity duration-300 ${timeDaVez === 'time2' ? 'opacity-100' : 'opacity-40'}`}>
                    <span className="text-[10px] md:text-xs font-bold text-pink-400 truncate w-full text-center px-1">{time2Nome}</span>
                    <span className="text-xl md:text-2xl font-black text-white">{time2Pontos}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col p-3 md:p-4 gap-3 items-center justify-between w-full max-w-2xl mx-auto min-h-0 overflow-hidden">
              
              <h2 className="text-lg md:text-2xl font-black text-white text-center uppercase tracking-tight shrink-0">
                {extrairNome(imagensEmJogo[indiceImagem])}
              </h2>
              
              <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                <img src={imagensEmJogo[indiceImagem]} alt="Desenho"
                  className="max-w-full max-h-full object-contain"
                  onError={e => { e.target.src = "https://via.placeholder.com/600?text=Imagem+Nao+Encontrada"; }}
                />
              </div>

              <div className="w-full max-w-[320px] flex flex-col space-y-2 shrink-0">
                <button onClick={handleAcertou}
                  className={`w-full text-white py-3 md:py-4 rounded-2xl font-black text-xl md:text-2xl shadow-lg active:scale-95 transition-all ${timeDaVez === 'time1' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-pink-500 hover:bg-pink-600'}`}>
                  ACERTOU! ✅
                </button>
                <div className="flex flex-row gap-2">
                  <button onClick={handlePularImagem}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-2 md:py-3 rounded-xl font-bold active:scale-95 transition-all text-xs md:text-sm shadow-sm">
                    PULAR
                  </button>
                  <button onClick={handlePassarVez}
                    className="flex-1 bg-gray-800 text-white py-2 md:py-3 rounded-xl font-bold active:scale-95 transition-all text-xs md:text-sm shadow-md">
                    PASSAR
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FIM */}
        {tela === 'fim' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center overflow-hidden w-full mx-auto max-w-md gap-3">
            <h1 className="text-5xl md:text-6xl">🏆</h1>
            <h2 className="text-2xl md:text-3xl font-black text-purple-100">Fim de Jogo!</h2>
            
            <div className="w-full bg-purple-900/40 p-4 md:p-6 rounded-3xl space-y-3 border border-purple-700/30 shadow-inner">
              <div className="flex justify-between items-center border-b-2 border-purple-700/50 pb-3 gap-2">
                <span className="font-bold text-indigo-400 text-lg md:text-xl truncate flex-1 text-left">{time1Nome}</span>
                <span className="text-3xl md:text-4xl font-black text-white shrink-0">{time1Pontos}</span>
              </div>
              <div className="flex justify-between items-center pt-1 gap-2">
                <span className="font-bold text-pink-400 text-lg md:text-xl truncate flex-1 text-left">{time2Nome}</span>
                <span className="text-3xl md:text-4xl font-black text-white shrink-0">{time2Pontos}</span>
              </div>
            </div>

            <div className="text-lg md:text-xl font-black bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100">
              {time1Pontos > time2Pontos && <span className="text-indigo-600">{time1Nome} Venceu! 🎉</span>}
              {time2Pontos > time1Pontos && <span className="text-pink-600">{time2Nome} Venceu! 🎉</span>}
              {time1Pontos === time2Pontos && <span className="text-purple-600">Deu Empate! 🤝</span>}
            </div>

            <button onClick={reiniciarMenu}
              className="w-full bg-white text-gray-900 py-3 md:py-4 mt-2 rounded-2xl font-black text-lg md:text-xl active:scale-95 transition-all shadow-md">
              JOGAR NOVAMENTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}