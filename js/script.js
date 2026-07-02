/* =========================================================
   Configuração do EmailJS
   1. Crie uma conta em https://www.emailjs.com/
   2. Em "Email Services", adicione um serviço do tipo Gmail e
      conecte a conta zylossys@gmail.com (login OAuth, sem senha/API key manual).
      -> copie o "Service ID" gerado
   3. Em "Email Templates", crie um template usando os campos
      {{name}}, {{email}}, {{service}}, {{message}}, {{to_email}}
      -> copie o "Template ID" gerado
   4. Em "Account" > "General", copie a "Public Key"
   5. Substitua os três valores abaixo
========================================================= */
const EMAILJS_PUBLIC_KEY = "L9hdQNjtgWGn1YzmE";
const EMAILJS_SERVICE_ID = "service_2g2u9fn";
const EMAILJS_TEMPLATE_ID = "template_d75t9nt";

if (window.emailjs && EMAILJS_PUBLIC_KEY !== "SUA_PUBLIC_KEY_AQUI") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Ano dinâmico no rodapé ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header com sombra ao rolar ---------- */
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  };

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  navToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active");
    const expanded = navToggle.classList.contains("is-active");
    navToggle.setAttribute("aria-expanded", expanded);
  });

  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
    });
  });

  /* ---------- Link ativo no menu conforme a seção visível ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------- Animação de revelação ao rolar ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Botão voltar ao topo ---------- */
  const backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------- Formulário de contato (estático) ---------- */
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      feedback.textContent = "Por favor, preencha todos os campos obrigatórios.";
      feedback.style.color = "#ff6b6b";
      return;
    }

    const name = document.getElementById("name").value.trim();
    const submitBtn = form.querySelector("button[type='submit']");

    if (!window.emailjs || EMAILJS_PUBLIC_KEY === "SUA_PUBLIC_KEY_AQUI") {
      feedback.textContent = "Formulário ainda não configurado. Configure o EmailJS em js/script.js.";
      feedback.style.color = "#ff6b6b";
      return;
    }

    submitBtn.disabled = true;
    feedback.textContent = "Enviando...";
    feedback.style.color = "#9aa5b9";

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        feedback.textContent = `Obrigado, ${name}! Sua mensagem foi enviada. Em breve entraremos em contato.`;
        feedback.style.color = "#00d4ff";
        form.reset();
      })
      .catch(() => {
        feedback.textContent = "Não foi possível enviar sua mensagem agora. Tente novamente ou use o e-mail zylossys@gmail.com.";
        feedback.style.color = "#ff6b6b";
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
});
