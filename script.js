let revealItems = document.querySelectorAll("[data-reveal]");
const loadScreen = document.querySelector(".load-screen");
const loadNumber = document.querySelector(".load-copy strong");
const fluidCursor = document.querySelector(".fluid-cursor");
const toneButtons = document.querySelectorAll(".tone-shift");
const liquidHero = document.querySelector(".liquid-hero");
const lightbox = document.querySelector(".image-lightbox");
const lightboxImage = document.querySelector(".image-lightbox img");
const reserveInner = document.querySelector(".reserve-inner");
const generatePlan = document.querySelector(".generate-plan");
const sceneSelect = document.querySelector(".scene-select");

const revealTargetSelector = [
  ".intro-line",
  "h2",
  "h3",
  "p",
  "blockquote",
  "img",
  "figcaption",
  "form",
  "label",
  "input",
  "select",
  ".swatch-strip span",
  ".trial-card"
].join(",");

document.querySelectorAll("main > section:not(.hero)").forEach((section) => {
  const targets = [...section.querySelectorAll(revealTargetSelector)].filter((target) => {
    return !target.closest(".hero") && !target.closest(".image-lightbox") && !target.closest(".load-screen");
  });

  targets.forEach((target, index) => {
    target.classList.add("float-reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index * 55, 330)}ms`);
  });
});

revealItems = document.querySelectorAll("[data-reveal], .float-reveal");

const glowPalettes = [
  ["#f8f29e", "#e24d26", "#f07040", "#f0d0a0"],
  ["#f8f29e", "#e24d26", "#26b8d8", "#d8b8ee"],
  ["#f8f29e", "#f3b321", "#e24d26", "#fff6c8"],
  ["#050505", "#004060", "#f09030", "#e60012"],
  ["#501020", "#e24d26", "#ece8dd", "#fff4df"],
  ["#004060", "#e83c22", "#ead8e6", "#050505"]
];

let paletteIndex = 0;

function applyPalette(index) {
  const palette = glowPalettes[index % glowPalettes.length];
  document.documentElement.style.setProperty("--glow-a", palette[0]);
  document.documentElement.style.setProperty("--glow-b", palette[1]);
  document.documentElement.style.setProperty("--glow-c", palette[2]);
  document.documentElement.style.setProperty("--glow-d", palette[3]);
}

let progress = 0;
const loaderTimer = window.setInterval(() => {
  progress = Math.min(progress + Math.ceil(Math.random() * 7), 100);
  if (loadNumber) {
    loadNumber.textContent = String(progress);
  }
  if (progress >= 100) {
    window.clearInterval(loaderTimer);
    window.setTimeout(() => loadScreen?.classList.add("is-done"), 720);
  }
}, 140);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
  revealObserver.observe(item);
});

const warmth = document.querySelector("#warmth");
const heroLab = document.querySelector(".sunset-lab");

function setWarmth(value) {
  const amount = Number(value) / 100;
  heroLab.style.setProperty("filter", `saturate(${1 + amount * 0.28}) brightness(${0.94 + amount * 0.1})`);
  document.querySelector(".ring-a").style.transform = `scale(${0.92 + amount * 0.16}) rotate(${amount * 14}deg)`;
  document.querySelector(".ring-b").style.transform = `scale(${0.9 + amount * 0.18}) rotate(${-amount * 10}deg)`;
  document.querySelector(".core").style.opacity = `${0.72 + amount * 0.28}`;
}

if (warmth && heroLab) {
  setWarmth(warmth.value);
  warmth.addEventListener("input", (event) => setWarmth(event.target.value));
}

toneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    paletteIndex += 1;
    applyPalette(paletteIndex);
    liquidHero?.classList.add("is-shifting");
    window.setTimeout(() => liquidHero?.classList.remove("is-shifting"), 520);
  });
});

function moveFluid(event) {
  if (!fluidCursor) return;
  const point = event.touches?.[0] || event;
  document.documentElement.style.setProperty("--cursor-x", `${point.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${point.clientY}px`);

  if (liquidHero) {
    const rect = liquidHero.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((point.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((point.clientY - rect.top) / rect.height) * 100));
    const scatterX = (x - 50) * 1.15;
    const scatterY = (y - 50) * 0.85;
    document.documentElement.style.setProperty("--mx", `${x}%`);
    document.documentElement.style.setProperty("--my", `${y}%`);
    document.documentElement.style.setProperty("--scatter-x", `${scatterX}px`);
    document.documentElement.style.setProperty("--scatter-y", `${scatterY}px`);
  }
}

window.addEventListener("pointermove", moveFluid, { passive: true });
window.addEventListener("touchmove", moveFluid, { passive: true });

window.addEventListener(
  "scroll",
  () => {
    const scrollRatio = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty("--scroll-glow", `${Math.round(scrollRatio * 100)}%`);
  },
  { passive: true }
);

