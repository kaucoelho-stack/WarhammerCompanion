// ═══════════════════════════════════════════════════════
// APP.JS — Navigation, Screens, Combat
// ═══════════════════════════════════════════════════════

// ══════════════════════════════════════════════
// NAVIGATION — Fixed stack, single active screen
// ══════════════════════════════════════════════
const NAV = {
  stack: [],
  go(id, initFn) {
    // Hide ALL screens first (bulletproof)
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    this.stack.push(id);
    const el = document.getElementById(id);
    el.classList.add('active', 'slide-in');
    setTimeout(() => el.classList.remove('slide-in'), 300);
    if (initFn) initFn();
  },
  back(initFn) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    this.stack.pop();
    const id = this.stack[this.stack.length - 1];
    const el = document.getElementById(id);
    el.classList.add('active', 'slide-back');
    setTimeout(() => el.classList.remove('slide-back'), 300);
    if (initFn) initFn();
  },
  current() { return this.stack[this.stack.length - 1]; },
};

// ══════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════
function initHome() {
  const all = DB.getUnits();
  const factions = DB.getFactions();
  const el = document.getElementById('home-stats');
  if (el) {
    const counts = factions.map(f => {
      const n = all.filter(u => u.factionId === f.id).length;
      return n > 0 ? `<span style="color:${f.color}">${f.emoji} ${n} ${f.name}</span>` : null;
    }).filter(Boolean);
    el.innerHTML = counts.join(' · ');
  }
}

// ══════════════════════════════════════════════
// SCREEN: PLAYER COUNT
// ══════════════════════════════════════════════
function initPlayerCount() {
  const grid = document.getElementById('player-count-grid');
  grid.innerHTML = '';
  [2,3,4,5,6].forEach(n => {
    const btn = document.createElement('div');
    btn.className = 'count-btn';
    btn.innerHTML = `<div class="count-num">${n}</div><div class="count-lbl">jogador${n>1?'es':''}</div>`;
    btn.onclick = () => {
      SFX.click();
      setupPlayerForms(n);
      NAV.go('screen-player-setup', initPlayerSetup);
    };
    grid.appendChild(btn);
  });
}

// ══════════════════════════════════════════════
// SCREEN: PLAYER SETUP (name + faction per player)
// ══════════════════════════════════════════════
let pendingPlayers = [];

function setupPlayerForms(count) {
  pendingPlayers = Array.from({length: count}, (_, i) => ({
    name: `Jogador ${i+1}`, factionId: null, units: {}
  }));
}

function initPlayerSetup() {
  const container = document.getElementById('player-setup-list');
  container.innerHTML = '';
  const factions = DB.getFactions();

  pendingPlayers.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'setup-player-card';
    card.id = `setup-card-${i}`;

    // Build faction options
    const factionOpts = factions.map(f =>
      `<div class="faction-opt${p.factionId===f.id?' active':''}" data-fid="${f.id}" data-pidx="${i}"
        style="--fc:${f.color}" onclick="selectSetupFaction(${i},'${f.id}',this)">
        <span>${f.emoji}</span><span class="fo-name">${f.name}</span>
      </div>`
    ).join('');

    card.innerHTML = `
      <div class="setup-player-hdr">
        <div class="setup-player-num">${i+1}</div>
        <input class="setup-name-input" id="pname-${i}" value="${p.name}" placeholder="Nome do jogador"
          oninput="pendingPlayers[${i}].name=this.value">
      </div>
      <div class="setup-faction-label">Escolha a facção:</div>
      <div class="faction-opts-wrap">${factionOpts}</div>
      <div class="setup-faction-selected" id="fsel-${i}">${p.factionId ? `<span style="color:${factions.find(f=>f.id===p.factionId)?.color}">✓ ${factions.find(f=>f.id===p.factionId)?.name}</span>` : '<span style="color:var(--muted)">Nenhuma selecionada</span>'}</div>`;
    container.appendChild(card);
  });

  updateSetupNextBtn();
}

function selectSetupFaction(pidx, factionId, el) {
  SFX.click();
  pendingPlayers[pidx].factionId = factionId;
  // Update visuals for this player's faction opts
  const card = document.getElementById(`setup-card-${pidx}`);
  card.querySelectorAll('.faction-opt').forEach(o => o.classList.toggle('active', o.dataset.fid === factionId));
  const faction = DB.getFaction(factionId);
  const sel = document.getElementById(`fsel-${pidx}`);
  sel.innerHTML = `<span style="color:${faction.color}">✓ ${faction.name}</span>`;
  updateSetupNextBtn();
}

function updateSetupNextBtn() {
  const allChosen = pendingPlayers.every(p => p.factionId !== null);
  document.getElementById('btn-to-units').disabled = !allChosen;
}

// ══════════════════════════════════════════════
// SCREEN: UNIT SELECT (per player)
// ══════════════════════════════════════════════
let unitSelectPlayerIdx = 0;

function initUnitSelect() {
  unitSelectPlayerIdx = 0;
  renderUnitSelectForPlayer(0);
}

