import React from 'react';
import { personalProfile } from '../data/portfolioData';
import { useCookieConsent } from '../context/CookieConsentContext';
import { ArrowUpRightIcon, ShieldIcon } from './Icons';

interface LegalPageProps {
  path: '/privacidad' | '/cookies';
}

const STORAGE_ENTRIES = [
  {
    key: 'gf-cookie-consent-v1',
    provider: 'Propio (gianniaferrari.web.app)',
    type: 'localStorage',
    category: 'Estrictamente necesaria / técnica',
    purpose:
      'Registra la elección de privacidad del usuario (necesarias, preferencias, analíticas) y la fecha/hora ISO (updatedAt) para no volver a mostrar el aviso inicial.',
    duration: 'Permanente hasta borrado manual del navegador',
  },
  {
    key: 'gf-studio-calm-mode',
    provider: 'Propio (gianniaferrari.web.app)',
    type: 'localStorage',
    category: 'Preferencias / funcionalidad',
    purpose:
      'Guarda si se activó el modo de movimiento reducido o accesibilidad para mantener esa preferencia visual entre visitas.',
    duration: 'Permanente (solo se persiste si aceptas Preferencias)',
  },
  {
    key: 'gf-studio-lite-mode',
    provider: 'Propio (gianniaferrari.web.app)',
    type: 'localStorage',
    category: 'Preferencias / funcionalidad',
    purpose:
      'Guarda si se habilitó el modo ligero de ahorro gráfico para equipos de menor capacidad.',
    duration: 'Permanente (solo se persiste si aceptas Preferencias)',
  },
] as const;