const productData = {
  disc: {
    kicker: "DISC SUNSET LAMP",
    title: "圆盘落日灯",
    description:
      "圆形灯罩把暮色压成一片柔软的琥珀光晕，适合床头、边几和睡前阅读。光线向下铺开，让房间像黄昏停在墙面。",
    className: "disc-3d",
    markup: '<i class="shade"></i><i class="stem"></i><i class="base"></i><i class="light"></i>'
  },
  cloud: {
    kicker: "STACKED CLOUD LAMP",
    title: "层叠云朵灯",
    description:
      "双层灯罩形成云朵般的柔和边界，适合需要更亲密、更低眩光的卧室角落。它像一小段被折叠起来的落日。",
    className: "cloud-3d",
    markup: '<i class="shade top"></i><i class="shade bottom"></i><i class="stem"></i><i class="base"></i>'
  },
  red: {
    kicker: "EMBER BEAD LAMP",
    title: "红色叠球灯",
    description:
      "高饱和红色造型带来更强的装饰性，适合梳妆台、玄关和独处角落。它把黄昏最后一瞬的霞光留成雕塑。",
    className: "red-3d",
    markup: '<i class="dome"></i><i class="bead one"></i><i class="bead two"></i><i class="bead three"></i>'
  },
  umbrella: {
    kicker: "SOFT UMBRELLA LAMP",
    title: "柔黄伞形灯",
    description:
      "伞形灯罩让暖光从中心慢慢散开，减少直射刺激，更适合入睡前的身体节律。它像房间里安静展开的一段黄昏。",
    className: "umbrella-3d",
    markup: '<i class="canopy"></i><i class="stem"></i><i class="base"></i>'
  },
  arc: {
    kicker: "ARC NIGHT LAMP",
    title: "弧线夜灯",
    description:
      "弧线结构把光从桌面轻轻提起，适合睡前陪伴、低亮阅读和夜间留光。柔和的轮廓让光线有了可以停靠的方向。",
    className: "arc-3d",
    markup: '<i class="arc"></i><i class="shade"></i><i class="base"></i>'
  },
  dome: {
    kicker: "DUSK DOME LAMP",
    title: "霞光穹顶灯",
    description:
      "饱和的霞光红把黄昏中最有温度的一瞬留下，穹顶灯罩让光线向下铺开，适合空间里需要一点情绪重心的位置。",
    className: "dome-3d",
    markup: '<i class="cap"></i><i class="stem"></i><i class="base"></i><i class="halo"></i>'
  },
  mushroom: {
    kicker: "BLUE DUSK LAMP",
    title: "蓝暮蘑菇灯",
    description:
      "深蓝灯罩像夜幕刚刚覆盖黄昏的边界，让暖色品牌系统里多出一处安静的冷调停顿，适合床边或阅读角。",
    className: "mushroom-3d",
    markup: '<i class="cap"></i><i class="neck"></i><i class="base"></i>'
  }
};

const detailLamp = document.querySelector("#detail-lamp");
if (detailLamp) {
  const params = new URLSearchParams(window.location.search);
  const product = productData[params.get("product")] || productData.disc;
  document.querySelector("#product-kicker").textContent = product.kicker;
  document.querySelector("#product-title").textContent = product.title;
  document.querySelector("#product-description").textContent = product.description;
  detailLamp.className = `lamp-3d ${product.className} is-detail`;
  detailLamp.innerHTML = product.markup;
}

const sceneThemes = {
  read: {
    colors: ["#fff4b8", "#f3b321", "#6f4a22", "#2b170f"],
    title: "书页余晖",
    copy: "阅读 20 分钟适合偏明亮的金色暖光，文字更清晰，房间仍然保持松弛。"
  },
  relax: {
    colors: ["#ffd08a", "#ec892f", "#784b38", "#2b170f"],
    title: "卧室暖橙",
    copy: "卧室放松适合更柔软的橙调，让床边和墙面像被日落轻轻包住。"
  },
  alone: {
    colors: ["#2f406f", "#8f4a76", "#171321", "#fff6e8"],
    title: "深夜蓝暮",
    copy: "深夜独处适合低亮度蓝紫暮色，把环境压低一点，留出安静的私人感。"
  },
  soft: {
    colors: ["#f1c7d6", "#f08a6a", "#6a3c4a", "#2b170f"],
    title: "柔光粉霞",
    copy: "柔光陪伴适合粉霞和暖橙之间的轻柔过渡，陪伴感更强，也不刺眼。"
  }
};

function applySceneTheme(value) {
  if (!reserveInner) return;
  const theme = sceneThemes[value] || sceneThemes.read;
  const [sceneA, sceneB, sceneC, sceneText] = theme.colors;
  reserveInner.style.setProperty("--scene-a", sceneA);
  reserveInner.style.setProperty("--scene-b", sceneB);
  reserveInner.style.setProperty("--scene-c", sceneC);
  reserveInner.style.setProperty("--scene-text", sceneText);

  const trialTitle = reserveInner.querySelector(".trial-card strong");
  const trialCopy = reserveInner.querySelector(".trial-card p");
  if (trialTitle) trialTitle.textContent = theme.title;
  if (trialCopy) trialCopy.textContent = theme.copy;
}

if (sceneSelect) {
  applySceneTheme(sceneSelect.value);
  sceneSelect.addEventListener("change", (event) => {
    applySceneTheme(event.target.value);
    reserveInner?.classList.add("is-generated");
  });
}

generatePlan?.addEventListener("click", () => {
  applySceneTheme(sceneSelect?.value || "read");
  reserveInner?.classList.add("is-generated");
});

document.querySelectorAll(".zoomable-image").forEach((image) => {
  image.addEventListener("click", (event) => {
    if (!lightbox || !lightboxImage) return;
    event.preventDefault();
    event.stopPropagation();
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    document.body.classList.add("is-lightbox-open");
    lightbox.classList.add("is-open");
  });
});

lightbox?.addEventListener("click", () => {
  lightbox.classList.remove("is-open");
  document.body.classList.remove("is-lightbox-open");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("is-lightbox-open");
  }
});