function renderUnitSelectForPlayer(idx) {
  const p = pendingPlayers[idx];
  const faction = DB.getFaction(p.factionId);
  const units = DB.getUnits(p.factionId);

  document.getElementById('unit-select-title').textContent = `${p.name} — ${faction?.name || ''}`;
  document.getElementById('unit-select-subtitle').style.color = faction?.color || '#888';

  const progress = document.getElementById('unit-select-progress');
  progress.textContent = `Jogador ${idx+1} de ${pendingPlayers.length}`;

  const list = document.getElementById('unit-select-list');
  list.innerHTML = '';

  if (!units.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Nenhuma unidade</div><div class="empty-sub">Adicione fichas na Biblioteca primeiro</div></div>`;
  }

  units.forEach(u => {
    const qty = p.units[u.id] || 0;
    const card = document.createElement('div');
    card.className = 'unit-pick-card' + (qty>0?' selected':'');
    card.id = `upick-${u.id}`;
    card.style.setProperty('--fc', faction?.color || '#888');
    const imgHtml = u.imageData ? `<img src="${u.imageData}" alt="">` : `<span style="font-size:20px">${u.emoji||'⚔'}</span>`;
    card.innerHTML = `
      <div class="upc-img">${imgHtml}</div>
      <div class="upc-info">
        <div class="upc-name">${u.name}</div>
        <div class="upc-sub">${u.sub||''}</div>
        <div class="upc-stats">
          <span class="stat-chip"><s>T</s>${u.T}</span>
          <span class="stat-chip"><s>Sv</s>${u.Sv}+</span>
          <span class="stat-chip"><s>PV</s>${u.W}</span>
        </div>
      </div>
      <div class="upc-right">
        <div class="upc-check">${qty>0?'✓':''}</div>
        <div class="upc-qty" style="${qty>0?'':'visibility:hidden'}">
          <button class="qty-mini-btn" onclick="changeUnitPick(${idx},'${u.id}',-1,event)">−</button>
          <span class="qty-mini-val" id="upv-${u.id}">${qty}</span>
          <button class="qty-mini-btn" onclick="changeUnitPick(${idx},'${u.id}',1,event)">+</button>
        </div>
      </div>`;
    card.addEventListener('click', () => toggleUnitPick(idx, u.id, u.max));
    list.appendChild(card);
  });

  // Next/Done button
  const isLast = idx === pendingPlayers.length - 1;
  const btn = document.getElementById('btn-unit-next');
  btn.textContent = isLast ? '⚔ INICIAR BATALHA' : `PRÓXIMO JOGADOR →`;
  btn.disabled = Object.keys(p.units).length === 0;
}

function toggleUnitPick(pidx, unitId, max) {
  SFX.click();
  const p = pendingPlayers[pidx];
  if (p.units[unitId]) delete p.units[unitId]; else p.units[unitId] = 1;
  renderUnitSelectForPlayer(pidx);
}

function changeUnitPick(pidx, unitId, delta, evt) {
  evt.stopPropagation();
  const p = pendingPlayers[pidx];
  const u = DB.getUnit(unitId);
  p.units[unitId] = Math.max(1, Math.min(u?u.max:10, (p.units[unitId]||1) + delta));
  const el = document.getElementById(`upv-${unitId}`);
  if (el) el.textContent = p.units[unitId];
}

function unitSelectNext() {
  SFX.click();
  if (unitSelectPlayerIdx < pendingPlayers.length - 1) {
    unitSelectPlayerIdx++;
    renderUnitSelectForPlayer(unitSelectPlayerIdx);
    document.getElementById('unit-select-list').scrollTop = 0;
  } else {
    // All players set up — init session and go to battle
    SESSION.init(pendingPlayers.map((p, i) => ({
      id: `p${i}`, name: p.name, factionId: p.factionId, units: p.units,
      color: DB.getFaction(p.factionId)?.color || '#888'
    })));
    NAV.go('screen-battle', initBattleScreen);
  }
}

// ══════════════════════════════════════════════
// BATTLE SCREEN
// ══════════════════════════════════════════════
let activeBattleTab = 'tracker';
const COMBAT = { atkPlayerId:null, atkUnitId:null, weapon:null, defPlayerId:null, defUnitId:null, qtyAtk:1, qtyDef:1, attackNum:1 };

function initBattleScreen() {
  initTracker();
  COMBAT.atkPlayerId=null; COMBAT.atkUnitId=null; COMBAT.weapon=null;
  COMBAT.defPlayerId=null; COMBAT.defUnitId=null; COMBAT.qtyAtk=1; COMBAT.qtyDef=1; COMBAT.attackNum=1;
  document.getElementById('attack-counter').textContent = 1;
  switchTab('tracker');
}

function switchTab(tab) {
  activeBattleTab = tab;
  ['tracker','combat','pv'].forEach(t => {
    const panel = document.getElementById(`tab-${t}`);
    const btn   = document.getElementById(`tabn-${t}`);
    if (panel) panel.style.display = t===tab ? 'block':'none';
    if (btn) {
      btn.classList.toggle('active', t===tab);
      btn.style.color = t===tab ? (t==='combat'?'var(--blood2)':t==='pv'?'var(--hit)':'var(--gold)') : 'var(--muted)';
      btn.style.borderBottomColor = t===tab ? (t==='combat'?'var(--blood2)':t==='pv'?'var(--hit)':'var(--gold)') : 'transparent';
    }
  });
  if (tab==='tracker') renderTracker();
  if (tab==='pv') { renderPVTab(); if(TRACKER.players.length>0) activatePVTab(TRACKER.players[0].playerId); }
  if (tab==='combat') renderCombatTab();
}

// ── COMBAT TAB ────────────────────────────────────────
function renderCombatTab() {
  // Reset combat selections
  COMBAT.atkPlayerId=null; COMBAT.atkUnitId=null; COMBAT.weapon=null;
  COMBAT.defPlayerId=null; COMBAT.defUnitId=null;
  document.getElementById('weapon-wrap').classList.add('hidden');
  document.getElementById('summary-bar').classList.remove('show');
  document.getElementById('btn-open-battle').disabled=true;
  document.getElementById('qty-atk').textContent=1;
  document.getElementById('qty-def').textContent=1;

  // Build attacker selector
  buildPlayerUnitSelector('atk-selector', 'atk');
  buildPlayerUnitSelector('def-selector', 'def');
}

function buildPlayerUnitSelector(containerId, role) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  SESSION.players.forEach(p => {
    const faction = DB.getFaction(p.factionId);
    const playerSection = document.createElement('div');
    playerSection.className = 'combat-player-section';
    playerSection.style.setProperty('--pcolor', faction?.color||'#888');
    playerSection.innerHTML = `<div class="cps-label">${p.name} <span style="color:${faction?.color||'#888'};font-size:11px">${faction?.name||''}</span></div>`;
    const grid = document.createElement('div');
    grid.className = 'combat-unit-grid';
    SESSION.getPlayerUnits(p.id).forEach(u => {
      const card = document.createElement('div');
      card.className = 'combat-unit-card';
      card.id = `cuc-${role}-${p.id}-${u.id}`;
      card.style.setProperty('--pcolor', faction?.color||'#888');
      const imgHtml = u.imageData ? `<img src="${u.imageData}" alt="">` : `<span>${u.emoji||'⚔'}</span>`;
      card.innerHTML = `<div class="cuc-img">${imgHtml}</div><div class="cuc-name">${u.name}</div><div class="cuc-sub">${u.sub||''}</div><div class="cuc-check">✓</div>`;
      card.onclick = () => pickCombatUnit(role, p.id, u.id);
      grid.appendChild(card);
    });
    playerSection.appendChild(grid);
    container.appendChild(playerSection);
  });
}

function pickCombatUnit(role, playerId, unitId) {
  SFX.click();
  const u = DB.getUnit(unitId);
  if (!u) return;
  if (role==='atk') {
    COMBAT.atkPlayerId=playerId; COMBAT.atkUnitId=unitId; COMBAT.weapon=null; COMBAT.qtyAtk=1;
    document.querySelectorAll('[id^="cuc-atk-"]').forEach(c=>c.classList.remove('active'));
    document.getElementById(`cuc-atk-${playerId}-${unitId}`)?.classList.add('active');
    document.getElementById('qty-atk').textContent=1;
    // Weapon pills
    const wp=document.getElementById('weapon-pills'); wp.innerHTML='';
    u.weapons.forEach(w=>{
      const p=document.createElement('div'); p.className='weapon-pill'; p.textContent=w.name;
      p.onclick=()=>{ COMBAT.weapon=w.name; document.querySelectorAll('.weapon-pill').forEach(x=>x.classList.remove('active')); p.classList.add('active'); refreshCombatUI(); SFX.click(); };
      wp.appendChild(p);
    });
    document.getElementById('weapon-wrap').classList.remove('hidden');
    document.querySelectorAll('.weapon-pill').forEach(x=>x.classList.remove('active'));
  } else {
    COMBAT.defPlayerId=playerId; COMBAT.defUnitId=unitId; COMBAT.qtyDef=1;
    document.querySelectorAll('[id^="cuc-def-"]').forEach(c=>c.classList.remove('active'));
    document.getElementById(`cuc-def-${playerId}-${unitId}`)?.classList.add('active');
    document.getElementById('qty-def').textContent=1;
  }
  refreshCombatUI();
}

function changeQty(role, delta) {
  if (role==='atk') {
    const u=COMBAT.atkUnitId?DB.getUnit(COMBAT.atkUnitId):null;
    COMBAT.qtyAtk=Math.max(1,Math.min(u?u.max:20,COMBAT.qtyAtk+delta));
    document.getElementById('qty-atk').textContent=COMBAT.qtyAtk;
  } else {
    const u=COMBAT.defUnitId?DB.getUnit(COMBAT.defUnitId):null;
    COMBAT.qtyDef=Math.max(1,Math.min(u?u.max:20,COMBAT.qtyDef+delta));
    document.getElementById('qty-def').textContent=COMBAT.qtyDef;
  }
  refreshCombatUI();
}

function refreshCombatUI() {
  const ok=COMBAT.atkPlayerId&&COMBAT.atkUnitId&&COMBAT.weapon&&COMBAT.defPlayerId&&COMBAT.defUnitId;
  document.getElementById('btn-open-battle').disabled=!ok;
  const bar=document.getElementById('summary-bar');
  if (!ok){bar.classList.remove('show');return;}
  const atk=DB.getUnit(COMBAT.atkUnitId), def=DB.getUnit(COMBAT.defUnitId);
  const w=atk.weapons.find(x=>x.name===COMBAT.weapon);
  const atkP=SESSION.getPlayer(COMBAT.atkPlayerId), defP=SESSION.getPlayer(COMBAT.defPlayerId);
  const atkFac=DB.getFaction(atkP.factionId), defFac=DB.getFaction(defP.factionId);
  const est=w.auto?COMBAT.qtyAtk*3+'~':w.A==='d6'?COMBAT.qtyAtk*3+'~':w.A==='d3'?COMBAT.qtyAtk*2+'~':w.A*COMBAT.qtyAtk;
  bar.classList.add('show');
  document.getElementById('summary-inner').innerHTML=`
    <div class="sum-chip" style="border-color:${atkFac?.color||'#888'}"><s style="color:${atkFac?.color||'#888'}">${COMBAT.qtyAtk}×</s>${atk.name}</div>
    <div class="sum-chip" style="color:var(--gold)">${COMBAT.weapon}</div>
    <div class="sum-vs">VS</div>
    <div class="sum-chip" style="border-color:${defFac?.color||'#888'}"><s style="color:${defFac?.color||'#888'}">${COMBAT.qtyDef}×</s>${def.name}</div>
    <div style="font-size:11px;color:var(--muted)">≈${est} ataques</div>`;
}

// ══════════════════════════════════════════════
// LIBRARY
// ══════════════════════════════════════════════
function initLibrary() {
  const factions = DB.getFactions();
  const allUnits = DB.getUnits();
  const container = document.getElementById('library-body');
  container.innerHTML = '';

  factions.forEach(f => {
    const units = allUnits.filter(u => u.factionId === f.id);
    const section = document.createElement('div');
    section.className = 'lib-section';
    section.innerHTML = `<div class="lib-faction-hdr" style="color:${f.color}">${f.emoji} ${f.name} <span style="color:var(--muted);font-size:12px">(${units.length})</span></div>`;
    if (!units.length) {
      section.innerHTML += `<div style="font-size:12px;color:var(--muted);padding:6px 0 10px">Nenhuma unidade nesta facção</div>`;
    }
    units.forEach(u => {
      const isDefault = u.id.startsWith('du-');
      const card = document.createElement('div');
      card.className = 'lib-card';
      card.style.setProperty('--fc', f.color);
      const imgHtml = u.imageData ? `<img src="${u.imageData}" alt="">` : `<span>${u.emoji||'⚔'}</span>`;
      card.innerHTML = `
        <div class="lib-card-hdr">
          <div class="lib-img">${imgHtml}</div>
          <div class="lib-info">
            <div class="lib-name">${u.name}</div>
            <div class="lib-sub">${u.sub||''}${isDefault?' · Padrão':''}</div>
          </div>
          <div class="lib-actions">
            ${u.sheetImageData?`<button class="lib-btn sheet" onclick="viewSheet('${u.id}')" title="Ver ficha">📋</button>`:''}
            <button class="lib-btn" onclick="duplicateUnit('${u.id}')" title="Duplicar">⧉</button>
            <button class="lib-btn" onclick="openEditUnit('${u.id}')" title="Editar">✏️</button>
            ${!isDefault?`<button class="lib-btn del" onclick="deleteUnitConfirm('${u.id}')" title="Excluir">🗑</button>`:''}
          </div>
        </div>
        <div class="lib-stats">
          <span class="stat-chip"><s>MOV</s>${u.M||'?'}"</span>
          <span class="stat-chip"><s>T</s>${u.T}</span>
          <span class="stat-chip"><s>Sv</s>${u.Sv}+</span>
          <span class="stat-chip"><s>PV</s>${u.W}</span>
          <span class="stat-chip"><s>OC</s>${u.OC||1}</span>
          <span class="stat-chip"><s>Armas</s>${(u.weapons||[]).length}</span>
        </div>
        ${u.abilities?`<div class="lib-abilities">${u.abilities}</div>`:''}`;
      section.appendChild(card);
    });
    container.appendChild(section);
  });

  if (!allUnits.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Nenhuma ficha</div><div class="empty-sub">Toque em + NOVA para adicionar</div></div>`;
  }
}

