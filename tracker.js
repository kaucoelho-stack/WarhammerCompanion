// ═══════════════════════════════════════════════════════
// TRACKER.JS — PV tracking, objectives, CP, turns
// ═══════════════════════════════════════════════════════

let TRACKER = { active:false, turn:1, maxTurns:5, players:[], objectives:[], turnLog:[] };

function initTracker() {
  TRACKER = {
    active: true, turn: 1, maxTurns: 5, turnLog: [],
    objectives: [0,1,2,3,4].map(i => ({ id:i, label:`Obj ${i===2?'Centro':i+1}`, ownerId:null })),
    players: SESSION.players.map(p => {
      const faction = DB.getFaction(p.factionId);
      const minis = [];
      Object.entries(p.units).forEach(([unitId, qty]) => {
        const u = DB.getUnit(unitId);
        if (!u) return;
        for (let i = 0; i < qty; i++) {
          minis.push({ id:`${unitId}-${i}`, unitId, name: qty>1 ? `${u.name} ${i+1}` : u.name,
            maxW: u.W, curW: u.W, dead: false, emoji: u.emoji||'⚔', imageData: u.imageData||null });
        }
      });
      return { playerId: p.id, playerName: p.name, factionId: p.factionId,
               color: faction?.color || '#888', score: 0, cp: 3,
               minis, // flat list of all minis for this player
               units: SESSION.getPlayerUnits(p.id) };
    }),
  };
  saveTracker();
}

function saveTracker() {
  try {
    const slim = { ...TRACKER, players: TRACKER.players.map(p => ({ ...p, units: [] })) };
    localStorage.setItem('wh40k_tracker', JSON.stringify(slim));
  } catch(e) {}
}

function getTrackerPlayer(playerId) { return TRACKER.players.find(p => p.playerId === playerId); }

// ── DAMAGE ────────────────────────────────────────────
function applyDamageToPlayer(playerId, unitId, totalDmg) {
  const tp = getTrackerPlayer(playerId);
  if (!tp) return 0;
  const unitMinis = tp.minis.filter(m => m.unitId === unitId && !m.dead);
  let rem = totalDmg, deaths = 0;
  for (const mini of unitMinis) {
    if (rem <= 0) break;
    if (rem >= mini.curW) { rem -= mini.curW; mini.curW = 0; mini.dead = true; deaths++; SFX.death(); }
    else { mini.curW -= rem; rem = 0; if (deaths === 0) SFX.wound(); }
  }
  saveTracker();
  return deaths;
}

function manualDmg(playerId, miniId, delta) {
  const tp = getTrackerPlayer(playerId);
  if (!tp) return;
  const mini = tp.minis.find(m => m.id === miniId);
  if (!mini) return;
  if (delta < 0) {
    if (mini.dead) { mini.dead = false; mini.curW = 1; }
    else { mini.curW = Math.max(0, mini.curW + delta); if (mini.curW === 0) { mini.dead = true; SFX.death(); } else SFX.wound(); }
  } else {
    mini.curW = Math.min(mini.maxW, mini.curW + delta);
    if (mini.dead && mini.curW > 0) mini.dead = false;
  }
  saveTracker();
  renderPVTab();
  renderScoreboard();
}

// ── CP ────────────────────────────────────────────────
function changeCP(playerId, delta) {
  const tp = getTrackerPlayer(playerId);
  if (!tp) return;
  tp.cp = Math.max(0, Math.min(12, tp.cp + delta));
  if (delta < 0) SFX.cp();
  saveTracker();
  renderScoreboard();
}

// ── OBJECTIVES ───────────────────────────────────────
function cycleObjective(objId) {
  const obj = TRACKER.objectives.find(o => o.id === objId);
  if (!obj) return;
  const players = TRACKER.players;
  const curIdx = obj.ownerId ? players.findIndex(p => p.playerId === obj.ownerId) : -1;
  const nextIdx = (curIdx + 1) % (players.length + 1);
  obj.ownerId = nextIdx < players.length ? players[nextIdx].playerId : null;
  if (obj.ownerId) SFX.objective();
  saveTracker();
  renderObjectives();
  renderScoreboard();
}

// ── END TURN ─────────────────────────────────────────
function endTurn() {
  if (!TRACKER.active) return;
  // Score: 1 pt per objective owned; +1 bonus for most objectives
  const counts = {};
  TRACKER.players.forEach(p => counts[p.playerId] = 0);
  TRACKER.objectives.forEach(o => { if (o.ownerId && counts[o.ownerId] !== undefined) counts[o.ownerId]++; });
  const maxCount = Math.max(...Object.values(counts));
  const leaders = Object.keys(counts).filter(id => counts[id] === maxCount && maxCount > 0);
  TRACKER.players.forEach(p => {
    p.score += counts[p.playerId];
    if (leaders.length === 1 && leaders[0] === p.playerId) p.score += 1;
    p.cp = Math.min(12, p.cp + 1);
  });
  TRACKER.turnLog.push({ turn: TRACKER.turn, scores: TRACKER.players.map(p => ({ id:p.playerId, name:p.playerName, score:p.score, obj:counts[p.playerId] })) });
  SFX.turn();
  if (TRACKER.turn >= TRACKER.maxTurns) { TRACKER.active = false; saveTracker(); showVictory(); return; }
  TRACKER.turn++;
  saveTracker();
  renderTracker();
  const el = document.getElementById('turn-num');
  if (el) { el.style.animation='none'; el.offsetHeight; el.style.animation='turnFlash .6s ease-out'; }
}

