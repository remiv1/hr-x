// hrx.js — gère le draft local, la prévisualisation, upload et download
document.addEventListener('DOMContentLoaded', () => {
  const preview    = document.getElementById('json-preview');
  const saveLocal  = document.getElementById('save-local');
  const loadLocal  = document.getElementById('load-local');
  const validateBtn = document.getElementById('validate');
  const downloadBtn = document.getElementById('download');
  const fileInput  = document.getElementById('file') || document.getElementById('file-input');

  // ---- Toasts ----
  function showToast(message, type = 'info', duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) { console.warn(message); return; }
    const toast = document.createElement('div');
    toast.className = 'toast' + (type !== 'info' ? ' toast-' + type : '');
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ---- Collapsibles ----
  const _initSet = new WeakSet();

  function initCollapsible(el) {
    if (_initSet.has(el)) return;
    _initSet.add(el);
    const header = el.querySelector(':scope > .item-header');
    if (!header) return;
    header.addEventListener('click', (e) => {
      if (e.target.closest('.icon-button')) return;
      const willCollapse = !el.classList.contains('collapsed');
      el.classList.toggle('collapsed', willCollapse);
      header.setAttribute('aria-expanded', String(!willCollapse));
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });
  }

  function updateSummary(el) {
    const titleEl = el.querySelector(':scope > .item-header .item-title');
    const metaEl  = el.querySelector(':scope > .item-header .item-meta');
    if (!titleEl) return;

    if (el.classList.contains('experience-item')) {
      const pos  = el.querySelector('.exp-position')?.value || '';
      const org  = el.querySelector('.exp-organisation')?.value || '';
      const start = el.querySelector('.exp-start')?.value || '';
      const end   = el.querySelector('.exp-end')?.value || 'présent';
      titleEl.textContent = [pos, org].filter(Boolean).join(' — ') || 'Nouvelle expérience';
      if (metaEl) metaEl.textContent = start ? start + ' → ' + end : '';
    } else if (el.classList.contains('skill-item')) {
      const domain = el.querySelector('.skill-domain')?.value || '';
      const label  = el.querySelector('.skill-label')?.value  || '';
      const level  = el.querySelector('.skill-level')?.value  || '';
      titleEl.textContent = domain || label || 'Nouvelle compétence';
      if (metaEl) metaEl.textContent = [label, level].filter(Boolean).join(' · ');
    } else if (el.classList.contains('education-item')) {
      const title = el.querySelector('.edu-title')?.value || '';
      const inst  = el.querySelector('.edu-institution')?.value || '';
      const year  = el.querySelector('.edu-year')?.value || '';
      titleEl.textContent = title || 'Nouvelle formation';
      if (metaEl) metaEl.textContent = [inst, year].filter(Boolean).join(' · ');
    } else if (el.classList.contains('award-item')) {
      const title = el.querySelector('.award-title')?.value || '';
      const year  = el.querySelector('.award-year')?.value  || '';
      titleEl.textContent = title || 'Nouvelle distinction';
      if (metaEl) metaEl.textContent = year;
    } else if (el.classList.contains('reference-item')) {
      const name = el.querySelector('.ref-name')?.value || '';
      const org  = el.querySelector('.ref-org')?.value  || '';
      titleEl.textContent = name || 'Nouvelle référence';
      if (metaEl) metaEl.textContent = org;
    } else if (el.classList.contains('bibliography-item')) {
      const title = el.querySelector('.bib-title')?.value || '';
      const year  = el.querySelector('.bib-year')?.value  || '';
      titleEl.textContent = title || 'Nouvelle publication';
      if (metaEl) metaEl.textContent = year;
    }
  }

  function initAllCollapsibles() {
    document.querySelectorAll('.collapsible-item').forEach(el => {
      initCollapsible(el);
      updateSummary(el);
    });
  }

  // ---- Collecte des données du formulaire ----
  function gatherIdentity() {
    const civility   = document.getElementById('civility')?.value || '';
    const first_name = document.getElementById('first_name')?.value || '';
    const last_name  = document.getElementById('last_name')?.value  || '';
    const contacts   = [];
    document.querySelectorAll('.contact-row').forEach(row => {
      const type  = row.querySelector('.contact-type')?.value  || '';
      const value = row.querySelector('.contact-value')?.value || '';
      if (value) contacts.push({ type, value });
    });
    return { civility, first_name, last_name, contacts };
  }

  function updatePreview() {
    const today = new Date().toISOString().slice(0, 10);
    const obj   = {
      '$hrx': { version: '1.0', schema: 'https://schema.audit-io.fr/hrx/1.0', date: today },
      identity: gatherIdentity()
    };

    // Compétences
    obj.skills = { hard: [], soft: [] };
    document.querySelectorAll('.skill-item').forEach(item => {
      const domain = item.querySelector('.skill-domain')?.value || '';
      const label  = item.querySelector('.skill-label')?.value  || '';
      const level  = item.querySelector('.skill-level')?.value  || '';
      const type   = item.querySelector('.skill-type')?.value   || 'hard';
      if (!domain) return;
      let group = (obj.skills[type] || []).find(g => g.domain === domain);
      if (!group) { group = { domain, items: [] }; obj.skills[type].push(group); }
      group.items.push({ label, level });
    });

    // Expériences
    obj.experiences = [];
    const errors = [];
    document.querySelectorAll('.experience-item').forEach((item, idx) => {
      const position     = item.querySelector('.exp-position')?.value     || '';
      const organisation = item.querySelector('.exp-organisation')?.value || '';
      const sector       = item.querySelector('.exp-sector')?.value       || '';
      const startEl      = item.querySelector('.exp-start');
      const endEl        = item.querySelector('.exp-end');
      const start        = startEl?.value || '';
      const end          = endEl?.value   || null;
      const description  = item.querySelector('.exp-description')?.value  || '';
      if (!position || !organisation) return;
      const dateRe = /^\d{4}(-\d{2})?$/;
      if (start && !dateRe.test(start)) {
        errors.push('Expérience ' + (idx + 1) + ' : début invalide (attendu YYYY ou YYYY-MM)');
        if (startEl) startEl.classList.add('invalid');
      } else if (startEl) startEl.classList.remove('invalid');
      if (end && !dateRe.test(end)) {
        errors.push('Expérience ' + (idx + 1) + ' : fin invalide (attendu YYYY ou YYYY-MM)');
        if (endEl) endEl.classList.add('invalid');
      } else if (endEl) endEl.classList.remove('invalid');
      obj.experiences.push({ position, organisation, sector, period: { start, end }, description });
    });

    // Éducation
    obj.education = [];
    document.querySelectorAll('.education-item').forEach(item => {
      const title       = item.querySelector('.edu-title')?.value         || '';
      const institution = item.querySelector('.edu-institution')?.value   || '';
      const year        = parseInt(item.querySelector('.edu-year')?.value) || null;
      const cert        = item.querySelector('.edu-certification')?.value || false;
      if (!title || !institution) return;
      obj.education.push({ title, institution, year, certification: cert === 'yes' });
    });

    // Credentials
    obj.credentials = { awards: [], references: [], bibliography: [] };
    document.querySelectorAll('.award-item').forEach(item => {
      const title  = item.querySelector('.award-title')?.value  || '';
      const issuer = item.querySelector('.award-issuer')?.value || '';
      const year   = parseInt(item.querySelector('.award-year')?.value) || null;
      if (!title) return;
      obj.credentials.awards.push({ title, issuer, year });
    });
    document.querySelectorAll('.reference-item').forEach(item => {
      const name         = item.querySelector('.ref-name')?.value     || '';
      const position     = item.querySelector('.ref-position')?.value || '';
      const organisation = item.querySelector('.ref-org')?.value      || '';
      if (!name) return;
      obj.credentials.references.push({ name, position, organisation });
    });
    document.querySelectorAll('.bibliography-item').forEach(item => {
      const title   = item.querySelector('.bib-title')?.value   || '';
      const authors = (item.querySelector('.bib-authors')?.value || '').split(';').map(s => s.trim()).filter(Boolean);
      const year    = parseInt(item.querySelector('.bib-year')?.value) || null;
      if (!title) return;
      obj.credentials.bibliography.push({ title, authors, year });
    });

    // Préférences
    obj.preferences = {};
    obj.preferences.availability = document.querySelector('.pref-availability')?.value || null;
    obj.preferences.contracts    = (document.querySelector('.pref-contracts')?.value || '').split(',').map(s => s.trim()).filter(Boolean);
    obj.preferences.remote       = document.querySelector('.pref-remote')?.value || null;
    const salary = document.querySelector('.pref-salary')?.value || null;
    obj.preferences.salary_min   = salary ? parseInt(salary) : null;

    if (preview) preview.value = JSON.stringify(obj, null, 2);

    // Afficher ou cacher les erreurs de saisie
    let errsEl = document.getElementById('form-errors');
    if (!errsEl) {
      errsEl = document.createElement('div');
      errsEl.id = 'form-errors';
      errsEl.className = 'form-errors';
      errsEl.style.display = 'none';
      const parent = document.querySelector('.container') || document.body;
      parent.insertBefore(errsEl, parent.firstChild);
    }
    if (errors.length) {
      errsEl.textContent = errors.join('\n');
      errsEl.style.display = '';
      if (downloadBtn) downloadBtn.disabled = true;
      window._hrx_form_errors = errors;
    } else {
      errsEl.style.display = 'none';
      if (downloadBtn) downloadBtn.disabled = false;
      window._hrx_form_errors = [];
    }
  }

  // ---- Contacts ----
  function addContactRow(type = 'email', value = '') {
    const container = document.getElementById('contacts');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'contact-row';
    div.innerHTML = `
      <select class="contact-type">
        <option value="email">email</option>
        <option value="phone">phone</option>
        <option value="linkedin">linkedin</option>
        <option value="github">github</option>
        <option value="x">x</option>
        <option value="website">website</option>
        <option value="other">other</option>
      </select>
      <input class="contact-value" placeholder="valeur" value="${value}" />
      <button type="button" class="remove-contact" aria-label="Supprimer">−</button>
    `;
    container.appendChild(div);
    div.querySelector('.contact-type').value = type;
    div.querySelector('.remove-contact').addEventListener('click', () => { div.remove(); updatePreview(); });
    div.querySelector('.contact-value').addEventListener('input', updatePreview);
  }

  // ---- Délégation boutons add/remove ----
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.id === 'add-contact') {
      e.preventDefault();
      addContactRow();
      return;
    }

    const removeMap = {
      'remove-contact':     '.contact-row',
      'remove-skill':       '.skill-item',
      'remove-experience':  '.experience-item',
      'remove-education':   '.education-item',
      'remove-award':       '.award-item',
      'remove-reference':   '.reference-item',
      'remove-bibliography':'.bibliography-item'
    };
    for (const cls in removeMap) {
      if (btn.classList.contains(cls)) {
        const ancestor = btn.closest(removeMap[cls]);
        if (ancestor) { ancestor.remove(); updatePreview(); }
        return;
      }
    }
  });

  // Mise à jour preview + résumés collapsibles à chaque saisie
  document.body.addEventListener('input', (e) => {
    updatePreview();
    const item = e.target.closest('.collapsible-item');
    if (item) updateSummary(item);
  });

  // ---- Actions barre sticky ----
  saveLocal?.addEventListener('click', () => {
    if (!preview?.value) return;
    localStorage.setItem('hrx.draft', preview.value);
    const statusEl = document.getElementById('sticky-status');
    if (statusEl) statusEl.textContent = 'Sauvegardé · ' + new Date().toLocaleTimeString('fr-FR');
    showToast('Brouillon sauvegardé localement', 'success');
  });

  loadLocal?.addEventListener('click', () => {
    const txt = localStorage.getItem('hrx.draft');
    if (!txt) { showToast('Aucun brouillon local trouvé', 'warning'); return; }
    try {
      const obj = JSON.parse(txt);
      if (preview) preview.value = JSON.stringify(obj, null, 2);
      populateFromObject(obj);
      showToast('Brouillon local chargé', 'success');
    } catch (e) { showToast('JSON invalide dans le stockage local', 'error'); }
  });

  // ---- Chargement de fichier ----
  fileInput?.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        let text = ev.target.result;
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        const obj = JSON.parse(text);
        if (preview) preview.value = JSON.stringify(obj, null, 2);
        populateFromObject(obj);
        showToast('Fichier chargé avec succès', 'success');
      } catch (err) {
        console.error('Parsing failed:', ev.target.result);
        showToast('Fichier JSON invalide', 'error');
      }
    };
    reader.readAsText(f);
  });

  // ---- Utilitaires ----
  function clearList(selector) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = '';
  }

  function makeItemHTML(classes, titleDefault, bodyHTML) {
    return `<div class="collapsible-item ${classes} card">
  <div class="item-header" tabindex="0" role="button" aria-expanded="true">
    <div class="item-summary">
      <span class="item-title">${titleDefault}</span>
      <span class="item-meta muted"></span>
    </div>
    <div class="item-controls">
      <button type="button" class="icon-button remove-${classes.split('-')[0]}-${classes.split('-')[1] || 'item'}" aria-label="Supprimer" title="Supprimer">✕</button>
      <i class="chevron" aria-hidden="true">›</i>
    </div>
  </div>
  <div class="item-body">${bodyHTML}</div>
</div>`;
  }

  // ---- Fonctions d'ajout ----
  function addSkill(domain = '', label = '', level = 'beginner') {
    const container = document.getElementById('skills-list');
    if (!container) return null;
    const div = document.createElement('div');
    div.className = 'collapsible-item skill-item card';
    div.innerHTML = `
      <div class="item-header" tabindex="0" role="button" aria-expanded="true">
        <div class="item-summary">
          <span class="item-title">Nouvelle compétence</span>
          <span class="item-meta muted"></span>
        </div>
        <div class="item-controls">
          <button type="button" class="icon-button remove-skill" aria-label="Supprimer" title="Supprimer">✕</button>
          <i class="chevron" aria-hidden="true">›</i>
        </div>
      </div>
      <div class="item-body">
        <div class="row">
          <div class="col" style="max-width:140px">
            <label>Type</label>
            <select class="skill-type">
              <option value="hard">Savoir-faire</option>
              <option value="soft">Savoir-être</option>
            </select>
          </div>
          <div class="col"><label>Domaine</label><input class="skill-domain" value="${domain}"/></div>
          <div class="col"><label>Label</label><input class="skill-label" value="${label}"/></div>
          <div style="max-width:160px">
            <label>Niveau</label>
            <select class="skill-level">
              <option value="beginner">beginner</option>
              <option value="intermediate">intermediate</option>
              <option value="advanced">advanced</option>
              <option value="expert">expert</option>
            </select>
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);
    div.querySelector('.skill-level').value = level;
    initCollapsible(div);
    updateSummary(div);
    return div;
  }

  function addExperience(exp = {}) {
    const container = document.getElementById('experiences-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'collapsible-item experience-item card';
    div.innerHTML = `
      <div class="item-header" tabindex="0" role="button" aria-expanded="true">
        <div class="item-summary">
          <span class="item-title">Nouvelle expérience</span>
          <span class="item-meta muted"></span>
        </div>
        <div class="item-controls">
          <button type="button" class="icon-button remove-experience" aria-label="Supprimer" title="Supprimer">✕</button>
          <i class="chevron" aria-hidden="true">›</i>
        </div>
      </div>
      <div class="item-body">
        <div class="row">
          <div class="col"><label>Poste</label><input class="exp-position" value="${exp.position||''}"/></div>
          <div class="col"><label>Organisation</label><input class="exp-organisation" value="${exp.organisation||''}"/></div>
          <div class="col"><label>Secteur</label><input class="exp-sector" value="${exp.sector||''}"/></div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="col"><label>Début (YYYY-MM)</label><input class="exp-start date-month" value="${exp.period?.start||''}"/></div>
          <div class="col"><label>Fin (YYYY-MM ou vide)</label><input class="exp-end date-month" value="${exp.period?.end||''}"/></div>
        </div>
        <div style="margin-top:10px"><label>Description</label><textarea class="exp-description" rows="3">${exp.description||''}</textarea></div>
      </div>
    `;
    container.appendChild(div);
    initCollapsible(div);
    updateSummary(div);
    div.querySelectorAll('.date-month').forEach(el => {
      el.addEventListener('blur',  () => validateDateInput(el));
      el.addEventListener('input', () => { if (el.classList.contains('invalid')) validateDateInput(el); });
      if (el.value) validateDateInput(el);
    });
  }

  function addEducation(ed = {}) {
    const container = document.getElementById('education-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'collapsible-item education-item card';
    div.innerHTML = `
      <div class="item-header" tabindex="0" role="button" aria-expanded="true">
        <div class="item-summary">
          <span class="item-title">Nouvelle formation</span>
          <span class="item-meta muted"></span>
        </div>
        <div class="item-controls">
          <button type="button" class="icon-button remove-education" aria-label="Supprimer" title="Supprimer">✕</button>
          <i class="chevron" aria-hidden="true">›</i>
        </div>
      </div>
      <div class="item-body">
        <div class="row">
          <div class="col"><label>Titre</label><input class="edu-title" value="${ed.title||''}"/></div>
          <div class="col"><label>Institution</label><input class="edu-institution" value="${ed.institution||''}"/></div>
          <div style="max-width:140px"><label>Année</label><input class="edu-year" value="${ed.year||''}"/></div>
        </div>
        <div style="margin-top:10px">
          <label>Certification</label>
          <select class="edu-certification">
            <option value="">non</option>
            <option value="yes">oui</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(div);
    if (ed.certification) div.querySelector('.edu-certification').value = 'yes';
    initCollapsible(div);
    updateSummary(div);
  }

  function addAward(a = {}) {
    const container = document.getElementById('awards-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'collapsible-item award-item card';
    div.innerHTML = `
      <div class="item-header" tabindex="0" role="button" aria-expanded="true">
        <div class="item-summary">
          <span class="item-title">Nouvelle distinction</span>
          <span class="item-meta muted"></span>
        </div>
        <div class="item-controls">
          <button type="button" class="icon-button remove-award" aria-label="Supprimer" title="Supprimer">✕</button>
          <i class="chevron" aria-hidden="true">›</i>
        </div>
      </div>
      <div class="item-body">
        <div class="row">
          <div class="col"><label>Titre</label><input class="award-title" value="${a.title||''}"/></div>
          <div class="col"><label>Émetteur</label><input class="award-issuer" value="${a.issuer||''}"/></div>
          <div style="max-width:120px"><label>Année</label><input class="award-year" value="${a.year||''}"/></div>
        </div>
      </div>
    `;
    container.appendChild(div);
    initCollapsible(div);
    updateSummary(div);
  }

  function addReference(r = {}) {
    const container = document.getElementById('references-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'collapsible-item reference-item card';
    div.innerHTML = `
      <div class="item-header" tabindex="0" role="button" aria-expanded="true">
        <div class="item-summary">
          <span class="item-title">Nouvelle référence</span>
          <span class="item-meta muted"></span>
        </div>
        <div class="item-controls">
          <button type="button" class="icon-button remove-reference" aria-label="Supprimer" title="Supprimer">✕</button>
          <i class="chevron" aria-hidden="true">›</i>
        </div>
      </div>
      <div class="item-body">
        <div class="row">
          <div class="col"><label>Nom</label><input class="ref-name" value="${r.name||''}"/></div>
          <div class="col"><label>Poste</label><input class="ref-position" value="${r.position||''}"/></div>
          <div class="col"><label>Organisation</label><input class="ref-org" value="${r.organisation||''}"/></div>
        </div>
      </div>
    `;
    container.appendChild(div);
    initCollapsible(div);
    updateSummary(div);
  }

  function addBibliography(b = {}) {
    const container = document.getElementById('bibliography-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'collapsible-item bibliography-item card';
    div.innerHTML = `
      <div class="item-header" tabindex="0" role="button" aria-expanded="true">
        <div class="item-summary">
          <span class="item-title">Nouvelle publication</span>
          <span class="item-meta muted"></span>
        </div>
        <div class="item-controls">
          <button type="button" class="icon-button remove-bibliography" aria-label="Supprimer" title="Supprimer">✕</button>
          <i class="chevron" aria-hidden="true">›</i>
        </div>
      </div>
      <div class="item-body">
        <div class="row">
          <div class="col"><label>Titre</label><input class="bib-title" value="${b.title||''}"/></div>
          <div class="col"><label>Auteurs (séparés par ;)</label><input class="bib-authors" value="${(b.authors||[]).join('; ')}"/></div>
          <div style="max-width:120px"><label>Année</label><input class="bib-year" value="${b.year||''}"/></div>
        </div>
      </div>
    `;
    container.appendChild(div);
    initCollapsible(div);
    updateSummary(div);
  }

  // ---- Populate depuis un objet JSON ----
  function populateFromObject(obj, retries = 10) {
    if (!obj) return;
    const civEl = document.getElementById('civility');
    if (!civEl && retries > 0) {
      setTimeout(() => populateFromObject(obj, retries - 1), 120);
      return;
    }
    // Identité
    if (obj.identity) {
      if (civEl) civEl.value = obj.identity.civility || '';
      const fn = document.getElementById('first_name'); if (fn) fn.value = obj.identity.first_name || '';
      const ln = document.getElementById('last_name');  if (ln) ln.value = obj.identity.last_name  || '';
      const ccontainer = document.getElementById('contacts');
      if (ccontainer) {
        ccontainer.innerHTML = '';
        (obj.identity.contacts || []).forEach(c => addContactRow(c.type || 'email', c.value || ''));
      }
    }
    // Compétences
    clearList('#skills-list');
    if (obj.skills) {
      ['hard', 'soft'].forEach(level => {
        (obj.skills[level] || []).forEach(domainObj => {
          (domainObj.items || []).forEach(item => {
            const el = addSkill(domainObj.domain || '', item.label || '', item.level || 'beginner');
            if (el) { const tsel = el.querySelector('.skill-type'); if (tsel) tsel.value = level; }
          });
        });
      });
    }
    // Expériences
    clearList('#experiences-list');
    (obj.experiences || []).forEach(e => addExperience(e));
    // Éducation
    clearList('#education-list');
    (obj.education || []).forEach(ed => addEducation(ed));
    // Credentials
    clearList('#awards-list');      (obj.credentials?.awards       || []).forEach(a => addAward(a));
    clearList('#references-list');  (obj.credentials?.references   || []).forEach(r => addReference(r));
    clearList('#bibliography-list');(obj.credentials?.bibliography || []).forEach(b => addBibliography(b));
    // Préférences
    if (obj.preferences) {
      const pa = document.querySelector('.pref-availability'); if (pa) pa.value = obj.preferences.availability || '';
      const pc = document.querySelector('.pref-contracts');    if (pc) pc.value = (obj.preferences.contracts || []).join(', ');
      const pr = document.querySelector('.pref-remote');       if (pr) pr.value = obj.preferences.remote || 'no';
      const ps = document.querySelector('.pref-salary');       if (ps) ps.value = obj.preferences.salary_min || '';
    }
    updatePreview();
  }

  // ---- Payload serveur (après upload) ----
  if (window.SERVER_PAYLOAD) {
    try {
      if (preview) preview.value = JSON.stringify(window.SERVER_PAYLOAD, null, 2);
      populateFromObject(window.SERVER_PAYLOAD);
      if (window.htmx) {
        document.body.addEventListener('htmx:afterSwap', () => {
          populateFromObject(window.SERVER_PAYLOAD);
          initAllCollapsibles();
        });
      }
    } catch (e) { console.error('populateFromObject failed', e); }
  }

  // ---- Validation des dates ----
  function isValidMonth(s) { return /^\d{4}(-\d{2})?$/.test(String(s || '').trim()); }
  function validateDateInput(el) {
    if (!el) return true;
    const ok = !el.value || isValidMonth(el.value);
    el.classList.toggle('invalid', !ok);
    return ok;
  }

  if (window.htmx) {
    document.body.addEventListener('htmx:afterSwap', () => {
      document.querySelectorAll('.date-month').forEach(el => {
        el.addEventListener('blur',  () => validateDateInput(el));
        el.addEventListener('input', () => { if (el.classList.contains('invalid')) validateDateInput(el); });
      });
      initAllCollapsibles();
    });
  }

  // ---- Valider ----
  validateBtn?.addEventListener('click', async () => {
    try {
      const data = JSON.parse(preview.value);
      const res  = await fetch('/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j    = await res.json();
      if (j.ok) {
        showToast('Fichier HRX valide ✓', 'success');
      } else {
        showToast('Erreurs : ' + (j.errors || []).join(', '), 'error', 5000);
      }
    } catch (e) { showToast('JSON invalide, impossible de valider', 'error'); }
  });

  // ---- Télécharger ----
  downloadBtn?.addEventListener('click', async () => {
    try {
      if (window._hrx_form_errors && window._hrx_form_errors.length) {
        showToast('Corrigez les erreurs du formulaire avant de télécharger', 'error', 4000);
        return;
      }
      const data = JSON.parse(preview.value);
      const res  = await fetch('/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) {
        const j = await res.json();
        showToast('Erreur : ' + (j.errors || []).join(', '), 'error', 5000);
        return;
      }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'candidate.hrx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Fichier téléchargé', 'success');
    } catch (e) { showToast('Erreur lors du téléchargement', 'error'); }
  });

  // ---- Init ----
  initAllCollapsibles();
  updatePreview();
});