function duplicateUnit(id) {
  SFX.click();
  DB.duplicateUnit(id);
  initLibrary();
}

function deleteUnitConfirm(id) {
  if (!confirm('Excluir esta ficha?')) return;
  DB.deleteUnit(id);
  SFX.click();
  initLibrary();
}

function viewSheet(id) {
  const u = DB.getUnit(id);
  if (!u?.sheetImageData) return;
  const modal = document.getElementById('sheet-view-modal');
  document.getElementById('sheet-view-img').src = u.sheetImageData;
  document.getElementById('sheet-view-name').textContent = u.name;
  modal.classList.add('open');
}

// Export / Import
function exportLibrary() {
  const data = DB.exportLibrary();
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'wh40k-biblioteca.json'; a.click();
  URL.revokeObjectURL(url);
  SFX.objective();
}

function importLibrary() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const result = DB.importLibrary(ev.target.result);
        alert(`Importado: ${result.factions} facções, ${result.units} unidades`);
        initLibrary();
        SFX.victory();
      } catch(err) { alert('Erro ao importar: ' + err.message); }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ══════════════════════════════════════════════
// ADD / EDIT UNIT MODAL
// ══════════════════════════════════════════════
let editingUnitId = null, weaponCount = 0;

function openAddUnit() {
  editingUnitId = null; weaponCount = 0;
  document.getElementById('unit-modal-title').textContent = 'NOVA FICHA';
  document.getElementById('uname').value='';
  document.getElementById('usub').value='';
  document.getElementById('uabilities').value='';
  ['M','T','Sv','W','Ld','OC','max'].forEach(f=>document.getElementById('ust-'+f).value='');
  document.getElementById('weapon-builder').innerHTML='';
  resetImgUpload('mini');
  resetImgUpload('sheet');
  // Build faction dropdown
  buildFactionSelect();
  addWeaponRow();
  document.getElementById('unit-modal').classList.add('open');
}

