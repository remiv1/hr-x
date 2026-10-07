/**
 * HR-X — Scrollytelling de la page « La brisure du CV ».
 *
 * Les scènes sont superposées en position fixe : le scroll ne fait pas défiler
 * la page, il pilote une timeline maîtresse qui enchaîne les scènes en fondu.
 * Une unité de timeline = une scène = 100vh de piste de défilement.
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const scenes = gsap.utils.toArray(".story-scenes .scene");
  const intro = document.querySelector("#scene-intro");
  const storyScenes = scenes.filter(function (el) { return el !== intro; });
  const track = document.querySelector(".story-track");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !scenes.length || !track) {
    revealAll();
    return;
  }

  document.body.classList.add("story--fx");
  track.style.height = storyScenes.length * 100 + "vh";

  const FADE = 0.3; // part de la scène consacrée à chaque fondu

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
    },
  });

  gsap.set(intro, { autoAlpha: 1 });

  storyScenes.forEach(function (el, i) {
    master.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: FADE, ease: "none" }, i);

    if (i < storyScenes.length - 1) {
      master.to(el, { autoAlpha: 0, duration: FADE, ease: "none" }, i + 1 - FADE);
    }
  });

  gsap.to(intro, {
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "top+=100vh top",
      scrub: 0.6,
    },
  });

  /** Cible les éléments marqués `data-anim` dans une scène donnée. */
  function anim(sceneId, name) {
    return gsap.utils.toArray('#' + sceneId + ' [data-anim="' + name + '"]');
  }

  /** Insère la chorégraphie d'une scène dans la timeline maîtresse. */
  function scene(sceneId) {
    const index = storyScenes.indexOf(document.getElementById(sceneId));
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    master.add(tl, index + FADE);
    return tl;
  }

  gsap.fromTo(
    intro.querySelector(".intro__eyebrow"),
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
  );
  gsap.fromTo(
    intro.querySelector(".intro__title"),
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 0.18, ease: "power3.out" }
  );
  gsap.fromTo(
    intro.querySelector(".intro__prompt"),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7, delay: 0.65, ease: "power2.out" }
  );
  gsap.fromTo(
    intro.querySelectorAll("[data-intro-chevron]"),
    { opacity: 0, y: -8 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.95, stagger: 0.16, ease: "power2.out" }
  );
  gsap.to(intro.querySelectorAll("[data-intro-chevron]"), {
    opacity: 0.72,
    y: 5,
    duration: 0.9,
    delay: 1.9,
    stagger: 0.16,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // ---- Apparition du bloc de texte de chaque scène ----
  storyScenes.forEach(function (el, i) {
    const text = el.querySelector(".scene__text, .punch-line");
    if (text) {
      master.fromTo(text, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: FADE, ease: "power2.out" }, i + 0.05);
    }
  });

  // ---- Scène 1 : le candidat arrive devant le bâtiment ----
  scene("scene-1")
    .from(anim("scene-1", "building"), { opacity: 0, y: 24, duration: 0.16 })
    .from(anim("scene-1", "window"), { opacity: 0, scale: 0.6, stagger: 0.01, transformOrigin: "center", duration: 0.08 }, "-=0.08")
    .from(anim("scene-1", "candidate"), { opacity: 0, x: -110, duration: 0.2 }, "-=0.06")
    .from(anim("scene-1", "door"), { opacity: 0, duration: 0.1 }, "-=0.06");

  // ---- Scène 2 : la pensée se remplit de données riches ----
  scene("scene-2")
    .from(anim("scene-2", "candidate"), { opacity: 0, y: 24, duration: 0.12 })
    .from(anim("scene-2", "bubble-dot"), { opacity: 0, scale: 0, stagger: 0.03, transformOrigin: "center", duration: 0.06 })
    .from(anim("scene-2", "bubble"), { opacity: 0, scale: 0.7, transformOrigin: "20% 80%", duration: 0.14 })
    .from(anim("scene-2", "thought"), { opacity: 0, scale: 0.5, stagger: 0.04, transformOrigin: "center", ease: "back.out(2)", duration: 0.12 }, "-=0.05");

  // ---- Scène 2 bis : le candidat se dédouble, la donnée se fragmente ----
  (function () {
    const tl = scene("scene-2bis");
    anim("scene-2bis", "split").forEach(function (clone) {
      tl.fromTo(
        clone,
        { x: 0, opacity: 0.2, scale: 1 },
        { x: parseFloat(clone.dataset.dx), opacity: 1, scale: 0.82, duration: 0.26 },
        0
      );
    });
    tl.from(anim("scene-2bis", "shard"), { opacity: 0, y: -26, stagger: 0.02, duration: 0.12 }, 0.14);
  })();

  // ---- Scène 3 : l'offre descend sur le candidat ----
  scene("scene-3")
    .from(anim("scene-3", "candidate"), { opacity: 0, duration: 0.1 })
    .from(anim("scene-3", "offer"), { y: -240, opacity: 0, duration: 0.24, ease: "power3.out" }, "-=0.05");

  // ---- Scène 4 : les mots-clés filtrent, le reste disparaît ----
  scene("scene-4")
    .from(anim("scene-4", "keyword"), { opacity: 0, y: -34, stagger: 0.03, duration: 0.12 })
    .from(anim("scene-4", "kept"), { opacity: 0, x: -34, duration: 0.1 }, "-=0.04")
    .to(anim("scene-4", "dropped"), { opacity: 0.12, scaleX: 0.25, transformOrigin: "left center", stagger: 0.03, duration: 0.16 });

  // ---- Scène 5 : la presse écrase la donnée riche ----
  scene("scene-5")
    .from(anim("scene-5", "rich"), { opacity: 0, y: 24, duration: 0.12 })
    .to(anim("scene-5", "press"), { y: 70, duration: 0.14, ease: "power2.in" })
    .to(anim("scene-5", "rich"), { scaleY: 0.08, opacity: 0.25, transformOrigin: "center bottom", duration: 0.1 }, "<")
    .fromTo(anim("scene-5", "flat"), { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.12 })
    .to(anim("scene-5", "press"), { y: 0, duration: 0.12 }, "<");

  // ---- Scène 6 : le CV traverse le tuyau ----
  scene("scene-6")
    .fromTo(anim("scene-6", "cv"), { x: 0 }, { x: 300, duration: 0.4, ease: "none" });

  // ---- Scène 7 : l'ATS regonfle la donnée avec des scores de confiance ----
  scene("scene-7")
    .from(anim("scene-7", "robot"), { opacity: 0, scale: 0.8, transformOrigin: "center", duration: 0.14 })
    .from(anim("scene-7", "inflated"), { opacity: 0, scale: 0.3, transformOrigin: "center", stagger: 0.04, ease: "back.out(2.4)", duration: 0.14 }, "-=0.05");

  // ---- Scène 7 bis : trois systèmes, trois vérités ----
  scene("scene-7bis")
    .from(anim("scene-7bis", "system"), { opacity: 0, y: 34, stagger: 0.04, duration: 0.14 })
    .from(anim("scene-7bis", "alert"), { opacity: 0, scale: 0.6, transformOrigin: "center", duration: 0.12 }, "-=0.04");

  gsap.to(anim("scene-7bis", "alert"), {
    opacity: 0.25,
    duration: 0.45,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  // ---- Scène 8 : le bras robotique range mal les blocs ----
  scene("scene-8")
    .from(anim("scene-8", "arm"), { opacity: 0, rotate: -25, transformOrigin: "60px 40px", duration: 0.14 })
    .from(anim("scene-8", "grab"), { opacity: 0, duration: 0.06 }, "-=0.05")
    .from(anim("scene-8", "block-ok"), { opacity: 0, x: -110, stagger: 0.04, duration: 0.12 })
    .to(anim("scene-8", "block-wrong"), { x: 96, rotate: 6, duration: 0.14 })
    .to(anim("scene-8", "block-out"), { y: -10, rotate: -10, duration: 0.12 }, "-=0.07");

  // ---- Scène 9 : le recruteur face au dossier reconstruit ----
  scene("scene-9")
    .from(anim("scene-9", "folder"), { opacity: 0, x: 70, duration: 0.16 })
    .from(anim("scene-9", "recruiter"), { opacity: 0, x: -50, duration: 0.14 }, "-=0.1")
    .from(anim("scene-9", "question"), { opacity: 0, y: 18, scale: 0.5, transformOrigin: "center", ease: "back.out(3)", duration: 0.12 }, "-=0.04");

  // ---- Scène 10 : la phrase choc se stabilise ----
  scene("scene-10")
    .fromTo(".punch-line", { scale: 0.92, filter: "blur(10px)" }, { scale: 1, filter: "blur(0px)", duration: 0.26 })
    .to(".punch-line em", { scale: 1.05, duration: 0.14 }, "-=0.06");

  // ---- Scène 11 : compteurs et jauges ----
  (function () {
    const tl = scene("scene-11");
    tl.from(anim("scene-11", "figure"), { opacity: 0, y: 26, stagger: 0.04, duration: 0.14 });

    gsap.utils.toArray("#scene-11 .figure-card__value").forEach(function (el) {
      const suffix = el.dataset.countSuffix || "";
      const state = { value: 0 };
      tl.to(
        state,
        {
          value: parseFloat(el.dataset.countTo),
          duration: 0.28,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = Math.round(state.value) + suffix;
          },
        },
        0.08
      );
    });

    gsap.utils.toArray("#scene-11 [data-bar]").forEach(function (bar) {
      tl.to(bar, { width: bar.dataset.bar + "%", duration: 0.28, ease: "power2.out" }, 0.08);
    });
  })();

  // ---- Scène 12 : la donnée structurée réapparaît ----
  scene("scene-12")
    .from(anim("scene-12", "code"), { opacity: 0, y: 34, duration: 0.18 })
    .from(".outro-cta", { opacity: 0, y: 18, duration: 0.1 }, "-=0.06");

  // ---- Barre de progression de lecture ----
  gsap.to("[data-progress-bar]", {
    width: "100%",
    ease: "none",
    scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });

  /** Affichage statique complet, sans animation (mouvement réduit). */
  function revealAll() {
    gsap.set(".scene", { autoAlpha: 1, clearProps: "transform" });
    gsap.utils.toArray("#scene-11 .figure-card__value").forEach(function (el) {
      el.textContent = el.dataset.countTo + (el.dataset.countSuffix || "");
    });
    gsap.utils.toArray("#scene-11 [data-bar]").forEach(function (bar) {
      bar.style.width = bar.dataset.bar + "%";
    });
  }
})();
