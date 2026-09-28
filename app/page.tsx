"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, BrainCircuit, CheckCircle2, ChevronDown, Database, Dna, Eye, Menu, Send, Server, Sparkles, Users, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import HeroCoin from "@/components/HeroCoin";

const sceneLabels = ["AI Accelerator", "소개", "AI 인프라", "NVIDIA B200", "NVIDIA RTX Pro 6000", "NVIDIA GB200 NVL72 · 도입 예정", "이용방법", "이용요금", "FAQ", "문의"];
const useCases = [
  { icon: BrainCircuit, title: "AI / LLM", text: "대규모 언어모델 학습과 추론" }, { icon: Eye, title: "Computer Vision", text: "고해상도 영상 분석과 모델 개발" },
  { icon: Dna, title: "Bio AI", text: "생명과학 데이터 기반 AI 연구" }, { icon: Database, title: "Data Science", text: "대규모 데이터 분석과 실험" },
  { icon: Sparkles, title: "Deep Learning", text: "복잡한 신경망의 빠른 학습" }, { icon: Server, title: "Research Computing", text: "고성능 병렬 연산과 시뮬레이션" },
];
const faqs = [
  ["AI 가속기는 누가 사용할 수 있나요?", "한동대학교 소속 연구자와 학생을 중심으로 운영되며, 산학협력 및 공동연구 과제도 협의를 통해 이용할 수 있습니다."],
  ["GPU는 어떻게 신청하나요?", "이용 목적, 예상 기간, 필요한 GPU 규모를 작성해 신청하면 AI 혁신센터에서 검토 후 자원을 배정합니다."],
  ["B200과 RTX PRO 6000의 차이는 무엇인가요?", "B200은 대규모 AI 학습과 HPC에, RTX PRO 6000은 비전·생성형 AI·연구 워크로드에 적합합니다."],
  ["사용 기간은 어떻게 결정되나요?", "과제 규모, 자원 사용량, 전체 운영 현황을 함께 검토해 승인 단계에서 이용 기간을 확정합니다."],
  ["스토리지는 제공되나요?", "연구용 고속 스토리지가 제공됩니다. 용량과 보관 기간은 신청 내용에 따라 협의합니다."],
  ["문의는 어디로 하면 되나요?", "페이지 하단 문의 양식을 이용하면 AI 혁신센터 담당자에게 전달됩니다."],
];

function ComputeGraphic({ variant = "b200" }: { variant?: "b200" | "rtx" }) {
  const isB200 = variant === "b200";
  return <figure className={`compute-visual ${variant}`}><div className="equipment-halo" aria-hidden="true" /><Image className="equipment-image" src={isB200 ? "/b200.png" : "/pro6000.png"} width={1200} height={1200} sizes="(max-width: 720px) 90vw, 42vw" alt={isB200 ? "NVIDIA B200 GPU 시스템" : "NVIDIA RTX PRO 6000 그래픽 카드"} /><figcaption><span>{isB200 ? "NVIDIA B200" : "RTX PRO 6000"}</span><small>ACTUAL EQUIPMENT</small></figcaption></figure>;
}

