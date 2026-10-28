"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Wrench,
  Car,
  Package,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  ChevronDown,
  Bot,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { formatVehicleName } from "@/data/mock";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: Wrench,
    label: "Frenos y ruidos",
    text: "Mi carro chilla o suena al frenar, ¿qué taller verificado me recomiendas en Cartagena?",
  },
  {
    icon: Package,
    label: "Repuestos compatibles",
    text: "¿Qué repuestos disponibles tienen en catálogo compatibles con mi vehículo activo?",
  },
  {
    icon: Car,
    label: "Mantenimiento preventivo",
    text: "¿Qué mantenimientos preventivos le corresponden a mi auto según su kilometraje actual y fechas de SOAT?",
  },
  {
    icon: ShieldCheck,
    label: "Garantías y Ley 1480",
    text: "¿Cómo funciona la garantía de los talleres y el rol de Motrick bajo el Art. 53 de la Ley 1480?",
  },
];

/**
 * Renderizador ligero y seguro de texto estructurado (Markdown básico)
 */
function FormattedMessage({ content }: { content: string }) {
  const formattedBlocks = useMemo(() => {
    const lines = content.split("\n");
    const blocks: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        blocks.push(
          <ul key={`ul-${blocks.length}`} className="my-2 space-y-1 pl-1">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{renderInlineText(item)}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();

      if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
        listItems.push(line.replace(/^[-*•]\s+/, ""));
      } else if (/^\d+\.\s+/.test(line)) {
        flushList();
        const textPart = line.replace(/^\d+\.\s+/, "");
        blocks.push(
          <div key={`ol-${idx}`} className="my-1.5 flex items-start gap-2 text-xs leading-relaxed">
            <span className="font-semibold text-primary">{line.match(/^\d+\./)?.[0]}</span>
            <span>{renderInlineText(textPart)}</span>
          </div>
        );
      } else if (!line) {
        flushList();
        blocks.push(<div key={`sp-${idx}`} className="h-1.5" />);
      } else {
        flushList();
        blocks.push(
          <p key={`p-${idx}`} className="text-xs leading-relaxed">
            {renderInlineText(line)}
          </p>
        );
      }
    });

    flushList();
    return blocks;
  }, [content]);

  return <div className="space-y-1">{formattedBlocks}</div>;
}

