const contentUrl = "content.json";

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const appendText = (parent, tag, className, text) => {
  const node = element(tag, className, text);
  parent.append(node);
  return node;
};

const createLink = (action, className) => {
  const link = element("a", className, action.label);
  link.href = action.href;
  return link;
};

const createActions = (actions = [], className = "card-actions") => {
  const wrapper = element("div", className);
  actions.forEach((action) => wrapper.append(createLink(action)));
  return wrapper;
};

const createMetadata = (items = []) => {
  const list = element("dl");
  items.forEach((item) => {
    const row = element("div");
    appendText(row, "dt", "", item.label);
    appendText(row, "dd", "", item.value);
    list.append(row);
  });
  return list;
};

const createPageHeading = (data) => {
  const heading = element("div", "section-heading page-heading");
  appendText(heading, "p", "eyebrow", data.eyebrow);
  appendText(heading, "h1", "", data.title);
  appendText(heading, "p", "", data.description);
  return heading;
};

const renderHeader = (site, currentPage) => {
  const header = document.querySelector("[data-site-header]");
  const brand = element("a", "brand");
  brand.href = "index.html";
  brand.setAttribute("aria-label", `${site.name} home`);
  appendText(brand, "span", "brand-mark", site.shortName);

  const brandCopy = element("span");
  appendText(brandCopy, "strong", "", site.name);
  appendText(brandCopy, "small", "", site.subtitle);
  brand.append(brandCopy);

  const nav = element("nav");
  nav.setAttribute("aria-label", "Primary navigation");
  site.navigation.forEach((item) => {
    const link = createLink(item);
    if (item.page === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
    nav.append(link);
  });

  header.replaceChildren(brand, nav);
};

const renderFooter = (site) => {
  const footer = document.querySelector("[data-site-footer]");
  footer.replaceChildren(...site.footer.map((text) => element("span", "", text)));
};

const renderHome = (data, root) => {
  const hero = element("section", "hero");
  hero.setAttribute("aria-labelledby", "hero-title");

  const media = element("div", "hero-media");
  media.setAttribute("aria-hidden", "true");
  media.append(element("div", "beam beam-one"), element("div", "beam beam-two"));
  const grid = element("div", "structure-grid");
  for (let index = 0; index < 12; index += 1) grid.append(element("span"));
  media.append(grid);

  const copy = element("div", "hero-copy");
  appendText(copy, "p", "eyebrow", data.eyebrow);
  const title = appendText(copy, "h1", "", data.title);
  title.id = "hero-title";
  appendText(copy, "p", "", data.description);
  const actions = element("div", "hero-actions");
  data.actions.forEach((action) => actions.append(createLink(action, `button ${action.style}`)));
  copy.append(actions);

  const panel = element("aside", "release-panel");
  panel.setAttribute("aria-label", "Featured release snapshot");
  appendText(panel, "span", "status", data.featured.status);
  appendText(panel, "h2", "", data.featured.title);
  appendText(panel, "p", "", data.featured.description);
  panel.append(createMetadata(data.featured.metadata));
  hero.append(media, copy, panel);

  const highlights = element("section", "intro-strip");
  highlights.setAttribute("aria-label", "Hub summary");
  data.highlights.forEach((item) => {
    const article = element("article");
    appendText(article, "strong", "", item.title);
    appendText(article, "span", "", item.description);
    highlights.append(article);
  });

  const modules = element("section", "section home-modules");
  const moduleHeading = element("div", "section-heading");
  appendText(moduleHeading, "p", "eyebrow", "Explore the hub");
  appendText(moduleHeading, "h2", "", "Research programme modules");
  appendText(moduleHeading, "p", "", "Each part of the hub now has a dedicated page and a focused catalogue.");
  const moduleGrid = element("div", "module-grid");
  data.modules.forEach((item) => {
    const card = element("article", "module-card");
    appendText(card, "p", "eyebrow", item.eyebrow);
    appendText(card, "h3", "", item.title);
    appendText(card, "p", "", item.description);
    card.append(createLink({ label: `Open ${item.title}`, href: item.href }, "module-link"));
    moduleGrid.append(card);
  });
  modules.append(moduleHeading, moduleGrid);
  root.replaceChildren(hero, highlights, modules);
};

const renderProjects = (data, root) => {
  const section = element("section", "section page-section");
  const grid = element("div", "team-grid");
  data.items.forEach((item) => {
    const card = element("article", "team-card");
    appendText(card, "span", "team-code", item.code);
    appendText(card, "h2", "", item.title);
    appendText(card, "p", "project-institution", item.institution);
    appendText(card, "p", "", item.summary);
    const topics = element("ul");
    item.topics.forEach((topic) => appendText(topics, "li", "", topic));
    card.append(topics, createActions(item.actions));
    grid.append(card);
  });
  section.append(createPageHeading(data), grid);
  root.replaceChildren(section);
};

const createCatalogueCard = (item, kind) => {
  const card = element("article", `${kind}-card`);
  if (item.type) card.dataset.type = item.type;
  const top = element("div", "card-top");
  appendText(top, "span", "tag", item.typeLabel || item.level);
  appendText(top, "span", "version", item.version || item.duration);
  appendText(card, "h2", "", item.title);
  appendText(card, "p", "", item.description);
  card.prepend(top);
  card.append(createMetadata(item.metadata), createActions(item.actions));
  return card;
};

const renderResources = (data, root) => {
  const section = element("section", "section page-section resource-section");
  const filters = element("div", "filters");
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Filter resources");
  const grid = element("div", "resource-grid");
  const team = new URLSearchParams(window.location.search).get("team");

  const cards = data.items.map((item) => {
    const card = createCatalogueCard(item, "resource");
    const itemTeam = item.metadata.find((entry) => entry.label === "Team")?.value;
    card.dataset.team = itemTeam || "";
    grid.append(card);
    return card;
  });

  const applyFilter = (type) => {
    cards.forEach((card) => {
      const typeMatches = type === "all" || card.dataset.type === type;
      const teamMatches = !team || card.dataset.team === team;
      card.classList.toggle("is-hidden", !typeMatches || !teamMatches);
    });
  };

  data.filters.forEach((filter, index) => {
    const button = element("button", `filter-button${index === 0 ? " active" : ""}`, filter.label);
    button.type = "button";
    button.addEventListener("click", () => {
      filters.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      applyFilter(filter.value);
    });
    filters.append(button);
  });

  section.append(createPageHeading(data));
  if (team) {
    const notice = element("div", "filter-notice");
    appendText(notice, "span", "", `Showing resources from ${team}`);
    notice.append(createLink({ label: "Show all teams", href: "resources.html" }));
    section.append(notice);
  }
  section.append(filters, grid);
  root.replaceChildren(section);
  applyFilter("all");
};

const renderCourses = (data, root) => {
  const section = element("section", "section page-section courses-section");
  const grid = element("div", "course-grid");
  data.items.forEach((item) => grid.append(createCatalogueCard(item, "course")));
  section.append(createPageHeading(data), grid);
  root.replaceChildren(section);
};

const renderProcess = (data, root) => {
  const section = element("section", "section page-section process-section");
  const list = element("ol", "process-list");
  data.steps.forEach((step) => {
    const item = element("li");
    appendText(item, "span", "", step.number);
    appendText(item, "h2", "", step.title);
    appendText(item, "p", "", step.description);
    list.append(item);
  });
  section.append(createPageHeading(data), list);
  root.replaceChildren(section);
};

const renderPeople = (data, root) => {
  const section = element("section", "section page-section leaders-section");
  const grid = element("div", "leader-grid");
  data.items.forEach((person) => {
    const card = element("article");
    appendText(card, "span", "avatar", person.initials);
    appendText(card, "h2", "", person.name);
    appendText(card, "p", "person-affiliation", person.affiliation);
    appendText(card, "p", "", person.description);
    grid.append(card);
  });
  section.append(createPageHeading(data), grid);
  root.replaceChildren(section);
};

const renderAbout = (data, root) => {
  const section = element("section", "section page-section about-page");
  const intro = element("div", "about-intro");
  intro.append(createPageHeading({ ...data, description: data.paragraphs[0] }));
  data.paragraphs.slice(1).forEach((paragraph) => appendText(intro, "p", "about-copy", paragraph));
  const grid = element("div", "principle-grid");
  data.principles.forEach((principle) => {
    const card = element("article", "principle-card");
    appendText(card, "h2", "", principle.title);
    appendText(card, "p", "", principle.description);
    grid.append(card);
  });
  section.append(intro, grid);
  root.replaceChildren(section);
};

const renderers = {
  home: renderHome,
  projects: renderProjects,
  resources: renderResources,
  courses: renderCourses,
  process: renderProcess,
  people: renderPeople,
  about: renderAbout
};

const showError = (root, error) => {
  const message = element("section", "load-state error-state");
  appendText(message, "h1", "", "Content could not be loaded");
  appendText(message, "p", "", "Serve this folder through a web server and confirm that content.json contains valid JSON.");
  console.error(error);
  root.replaceChildren(message);
};

const initialise = async () => {
  const root = document.querySelector("[data-page-root]");
  const currentPage = document.body.dataset.page;

  try {
    const response = await fetch(contentUrl);
    if (!response.ok) throw new Error(`Content request failed with status ${response.status}`);
    const content = await response.json();
    const renderer = renderers[currentPage];
    if (!renderer || !content[currentPage]) throw new Error(`No content renderer found for page: ${currentPage}`);

    renderHeader(content.site, currentPage);
    renderFooter(content.site);
    renderer(content[currentPage], root);
    document.title = currentPage === "home" ? content.site.name : `${content[currentPage].title} | ${content.site.name}`;
  } catch (error) {
    showError(root, error);
  }
};

initialise();
