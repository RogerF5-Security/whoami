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

          return `<article class="project-card">
            <div class="project-top">
              <h3>${escapeHtml(project.name)}</h3>
              <span class="status-pill">${escapeHtml(project.status)}</span>
            </div>
            <div class="project-meta"><span class="chip">${escapeHtml(project.stack)}</span></div>
            <p>${escapeHtml(project.description)}</p>
            <div class="project-links">${links}</div>
          </article>`;
        })
        .join("")
    );

    renderInto(
      "contactGrid",
      profile.contacts
        .map(
          ([label, href]) => `<article class="contact-card">
            <span>${escapeHtml(label)}</span>
            ${link(href, href)}
          </article>`
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
  cat contact.txt     show contact links
  projects            compact project table
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
drwxr-xr-x  contact/
-rw-r--r--  cv.txt
-rw-r--r--  skills.txt
-rw-r--r--  certs.txt
-rw-r--r--  projects.txt
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