export const LegalPage: React.FC<LegalPageProps> = ({ path }) => {
  const { navigateTo, openConfig } = useCookieConsent();
  const isPrivacy = path === '/privacidad';

  const handleGoHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateTo('/');
  };

  const handleSwitchRoute = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: '/privacidad' | '/cookies'
  ) => {
    e.preventDefault();
    navigateTo(target);
  };

  return (
    <section
      className="studio-legal-page"
      aria-labelledby="legal-page-title"
    >
      <div className="studio-container studio-legal-container">
        <nav className="studio-legal-topbar" aria-label="Navegación legal">
          <a href="/" onClick={handleGoHome} className="studio-legal-back-btn">
            <span aria-hidden="true">←</span>
            <span>Volver al inicio</span>
          </a>

          <div className="studio-legal-tabs" role="tablist" aria-label="Documentos legales">
            <a
              href="/privacidad"
              onClick={(e) => handleSwitchRoute(e, '/privacidad')}
              className={`studio-legal-tab ${isPrivacy ? 'is-active' : ''}`}
              aria-current={isPrivacy ? 'page' : undefined}
            >
              Política de Privacidad
            </a>
            <a
              href="/cookies"
              onClick={(e) => handleSwitchRoute(e, '/cookies')}
              className={`studio-legal-tab ${!isPrivacy ? 'is-active' : ''}`}
              aria-current={!isPrivacy ? 'page' : undefined}
            >
              Política de Cookies
            </a>
            <button
              type="button"
              className="studio-legal-tab studio-legal-tab-action"
              onClick={openConfig}
            >
              <ShieldIcon size={14} />
              <span>Configurar cookies</span>
            </button>
          </div>
        </nav>

        <header className="studio-legal-header">
          <p className="studio-legal-kicker">
            Información legal y cumplimiento · Última actualización: Noviembre 2026
          </p>
          <h1 id="legal-page-title" className="studio-legal-title">
            {isPrivacy
              ? 'Política de Privacidad'
              : 'Política de Cookies y Almacenamiento Local'}
          </h1>
          <p className="studio-legal-lead">
            {isPrivacy
              ? `Este documento describe de manera transparente cómo se tratan los datos en el portafolio web de ${personalProfile.name} (gianniaferrari.web.app).`
              : `Detalle verificable sobre el uso de almacenamiento local (localStorage) y ausencia de cookies publicitarias en el portafolio de ${personalProfile.name}.`}
          </p>
        </header>

        {isPrivacy ? (
          <article className="studio-legal-body">
            <section className="studio-legal-card">
              <h2>1. Responsable del tratamiento y contacto directo</h2>
              <p>
                El responsable de este sitio web es <strong>{personalProfile.name}</strong>,{' '}
                {personalProfile.roleTag}, con residencia en {personalProfile.location}.
              </p>
              <ul className="studio-legal-list">
                <li>
                  <strong>Sitio web:</strong>{' '}
                  <a
                    href="https://gianniaferrari.web.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://gianniaferrari.web.app
                  </a>
                </li>
                <li>
                  <strong>Correo electrónico de contacto:</strong>{' '}
                  <a href={`mailto:${personalProfile.contact.email}`}>
                    {personalProfile.contact.email}
                  </a>
                </li>
                <li>
                  <strong>Domicilio legal / comercial:</strong>{' '}
                  <span>[COMPLETAR_DOMICILIO_O_LOCALIDAD si corresponde]</span>
                </li>
              </ul>
            </section>

            <section className="studio-legal-card">
              <h2>2. Qué datos se recopilan realmente y con qué finalidad</h2>
              <p>
                Este sitio web tiene carácter informativo y de presentación profesional.{' '}
                <strong>
                  No incluye registro de usuarios, cuentas privadas ni bases de datos de clientes.
                </strong>
              </p>
              <p>
                Cuando utilizas el <strong>formulario de contacto</strong>, los campos ingresados
                (nombre o empresa, correo electrónico, área de interés seleccionada y contenido del
                mensaje) se procesan únicamente de forma local en tu navegador para componer un
                enlace <code>mailto:</code> que abre tu aplicación de correo predeterminada hacia{' '}
                <strong>{personalProfile.contact.email}</strong>.
              </p>
              <p>
                Si decides enviarme un correo electrónico directamente, tus datos de contacto y el
                mensaje recibido se utilizan exclusivamente para responder a tu consulta técnica,
                propuesta laboral o colaboración profesional.
              </p>
            </section>

            <section className="studio-legal-card">
              <h2>3. Base legal, conservación e infraestructura tecnológica</h2>
              <ul className="studio-legal-list">
                <li>
                  <strong>Base legitimadora:</strong> el consentimiento libre del usuario al iniciar
                  contacto voluntario por correo electrónico o configurar sus preferencias de
                  almacenamiento local.
                </li>
                <li>
                  <strong>Infraestructura de alojamiento (Firebase Hosting / Google Cloud):</strong>{' '}
                  la aplicación estática se sirve mediante Firebase Hosting. Como cualquier servidor
                  web estándar, la infraestructura de red puede registrar temporalmente metadatos
                  técnicos mínimos de conexión (como dirección IP, fecha/hora y tipo de navegador)
                  para garantizar la disponibilidad, mitigación de abusos y entrega segura vía HTTPS.
                </li>
                <li>
                  <strong>Tipografías externas (Google Fonts):</strong> el navegador solicita las
                  fuentes tipográficas a los servidores de Google Fonts para renderizar el diseño
                  del sitio sin instalar cookies de seguimiento publicitario desde este dominio.
                </li>
                <li>
                  <strong>Conservación:</strong> el sitio no almacena mensajes de formulario en
                  servidores propios. Las comunicaciones recibidas por correo electrónico se
                  conservan únicamente el tiempo necesario para gestionar la conversación
                  profesional solicitada.
                </li>
              </ul>
            </section>

            <section className="studio-legal-card">
              <h2>4. Derechos del titular de los datos (Ley N° 25.326 — Argentina)</h2>
              <p>
                De acuerdo con la Ley N° 25.326 de Protección de Datos Personales de la República
                Argentina y los estándares internacionales de privacidad aplicables, puedes ejercer en
                cualquier momento tus derechos de:
              </p>
              <ul className="studio-legal-list">
                <li>
                  <strong>Acceso:</strong> conocer si tus datos personales están siendo tratados y
                  obtener información clara al respecto.
                </li>
                <li>
                  <strong>Rectificación y actualización:</strong> solicitar la corrección de datos
                  inexactos o incompletos.
                </li>
                <li>
                  <strong>Supresión / Eliminación:</strong> pedir el borrado definitivo de correos o
                  datos de contacto que me hayas enviado previamente.
                </li>
              </ul>
              <p>
                Para ejercer cualquiera de estos derechos, escribe directamente a{' '}
                <a href={`mailto:${personalProfile.contact.email}`}>
                  {personalProfile.contact.email}
                </a>{' '}
                indicando el asunto de tu solicitud. Asimismo, se informa que la{' '}
                <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>, órgano de
                control de la Ley N° 25.326 en Argentina, tiene la atribución de atender las
                denuncias y reclamos respecto al incumplimiento de las normas sobre protección de
                datos personales.
              </p>
            </section>

            <section className="studio-legal-card">
              <h2>5. Medidas de seguridad y enlaces externos</h2>
              <p>
                Toda la comunicación hacia este portafolio opera bajo cifrado de transporte{' '}
                <strong>HTTPS / TLS</strong>. Los enlaces salientes hacia plataformas externas
                (GitHub, LinkedIn, Biofuego, Radio Gravity) redirigen a sitios de terceros o
                proyectos independientes cuyas políticas propias aplican al navegar en ellos.
              </p>
            </section>
          </article>
        ) : (
          <article className="studio-legal-body">
            <section className="studio-legal-card">
              <h2>1. ¿Qué son las cookies y el almacenamiento local?</h2>
              <p>
                Las <strong>cookies</strong> son pequeños archivos de texto que los sitios web
                pueden guardar en tu navegador. De forma complementaria, el{' '}
                <strong>almacenamiento local (<code>localStorage</code>)</strong> permite guardar
                claves de configuración directamente en tu dispositivo sin enviarse automáticamente en
                cada solicitud HTTP al servidor.
              </p>
              <p>
                Actualmente, este portafolio{' '}
                <strong>no instala cookies HTTP tradicionales ni trackers publicitarios</strong>, y
                utiliza únicamente claves técnicas y de preferencias visuales en{' '}
                <code>localStorage</code> bajo tu control explícito.
              </p>
            </section>

            <section className="studio-legal-card">
              <h2>2. Inventario real de claves técnicas y de preferencias</h2>
              <p>
                A continuación se listan exactamente las únicas claves presentes en el código de la
                aplicación:
              </p>

              <div className="studio-legal-table-wrap">
                <table className="studio-legal-table">
                  <thead>
                    <tr>
                      <th scope="col">Clave</th>
                      <th scope="col">Tipo / Proveedor</th>
                      <th scope="col">Categoría</th>
                      <th scope="col">Finalidad específica</th>
                      <th scope="col">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STORAGE_ENTRIES.map((entry) => (
                      <tr key={entry.key}>
                        <td>
                          <code>{entry.key}</code>
                        </td>
                        <td>
                          <span>{entry.type}</span>
                          <small className="studio-legal-cell-sub">{entry.provider}</small>
                        </td>
                        <td>{entry.category}</td>
                        <td>{entry.purpose}</td>
                        <td>{entry.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="studio-legal-card">
              <h2>3. Analíticas y servicios de terceros</h2>
              <p>
                Este sitio <strong>no tiene activado Google Analytics, Firebase Analytics</strong>,
                píxeles publicitarios ni herramientas de perfilado comercial de terceros. La
                categoría opcional de analíticas permanece desactivada por defecto salvo autorización
                expresa, y no carga scripts externos de seguimiento mientras no exista una
                integración declarada.
              </p>
            </section>

            <section className="studio-legal-card">
              <h2>4. Cómo cambiar tus preferencias o borrar datos del navegador</h2>
              <p>
                Puedes modificar tu elección en cualquier momento desde el panel de consentimiento de
                este sitio:
              </p>
              <div className="studio-legal-cta-row">
                <button
                  type="button"
                  className="studio-cookie-btn-primary"
                  onClick={openConfig}
                >
                  <ShieldIcon size={15} />
                  <span>Abrir panel de preferencias de cookies</span>
                </button>
                <a
                  href="/privacidad"
                  onClick={(e) => handleSwitchRoute(e, '/privacidad')}
                  className="studio-cookie-btn-secondary"
                >
                  <span>Leer Política de Privacidad</span>
                  <ArrowUpRightIcon size={14} />
                </a>
              </div>

              <p className="studio-legal-browsers-intro">
                También puedes revisar o eliminar datos almacenados directamente desde tu navegador:
              </p>
              <ul className="studio-legal-list">
                <li>
                  <strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Datos de
                  sitios en el dispositivo.
                </li>
                <li>
                  <strong>Mozilla Firefox:</strong> Ajustes → Privacidad y seguridad → Cookies y
                  datos del sitio.
                </li>
                <li>
                  <strong>Apple Safari:</strong> Ajustes → Privacidad → Gestionar datos de sitios
                  web.
                </li>
                <li>
                  <strong>Microsoft Edge:</strong> Configuración → Cookies y permisos del sitio →
                  Administrar y eliminar cookies y datos del sitio.
                </li>
              </ul>
            </section>
          </article>
        )}
      </div>
    </section>
  );
};