function InfrastructureDiagram() {
  return <div className="infrastructure-diagram" aria-label="연구자가 AIPub를 통해 GPU 연산 자원과 연구용 저장공간을 이용하는 구조">
    <svg className="infra-connectors infra-connectors-desktop" viewBox="0 0 720 430" preserveAspectRatio="none" aria-hidden="true">
      <defs><filter id="infra-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <path className="connector-base connector-user" d="M360 76 V112"/><path pathLength="1" className="connector-draw connector-user" d="M360 76 V112"/>
      <path className="connector-base connector-branches" d="M360 230 V245 H215 V260 M360 245 H505 V260"/><path pathLength="1" className="connector-draw connector-branches" d="M360 230 V245 H215 V260 M360 245 H505 V260"/>
      <path className="connector-flow connector-user" d="M360 76 V112"/><path className="connector-flow connector-branches" d="M360 230 V245 H215 V260 M360 245 H505 V260"/>
      {[[360,76],[360,112],[360,230],[360,245],[215,260],[505,260]].map(([cx,cy], index)=><circle key={index} className="connector-dot" cx={cx} cy={cy} r="3.5"/>)}
    </svg>
    <svg className="infra-connectors infra-connectors-mobile" viewBox="0 0 100 620" preserveAspectRatio="none" aria-hidden="true">
      <path className="connector-base connector-user" d="M50 86 V132"/><path pathLength="1" className="connector-draw connector-user" d="M50 86 V132"/>
      <path className="connector-base connector-branches" d="M50 270 V318 M50 444 V492"/><path pathLength="1" className="connector-draw connector-branches" d="M50 270 V318 M50 444 V492"/>
      <path className="connector-flow connector-user" d="M50 86 V132"/><path className="connector-flow connector-branches" d="M50 270 V318 M50 444 V492"/>
    </svg>
    <article className="infra-node user-node"><Users aria-hidden="true"/><div><h3>연구자 / 사용자</h3><p>AI 가속기 이용 및 연구 수행</p></div></article>
    <article className="infra-node aipub-node"><span>AI PLATFORM</span><h3>AI 가속기 운영 플랫폼 · AIPub</h3><p>자원 신청 · GPU 할당 · 워크로드 관리 · 사용 모니터링</p></article>
    <article className="infra-node resource-node gpu-node"><Image src="/images/gpu-compute.png" width={128} height={128} alt="GPU Compute 아이콘"/><div><h3>GPU Compute</h3><ul><li>NVIDIA B200</li><li>RTX PRO 6000</li><li>NVL72 <small>도입 예정</small></li></ul></div></article>
    <article className="infra-node resource-node storage-node"><Image src="/images/research-storage.png" width={128} height={128} alt="Research Storage 아이콘"/><div><h3>Research Storage</h3><ul><li>Shared Storage</li><li>Local NVMe SSD</li><li>High-Speed NAS Storage</li></ul></div></article>
  </div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false); const [sent, setSent] = useState(false); const [sending, setSending] = useState(false); const storyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const hashScenes: Record<string, number> = { "#about": 1, "#infrastructure": 2, "#b200": 3, "#rtx-pro-6000": 4, "#nvl72": 5, "#access": 6, "#pricing": 7, "#faq": 8, "#contact": 9 };
    const resetScroll = () => { const index = hashScenes[window.location.hash]; if (index !== undefined) goToStoryScene(index); else window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    resetScroll();
    const frame = requestAnimationFrame(resetScroll);
    const handlePageShow = () => resetScroll();
    window.addEventListener("pageshow", handlePageShow);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pageshow", handlePageShow); };
  }, []);
  useEffect(() => { const items = document.querySelectorAll<HTMLElement>("[data-reveal]"); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.15 }); items.forEach((item) => observer.observe(item)); return () => observer.disconnect(); }, []);
  useEffect(() => {
    const story = storyRef.current; if (!story) return;
    const scenes = Array.from(story.querySelectorAll<HTMLElement>(".story-scene")); const dots = Array.from(story.querySelectorAll<HTMLButtonElement>("[data-scene-dot]")); const sceneNav = story.querySelector<HTMLElement>(".story-nav");
    const desktop = window.matchMedia("(min-width: 901px)"); const reduced = window.matchMedia("(prefers-reduced-motion: reduce)"); let frame = 0; let snapTimer = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const smoothstep = (from: number, to: number, value: number) => { const t = clamp((value - from) / (to - from)); return t * t * (3 - 2 * t); };
    const render = () => {
      frame = 0;
      if (!desktop.matches || reduced.matches) { scenes.forEach((scene) => scene.removeAttribute("style")); sceneNav?.classList.remove("is-visible"); return; }
      const rect = story.getBoundingClientRect(); const range = Math.max(1, story.offsetHeight - window.innerHeight); const progress = clamp(-rect.top / range) * (scenes.length - 1); const current = Math.min(scenes.length - 1, Math.floor(progress)); const next = Math.min(scenes.length - 1, current + 1); const phase = progress - current;
      const active = Math.round(progress); sceneNav?.classList.toggle("is-visible", rect.top <= 0 && rect.bottom > 0 && active > 0); dots.forEach((dot) => { const index = Number(dot.dataset.sceneIndex); dot.classList.toggle("is-active", index === active); dot.setAttribute("aria-current", index === active ? "step" : "false"); });
      scenes.forEach((scene, index) => {
        scene.classList.toggle("is-scene-active", index === active);
        let opacity = 0; let scale = 1.02; let y = 24; let blur = 4; let zIndex = 1;
        if (index === current) { const outgoing = smoothstep(0, .45, phase); opacity = 1 - outgoing; scale = 1 - .02 * outgoing; y = -20 * outgoing; blur = 4 * outgoing; zIndex = 11; }
        if (index === next) { const incoming = current === next ? 1 : smoothstep(.15, .7, phase); opacity = Math.max(opacity, incoming); scale = 1.02 - .02 * incoming; y = 24 * (1 - incoming); blur = 4 * (1 - incoming); zIndex = 12; }
        scene.style.opacity = String(opacity); scene.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`; scene.style.filter = `blur(${blur}px)`; scene.style.visibility = opacity > .01 ? "visible" : "hidden"; scene.style.pointerEvents = opacity > .6 ? "auto" : "none"; scene.style.zIndex = String(zIndex);
      });
    };
    const snapToClosest = () => {
      if (!desktop.matches || reduced.matches) return;
      const rect = story.getBoundingClientRect(); if (rect.top > 0 || rect.bottom < window.innerHeight) return;
      const range = Math.max(1, story.offsetHeight - window.innerHeight); const progress = clamp(-rect.top / range) * (scenes.length - 1); const closest = Math.round(progress);
      const target = story.offsetTop + (closest / (scenes.length - 1)) * range;
      if (Math.abs(window.scrollY - target) > 2) window.scrollTo({ top: target, behavior: "smooth" });
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(render); window.clearTimeout(snapTimer); snapTimer = window.setTimeout(snapToClosest, 140); };
    render(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); desktop.addEventListener("change", update); reduced.addEventListener("change", update);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(snapTimer); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); desktop.removeEventListener("change", update); reduced.removeEventListener("change", update); scenes.forEach((scene) => scene.removeAttribute("style")); };
  }, []);
  function goToStoryScene(index: number) { const story = storyRef.current; if (!story) return; const range = Math.max(1, story.offsetHeight - window.innerHeight); window.scrollTo({ top: story.offsetTop + (index / (sceneLabels.length - 1)) * range, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
  async function submitContact(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSending(true); const response = await fetch("/api/contact", { method: "POST", body: new FormData(event.currentTarget) }); setSending(false); if (response.ok) setSent(true); else alert("문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요."); }
  return <main>
    <header className="site-header"><a href="#top" className="brand" aria-label="한동대학교 AI 혁신센터 홈" onClick={(event)=>{event.preventDefault();goToStoryScene(0)}}><Image src="/HGUlogo.png" width={145} height={145} alt="한동대학교 AI 혁신센터" priority /><span><b>AI 혁신센터</b><small>AI ACCELERATOR</small></span></a><nav className={menuOpen ? "open" : ""} aria-label="주요 메뉴"><a href="#about" onClick={(event)=>{event.preventDefault();setMenuOpen(false);goToStoryScene(1);history.replaceState(null,"","#about")}}>소개</a><details className="gpu-nav"><summary><a href="#infrastructure" onClick={(event)=>{event.preventDefault();event.stopPropagation();event.currentTarget.closest("details")?.removeAttribute("open");setMenuOpen(false);goToStoryScene(2);history.replaceState(null,"","#infrastructure")}}>AI 인프라</a><ChevronDown size={14} /></summary><div className="gpu-dropdown">{[["NVIDIA B200","#b200",3],["NVIDIA RTX Pro 6000","#rtx-pro-6000",4],["NVIDIA GB200 NVL72","#nvl72",5]].map(([label,href,index])=><a key={href} href={String(href)} onClick={(event)=>{event.preventDefault();event.currentTarget.closest("details")?.removeAttribute("open");setMenuOpen(false);goToStoryScene(Number(index));history.replaceState(null,"",String(href))}}><span>{label}</span>{Number(index)===5&&<small>도입 예정</small>}</a>)}</div></details>{[["이용방법","#access",6],["이용요금","#pricing",7],["FAQ","#faq",8],["문의","#contact",9]].map(([label, href, index]) => <a key={href} href={String(href)} onClick={(event)=>{event.preventDefault();setMenuOpen(false);goToStoryScene(Number(index));history.replaceState(null,"",String(href))}}>{label}</a>)}</nav><a className="header-cta" href="https://docs.google.com/forms/u/0/d/e/1FAIpQLSd4ZC7ZoVUtMf0POaA1EQFocA3tN7k-IA84JTcl7ii2wg8X_A/closedform" target="_blank" rel="noreferrer">사용 신청 <ArrowRight size={16} /></a><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴 열기">{menuOpen ? <X /> : <Menu />}</button></header>
    <div id="top" className="scroll-story" ref={storyRef}>
      <nav className="story-nav" aria-label="페이지 이동">{sceneLabels.slice(1).map((label, offset) => { const index = offset + 1; return <button type="button" key={label} data-scene-dot data-scene-index={index} onClick={() => goToStoryScene(index)} aria-label={`${label} 페이지로 이동`}><span>{label}</span><i /></button>; })}</nav>
      <div className="story-stage">
        <section className="story-scene hero"><div className="hero-grid" aria-hidden="true" /><div className="hero-copy"><p className="eyebrow">HANDONG GLOBAL UNIVERSITY <span /> AI INNOVATION CENTER</p><h1>한동대학교<br /><em>AI Accelerator</em></h1><p className="hero-lead">연구와 교육을 위한<br />고성능 AI Computing Infrastructure</p><p className="hero-desc">한동대학교 AI 혁신센터가 운영하는 GPU 기반 AI 연구 인프라를 소개합니다.</p><div className="hero-actions"><a className="button primary" href="#infrastructure" onClick={(event)=>{event.preventDefault();goToStoryScene(2)}}>인프라 살펴보기 <ArrowDown size={17} /></a><a className="button secondary" href="#access" onClick={(event)=>{event.preventDefault();goToStoryScene(6)}}>이용 방법</a></div></div><HeroCoin /><div className="scroll-cue"><span>SCROLL TO EXPLORE</span><i /></div></section>
        <section id="about" className="story-scene usecase-section intro-section"><div className="story-index">01 / 09</div><div className="section-heading"><p className="section-kicker">ABOUT THE INFRASTRUCTURE</p><h2>아이디어가 연구가 되는 곳</h2></div><div className="usecase-grid">{useCases.map(({icon:Icon,title,text})=><article key={title}><Icon /><h3>{title}</h3><p>{text}</p><span>SUPPORTED AREA</span></article>)}</div><p className="intro-statement">본 AI 인프라는 한동대학교 및 지역 내/외 협력 기관의 AI 연구/산학/교육/행정을 지원하기 위해 구축·운영됩니다.</p></section>
        <section id="infrastructure" className="story-scene layers-section" data-reveal><div className="story-index">02 / 09</div><div className="layer-layout"><div className="infrastructure-copy"><div className="section-heading light"><p className="section-kicker">AI INFRASTRUCTURE</p><h2><span>연산부터 데이터까지,</span><span>하나로 연결된 AI 인프라</span></h2></div><p className="infrastructure-summary"><span>AI 가속기 운영 플랫폼을 중심으로</span><span>고성능 GPU 연산 자원과 연구용 저장공간이</span><span>통합된 환경으로 제공됩니다.</span></p></div><InfrastructureDiagram /></div></section>
        <section id="b200" className="story-scene compute-section"><div className="story-index">03 / 09</div><div className="compute-row"><div className="compute-copy"><span className="index">01 / PRIMARY COMPUTE</span><h3>NVIDIA B200</h3><p>대규모 AI 학습과 고성능 연산을 위한 핵심 GPU 환경입니다.</p><ul><li><b>8 GPUs</b><span>고밀도 병렬 연산</span></li><li><b>Large-scale AI Training</b><span>대규모 모델 학습</span></li><li><b>HPC · LLM · Deep Learning</b><span>연구 워크로드 최적화</span></li></ul></div><ComputeGraphic /></div></section>
        <section id="rtx-pro-6000" className="story-scene compute-section rtx-scene"><div className="story-index">04 / 09</div><div className="compute-row reverse"><div className="compute-copy"><span className="index">02 / RESEARCH COMPUTE</span><h3>RTX PRO 6000</h3><p>비전, 생성형 AI, 실험 중심 연구를 유연하게 지원합니다.</p><ul><li><b>16 GPUs</b><span>확장 가능한 연구 자원</span></li><li><b>96GB GPU Memory</b><span>대용량 모델과 데이터셋</span></li><li><b>AI · Vision · Research</b><span>다양한 연구 환경</span></li></ul></div><ComputeGraphic variant="rtx" /></div></section>
        <section id="nvl72" className="story-scene nvl-section"><div className="story-index">05 / 09</div><div className="nvl-copy"><span className="index">03 / NEXT COMPUTE</span><h3>NVIDIA<br />GB200 NVL72</h3><p>대규모 생성형 AI와 차세대 모델 연구를 위한 랙 스케일 GPU 시스템입니다.</p><ul className="nvl-specs"><li><b>72 Blackwell GPUs</b><span>하나의 NVLink 도메인</span></li><li><b>36 Grace CPUs</b><span>2,592 Arm 코어</span></li><li><b>13.4TB HBM3E</b><span>576TB/s 메모리 대역폭</span></li></ul></div><figure className="nvl-visual"><div className="equipment-halo nvl-halo" aria-hidden="true" /><Image src="/nvl72.webp" width={1200} height={900} sizes="(max-width: 900px) 90vw, 48vw" alt="NVIDIA GB200 NVL72 랙 시스템" /><figcaption><span>NVIDIA GB200 NVL72</span><small>도입 예정</small></figcaption></figure></section>
        <section id="access" className="story-scene access-section"><div className="section-heading"><p className="section-kicker">SIMPLE ACCESS</p><h2>신청부터 반환까지,<br />명확한 이용 절차</h2></div><div className="steps">{[["01","이용 신청","연구 목적과 필요한 자원을 작성합니다."],["02","사용 승인","센터에서 과제와 자원 규모를 검토합니다."],["03","사용료 결재","승인된 자원과 기간에 따라 사용료를 결재합니다."],["04","GPU 및 스토리지 할당","승인 일정에 맞춰 연산·저장 자원을 제공합니다."],["05","AI 연구 개발에 활용","할당된 환경에서 연구와 개발을 수행합니다."],["06","백업 및 반환","필요 데이터를 백업하고 자원을 반환합니다."]].map(([n,t,d],i)=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div>{i<5&&<ArrowRight aria-hidden="true" />}</article>)}</div></section>
        <section id="pricing" className="story-scene pricing-section"><div className="section-heading"><p className="section-kicker">SERVICE PRICING</p><h2>이용 요금 안내</h2><p className="pricing-lead">이용 요금은 운영 정책 확정 후 공개됩니다. 아래 항목별 기준에 따라 투명하게 안내할 예정입니다.</p></div><div className="pricing-grid">{[["NVIDIA B200","GPU 시간 기준","GPU 수 × 이용 시간"],["RTX PRO 6000","GPU 시간 기준","GPU 수 × 이용 시간"]].map(([title,unit,basis],i)=><article key={title}><div className="price-card-head"><span>{String(i+1).padStart(2,"0")}</span><b>요금 확정 예정</b></div><h3>{title}</h3><div className="price-placeholder"><strong>별도 공지</strong><small>/ {unit}</small></div><dl><div><dt>산정 기준</dt><dd>{basis}</dd></div><div><dt>할인 정책</dt><dd>교내·공동연구 기준 검토 중</dd></div></dl></article>)}</div><div className="refund-policy"><div><p className="section-kicker">CANCELLATION & REFUND</p><h3>취소 및 환불 규정</h3><p>예약 변경과 환불 기준은 최종 이용 요금과 함께 확정하여 공지합니다.</p></div><ul><li><span>01</span><div><b>사용 전 취소</b><p>예약 시작 전 취소 시점에 따른 환불 기준을 적용할 예정입니다.</p></div></li><li><span>02</span><div><b>사용 시작 후 취소</b><p>실제 사용된 자원과 시간을 기준으로 정산하는 방안을 검토 중입니다.</p></div></li><li><span>03</span><div><b>센터 사유 중단</b><p>장비 장애 등 센터 사유로 이용이 중단된 경우 보상 또는 환불 기준을 마련할 예정입니다.</p></div></li></ul><p className="policy-note">※ 본 내용은 정책 수립을 위한 안내 틀이며, 확정 전에는 효력이 없습니다.</p></div></section>
        <section id="faq" className="story-scene faq-section"><div className="section-heading"><p className="section-kicker">FREQUENTLY ASKED QUESTIONS</p><h2>자주 묻는 질문</h2></div><Accordion type="single" collapsible className="faq-list">{faqs.map(([q,a],i)=><AccordionItem value={`item-${i}`} key={q}><AccordionTrigger><span><b>{String(i+1).padStart(2,'0')}</b>{q}</span></AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}</Accordion></section>
        <section id="contact" className="story-scene contact-section"><div className="contact-intro"><p className="section-kicker">CONTACT THE CENTER</p><h2>무엇이든<br />물어보세요.</h2><p>AI 가속기 이용 또는 인프라 관련 문의가 있다면 AI 혁신센터로 문의해 주세요.</p><div className="contact-note"><CheckCircle2 /><span>접수된 문의는 담당자가 확인 후 안내드립니다.</span></div></div><div className="contact-card">{sent ? <div className="success"><CheckCircle2 /><h3>문의가 접수되었습니다.</h3><p>내용을 확인한 뒤 입력하신 이메일로 답변드리겠습니다.</p><button className="button secondary" onClick={()=>setSent(false)}>새 문의 작성</button></div> : <form onSubmit={submitContact}><div className="form-row"><label>이름/직위<input name="name" required placeholder="홍길동 / 수석 연구원" /></label><label>기관/부서<input name="organization" required placeholder="한동대 / 인공지능연구소" /></label></div><div className="form-row"><label>이메일<input name="email" type="email" required placeholder="name@example.com" /></label><label>전화번호<input name="phone" type="tel" required placeholder="010-1234-5678" /></label></div><label>문의 제목<input name="subject" required placeholder="문의 제목을 입력해 주세요" /></label><label>문의 내용<textarea name="message" required rows={5} placeholder="이용 목적과 필요한 자원을 알려주세요." /></label><button className="button primary submit" disabled={sending}>{sending ? "전송 중..." : "문의 보내기"}<Send size={17}/></button></form>}</div></section>
      </div>
    </div>
    <footer><div className="footer-top"><div className="footer-brand"><Image src="/text_logo.png" width={300} height={90} alt="한동대학교 AI 혁신센터" /></div><address>경상북도 포항시 북구 흥해읍 한동로 558</address></div><div className="footer-bottom"><span>© HANDONG GLOBAL UNIVERSITY. All rights reserved.</span><div className="footer-links"><a href="https://blog.naver.com/ai_handong" target="_blank" rel="noreferrer">AI 혁신센터 블로그</a><a href="https://hdax.notion.site/AI-1c8bbe3020b680dd95cfc7101f48da75" target="_blank" rel="noreferrer">AI 혁신센터 노션</a><a href="https://www.handong.edu" target="_blank" rel="noreferrer">한동대학교 홈페이지</a><a href="https://www.handong.edu/kor/etc/privacy/" target="_blank" rel="noreferrer">개인정보처리방침</a></div></div></footer>
  </main>;
}