function openEditUnit(id) {
  const u = DB.getUnit(id);
  if (!u) return;
  editingUnitId = id; weaponCount = 0;
  document.getElementById('unit-modal-title').textContent = 'EDITAR FICHA';
  document.getElementById('uname').value = u.name||'';
  document.getElementById('usub').value = u.sub||'';
  document.getElementById('uabilities').value = u.abilities||'';
  document.getElementById('ust-M').value = (u.M||'').replace('"','');
  ['T','Sv','W','Ld','OC','max'].forEach(f=>document.getElementById('ust-'+f).value=u[f]||'');
  buildFactionSelect(u.factionId);
  document.getElementById('weapon-builder').innerHTML='';
  (u.weapons||[]).forEach(w=>addWeaponRow(w));
  // Images
  resetImgUpload('mini');
  if (u.imageData) showImgPreview('mini', u.imageData);
  document.getElementById('img-area-mini').dataset.imgData = u.imageData||'';
  resetImgUpload('sheet');
  if (u.sheetImageData) showImgPreview('sheet', u.sheetImageData);
  document.getElementById('img-area-sheet').dataset.imgData = u.sheetImageData||'';
  document.getElementById('unit-modal').classList.add('open');
}

function buildFactionSelect(selectedId) {
  const sel = document.getElementById('ufaction');
  sel.innerHTML = '';
  DB.getFactions().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id; opt.textContent = `${f.emoji} ${f.name}`;
    if (f.id === selectedId) opt.selected = true;
    sel.appendChild(opt);
  });
}

function closeUnitModal() { document.getElementById('unit-modal').classList.remove('open'); }