function showVictory() {
  const sorted = [...TRACKER.players].sort((a,b) => b.score - a.score);
  const winner = sorted[0];
  const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score;
  SFX.victory();
  const modal = document.getElementById('victory-modal');
  document.getElementById('victory-winner').textContent = isTie ? '⚖ EMPATE!' : `🏆 ${winner.playerName}`;
  document.getElementById('victory-winner').style.color = isTie ? 'var(--gold)' : winner.color;
  document.getElementById('victory-score').innerHTML = sorted.map(p =>
    `<span style="color:${p.color};font-family:var(--ff);font-size:28px">${p.playerName}: ${p.score}</span>`
  ).join('<br>');
  document.getElementById('victory-sub').textContent = isTie ? 'Uma batalha equilibrada!' : `${winner.playerName} dominou o campo!`;
  document.getElementById('victory-log').innerHTML = TRACKER.turnLog.map(t =>
    `<div style="padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="color:var(--muted);font-family:var(--fu);font-size:11px">TURNO ${t.turn}</span>
      ${t.scores.map(s=>`<span style="margin-left:8px;font-size:12px;color:${getTrackerPlayer(s.id)?.color||'#888'}">${s.name}: ${s.obj}obj +${s.score-(TRACKER.turnLog[t.turn-2]?.scores.find(x=>x.id===s.id)?.score||0)}pts</span>`).join('')}
    </div>`
  ).join('');
  modal.classList.add('open');
}

// ── RENDER ────────────────────────────────────────────
function renderTracker() {
  renderScoreboard();
  renderObjectives();
  renderPVTab();
}

function renderScoreboard() {
  const tn = document.getElementById('turn-num');
  if (tn) tn.textContent = TRACKER.turn;
  const tl = document.getElementById('turn-label');
  if (tl) tl.textContent = `Turno ${TRACKER.turn} de ${TRACKER.maxTurns}`;
  const grid = document.getElementById('score-grid');
  if (!grid) return;
  const maxScore = Math.max(...TRACKER.players.map(p=>p.score), 1);
  grid.innerHTML = '';
  TRACKER.players.forEach(p => {
    const isLeading = p.score === maxScore && maxScore > 0;
    const deadCount = p.minis.filter(m=>m.dead).length;
    const card = document.createElement('div');
    card.className = 'score-player-card' + (isLeading?' leading':'');
    card.style.setProperty('--pcolor', p.color);
    card.innerHTML = `
      <div class="spc-name">${p.playerName}</div>
      <div class="spc-faction">${DB.getFaction(p.factionId)?.name||''}</div>
      <div class="spc-score">${p.score}</div>
      <div class="spc-meta">
        <span class="cp-inline">⚡${p.cp}CP</span>
        ${deadCount>0?`<span class="dead-inline">💀${deadCount}</span>`:''}
      </div>`;
    grid.appendChild(card);
  });

  // CP strip
  const cpStrip = document.getElementById('cp-strip');
  if (!cpStrip) return;
  cpStrip.innerHTML = '';
  TRACKER.players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'cp-card';
    div.style.setProperty('--pcolor', p.color);
    div.innerHTML = `
      <div class="cp-top"><span class="cp-name">${p.playerName}</span><span class="cp-val">${p.cp}</span></div>
      <div class="cp-btns">
        <button class="cp-btn spend" onclick="changeCP('${p.playerId}',-1);SFX.click()">− Gastar</button>
        <button class="cp-btn gain"  onclick="changeCP('${p.playerId}',1);SFX.click()">+ Ganhar</button>
      </div>
      <div class="cp-bar-wrap"><div class="cp-bar" style="width:${Math.min(100,(p.cp/6)*100)}%"></div></div>`;
    cpStrip.appendChild(div);
  });
}

