// hrx.js — gère le draft local, la prévisualisation, upload et download
document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('json-preview');
  // dynamic elements loaded by HTMX may appear after DOMContentLoaded;
  // use event delegation for add/remove controls so handlers work for server-rendered fragments
  const saveLocal = document.getElementById('save-local');
  const loadLocal = document.getElementById('load-local');
  const validateBtn = document.getElementById('validate');
  const downloadBtn = document.getElementById('download');
  const fileInput = document.getElementById('file') || document.getElementById('file-input');

  function gatherIdentity() {
    const civility = document.getElementById('civility')?.value || '';
    const first_name = document.getElementById('first_name')?.value || '';
    const last_name = document.getElementById('last_name')?.value || '';
    const contacts = [];
    document.querySelectorAll('.contact-row').forEach(row => {
      const type = row.querySelector('.contact-type')?.value || '';
      const value = row.querySelector('.contact-value')?.value || '';
      if (value) contacts.push({ type, value });
    });
    return { civility, first_name, last_name, contacts };
  }

  function updatePreview() {
    const today = new Date().toISOString().slice(0,10);
    const obj = { "$hrx": { version: "1.0", schema: "https://schema.audit-io.fr/hrx/1.0", date: today }, identity: gatherIdentity() };
    // gather skills
    obj.skills = { hard: [], soft: [] };
    document.querySelectorAll('.skill-item').forEach(item => {
      const domain = item.querySelector('.skill-domain')?.value || '';
      const label = item.querySelector('.skill-label')?.value || '';
      const level = item.querySelector('.skill-level')?.value || '';
      const type = item.querySelector('.skill-type')?.value || 'hard';
      if (!domain) return;
      // try to find existing domain group in correct skill type
      let group = (obj.skills[type]||[]).find(g => g.domain === domain);
      if (!group) { group = { domain: domain, items: [] }; obj.skills[type].push(group); }
      group.items.push({ label, level });
    });
    // gather experiences
    obj.experiences = [];
    const errors = [];
    document.querySelectorAll('.experience-item').forEach((item, idx) => {
      const position = item.querySelector('.exp-position')?.value || '';
      const organisation = item.querySelector('.exp-organisation')?.value || '';
      const sector = item.querySelector('.exp-sector')?.value || '';
      const startEl = item.querySelector('.exp-start');
      const endEl = item.querySelector('.exp-end');
      const start = startEl?.value || '';
      const end = endEl?.value || null;
      const description = item.querySelector('.exp-description')?.value || '';
      if (!position || !organisation) return;
      // validate date formats but still include the experience in output
      const dateRe = /^\d{4}(-\d{2})?$/;
      if (start && !dateRe.test(start)) {
        errors.push(`Expérience ${idx+1}: début invalide (attendu YYYY ou YYYY-MM)`);
        if (startEl) startEl.classList.add('invalid');
      } else if (startEl) startEl.classList.remove('invalid');
      if (end && !dateRe.test(end)) {
        errors.push(`Expérience ${idx+1}: fin invalide (attendu YYYY ou YYYY-MM)`);
        if (endEl) endEl.classList.add('invalid');
      } else if (endEl) endEl.classList.remove('invalid');
      obj.experiences.push({ position, organisation, sector, period: { start, end }, description });
    });
    // education
    obj.education = [];
    document.querySelectorAll('.education-item').forEach(item => {
      const title = item.querySelector('.edu-title')?.value || '';
      const institution = item.querySelector('.edu-institution')?.value || '';
      const year = parseInt(item.querySelector('.edu-year')?.value) || null;
      const cert = item.querySelector('.edu-certification')?.value || false;
      if (!title || !institution) return;
      obj.education.push({ title, institution, year, certification: cert === 'yes' });
    });
    // credentials
    obj.credentials = { awards: [], references: [], bibliography: [] };
    document.querySelectorAll('.award-item').forEach(item => {
      const title = item.querySelector('.award-title')?.value || '';
      const issuer = item.querySelector('.award-issuer')?.value || '';
      const year = parseInt(item.querySelector('.award-year')?.value) || null;
      if (!title) return;
      obj.credentials.awards.push({ title, issuer, year });
    });
    document.querySelectorAll('.reference-item').forEach(item => {
      const name = item.querySelector('.ref-name')?.value || '';
      const position = item.querySelector('.ref-position')?.value || '';
      const organisation = item.querySelector('.ref-org')?.value || '';
      if (!name) return;
      obj.credentials.references.push({ name, position, organisation });
    });
    document.querySelectorAll('.bibliography-item').forEach(item => {
      const title = item.querySelector('.bib-title')?.value || '';
      const authors = (item.querySelector('.bib-authors')?.value || '').split(';').map(s => s.trim()).filter(Boolean);
      const year = parseInt(item.querySelector('.bib-year')?.value) || null;
      if (!title) return;
      obj.credentials.bibliography.push({ title, authors, year });
    });
    // preferences
    obj.preferences = {};
    obj.preferences.availability = document.querySelector('.pref-availability')?.value || null;
    obj.preferences.contracts = (document.querySelector('.pref-contracts')?.value || '').split(',').map(s=>s.trim()).filter(Boolean);
    obj.preferences.remote = document.querySelector('.pref-remote')?.value || null;
    const salary = document.querySelector('.pref-salary')?.value || null;
    obj.preferences.salary_min = salary ? parseInt(salary) : null;
    if (preview) preview.value = JSON.stringify(obj, null, 2);
    // display form errors if any
    const errsElId = 'form-errors';
    let errsEl = document.getElementById(errsElId);
    if (!errsEl) {
      errsEl = document.createElement('div');
      errsEl.id = errsElId;
      errsEl.style.margin = '8px 0';
      errsEl.style.color = '#c00';
      const parent = document.querySelector('.container') || document.body;
      parent.insertBefore(errsEl, parent.firstChild);
    }
    if (errors.length) {
      errsEl.innerText = 'Erreurs de formulaire:\n' + errors.join('\n');
      // disable download
      if (downloadBtn) downloadBtn.disabled = true;
      window._hrx_form_errors = errors;
    } else {
      errsEl.innerText = '';
      if (downloadBtn) downloadBtn.disabled = false;
      window._hrx_form_errors = [];
    }
  }

  function addContactRow() {
    const container = document.getElementById('contacts');
    const div = document.createElement('div');
    div.className = 'contact-row';
    div.innerHTML = `
      <select class="contact-type">
        <option value="email">email</option>
        <option value="phone">phone</option>
        <option value="linkedin">linkedin</option>
        <option value="website">website</option>
        <option value="other">other</option>
      </select>
      <input class="contact-value" placeholder="valeur" />
      <button type="button" class="remove-contact">−</button>
    `;
    container.appendChild(div);
    div.querySelector('.remove-contact').addEventListener('click', () => { div.remove(); updatePreview(); });
  }

  // delegation for add/remove buttons (works for HTMX-inserted fragments)
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    // add contact
    if (btn.id === 'add-contact') {
      e.preventDefault();
      addContactRow();
      return;
    }
    // mapping remove class -> ancestor selector to remove
    const removeMap = {
      'remove-contact': '.contact-row',
      'remove-skill': '.skill-item',
      'remove-experience': '.experience-item',
      'remove-education': '.education-item',
      'remove-award': '.award-item',
      'remove-reference': '.reference-item',
      'remove-bibliography': '.bibliography-item'
    };
    for (const cls in removeMap) {
      if (btn.classList.contains(cls)) {
        const ancestor = btn.closest(removeMap[cls]);
        if (ancestor) ancestor.remove();
        updatePreview();
        return;
      }
    }
  });

  document.body.addEventListener('input', () => { updatePreview(); });

  saveLocal?.addEventListener('click', () => { localStorage.setItem('hrx.draft', preview.value); alert('Enregistré localement'); });
  loadLocal?.addEventListener('click', () => {
    const txt = localStorage.getItem('hrx.draft');
    if (!txt) { alert('Aucun brouillon local'); return; }
    try { const obj = JSON.parse(txt); preview.value = JSON.stringify(obj, null, 2); } catch (e) { alert('JSON invalide'); }
  });

  fileInput?.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        let text = ev.target.result;
        // strip BOM if present
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        const obj = JSON.parse(text);
        preview.value = JSON.stringify(obj, null, 2);
        populateFromObject(obj);
      } catch (err) {
        console.error('Failed parsing file content:', ev.target.result);
        alert('Fichier JSON invalide');
      }
    };
    reader.readAsText(f);
  });

  function clearList(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = '';
  }

  function addSkill(domain = '', label = '', level = 'beginner') {
    const container = document.getElementById('skills-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'skill-item card';
    div.innerHTML = `
      <div class="row">
        <div class="col" style="max-width:140px"><label>Type</label>
          <select class="skill-type"><option value="hard">Savoir-faire</option><option value="soft">Savoir-être</option></select>
        </div>
        <div class="col"><label>Domaine</label><input class="skill-domain" value="${domain}"/></div>
        <div class="col"><label>Label</label><input class="skill-label" value="${label}"/></div>
        <div style="max-width:160px"><label>Niveau</label>
          <select class="skill-level">
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
            <option value="expert">expert</option>
          </select>
        </div>
        <div style="align-self:center"><button type="button" class="remove-skill ghost">Supprimer</button></div>
      </div>
    `;
    container.appendChild(div);
    div.querySelector('.skill-level').value = level;
    // set default type
    div.querySelector('.skill-type').value = div.dataset.type || 'hard';
    div.querySelector('.remove-skill').addEventListener('click', () => { div.remove(); updatePreview(); });
  }

  function addExperience(exp = {}) {
    const container = document.getElementById('experiences-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'experience-item card';
    div.innerHTML = `
      <div class="row">
        <div class="col"><label>Poste</label><input class="exp-position" value="${exp.position||''}"/></div>
        <div class="col"><label>Organisation</label><input class="exp-organisation" value="${exp.organisation||''}"/></div>
        <div class="col"><label>Secteur</label><input class="exp-sector" value="${exp.sector||''}"/></div>
      </div>
      <div class="row" style="margin-top:8px">
        <div class="col"><label>Début (YYYY-MM)</label><input class="exp-start date-month" value="${exp.period?.start||''}"/></div>
        <div class="col"><label>Fin (YYYY-MM ou vide)</label><input class="exp-end date-month" value="${exp.period?.end||''}"/></div>
        <div style="align-self:center"><button type="button" class="remove-experience ghost">Supprimer</button></div>
      </div>
      <div style="margin-top:8px"><label>Description</label><textarea class="exp-description" rows="3">${exp.description||''}</textarea></div>
    `;
    container.appendChild(div);
    div.querySelector('.remove-experience').addEventListener('click', () => { div.remove(); updatePreview(); });
    // attach date validators
    div.querySelectorAll('.date-month').forEach(el => {
      el.addEventListener('blur', () => validateDateInput(el));
      el.addEventListener('input', () => { if (el.classList.contains('invalid')) validateDateInput(el); });
      if (el.value) validateDateInput(el);
    });
  }

  function addEducation(ed = {}) {
    const container = document.getElementById('education-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'education-item card';
    div.innerHTML = `
      <div class="row">
        <div class="col"><label>Titre</label><input class="edu-title" value="${ed.title||''}"/></div>
        <div class="col"><label>Institution</label><input class="edu-institution" value="${ed.institution||''}"/></div>
        <div style="max-width:140px"><label>Année</label><input class="edu-year" value="${ed.year||''}"/></div>
      </div>
      <div class="actions" style="margin-top:8px"><button type="button" class="remove-education ghost">Supprimer</button></div>
    `;
    container.appendChild(div);
    div.querySelector('.remove-education').addEventListener('click', () => { div.remove(); updatePreview(); });
  }

  function addAward(a = {}) {
    const container = document.getElementById('awards-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'award-item card';
    div.innerHTML = `<div class="row"><div class="col"><label>Titre</label><input class="award-title" value="${a.title||''}"/></div><div class="col"><label>Émetteur</label><input class="award-issuer" value="${a.issuer||''}"/></div><div style="max-width:120px"><label>Année</label><input class="award-year" value="${a.year||''}"/></div><div style="align-self:center"><button type="button" class="remove-award ghost">Supprimer</button></div></div>`;
    container.appendChild(div);
    div.querySelector('.remove-award').addEventListener('click', () => { div.remove(); updatePreview(); });
  }

  function addReference(r = {}) {
    const container = document.getElementById('references-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'reference-item card';
    div.innerHTML = `<div class="row"><div class="col"><label>Nom</label><input class="ref-name" value="${r.name||''}"/></div><div class="col"><label>Poste</label><input class="ref-position" value="${r.position||''}"/></div><div class="col"><label>Organisation</label><input class="ref-org" value="${r.organisation||''}"/></div><div style="align-self:center"><button type="button" class="remove-reference ghost">Supprimer</button></div></div>`;
    container.appendChild(div);
    div.querySelector('.remove-reference').addEventListener('click', () => { div.remove(); updatePreview(); });
  }

  function addBibliography(b = {}) {
    const container = document.getElementById('bibliography-list');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'bibliography-item card';
    div.innerHTML = `<div class="row"><div class="col"><label>Titre</label><input class="bib-title" value="${b.title||''}"/></div><div class="col"><label>Auteurs</label><input class="bib-authors" value="${(b.authors||[]).join('; ')||''}"/></div><div style="max-width:120px"><label>Année</label><input class="bib-year" value="${b.year||''}"/></div><div style="align-self:center"><button type="button" class="remove-bibliography ghost">Supprimer</button></div></div>`;
    container.appendChild(div);
    div.querySelector('.remove-bibliography').addEventListener('click', () => { div.remove(); updatePreview(); });
  }

  function populateFromObject(obj, retries = 10) {
    if (!obj) return;
    // if identity fields aren't yet in DOM, retry a few times (HTMX may load partials after DOMContentLoaded)
    const civEl = document.getElementById('civility');
    if (!civEl && retries > 0) {
      setTimeout(() => populateFromObject(obj, retries - 1), 100);
      return;
    }
    // identity
    if (obj.identity) {
      if (civEl) civEl.value = obj.identity.civility || '';
      const fn = document.getElementById('first_name'); if (fn) fn.value = obj.identity.first_name || '';
      const ln = document.getElementById('last_name'); if (ln) ln.value = obj.identity.last_name || '';
      // contacts
      const ccontainer = document.getElementById('contacts');
      if (ccontainer) {
        ccontainer.innerHTML = '';
        (obj.identity.contacts || []).forEach((c, idx) => {
          const d = document.createElement('div'); d.className = 'contact-row';
          d.innerHTML = `<select class="contact-type"><option value="email">email</option><option value="phone">phone</option><option value="linkedin">linkedin</option><option value="github">github</option><option value="x">x</option><option value="website">website</option><option value="other">other</option></select><input class="contact-value" placeholder="valeur"/><button type="button" class="remove-contact">−</button>`;
          ccontainer.appendChild(d);
          const typeEl = d.querySelector('.contact-type'); if (typeEl) typeEl.value = c.type || 'email';
          const valEl = d.querySelector('.contact-value'); if (valEl) { valEl.value = c.value || ''; valEl.addEventListener('input', updatePreview); }
        });
      }
    }
    // skills
    clearList('#skills-list');
    if (obj.skills) {
      ['hard','soft'].forEach(level => {
        (obj.skills[level]||[]).forEach(domainObj => {
          (domainObj.items||[]).forEach(item => {
            const s = addSkill(domainObj.domain || '', item.label || '', item.level || 'beginner');
            // if function returned element, set type
            // addSkill doesn't return element currently; instead adjust last child
            const last = document.getElementById('skills-list')?.lastElementChild;
            if (last) {
              const tsel = last.querySelector('.skill-type'); if (tsel) tsel.value = level;
            }
          });
        });
      });
    }
    // experiences
    clearList('#experiences-list');
    (obj.experiences||[]).forEach(e => addExperience(e));
    // education
    clearList('#education-list');
    (obj.education||[]).forEach(ed => addEducation(ed));
    // credentials
    clearList('#awards-list'); (obj.credentials?.awards||[]).forEach(a => addAward(a));
    clearList('#references-list'); (obj.credentials?.references||[]).forEach(r => addReference(r));
    clearList('#bibliography-list'); (obj.credentials?.bibliography||[]).forEach(b => addBibliography(b));
    // preferences
    if (obj.preferences) {
      const pa = document.querySelector('.pref-availability'); if (pa) pa.value = obj.preferences.availability || '';
      const pc = document.querySelector('.pref-contracts'); if (pc) pc.value = (obj.preferences.contracts || []).join(', ');
      const pr = document.querySelector('.pref-remote'); if (pr) pr.value = obj.preferences.remote || 'no';
      const ps = document.querySelector('.pref-salary'); if (ps) ps.value = obj.preferences.salary_min || '';
    }
    updatePreview();
  }

  // if server provided a payload via upload, populate client forms
  if (window.SERVER_PAYLOAD) {
    try {
      // set preview directly from server payload (ensures skills appear in preview)
      preview.value = JSON.stringify(window.SERVER_PAYLOAD, null, 2);
      // populate DOM forms when partials are available
      populateFromObject(window.SERVER_PAYLOAD);
      // also listen for HTMX swaps (when user navigates tabs) and repopulate newly loaded partials
      if (window.htmx) {
        document.body.addEventListener('htmx:afterSwap', (evt) => { populateFromObject(window.SERVER_PAYLOAD); });
      }
    } catch (e) { console.error('populateFromObject failed', e); }
  }

  // Date validation helpers for fields expecting YYYY or YYYY-MM
  function isValidMonth(s) {
    return /^\d{4}(-\d{2})?$/.test(String(s||'').trim());
  }

  function validateDateInput(el) {
    if (!el) return true;
    const ok = !el.value || isValidMonth(el.value);
    el.classList.toggle('invalid', !ok);
    return ok;
  }

  // attach validators after HTMX swaps so newly inserted fragments get handlers
  if (window.htmx) {
    document.body.addEventListener('htmx:afterSwap', (evt) => {
      document.querySelectorAll('.date-month').forEach(el => {
        el.removeEventListener('blur', () => validateDateInput(el));
        el.addEventListener('blur', () => validateDateInput(el));
        el.addEventListener('input', () => { if (el.classList.contains('invalid')) validateDateInput(el); });
      });
    });
  }

  validateBtn?.addEventListener('click', async () => {
    try {
      const data = JSON.parse(preview.value);
      const res = await fetch('/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await res.json();
      if (j.ok) alert('Valide ✅'); else alert('Erreurs: ' + (j.errors||[]).join('\n'));
    } catch (e) { alert('JSON invalide'); }
  });

  downloadBtn?.addEventListener('click', async () => {
    try {
      if (window._hrx_form_errors && window._hrx_form_errors.length) {
        alert('Impossible de télécharger : corrigez les erreurs du formulaire avant de continuer.\n' + window._hrx_form_errors.join('\n'));
        return;
      }
      const data = JSON.parse(preview.value);
      const res = await fetch('/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) { const j = await res.json(); alert('Erreur: ' + (j.errors||[]).join('\n')); return; }
      const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'candidate.hrx'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) { alert('Erreur téléchargement'); }
  });

  // initial
  updatePreview();
});