function addWeaponRow(w) {
  const id = weaponCount++;
  const wb = document.getElementById('weapon-builder');
  const div = document.createElement('div');
  div.className='weapon-item'; div.id=`wrow-${id}`;
  div.innerHTML=`
    <div class="wi-hdr"><span class="wi-lbl">Arma ${id+1}</span><button class="wi-del" onclick="document.getElementById('wrow-${id}').remove()">✕</button></div>
    <input class="form-input" id="wn-${id}" placeholder="Nome da arma" value="${w?w.name:''}" type="text" style="margin-bottom:7px">
    <div class="form-row-3">
      <div><label class="form-label">A</label><input class="form-input" id="wa-${id}" value="${w?w.A:''}" placeholder="2" type="text"></div>
      <div><label class="form-label">BS/WS</label><input class="form-input" id="wb-${id}" value="${w?w.BS:''}" placeholder="3" type="number" min="2" max="6"></div>
      <div><label class="form-label">S</label><input class="form-input" id="ws-${id}" value="${w?w.S:''}" placeholder="4" type="number"></div>
      <div><label class="form-label">AP</label><input class="form-input" id="wp-${id}" value="${w?w.AP:''}" placeholder="0" type="number" min="-6" max="0"></div>
      <div><label class="form-label">D</label><input class="form-input" id="wd-${id}" value="${w?w.D:''}" placeholder="1" type="text"></div>
      <div><label class="form-label">Tipo</label>
        <select class="form-input" id="wt-${id}">
          <option value="" ${w&&!w.melee&&!w.auto?'selected':''}>Tiro</option>
          <option value="melee" ${w?.melee?'selected':''}>Melee</option>
          <option value="auto" ${w?.auto?'selected':''}>Torrent</option>
        </select>
      </div>
    </div>
    ${w?.tags?`<div style="font-size:11px;color:var(--gold);margin-top:4px">Tags: ${w.tags}</div>`:''}`;
  wb.appendChild(div);
}

function resetImgUpload(type) {
  const area = document.getElementById(`img-area-${type}`);
  const icon = document.getElementById(`upl-icon-${type}`);
  const text = document.getElementById(`upl-text-${type}`);
  const prev = document.getElementById(`upl-prev-${type}`);
  if (!area) return;
  area.dataset.imgData = '';
  if (icon) icon.style.display='block';
  if (prev) { prev.style.display='none'; prev.src=''; }
  if (text) text.textContent = type==='mini'?'Foto da miniatura':'Foto da ficha original';
}

function showImgPreview(type, dataUrl) {
  const icon = document.getElementById(`upl-icon-${type}`);
  const text = document.getElementById(`upl-text-${type}`);
  const prev = document.getElementById(`upl-prev-${type}`);
  if (icon) icon.style.display='none';
  if (prev) { prev.src=dataUrl; prev.style.display='block'; }
  if (text) text.textContent='✅ Carregada';
}