function renderObjectives() {
  const grid = document.getElementById('obj-grid');
  if (!grid) return;
  grid.innerHTML = '';
  TRACKER.objectives.forEach(obj => {
    const owner = obj.ownerId ? getTrackerPlayer(obj.ownerId) : null;
    const btn = document.createElement('div');
    btn.className = 'obj-btn';
    btn.style.borderColor = owner ? owner.color : 'var(--border)';
    btn.style.background = owner ? `${owner.color}18` : 'var(--card)';
    btn.innerHTML = `
      <div class="obj-label">${obj.label}</div>
      <div class="obj-owner" style="color:${owner?owner.color:'var(--muted)'}">${owner?owner.playerName:'—'}</div>`;
    btn.onclick = () => { SFX.click(); cycleObjective(obj.id); };
    grid.appendChild(btn);
  });
  // Legend
  const legend = document.getElementById('obj-legend');
  if (legend) {
    legend.innerHTML = TRACKER.players.map(p =>
      `<span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color};margin-right:4px;vertical-align:middle"></span>${p.playerName}</span>`
    ).join(' · ');
  }
}

function renderPVTab() {
  const container = document.getElementById('pv-container');
  if (!container) return;
  // Build player tabs if not done
  const tabBar = document.getElementById('pv-tab-bar');
  if (tabBar && tabBar.children.length !== TRACKER.players.length) {
    tabBar.innerHTML = '';
    TRACKER.players.forEach((p, i) => {
      const tab = document.createElement('div');
      tab.className = 'pv-player-tab' + (i===0?' active':'');
      tab.id = `pvtab-${p.playerId}`;
      tab.style.setProperty('--pcolor', p.color);
      tab.textContent = p.playerName;
      tab.onclick = () => activatePVTab(p.playerId);
      tabBar.appendChild(tab);
    });
    // Show first player panel
    if (TRACKER.players.length > 0) activatePVTab(TRACKER.players[0].playerId);
  }

  // Render all panels
  TRACKER.players.forEach(p => renderPlayerPV(p.playerId));
}

function activatePVTab(playerId) {
  document.querySelectorAll('.pv-player-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pv-player-panel').forEach(t => t.style.display='none');
  const tab = document.getElementById(`pvtab-${playerId}`);
  const panel = document.getElementById(`pvpanel-${playerId}`);
  if (tab) tab.classList.add('active');
  if (panel) panel.style.display = 'block';
}

function renderPlayerPV(playerId) {
  const tp = getTrackerPlayer(playerId);
  if (!tp) return;
  let panel = document.getElementById(`pvpanel-${playerId}`);
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'pv-player-panel';
    panel.id = `pvpanel-${playerId}`;
    panel.style.display = 'none';
    document.getElementById('pv-container').appendChild(panel);
  }
  // Group minis by unitId
  const groups = {};
  tp.minis.forEach(m => { if (!groups[m.unitId]) groups[m.unitId] = []; groups[m.unitId].push(m); });
  panel.innerHTML = '';
  Object.entries(groups).forEach(([unitId, minis]) => {
    const u = DB.getUnit(unitId);
    const alive = minis.filter(m=>!m.dead).length;
    const totalCurW = minis.reduce((s,m)=>s+m.curW,0);
    const totalMaxW = minis.reduce((s,m)=>s+m.maxW,0);
    const section = document.createElement('div');
    section.className = 'pv-unit-section';
    section.style.setProperty('--pcolor', tp.color);
    const imgHtml = u?.imageData ? `<img src="${u.imageData}" style="width:100%;height:100%;object-fit:cover">` : `<span style="font-size:17px">${u?.emoji||'⚔'}</span>`;
    section.innerHTML = `
      <div class="pv-unit-hdr">
        <div class="pv-unit-img">${imgHtml}</div>
        <div class="pv-unit-info">
          <div class="pv-unit-name">${u?.name||'?'}</div>
          <div class="pv-unit-stat">${alive}/${minis.length} vivas · ${totalCurW}/${totalMaxW} PV</div>
        </div>
      </div>
      <div class="pv-minis-wrap" id="pvm-${playerId}-${unitId}"></div>`;
    panel.appendChild(section);
    const wrap = document.getElementById(`pvm-${playerId}-${unitId}`);
    minis.forEach(mini => {
      const pct = mini.maxW > 0 ? mini.curW / mini.maxW : 0;
      const col = pct > .6 ? 'var(--hit)' : pct > .3 ? 'var(--wound)' : 'var(--dmg)';
      const card = document.createElement('div');
      card.className = 'mini-card' + (mini.dead?' dead':'');
      card.innerHTML = `
        <div class="mini-lbl">${mini.name.replace(u?.name+' ','#')}</div>
        <div class="mini-bar-wrap"><div class="mini-bar" style="width:${pct*100}%;background:${col}"></div></div>
        <div class="mini-hp">${mini.dead?'💀':`${mini.curW}/${mini.maxW}`}</div>
        <div class="mini-btns">
          <button class="mini-btn dmg" onclick="manualDmg('${playerId}','${mini.id}',-1)">−</button>
          <button class="mini-btn heal" onclick="manualDmg('${playerId}','${mini.id}',1)">+</button>
        </div>`;
      wrap.appendChild(card);
    });
  });
}