function renderInlineText(text: string) {
  // Manejo de negrita **texto**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function MotrickChatbot() {
  const { active, records } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTeaser, setShowTeaser] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      text: "¡Hola! Soy **Motrick AI** 🚗, tu asesor automotriz oficial en Cartagena. Puedo recomendarte talleres especializados verificados, buscar repuestos compatibles con tu vehículo y darte recomendaciones según tu kilometraje y bitácora técnica.\n\n¿En qué te puedo asesorar hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, loading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        text: `Conversación reiniciada. ¿Qué consulta o síntoma deseas revisar para tu ${formatVehicleName(
          active?.brand,
          active?.model
        )}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Filtrar historial compatible con Gemini (iniciar en user)
      const historyPayload = newMessages
        .slice(1) // Ignorar el saludo inicial del modelo
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));

      // Extraer registros recientes del vehículo activo para contextualizar
      const recentVehicleRecords = records
        .filter((r) => r.vehicleId === active?.id || String(r.vehicleId).replace(/^v/, "") === String(active?.id).replace(/^v/, ""))
        .slice(0, 4);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          activeVehicle: active,
          recentRecords: recentVehicleRecords,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (data.needsApiKey) {
        setNeedsApiKey(true);
      }

      setMessages([
        ...newMessages,
        {
          id: `model-${Date.now()}`,
          role: "model",
          text: data.reply || "No pude procesar la respuesta en este momento.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          id: `model-${Date.now()}`,
          role: "model",
          text: "No fue posible conectar con el servidor. Revisa tu conexión a internet o intenta de nuevo en unos momentos.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const vehicleDisplay = active ? formatVehicleName(active.brand, active.model) : "Vehículo";

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none sm:bottom-6 sm:right-6">
      <div className="relative pointer-events-auto">
        {/* Mensaje globo previo flotante cuando está cerrado (Teaser) */}
        <AnimatePresence>
          {!isOpen && showTeaser && (
            <motion.div
              style={{ transformOrigin: "bottom right" }}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="absolute bottom-16 right-0 mb-1 w-[270px] rounded-2xl border border-border bg-card/95 p-3 shadow-lift backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Asesor Motrick AI</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTeaser(false);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Cerrar sugerencia"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                ¿Dudas sobre repuestos o talleres para tu <strong>{vehicleDisplay}</strong>? Pregúntame aquí.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón flotante burbuja (Desplegable) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="chat-trigger-bubble"
              onClick={() => setIsOpen(true)}
              style={{ transformOrigin: "bottom right" }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
              className="absolute bottom-0 right-0 flex items-center gap-2.5 rounded-full bg-primary px-4 py-3 text-white shadow-lift whitespace-nowrap transition-shadow hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer"
              aria-label="Abrir asistente de Motrick"
            >
              {/* Indicador de estado en línea */}
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>

              <Bot className="h-5 w-5 transition-transform group-hover:rotate-12" />
              <span className="text-sm font-semibold tracking-tight">Motrick AI</span>
              <span className="hidden text-xs text-blue-200 sm:inline">· Cartagena</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Ventana de Chat Flotante Desplegada (Efecto Globo Inflado / Desinflado) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-window-modal"
              style={{ transformOrigin: "bottom right" }}
              initial={{ opacity: 0, scale: 0.15, y: 12, x: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{
                opacity: 0,
                scale: 0.15,
                y: 12,
                x: 12,
                transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
              }}
              transition={{
                type: "spring",
                stiffness: 290,
                damping: 24,
                mass: 0.75,
              }}
              className="absolute bottom-0 right-0 flex h-[560px] w-[350px] max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[410px]"
            >
            {/* Header del Chatbot */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3 text-white dark:bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary text-white shadow-inner">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold tracking-tight">Motrick AI</h3>
                    <span className="rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-300">
                      Oficial
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">Asesor vehicular en Cartagena</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reiniciar conversación"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label="Reiniciar conversación"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimizar chat"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label="Minimizar chat"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar chat"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label="Cerrar chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sub-barra de Contexto Vehicular Activo */}
            {active && (
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3.5 py-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 truncate">
                  <Car className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    Activo: <strong className="text-foreground">{vehicleDisplay}</strong> ({active.year})
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-foreground/80 shrink-0">
                  {active.odometer.toLocaleString("es-CO")} km
                </span>
              </div>
            )}

            {/* Aviso de Configuración de API Key si hace falta */}
            {needsApiKey && (
              <div className="flex items-start gap-2 border-b border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold">Clave de IA pendiente</p>
                  <p className="text-[11px] opacity-90">
                    Agrega <code className="font-mono font-bold">GEMINI_API_KEY</code> a tu archivo{" "}
                    <code className="font-mono">.env.local</code> para habilitar respuestas con IA.
                  </p>
                </div>
              </div>
            )}

            {/* Área de Mensajes */}
            <div className="flex-1 space-y-3 overflow-y-auto p-3.5 text-sm">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                      m.role === "user"
                        ? "rounded-br-xs bg-primary text-white"
                        : "rounded-bl-xs border border-border bg-secondary/70 text-foreground dark:bg-secondary/40"
                    }`}
                  >
                    <FormattedMessage content={m.text} />

                    {m.role === "model" && (
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        title="Copiar respuesta"
                        className="absolute -right-7 top-2 hidden rounded p-1 text-muted-foreground hover:text-foreground group-hover:block"
                      >
                        {copiedId === m.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-muted-foreground/70">{m.timestamp}</span>
                </div>
              ))}

              {/* Sugerencias Rápidas Iniciales */}
              {messages.length === 1 && !loading && (
                <div className="pt-2">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Consultas rápidas sugeridas:
                  </p>
                  <div className="space-y-1.5">
                    {QUICK_PROMPTS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q.text)}
                        className="flex w-full items-start gap-2.5 rounded-xl border border-border bg-card p-2.5 text-left text-xs transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-accent/40"
                      >
                        <q.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <div className="font-semibold text-foreground">{q.label}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1">{q.text}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Indicador de Carga */}
              {loading && (
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/50 px-3.5 py-2.5 text-xs text-muted-foreground">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </span>
                  <span>Consultando talleres y repuestos en Cartagena…</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer con Formulario de Entrada */}
            <div className="border-t border-border bg-card p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre fallas, repuestos o talleres..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Enviar mensaje"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Descargo Legal Ley 1480 */}
              <p className="mt-2 text-center text-[10px] text-muted-foreground/75">
                Orientación técnica · Portal de contacto conforme al Art. 53 de la Ley 1480 de 2011.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