function handleImgFile(evt, type) {
  const file = evt.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = type==='sheet' ? 600 : 220;
      const ratio = Math.min(maxSize/img.width, maxSize/img.height);
      canvas.width = img.width*ratio; canvas.height = img.height*ratio;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const quality = type==='sheet' ? 0.85 : 0.78;
      const compressed = canvas.toDataURL('image/jpeg', quality);
      document.getElementById(`img-area-${type}`).dataset.imgData = compressed;
      showImgPreview(type, compressed);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function saveUnit() {
  const name = document.getElementById('uname').value.trim();
  if (!name) { alert('Digite o nome da unidade'); return; }
  const weapons = [];
  document.getElementById('weapon-builder').querySelectorAll('.weapon-item').forEach(item => {
    const wn = item.querySelector('[id^="wn-"]');
    if (!wn?.value.trim()) return;
    let A = item.querySelector('[id^="wa-"]').value.trim();
    if (!isNaN(A)) A = parseInt(A);
    let D = item.querySelector('[id^="wd-"]').value.trim();
    if (!isNaN(D)) D = parseInt(D);
    const w = { name:wn.value.trim(), A, BS:parseInt(item.querySelector('[id^="wb-"]').value)||3, S:parseInt(item.querySelector('[id^="ws-"]').value)||4, AP:parseInt(item.querySelector('[id^="wp-"]').value)||0, D };
    const type = item.querySelector('[id^="wt-"]').value;
    if (type==='melee') w.melee=true;
    if (type==='auto') { w.auto=true; w.BS=0; }
    weapons.push(w);
  });
  if (!weapons.length) { alert('Adicione pelo menos uma arma'); return; }
  const unit = {
    id: editingUnitId || ('custom-'+Date.now()),
    name, factionId: document.getElementById('ufaction').value,
    sub: document.getElementById('usub').value.trim(),
    abilities: document.getElementById('uabilities').value.trim(),
    emoji:'⚔',
    M: document.getElementById('ust-M').value.trim()||'6',
    T: parseInt(document.getElementById('ust-T').value)||4,
    Sv: parseInt(document.getElementById('ust-Sv').value)||3,
    W: parseInt(document.getElementById('ust-W').value)||2,
    Ld: parseInt(document.getElementById('ust-Ld').value)||6,
    OC: parseInt(document.getElementById('ust-OC').value)||1,
    max: parseInt(document.getElementById('ust-max').value)||5,
    weapons,
    imageData: document.getElementById('img-area-mini').dataset.imgData||null,
    sheetImageData: document.getElementById('img-area-sheet').dataset.imgData||null,
  };
  DB.saveUnit(unit);
  closeUnitModal();
  initLibrary();
  SFX.objective();
}

// ══════════════════════════════════════════════
// FACTION MODAL
// ══════════════════════════════════════════════
let editingFactionId = null;

function openAddFaction() {
  editingFactionId = null;
  document.getElementById('faction-modal-title').textContent = 'NOVA FACÇÃO';
  document.getElementById('fname').value='';
  document.getElementById('fsub').value='';
  document.getElementById('femoji').value='⚪';
  document.getElementById('fcolor').value='#888888';
  document.getElementById('faction-modal').classList.add('open');
}

function openEditFaction(id) {
  const f = DB.getFaction(id); if (!f) return;
  editingFactionId = id;
  document.getElementById('faction-modal-title').textContent = 'EDITAR FACÇÃO';
  document.getElementById('fname').value = f.name;
  document.getElementById('fsub').value = f.sub||'';
  document.getElementById('femoji').value = f.emoji||'⚪';
  document.getElementById('fcolor').value = f.color||'#888888';
  document.getElementById('faction-modal').classList.add('open');
}

function closeFactionModal() { document.getElementById('faction-modal').classList.remove('open'); }

function saveFaction() {
  const name = document.getElementById('fname').value.trim();
  if (!name) { alert('Digite o nome da facção'); return; }
  const faction = {
    id: editingFactionId || ('faction-'+Date.now()),
    name, sub: document.getElementById('fsub').value.trim(),
    emoji: document.getElementById('femoji').value.trim()||'⚪',
    color: document.getElementById('fcolor').value,
  };
  DB.saveFaction(faction);
  closeFactionModal();
  initLibrary();
  SFX.objective();
}

function deleteFactionConfirm(id) {
  const f = DB.getFaction(id);
  if (!confirm(`Excluir facção "${f?.name}"? As unidades desta facção também serão removidas.`)) return;
  DB.deleteFaction(id);
  // Also delete units of this faction
  DB.getUnits(id).forEach(u => { if (!u.id.startsWith('du-')) DB.deleteUnit(u.id); });
  initLibrary();
}

// ══════════════════════════════════════════════
// BATTLE MODAL (dice resolution)
// ══════════════════════════════════════════════
let BS={}, battleRolling=false;
const battleHist=[];

function openBattle() {
  const atk=DB.getUnit(COMBAT.atkUnitId), def=DB.getUnit(COMBAT.defUnitId);
  const w=atk.weapons.find(x=>x.name===COMBAT.weapon);
  const atkP=SESSION.getPlayer(COMBAT.atkPlayerId), defP=SESSION.getPlayer(COMBAT.defPlayerId);
  const atkFac=DB.getFaction(atkP.factionId), defFac=DB.getFaction(defP.factionId);

  document.getElementById('vs-atk-name').textContent=atk.name;
  document.getElementById('vs-atk-player').textContent=atkP.name;
  document.getElementById('vs-atk-player').style.color=atkFac?.color||'#888';
  document.getElementById('vs-weapon').textContent='🗡 '+COMBAT.weapon;
  document.getElementById('vs-atk-qty').textContent=COMBAT.qtyAtk+' miniatura'+(COMBAT.qtyAtk>1?'s':'');
  document.getElementById('vs-def-name').textContent=def.name;
  document.getElementById('vs-def-player').textContent=defP.name;
  document.getElementById('vs-def-player').style.color=defFac?.color||'#888';
  document.getElementById('vs-def-qty').textContent=COMBAT.qtyDef+' miniatura'+(COMBAT.qtyDef>1?'s':'');

  let totalA=0;
  for(let i=0;i<COMBAT.qtyAtk;i++) totalA+=rollStat(w.A);
  BS={phase:0,totalAtk:totalA,hits:0,wounds:0,failed:0,dmg:0,deaths:0,mortals:0};
  battleRolling=false;

  for(let i=0;i<5;i++){const s=document.getElementById('ph'+i);s.classList.remove('active','done');}
  document.getElementById('ph0').classList.add('active');
  document.getElementById('dice-area').style.display='block';
  document.getElementById('final-result').classList.remove('show');
  document.getElementById('phase-log').innerHTML='';
  document.getElementById('btn-phase').disabled=false;
  const ab=document.getElementById('apply-dmg-btn');
  ab.classList.remove('applied'); ab.disabled=false;
  ab.textContent='⚡ APLICAR DANO NO TRACKER';
  renderPhaseSetup();
  document.getElementById('battle-modal').classList.add('open');
  document.body.style.overflow='hidden';
  SFX.roll();
}

function closeBattle() {
  document.getElementById('battle-modal').classList.remove('open');
  document.body.style.overflow='';
  // DON'T touch NAV or other screens
}

function renderPhaseSetup() {
  const atk=DB.getUnit(COMBAT.atkUnitId), def=DB.getUnit(COMBAT.defUnitId);
  const w=atk.weapons.find(x=>x.name===COMBAT.weapon);
  const t=document.getElementById('dp-title'), d=document.getElementById('dp-desc'), btn=document.getElementById('btn-phase');
  if(BS.phase===0){
    t.textContent='FASE 1 — ACERTO';
    d.innerHTML=w.auto?`Torrent: <strong>${BS.totalAtk}</strong> ataques automáticos`:`Role <strong>${BS.totalAtk}</strong> dado${BS.totalAtk!==1?'s':''} — precisa <strong>${w.BS}+</strong>`;
    btn.textContent=w.auto?'✅ AUTO-ACERTOS':'🎲 ROLAR ACERTO';
  } else if(BS.phase===1){
    const wn=woundNeeds(w.S,def.T);
    t.textContent='FASE 2 — FERIDA';
    d.innerHTML=`Role <strong>${BS.hits}</strong> dado${BS.hits!==1?'s':''} — F${w.S} vs R${def.T} → <strong>${wn}+</strong>`;
    btn.textContent='🎲 ROLAR FERIDA';
  } else if(BS.phase===2){
    const sn=svNeeds(def.Sv,w.AP);
    t.textContent='FASE 3 — ARMADURA';
    d.innerHTML=`Role <strong>${BS.wounds}</strong> dado${BS.wounds!==1?'s':''} — Sv${def.Sv}+ com PA${w.AP} → <strong>${sn>=7?'impossível':sn+'+'}</strong>`;
    btn.textContent='🎲 ROLAR ARMADURA';
  } else if(BS.phase===3){
    t.textContent='FASE 4 — DANO';
    d.innerHTML=`${BS.failed} falha${BS.failed!==1?'s':''} × <strong>D${typeof w.D==='number'?w.D:w.D.toUpperCase()}</strong>`;
    btn.textContent='💥 CALCULAR DANO';
  }
}

function onPhaseBtn() {
  if(battleRolling)return;
  battleRolling=true;
  document.getElementById('btn-phase').disabled=true;
  SFX.roll();
  const ph=BS.phase;
  if(ph===0)runHit();
  else if(ph===1)runWound();
  else if(ph===2)runSave();
  else if(ph===3)runDmg();
}

function mkLogEntry(title) {
  const log=document.getElementById('phase-log');
  log.querySelectorAll('.log-entry').forEach(e=>e.classList.remove('current'));
  const entry=document.createElement('div'); entry.className='log-entry current';
  const tEl=document.createElement('div'); tEl.className='log-title'; tEl.textContent=title;
  const dg=document.createElement('div'); dg.className='log-dice';
  const bg=document.createElement('div'); bg.className='log-badges'; bg.style.display='none';
  entry.append(tEl,dg,bg); log.appendChild(entry);
  setTimeout(()=>{const da=document.getElementById('dice-area');da.scrollTop=da.scrollHeight;},100);
  return{dg,bg};
}

function showBadges(el,items){el.style.display='flex';el.innerHTML=items.map(b=>`<div class="badge ${b.c}">${b.t}</div>`).join('');}

function runHit(){
  const w=DB.getUnit(COMBAT.atkUnitId).weapons.find(x=>x.name===COMBAT.weapon);
  const count=BS.totalAtk;
  const{dg,bg}=mkLogEntry('FASE 1 — ACERTO');
  if(w.auto){BS.hits=count;animDice(dg,Array(Math.min(count,20)).fill(6),()=>'hit-ok',count,30,()=>{showBadges(bg,[{c:'b-hit',t:'✅ '+count+' automáticos'}]);afterPhase(count>0);});return;}
  const rolls=Array.from({length:count},()=>d6());
  let hits=0;
  rolls.forEach(v=>{if(v>=w.BS){hits++;if(w.sustained&&v===6)hits++;}});
  BS.hits=hits;
  animDice(dg,rolls.slice(0,20),v=>v>=w.BS?'hit-ok':'hit-fail',count,60,()=>{
    hits>0?SFX.hit():SFX.miss();
    showBadges(bg,[{c:'b-hit',t:'✅ '+hits+' acerto'+(hits!==1?'s':'')},{c:'b-note',t:'de '+count}]);
    afterPhase(hits>0);
  });
}

function runWound(){
  const w=DB.getUnit(COMBAT.atkUnitId).weapons.find(x=>x.name===COMBAT.weapon);
  const def=DB.getUnit(COMBAT.defUnitId);
  const count=BS.hits,thresh=woundNeeds(w.S,def.T);
  const{dg,bg}=mkLogEntry('FASE 2 — FERIDA');
  let rolls=Array.from({length:count},()=>d6());
  if(w.twinLinked)rolls=rolls.map(v=>v<thresh?d6():v);
  let wounds=0,mortals=0;
  rolls.forEach(v=>{if(v>=thresh){wounds++;if(w.devastating&&v===6)mortals++;}});
  BS.wounds=wounds;BS.mortals=mortals;
  animDice(dg,rolls.slice(0,20),v=>{if(v>=thresh){if(w.devastating&&v===6)return'wound-mortal';return'wound-ok';}return'wound-fail';},count,60,()=>{
    wounds>0?SFX.wound():null;
    mortals>0?SFX.mortal():null;
    const bs=[{c:'b-wound',t:'🩸 '+wounds+' ferida'+(wounds!==1?'s':'')},{c:'b-note',t:'precisa '+thresh+'+'}];
    if(mortals>0)bs.push({c:'b-mortal',t:'⚡ '+mortals+' MORTAL'+(mortals>1?'S':'')});
    showBadges(bg,bs);
    afterPhase(wounds>0);
  });
}

function runSave(){
  const w=DB.getUnit(COMBAT.atkUnitId).weapons.find(x=>x.name===COMBAT.weapon);
  const def=DB.getUnit(COMBAT.defUnitId);
  const mortals=BS.mortals||0,toRoll=BS.wounds-mortals,sn=svNeeds(def.Sv,w.AP);
  const{dg,bg}=mkLogEntry('FASE 3 — ARMADURA');
  const rolls=Array.from({length:Math.max(0,toRoll)},()=>d6());
  let saved=0;rolls.forEach(v=>{if(sn<7&&v>=sn)saved++;});
  BS.failed=Math.max(0,(toRoll-saved)+mortals);
  animDice(dg,rolls.slice(0,20),v=>(sn<7&&v>=sn)?'save-ok':'save-fail',toRoll,60,()=>{
    saved>0?SFX.save():null;
    showBadges(bg,[{c:'b-save',t:'🛡 '+saved+' salvo'+(saved!==1?'s':'')},{c:'b-fail',t:'❌ '+BS.failed+' falha'+(BS.failed!==1?'s':'')},{c:'b-note',t:'Sv'+def.Sv+'→'+(sn>=7?'impossível':sn+'+')}]);
    afterPhase(BS.failed>0);
  });
}

function runDmg(){
  const w=DB.getUnit(COMBAT.atkUnitId).weapons.find(x=>x.name===COMBAT.weapon);
  const def=DB.getUnit(COMBAT.defUnitId);
  const fails=BS.failed;
  const{dg,bg}=mkLogEntry('FASE 4 — DANO');
  const dmgRolls=Array.from({length:fails},()=>rollDmg(w.D));
  const total=dmgRolls.reduce((a,b)=>a+b,0);BS.dmg=total;
  let rem=total,deaths=0;
  for(let i=0;i<COMBAT.qtyDef&&rem>0;i++){if(rem>=def.W){deaths++;rem-=def.W;}else break;}
  BS.deaths=deaths;
  animDice(dg,dmgRolls.slice(0,20),()=>'dmg-die',fails,typeof w.D==='number'&&w.D===1?30:100,()=>{
    deaths>0?SFX.death():null;
    showBadges(bg,[{c:'b-fail',t:'💥 '+total+' dano'},{c:'b-note',t:fails+'× D'+(typeof w.D==='number'?w.D:w.D.toUpperCase())},(w.melta?{c:'b-wound',t:'Melta: +2 se ≤9"'}:null)].filter(Boolean));
    setTimeout(()=>finalizeBattle(),500);
  });
}

function afterPhase(success){
  const ph=BS.phase;
  document.getElementById('ph'+ph).classList.remove('active');
  document.getElementById('ph'+ph).classList.add('done');
  if(!success){
    if(ph<1)BS.wounds=0;if(ph<2)BS.failed=0;if(ph<3){BS.dmg=0;BS.deaths=0;}
    setTimeout(()=>finalizeBattle(),400);return;
  }
  BS.phase=ph+1;
  document.getElementById('ph'+(ph+1)).classList.add('active');
  setTimeout(()=>{renderPhaseSetup();battleRolling=false;document.getElementById('btn-phase').disabled=false;const da=document.getElementById('dice-area');da.scrollTop=da.scrollHeight;},350);
}

function finalizeBattle(){
  battleRolling=false;
  for(let i=0;i<4;i++){document.getElementById('ph'+i).classList.remove('active');document.getElementById('ph'+i).classList.add('done');}
  document.getElementById('ph4').classList.remove('done');document.getElementById('ph4').classList.add('active');
  document.getElementById('dice-area').style.display='none';
  document.getElementById('final-result').classList.add('show');
  document.getElementById('r-atk').textContent=BS.totalAtk;
  document.getElementById('r-hit').textContent=BS.hits;
  document.getElementById('r-wnd').textContent=BS.wounds;
  document.getElementById('r-sv').textContent=BS.failed;
  document.getElementById('r-dmg').textContent=BS.dmg;
  const db=document.getElementById('db'),dbi=document.getElementById('db-icon'),dbt=document.getElementById('db-title'),dbs=document.getElementById('db-sub');
  const dn=DB.getUnit(COMBAT.defUnitId)?.name||'?';
  const dp=SESSION.getPlayer(COMBAT.defPlayerId);
  if(BS.deaths>0){db.className='death-banner';dbi.textContent='💀';dbt.textContent=BS.deaths+' MINIATURA'+(BS.deaths>1?'S':'')+' MORTA'+(BS.deaths>1?'S':'');dbs.textContent='Retire '+BS.deaths+' '+dn+' ('+dp?.name+')';}
  else if(BS.dmg>0){db.className='death-banner dmg';dbi.textContent='🩹';dbt.textContent=BS.dmg+' DANO — SEM MORTES';dbs.textContent='Marque '+BS.dmg+' dano em '+dn;}
  else{db.className='death-banner safe';dbi.textContent='🛡';dbt.textContent='SEM DANO';dbs.textContent='O defensor resistiu!';}
  const ab=document.getElementById('apply-dmg-btn');
  ab.disabled=BS.dmg===0; ab.textContent=BS.dmg>0?'⚡ APLICAR DANO NO TRACKER':'✅ SEM DANO';
  ab.classList.remove('applied');
  // History
  battleHist.unshift({n:COMBAT.attackNum,atkName:DB.getUnit(COMBAT.atkUnitId)?.name||'?',atkPlayer:SESSION.getPlayer(COMBAT.atkPlayerId)?.name||'',defName:dn,defPlayer:dp?.name||'',weapon:COMBAT.weapon,hits:BS.hits,dmg:BS.dmg,deaths:BS.deaths});
  COMBAT.attackNum++;
  document.getElementById('attack-counter').textContent=COMBAT.attackNum;
  renderHist();
}

function applyDamageFromBattle(){
  if(BS.dmg<=0)return;
  const ab=document.getElementById('apply-dmg-btn');
  if(ab.classList.contains('applied'))return;
  applyDamageToPlayer(COMBAT.defPlayerId, COMBAT.defUnitId, BS.dmg);
  ab.classList.add('applied');
  ab.textContent='✅ DANO APLICADO';
  SFX.objective();
  setTimeout(()=>{closeBattle();switchTab('pv');if(TRACKER.players.length)activatePVTab(COMBAT.defPlayerId);},800);
}

function renderHist(){
  const sec=document.getElementById('hist-section'),list=document.getElementById('hist-list');
  if(!battleHist.length)return;
  sec.classList.remove('hidden');
  list.innerHTML='';
  battleHist.slice(0,8).forEach(h=>{
    const el=document.createElement('div');el.className='hist-item';
    el.innerHTML=`<div class="hi-n">#${h.n}</div><div class="hi-c"><div class="hi-t">${h.atkPlayer}: ${h.atkName} → ${h.defPlayer}: ${h.defName}</div><div class="hi-s">${h.weapon} · ${h.hits} acertos · ${h.dmg} dano</div></div><div class="hi-d ${h.deaths===0?'safe':''}">${h.deaths>0?'💀'+h.deaths:'🛡'}</div>`;
    list.appendChild(el);
  });
}

// ══════════════════════════════════════════════
// DICE MATH
// ══════════════════════════════════════════════
function d6(){return Math.floor(Math.random()*6)+1;}
function rollStat(A){return A==='d6'?d6():A==='d3'?Math.ceil(Math.random()*3):(parseInt(A)||1);}
function rollDmg(D){return D==='d6'?d6():D==='d3'?Math.ceil(Math.random()*3):(parseInt(D)||1);}
function woundNeeds(S,T){if(S>=T*2)return 2;if(S>T)return 3;if(S===T)return 4;if(S*2>=T)return 5;return 6;}
function svNeeds(Sv,AP){return Math.min(7,Math.max(2,Sv+Math.abs(AP||0)));}

function animDice(grid,rolls,clsFn,total,ms,cb){
  rolls.forEach((val,i)=>{
    setTimeout(()=>{
      const die=document.createElement('div');die.className='die rolling';die.textContent=val;
      grid.appendChild(die);
      setTimeout(()=>{die.classList.remove('rolling');die.classList.add(clsFn(val));},370);
    },i*ms);
  });
  if(total>rolls.length){setTimeout(()=>{const m=document.createElement('div');m.className='more-dice';m.textContent='+'+(total-rolls.length)+' mais';grid.appendChild(m);},rolls.length*ms);}
  setTimeout(cb,rolls.length*ms+470);
}

// ══════════════════════════════════════════════
// OVERLAY CLOSE
// ══════════════════════════════════════════════
['battle-modal','unit-modal','faction-modal','sheet-view-modal'].forEach(id=>{
  document.getElementById(id)?.addEventListener('click',e=>{
    if(e.target.id===id){
      if(id==='battle-modal')closeBattle();
      else if(id==='unit-modal')closeUnitModal();
      else if(id==='faction-modal')closeFactionModal();
      else document.getElementById(id).classList.remove('open');
    }
  });
});

// ══════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════
NAV.go('screen-home', initHome);
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
