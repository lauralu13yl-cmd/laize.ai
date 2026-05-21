/**
 * laize.ai — Compare + Favourites Widget
 * Include this script on sectors.html, search.html, tool.html
 *
 * Usage:
 *   <script src="compare-widget.js"></script>
 *
 * On any tool card, add these two buttons:
 *   <button class="lz-compare-btn" data-slug="jasper-ai" data-name="Jasper AI"
 *     data-logo-letter="J" data-logo-color="#c8622a" data-sector="Marketing"
 *     data-tagline="AI copywriting platform">Compare</button>
 *
 *   <button class="lz-fav-btn" data-slug="jasper-ai" data-name="Jasper AI">♡</button>
 *
 * Call window.lzWidget.init() after injecting buttons.
 */

(function(){
  const MAX = 4;
  const KEY_COMPARE = 'laize_compare';
  const KEY_FAVS    = 'laize_favs';

  /* ── STORAGE ── */
  function getCompare(){ try{ return JSON.parse(localStorage.getItem(KEY_COMPARE)||'[]'); }catch(e){ return []; }}
  function setCompare(a){ try{ localStorage.setItem(KEY_COMPARE,JSON.stringify(a)); }catch(e){} }
  function getFavs(){     try{ return JSON.parse(localStorage.getItem(KEY_FAVS)||'[]'); }catch(e){ return []; }}
  function setFavs(a){    try{ localStorage.setItem(KEY_FAVS,JSON.stringify(a)); }catch(e){} }

  /* ── TRAY ── */
  function injectTrayCSS(){
    if(document.getElementById('lz-tray-style')) return;
    const s = document.createElement('style');
    s.id='lz-tray-style';
    s.textContent=`
      #lz-tray{
        position:fixed;bottom:0;left:0;right:0;
        background:#0f0d0a;border-top:1px solid rgba(245,240,232,.12);
        padding:0 1.5rem;height:64px;display:flex;align-items:center;gap:10px;
        z-index:9999;transform:translateY(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);
        font-family:'Space Mono',monospace;
      }
      #lz-tray.visible{transform:translateY(0)}
      #lz-tray-label{font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:rgba(245,240,232,.4);flex-shrink:0}
      #lz-tray-slots{display:flex;gap:6px;flex:1;overflow:hidden}
      .lz-tray-chip{
        display:flex;align-items:center;gap:6px;
        background:rgba(245,240,232,.1);padding:0 8px;height:36px;
        border:1px solid rgba(245,240,232,.2);flex-shrink:0;
      }
      .lz-tray-chip-logo{width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0}
      .lz-tray-chip-name{font-size:11px;color:rgba(245,240,232,.8);white-space:nowrap;max-width:100px;overflow:hidden;text-overflow:ellipsis}
      .lz-tray-chip-x{font-size:10px;color:rgba(245,240,232,.4);cursor:pointer;padding:2px 4px;flex-shrink:0;background:none;border:none;line-height:1}
      .lz-tray-chip-x:hover{color:#c85a38}
      #lz-tray-cta{
        font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
        padding:9px 20px;background:#c85a38;color:#fff;border:none;cursor:pointer;
        flex-shrink:0;margin-left:auto;transition:background .2s;text-decoration:none;
      }
      #lz-tray-cta:hover{background:#e87850}
      #lz-tray-cta:disabled{background:rgba(245,240,232,.15);color:rgba(245,240,232,.3);cursor:not-allowed}
      #lz-tray-clear{font-size:8px;color:rgba(245,240,232,.3);cursor:pointer;background:none;border:none;flex-shrink:0;letter-spacing:.08em;text-transform:uppercase}
      #lz-tray-clear:hover{color:rgba(245,240,232,.6)}
      #lz-toast{
        position:fixed;bottom:76px;right:1.5rem;
        background:#0f0d0a;color:#f5f0e8;
        font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.06em;
        padding:9px 16px;z-index:10000;
        transform:translateY(12px);opacity:0;transition:all .25s;pointer-events:none;
      }
      #lz-toast.show{transform:translateY(0);opacity:1}

      /* card buttons */
      .lz-card-actions{display:flex;gap:6px;margin-top:.65rem}
      .lz-compare-btn{
        font-family:'Space Mono',monospace;font-size:8px;font-weight:700;letter-spacing:.1em;
        text-transform:uppercase;padding:5px 12px;cursor:pointer;transition:all .2s;
        background:transparent;border:1px solid rgba(15,13,10,.2);color:rgba(15,13,10,.5);
        flex:1;
      }
      .lz-compare-btn:hover{border-color:#0f0d0a;color:#0f0d0a;background:rgba(15,13,10,.05)}
      .lz-compare-btn.added{background:#0f0d0a;color:#f5f0e8;border-color:#0f0d0a}
      .lz-compare-btn.added:hover{background:#c85a38;border-color:#c85a38}
      .lz-fav-btn{
        font-size:14px;cursor:pointer;padding:5px 10px;
        background:transparent;border:1px solid rgba(15,13,10,.15);color:rgba(15,13,10,.4);
        transition:all .2s;flex-shrink:0;
      }
      .lz-fav-btn:hover{border-color:#c85a38;color:#c85a38}
      .lz-fav-btn.active{background:#f5e0d8;border-color:#c85a38;color:#c85a38}
    `;
    document.head.appendChild(s);
  }

  function injectTrayDOM(){
    if(document.getElementById('lz-tray')) return;
    const tray = document.createElement('div');
    tray.id='lz-tray';
    tray.innerHTML=`
      <div id="lz-tray-label">Compare</div>
      <div id="lz-tray-slots"></div>
      <a id="lz-tray-cta" href="compare.html" disabled>Compare 0</a>
      <button id="lz-tray-clear" onclick="window.lzWidget.clearCompare()">Clear</button>
    `;
    document.body.appendChild(tray);

    const toast = document.createElement('div');
    toast.id='lz-toast';
    document.body.appendChild(toast);
  }

  function renderTray(){
    const list = getCompare();
    const tray = document.getElementById('lz-tray');
    const slots = document.getElementById('lz-tray-slots');
    const cta = document.getElementById('lz-tray-cta');
    if(!tray||!slots||!cta) return;

    if(list.length===0){ tray.classList.remove('visible'); return; }
    tray.classList.add('visible');

    slots.innerHTML = list.map(t=>`
      <div class="lz-tray-chip">
        <div class="lz-tray-chip-logo" style="background:${t.logo_color||'#555'}">${t.logo_letter||t.name[0]}</div>
        <div class="lz-tray-chip-name">${t.name}</div>
        <button class="lz-tray-chip-x" onclick="window.lzWidget.removeFromCompare('${t.slug}')">✕</button>
      </div>
    `).join('');

    if(list.length>=2){
      cta.removeAttribute('disabled');
      cta.textContent=`Compare ${list.length} →`;
      cta.href='compare.html';
    } else {
      cta.setAttribute('disabled','');
      cta.textContent=`Add ${2-list.length} more`;
    }
  }

  function syncAllButtons(){
    const list = getCompare();
    const favs = getFavs();
    const slugsInCompare = list.map(t=>t.slug);

    document.querySelectorAll('.lz-compare-btn').forEach(btn=>{
      const slug = btn.dataset.slug;
      const inList = slugsInCompare.includes(slug);
      btn.classList.toggle('added', inList);
      btn.textContent = inList ? '✓ Added' : 'Compare';
    });
    document.querySelectorAll('.lz-fav-btn').forEach(btn=>{
      const slug = btn.dataset.slug;
      btn.classList.toggle('active', favs.includes(slug));
      btn.textContent = favs.includes(slug) ? '♥' : '♡';
      btn.title = favs.includes(slug) ? 'Remove from favourites' : 'Add to favourites';
    });
  }

  let toastTimer;
  function showToast(msg){
    const el=document.getElementById('lz-toast');
    if(!el) return;
    el.textContent=msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
  }

  /* ── PUBLIC API ── */
  window.lzWidget = {
    init: function(){
      injectTrayCSS();
      injectTrayDOM();
      renderTray();
      syncAllButtons();

      // delegate events
      document.addEventListener('click', function(e){
        // compare button
        const cBtn = e.target.closest('.lz-compare-btn');
        if(cBtn){
          const tool = {
            slug: cBtn.dataset.slug,
            name: cBtn.dataset.name,
            logo_letter: cBtn.dataset.logoLetter,
            logo_color: cBtn.dataset.logoColor,
            sector: cBtn.dataset.sector,
            tagline: cBtn.dataset.tagline,
            pricing_model: cBtn.dataset.pricingModel,
            starting_price: cBtn.dataset.startingPrice,
            has_free_plan: cBtn.dataset.hasFreePlan==='true',
            has_free_trial: cBtn.dataset.hasFreeTrial==='true',
            trial_days: cBtn.dataset.trialDays||null,
            has_api: cBtn.dataset.hasApi==='true',
            skill_level: cBtn.dataset.skillLevel,
            rating_overall: cBtn.dataset.ratingOverall||null,
            total_raised_usd: cBtn.dataset.totalRaised?parseInt(cBtn.dataset.totalRaised):null,
            users_count: cBtn.dataset.usersCount||null,
            growth_signal: cBtn.dataset.growthSignal||null,
            market_position: cBtn.dataset.marketPosition||null,
            website: cBtn.dataset.website||null,
            tags: cBtn.dataset.tags?cBtn.dataset.tags.split(','):[],
          };
          window.lzWidget.toggleCompare(tool);
          return;
        }
        // fav button
        const fBtn = e.target.closest('.lz-fav-btn');
        if(fBtn){
          const slug = fBtn.dataset.slug;
          const name = fBtn.dataset.name;
          window.lzWidget.toggleFav(slug, name);
        }
      });
    },

    toggleCompare: function(tool){
      const list = getCompare();
      const idx = list.findIndex(t=>t.slug===tool.slug);
      if(idx>=0){
        list.splice(idx,1);
        showToast(`Removed ${tool.name} from comparison`);
      } else {
        if(list.length>=MAX){ showToast(`Max ${MAX} tools — remove one first`); return; }
        list.push(tool);
        showToast(`${tool.name} added — ${list.length>=2?'ready to compare!':'add one more'}`);
      }
      setCompare(list);
      renderTray();
      syncAllButtons();
    },

    removeFromCompare: function(slug){
      const list = getCompare().filter(t=>t.slug!==slug);
      setCompare(list);
      renderTray();
      syncAllButtons();
    },

    clearCompare: function(){
      setCompare([]);
      renderTray();
      syncAllButtons();
    },

    toggleFav: function(slug, name){
      const favs = getFavs();
      const idx = favs.indexOf(slug);
      if(idx>=0){ favs.splice(idx,1); showToast(`Removed ${name} from favourites`); }
      else { favs.push(slug); showToast(`${name} saved to favourites ♥`); }
      setFavs(favs);
      syncAllButtons();
    },

    isFav: function(slug){ return getFavs().includes(slug); },
    isInCompare: function(slug){ return !!getCompare().find(t=>t.slug===slug); },
    getCompare: getCompare,
    getFavs: getFavs,
  };
})();
