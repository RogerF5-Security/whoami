(() => {
  const profile = window.WHOAMI_PROFILE;
  const app = document.getElementById("app");
  const boot = document.getElementById("boot");
  const bootLog = document.getElementById("bootLog");
  const terminalBody = document.getElementById("terminalBody");
  const output = document.getElementById("output");
  const form = document.getElementById("commandForm");
  const input = document.getElementById("commandInput");
  const terminalDetails = document.querySelector(".terminal-details");

  const state = {
    history: [],
    historyIndex: -1,
    theme: "green"
  };

  const files = {
    "cv.txt": renderCv,
    "skills.txt": renderSkills,
    "certs.txt": renderCerts,
    "projects.txt": renderProjects,
    "videos.txt": renderVideos,
    "contact.txt": renderContact,
    "toolbox.txt": renderToolbox
  };

  const bootLines = [
    "[ OK ] loading Roger F5 profile",
    "[ OK ] preparing HR-readable sections",
    "[ OK ] mounting optional terminal mode",
    "[ OK ] portfolio ready"
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function link(label, href) {
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
  }

  function compactUrl(href) {
    try {
      const url = new URL(href);
      return `${url.hostname}${url.pathname}`.replace(/\/$/, "");
    } catch (error) {
      return href;
    }
  }

  function socialIcon(label) {
    const icons = {
      GitHub:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2c-3.13.68-3.79-1.34-3.79-1.34-.51-1.31-1.25-1.66-1.25-1.66-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1 2.63.71 3.23.54.1-.73.39-1.23.71-1.52-2.5-.28-5.13-1.25-5.13-5.58 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.99 0 0 .95-.3 3.1 1.16a10.64 10.64 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.56.23 2.71.11 2.99.72.79 1.16 1.8 1.16 3.03 0 4.34-2.64 5.29-5.15 5.57.4.35.76 1.04.76 2.1v3.12c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z"/></svg>',
      LinkedIn:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.01 2.5 2.5 0 0 1 0-5.01ZM3 9.9h4v10.6H3V9.9Zm6.2 0h3.83v1.45h.05c.53-.95 1.84-1.75 3.78-1.75 4.04 0 4.79 2.43 4.79 5.58v5.32h-4v-4.72c0-1.13-.02-2.58-1.72-2.58-1.72 0-1.98 1.23-1.98 2.5v4.8h-4V9.9Z"/></svg>',
      Credly:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4.8 5.1v5.5c0 4.55 2.9 8.85 7.2 10.4 4.3-1.55 7.2-5.85 7.2-10.4V5.1L12 2Zm0 3.08 4.4 1.9v3.62c0 3.08-1.72 6.03-4.4 7.34-2.68-1.31-4.4-4.26-4.4-7.34V6.98l4.4-1.9Zm-.85 3.05 2.1 2.7 3.23.84-2 2.65.18 3.33L12 15.8l-3.06 1.35.18-3.33-2-2.65 3.23-.84 2.1-2.7Z"/></svg>',
      YouTube:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 7.15a3 3 0 0 0-2.11-2.13C18.03 4.5 12 4.5 12 4.5s-6.03 0-7.89.52A3 3 0 0 0 2 7.15 31.2 31.2 0 0 0 1.5 12c0 1.62.17 3.25.5 4.85a3 3 0 0 0 2.11 2.13c1.86.52 7.89.52 7.89.52s6.03 0 7.89-.52A3 3 0 0 0 22 16.85c.33-1.6.5-3.23.5-4.85s-.17-3.25-.5-4.85ZM9.85 15.35v-6.7L15.62 12l-5.77 3.35Z"/></svg>',
      Twitch:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 3h16.2v11.4l-4.6 4.6h-3.4l-2.4 2.4H7.8V19H3.4V6.8L4.4 3Zm2.1 2.1v11.8h3.4v2.4l2.4-2.4h3.4l2.8-2.8v-9H6.5Zm4.2 2.6h2v5.1h-2V7.7Zm5 0h2v5.1h-2V7.7Z"/></svg>',
      TikTok:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3c.25 2.35 1.54 3.78 3.86 3.93v3.16a7.1 7.1 0 0 1-3.8-1.1v5.92c0 4.07-2.58 6.44-6.18 5.83-5.64-.95-5.42-9.17.31-9.78.6-.06 1.15-.03 1.71.1v3.31a2.5 2.5 0 1 0 1.23 2.15V3H15Z"/></svg>',
      Discord:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.92 5.3A15.2 15.2 0 0 0 15.2 4l-.18.36c1.36.4 2 .94 2 .94a13.2 13.2 0 0 0-10.04 0s.64-.54 2-.94L8.8 4c-1.3.22-2.55.66-3.72 1.3C2.72 8.9 2.08 12.4 2.4 15.85A14.9 14.9 0 0 0 7 18.2l.98-1.35c-.54-.2-1.06-.47-1.55-.8l.38-.3a9.45 9.45 0 0 0 10.38 0l.38.3c-.49.33-1 .6-1.55.8L17 18.2a15 15 0 0 0 4.6-2.35c.38-4-.67-7.47-2.68-10.55ZM8.75 14.15c-.78 0-1.42-.72-1.42-1.6s.62-1.6 1.42-1.6 1.44.72 1.42 1.6c0 .88-.62 1.6-1.42 1.6Zm6.5 0c-.78 0-1.42-.72-1.42-1.6s.62-1.6 1.42-1.6 1.42.72 1.42 1.6-.62 1.6-1.42 1.6Z"/></svg>',
      Instagram:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2.8h10A4.2 4.2 0 0 1 21.2 7v10a4.2 4.2 0 0 1-4.2 4.2H7A4.2 4.2 0 0 1 2.8 17V7A4.2 4.2 0 0 1 7 2.8Zm0 2A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8H7Zm5 3.1a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2Zm0 2a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Zm4.35-2.95a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>'
    };

    return icons[label] || '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 14h-2v-4H7l5-5 5 5h-4v4Z"/></svg>';
  }

  function setText(id, value) {
    const target = document.getElementById(id);
    if (target) {
      target.textContent = value;
    }
  }

  function renderInto(id, html) {
    const target = document.getElementById(id);
    if (target) {
      target.innerHTML = html;
    }
  }

  function renderList(items) {
    return items.map((item) => `  - ${escapeHtml(item)}`).join("\n");
  }

  function renderHtmlList(items) {
    return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  function renderTable(headers, rows) {
    const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
    const body = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
      .join("");
    return `<table class="terminal-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function renderPortfolio() {
    setText("heroName", "Roger Fernando Arana Lemus");
    setText("heroRole", `${profile.identity.role} - ${profile.identity.location}`);
    setText("heroBio", profile.bio[0]);

    renderInto(
      "heroFacts",
      [
        ["Rol actual", "Seguridad ofensiva y desarrollo seguro en telco"],
        ["Especialidad", "Pentesting web, APIs, infraestructura y codigo seguro"],
        ["Automation", "Python para auditorias, reporting, herramientas y PoC"],
        ["Comunidad", "Speaker Pwn3dCON y facilitador en NicaSecurity"]
      ]
        .map(([title, text]) => `<div class="fact"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></div>`)
        .join("")
    );

    renderInto(
      "profileSummary",
      [
        ["Identidad", `${profile.identity.name} / ${profile.identity.handle}. ${profile.identity.role}.`],
        ["Ubicacion", `${profile.identity.location}. Espanol nativo e ingles basico.`],
        ["Mision", profile.identity.tagline],
        ["Alcance", "Escaneo de vulnerabilidades, pentesting, revision de codigo seguro y hardening."],
        ["Desarrollo", "Herramientas Python, automatizaciones y estrategias de ciberseguridad."],
        ["Comunidad", "Speaker en Pwn3dCON y facilitador de talleres TechClinics en NicaSecurity."]
      ]
        .map(([title, text]) => `<article class="info-card"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></article>`)
        .join("")
    );

    renderInto(
      "experienceTimeline",
      profile.cv.experience
        .map(
          (item) => `<article class="timeline-item">
            <h3>${escapeHtml(item.title)}</h3>
            <ul>${renderHtmlList(item.lines)}</ul>
          </article>`
        )
        .join("")
    );

    renderInto(
      "skillsGrid",
      profile.skills
        .map(
          (group) => `<article class="skill-card">
            <h3>${escapeHtml(group.area)}</h3>
            <div class="chip-row">${group.items.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}</div>
          </article>`
        )
        .join("")
    );

    renderInto(
      "certificationGrid",
      profile.cv.training.map((item) => `<div class="cert-item">${escapeHtml(item)}</div>`).join("")
    );

    renderInto(
      "credlyGrid",
      profile.credlyBadges
        .map(
          (badge) => `<a class="badge-card" href="${escapeHtml(badge.url)}" target="_blank" rel="noreferrer">
            <img src="${escapeHtml(badge.image)}" alt="${escapeHtml(badge.name)} badge" loading="lazy" />
            <strong>${escapeHtml(badge.name)}</strong>
            <span>${escapeHtml(badge.issuer)}</span>
          </a>`
        )
        .join("")
    );

    renderInto(
      "communityGrid",
      profile.community
        .map(
          (item) => `<article class="evidence-card">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />
            <div>
              <span class="status-pill">${escapeHtml(item.role)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.topic)}</p>
            </div>
          </article>`
        )
        .join("")
    );

    renderInto(
      "educationList",
      profile.cv.education.map((item) => `<div class="list-item">${escapeHtml(item)}</div>`).join("")
    );

    renderInto(
      "languageList",
      profile.cv.languages.map((item) => `<div class="list-item">${escapeHtml(item)}</div>`).join("")
    );

    renderInto(
      "projectsGrid",
      profile.projects
        .map((project) => {
          const links = project.links.length
            ? project.links.map(([label, href]) => link(label, href)).join("")
            : '<span class="status-pill">codigo no publicado</span>';
          const tags = (project.tags || [])
            .map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`)
            .join("");
          const classes = ["project-card", project.status.includes("public") ? "project-card-public" : ""]
            .filter(Boolean)
            .join(" ");

          return `<article class="${classes}">
            <div class="project-top">
              <h3>${escapeHtml(project.name)}</h3>
              <span class="status-pill">${escapeHtml(project.status)}</span>
            </div>
            <div class="project-meta"><span class="chip">${escapeHtml(project.stack)}</span></div>
            <p>${escapeHtml(project.description)}</p>
            <div class="project-tags">${tags}</div>
            <div class="project-links">${links}</div>
          </article>`;
        })
        .join("")
    );

    renderInto(
      "videoGrid",
      profile.videos
        .map(
          (video, index) => `<a class="video-card ${index === 0 ? "video-card-featured" : ""}" href="${escapeHtml(video.url)}" target="_blank" rel="noreferrer">
            <div class="video-thumb">
              <img src="${escapeHtml(video.thumbnail)}" alt="${escapeHtml(video.title)}" loading="lazy" />
              <span class="play-mark" aria-hidden="true">${socialIcon("YouTube")}</span>
            </div>
            <div class="video-copy">
              <span class="status-pill">${index === 0 ? "video destacado" : "preview publico"}</span>
              <h3>${escapeHtml(video.title)}</h3>
              <p>${escapeHtml(video.description)}</p>
              <small>${escapeHtml(video.topic)}</small>
            </div>
          </a>`
        )
        .join("")
    );

    renderInto(
      "contactGrid",
      profile.contacts
        .map(
          ([label, href]) => `<a class="contact-card" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" aria-label="Abrir ${escapeHtml(label)}">
            <span class="social-icon">${socialIcon(label)}</span>
            <span class="social-copy">
              <strong>${escapeHtml(label)}</strong>
              <small>${escapeHtml(compactUrl(href))}</small>
            </span>
            <span class="social-cta">Abrir</span>
          </a>`
        )
        .join("")
    );
  }

  function print(html, type = "response") {
    const entry = document.createElement("div");
    entry.className = `entry ${type}`;
    entry.innerHTML = html;
    output.appendChild(entry);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function promptLine(command) {
    print(`<span class="prompt">rogerf5@whoami:~$</span> ${escapeHtml(command)}`, "command");
  }

  function renderBanner() {
    return `<span class="accent">>_whoami</span>
<span class="muted">interactive security portfolio</span>

name   : ${escapeHtml(profile.identity.name)}
handle : ${escapeHtml(profile.identity.handle)}
role   : ${escapeHtml(profile.identity.role)}
mode   : ${escapeHtml(profile.identity.mode)}

Run <span class="cyan">help</span> to list commands.`;
  }

  function renderHelp() {
    return `Available commands:
  ls                  list virtual files and sections
  whoami              show operator biography
  cat cv.txt          show static CV profile
  cat skills.txt      show technical skill matrix
  cat certs.txt       show certifications
  cat projects.txt    show public and local/private project references
  cat videos.txt      show YouTube video previews
  cat contact.txt     show contact links
  projects            compact project table
  videos              compact YouTube table
  contact             compact contact table
  theme green         switch accent to neon green
  theme cyan          switch accent to cyan
  theme amber         switch accent to amber
  clear               clear terminal
  banner              redraw session banner
  help                show this help`;
  }

  function renderLs() {
    return `drwxr-xr-x  profile/
drwxr-xr-x  skills/
drwxr-xr-x  projects/
drwxr-xr-x  videos/
drwxr-xr-x  contact/
-rw-r--r--  cv.txt
-rw-r--r--  skills.txt
-rw-r--r--  certs.txt
-rw-r--r--  projects.txt
-rw-r--r--  videos.txt
-rw-r--r--  contact.txt
-rw-r--r--  toolbox.txt`;
  }

  function renderWhoami() {
    return `<strong>${escapeHtml(profile.identity.name)}</strong> / <span class="cyan">${escapeHtml(profile.identity.handle)}</span>
${profile.bio.map((line) => `\n${escapeHtml(line)}`).join("")}

mission:
  ${escapeHtml(profile.identity.tagline)}`;
  }

  function renderCv() {
    const experience = profile.cv.experience
      .map((item) => {
        const lines = item.lines.map((line) => `    - ${escapeHtml(line)}`).join("\n");
        return `\n  ${escapeHtml(item.title)}\n${lines}`;
      })
      .join("\n");

    return `CV STATIC PROFILE

${renderList(profile.cv.summary)}

EXPERIENCE SNAPSHOT
${experience}

EDUCATION
${renderList(profile.cv.education)}

CERTIFICATIONS
${renderList(profile.cv.training)}

LANGUAGES
${renderList(profile.cv.languages)}

PUBLICATION NOTE
  - Personal email and phone from the PDF are intentionally not exposed in the public site.
  - Contact is routed through public professional profiles.`;
  }

  function renderSkills() {
    return profile.skills
      .map((group) => {
        return `<span class="accent">${escapeHtml(group.area)}</span>\n${renderList(group.items)}`;
      })
      .join("\n\n");
  }

  function renderCerts() {
    return `CERTIFICATIONS AND TRAINING
${renderList(profile.cv.training)}

Credential profile:
  ${link("Credly / Roger Arana", "https://www.credly.com/users/roger-arana")}`;
  }

  function renderProjectLinks(project) {
    if (!project.links.length) {
      return '<span class="muted">source not published</span>';
    }
    return project.links.map(([label, href]) => link(label, href)).join(" | ");
  }

  function renderProjects() {
    const rows = profile.projects.map((project) => [
      `<span class="accent">${escapeHtml(project.name)}</span>`,
      escapeHtml(project.status),
      escapeHtml(project.stack),
      `${escapeHtml(project.description)}<br>${renderProjectLinks(project)}`
    ]);
    return `${renderTable(["Project", "Status", "Stack", "Description"], rows)}

<span class="amber">Note:</span> local/private entries are mentioned as portfolio references only. Their source code is not included in this site.`;
  }

  function renderVideos() {
    const rows = profile.videos.map((video) => [
      `<span class="accent">${escapeHtml(video.title)}</span>`,
      escapeHtml(video.topic),
      `${escapeHtml(video.description)}<br>${link("YouTube preview", video.url)}`
    ]);
    return renderTable(["Video", "Topic", "Preview"], rows);
  }

  function renderToolbox() {
    return `LOCAL SECURITY TOOLBOX REFERENCES
${renderList(profile.localToolbox)}

These names describe personal tooling areas only. No local source files are bundled in this portfolio.`;
  }

  function renderContact() {
    const rows = profile.contacts.map(([label, href]) => [escapeHtml(label), link(href, href)]);
    return renderTable(["Channel", "URL"], rows);
  }

  function setTheme(theme) {
    const allowed = ["green", "cyan", "amber"];
    if (!allowed.includes(theme)) {
      return `Unknown theme: ${escapeHtml(theme)}\nUse: theme green | theme cyan | theme amber`;
    }

    state.theme = theme;
    document.body.dataset.theme = theme;
    return `theme set to ${escapeHtml(theme)}`;
  }

  function runCommand(rawCommand) {
    const command = rawCommand.trim();
    if (!command) {
      return;
    }

    state.history.push(command);
    state.historyIndex = state.history.length;
    promptLine(command);

    const normalized = command.toLowerCase();
    const [base, ...args] = normalized.split(/\s+/);

    if (base === "cat") {
      const fileName = args.join(" ");
      const renderer = files[fileName];
      print(renderer ? renderer() : `cat: ${escapeHtml(fileName || "")}: No such file`);
      return;
    }

    const commands = {
      help: renderHelp,
      ls: renderLs,
      whoami: renderWhoami,
      projects: renderProjects,
      videos: renderVideos,
      contact: renderContact,
      clear: () => {
        output.innerHTML = "";
        return "";
      },
      banner: renderBanner
    };

    if (base === "theme") {
      print(setTheme(args[0] || ""));
      return;
    }

    if (commands[base]) {
      const response = commands[base]();
      if (response) {
        print(response);
      }
      return;
    }

    print(`command not found: ${escapeHtml(command)}\nRun <span class="cyan">help</span> to inspect the available command set.`);
  }

  function handleHistory(event) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      state.historyIndex = Math.max(0, state.historyIndex - 1);
      input.value = state.history[state.historyIndex] || "";
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.historyIndex = Math.min(state.history.length, state.historyIndex + 1);
      input.value = state.history[state.historyIndex] || "";
    }
  }

  function submitCurrentInput() {
    const command = input.value;
    input.value = "";
    runCommand(command);
  }

  function handleInputKeydown(event) {
    handleHistory(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      submitCurrentInput();
    }
  }

  async function typeBootLine(line) {
    for (const char of line) {
      bootLog.textContent += char;
      await new Promise((resolve) => window.setTimeout(resolve, 5));
    }
    bootLog.textContent += "\n";
    await new Promise((resolve) => window.setTimeout(resolve, 60));
  }

  async function bootSequence() {
    renderPortfolio();
    for (const line of bootLines) {
      await typeBootLine(line);
    }
    await new Promise((resolve) => window.setTimeout(resolve, 140));
    boot.hidden = true;
    app.hidden = false;
    print(renderBanner());
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitCurrentInput();
  });

  input.addEventListener("keydown", handleInputKeydown);

  terminalBody.addEventListener("click", () => {
    input.focus();
  });

  terminalDetails.addEventListener("toggle", () => {
    if (terminalDetails.open) {
      input.focus();
    }
  });

  bootSequence();
})();
