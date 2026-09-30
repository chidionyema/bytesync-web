"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { examples, resolve } from "@/lib/intents";

// Speak to the site. Web Speech API where the browser has it (Chrome, Edge,
// Safari), processed on-device when Chrome 139+ offers it, and a typed command
// line everywhere else. No audio ever reaches us: recognition is the browser's.

type SR = {
  lang: string; interimResults: boolean; continuous: boolean; processLocally?: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
  start(): void; stop(): void;
};
type SRCtor = new () => SR;

function getSR(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function speak(text: string) {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB"; u.rate = 1.02;
  speechSynthesis.speak(u);
}

function readPage() {
  const main = document.getElementById("main");
  const text = Array.from(main?.querySelectorAll("h1, h2, p") ?? []).map((n) => n.textContent?.trim() ?? "").filter(Boolean).slice(0, 12).join(". ");
  if (text) speak(text);
}

export function VoiceDock() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const rec = useRef<SR | null>(null);

  const canListen = useSyncExternalStore(() => () => {}, () => getSR() !== null, () => false);

  const act = useCallback((utterance: string) => {
    const intent = resolve(utterance);
    setHeard(utterance);
    switch (intent.kind) {
      case "go": setReply(intent.say); speak(intent.say); router.push(intent.href); setOpen(false); break;
      case "say": setReply(intent.say); speak(intent.say); break;
      case "read": setReply("Reading."); readPage(); break;
      case "stop": setReply(""); speechSynthesis?.cancel(); break;
      default: setReply(`Not sure what to do with "${utterance}". Try: ${examples.slice(0, 3).join(", ")}.`);
    }
  }, [router]);

  const listen = useCallback(async () => {
    const Ctor = getSR();
    if (!Ctor) return;
    if (listening) { rec.current?.stop(); return; }
    const r = new Ctor();
    r.lang = "en-GB"; r.interimResults = true; r.continuous = false;
    try {
      // On-device when the browser can (Chrome 139+): the audio never leaves the machine.
      const S = Ctor as unknown as { available?: (o: { langs: string[]; processLocally: boolean }) => Promise<string> };
      if (S.available && (await S.available({ langs: ["en-GB"], processLocally: true })) === "available") r.processLocally = true;
    } catch { /* fall through to the default recogniser */ }
    r.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      const t = last?.[0]?.transcript ?? "";
      setHeard(t);
      if ((last as unknown as { isFinal?: boolean }).isFinal) act(t);
    };
    r.onerror = (e) => { setListening(false); setReply(e.error === "not-allowed" ? "Microphone declined. Type instead." : `Listening failed (${e.error}). Type instead.`); };
    r.onend = () => setListening(false);
    rec.current = r;
    setHeard(""); setReply(""); setListening(true);
    r.start();
  }, [act, listening]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);

  return (
    <div className="dock fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none">
      <div className={`pointer-events-auto w-full max-w-xl rounded-2xl border border-line/80 bg-bg-2/85 shadow-2xl backdrop-blur-xl transition-all ${open ? "p-3" : "p-1.5"}`}>
        {!open ? (
          <div className="flex items-center gap-2">
            <button type="button" onClick={listen} disabled={!canListen}
              className="btn btn-accent disabled:opacity-40" aria-pressed={listening} aria-label="Speak to Bytesync">
              <MicIcon /> {listening ? "Listening…" : "Speak"}
            </button>
            <button type="button" onClick={() => setOpen(true)} className="btn flex-1 justify-between text-ink-2" aria-label="Open command line">
              <span>{heard || reply || "Ask the site anything… “go to research”, “what is Bytesync”"}</span>
              <kbd className="hidden font-mono text-xs text-ink-3 sm:inline">⌘K</kbd>
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); act(input.current?.value ?? ""); if (input.current) input.current.value = ""; }} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button type="button" onClick={listen} disabled={!canListen} className="btn btn-accent disabled:opacity-40" aria-pressed={listening} aria-label="Speak">
                <MicIcon />
              </button>
              <input ref={input} name="q" placeholder={listening ? "Listening…" : "Type or speak a command"} autoComplete="off"
                className="flex-1 rounded-full border border-line bg-bg px-4 py-2 text-sm outline-none focus:border-accent" aria-label="Command" />
              <button type="button" onClick={() => setOpen(false)} className="btn" aria-label="Close">Esc</button>
            </div>
            <div className="flex flex-wrap gap-1.5 px-1">
              {examples.map((x) => (
                <button key={x} type="button" onClick={() => act(x)} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-2 hover:border-accent">{x}</button>
              ))}
            </div>
            <p className="min-h-5 px-1 font-mono text-xs text-ink-3" aria-live="polite">{heard && `heard: ${heard}`}{heard && reply && " · "}{reply}</p>
          </form>
        )}
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
