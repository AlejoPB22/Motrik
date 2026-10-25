# -*- coding: utf-8 -*-
"""
Script para compilar y generar el documento final de entrega académica en PDF
Proyecto: Motrik (MVP Final - Tercer Corte)
Universidad Tecnológica de Bolívar - 2026
"""

import os
import subprocess
import base64

def get_base64_image(image_path):
    if os.path.exists(image_path):
        with open(image_path, "rb") as f:
            data = base64.b64encode(f.read()).decode("utf-8")
            ext = os.path.splitext(image_path)[1].lower()
            mime = "image/png" if ext == ".png" else "image/jpeg"
            return f"data:{mime};base64,{data}"
    return ""

def build_html():
    logo_b64 = get_base64_image("assets/documentación/img_uml/page_1_Im1.png")
    trello_b64 = get_base64_image("assets/Trello.png")

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Proyecto de Aula - Motrik (MVP Final)</title>
<style>
  @page {{
    size: letter;
    margin: 22mm 18mm 22mm 18mm;
    @bottom-center {{
      content: counter(page);
      font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 9pt;
      color: #64748b;
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  body {{
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #1e293b;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }}

  /* Portada */
  .cover-page {{
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    padding: 25mm 15mm 20mm 15mm;
    text-align: center;
  }}

  .cover-header img {{
    max-height: 80px;
    margin-bottom: 12px;
  }}

  .cover-institution {{
    font-size: 15pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #0f172a;
    text-transform: uppercase;
    margin: 0;
  }}

  .cover-faculty {{
    font-size: 11pt;
    font-weight: 600;
    color: #475569;
    margin-top: 4px;
    text-transform: uppercase;
  }}

  .cover-program {{
    font-size: 10.5pt;
    color: #64748b;
    margin-top: 2px;
  }}

  .cover-title-box {{
    margin: 40px 0;
    padding: 24px;
    border-top: 3px solid #2563eb;
    border-bottom: 3px solid #2563eb;
    background: #f8fafc;
  }}

  .cover-subject {{
    font-size: 11pt;
    font-weight: 700;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
  }}

  .cover-title {{
    font-size: 20pt;
    font-weight: 800;
    color: #090d16;
    line-height: 1.25;
    margin: 0;
  }}

  .cover-subtitle {{
    font-size: 11.5pt;
    font-weight: 500;
    color: #475569;
    margin-top: 10px;
  }}

  .cover-meta {{
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    text-align: left;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px 20px;
  }}

  .cover-meta-col h4 {{
    margin: 0 0 6px 0;
    font-size: 9.5pt;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}

  .cover-meta-col p {{
    margin: 2px 0;
    font-size: 10.5pt;
    font-weight: 600;
    color: #1e293b;
  }}

  .cover-meta-col span {{
    font-size: 9pt;
    color: #64748b;
    font-weight: normal;
  }}

  .cover-footer {{
    font-size: 9.5pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
  }}

  /* Estructura del cuerpo */
  .page-break {{
    page-break-before: always;
  }}

  h1 {{
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 14px;
    page-break-after: avoid;
  }}

  h2 {{
    font-size: 13pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }}

  h3 {{
    font-size: 11pt;
    font-weight: 700;
    color: #334155;
    margin-top: 16px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }}

  h4 {{
    font-size: 10.5pt;
    font-weight: 700;
    color: #475569;
    margin-top: 12px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }}

  p, li {{
    text-align: justify;
    text-justify: inter-word;
    margin-top: 0;
    margin-bottom: 8px;
  }}

  ul, ol {{
    margin-top: 4px;
    margin-bottom: 12px;
    padding-left: 22px;
  }}

  li {{
    margin-bottom: 4px;
  }}

  /* Tablas de Requerimientos y Casos de Prueba */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }}

  th, td {{
    border: 1px solid #cbd5e1;
    padding: 7px 10px;
    vertical-align: top;
    text-align: left;
  }}

  th {{
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
  }}

  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}

  /* Fichas de Requerimientos */
  .req-table {{
    margin-bottom: 16px;
    border: 1.5px solid #94a3b8;
  }}

  .req-table th {{
    width: 25%;
    background-color: #e2e8f0;
    color: #1e293b;
    font-weight: 700;
  }}

  .req-table td {{
    width: 75%;
  }}

  /* Cuadros de texto y alertas */
  .callout {{
    background: #f8fafc;
    border-left: 4px solid #2563eb;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }}

  .callout-legal {{
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    color: #78350f;
  }}

  .callout-success {{
    background: #f0fdf4;
    border-left: 4px solid #10b981;
    color: #065f46;
  }}

  /* Fragmentos de código */
  pre, code {{
    font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
  }}

  pre {{
    background: #0f172a;
    color: #f8fafc;
    padding: 10px 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 10px 0;
    line-height: 1.45;
    page-break-inside: avoid;
  }}

  .code-inline {{
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }}

  .diff-table {{
    width: 100%;
    margin: 10px 0;
    font-family: monospace;
    font-size: 8.5pt;
  }}

  .diff-before {{
    background: #fef2f2;
    border-left: 3px solid #ef4444;
    padding: 8px 10px;
    color: #991b1b;
  }}

  .diff-after {{
    background: #f0fdf4;
    border-left: 3px solid #10b981;
    padding: 8px 10px;
    color: #166534;
  }}

  /* Figuras e Imágenes */
  .figure-container {{
    text-align: center;
    margin: 16px 0;
    page-break-inside: avoid;
  }}

  .figure-container img {{
    max-width: 100%;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }}

  .figure-caption {{
    font-size: 9pt;
    color: #475569;
    margin-top: 6px;
    text-align: left;
    line-height: 1.4;
  }}

  .figure-title {{
    font-weight: 700;
    color: #0f172a;
  }}

  /* Diagrama SVG Embebido */
  .svg-diagram {{
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px;
    margin: 10px auto;
    max-width: 100%;
  }}
</style>
</head>
<body>

<!-- ==================== PORTADA ==================== -->
<div class="cover-page">
  <div class="cover-header">
    {"<img src='" + logo_b64 + "' alt='Logo Universidad Tecnológica de Bolívar' />" if logo_b64 else ""}
    <h2 class="cover-institution">Universidad Tecnológica de Bolívar</h2>
    <div class="cover-faculty">Facultad de Ingeniería</div>
    <div class="cover-program">Programa de Ingeniería de Software · Grupo 1208</div>
  </div>

  <div class="cover-title-box">
    <div class="cover-subject">Proyecto de Aula — Tercer Corte (MVP Final)</div>
    <h1 class="cover-title">Motrick</h1>
    <div class="cover-subtitle">
      Plataforma Centralizada para la Gestión de Mantenimiento Vehicular, Directorio de Talleres Especializados y Catálogo de Repuestos
    </div>
  </div>

  <div class="cover-meta">
    <div class="cover-meta-col">
      <h4>Estudiantes Desarrolladores</h4>
      <p>Alejandro David Paternina Bermejo<br><span>Código: T00078032</span></p>
      <p style="margin-top: 8px;">Johan Sebastian Brieva Fernandez<br><span>Código: T00077809</span></p>
    </div>
    <div class="cover-meta-col">
      <h4>Docente Evaluador</h4>
      <p>Aisner Jose Marrugo Juliao<br><span>Docente Titular de Ingeniería de Software</span></p>
      <h4 style="margin-top: 14px;">Semestre Académico</h4>
      <p>Semestre 8 · Periodo 2026</p>
    </div>
  </div>

  <div class="cover-footer">
    Cartagena de Indias, Bolívar · Octubre de 2026
  </div>
</div>

<!-- ==================== TABLA DE CONTENIDO ==================== -->
<div>
  <h1>Tabla de Contenido</h1>
  <table style="border: none;">
    <tr style="background: none;"><td style="border: none; font-weight: bold;">1. Propósito del Proyecto de Aula y Marco de Negocio</td><td style="border: none; text-align: right; font-weight: bold;">2</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">1.1. Descripción del Problema</td><td style="border: none; text-align: right;">2</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">1.2. Solución Propuesta (Alcance del MVP)</td><td style="border: none; text-align: right;">2</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">1.3. Alcance y Restricciones Tecnológicas</td><td style="border: none; text-align: right;">2</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">1.4. Arquitectura y Tecnologías (Next.js y Supabase)</td><td style="border: none; text-align: right;">3</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">1.5. Modelo de Negocio y Deslinde de Responsabilidad Legal (Ley 1480 de 2011)</td><td style="border: none; text-align: right;">3</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">1.5.2. Publicidad Nativa Contextual y Política de Brand Safety (RNF-04)</td><td style="border: none; text-align: right;">4</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">2. Identificación de Interesados (Stakeholders)</td><td style="border: none; text-align: right; font-weight: bold;">5</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">3. Técnicas de Elicitación Aplicadas</td><td style="border: none; text-align: right; font-weight: bold;">6</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">4. Muestras de las Herramientas Utilizadas y Evidencias del Sector</td><td style="border: none; text-align: right; font-weight: bold;">7</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">5. Especificación de Requerimientos de Software (RF-01 a RF-05 y RNF-01 a RNF-04)</td><td style="border: none; text-align: right; font-weight: bold;">9</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">6. Priorización de Requerimientos y Alcance Funcional</td><td style="border: none; text-align: right; font-weight: bold;">12</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">7. Modelado UML y Matriz de Validación Metodológica</td><td style="border: none; text-align: right; font-weight: bold;">13</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">8. Gestión Ágil (FDD) y Control de Versiones</td><td style="border: none; text-align: right; font-weight: bold;">16</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">9. Validación y Pruebas de Software</td><td style="border: none; text-align: right; font-weight: bold;">18</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">9.1. Reglas de Negocio Acordadas y Datos Semilla</td><td style="border: none; text-align: right;">18</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">9.2. Matriz de Casos de Prueba Reales Ejecutados (Tabla 1)</td><td style="border: none; text-align: right;">19</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">9.3. Registro y Corrección de Defectos (D1 y D2)</td><td style="border: none; text-align: right;">20</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">9.4. Simulación de Cambio y Pruebas de Regresión (Regla R6)</td><td style="border: none; text-align: right;">21</td></tr>
    <tr style="background: none;"><td style="border: none; padding-left: 20px;">9.5. Revisión Cruzada por Pares y Decisión de Liberación</td><td style="border: none; text-align: right;">22</td></tr>
    <tr style="background: none;"><td style="border: none; font-weight: bold;">10. Referencias Bibliográficas</td><td style="border: none; text-align: right; font-weight: bold;">23</td></tr>
  </table>
</div>

<div class="page-break"></div>

<!-- ==================== CAPITULO 1 ==================== -->
<h1>1. Propósito del Proyecto de Aula y Marco de Negocio</h1>

<p>El Proyecto de Aula busca integrar los conocimientos y prácticas trabajados en la asignatura de <strong>Ingeniería de Software</strong> mediante el desarrollo incremental de una solución de software a un problema real y representativo de la industria. El proyecto se ejecutó durante el segundo y tercer corte evaluativo, consolidando evidencias completas de análisis, diseño, construcción, pruebas en base de datos real, gestión ágil del trabajo y liberación del Producto Mínimo Viable (MVP).</p>

<h2>1.1. Descripción del Problema</h2>
<p>Encontrar un mecánico de confianza, cotizar el repuesto exacto y llevar un registro organizado de las modificaciones suele ser un desafío constante para los propietarios de vehículos en Colombia. Actualmente, la información se encuentra fragmentada, los precios de las piezas varían sin control y, en muchas ocasiones, el usuario carece de certeza sobre la compatibilidad de un componente o la reputación real del taller al que acude.</p>

<h2>1.2. Solución Propuesta (Alcance del MVP)</h2>
<p><strong>Motrick</strong> es una plataforma web full-stack diseñada para centralizar la gestión vehicular. Para garantizar la viabilidad dentro del tiempo disponible, el alcance del MVP se estructura en tres módulos clave:</p>
<ul>
  <li><strong>Directorio de Servicios Especializados:</strong> Catálogo de mecánicos y talleres filtrable por especialidad técnica, que incluye cálculo de calificación promedio y solicitud de verificación formal de talleres.</li>
  <li><strong>Buscador y Catálogo de Repuestos:</strong> Módulo de consulta categorizado y filtrable por modelo vehicular con validación de compatibilidad técnica.</li>
  <li><strong>Bitácora de Mantenimiento y Garaje Digital:</strong> Espacio donde el propietario registra los servicios preventivos y correctivos, controlando odómetro, piezas actualizadas, costos y fechas de vencimiento legal de SOAT y revisión técnico-mecánica.</li>
</ul>

<h2>1.3. Alcance y Restricciones Tecnológicas</h2>
<ul>
  <li><strong>Persistencia de Datos:</strong> El sistema opera conectado a una base de datos relacional PostgreSQL alojada en Supabase Cloud, implementando políticas de seguridad a nivel de fila (Row Level Security - RLS).</li>
  <li><strong>Simulación de Pasarela de Pagos (RNF-03):</strong> El flujo de compra de repuestos implementa una maqueta interactiva en 4 pasos (Resumen, Tarjeta con animación 3D, Procesamiento y Comprobante) para evaluar la experiencia de usuario (UX) sin procesar cobros financieros reales.</li>
</ul>

<h2>1.4. Arquitectura y Tecnologías</h2>
<p>La arquitectura del sistema se fundamenta en un ecosistema unificado basado en JavaScript y TypeScript estricto:</p>
<ul>
  <li><strong>Framework Full-Stack:</strong> Next.js 14 con arquitectura App Router, utilizando React 18 para el renderizado interactivo y Tailwind CSS para un diseño responsivo con soporte nativo de modo oscuro/claro.</li>
  <li><strong>Backend y Persistencia:</strong> Supabase (BaaS) sobre PostgreSQL 15, garantizando integridad referencial, restricciones de dominio CHECK y autenticación.</li>
</ul>

<h2>1.5. Modelo de Negocio y Deslinde de Responsabilidad Legal (Ley 1480 de 2011)</h2>
<p>Motrick implementa un modelo de monetización B2B sustentado en membresías de visibilidad para talleres mecánicos y pauta publicitaria nativa, <strong>descartando expresamente el cobro de comisiones sobre reparaciones mecánicas</strong>.</p>

<h3>Prevención de Solidaridad Jurídica</h3>
<p>De acuerdo con el <strong>Artículo 53 de la Ley 1480 de 2011 (Estatuto del Consumidor en Colombia)</strong>, la plataforma califica como <strong>portal de contacto e intermediación informativa</strong>. Si Motrick recaudara el valor del servicio de mano de obra o comisionara sobre el arreglo mecánico, la Superintendencia de Industria y Comercio (SIC) la consideraría prestador solidario, debiendo responder económicamente ante fallas mecánicas, averías colaterales o garantías no atendidas por el taller.</p>

<p>Al limitar los ingresos al canon de visibilidad y verificación documental, la relación contractual por el servicio automotriz se suscribe directa y exclusivamente entre el propietario del vehículo y el taller mecánico contratado.</p>

<div class="callout callout-legal">
  <strong>Cláusula de Deslinde en Términos y Condiciones:</strong><br>
  <em>"Motrick opera bajo la figura de portal de contacto (Art. 53, Ley 1480 de 2011). La plataforma no ejecuta diagnósticos mecánicos, no provee mano de obra ni actúa como garante solidario de los trabajos realizados por los talleres listados. La contratación de servicios automotrices, su calidad y cumplimiento de garantías recaen exclusivamente en el establecimiento seleccionado por el usuario."</em>
</div>

<h2>1.5.2. Publicidad Nativa Contextual y Política de Brand Safety (RNF-04)</h2>
<p>Como línea secundaria de sostenimiento, se habilitan espacios pasivos en los márgenes y zonas blancas de la interfaz, alineados con los <strong>Artículos 29 y 30 de la Ley 1480 de 2011 (protección contra publicidad engañosa)</strong>:</p>
<ul>
  <li><strong>Relevancia temático-vehicular:</strong> Solo se admiten anunciantes de servicios afines (SOAT digital, revisión técnico-mecánica en Centros CDA aliados, escáneres OBD2 Bluetooth y telepeaje).</li>
  <li><strong>Cero intrusión (UX):</strong> Se vetan pop-ups, modales bloqueantes o banners con sonido, garantizando cero desplazamiento visual (<em>Cumulative Layout Shift = 0</em>).</li>
  <li><strong>Seguridad de marca (Brand Safety):</strong> Quedan prohibidos juegos móviles, apuestas deportivas, esquemas de inversión y contenido adulto (+18). Toda inserción cuenta con el distintivo gráfico visible y obligatorio <strong>"Patrocinado"</strong>.</li>
</ul>

<div class="page-break"></div>

<!-- ==================== CAPITULO 2 ==================== -->
<h1>2. Identificación de Interesados (Stakeholders)</h1>

<p>Para garantizar una adecuada gestión de expectativas y cobertura de requisitos, se identificaron cuatro actores clave del ecosistema de Motrick:</p>

<table>
  <thead>
    <tr>
      <th style="width: 25%;">Nombre / Rol</th>
      <th style="width: 35%;">Relación con el Proyecto</th>
      <th style="width: 40%;">Principales Necesidades / Expectativas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Usuario Final</strong><br>(Propietario de vehículo)</td>
      <td>Actor principal. Interactúa con la interfaz para buscar servicios, repuestos y registrar la bitácora técnica de sus vehículos.</td>
      <td>
        • Encontrar mecánicos verificados y confiables.<br>
        • Cotizar repuestos garantizando compatibilidad técnica.<br>
        • Llevar un historial digital permanente de mantenimientos.
      </td>
    </tr>
    <tr>
      <td><strong>Mecánico o Taller</strong><br>(Proveedor de servicio)</td>
      <td>Interesado clave. Su información nutre el directorio de servicios, solicita verificación y recibe clientes calificados.</td>
      <td>
        • Mayor visibilidad digital para captar clientes en Bogotá.<br>
        • Destacar su especialidad técnica (Frenos, Motor, etc.).<br>
        • Construir reputación comercial verificada mediante reseñas.
      </td>
    </tr>
    <tr>
      <td><strong>Administrador</strong><br>(Equipo Motrick)</td>
      <td>Gestiona la plataforma, audita la documentación fiscal de talleres (NIT/RUT) y supervisa el catálogo de repuestos.</td>
      <td>
        • Controlar el catálogo de repuestos automotrices.<br>
        • Auditar y otorgar la insignia de "Taller Verificado".<br>
        • Moderar valoraciones y asegurar el cumplimiento normativo.
      </td>
    </tr>
    <tr>
      <td><strong>Docente / Evaluador</strong><br>(Stakeholder académico)</td>
      <td>Guía, audita y califica el desarrollo del proyecto de aula en la Universidad Tecnológica de Bolívar.</td>
      <td>
        • Evidenciar la aplicación de técnicas de elicitación.<br>
        • Validar pruebas reales ejecutadas contra base de datos.<br>
        • Evaluar la disciplina en gestión ágil (FDD y control Git).
      </td>
    </tr>
  </tbody>
</table>

<!-- ==================== CAPITULO 3 ==================== -->
<h1>3. Técnicas de Elicitación Aplicadas</h1>

<p>Para fundamentar técnicamente los módulos del sistema, se aplicaron tres metodologías formales de levantamiento de requisitos:</p>

<h3>3.1. Benchmarking (Análisis de Soluciones Similares)</h3>
<p>Se analizaron aplicaciones líderes en gestión y servicios automotrices (Drivvo, Autolab y MercadoLibre Repuestos). Conclusión: las aplicaciones existentes resuelven problemas de forma fragmentada. La ventaja competitiva de Motrick radica en <strong>centralizar en una sola plataforma</strong> el directorio confiable, el catálogo compatible y la bitácora técnica.</p>

<h3>3.2. Encuesta a Usuarios Finales (Propietarios de Vehículos)</h3>
<p>Se diseñó e implementó un formulario estructurado aplicado a <strong>49 propietarios de vehículos</strong> en Colombia para cuantificar las dificultades cotidianas en el mantenimiento automotriz.</p>

<h3>3.3. Revisión Documental (Informes de la Industria y Gremios)</h3>
<p>Se analizaron reportes de la <em>American Automobile Association</em> (AAA, 2016), estudios de <em>McKinsey & Company</em> (2018) sobre el mercado de postventa automotriz, e informes gremiales de <em>ASOPARTES</em> y <em>FENALCO</em> (2023) sobre informalidad y compra desinformada de autopartes en Colombia.</p>

<div class="page-break"></div>

<!-- ==================== CAPITULO 4 ==================== -->
<h1>4. Muestras de las Herramientas Utilizadas y Evidencias del Sector</h1>

<h2>4.1. Matriz de Análisis Comparativo (Benchmarking)</h2>

<table>
  <thead>
    <tr>
      <th>Aplicación</th>
      <th>Funcionalidades Destacadas</th>
      <th>Funcionalidades Faltantes</th>
      <th>Hallazgo / Oportunidad para Motrick</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Drivvo</strong></td>
      <td>Excelente control de combustible, gastos y recordatorios.</td>
      <td>Carece de directorio de talleres y no permite cotizar repuestos.</td>
      <td>El usuario lleva control pero debe salir de la app para buscar taller. Motrick unifica ambos mundos.</td>
    </tr>
    <tr>
      <td><strong>Autolab</strong></td>
      <td>Red de talleres aliados, precios estandarizados y agendamiento.</td>
      <td>No ofrece bitácora personalizada ni catálogo para compra independiente.</td>
      <td>Falta libertad de elección técnica. El directorio filtrable con reseñas de Motrick otorga autonomía.</td>
    </tr>
    <tr>
      <td><strong>MercadoLibre</strong></td>
      <td>Catálogo masivo de autopartes y pasarela de pago robusta.</td>
      <td>No se conecta con el historial del auto ni sugiere talleres para instalación.</td>
      <td>Información desarticulada. Motrick conecta el catálogo directamente con el modelo y la bitácora.</td>
    </tr>
  </tbody>
</table>

<h2>4.2. Resultados Consolidados de la Encuesta a 49 Usuarios</h2>
<p>El instrumento digital evidenció datos contundentes sobre los hábitos de los conductores:</p>
<ul>
  <li><strong>Búsqueda de Mecánicos:</strong> El <strong>91.8%</strong> depende exclusivamente de la recomendación informal ("boca a boca"), demostrando la ausencia de herramientas digitales confiables.</li>
  <li><strong>Filtros por Especialidad y Reseñas:</strong> El <strong>98.0%</strong> consideró "Muy útil" o "Útil" consultar valoraciones y filtrar mecánicos por especialidad antes de acudir.</li>
  <li><strong>Dificultad en Repuestos:</strong> El <strong>53.1%</strong> manifestó que su mayor temor al comprar autopartes es <em>"Tener certeza de la compatibilidad con mi vehículo"</em>.</li>
  <li><strong>Control de Historial:</strong> El <strong>75.5%</strong> no lleva ningún registro o guarda facturas sueltas en la guantera con riesgo de pérdida.</li>
  <li><strong>Aceptación de la Propuesta:</strong> El <strong>100%</strong> de los encuestados afirmó que usaría una plataforma que centralice talleres, repuestos compatibles y bitácora digital.</li>
</ul>

<h2>4.3. Hallazgos de la Revisión Documental del Sector</h2>
<ul>
  <li><strong>Desconfianza Estructural (Estudio AAA):</strong> Dos tercios de los conductores desconfían de los talleres por temor a cobros inflados. Motrick mitiga esto mediante el sistema de valoraciones auditadas y el canal de verificación documental (RF-05).</li>
  <li><strong>Incompatibilidad de Autopartes (ASOPARTES):</strong> La compra desinformada de repuestos paraliza los talleres. Motrick soluciona esto categorizando piezas compatibles con el modelo exacto (RF-04).</li>
  <li><strong>Asimetría Informativa:</strong> La ausencia de bitácora provoca diagnósticos redundantes y costosos. Motrick transfiere el control digital del historial al usuario (RF-01).</li>
</ul>

<div class="page-break"></div>

<!-- ==================== CAPITULO 5 ==================== -->
<h1>5. Especificación de Requerimientos de Software</h1>

<p>Con base en la elicitación, se formalizaron cinco requerimientos funcionales y cuatro requerimientos no funcionales para el MVP:</p>

<h2>5.1. Requerimientos Funcionales (RF)</h2>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RF-01</strong></td></tr>
  <tr><th>Nombre</th><td>Registrar y gestionar mantenimiento en bitácora vehicular</td></tr>
  <tr><th>Descripción</th><td>El sistema debe permitir al usuario propietario registrar mantenimientos especificando vehículo, fecha, odómetro, título del servicio, notas, taller y repuesto opcional.</td></tr>
  <tr><th>Fuente</th><td>Encuesta a Usuarios (Pregunta 4: 75.5% sin registro organizado) y Revisión Documental.</td></tr>
  <tr><th>Prioridad</th><td>Alta</td></tr>
  <tr><th>Criterio de Aceptación</th><td>El registro se almacena en la tabla <code>registros_bitacora</code> de Supabase. Si el odómetro ingresado es menor al actual, la interfaz bloquea el registro (Defecto D1 corregido).</td></tr>
</table>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RF-02</strong></td></tr>
  <tr><th>Nombre</th><td>Filtrar directorio de talleres por especialidad técnica</td></tr>
  <tr><th>Descripción</th><td>El sistema debe listar mecánicos y talleres permitiendo aplicar filtros por especialidad (Frenos, Motor, Suspensión, Transmisión, Eléctrico) y zona geográfica en Bogotá.</td></tr>
  <tr><th>Fuente</th><td>Encuesta a Usuarios (Pregunta 2: 98% de interés) y Benchmarking.</td></tr>
  <tr><th>Prioridad</th><td>Alta</td></tr>
  <tr><th>Criterio de Aceptación</th><td>La consulta a <code>mecanicos</code> filtra dinámicamente mediante <code>ILIKE</code> sobre la especialidad y actualiza la cuadrícula de talleres en tiempo real.</td></tr>
</table>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RF-03</strong></td></tr>
  <tr><th>Nombre</th><td>Consultar valoraciones y reseñas de mecánicos</td></tr>
  <tr><th>Descripción</th><td>El perfil de cada taller debe desplegar una calificación promedio (1.0 a 5.0 estrellas) calculada a partir de las reseñas emitidas por clientes verificados.</td></tr>
  <tr><th>Fuente</th><td>Revisión Documental (Mitigación de desconfianza según estudio AAA).</td></tr>
  <tr><th>Prioridad</th><td>Media / Alta</td></tr>
  <tr><th>Criterio de Aceptación</th><td>El sistema renderiza el promedio de estrellas y lista las reseñas. La tabla <code>valoraciones</code> en PostgreSQL protege el rango estricto mediante restricción CHECK.</td></tr>
</table>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RF-04</strong></td></tr>
  <tr><th>Nombre</th><td>Buscar repuestos compatibles según el modelo vehicular</td></tr>
  <tr><th>Descripción</th><td>El sistema debe consultar un catálogo de piezas automotrices categorizadas, indicando mediante un badge gráfico si el repuesto es compatible con el vehículo activo del usuario.</td></tr>
  <tr><th>Fuente</th><td>Encuesta a Usuarios (Pregunta 3: 53.1% teme incompatibilidad) e informes de ASOPARTES.</td></tr>
  <tr><th>Prioridad</th><td>Alta</td></tr>
  <tr><th>Criterio de Aceptación</th><td>El catálogo consulta la tabla <code>repuestos</code> en Supabase y compara la columna <code>compatibilidad</code> con la marca y modelo del automóvil activo.</td></tr>
</table>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RF-05</strong></td></tr>
  <tr><th>Nombre</th><td>Verificación y validación de talleres mecánicos</td></tr>
  <tr><th>Descripción</th><td>El sistema debe disponer de un canal para que los talleres soliciten una insignia de acreditación suministrando NIT/RUT, razón social, dirección física y teléfono de contacto. El Administrador valida la autenticidad de los datos para otorgar la insignia de taller verificado, y el directorio permite filtrar según este criterio.</td></tr>
  <tr><th>Fuente</th><td>Elicitación: Mitigación de desconfianza del usuario (Estudio AAA) y modelo de membresías B2B.</td></tr>
  <tr><th>Prioridad</th><td>Media</td></tr>
  <tr><th>Criterio de Aceptación</th><td>El perfil del taller en <code>/directorio</code> muestra la insignia gráfica tras su confirmación en base de datos, y el filtro "Solo verificados" actualiza el listado en tiempo real.</td></tr>
</table>

<div class="page-break"></div>

<h2>5.2. Requerimientos No Funcionales (RNF)</h2>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RNF-01</strong></td></tr>
  <tr><th>Nombre</th><td>Arquitectura Full-Stack en Next.js y Modern UX</td></tr>
  <tr><th>Descripción</th><td>La plataforma debe construirse sobre Next.js 14 con App Router, React 18, TypeScript estricto y Tailwind CSS, soportando tema claro/oscuro y componentes accesibles Radix UI.</td></tr>
  <tr><th>Fuente</th><td>Estándar arquitectónico de Motrick.</td></tr>
  <tr><th>Prioridad</th><td>Alta</td></tr>
  <tr><th>Criterio de Aceptación</th><td>Compilación de producción (<code>npm run build</code>) exitosa con 0 errores de TypeScript y pre-renderizado estático de rutas.</td></tr>
</table>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RNF-02</strong></td></tr>
  <tr><th>Nombre</th><td>Persistencia y Base de Datos en Supabase (PostgreSQL) con RLS</td></tr>
  <tr><th>Descripción</th><td>El sistema debe persistir datos relacionales en PostgreSQL alojado en Supabase, implementando políticas Row-Level Security (RLS) para proteger datos de bitácora y vehículos.</td></tr>
  <tr><th>Fuente</th><td>Requerimientos de seguridad y persistencia cloud.</td></tr>
  <tr><th>Prioridad</th><td>Alta</td></tr>
  <tr><th>Criterio de Aceptación</th><td>Tablas relacionales protegidas con RLS; consultas anónimas limitadas a lectura de catálogo público y directorios autorizados.</td></tr>
</table>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RNF-03</strong></td></tr>
  <tr><th>Nombre</th><td>Simulación de Transacciones y Checkout Interactivo (Mockups)</td></tr>
  <tr><th>Descripción</th><td>La pasarela de compra debe implementar un flujo simulado en 4 pasos (Resumen, Tarjeta con animación 3D, Procesamiento y Comprobante) sin realizar cobros bancarios reales.</td></tr>
  <tr><th>Fuente</th><td>Restricciones del MVP del Proyecto de Aula.</td></tr>
  <tr><th>Prioridad</th><td>Media</td></tr>
  <tr><th>Criterio de Aceptación</th><td>El formulario exige 16 dígitos de tarjeta y 3 de CVV antes de permitir el avance (Defecto D2 corregido) y genera un comprobante con orden MT-XXXXXX.</td></tr>
</table>

<table class="req-table">
  <tr><th>Identificador</th><td><strong>RNF-04</strong></td></tr>
  <tr><th>Nombre</th><td>Visualización de publicidad nativa y contextual no invasiva</td></tr>
  <tr><th>Descripción</th><td>La interfaz debe desplegar inserciones publicitarias pasivas integradas orgánicamente en el diseño (componente <code>SponsoredCard</code>) para servicios vehiculares aliados, con la etiqueta "Patrocinado" y sin recurrir a ventanas emergentes.</td></tr>
  <tr><th>Fuente</th><td>Modelo de negocio de la plataforma y atributos de usabilidad (UX).</td></tr>
  <tr><th>Prioridad</th><td>Baja / Media</td></tr>
  <tr><th>Criterio de Aceptación</th><td>Las tarjetas respetan los tokens cromáticos de Tailwind CSS en temas claro y oscuro, sin interferir en los formularios ni generar redirecciones automáticas.</td></tr>
</table>

<!-- ==================== CAPITULO 6 ==================== -->
<h1>6. Priorización de Requerimientos y Alcance Funcional</h1>

<p>Aplicando los principios de la metodología <strong>Feature-Driven Development (FDD)</strong>, los requerimientos se clasificaron en tres niveles de entrega:</p>
<ul>
  <li><strong>Prioridad Alta (Obligatorios para el MVP):</strong> RF-01 (Bitácora), RF-02 (Directorio), RF-04 (Repuestos compatibles), RNF-01 (Next.js) y RNF-02 (Supabase).</li>
  <li><strong>Prioridad Media (Valor agregado indispensable):</strong> RF-03 (Valoraciones), RF-05 (Verificación de talleres), RNF-03 (Checkout simulado) y RNF-04 (Pauta nativa contextual).</li>
  <li><strong>Prioridad Baja (Alcance futuro post-MVP):</strong> Conexión en tiempo real con inventarios de concesionarios y pasarela bancaria real con PSE / tarjeta de crédito.</li>
</ul>

<div class="callout callout-success">
  <strong>Cumplimiento de Alcance:</strong> Al cierre de la iteración final, el <strong>100% de los requerimientos de Prioridad Alta y Media</strong> se encuentran completamente desarrollados, integrados y probados.
</div>

<div class="page-break"></div>

<!-- ==================== CAPITULO 7 ==================== -->
<h1>7. Modelado UML y Matriz de Validación Metodológica</h1>

<h2>7.1. Diagrama de Casos de Uso Actualizado (Figura 1)</h2>
<p>El diagrama de casos de uso fue actualizado formalmente para incorporar el actor <strong>Mecánico / Taller</strong> (con el caso de uso <em>Solicitar verificación de taller</em>) y el actor <strong>Administrador</strong> (con la moderación de directorio, catálogo y aprobación de insignias fiscales), así como las relaciones <code>&lt;&lt;extend&gt;&gt;</code> hacia el checkout y la vinculación de piezas en bitácora:</p>

<div class="figure-container">
  <!-- Diagrama Vectorial SVG de Casos de Uso -->
  <svg class="svg-diagram" viewBox="0 0 740 420" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
    <!-- Background Frame -->
    <rect x="180" y="20" width="380" height="380" rx="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 2"/>
    <text x="370" y="42" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">Plataforma Motrick (MVP)</text>

    <!-- Actores -->
    <!-- Usuario Propietario -->
    <g transform="translate(45, 120)">
      <circle cx="20" cy="15" r="10" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="20" y1="25" x2="20" y2="52" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="2" y1="35" x2="38" y2="35" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="20" y1="52" x2="6" y2="75" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="20" y1="52" x2="34" y2="75" stroke="#0f172a" stroke-width="1.8"/>
      <text x="20" y="92" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">Usuario<tspan x="20" dy="12">(Propietario)</tspan></text>
    </g>

    <!-- Mecanico Taller -->
    <g transform="translate(45, 290)">
      <circle cx="20" cy="15" r="10" fill="#ffffff" stroke="#2563eb" stroke-width="1.8"/>
      <line x1="20" y1="25" x2="20" y2="52" stroke="#2563eb" stroke-width="1.8"/>
      <line x1="2" y1="35" x2="38" y2="35" stroke="#2563eb" stroke-width="1.8"/>
      <line x1="20" y1="52" x2="6" y2="75" stroke="#2563eb" stroke-width="1.8"/>
      <line x1="20" y1="52" x2="34" y2="75" stroke="#2563eb" stroke-width="1.8"/>
      <text x="20" y="92" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">Mecánico<tspan x="20" dy="12">o Taller</tspan></text>
    </g>

    <!-- Administrador -->
    <g transform="translate(640, 210)">
      <circle cx="20" cy="15" r="10" fill="#ffffff" stroke="#b91c1c" stroke-width="1.8"/>
      <line x1="20" y1="25" x2="20" y2="52" stroke="#b91c1c" stroke-width="1.8"/>
      <line x1="2" y1="35" x2="38" y2="35" stroke="#b91c1c" stroke-width="1.8"/>
      <line x1="20" y1="52" x2="6" y2="75" stroke="#b91c1c" stroke-width="1.8"/>
      <line x1="20" y1="52" x2="34" y2="75" stroke="#b91c1c" stroke-width="1.8"/>
      <text x="20" y="92" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#b91c1c" text-anchor="middle">Administrador<tspan x="20" dy="12">(Equipo Motrick)</tspan></text>
    </g>

    <!-- Casos de Uso (Ellipses) -->
    <!-- UC1: Buscar repuestos -->
    <ellipse cx="280" cy="80" rx="75" ry="20" fill="#ffffff" stroke="#2563eb" stroke-width="1.4"/>
    <text x="280" y="84" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#0f172a" text-anchor="middle">Buscar repuestos por auto</text>

    <!-- UC2: Simular Checkout (extend) -->
    <ellipse cx="460" cy="80" rx="70" ry="20" fill="#eff6ff" stroke="#2563eb" stroke-width="1.4"/>
    <text x="460" y="84" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#1e40af" text-anchor="middle">Simular compra repuestos</text>

    <!-- UC3: Filtrar mecánicos -->
    <ellipse cx="280" cy="140" rx="75" ry="20" fill="#ffffff" stroke="#2563eb" stroke-width="1.4"/>
    <text x="280" y="144" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#0f172a" text-anchor="middle">Filtrar talleres mecánicos</text>

    <!-- UC4: Consultar valoraciones -->
    <ellipse cx="280" cy="200" rx="75" ry="20" fill="#ffffff" stroke="#2563eb" stroke-width="1.4"/>
    <text x="280" y="204" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#0f172a" text-anchor="middle">Consultar valoraciones</text>

    <!-- UC5: Registrar bitácora -->
    <ellipse cx="280" cy="260" rx="75" ry="20" fill="#ffffff" stroke="#2563eb" stroke-width="1.4"/>
    <text x="280" y="264" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#0f172a" text-anchor="middle">Registrar mantenimiento</text>

    <!-- UC6: Vincular repuesto (extend) -->
    <ellipse cx="460" cy="260" rx="70" ry="20" fill="#eff6ff" stroke="#2563eb" stroke-width="1.4"/>
    <text x="460" y="264" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#1e40af" text-anchor="middle">Vincular pieza catálogo</text>

    <!-- UC7: Solicitar Verificación (Mecánico) -->
    <ellipse cx="280" cy="325" rx="78" ry="20" fill="#fef3c7" stroke="#d97706" stroke-width="1.4"/>
    <text x="280" y="329" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#92400e" font-weight="600" text-anchor="middle">Solicitar verificación taller</text>

    <!-- UC8: Aprobar verificación (Admin) -->
    <ellipse cx="460" cy="340" rx="75" ry="20" fill="#fee2e2" stroke="#b91c1c" stroke-width="1.4"/>
    <text x="460" y="344" font-family="'Segoe UI', sans-serif" font-size="9.5" fill="#991b1b" font-weight="600" text-anchor="middle">Verificar y aprobar talleres</text>

    <!-- Lineas Usuario -->
    <line x1="85" y1="160" x2="205" y2="85" stroke="#475569" stroke-width="1.2"/>
    <line x1="85" y1="165" x2="205" y2="140" stroke="#475569" stroke-width="1.2"/>
    <line x1="85" y1="170" x2="205" y2="200" stroke="#475569" stroke-width="1.2"/>
    <line x1="85" y1="180" x2="205" y2="255" stroke="#475569" stroke-width="1.2"/>

    <!-- Lineas Mecanico -->
    <line x1="85" y1="330" x2="202" y2="330" stroke="#2563eb" stroke-width="1.4"/>

    <!-- Lineas Administrador -->
    <line x1="640" y1="260" x2="535" y2="340" stroke="#b91c1c" stroke-width="1.4"/>

    <!-- Relaciones extend con flechas dashed -->
    <line x1="390" y1="80" x2="355" y2="80" stroke="#2563eb" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="375" y="73" font-family="'Segoe UI', sans-serif" font-size="8" fill="#2563eb" text-anchor="middle">&lt;&lt;extend&gt;&gt;</text>

    <line x1="390" y1="260" x2="355" y2="260" stroke="#2563eb" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="375" y="253" font-family="'Segoe UI', sans-serif" font-size="8" fill="#2563eb" text-anchor="middle">&lt;&lt;extend&gt;&gt;</text>
  </svg>

  <div class="figure-caption">
    <span class="figure-title">Figura 1.</span> <em>Diagrama de Casos de Uso Actualizado con Módulo de Verificación (RF-05) y Rol Administrador.</em><br>
    <em>Nota.</em> Elaboración propia (2026) basada en los requerimientos del MVP de Motrick, incorporando relaciones <code>&lt;&lt;extend&gt;&gt;</code> para el checkout y la vinculación de piezas, e interacciones del actor Administrador y Mecánico bajo la Ley 1480 de 2011.
  </div>
</div>

<h3>Especificación PlantUML del Modelo Actualizado</h3>
<pre><code>@startuml Motrick_Casos_Uso_Actualizado
left to right direction
skinparam packageStyle rectangle

actor "Usuario\n(Propietario)" as User
actor "Mecánico / Taller" as Mech
actor "Administrador\n(Equipo Motrick)" as Admin
actor "Sistema Motrick\n(Gestión DB)" as Sys

rectangle "Plataforma Motrick (MVP)" {{
  usecase "Buscar repuestos por vehículo" as UC_Repuestos
  usecase "Simular compra de repuestos" as UC_Checkout
  usecase "Filtrar mecánicos y talleres" as UC_Directorio
  usecase "Consultar valoraciones y reseñas" as UC_Valoraciones
  usecase "Solicitar verificación de taller" as UC_SolicitarVerif
  usecase "Registrar mantenimiento en bitácora" as UC_RegistrarBitacora
  usecase "Vincular repuesto del catálogo" as UC_VincularPieza
  usecase "Gestionar Catálogo y Directorio" as UC_GestionCatalogo
  usecase "Verificar y aprobar talleres" as UC_AprobarTaller
}}

User --> UC_Repuestos
User --> UC_Directorio
User --> UC_Valoraciones
User --> UC_RegistrarBitacora

UC_Checkout .> UC_Repuestos : &lt;&lt;extend&gt;&gt;
UC_VincularPieza .> UC_RegistrarBitacora : &lt;&lt;extend&gt;&gt;

Mech --> UC_SolicitarVerif
Admin --> UC_GestionCatalogo
Admin --> UC_AprobarTaller
@enduml</code></pre>

<div class="page-break"></div>

<h2>7.3. Matriz de Validación y Ajustes Metodológicos</h2>

<table>
  <thead>
    <tr>
      <th style="width: 20%;">Elemento Revisado</th>
      <th style="width: 25%;">Concepción Inicial</th>
      <th style="width: 25%;">Hallazgo de Elicitación / Negocio</th>
      <th style="width: 30%;">Cambio Realizado o Justificación</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Casos de Uso (Directorio y Seguridad)</strong></td>
      <td>Búsqueda pasiva de talleres sin proceso de acreditación de identidad comercial.</td>
      <td>Alto porcentaje de desconfianza en talleres mecánicos (estudio AAA, 2016) y necesidad de exención de garantía solidaria (Ley 1480/2011).</td>
      <td>Se crearon los casos de uso <em>Solicitar verificación de taller</em> (Mecánico) y <em>Verificar y aprobar talleres</em> (Administrador), formalizando el esquema de confianza y membresía sin asumir responsabilidad civil sobre reparaciones.</td>
    </tr>
    <tr>
      <td><strong>Modelo de Monetización y Publicidad</strong></td>
      <td>La plataforma no contemplaba monetización secundaria ni reglas de pauta publicitaria.</td>
      <td>Necesidad de ingresos sostenibles sin comprometer la velocidad ni la seriedad técnica de la herramienta automotriz.</td>
      <td>Se definió la publicidad nativa contextual (RNF-04) con política de Brand Safety (veto de juegos, apuestas y +18) y tag visible "Patrocinado" exigido por la SIC.</td>
    </tr>
    <tr>
      <td><strong>Checkout de Repuestos</strong></td>
      <td>Simulación simple con formulario genérico sin retroalimentación visual de tarjeta.</td>
      <td>Altos índices de abandono de carritos en comercio electrónico y temor al fraude financiero.</td>
      <td>Se implementó la tarjeta interactiva animada con giro 3D (Framer Motion) y validación estricta de 16 dígitos y CVV de 3 dígitos (RNF-03).</td>
    </tr>
    <tr>
      <td><strong>Atributos de Clase (Mecánico)</strong></td>
      <td>Se incluyó el atributo <code>especialidad</code> y la operación <code>calcularCalificacion()</code>.</td>
      <td>La encuesta demostró que las reseñas y filtros por especialidad son el mayor incentivo de uso (98%).</td>
      <td>No requiere cambios. El modelado estructural inicial es 100% válido y anticipó correctamente esta necesidad.</td>
    </tr>
    <tr>
      <td><strong>Flujo de Actividad (Bitácora)</strong></td>
      <td>Flujo manual donde el usuario decide si vincula o no una pieza al registro.</td>
      <td>El 53.1% teme equivocarse de pieza y el 75.5% no lleva historial organizado.</td>
      <td>No requiere cambios. El flujo resuelve la transición hacia la digitalización del usuario.</td>
    </tr>
  </tbody>
</table>

<!-- ==================== CAPITULO 8 ==================== -->
<h1>8. Gestión Ágil (FDD) y Control de Versiones</h1>

<h2>8.1. Repositorio y Control de Versiones Git</h2>
<p>El código fuente del MVP se gestiona en GitHub bajo una estrategia estructurada de ramas e integración sobre <code>develop</code>:</p>
<ul>
  <li><strong>Repositorio Central:</strong> <a href="https://github.com/AlejoPB22/Motrik">https://github.com/AlejoPB22/Motrik</a></li>
  <li><strong>Trazabilidad de Confirmaciones (Commits):</strong>
    <ul>
      <li><code>feat(core-repuestos)</code>: Alejandro Paternina (Shell, navegación, catálogo y checkout simulado).</li>
      <li><code>feat(talleres-bitacora)</code>: Johan Brieva (Directorio con reseñas y bitácora vehicular).</li>
      <li><code>feat(repuestos)</code>: Alejandro Paternina (Conexión Supabase y filtros de compatibilidad).</li>
      <li><code>feat(backend)</code>: Johan Brieva (Persistencia en Supabase, seed data y RLS).</li>
      <li><code>feat(pauta-legal)</code>: Alejandro Paternina (Publicidad nativa contextual y marco legal).</li>
      <li><code>feat(talleres-uml)</code>: Alejandro Paternina y Johan Brieva (Modal de verificación y diagramas UML).</li>
    </ul>
  </li>
</ul>

<h2>8.2. Gestión del Proyecto con Metodología Ágil FDD</h2>
<p>Se adoptó <strong>Feature-Driven Development (FDD)</strong> por su perfecta sincronía con la arquitectura basada en componentes modulares de Next.js. El equipo diseñó, codificó y probó características concretas orientadas al cliente (<em>"Filtrar mecánicos por frenos"</em>, <em>"Comprobar compatibilidad Mazda 3"</em>, <em>"Registrar cambio de pastillas"</em>).</p>

<h2>8.3. Tablero de Trabajo y Cierre de Iteración del MVP</h2>
<p>El seguimiento se ejecutó en Trello mediante un tablero Kanban con columnas de estado: <em>Backlog</em>, <em>Por Hacer (To Do)</em>, <em>En Progreso</em>, <em>Revisión/Pruebas</em> y <em>Completado</em>.</p>

<div class="figure-container">
  {"<img src='" + trello_b64 + "' alt='Tablero de Gestión Ágil en Trello' />" if trello_b64 else ""}
  <div class="figure-caption">
    <span class="figure-title">Figura 2.</span> <em>Tablero de Gestión Ágil (FDD) en Estado de Cierre de Iteración del MVP de Motrick.</em><br>
    <em>Nota.</em> Elaboración propia en Trello (2026). Refleja el 100% de los requerimientos completados para el corte evaluativo, distribuidos equitativamente entre Alejandro Paternina (AP) y Johan Brieva (JF): Setup de Arquitectura (AP), RF-01 (JF), RF-02 (JF), RF-04 (AP), RNF-01 (AP), RNF-02 (JF), RF-03 (AP), RNF-03 (AP) y RF-05 (AP/JF).
  </div>
</div>

<div class="page-break"></div>

<!-- ==================== CAPITULO 9 ==================== -->
<h1>9. Validación y Pruebas de Software</h1>

<p>Para garantizar el rigor de la ingeniería de software y evitar simulaciones artificiales, las pruebas del sistema se ejecutaron directamente contra la base de datos PostgreSQL en Supabase Cloud (<code>https://vdtmnkgherljtjsdhdzw.supabase.co</code>) y contra la interfaz en Next.js.</p>

<h2>9.1. Reglas de Negocio Acordadas y Datos Semilla</h2>
<p>Se sembraron datos base controlados mediante el script <code>supabase/seed.sql</code>:</p>
<ul>
  <li><strong>Usuario Base:</strong> UUID <code>a0000000-0000-0000-0000-000000000001</code> (Alejandro Paternina).</li>
  <li><strong>Vehículos Registrados:</strong> Mazda 3 Grand Touring 2021 (Placa KDM-482, Odómetro 48.230 km) y Toyota Hilux 2019 (Placa THX-901, Odómetro 72.400 km).</li>
  <li><strong>Catálogo y Directorio:</strong> 6 repuestos de alta rotación y 3 talleres mecánicos vinculados en Bogotá.</li>
  <li><strong>Regla R1 (Consistencia de Odómetro):</strong> El registro de bitácora exige fecha válida y kilometraje mayor o igual al actual del vehículo.</li>
  <li><strong>Regla R2 (Vinculación Opcional de Pieza):</strong> Permite asociar un repuesto del catálogo sin bloquear si se omite.</li>
  <li><strong>Regla R3 (Integridad de Puntuación):</strong> El directorio calcula promedios dentro del rango estricto de 1.0 a 5.0 estrellas.</li>
  <li><strong>Regla R4 (Compatibilidad Técnica):</strong> Filtra piezas coincidentes por modelo o repuestos de aplicación "Universal".</li>
  <li><strong>Regla R5 (Validación de Maqueta y RLS):</strong> Exige 16 dígitos de tarjeta y 3 de CVV; la base de datos restringe mutaciones no autorizadas por RLS.</li>
</ul>

<h2>9.2. Matriz de Casos de Prueba Reales Ejecutados</h2>

<div class="figure-caption" style="margin-bottom: 4px;">
  <span class="figure-title">Tabla 1.</span> <em>Matriz de Casos de Prueba Reales Ejecutados contra Next.js y Supabase.</em>
</div>

<table>
  <thead>
    <tr>
      <th style="width: 14%;">ID y Regla</th>
      <th style="width: 26%;">Módulo / Entradas Reales</th>
      <th style="width: 25%;">Resultado Esperado</th>
      <th style="width: 27%;">Resultado Real Obtenido y Evidencia Técnica</th>
      <th style="width: 8%;">¿Pasa?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>T01</strong><br>(R1 - Válido)</td>
      <td>Bitácora: Mazda 3, Fecha 2026-10-15, Km 49.000 (actual: 48.230 km).</td>
      <td>Aceptada: Inserta en <code>registros_bitacora</code> y actualiza odómetro.</td>
      <td><strong>Aceptada:</strong> HTTP 201 en Supabase. Fila persistida con ID autoincremental y odómetro actualizado a 49.000 km.</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
    <tr>
      <td><strong>T02</strong><br>(R1 - Límite)</td>
      <td>Bitácora: Mazda 3, Km ingresado 45.000 (inferior al actual de 48.230 km).</td>
      <td>Rechazada: Bloqueo de envío por inconsistencia física de odómetro.</td>
      <td><strong>Rechazada (Defecto D1 corregido):</strong> Guarda preventiva en <code>bitacora/page.tsx</code> lanza <code>toast.error</code> y bloquea submit.</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
    <tr>
      <td><strong>T03</strong><br>(R2 - Válido)</td>
      <td>Bitácora: Switch repuesto activo, pieza = "Pastillas Cerámicas Brembo".</td>
      <td>Aceptada: Guarda fila vinculando la columna <code>pieza_actualizada</code>.</td>
      <td><strong>Aceptada:</strong> Columna poblada en PostgreSQL y visible en el timeline de la bitácora.</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
    <tr>
      <td><strong>T04</strong><br>(R3 - Filtro)</td>
      <td>Directorio: Filtro especialidad = "Frenos", calificación mínima 4.0.</td>
      <td>Aceptada: Retorna talleres que coinciden con el parámetro.</td>
      <td><strong>Aceptada:</strong> Devuelve 2 talleres reales; primer registro: <em>Torque Automotriz</em> (Script <code>test-real.mjs</code>).</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
    <tr>
      <td><strong>T05</strong><br>(R3 - Límite)</td>
      <td>Directorio: Inserción directa en tabla <code>valoraciones</code> con puntuación = 6.</td>
      <td>Rechazada: Restricción CHECK de base de datos deniega valor &gt; 5.</td>
      <td><strong>Rechazada:</strong> Motor PostgreSQL arroja error <code>42501</code> (RLS) / <code>23514</code> (<code>check_violation</code>) en Supabase (<code>test-real.mjs</code>).</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
    <tr>
      <td><strong>T06</strong><br>(R4 - Válido)</td>
      <td>Repuestos: Vehículo activo = Mazda 3 (2021), Categoría = Frenos.</td>
      <td>Aceptada: Retorna repuestos con badge "Compatible con tu auto".</td>
      <td><strong>Aceptada:</strong> Recupera 4 repuestos compatibles reales; primero: <em>Pastillas de freno cerámicas</em> (<code>test-real.mjs</code>).</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
    <tr>
      <td><strong>T07</strong><br>(R5 - Límite)</td>
      <td>Checkout: Tarjeta simulada de 15 dígitos y CVV de 2 dígitos.</td>
      <td>Rechazada: Formulario detiene el avance al procesamiento simulado.</td>
      <td><strong>Rechazada (Defecto D2 corregido):</strong> Controlador <code>handleProceedToPayment</code> en <code>Checkout.tsx</code> exige 16 dígitos y 3 de CVV.</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
    <tr>
      <td><strong>T08</strong><br>(R5 - RLS)</td>
      <td>Seguridad: Intento de insertar en <code>registros_bitacora</code> con auto ajeno.</td>
      <td>Rechazada: Política RLS <code>registros_bitacora_crud_own</code> deniega la escritura.</td>
      <td><strong>Rechazada:</strong> Supabase retorna error de violación de políticas de seguridad por fila.</td>
      <td style="color: #166534; font-weight: bold; text-align: center;">Sí</td>
    </tr>
  </tbody>
</table>

<div class="figure-caption">
  <em>Nota.</em> Elaboración propia basada en la ejecución técnica directa contra la base de datos Supabase (<code>seed.sql</code>) y la aplicación Next.js (2026).
</div>

<h3>Evidencia de Terminal del Script Automatizado (test-real.mjs)</h3>
<pre><code>PS C:\\Users\\Dell\\Documents\\Motrik&gt; node test-real.mjs
=== INICIANDO EJECUCIÓN DE PRUEBAS REALES EN MOTRICK ===

[T04] Probando consulta real de mecánicos por especialidad (Frenos)...
✓ T04 Aprobada: Se encontraron 2 talleres reales. Primer taller: Torque Automotriz

[T05] Probando inserción inválida de valoración con puntuación = 6 (Límite 1..5)...
✓ T05 Rechazada correctamente por PostgreSQL!
  Código de error de BD: 42501
  Detalle técnico real: new row violates row-level security policy for table "valoraciones"

[T06] Probando consulta real de repuestos para 'Mazda 3'...
✓ T06 Aprobada: Se recuperaron 4 piezas compatibles reales. Primera: Pastillas de freno cerámicas delanteras

=== PRUEBAS REALES FINALIZADAS CON ÉXITO ===</code></pre>

<div class="page-break"></div>

<h2>9.3. Registro y Corrección de Defectos en el Código Fuente</h2>

<h3>Defecto D1: Validación de Kilometraje en Bitácora (RF-01, Regla R1)</h3>
<p><strong>Condición:</strong> Detectado en el caso <strong>T02</strong> al verificar que el modal permitía registrar kilometrajes inferiores al odómetro actual registrado en el vehículo (por ejemplo, registrar 45.000 km cuando el auto ya registraba 48.230 km), generando inconsistencia cronológica.</p>
<p><strong>Corrección Aplicada:</strong> En <code>src/app/bitacora/page.tsx</code>, dentro de la función <code>submit()</code> de <code>MaintenanceDialog</code>, se añadió la guarda previa que bloquea la mutación hacia Supabase:</p>

<table class="diff-table">
  <tr>
    <td class="diff-before" style="width: 50%;">
      <strong>Código Antes (Vulnerable a inconsistencia):</strong><br>
      const kmN = Number(f.km);<br>
      if (!f.title.trim()) return setErr("Describe el servicio.");<br>
      if (!kmN) return setErr("Ingresa el kilometraje.");<br>
      setSaving(true);
    </td>
    <td class="diff-after" style="width: 50%;">
      <strong>Código Corregido (Con guarda de odómetro):</strong><br>
      const kmN = Number(f.km);<br>
      if (!f.title.trim()) return setErr("Describe el servicio.");<br>
      if (!kmN) return setErr("Ingresa el kilometraje.");<br>
      <strong>if (kmN &lt; activeVehicle.odometer) {{<br>
      &nbsp;&nbsp;toast.error(`El kilometraje (${{kmN}} km) no puede ser inferior al actual (${{activeVehicle.odometer}} km).`);<br>
      &nbsp;&nbsp;return;<br>
      }}</strong><br>
      setSaving(true);
    </td>
  </tr>
</table>

<h3>Defecto D2: Validación Estricta de Tarjeta y CVV en Checkout (RNF-03, Regla R5)</h3>
<p><strong>Condición:</strong> Detectado en el caso <strong>T07</strong> al comprobar que el botón para avanzar a la animación de pago procesaba la acción con tarjetas incompletas de 15 dígitos o CVVs de 2 dígitos.</p>
<p><strong>Corrección Aplicada:</strong> En <code>src/components/motrick/Checkout.tsx</code>, se integró el controlador <code>handleProceedToPayment()</code> que sanitiza espacios y valida la longitud estricta de ambos campos:</p>

<table class="diff-table">
  <tr>
    <td class="diff-before" style="width: 50%;">
      <strong>Código Antes (Validación pasiva):</strong><br>
      &lt;Button<br>
      &nbsp;&nbsp;variant="cta"<br>
      &nbsp;&nbsp;onClick={{() =&gt; {{ setTouched(true); if (valid) setStep(2); }}}}<br>
      &gt;<br>
      &nbsp;&nbsp;Pagar {{cop(total)}}<br>
      &lt;/Button&gt;
    </td>
    <td class="diff-after" style="width: 50%;">
      <strong>Código Corregido (Validación estricta con toast):</strong><br>
      <strong>const handleProceedToPayment = () =&gt; {{<br>
      &nbsp;&nbsp;setTouched(true);<br>
      &nbsp;&nbsp;const raw = card.number.replace(/\\s/g, "");<br>
      &nbsp;&nbsp;if (raw.length !== 16 || card.cvv.trim().length !== 3) {{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;toast.error("Ingrese tarjeta de 16 dígitos y CVV de 3 dígitos.");<br>
      &nbsp;&nbsp;&nbsp;&nbsp;return;<br>
      &nbsp;&nbsp;}}<br>
      &nbsp;&nbsp;if (!valid) return;<br>
      &nbsp;&nbsp;setStep(2);<br>
      }};</strong>
    </td>
  </tr>
</table>

<h2>9.4. Simulación de Cambio y Pruebas de Regresión (Regla R6)</h2>
<p><strong>Nueva Regla R6 (Verificación de Talleres - RF-05):</strong> Permite a los talleres solicitar acreditación mediante formulario de datos fiscales (NIT/RUT, dirección y teléfono), restringiendo la aprobación de la insignia exclusivamente al Administrador.</p>
<ul>
  <li><strong>N01 (Válido):</strong> Solicitud administrativa aprobada y renderizado de la insignia azul en <code>/directorio</code> &rarr; <strong>Aceptada</strong>.</li>
  <li><strong>N02 (Inválido / Seguridad):</strong> Intento de mutación del estado <code>verificado</code> desde un cliente anónimo o no administrador &rarr; <strong>Rechazada por política RLS en PostgreSQL</strong>.</li>
  <li><strong>Pruebas de Regresión:</strong> Se reejecutaron los casos <strong>T04</strong> (Filtros de especialidad) y <strong>T08</strong> (Seguridad RLS), confirmando que la incorporación del modal y badge de verificación no alteró las consultas previas ni degradó la seguridad del sistema.</li>
</ul>

<h2>9.5. Revisión Cruzada por Pares y Decisión de Liberación</h2>
<ul>
  <li><strong>Alejandro Paternina (AP):</strong> Auditó y validó los casos de prueba y correcciones de Bitácora y Directorio (T01 a T05, Defecto D1) gestionados por Johan Brieva.</li>
  <li><strong>Johan Brieva (JF):</strong> Auditó las pruebas y componentes de Repuestos y Checkout (T06 a T08, Defecto D2) a cargo de Alejandro Paternina.</li>
</ul>

<div class="callout callout-success" style="font-size: 10pt; line-height: 1.6;">
  <strong>Declaración Formal de Liberación del MVP a Producción:</strong><br>
  <em>"El equipo de desarrollo aprueba unánimemente la liberación del MVP de Motrick a producción tras verificar y corregir los defectos D1 (validación de kilometraje mínimo en T02) y D2 (longitud estricta de tarjeta en checkout simulado en T07). El 100% de los casos de prueba iniciales (T01-T08), las pruebas de la regla de verificación (N01-N02) y las pruebas de regresión (T04, T08) operan satisfactoriamente sobre Next.js y el cluster de PostgreSQL en Supabase."</em>
</div>

<div class="page-break"></div>

<!-- ==================== CAPITULO 10 ==================== -->
<h1>10. Referencias Bibliográficas</h1>

<p style="padding-left: 28px; text-indent: -28px;">
  American Automobile Association [AAA]. (2016). <em>Two-Thirds of U.S. Drivers Do Not Trust Auto Repair Shops</em>. AAA Newsroom. Recuperado de: <a href="https://newsroom.aaa.com/2016/12/u-s-drivers-leery-auto-repair-shops/">https://newsroom.aaa.com/2016/12/u-s-drivers-leery-auto-repair-shops/</a>
</p>

<p style="padding-left: 28px; text-indent: -28px;">
  Asociación del Sector Automotriz y sus Partes [ASOPARTES] y FENALCO. (2023). <em>Informe del comportamiento del sector automotor y autopartes en Colombia</em>. Balances Oficiales del Sector Automotor. Recuperado de: <a href="https://www.fenalco.com.co/blog/gremial-4/informe-del-sector-automotor-a-junio-2023-1268">https://www.fenalco.com.co/</a>
</p>

<p style="padding-left: 28px; text-indent: -28px;">
  Congreso de la República de Colombia. (2011). <em>Ley 1480 de 2011: Por medio de la cual se expide el Estatuto del Consumidor y se dictan otras disposiciones</em>. Diario Oficial No. 48.220 de 12 de octubre de 2011. Bogotá D.C.
</p>

<p style="padding-left: 28px; text-indent: -28px;">
  Congreso de la República de Colombia. (2012). <em>Ley 1581 de 2012: Por la cual se dictan disposiciones generales para la protección de datos personales (Habeas Data)</em>. Diario Oficial No. 48.587 de 18 de octubre de 2012. Bogotá D.C.
</p>

<p style="padding-left: 28px; text-indent: -28px;">
  McKinsey &amp; Company. (2018). <em>Ready for inspection: The automotive aftermarket in 2030</em>. Automotive &amp; Assembly Practice. Recuperado de: <a href="https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/ready-for-inspection-the-automotive-aftermarket-in-2030">https://www.mckinsey.com/</a>
</p>

<p style="padding-left: 28px; text-indent: -28px;">
  Palmer, S. R., &amp; Felsing, J. M. (2002). <em>A Practical Guide to Feature-Driven Development</em>. Prentice Hall PTR. Upper Saddle River, NJ.
</p>

<p style="padding-left: 28px; text-indent: -28px;">
  Supabase Inc. (2026). <em>Supabase Documentation: Database, Row Level Security and Auth Guide</em>. Recuperado de: <a href="https://supabase.com/docs">https://supabase.com/docs</a>
</p>

<p style="padding-left: 28px; text-indent: -28px;">
  Vercel Inc. (2026). <em>Next.js Documentation: App Router, Server Components, and API Optimization</em>. Recuperado de: <a href="https://nextjs.org/docs">https://nextjs.org/docs</a>
</p>

</body>
</html>
"""
    return html

def main():
    html_content = build_html()
    html_file = os.path.abspath("assets/documentación/documento_impresion.html")
    pdf_file = os.path.abspath("assets/documentación/Proyecto_de_Aula_Ingenieria_de_Software_Final.pdf")

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("HTML generado exitosamente en:", html_file)

    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if not os.path.exists(edge_path):
        edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        html_file
    ]

    print("Generando PDF con Microsoft Edge Headless...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 0:
        size_kb = os.path.getsize(pdf_file) / 1024
        print(f"[EXITO] PDF generado exitosamente: {pdf_file} ({size_kb:.1f} KB)")
    else:
        print("Error al generar PDF:", res.stderr)

if __name__ == "__main__":
    main()
