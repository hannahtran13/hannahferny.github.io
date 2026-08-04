(function () {
  function finalizeSiteIdentity() {
    document.title = 'Hannah Tran — Research, Design & Environmental Communication';
    const descriptor = document.querySelector('.site-header > span');
    if (descriptor) descriptor.textContent = 'Research, Design & Environmental Communications';

    const reservedPortrait = document.querySelector('.portrait-placeholder');
    if (reservedPortrait) reservedPortrait.replaceChildren();
  }

  function redesignMiltonSpread() {
    const hero = document.querySelector('#page-08');
    const system = document.querySelector('#page-09');
    if (!hero || !system || hero.querySelector('.milton-hero')) return;

    // PageFlip adds its own classes after initialization. Preserve them so this
    // late content enhancement stays attached to the curl animation.
    hero.classList.add('milton');
    hero.innerHTML = `<div class="page-inner">
      <img class="milton-hero" src="images/milton/result2.jpg" alt="A visitor points toward a detail on the Milton exhibition’s wall of historical Sanborn maps">
      <div class="milton-hero-label">Milton Municipal Museum · 2023</div>
      <span class="spread-page-number">08</span>
      <h2 class="milton-hero-title">Planted<br>in place</h2>
      <p class="milton-edge-caption">The first exhibition mounted at the Milton Municipal Museum</p>
    </div>`;

    system.classList.add('milton-system');
    system.innerHTML = `<div class="page-inner">
      <div class="milton-kicker"><span>Exhibition design · Archival research · 2023</span><span>09</span></div>
      <div class="milton-artifacts" aria-label="Publication and identity artifacts from the exhibition">
        <img class="milton-artifact-spread" src="images/milton/67.png" alt="Exhibition book spread combining local history with Sanborn maps">
        <img class="milton-artifact-book" src="images/milton/book-cover.png" alt="Planted in Place exhibition book cover">
        <img class="milton-artifact-postcard" src="images/milton/POSTCARD front orange.png" alt="Orange Milton Municipal Museum exhibition postcard">
      </div>
      <div class="milton-copy">
        <p class="milton-question">How can a local museum make the environmental history of a place visible to the people already living inside it?</p>
        <p class="milton-description">For the first exhibition mounted at the Milton Municipal Museum, I translated Sanborn maps, botanical research and local history into a continuous public experience spanning identity, publication and spatial interpretation.</p>
        <div class="milton-metadata"><span>ROLE · Lead designer and exhibition curator</span><span>SYSTEM · Identity, publication and spatial interpretation</span><span>OUTCOME · First exhibition at Milton Municipal Museum</span></div>
        <a class="text-link" href="milton-exhibition.html">Enter the exhibition archive ↗</a>
      </div>
    </div>`;
  }

  function updateCommunityResearchCopy() {
    const page = document.querySelector('#page-11');
    if (!page) return;

    const kicker = page.querySelector('.page-kicker span:first-child');
    const title = page.querySelector('h2');
    const deck = page.querySelector('.deck');
    const body = page.querySelector('.body-copy');
    const facts = page.querySelectorAll('.facts span');
    const link = page.querySelector('.text-link');

    if (kicker) kicker.textContent = 'Community Research · Public Infrastructure';
    if (title) title.textContent = 'Buffalo Valley Rail Trail Extension';
    if (deck) deck.textContent = 'LEWISBURG ↔ MONTANDON, PENNSYLVANIA';
    if (body) {
      body.textContent = 'A proposed extension would repurpose a former railway bridge as a pedestrian and cycling connection between two neighboring communities separated by the Susquehanna River.\nWhat happens when infrastructure that appears universally beneficial meets the particular fears, habits and histories of a community?\nThrough surveys, stakeholder research and geographic analysis, our team examined how residents understood the proposal—and how place, trust and existing patterns of movement shaped their response.';
      body.style.whiteSpace = 'pre-line';
    }
    if (facts[0]) facts[0].textContent = 'ROLE · Community researcher';
    if (facts[1]) facts[1].textContent = 'PARTNER · Lewisburg Neighborhoods';
    if (facts[2]) facts[2].textContent = 'METHODS · Surveys, stakeholder analysis, mixed methods';
    if (link) link.textContent = 'Explore the research and findings ↗';
  }

  function mountMediaScapeDemo(target) {
    if (!target || target.querySelector('.media-demo')) return;

    const demo = document.createElement('section');
    demo.className = 'media-demo';
    demo.setAttribute('aria-label', 'Climate change outlet comparison demo');
    demo.innerHTML = `
      <div class="media-demo__head">
        <div>
          <h3>Climate Change</h3>
          <p>Prototype comparison across outlets</p>
        </div>
        <span class="media-demo__badge">Demo data</span>
      </div>
      <div class="media-demo__metrics">
        <div class="media-demo__metric"><span>Urgency</span><span class="media-demo__track"><i class="media-demo__fill" style="--value:68%"></i></span></div>
        <div class="media-demo__metric"><span>Economic framing</span><span class="media-demo__track"><i class="media-demo__fill" style="--value:55%"></i></span></div>
        <div class="media-demo__metric"><span>Scientific framing</span><span class="media-demo__track"><i class="media-demo__fill" style="--value:82%"></i></span></div>
      </div>
      <div class="media-demo__chart">
        <svg viewBox="0 0 360 120" role="img" aria-label="Article framing changes over time">
          <path d="M12 92 C58 82 74 60 116 68 S176 28 218 46 S286 82 348 52" stroke="#4274d9"/>
          <path d="M12 74 C64 62 82 78 126 52 S188 54 232 32 S294 52 348 36" stroke="#95ccdd"/>
          <path d="M12 102 C62 98 104 86 142 88 S210 72 248 86 S306 94 348 78" stroke="#293681"/>
        </svg>
      </div>`;
    target.appendChild(demo);
    requestAnimationFrame(() => demo.classList.add('is-ready'));
  }

  function normalizeResearchPage() {
    const page = document.querySelector('#page-21 .page-inner');
    if (!page || page.querySelector('.research-list')) return;

    const oldTitle = page.querySelector('h2');
    const oldBody = page.querySelector('.body-copy');
    const oldFacts = page.querySelector('.facts');
    const oldLink = page.querySelector('.text-link');
    [oldTitle, oldBody, oldFacts, oldLink].forEach(node => node && node.remove());

    const list = document.createElement('div');
    list.className = 'research-list';
    list.innerHTML = `
      <article class="research-entry">
        <span class="research-entry__number">10.1</span>
        <h2>Can transformers learn formal languages?</h2>
        <p>Using deterministic finite automata to distinguish structural understanding from probabilistic approximation beyond training distributions.</p>
        <a class="research-entry__link" href="research-dfa.html">View research ↗</a>
      </article>
      <article class="research-entry">
        <span class="research-entry__number">10.2</span>
        <h2>Trans identity and the environment on TikTok</h2>
        <p>Exploring how TikTok’s algorithmic distribution shapes transgender identity and environmental narratives through digital visibility and platform behavior.</p>
        <a class="research-entry__link" href="research-tiktok.html">View research ↗</a>
      </article>
      <aside class="research-method" aria-label="How I do research">
        <div class="research-method__head">
          <span>How I do research</span>
          <a href="research.html">All research &amp; insights ↗</a>
        </div>
        <ol>
          <li><b>01</b><span>Notice</span></li>
          <li><b>02</b><span>Frame</span></li>
          <li><b>03</b><span>Gather</span></li>
          <li><b>04</b><span>Compare</span></li>
          <li><b>05</b><span>Translate</span></li>
        </ol>
      </aside>`;
    page.appendChild(list);
  }

  function normalizeObjectsAndMiscellanea() {
    const page22 = document.querySelector('#page-22 .page-inner');
    const page23 = document.querySelector('#page-23 .page-inner');
    const page26 = document.querySelector('#page-26 .page-inner');
    const page27 = document.querySelector('#page-27 .page-inner');
    const page28 = document.querySelector('#page-28 .page-inner');

    if (page22) page22.querySelector('.facts')?.remove();

    if (page23) {
      page23.querySelector('.facts')?.remove();
      const copy = page23.querySelector('.body-copy');
      if (copy) copy.textContent = 'A material practice shaped by utility, play, technical risk and the behavior of clay under pressure.';
    }

    if (page26 && !page26.querySelector('.miscellanea-gateway')) {
      page26.querySelectorAll('h2, .facts').forEach(node => node.remove());
      const gateway = document.createElement('div');
      gateway.className = 'miscellanea-gateway';
      gateway.innerHTML = `
        <span class="miscellanea-gateway__label">Online sketchbook · always in progress</span>
        <h2>Miscellanea</h2>
        <p>Experiments in visual language, composition, motion and interaction. Small studies, unfinished thoughts and things made to find out what happens.</p>
        <a href="miscellanea/index.html">Open the sketchbook ↗</a>`;
      page26.appendChild(gateway);
    }

    if (page27 && !page27.querySelector('.inventory-list')) {
      const kicker = page27.querySelector('.page-kicker span');
      if (kicker) kicker.textContent = 'Partial self-portrait';
      const title = page27.querySelector('h2');
      if (title) title.textContent = 'A few coordinates, habits and contradictions.';
      const deck = page27.querySelector('.deck');
      if (deck) deck.textContent = 'No single fact explains a person. These are simply some of the ones I keep returning to.';
      page27.querySelector('.facts')?.remove();
      const inventory = document.createElement('ul');
      inventory.className = 'inventory-list';
      inventory.innerHTML = `
        <li>From Hải Phòng <span>Currently in Gettysburg</span></li>
        <li>Danish, English and Vietnamese</li>
        <li>Computer Science <span>+ Environmental Studies</span></li>
        <li>Ceramics instructor</li>
        <li>Hockey player <span>Right shot · usually wing</span></li>
        <li>Approximately fifty ties</li>
        <li>Believes Williamsport deserves an ice rink</li>
        <li>Distrusts kilns</li>
        <li>Invents countries when existing geography becomes insufficient</li>`;
      page27.appendChild(inventory);
    }

    if (page28 && !page28.querySelector('.resume-roles')) {
      const oldFacts = page28.querySelector('.facts');
      if (oldFacts) {
        oldFacts.className = 'resume-roles';
        oldFacts.innerHTML = `
          <div><span>Maryland Environmental Service</span><strong>Marketing &amp; Operations Intern</strong><small>2025</small></div>
          <div><span>Bucknell University</span><strong>Research Assistant</strong><small>2024—25</small></div>
          <div><span>Bucknell RED Grant</span><strong>Undergraduate Researcher</strong><small>2023</small></div>
          <div><span>Milton Municipal Museum</span><strong>Lead Designer &amp; Curator</strong><small>2023</small></div>
          <div><span>The Ahurea Project</span><strong>Founder &amp; Creative Lead</strong><small>2020—21</small></div>`;
      }
    }
  }

  function populateAhureaArchive() {
    const gallery = document.querySelector('#page-12 .facts');
    if (!gallery || gallery.classList.contains('ahurea-gallery')) return;
    const pieces = [
      { number: '01', caption: 'Me in Culture poster', image: 1 },
      { number: '02', caption: 'Ahurea Goodies Bag', image: 2 }
    ];
    gallery.classList.add('ahurea-gallery');
    gallery.replaceChildren(...pieces.map(piece => {
      const item = document.createElement('span');
      const image = document.createElement('img');
      const caption = document.createElement('b');
      image.src = `images/ahurea/${piece.image}.JPG`;
      image.alt = piece.caption;
      caption.textContent = `${piece.number} · ${piece.caption}`;
      item.append(image, caption);
      return item;
    }));
  }

  function describeBackgroundImages() {
    const descriptions = {
      '.cover .page-inner': 'Full-length portrait of Hannah Tran wearing a red Chicago Bulls jacket, cream trousers, a patterned tie, and a backward white cap.',
      '#page-01 .page-inner': 'Formal studio portrait of Hannah Tran wearing a dark suit and striped tie.',
      '#page-12 .page-inner': 'Magenta, cyan, and black Ahurea artwork combining a sculptural figure with the words Me in Culture.',
      '#page-16 .page-inner': 'Misty mountain landscape introducing Hjernelandet, an imagined country for essays and observations.',
      '#page-22 .page-inner': 'Handmade ceramic teapot painted with purple orchid flowers, photographed on overlapping book pages.',
      '#page-24 .page-inner': 'Hand-built ceramic ice skate with modeled laces and a separately attached blade.'
    };
    Object.entries(descriptions).forEach(([selector, text]) => {
      const target = document.querySelector(selector);
      if (!target || target.querySelector('.image-description')) return;
      const description = document.createElement('span');
      description.className = 'image-description';
      description.textContent = text;
      target.appendChild(description);
    });
    const posterPages = {
      '#page-08 .page-inner': 'Milton Municipal Museum Planted in Place exhibition poster with oversized orange typography over a historic streetscape.',
      '#page-10 .page-inner': 'Your Community, Your Voice recruitment poster for a survey about the proposed Buffalo Valley Rail Trail extension between Lewisburg and Montandon.'
    };
    Object.entries(posterPages).forEach(([selector, text]) => {
      const target = document.querySelector(selector);
      if (target) { target.setAttribute('role', 'img'); target.setAttribute('aria-label', text); }
    });
  }

  function wireContactForm() {
    const form = document.querySelector('#page-31 .contact-form');
    if (!form || form.dataset.googleSheet === 'ready') return;

    const endpoint = 'https://script.google.com/macros/s/AKfycbzX7mXELI5xfDtaFd7yWN1utccAXxFAO8Fj9rLGefcMZMAPJdxyoods-BVxTQ8KKVkamw/exec';
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[role="status"]');
    form.dataset.googleSheet = 'ready';

    form.onsubmit = async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const fields = new FormData(form);
      const payload = new FormData();
      payload.append('Name', fields.get('name') || '');
      payload.append('Email', fields.get('email') || '');
      payload.append('Message', `Subject: ${fields.get('subject') || 'A note from the portfolio'}\n\n${fields.get('message') || ''}`);

      button.disabled = true;
      button.textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      status.hidden = true;

      try {
        await fetch(endpoint, { method: 'POST', body: payload, mode: 'no-cors' });
        form.reset();
        button.textContent = 'Message sent ✓';
        status.textContent = 'Thank you—your note has been sent directly to Hannah.';
        status.hidden = false;
      } catch (error) {
        button.textContent = 'Try again';
        status.textContent = 'The note could not be sent. Please check your connection and try again.';
        status.hidden = false;
        console.error('Contact form submission failed:', error);
      } finally {
        form.removeAttribute('aria-busy');
        setTimeout(() => {
          button.disabled = false;
          button.textContent = 'Send a note ↗';
        }, 4000);
      }
    };
  }

  window.mountMediaScapeDemo = mountMediaScapeDemo;
  finalizeSiteIdentity();
  redesignMiltonSpread();
  updateCommunityResearchCopy();
  normalizeResearchPage();
  normalizeObjectsAndMiscellanea();
  populateAhureaArchive();
  describeBackgroundImages();
  wireContactForm();
})();
