const DL = "https://github.com/allysonsilva98ap/sexta-feira/releases/latest/download/Instalar-Sexta-feira.exe";
document.querySelectorAll(".dl").forEach(a => { a.href = DL; a.setAttribute("rel", "noopener"); });
document.getElementById("yr").textContent = new Date().getFullYear();

// nav + brilho que segue o mouse
const nav = document.getElementById("nav"), glow = document.getElementById("glow");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), {passive: true});
addEventListener("pointermove", e => { glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; }, {passive: true});

// entrada ao rolar
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
  {threshold: .14, rootMargin: "0px 0px -40px 0px"});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// luz e inclinação 3D nos cartões
document.querySelectorAll(".tilt").forEach(el => {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%");
    if (matchMedia("(hover:hover)").matches) el.style.transform = `perspective(1100px) rotateX(${(.5 - y) * 4}deg) rotateY(${(x - .5) * 5}deg)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});

// ----------------------------------------------------------- a ilha viva no topo da "área de trabalho"
const stage = document.getElementById("stage"), island = document.getElementById("island");
const said = document.getElementById("said"), saidTxt = document.getElementById("saidTxt");
const IMG = n => `img/${n}.webp`;
const cache = {};
["ilha-parada", "ilha-ouvindo", "ilha-pensando", "ilha-falando", "cartao-clima", "cartao-noticias", "cartao-timer", "cartao-musica"]
  .forEach(n => { const i = new Image(); i.src = IMG(n); cache[n] = i; });
let cur = island.querySelector("img");
function sizeOf(img) {                       // mesma proporção de uma tela 1920 px (as imagens são 2x)
  const k = stage.clientWidth / 1500;
  img.style.width = (img.naturalWidth * k) + "px";
}
function show(name) {
  const n = document.createElement("img");
  n.src = IMG(name); n.alt = "";
  const go = () => { sizeOf(n); island.appendChild(n); requestAnimationFrame(() => requestAnimationFrame(() => n.classList.add("on")));
    const old = cur; cur = n; old.classList.remove("on"); setTimeout(() => old.remove(), 700); };
  n.complete ? go() : (n.onload = go);
}
function type(text, ms = 38) {
  return new Promise(res => { said.classList.add("on"); saidTxt.textContent = ""; let i = 0;
    const t = setInterval(() => { saidTxt.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(t); res(); } }, ms); });
}
const wait = ms => new Promise(r => setTimeout(r, ms));
async function scene(phrase, answer, hold = 3400) {
  show("ilha-ouvindo"); await wait(350); await type("“sexta-feira, " + phrase + "”"); await wait(450);
  show("ilha-pensando"); await wait(900); said.classList.remove("on");
  show(answer); await wait(hold);
}
async function loop() {
  sizeOf(cur);
  while (true) {
    show("ilha-parada"); await wait(2200);
    await scene("qual a previsão do tempo pra hoje?", "cartao-clima");
    await scene("manda pro Gustavo que já entrei no jogo", "ilha-falando");
    await scene("quais as notícias de hoje?", "cartao-noticias");
    await scene("timer de 10 minutos pro bolo", "cartao-timer", 2800);
    await scene("toca AC/DC", "cartao-musica", 2800);
  }
}
if (cur.complete) loop(); else cur.onload = loop;
addEventListener("resize", () => island.querySelectorAll("img").forEach(sizeOf));

// ----------------------------------------------------------- Central: abas com troca automática
const caps = {
  inicio: "Seu dia num olhar: conversa, música tocando, tarefas, lembretes e hábitos.",
  memoria: "A memória em forma de cérebro: tudo que ela aprendeu sobre você, ligado por assunto.",
  personalizar: "Deixe o mascote do seu jeito: olhos, cor, acessórios e expressões.",
  cerebro: "Escolha o cérebro: automático (o mais rápido e o mais inteligente juntos), sua IA favorita ou 100% no seu PC.",
  meupc: "Veja o que está pesando e deixe o PC no desempenho máximo com um clique.",
  tarefas: "Tarefas com horário: ela avisa antes e marca as atrasadas.",
  rotinas: "Um comando, várias ações: “modo jogo” abre o Discord, o jogo e baixa o volume.",
  habitos: "Hábitos com sequência de dias: beber água, treinar, ler…",
};
const tabs = [...document.querySelectorAll("#tabs button")], shots = [...document.querySelectorAll("#shots img")];
let ti = 0, auto = null;
function tab(i) {
  ti = i; const id = tabs[i].dataset.i;
  tabs.forEach(b => b.classList.toggle("on", b.dataset.i === id));
  shots.forEach(s => s.classList.toggle("on", s.dataset.i === id));
  document.getElementById("cap").textContent = caps[id];
}
function startAuto() { clearInterval(auto); auto = setInterval(() => tab((ti + 1) % tabs.length), 4200); }
tabs.forEach((b, i) => b.addEventListener("click", () => { tab(i); startAuto(); }));
new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? startAuto() : clearInterval(auto)), {threshold: .3})
  .observe(document.getElementById("central"));
