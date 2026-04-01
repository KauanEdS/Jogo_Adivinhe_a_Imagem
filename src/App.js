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
    <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-[#3d3868] gap-8 p-6 text-center">
      <div className="text-7xl animate-bounce">🔄</div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-purple-300 text-lg font-bold uppercase tracking-widest">Troca de vez!</p>
        <p className="text-purple-400 text-base">Passem o celular para o outro time</p>
        <span className="text-4xl md:text-5xl font-black mt-4" style={{ color: corTime }}>
          {nomeTime}
        </span>
        <p className="text-purple-300 text-2xl font-bold">preparem-se! 🎯</p>
      </div>
      <button
        onClick={onPronto}
        className={`w-full max-w-xs text-white py-6 rounded-3xl font-black text-2xl shadow-xl active:scale-95 hover:-translate-y-1 transition-all ${bgBotao}`}
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
    <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-[#3d3868] gap-8">
      <p className="text-purple-300 text-lg font-bold uppercase tracking-widest">Preparar...</p>
      <div className="flex flex-col items-center gap-2">
        <span className="text-purple-400 text-xl font-bold">Vez de:</span>
        <span className="text-4xl md:text-5xl font-black" style={{ color: corTime }}>{nomeTime}</span>
      </div>
      <div className="relative flex items-center justify-center">
        <svg width="160" height="160" className="-rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#2e2a4a" strokeWidth="10" />
          <circle
            cx="80" cy="80" r="70" fill="none"
            stroke={corTime} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - contador / 5)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute text-6xl font-black text-white">{contador}</span>
      </div>
      <p className="text-purple-400 text-base font-medium">O jogo começa em instantes!</p>
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

  const handleAcertou = () => {
    avancarTurno(true);
  };
  const handlePularImagem = () => avancarTurno(false, false);
  const handlePassarVez   = () => avancarTurno(false, true);

  return (
    // RAIZ MANTIDA ORIGINAL (#2e2a4a) com padding (md:p-8) adicionado para desgrudar das bordas no PC
    <div className="w-full h-[100dvh] bg-[#2e2a4a] font-sans text-gray-800 flex flex-col overflow-hidden md:p-8 lg:p-12">

      <Confete ativo={mostrarConfete} onFim={() => setMostrarConfete(false)} />

      {/* CONTAINER MANTIDO ORIGINAL (#3d3868) com cantos arredondados (md:rounded-[2.5rem]) no PC */}
      <div className="w-full h-full flex flex-col overflow-hidden mx-auto max-w-[1800px] bg-[#3d3868] shadow-2xl shadow-purple-950 md:rounded-[2.5rem]">

        {/* --- DAQUI PARA BAIXO SUAS CORES ESTÃO INTACTAS --- */}
        
        {/* MENU */}
        {tela === 'menu' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center space-y-8 overflow-y-auto w-full mx-auto max-w-5xl">
            <div>
              <div className="text-7xl md:text-8xl mb-4">🎮</div>
              <h1 className="text-4xl md:text-5xl font-black text-indigo-600 tracking-tight">Quem sou eu?</h1>
            </div>

            <p className="text-gray-900 font-bold mb-2 text-lg">Defina os times e escolha o tema para começar</p>

            <div className="w-full max-w-md space-y-4 p-6 rounded-3xl border border-gray-100 shadow-sm bg-gray-50/50">
              <input type="text" value={time1Nome} onChange={e => setTime1Nome(e.target.value)}
                placeholder="Nome do Time 1"
                className="w-full p-4 md:p-5 rounded-2xl border-2 border-indigo-100 outline-none focus:border-indigo-500 font-bold text-center text-lg transition-colors bg-white text-gray-900 placeholder-gray-400"
              />
              <input type="text" value={time2Nome} onChange={e => setTime2Nome(e.target.value)}
                placeholder="Nome do Time 2"
                className="w-full p-4 md:p-5 rounded-2xl border-2 border-pink-100 outline-none focus:border-pink-500 font-bold text-center text-lg transition-colors bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="flex items-center justify-between bg-white border-2 border-purple-100 rounded-2xl p-4 md:p-5">
                <span className="font-bold text-gray-900 text-lg">Rounds</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTotalRounds(p => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-black text-xl text-gray-600 transition-all active:scale-95">−</button>
                  <input type="number" value={totalRounds}
                    onChange={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 1 && v <= 99) setTotalRounds(v); }}
                    className="w-14 text-center text-2xl font-black text-gray-900 bg-gray-100 rounded-xl p-1 outline-none focus:ring-2 focus:ring-purple-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={() => setTotalRounds(p => Math.min(99, p + 1))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-black text-xl text-gray-600 transition-all active:scale-95">+</button>
                </div>
              </div>
            </div>

            <div className="w-full max-w-3xl">
              <h2 className="text-xl md:text-2xl text-gray-900 font-bold mb-6">Escolha o Tema:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(DADOS_TEMAS).map(tema => (
                  <button key={tema} onClick={() => iniciarJogo(tema)}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all shadow-lg">
                    {tema}
                  </button>
                ))}
              </div>
            </div>

            {mensagemSorteio && <div className="text-lg font-bold text-green-600 animate-pulse">{mensagemSorteio}</div>}
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
            <div className="pt-6 pb-4 px-4 md:px-8 border-b border-purple-700/30 shrink-0 sticky top-0 z-10 w-full bg-[#3d3868]">
              <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-4">
                  <span className="text-sm md:text-base font-black text-purple-300 uppercase tracking-widest bg-purple-900/40 px-4 py-2 rounded-full">
                    Round {roundAtual} de {totalRounds}
                  </span>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="text-sm font-bold text-purple-300 uppercase tracking-widest">Vez de:</span>
                    <span className={`text-2xl md:text-3xl font-black ${timeDaVez === 'time1' ? 'text-indigo-400' : 'text-pink-400'}`}>
                      {timeDaVez === 'time1' ? time1Nome : time2Nome}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-[#2e2a4a] border border-purple-700/40 rounded-2xl p-3 md:p-4 max-w-2xl mx-auto">
                  <div className={`flex flex-col items-center flex-1 min-w-0 transition-opacity duration-300 ${timeDaVez === 'time1' ? 'opacity-100' : 'opacity-40'}`}>
                    <span className="text-sm md:text-base font-bold text-indigo-400 truncate w-full text-center px-2">{time1Nome}</span>
                    <span className="text-3xl md:text-4xl font-black text-white">{time1Pontos}</span>
                  </div>
                  <div className="h-10 w-[2px] bg-purple-700/50 mx-4 shrink-0"></div>
                  <div className={`flex flex-col items-center flex-1 min-w-0 transition-opacity duration-300 ${timeDaVez === 'time2' ? 'opacity-100' : 'opacity-40'}`}>
                    <span className="text-sm md:text-base font-bold text-pink-400 truncate w-full text-center px-2">{time2Nome}</span>
                    <span className="text-3xl md:text-4xl font-black text-white">{time2Pontos}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col p-4 md:p-8 gap-6 md:gap-8 items-center justify-center w-full max-w-4xl mx-auto">
              <div className="w-full flex flex-col items-center justify-center shrink-0">
                <h2 className="text-2xl md:text-4xl font-black text-white text-center uppercase tracking-tight mb-4 md:mb-6">
                  {extrairNome(imagensEmJogo[indiceImagem])}
                </h2>
                <div className="w-[350px] max-w-full h-[350px] shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={imagensEmJogo[indiceImagem]} alt="Desenho"
                    className="max-w-full max-h-full object-contain"
                    onError={e => { e.target.src = "https://via.placeholder.com/600?text=Imagem+Nao+Encontrada"; }}
                  />
                </div>
              </div>

              <div className="w-full max-w-[400px] flex flex-col space-y-4 shrink-0 pb-6">
                <button onClick={handleAcertou}
                  className={`w-full text-white py-6 md:py-8 rounded-3xl font-black text-3xl md:text-4xl shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all ${timeDaVez === 'time1' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-pink-500 hover:bg-pink-600'}`}>
                  ACERTOU! ✅
                </button>
                <div className="flex flex-row gap-3 md:gap-4 pt-2">
                  <button onClick={handlePularImagem}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 md:py-5 rounded-2xl font-bold active:scale-95 hover:bg-gray-50 transition-all text-sm md:text-base shadow-sm">
                    PULAR IMAGEM
                  </button>
                  <button onClick={handlePassarVez}
                    className="flex-1 bg-gray-800 text-white py-4 md:py-5 rounded-2xl font-bold active:scale-95 hover:bg-gray-900 transition-all text-sm md:text-base shadow-lg">
                    PASSAR A VEZ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FIM */}
        {tela === 'fim' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center overflow-y-auto w-full mx-auto max-w-5xl">
            <h1 className="text-7xl md:text-8xl mb-6">🏆</h1>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-10">Fim de Jogo!</h2>
            <div className="w-full max-w-xl bg-gray-50 p-8 md:p-10 rounded-[3rem] space-y-6 mb-10 border border-gray-100">
              <div className="flex justify-between items-center border-b-2 border-gray-200 pb-6 gap-4">
                <span className="font-bold text-indigo-600 text-2xl md:text-3xl truncate flex-1 text-left">{time1Nome}</span>
                <span className="text-5xl md:text-6xl font-black text-gray-800 shrink-0">{time1Pontos}</span>
              </div>
              <div className="flex justify-between items-center pt-2 gap-4">
                <span className="font-bold text-pink-600 text-2xl md:text-3xl truncate flex-1 text-left">{time2Nome}</span>
                <span className="text-5xl md:text-6xl font-black text-gray-800 shrink-0">{time2Pontos}</span>
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-black mb-12 bg-white px-8 py-4 rounded-full shadow-sm border border-gray-200">
              {time1Pontos > time2Pontos && <span className="text-indigo-600">{time1Nome} Venceu! 🎉</span>}
              {time2Pontos > time1Pontos && <span className="text-pink-600">{time2Nome} Venceu! 🎉</span>}
              {time1Pontos === time2Pontos && <span className="text-gray-600">Deu Empate! 🤝</span>}
            </div>
            <button onClick={reiniciarMenu}
              className="w-full max-w-md bg-gray-900 text-white py-6 rounded-2xl font-black text-2xl hover:bg-gray-800 hover:-translate-y-1 active:scale-95 transition-all shadow-xl">
              JOGAR NOVAMENTE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}