


    'use strict';

    // ═══════════════════════════════════════════════════
    // ⚙️ CONFIGURAZIONE GITHUB
    // Istruzioni:
    // 1. Crea un repository su GitHub (es. "dlz3-cmr-data")
    // 2. Carica il file carriers.json nel repo
    // 3. Crea un Gist per lo storico CMR
    // 4. Genera un Personal Access Token con permessi:
    //    - repo (per leggere carriers.json)
    //    - gist (per leggere/scrivere storico)
    // ═══════════════════════════════════════════════════
    const CONFIG = {
        // ── Carrier DB (file JSON nel tuo repo GitHub) ──
        CARRIERS_URL: 'https://raw.githubusercontent.com/TUO_USERNAME/dlz3-cmr-data/main/carriers.json',

        // ── Storico CMR (GitHub Gist) ──
        GIST_ID:    'IL_TUO_GIST_ID',       // es. "abc123def456"
        GIST_FILE:  'cmr_history.json',      // nome file nel Gist
        GH_TOKEN:   'IL_TUO_GITHUB_TOKEN',   // Personal Access Token

        // ── Impostazioni ──
        MAX_HISTORY: 100,    // max CMR nel log
        STATION:     'DLZ3', // nome stazione
    };

    // ═══════════════════════════════════════════════════
    // STORAGE LOCALE
    // ═══════════════════════════════════════════════════
    function savePlates(vrid, trailer, tractor) {
        const db = JSON.parse(GM_getValue('dlz3_plates_db', '{}'));
        db[vrid.trim()] = {
            trailer: trailer.trim(),
            tractor: tractor.trim(),
            ts: Date.now()
        };
        GM_setValue('dlz3_plates_db', JSON.stringify(db));
    }
    function getPlates(vrid) {
        const db = JSON.parse(GM_getValue('dlz3_plates_db', '{}'));
        return db[vrid.trim()] || { trailer: '', tractor: '' };
    }
    function getPlatesDB() {
        return JSON.parse(GM_getValue('dlz3_plates_db', '{}'));
    }
    function clearPlatesDB() {
        GM_setValue('dlz3_plates_db', '{}');
    }
    function getNextCMR() {
        const n = parseInt(GM_getValue('dlz3_cmr_n', '0')) + 1;
        GM_setValue('dlz3_cmr_n', n);
        return String(n).padStart(4, '0');
    }

    // ═══════════════════════════════════════════════════
    // GITHUB API — Storico CMR condiviso
    // ═══════════════════════════════════════════════════

    // Leggi storico da GitHub Gist
    function readHistory(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.github.com/gists/${CONFIG.GIST_ID}`,
            headers: {
                'Authorization': `token ${CONFIG.GH_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            onload: res => {
                try {
                    const gist    = JSON.parse(res.responseText);
                    const content = gist.files?.[CONFIG.GIST_FILE]?.content;
                    const history = content ? JSON.parse(content) : [];
                    callback(null, history);
                } catch (e) {
                    callback(e, []);
                }
            },
            onerror: err => callback(err, []),
        });
    }

    // Scrivi storico su GitHub Gist
    function writeHistory(history, callback) {
        const body = JSON.stringify({
            files: {
                [CONFIG.GIST_FILE]: {
                    content: JSON.stringify(history, null, 2)
                }
            }
        });
        GM_xmlhttpRequest({
            method: 'PATCH',
            url: `https://api.github.com/gists/${CONFIG.GIST_ID}`,
            headers: {
                'Authorization': `token ${CONFIG.GH_TOKEN}`,
                'Content-Type':  'application/json',
                'Accept':        'application/vnd.github.v3+json',
            },
            data: body,
            onload:  res => callback(null, res),
            onerror: err => callback(err),
        });
    }

    // Aggiungi voce allo storico
    function addToHistory(cmrData, callback) {
        const entry = {
            cmrNum:   cmrData.cmrNum,
            vrid:     cmrData.vrid,
            date:     cmrData.date,
            time:     cmrData.time,
            station:  CONFIG.STATION,
            nodeTo:   cmrData.luogo,
            carrier:  cmrData.carrier,
            driver:   cmrData.drv1,
            seal:     cmrData.seal,
            trailer:  cmrData.trail,
            tractor:  cmrData.tract,
            ttype:    cmrData.ttype,
            goods:    cmrData.goods?.map(g => `${g.label}:${g.qty}`).join('|') || '',
            ts:       Date.now(),
        };

        readHistory((err, history) => {
            if (err) history = [];
            history.unshift(entry);
            if (history.length > CONFIG.MAX_HISTORY)
                history.splice(CONFIG.MAX_HISTORY);
            writeHistory(history, callback);
        });
    }

    // ═══════════════════════════════════════════════════
    // GITHUB API — Carrier DB remoto
    // ═══════════════════════════════════════════════════
    let CARRIER_DB = {};      // viene riempito da GitHub
    let carrierDBLoaded = false;

    // Fallback DB locale (carrier più usati a DLZ3)
    const CARRIER_DB_LOCAL = {
        "ASPIC": "LOGISTICA & TRASPORTI SPINELLI CATALDO",
        "NROMA": "NORD ROMA TERMINAL",
        "AFAGS": "GATTI FILASTRO SRL",
        "ABPRP": "ABPRP ATSEU",
        "AGPUE": "AGPUE ATSEU",
        "AAFLI": "AAFLI ATSEU",
        "ACQSM": "Eurotrade 24 GmbH",
        "ADEMI": "2D Express Mariusz i Krzysztof Dabrowscy sp.j.",
        "ACSAL": "Battimelli Carmine",
        "AQAAH": "ELISTORCAR TRANSPORT SP. Z O.O.",
        "AALJF": "Euro-Transport Sp. z o.o.",
        "AFQKH": "FTU EURO TRANS MALGORZATA HANDZEL",
        "APRBL": "Galaxi Haulage Limited",
        "ANGIT": "Ibiza-Speed Sp. z o.o.",
        "AXRPO": "Incampo Giovanni",
        "ACEID": "Kompas Spedycja Sp. z o.o.",
        "AAUMA": "Modica Salvatore",
        "AJDNT": "N&S LOGISTICS",
        "AZGKE": "PASQUALE CALIA",
        "ASHDC": "PRO-PANDA SRL",
        "ATACO": "Przedsiebiorstwo Handlowo-Transportowe TRACOM",
        "ANWRO": "Revox ltd",
        "AFZVG": "SMART DELIVERY SP Z O.O.",
        "ASTZO": "Stepien Sp. z o.o.",
        "AOXRP": "Tako Logistics Sp zoo",
        "ARRKB": "TRANSPORT GABIN",
        "AFTRR": "2F TRASPORTI SRL",
        "AMHMM": "3D Trasporti",
        "ACODH": "DARTRANS DARIUSZ KOPEC",
        "FERCA": "Fercam S.p.A.",
        "BRTXX": "BRT",
        "DHLF":  "DHL Freight GmbH",
        "DHLPE": "DHL PARCEL",
        "DPDXX": "DPD Group UK",
        "HRMUK": "EVRi",
        "RMLGB": "ROYAL MAIL",
        "UPSN":  "UPS Parcel",
        "STOB":  "Eddie Stobart Logistics Plc",
        "MARIT": "Maritime Transport",
        "SENN":  "sennder Deutschland GmbH",
        "SEUR":  "SEUR",
        "DACHS": "Dachser SE",
        "GEFCO": "GEFCO FR",
        "SCHEN": "Schenker Deutschland AG",
        "KHNA":  "Kuehne Nagel Ltd",
        "CHRB":  "C.H. Robinson Europe BV",
        "ARCES": "Arcese trasporti spa",
        "AAGUK": "Amazon.Com Inc (Amazon Freight)",
        "AFXUK": "Amazon Freight Exchange",
        "AAUMS": "Auta Marocchi spa",
        "AFDWZ": "AUTOTRASPORTI AUTUORI ANIELLO",
        "AAUBR": "AUTOTRASPORTI BOMMARTINI SRL",
        "AAUOE": "Autotrasporti Bonello srl",
        "AIXNN": "Autotrasporti Borghi Srl",
        "AZAZV": "Autotrasporti Borrelli Fulvio Srl",
        "AAUCN": "Autotrasporti Calia Nunzio",
        "AXIRZ": "AUTOTRASPORTI CALIA SAVERIO",
        "AOPFN": "Autotrasporti Carestia Srl",
        "ANJKW": "Autotrasporti Costa Cardone Rosario",
        "AADNS": "Autotrasporti de nisi ssrl",
        "AXPJF": "AUTOTRASPORTI F.lli VERDONI SNC",
        "AAFCR": "Autotrasporti Fratelli Convertini S.R.L.",
        "AURYL": "Autotrasporti luca boriati",
        "AMAHH": "AUTOTRASPORTI M3A S.R.L.",
        "AAMRC": "AUTOTRASPORTI MAIMONE ROSARIA CONCETTA",
        "AAUMO": "AUTOTRASPORTI MAIONE SAS",
        "AAUMU": "autotrasporti manna giuseppe",
        "AAUAU": "Autotrasporti Martin Gianluca",
        "AAUME": "Autotrasporti Menegatti S.r.l.",
        "AGVMK": "Autotrasporti Meoli Mauro",
        "AAUPQ": "Autotrasporti Paladino Pasquale",
        "AAUPA": "Autotrasporti Pellini sas",
        "AAPCE": "AUTOTRASPORTI PICCOLI CLAUDIO E FIGLI SRL",
        "AAUPD": "Autotrasporti Pierdomenico srl",
        "ASUWM": "Autotrasporti Popsor Di Nelu Gabriel",
        "AAURS": "AUTOTRASPORTI RDS S.R.L.",
        "AUCRK": "AUTOTRASPORTI RIVIELLO ANTONIO & C. SNC",
        "ASVVT": "Autotrasporti S.Angela srl",
        "AAUIR": "Autotrasporti Sainato Roma srl",
        "AASMS": "AUTOTRASPORTI SINISI MICHELE S.R.L.",
        "AASLF": "Autotrasporti Spinosa Luigi & F. Srl",
        "AERSV": "AUTOTRASPORTI TIRSINA RUSLAN",
        "ANVAN": "AUTOTRASPORTI TIRSINA SERGIU",
        "AQGNR": "AUTOTRASPORTI V.V DI VOICU VITALIE",
        "AOASO": "autotrasporti valchiese srl",
        "AIDQA": "Autotrasporti Veneruso Sergio",
        "AAUTV": "Autotrasporti Vitaliano S.r.l.",
        "ALOAU": "Logistica Garsomur SLU",
        "AMREY": "LOGIST TRANS CITY S.L.",
        "ALOGO": "LOGISTICA GRILLO SLU",
        "AAGQC": "LOGISTICA JUAN RUIZ S.L.",
        "ASYIY": "LOGISTICA PACO LOPEZ S.L.",
        "ALOUS": "Logistica Ursu S.L.",
        "AUPWF": "LOGISTICA Y TRANSPORTE CESPEDES SL",
        "AKIBW": "Logistics consult ltd",
        "ARCHH": "LOGISTICS KINGDOM LIMITED",
    };

    // Carica carrier DB da GitHub (async, con fallback locale)
    function loadCarrierDB() {
        // Prima usa il cache locale se disponibile
        const cached = GM_getValue('dlz3_carriers_cache', '');
        const cachedTs = parseInt(GM_getValue('dlz3_carriers_ts', '0'));
        const ONE_HOUR = 3600000;

        if (cached && (Date.now() - cachedTs) < ONE_HOUR) {
            try {
                CARRIER_DB = JSON.parse(cached);
                carrierDBLoaded = true;
                console.log(`[CMR] Carrier DB da cache: ${Object.keys(CARRIER_DB).length} entries`);
                return;
            } catch(e) {}
        }

        // Carica da GitHub
        GM_xmlhttpRequest({
            method: 'GET',
            url: CONFIG.CARRIERS_URL,
            onload: res => {
                try {
                    const data = JSON.parse(res.responseText);
                    CARRIER_DB = data;
                    carrierDBLoaded = true;
                    // Salva in cache
                    GM_setValue('dlz3_carriers_cache', res.responseText);
                    GM_setValue('dlz3_carriers_ts', Date.now().toString());
                    console.log(`[CMR] Carrier DB caricato da GitHub: ${Object.keys(CARRIER_DB).length} entries`);
                } catch(e) {
                    console.warn('[CMR] Errore parsing carrier DB, uso fallback locale');
                    CARRIER_DB = CARRIER_DB_LOCAL;
                    carrierDBLoaded = true;
                }
            },
            onerror: () => {
                console.warn('[CMR] GitHub non raggiungibile, uso carrier DB locale');
                CARRIER_DB = CARRIER_DB_LOCAL;
                carrierDBLoaded = true;
            }
        });

        // Usa subito il fallback in attesa del caricamento async
        CARRIER_DB = { ...CARRIER_DB_LOCAL };
    }

    function parseScac(raw) {
        if (!raw) return '';
        return raw.trim().split(/[\s(]/)[0].toUpperCase().trim();
    }
    function findCarrier(scacRaw) {
        const scac = parseScac(scacRaw);
        if (!scac) return '';
        if (CARRIER_DB[scac]) return CARRIER_DB[scac];
        const partial = Object.keys(CARRIER_DB)
            .find(k => k.startsWith(scac.slice(0, 4)));
        return partial ? CARRIER_DB[partial] : '';
    }
    function searchCarrier(query) {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        return Object.entries(CARRIER_DB)
            .filter(([c, n]) =>
                c.toLowerCase().includes(q) || n.toLowerCase().includes(q))
            .slice(0, 10)
            .map(([code, name]) => ({ code, name }));
    }

    // ═══════════════════════════════════════════════════
    // NODE DATABASE
    // ═══════════════════════════════════════════════════
    const NODE_DB = {
        "PSR2":  { city:"San Salvo (CH)",           address:"Viale Germania 114\n66050 San Salvo (CH) - ITALY" },
        "MXP6":  { city:"Novara",                   address:"Via Luigi Einaudi 4\n28100 Novara - ITALY" },
        "MXP5":  { city:"Castel San Giovanni (PC)", address:"Strada Dogana Po 2U\n29015 Castel San Giovanni (PC) - ITALY" },
        "MXP3":  { city:"Vercelli",                 address:"Via Rita Levi Montalcini 2\n13100 Vercelli - ITALY" },
        "MXP8":  { city:"Castel San Giovanni (PC)", address:"Strada Dogana Po 4U\n29015 Castel San Giovanni (PC) - ITALY" },
        "BGY1":  { city:"Cividate al Piano (BG)",   address:"SP98\n24050 Cividate al Piano (BG) - ITALY" },
        "BLQ1":  { city:"Castelguglielmo (RO)",     address:"Via Ipzia D'Alessandria\n45020 Castelguglielmo (RO) - ITALY" },
        "BLQ8":  { city:"Spilamberto (MO)",         address:"Via S. Vito 1369\n41057 Spilamberto (MO) - ITALY" },
        "FCO1":  { city:"Passo Corese (RI)",        address:"Via della Meccanica snc\n02032 Passo Corese (RI) - ITALY" },
        "FCO2":  { city:"Colleferro (RM)",          address:"SP21\n00034 Colleferro (RM) - ITALY" },
        "FCO8":  { city:"Fara in Sabina (RI)",      address:"Via della Meccanica 32\n02032 Fara in Sabina (RI) - ITALY" },
        "FCO9":  { city:"Roma",                     address:"Via Mola Saracena\n00065 Prato della Corte (RM) - ITALY" },
        "LIN8":  { city:"Casirate D'Adda (BG)",    address:"Via Gioacchino Rossini\n24040 Casirate D'Adda (BG) - ITALY" },
        "TRN1":  { city:"Torrazza Piemonte (TO)",   address:"SP90 11\n10037 Torrazza Piemonte (TO) - ITALY" },
        "DLZ1":  { city:"Roma",                     address:"Via Giacomo Peroni 462\n00131 Roma (RM) - ITALY" },
        "DLZ2":  { city:"Pomezia (RM)",             address:"Via Vaccareccia 7\n00071 Pomezia (RM) - ITALY" },
        "DLZ3":  { city:"Roma",                     address:"Via della Magliana 375\n00148 Roma (RM) - ITALY" },
        "DLO1":  { city:"Milano",                   address:"Via Vincenzo Toffetti 108\n20139 Milano (MI) - ITALY" },
        "DLO2":  { city:"Origgio (VA)",             address:"Via Del Lavoro 27\n21040 Origgio (VA) - ITALY" },
        "DLO3":  { city:"Burago di Molgora (MB)",   address:"Via Galileo Galilei 13\n20875 Burago di Molgora (MB) - ITALY" },
        "DLO7":  { city:"Mezzate (MI)",             address:"Via Luigi Galvani 9\n20068 Mezzate (MI) - ITALY" },
        "DPI2":  { city:"Brandizzo (TO)",           address:"Via Torino 331\n10032 Brandizzo (TO) - ITALY" },
        "DPI3":  { city:"Grugliasco (TO)",          address:"Strada del Portone 91\n10095 Grugliasco (TO) - ITALY" },
        "DNP1":  { city:"Arzano (NA)",              address:"Corso Salvatore D'Amato 77\n80022 Arzano (NA) - ITALY" },
        "DRU1":  { city:"San Giovanni Teatino (CH)",address:"Via Treviso\n66020 San Giovanni Teatino (CH) - ITALY" },
        "DTC1":  { city:"Calenzano (FI)",           address:"Via Baldanzese 186\n50041 Calenzano (FI) - ITALY" },
        "DVN2":  { city:"Verona",                   address:"Via Augusto Righi 5\n37135 Verona (VR) - ITALY" },
        "DUM1":  { city:"Magione (PG)",             address:"Via Santa Giuliana 27/E\n06063 Magione (PG) - ITALY" },
        "NROMA": { city:"Roma",                     address:"Via della Magliana 375\n00148 Roma (RM) - ITALY" },
        "LIRF":  { city:"Fiumicino (RM)",           address:"Piazzale Caduti Italiani\n00054 Fiumicino (RM) - ITALY" },
        "CCO8":  { city:"Roma",                     address:"Via Mola Saracena\n00065 Prato della Corte (RM) - ITALY" },
        "CNP9":  { city:"Arzano (NA)",              address:"Corso Salvatore D'Amato 83\n80022 Arzano (NA) - ITALY" },
        "XITF":  { city:"Piacenza",                 address:"Strada della Torre della Razza 62\n29100 Piacenza - ITALY" },
        "XITG":  { city:"Francolino di Carpiano",   address:"Via Aldo Moro 4\n20080 Carpiano (MI) - ITALY" },
        "XITH":  { city:"Soresina (CR)",            address:"Via Emilio Caldara 7\n26015 Soresina (CR) - ITALY" },
        "XMP1":  { city:"Arquà Polesine (RO)",      address:"Via Maestri Del Lavoro 990\n45031 Arquà Polesine (RO) - ITALY" },
        "OER4":  { city:"Cortemaggiore (PC)",       address:"Viale Gabriele Rossetti 5\nCortemaggiore (PC) - ITALY" },
        "ONP1":  { city:"Salerno",                  address:"Via Acquasanta 3\nSalerno (SA) - ITALY" },
        "ONP2":  { city:"Benevento",                address:"Contrada S. Francesco\n82100 Benevento (BN) - ITALY" },
        "OLZ3":  { city:"Villa Santa Lucia (FR)",   address:"Via Campo Largo 8\n03030 Villa Santa Lucia (FR) - ITALY" },
        "OPU1":  { city:"Lecce",                    address:"Zona Industriale 2\nLecce (LE) - ITALY" },
        "OPU2":  { city:"Taranto",                  address:"Via F. di Giorgio Martini\nTaranto (TA) - ITALY" },
    };

    // ═══════════════════════════════════════════════════
    // TIPI MERCE
    // ═══════════════════════════════════════════════════
    const GOODS_LIST = [
        { id:'epal',   icon:'🪵', label:'Epal',      shortLabel:'Europallet EPAL'      },
        { id:'oneway', icon:'🔁', label:'OneWay',    shortLabel:'OneWay Pallet'        },
        { id:'light',  icon:'🪶', label:'Light',     shortLabel:'Light Items'          },
        { id:'jpcart', icon:'🛒', label:'JP Cart',   shortLabel:'JP Cart'              },
        { id:'fmis',   icon:'📐', label:'F. misura', shortLabel:'Fuori Misura'         },
        { id:'ampal',  icon:'🟦', label:'AMPAL',     shortLabel:'AMPAL Plastic Pallet' },
        { id:'altro',  icon:'✏️', label:'Altro',     shortLabel:'Altro / Other'        },
    ];

    let selectedGoods = [];

    // ═══════════════════════════════════════════════════
    // ROUTER + INIT
    // ═══════════════════════════════════════════════════
    loadCarrierDB();

    if (window.location.href.includes('track.relay.amazon.dev')) {
        initRelay();
    } else if (window.location.href.includes('yms/shipclerk')) {
        initShipClerk();
    }

    // ╔══════════════════════════════════════════════════╗
    // ║  MODULO 1 — RELAY                               ║
    // ╚══════════════════════════════════════════════════╝
    function initRelay() {

        function getDrivers(container) {
            const drivers = [];
            if (!container) return drivers;
            const sec = container.querySelector('.css-7hi57t');
            if (!sec) return drivers;
            sec.querySelectorAll('.css-1w1nhw5 button.css-rgh3oe').forEach(btn => {
                btn.querySelectorAll('span').forEach(sp => {
                    if (!sp.querySelector('span') && !sp.querySelector('svg')) {
                        const t = sp.textContent.trim();
                        if (t.length > 2 && t.length < 60 && !drivers.includes(t))
                            drivers.push(t);
                    }
                });
            });
            return drivers;
        }

        function getScacRaw(row) {
            const el = row.querySelector('.css-1oik3mk p.css-xjepgn');
            return el ? el.textContent.trim() : '';
        }

        function getParentContainer(row) {
            let el = row;
            for (let i = 0; i < 8; i++) {
                el = el.parentElement;
                if (!el) break;
                if (el.querySelector('.css-7hi57t') &&
                    el.querySelector('.css-184bhl9')) return el;
            }
            return row;
        }

        function addButtons() {
            // Aggiungi pulsante Storico (una volta sola)
            addHistoryButton();

            document.querySelectorAll('[mdn-expander-title]').forEach(row => {
                if (row.querySelector('.cmr-btn')) return;
                const vEl = row.querySelector('p.css-17xh5uu');
                if (!vEl) return;
                const vrid     = vEl.textContent.trim();
                const nodes    = row.querySelectorAll('p.css-1mefxab');
                const nodeTo   = nodes[1]?.textContent.trim() || '';
                const cEl      = row.querySelector('p.css-pmdsih');
                const contType = cEl?.title || cEl?.textContent.trim() || '';
                const scacRaw  = getScacRaw(row);

                const btn = document.createElement('button');
                btn.className = 'cmr-btn';
                btn.innerHTML = '🖨️ CMR';
                btn.title = `CMR — ${vrid}`;
                btn.style.cssText = `
                    background:linear-gradient(135deg,#FF9900,#e68a00);
                    color:#000;border:none;border-radius:4px;
                    padding:3px 10px;font-size:11px;font-weight:bold;
                    cursor:pointer;margin-left:8px;vertical-align:middle;
                    box-shadow:0 1px 4px rgba(0,0,0,0.3);
                `;
                btn.addEventListener('click', e => {
                    e.stopPropagation(); e.preventDefault();
                    selectedGoods = [];
                    const cont    = getParentContainer(row);
                    const drivers = getDrivers(cont);
                    const plates  = getPlates(vrid);
                    openPopup({
                        vrid, nodeTo, contType, scacRaw,
                        carrier: findCarrier(scacRaw),
                        drivers,
                        trailer: plates.trailer,
                        tractor: plates.tractor,
                    });
                });
                row.querySelector('.css-184bhl9')?.appendChild(btn);
            });
        }

        // ── Pulsante Storico (fisso in basso a destra) ──
        function addHistoryButton() {
            if (document.getElementById('cmr-hist-fab')) return;
            const fab = document.createElement('button');
            fab.id = 'cmr-hist-fab';
            fab.innerHTML = '📋 Storico CMR';
            fab.style.cssText = `
                position:fixed;bottom:24px;right:24px;z-index:99998;
                background:#0073bb;color:#fff;border:none;
                border-radius:8px;padding:10px 18px;
                font-size:13px;font-weight:bold;cursor:pointer;
                box-shadow:0 4px 14px rgba(0,115,187,0.5);
                font-family:Arial,sans-serif;
                transition:all 0.2s;
            `;
            fab.addEventListener('mouseenter',
                () => fab.style.background = '#005f99');
            fab.addEventListener('mouseleave',
                () => fab.style.background = '#0073bb');
            fab.onclick = () => showHistory();
            document.body.appendChild(fab);
        }

        // ── Modal Storico CMR ──
        function showHistory() {
            document.getElementById('cmr-hist-modal')?.remove();

            const R = {
                bg:'#0f1111', panel:'#1a1f2e', panel2:'#232b3e',
                border:'#2d3748', accent:'#0073bb', orange:'#FF9900',
                text:'#e8eaed', label:'#8a9bb0',
                success:'#2ecc71', danger:'#e74c3c',
            };

            const modal = document.createElement('div');
            modal.id = 'cmr-hist-modal';
            modal.style.cssText = `
                position:fixed;top:0;left:0;width:100%;height:100%;
                background:rgba(0,0,0,0.75);z-index:999999;
                display:flex;align-items:center;justify-content:center;
                font-family:Arial,sans-serif;backdrop-filter:blur(3px);
            `;

            const box = document.createElement('div');
            box.style.cssText = `
                background:${R.bg};border:1px solid ${R.border};
                border-radius:8px;width:900px;max-width:96vw;
                max-height:88vh;display:flex;flex-direction:column;
                box-shadow:0 20px 60px rgba(0,0,0,0.7);
            `;

            // Header
            box.innerHTML = `
            <div style="background:${R.panel};border-bottom:1px solid ${R.border};
                padding:16px 24px;border-radius:8px 8px 0 0;
                display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:20px;">📋</span>
                    <div>
                        <div style="color:${R.text};font-size:16px;font-weight:700;">
                            Storico CMR — ${CONFIG.STATION}
                        </div>
                        <div style="color:${R.label};font-size:11px;">
                            Ultime ${CONFIG.MAX_HISTORY} bolle generate
                        </div>
                    </div>
                </div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <button id="hist-refresh" style="
                        background:transparent;color:${R.accent};
                        border:1px solid ${R.accent};
                        padding:6px 14px;border-radius:6px;
                        cursor:pointer;font-size:12px;font-family:inherit;">
                        🔄 Aggiorna
                    </button>
                    <button id="hist-export" style="
                        background:transparent;color:${R.success};
                        border:1px solid ${R.success};
                        padding:6px 14px;border-radius:6px;
                        cursor:pointer;font-size:12px;font-family:inherit;">
                        📥 Esporta CSV
                    </button>
                    <button id="hist-close" style="
                        background:${R.panel2};border:1px solid ${R.border};
                        color:${R.label};width:32px;height:32px;
                        border-radius:6px;cursor:pointer;font-size:16px;
                        display:flex;align-items:center;justify-content:center;">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Contenuto — viene riempito dopo il caricamento -->
            <div id="hist-body" style="flex:1;overflow-y:auto;padding:16px 24px;">
                <div style="text-align:center;padding:40px;color:${R.label};">
                    <div style="font-size:24px;margin-bottom:8px;">⏳</div>
                    Caricamento storico da GitHub...
                </div>
            </div>

            <!-- Footer -->
            <div style="background:${R.panel};border-top:1px solid ${R.border};
                padding:10px 24px;border-radius:0 0 8px 8px;
                display:flex;justify-content:space-between;align-items:center;">
                <span style="color:${R.label};font-size:11px;" id="hist-status">
                    Connessione a GitHub in corso...
                </span>
                <span style="color:${R.label};font-size:11px;">
                    Token: ${CONFIG.GH_TOKEN ? '✓ configurato' : '⚠ mancante'}
                </span>
            </div>
            `;

            modal.appendChild(box);
            document.body.appendChild(modal);

            modal.addEventListener('click', e => {
                if (e.target === modal) modal.remove();
            });
            box.querySelector('#hist-close').onclick = () => modal.remove();

            // Carica storico
            loadHistoryView(box, R);

            box.querySelector('#hist-refresh').onclick = () =>
                loadHistoryView(box, R);

            box.querySelector('#hist-export').onclick = () =>
                exportCSV(box);
        }

        function loadHistoryView(box, R) {
            const body   = box.querySelector('#hist-body');
            const status = box.querySelector('#hist-status');

            body.innerHTML = `
                <div style="text-align:center;padding:40px;color:#8a9bb0;">
                    <div style="font-size:24px;margin-bottom:8px;">⏳</div>
                    Caricamento da GitHub...
                </div>`;

            readHistory((err, history) => {
                if (err || !history.length) {
                    body.innerHTML = `
                        <div style="text-align:center;padding:40px;
                            color:#8a9bb0;">
                            <div style="font-size:32px;margin-bottom:10px;">
                                📭
                            </div>
                            <div style="font-size:14px;">
                                ${err
                                    ? '⚠ Errore connessione GitHub. Controlla il token.'
                                    : 'Nessuna CMR nello storico ancora.'}
                            </div>
                        </div>`;
                    if (status) status.textContent =
                        err ? '❌ Errore GitHub' : '✓ Storico vuoto';
                    return;
                }

                if (status) status.textContent =
                    `✓ ${history.length} CMR caricate da GitHub`;

                // Tabella storico
                const table = `
                <table style="width:100%;border-collapse:collapse;
                    font-size:12px;">
                    <thead>
                        <tr style="background:${R.panel};
                            color:${R.label};text-transform:uppercase;
                            font-size:10px;letter-spacing:0.5px;">
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};
                                width:60px;">N° CMR</th>
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};">VRID</th>
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};">Destinazione</th>
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};">Carrier</th>
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};">Driver</th>
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};">Seal</th>
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};">Tipo</th>
                            <th style="padding:8px 10px;text-align:left;
                                border-bottom:1px solid ${R.border};">Data</th>
                            <th style="padding:8px 10px;text-align:center;
                                border-bottom:1px solid ${R.border};
                                width:40px;">Staz.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.map((h, i) => `
                        <tr style="
                            background:${i%2===0 ? R.panel : 'transparent'};
                            transition:background 0.1s;
                            color:${R.text};"
                            onmouseenter="this.style.background='${R.panel2}'"
                            onmouseleave="this.style.background='${i%2===0 ? R.panel : 'transparent'}'">
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};">
                                <span style="color:${R.orange};font-weight:700;">
                                    ${h.cmrNum}
                                </span>
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};">
                                <span style="color:${R.accent};font-family:monospace;">
                                    ${h.vrid}
                                </span>
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};">
                                ${h.nodeTo || '—'}
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};
                                max-width:160px;overflow:hidden;
                                text-overflow:ellipsis;white-space:nowrap;"
                                title="${h.carrier}">
                                ${h.carrier || '—'}
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};">
                                ${h.driver || '—'}
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};
                                font-family:monospace;color:${R.success};">
                                ${h.seal}
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};">
                                <span style="
                                    background:${h.ttype==='INTERNATIONAL'
                                        ? 'rgba(0,115,187,0.2)'
                                        : 'rgba(46,204,113,0.15)'};
                                    color:${h.ttype==='INTERNATIONAL'
                                        ? R.accent : R.success};
                                    border:1px solid ${h.ttype==='INTERNATIONAL'
                                        ? R.accent : R.success};
                                    border-radius:8px;padding:1px 7px;
                                    font-size:10px;">
                                    ${h.ttype === 'INTERNATIONAL' ? '🌍 INT' : '🇮🇹 NAZ'}
                                </span>
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};
                                color:${R.label};font-size:11px;">
                                ${h.date} ${h.time}
                            </td>
                            <td style="padding:7px 10px;
                                border-bottom:1px solid ${R.border};
                                text-align:center;">
                                <span style="
                                    background:rgba(255,153,0,0.15);
                                    color:${R.orange};border-radius:4px;
                                    padding:1px 6px;font-size:10px;
                                    font-weight:700;">
                                    ${h.station || CONFIG.STATION}
                                </span>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>`;

                body.innerHTML = table;
            });
        }

        // Esporta storico in CSV
        function exportCSV(box) {
            readHistory((err, history) => {
                if (err || !history.length) {
                    alert('Nessun dato da esportare');
                    return;
                }
                const headers = [
                    'N°CMR','VRID','Data','Ora','Stazione',
                    'Destinazione','Carrier','Driver','Seal',
                    'Trailer','Tractor','Tipo','Merce'
                ];
                const rows = history.map(h => [
                    h.cmrNum, h.vrid, h.date, h.time,
                    h.station, h.nodeTo, h.carrier,
                    h.driver, h.seal, h.trailer,
                    h.tractor, h.ttype, h.goods
                ].map(v => `"${(v||'').replace(/"/g,'""')}"`).join(','));

                const csv = [headers.join(','), ...rows].join('\n');
                const blob = new Blob(['\ufeff' + csv],
                    { type: 'text/csv;charset=utf-8;' });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement('a');
                a.href     = url;
                a.download = `CMR_storico_${CONFIG.STATION}_${
                    new Date().toLocaleDateString('it-IT')
                        .replace(/\//g,'-')}.csv`;
                a.click();
                URL.revokeObjectURL(url);
            });
        }

        // ──────────────────────────────────────────────
        // POPUP (stile Relay)
        // ──────────────────────────────────────────────
        function openPopup(d) {
            document.getElementById('cmr-ov')?.remove();

            const date     = new Date().toLocaleDateString('it-IT');
            const cmrNum   = getNextCMR();
            const nodeI    = NODE_DB[d.nodeTo] || { city: d.nodeTo, address: '' };
            const plates   = getPlates(d.vrid);
            const trailer  = plates.trailer || d.trailer;
            const tractor  = plates.tractor || d.tractor;
            const dbCount  = Object.keys(getPlatesDB()).length;
            const scacCode = parseScac(d.scacRaw);

            const R = {
                bg:'#0f1111', panel:'#1a1f2e', panel2:'#232b3e',
                border:'#2d3748', accent:'#0073bb', accentHov:'#005f99',
                orange:'#FF9900', text:'#e8eaed', label:'#8a9bb0',
                success:'#2ecc71', danger:'#e74c3c', warn:'#f39c12',
            };

            const ov = document.createElement('div');
            ov.id = 'cmr-ov';
            ov.style.cssText = `
                position:fixed;top:0;left:0;width:100%;height:100%;
                background:rgba(0,0,0,0.75);z-index:999999;
                display:flex;align-items:center;justify-content:center;
                font-family:Arial,sans-serif;backdrop-filter:blur(3px);
            `;

            const pop = document.createElement('div');
            pop.style.cssText = `
                background:${R.bg};border:1px solid ${R.border};
                border-radius:8px;width:940px;max-width:97vw;
                max-height:93vh;overflow-y:auto;
                box-shadow:0 20px 60px rgba(0,0,0,0.7);
            `;

            const IS = `width:100%;padding:8px 12px;
                background:${R.panel2};border:1px solid ${R.border};
                border-radius:6px;color:${R.text};font-size:13px;
                font-family:inherit;outline:none;box-sizing:border-box;
                transition:border-color 0.2s;`;

            const LS = `font-size:11px;color:${R.label};font-weight:600;
                display:block;margin-bottom:5px;text-transform:uppercase;
                letter-spacing:0.5px;`;

            const SS = `background:${R.panel};border:1px solid ${R.border};
                border-radius:6px;padding:14px;`;

            // Cards driver
            const dCards = d.drivers.map((name, i) => `
                <div class="dcard" data-n="${name}" style="
                    display:flex;align-items:center;gap:10px;
                    padding:8px 14px;
                    border:1px solid ${i===0 ? R.accent : R.border};
                    border-radius:6px;cursor:pointer;margin-bottom:6px;
                    background:${i===0 ? R.panel2 : R.panel};
                    transition:all 0.15s;">
                    <div style="width:30px;height:30px;border-radius:50%;
                        background:${R.panel2};border:1px solid ${R.border};
                        display:flex;align-items:center;justify-content:center;
                        font-size:14px;">👤</div>
                    <span style="color:${R.text};font-weight:600;
                        font-size:13px;">${name}</span>
                    <span class="dck" style="margin-left:auto;
                        color:${R.accent};font-size:12px;font-weight:bold;">
                        ${i===0 ? '✓ Selezionato' : ''}
                    </span>
                </div>`).join('');

            // Cards merci
            const gCards = GOODS_LIST.map(g => `
                <div class="gcard" id="gc-${g.id}"
                     data-id="${g.id}" data-label="${g.shortLabel}" style="
                    border:1px solid ${R.border};border-radius:6px;
                    padding:8px 4px;text-align:center;cursor:pointer;
                    background:${R.panel};transition:all 0.15s;">
                    <div style="font-size:20px;">${g.icon}</div>
                    <div style="font-size:9px;font-weight:600;margin-top:3px;
                        color:${R.text};line-height:1.2;">${g.label}</div>
                </div>`).join('');

            const plateBadge = v => v
                ? `<span style="background:rgba(46,204,113,0.2);
                    color:${R.success};border:1px solid ${R.success};
                    border-radius:10px;padding:1px 8px;
                    font-size:10px;margin-left:6px;">✓ ShipClerk</span>`
                : `<span style="background:rgba(231,76,60,0.2);
                    color:${R.danger};border:1px solid ${R.danger};
                    border-radius:10px;padding:1px 8px;
                    font-size:10px;margin-left:6px;">⚠ mancante</span>`;

            pop.innerHTML = `
            <!-- HEADER -->
            <div style="background:${R.panel};border-bottom:1px solid ${R.border};
                padding:16px 24px;border-radius:8px 8px 0 0;
                display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:14px;">
                    <svg width="75" height="24" viewBox="0 0 220 80"
                        xmlns="http://www.w3.org/2000/svg">
                        <text x="2" y="58" font-family="Arial,sans-serif"
                            font-size="52" font-weight="700" fill="${R.text}">
                            amazon
                        </text>
                        <path d="M18 66 C 75 95, 148 95, 205 66"
                            stroke="${R.orange}" stroke-width="7"
                            fill="none" stroke-linecap="round"/>
                    </svg>
                    <div style="width:1px;height:28px;
                        background:${R.border};"></div>
                    <div>
                        <div style="color:${R.text};font-size:16px;
                            font-weight:700;">CMR Generator</div>
                        <div style="color:${R.label};font-size:11px;">
                            DLZ3 — Via della Magliana 375, Roma
                        </div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;
                    flex-wrap:wrap;">
                    <span style="background:rgba(0,115,187,0.2);
                        color:${R.accent};border:1px solid ${R.accent};
                        border-radius:10px;padding:2px 10px;
                        font-size:11px;font-weight:600;">
                        VRID: ${d.vrid}
                    </span>
                    <span style="background:rgba(255,153,0,0.15);
                        color:${R.orange};border:1px solid ${R.orange};
                        border-radius:10px;padding:2px 10px;font-size:11px;">
                        → ${d.nodeTo}
                    </span>
                    <span style="background:rgba(46,204,113,0.15);
                        color:${R.success};border:1px solid ${R.success};
                        border-radius:10px;padding:2px 10px;
                        font-size:11px;font-weight:600;">
                        CMR N°${cmrNum}
                    </span>
                    <button id="px-close" style="
                        background:${R.panel2};border:1px solid ${R.border};
                        color:${R.label};width:32px;height:32px;
                        border-radius:6px;cursor:pointer;font-size:16px;
                        display:flex;align-items:center;justify-content:center;">
                        ✕
                    </button>
                </div>
            </div>

            ${!d.carrier ? `
            <div style="background:rgba(243,156,18,0.1);
                border-left:3px solid ${R.warn};
                padding:10px 24px;font-size:12px;color:${R.warn};">
                ⚠ Carrier <strong>${d.scacRaw}</strong> non trovato nel DB.
                ${carrierDBLoaded
                    ? `DB caricato (${Object.keys(CARRIER_DB).length} entries)`
                    : 'DB in caricamento...'}
            </div>` : ''}

            <!-- BODY FORM -->
            <div style="padding:20px 24px;
                display:grid;grid-template-columns:1fr 1fr;gap:16px;">

                <div>
                    <label style="${LS}">📦 Box 1 — Mittente</label>
                    <textarea id="px-mitt" rows="4"
                        style="${IS}font-family:inherit;"
                    >DLZ3\nVia della Magliana 375\n00148 Roma (RM)\nITALY</textarea>
                </div>
                <div>
                    <label style="${LS}">📍 Box 2 — Destinatario</label>
                    <textarea id="px-dest" rows="4"
                        style="${IS}font-family:inherit;"
                    >${d.nodeTo}\n${nodeI.address}</textarea>
                </div>
                <div>
                    <label style="${LS}">📌 Box 3 — Luogo Consegna</label>
                    <input id="px-luogo" type="text"
                        value="${nodeI.city}" style="${IS}">
                </div>
                <div>
                    <label style="${LS}">🏭 Box 4 — Luogo & Data Presa</label>
                    <input id="px-presa" type="text"
                        value="ROMA - ITALY - ${date}" style="${IS}">
                </div>

                <!-- Carrier autocomplete -->
                <div style="position:relative;">
                    <label style="${LS}">🚚 Box 16 — Carrier
                        <span style="font-weight:400;text-transform:none;
                            color:${R.label};">
                            (${d.scacRaw} → ${scacCode})
                        </span>
                    </label>
                    <input id="px-carrier" type="text"
                        value="${d.carrier || d.scacRaw || ''}"
                        placeholder="Cerca carrier..."
                        style="${IS}${!d.carrier
                            ? `border-color:${R.warn};`
                            : `border-color:${R.accent};`}">
                    <div id="px-csugg" style="
                        position:absolute;top:100%;left:0;right:0;z-index:300;
                        background:${R.panel2};border:1px solid ${R.border};
                        border-top:none;border-radius:0 0 6px 6px;
                        box-shadow:0 8px 24px rgba(0,0,0,0.4);
                        display:none;max-height:200px;overflow-y:auto;"></div>
                </div>
                <div>
                    <label style="${LS}">🔢 VRID</label>
                    <input id="px-vrid" type="text"
                        value="${d.vrid}" style="${IS}">
                </div>

                <!-- TIPO TRASPORTO -->
                <div style="grid-column:1/3;">
                    <label style="${LS}">🌍 Tipo Trasporto</label>
                    <div style="display:flex;gap:10px;">
                        <div class="ttype" data-val="INTERNATIONAL" style="
                            flex:1;padding:12px 16px;cursor:pointer;
                            border:1px solid ${R.accent};border-radius:6px;
                            background:rgba(0,115,187,0.15);
                            display:flex;align-items:center;gap:10px;">
                            <div style="width:14px;height:14px;
                                border-radius:50%;background:${R.accent};
                                flex-shrink:0;"></div>
                            <div>
                                <div style="color:${R.text};font-weight:600;
                                    font-size:13px;">🌍 INTERNATIONAL</div>
                                <div style="color:${R.label};font-size:10px;">
                                    Trasporto Internazionale</div>
                            </div>
                        </div>
                        <div class="ttype" data-val="NATIONAL" style="
                            flex:1;padding:12px 16px;cursor:pointer;
                            border:1px solid ${R.border};border-radius:6px;
                            background:${R.panel};
                            display:flex;align-items:center;gap:10px;">
                            <div style="width:14px;height:14px;
                                border-radius:50%;
                                border:2px solid ${R.border};
                                flex-shrink:0;"></div>
                            <div>
                                <div style="color:${R.label};font-weight:600;
                                    font-size:13px;">🇮🇹 NATIONAL</div>
                                <div style="color:${R.label};font-size:10px;
                                    opacity:0.6;">Trasporto Nazionale</div>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" id="px-ttype" value="INTERNATIONAL">
                </div>

                <!-- DRIVER -->
                <div style="grid-column:1/3;">
                    <label style="${LS}">👤 Box 23 — Driver</label>
                    <div id="dcard-wrap" style="margin-bottom:10px;">
                        ${dCards || `
                        <div style="padding:12px;border:1px solid ${R.border};
                            border-radius:6px;color:${R.danger};font-size:12px;
                            background:rgba(231,76,60,0.1);">
                            ⚠ Nessun driver trovato automaticamente.
                        </div>`}
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;
                        gap:12px;">
                        <div>
                            <label style="${LS}">Driver principale</label>
                            <input id="px-drv1" type="text"
                                value="${d.drivers[0]||''}"
                                placeholder="Nome autista..."
                                style="${IS}font-weight:600;">
                        </div>
                        <div>
                            <label style="${LS}">Co-driver</label>
                            <input id="px-drv2" type="text"
                                value="${d.drivers[1]||''}"
                                placeholder="Co-driver..."
                                style="${IS}">
                        </div>
                    </div>
                </div>

                <!-- TARGHE -->
                <div>
                    <label style="${LS}">🚛 Trailer ${plateBadge(trailer)}</label>
                    <input id="px-trail" type="text"
                        value="${trailer}" placeholder="Es. XA470YT"
                        style="${IS}${trailer
                            ? `border-color:${R.success};`
                            : `border-color:${R.danger};`}">
                </div>
                <div>
                    <label style="${LS}">🚛 Tractor ${plateBadge(tractor)}</label>
                    <input id="px-tract" type="text"
                        value="${tractor}" placeholder="Es. GP502HS"
                        style="${IS}${tractor
                            ? `border-color:${R.success};`
                            : `border-color:${R.danger};`}">
                </div>

                <!-- SEAL -->
                <div>
                    <label style="${LS}">🔒 Seal Number
                        <span style="color:${R.danger};">*</span>
                    </label>
                    <input id="px-seal" type="text" value=""
                        placeholder="OBBLIGATORIO"
                        style="${IS}border-color:${R.danger};
                            font-size:14px;font-weight:700;">
                </div>
                <!-- N° CMR -->
                <div>
                    <label style="${LS}">📋 N° CMR</label>
                    <input id="px-cmr" type="text"
                        value="${cmrNum}" style="${IS}">
                </div>

                <!-- MERCI -->
                <div style="grid-column:1/3;">
                    <div style="${SS}">
                        <label style="${LS}margin-bottom:12px;">
                            📦 Carico — Tipo merce
                        </label>
                        <div style="display:grid;
                            grid-template-columns:repeat(7,1fr);
                            gap:8px;margin-bottom:12px;">
                            ${gCards}
                        </div>
                        <div id="goods-list" style="
                            min-height:42px;background:${R.panel2};
                            border:1px solid ${R.border};border-radius:6px;
                            padding:8px 12px;display:flex;
                            flex-wrap:wrap;gap:8px;align-items:center;">
                            <span style="color:${R.label};font-size:12px;">
                                Nessuna merce — clicca le card
                            </span>
                        </div>
                        <div style="margin-top:10px;">
                            <label style="${LS}">Natura merce (Box 9)</label>
                            <input id="px-goods-desc" type="text"
                                value="Amazon Packages"
                                placeholder="Es. Amazon Packages..."
                                style="${IS}">
                        </div>
                    </div>
                </div>

                <!-- NOTE -->
                <div style="grid-column:1/3;">
                    <label style="${LS}">📝 Note / ADR</label>
                    <textarea id="px-note" rows="2"
                        style="${IS}font-family:inherit;"
                    >NOT RESTRICTED - NO DANGEROUS GOODS TRANSPORT\n(according SP 188 ADR/RID/IMDG-Code)</textarea>
                </div>
            </div>

            <!-- FOOTER -->
            <div style="background:${R.panel};border-top:1px solid ${R.border};
                padding:14px 24px;border-radius:0 0 8px 8px;
                display:flex;gap:10px;justify-content:flex-end;
                align-items:center;">
                <span style="color:${R.label};font-size:11px;
                    margin-right:auto;" id="px-save-status"></span>
                <button id="px-sc" style="
                    background:transparent;color:${R.accent};
                    border:1px solid ${R.accent};padding:8px 16px;
                    border-radius:6px;cursor:pointer;
                    font-size:12px;font-family:inherit;">
                    🔍 ShipClerk
                </button>
                <button id="px-cancel" style="
                    background:${R.panel2};color:${R.label};
                    border:1px solid ${R.border};padding:8px 18px;
                    border-radius:6px;cursor:pointer;
                    font-size:13px;font-family:inherit;">
                    Annulla
                </button>
                <button id="px-print" style="
                    background:${R.orange};color:#000;border:none;
                    padding:10px 28px;border-radius:6px;cursor:pointer;
                    font-size:14px;font-weight:700;font-family:inherit;
                    box-shadow:0 2px 8px rgba(255,153,0,0.4);">
                    🖨️ Stampa CMR — 3 copie A4
                </button>
            </div>
            `;

            ov.appendChild(pop);
            document.body.appendChild(ov);

            // Focus
            pop.querySelectorAll('input,textarea').forEach(el => {
                el.addEventListener('focus', () => {
                    el.style.borderColor = R.accent;
                    el.style.boxShadow = `0 0 0 2px rgba(0,115,187,0.25)`;
                });
                el.addEventListener('blur', () => {
                    if (!el.style.borderColor.includes('2ecc71') &&
                        !el.style.borderColor.includes('e74c3c') &&
                        !el.style.borderColor.includes('f39c12'))
                        el.style.borderColor = R.border;
                    el.style.boxShadow = 'none';
                });
            });

            // Driver click
            pop.querySelectorAll('.dcard').forEach(c => {
                c.addEventListener('click', () => {
                    pop.querySelectorAll('.dcard').forEach(x => {
                        x.style.borderColor = R.border;
                        x.style.background  = R.panel;
                        x.querySelector('.dck').textContent = '';
                    });
                    c.style.borderColor = R.accent;
                    c.style.background  = R.panel2;
                    c.querySelector('.dck').textContent = '✓ Selezionato';
                    pop.querySelector('#px-drv1').value = c.dataset.n;
                });
            });

            // Transport toggle
            pop.querySelectorAll('.ttype').forEach(btn => {
                btn.addEventListener('click', () => {
                    pop.querySelectorAll('.ttype').forEach(b => {
                        b.style.borderColor = R.border;
                        b.style.background  = R.panel;
                        const dot = b.querySelector('div');
                        dot.style.background   = 'transparent';
                        dot.style.border       = `2px solid ${R.border}`;
                    });
                    btn.style.borderColor = R.accent;
                    btn.style.background  = `rgba(0,115,187,0.15)`;
                    const dot = btn.querySelector('div');
                    dot.style.background = R.accent;
                    dot.style.border     = 'none';
                    pop.querySelector('#px-ttype').value = btn.dataset.val;
                });
            });

            // Goods cards
            pop.querySelectorAll('.gcard').forEach(card => {
                card.addEventListener('click', () => {
                    const id    = card.dataset.id;
                    const label = card.dataset.label;
                    const idx   = selectedGoods.findIndex(g => g.id === id);
                    if (idx === -1) {
                        selectedGoods.push({ id, label, qty: 1 });
                        card.style.borderColor = R.accent;
                        card.style.background  = `rgba(0,115,187,0.2)`;
                    } else {
                        selectedGoods.splice(idx, 1);
                        card.style.borderColor = R.border;
                        card.style.background  = R.panel;
                    }
                    renderGoods(pop, R);
                });
            });

            // Carrier autocomplete
            const cInput = pop.querySelector('#px-carrier');
            const cSugg  = pop.querySelector('#px-csugg');
            cInput.addEventListener('input', () => {
                const results = searchCarrier(cInput.value);
                if (!results.length) { cSugg.style.display = 'none'; return; }
                cSugg.innerHTML = results.map(r => `
                    <div class="cs-item" data-name="${r.name}" style="
                        padding:9px 14px;cursor:pointer;font-size:12px;
                        border-bottom:1px solid ${R.border};
                        display:flex;gap:12px;align-items:center;
                        color:${R.text};">
                        <strong style="color:${R.accent};min-width:68px;
                            font-size:11px;">${r.code}</strong>
                        <span>${r.name}</span>
                    </div>`).join('');
                cSugg.style.display = 'block';
                cSugg.querySelectorAll('.cs-item').forEach(s => {
                    s.addEventListener('mouseenter',
                        () => s.style.background = R.panel);
                    s.addEventListener('mouseleave',
                        () => s.style.background = 'transparent');
                    s.addEventListener('click', () => {
                        cInput.value = s.dataset.name;
                        cInput.style.borderColor = R.accent;
                        cSugg.style.display = 'none';
                    });
                });
            });
            document.addEventListener('click', e => {
                if (!pop.contains(e.target)) cSugg.style.display = 'none';
            });

            pop.querySelector('#px-close').onclick  = () => ov.remove();
            pop.querySelector('#px-cancel').onclick = () => ov.remove();
            pop.querySelector('#px-sc').onclick     = () =>
                window.open(
                    'https://trans-logistics-eu.amazon.com/yms/shipclerk/#/yard',
                    '_blank');
            ov.addEventListener('click', e => {
                if (e.target === ov) ov.remove();
            });

            pop.querySelector('#px-print').onclick = () => {
                const seal = pop.querySelector('#px-seal').value.trim();
                if (!seal) {
                    pop.querySelector('#px-seal').style.borderColor = R.danger;
                    pop.querySelector('#px-seal').style.boxShadow =
                        `0 0 0 2px rgba(231,76,60,0.3)`;
                    pop.querySelector('#px-seal').focus();
                    alert('⚠ Inserisci il SEAL NUMBER!');
                    return;
                }
                if (selectedGoods.length === 0)
                    if (!confirm('Nessuna merce selezionata. Continuare?')) return;

                const formData = collectForm(pop);
                printCMR(formData);

                // Salva nello storico GitHub (async, non blocca la stampa)
                const saveStatus = pop.querySelector('#px-save-status');
                if (saveStatus) saveStatus.textContent = '⏳ Salvataggio storico...';
                addToHistory(formData, (err) => {
                    if (!err) {
                        if (saveStatus)
                            saveStatus.textContent = '✓ Salvato in GitHub';
                    } else {
                        console.warn('[CMR] Errore salvataggio storico:', err);
                    }
                });

                ov.remove();
            };

            setTimeout(() => pop.querySelector('#px-seal')?.focus(), 150);
        }

        // ──────────────────────────────────────────────
        // RENDER MERCI
        // ──────────────────────────────────────────────
        function renderGoods(pop, R) {
            const container = pop.querySelector('#goods-list');
            if (!container) return;
            container.innerHTML = '';

            if (selectedGoods.length === 0) {
                container.innerHTML = `
                    <span style="color:${R.label};font-size:12px;">
                        Nessuna merce — clicca le card
                    </span>`;
                return;
            }

            selectedGoods.forEach((g, i) => {
                const meta = GOODS_LIST.find(x => x.id === g.id);
                const chip = document.createElement('div');
                chip.style.cssText = `
                    display:flex;align-items:center;gap:6px;
                    background:rgba(0,115,187,0.15);
                    border:1px solid ${R.accent};border-radius:14px;
                    padding:4px 10px 4px 8px;
                    font-size:12px;font-weight:600;color:${R.text};
                `;
                chip.innerHTML = `
                    <span>${meta?.icon || '📦'}</span>
                    <span>${g.label}</span>
                    <span style="color:${R.label};font-weight:400;
                        margin:0 2px;">×</span>
                    <input type="number" value="${g.qty}" min="1" max="9999"
                        style="width:52px;background:rgba(0,0,0,0.3);
                            border:1px solid ${R.border};border-radius:4px;
                            padding:2px 4px;font-size:12px;font-weight:600;
                            text-align:center;outline:none;color:${R.text};
                            font-family:inherit;">
                    <button style="background:rgba(231,76,60,0.2);
                        color:${R.danger};border:1px solid ${R.danger};
                        border-radius:50%;width:18px;height:18px;
                        font-size:10px;cursor:pointer;display:flex;
                        align-items:center;justify-content:center;
                        padding:0;margin-left:2px;flex-shrink:0;">✕</button>
                `;

                const qInput = chip.querySelector('input');
                qInput.addEventListener('click',  e => e.stopPropagation());
                qInput.addEventListener('input',  () => {
                    selectedGoods[i].qty = parseInt(qInput.value) || 1;
                });
                qInput.addEventListener('change', () => {
                    selectedGoods[i].qty = parseInt(qInput.value) || 1;
                });

                chip.querySelector('button').addEventListener('click', e => {
                    e.stopPropagation(); e.preventDefault();
                    const card = pop.querySelector(`#gc-${selectedGoods[i].id}`);
                    if (card) {
                        card.style.borderColor = R.border;
                        card.style.background  = R.panel;
                    }
                    selectedGoods.splice(i, 1);
                    renderGoods(pop, R);
                });

                container.appendChild(chip);
            });
        }

        // ──────────────────────────────────────────────
        // COLLECT FORM
        // ──────────────────────────────────────────────
        function collectForm(p) {
            const v = id => p.querySelector('#' + id)?.value || '';
            return {
                mitt:      v('px-mitt'),
                dest:      v('px-dest'),
                luogo:     v('px-luogo'),
                presa:     v('px-presa'),
                carrier:   v('px-carrier'),
                drv1:      v('px-drv1'),
                drv2:      v('px-drv2'),
                vrid:      v('px-vrid'),
                trail:     v('px-trail'),
                tract:     v('px-tract'),
                seal:      v('px-seal'),
                goodsDesc: v('px-goods-desc'),
                goods:     [...selectedGoods],
                ttype:     v('px-ttype') || 'INTERNATIONAL',
                cmrNum:    v('px-cmr'),
                note:      v('px-note'),
                date:      new Date().toLocaleDateString('it-IT'),
                time:      new Date().toLocaleTimeString('it-IT'),
            };
        }

        // ──────────────────────────────────────────────
        // PRINT CMR
        // ──────────────────────────────────────────────
        function printCMR(d) {
            const copies = [
                { bg:'#ffffff', accent:'#000000',
                  name:'Copia 1 — MITTENTE (Expéditeur)' },
                { bg:'#e8f5e9', accent:'#1b5e20',
                  name:'Copia 2 — VETTORE (Transporteur)' },
                { bg:'#e3f2fd', accent:'#0d47a1',
                  name:'Copia 3 — DESTINATARIO (Consignataire)' },
            ];

            const pages = copies.map(c => buildPage(d, c)).join('');

            const win = window.open('', '_blank', 'width=1050,height=800');
            win.document.write(`<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<title>CMR N°${d.cmrNum} — ${d.vrid}</title>
<style>
* { -webkit-print-color-adjust:exact; print-color-adjust:exact;
    box-sizing:border-box; margin:0; padding:0; }
@page { size:A4 portrait; margin:5mm; }
@media print {
    .np { display:none!important; }
    body { background:#fff; }
}
html,body { font-family:Arial,Helvetica,sans-serif;
    font-size:8pt; background:#bbb; padding:6px; }
.page {
    width:200mm; height:287mm; margin:0 auto 6mm;
    border:2px solid #000; display:flex;
    flex-direction:column; overflow:hidden;
    page-break-after:always;
}
table { width:100%; border-collapse:collapse; table-layout:fixed; }
td { border:1px solid #000; padding:1mm 1.5mm;
     vertical-align:top; line-height:1.2; overflow:hidden; }
.lbl { font-size:5.5pt; color:#666; font-style:italic;
       display:block; margin-bottom:0.5mm; }
.val { font-size:9.5pt; font-weight:bold; }
.val-sm { font-size:8.5pt; font-weight:bold; }
.np-bar { position:fixed;top:0;left:0;width:100%;z-index:999;
    background:#232F3E;padding:8px 16px;
    display:flex;gap:10px;align-items:center; }
.pb { background:#FF9900;color:#000;border:none;
    padding:7px 20px;font-size:12px;font-weight:700;
    cursor:pointer;border-radius:5px; }
.pb.g { background:#555;color:#fff; }
</style></head><body>
<div class="np np-bar">
    <button class="pb" onclick="window.print()">
        🖨️ STAMPA 3 COPIE A4
    </button>
    <button class="pb g" onclick="window.close()">✕ Chiudi</button>
    <span style="color:#aaa;font-size:11px;margin-left:14px;">
        CMR N°${d.cmrNum} | VRID: ${d.vrid} | ${d.date} ${d.time}
    </span>
</div>
<div style="height:46px;" class="np"></div>
${pages}
</body></html>`);
            win.document.close();
        }

        // ──────────────────────────────────────────────
        // BUILD PAGE CMR
        // ──────────────────────────────────────────────
        function buildPage(d, c) {
            const isIntl = (d.ttype || 'INTERNATIONAL') === 'INTERNATIONAL';

            const LOGO = `<svg width="75" height="24"
                viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg">
                <text x="2" y="58" font-family="Arial,sans-serif"
                    font-size="52" font-weight="700" fill="#000">amazon</text>
                <path d="M18 66 C 75 95, 148 95, 205 66"
                    stroke="#FF9900" stroke-width="7"
                    fill="none" stroke-linecap="round"/>
            </svg>`;

            const goods = (d.goods && d.goods.length > 0)
                ? d.goods
                : [{ label: d.goodsDesc || 'Amazon Packages', qty: '' }];

            const goodsRows = goods.map((g, i) => `
                <tr>
                  <td style="border-right:1px solid #888;padding:1px 2px;">
                    <span style="font-size:8pt;font-weight:bold;">
                        ${g.label}
                    </span>
                    ${i===0
                        ? '<span style="font-size:6pt;color:#777;margin-left:3px;">EUK5</span>'
                        : ''}
                  </td>
                  <td style="border-right:1px solid #888;padding:1px 2px;
                      text-align:center;">
                    <span style="font-size:9pt;font-weight:bold;">${g.qty}</span>
                  </td>
                  <td style="border-right:1px solid #888;padding:1px 2px;">
                    <span style="font-size:8pt;font-weight:bold;">${g.label}</span>
                  </td>
                  <td style="border-right:1px solid #888;padding:1px 2px;">
                    <span style="font-size:8pt;">
                        ${d.goodsDesc || 'Amazon Packages'}
                    </span>
                  </td>
                  <td style="border-right:1px solid #888;padding:1px 2px;"></td>
                  <td style="border-right:1px solid #888;padding:1px 2px;"></td>
                  <td style="padding:1px 2px;"></td>
                </tr>`).join('');

            const emptyRows = Array.from(
                { length: Math.max(0, 2 - goods.length) },
                () => `
                <tr>
                  <td style="height:4mm;border-right:1px solid #888;
                      padding:1px 2px;"></td>
                  <td style="border-right:1px solid #888;padding:1px 2px;"></td>
                  <td style="border-right:1px solid #888;padding:1px 2px;"></td>
                  <td style="border-right:1px solid #888;padding:1px 2px;"></td>
                  <td style="border-right:1px solid #888;padding:1px 2px;"></td>
                  <td style="border-right:1px solid #888;padding:1px 2px;"></td>
                  <td style="padding:1px 2px;"></td>
                </tr>`).join('');

            const goodsSummary = goods
                .map(g => `${g.label}${g.qty ? ': ' + g.qty : ''}`)
                .join(' | ');

            return `
<div class="page" style="background:${c.bg};">

  <!-- COPY BANNER -->
  <div style="background:${c.bg==='#ffffff'?'#f0f0f0':c.bg};
      border-bottom:2px solid ${c.accent};text-align:center;
      padding:1.2mm;font-weight:bold;font-size:7.5pt;
      color:${c.accent};flex-shrink:0;">
    ${c.name}
  </div>

  <!-- HEADER: Logo | CMR | Nr+Tipo -->
  <div style="display:flex;align-items:center;
      justify-content:space-between;
      border-bottom:2px solid #000;
      padding:1.5mm 3mm;background:#fff;flex-shrink:0;">

    <div style="display:flex;align-items:center;gap:6mm;width:44%;">
      ${LOGO}
      <div style="font-size:5pt;color:#777;line-height:1.4;
          font-style:italic;">
        Les parties encadrées de lignes grasses doivent être remplies
        par le transporteur. / The spaces framed with heavy lines must
        be filled in by the carrier.
      </div>
    </div>

    <div style="text-align:center;background:#111;
        padding:2mm 6mm;border-radius:2px;">
      <div style="font-size:26pt;font-weight:bold;color:#FF9900;
          letter-spacing:8px;line-height:1;
          font-family:'Arial Black',Arial,sans-serif;">CMR</div>
    </div>

    <div style="text-align:center;background:#f5f5f5;
        padding:1.5mm 3mm;border:1px solid #ddd;
        border-radius:2px;width:20%;">
      <div style="font-size:5.5pt;color:#888;">Nr:</div>
      <div style="font-size:18pt;font-weight:bold;
          line-height:1.1;margin-bottom:1.5mm;">${d.cmrNum}</div>
      <div style="display:flex;align-items:center;gap:2mm;
          margin-bottom:1mm;padding:0.5mm 2mm;
          border:1px solid ${!isIntl?'#000':'#ddd'};border-radius:2px;
          background:${!isIntl?'#232F3E':'#fff'};">
        <div style="width:7px;height:7px;border-radius:50%;
            background:${!isIntl?'#FF9900':'#ddd'};flex-shrink:0;"></div>
        <span style="font-size:6pt;font-weight:bold;
            color:${!isIntl?'#fff':'#aaa'};">NATIONAL</span>
      </div>
      <div style="display:flex;align-items:center;gap:2mm;
          padding:0.5mm 2mm;
          border:1px solid ${isIntl?'#000':'#ddd'};border-radius:2px;
          background:${isIntl?'#232F3E':'#fff'};">
        <div style="width:7px;height:7px;border-radius:50%;
            background:${isIntl?'#FF9900':'#ddd'};flex-shrink:0;"></div>
        <span style="font-size:6pt;font-weight:bold;
            color:${isIntl?'#fff':'#aaa'};">INTERNATIONAL</span>
      </div>
    </div>
  </div>

  <!-- CORPO: 2 colonne -->
  <div style="display:grid;grid-template-columns:44% 56%;
      border-bottom:1px solid #000;flex-shrink:0;">

    <div style="border-right:2px solid #000;">
      <div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">
        <span class="lbl">1 Expéditeur / Sender / Absender</span>
        <div class="val">${d.mitt.replace(/\n/g,'<br>')}</div>
      </div>
      <div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">
        <span class="lbl">2 Destinataire / Consignee / Empfänger</span>
        <div class="val">${d.dest.replace(/\n/g,'<br>')}</div>
      </div>
      <div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:12mm;">
        <span class="lbl">3 Lieu de livraison / Place of delivery</span>
        <div class="val">${d.luogo}</div>
      </div>
      <div style="padding:1.5mm 2mm;height:10mm;">
        <span class="lbl">4 Date et lieu de prise en charge</span>
        <div style="display:flex;gap:4mm;align-items:center;
            margin-top:0.5mm;">
          <div class="val">ROMA</div>
          <div>
            <span style="font-size:5.5pt;color:#888;">le/on</span>
            <span class="val-sm"> ${d.date}</span>
          </div>
          <div class="val-sm" style="color:#555;">ITALIA</div>
        </div>
      </div>
    </div>

    <div>
      <div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">
        <span class="lbl">16 Transporteur / Carrier / Frachtführer</span>
        <div class="val">${d.carrier}</div>
        <div style="margin-top:2mm;font-size:5.5pt;color:#888;">
            Sub Carrier</div>
      </div>
      <div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">
        <span class="lbl">17 Transporteurs successifs / Successive Carriers</span>
        <div style="height:6mm;"></div>
        <div style="font-size:5.5pt;color:#888;">Sub Carrier</div>
      </div>
      <div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:12mm;">
        <span class="lbl">18 Réserves / Carrier's reservations</span>
        <div style="display:flex;gap:5mm;margin-top:0.5mm;flex-wrap:wrap;">
          <div>
            <span style="font-size:6pt;color:#555;">VRID:</span>
            <span class="val-sm"> ${d.vrid}</span>
          </div>
          <div>
            <span style="font-size:6pt;color:#555;">Trailer:</span>
            <span class="val-sm"> ${d.trail}</span>
          </div>
          <div>
            <span style="font-size:6pt;color:#555;">Seal:</span>
            <span class="val-sm"> ${d.seal}</span>
          </div>
        </div>
      </div>
      <div style="padding:1.5mm 2mm;height:10mm;">
        <span class="lbl">21+22 Établie à / Established in</span>
        <div style="display:flex;gap:5mm;align-items:center;
            margin-top:0.5mm;">
          <span class="val">DLZ3</span>
          <div>
            <span style="font-size:5.5pt;color:#888;">le/on</span>
            <span class="val-sm"> ${d.date}</span>
          </div>
          <div>
            <span style="font-size:5.5pt;color:#888;">à/at</span>
            <span class="val-sm"> ${d.time}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Box 5 -->
  <div style="padding:1mm 2mm;border-bottom:1px solid #000;
      background:#f8f8f8;flex-shrink:0;">
    <span class="lbl">5 Documents annexés / Documents attached</span>
    <span class="val-sm">CMR, AMAZON Paper Manifests</span>
  </div>

  <!-- Intestazioni merci -->
  <table style="flex-shrink:0;">
    <tr style="background:#e5e5e5;font-size:5.5pt;">
      <td style="width:15%;border-right:1px solid #888;padding:0.5mm 1.5mm;">
        <b>6</b> Marks</td>
      <td style="width:8%;border-right:1px solid #888;padding:0.5mm 1mm;
          text-align:center;"><b>7</b> Qty</td>
      <td style="width:13%;border-right:1px solid #888;
          padding:0.5mm 1.5mm;"><b>8</b> Packing</td>
      <td style="width:28%;border-right:1px solid #888;
          padding:0.5mm 1.5mm;"><b>9</b> Nature of goods</td>
      <td style="width:12%;border-right:1px solid #888;
          padding:0.5mm 1.5mm;"><b>10</b> Stat.</td>
      <td style="width:12%;border-right:1px solid #888;
          padding:0.5mm 1.5mm;"><b>11</b> Kg</td>
      <td style="width:12%;padding:0.5mm 1.5mm;"><b>12</b> m³</td>
    </tr>
  </table>

  <!-- Righe merci -->
  <table style="flex-shrink:0;">
    ${goodsRows}
    ${emptyRows}
    <tr>
      <td style="border-right:1px solid #888;padding:1px 2px;"></td>
      <td style="border-right:1px solid #888;padding:1px 2px;"></td>
      <td style="border-right:1px solid #888;padding:1px 2px;"></td>
      <td style="border-right:1px solid #888;padding:1px 2px;"></td>
      <td style="border-right:1px solid #888;padding:1px 2px;"></td>
      <td style="border-right:1px solid #888;padding:1px 2px;
          text-align:right;font-size:7.5pt;font-weight:bold;">0 kg</td>
      <td style="padding:1px 2px;"></td>
    </tr>
  </table>

  <!-- Box 13 | Box 19 -->
  <div style="display:grid;grid-template-columns:56% 44%;
      border-top:1px solid #000;border-bottom:1px solid #000;
      flex-shrink:0;">
    <div style="padding:1.5mm 2mm;border-right:2px solid #000;
        min-height:18mm;">
      <span class="lbl">13 Instructions / Sender's instructions</span>
      <div style="font-size:8.5pt;margin:0.8mm 0;">
        <strong>SEAL: </strong>
        <span style="font-size:10pt;font-weight:bold;">${d.seal}</span>
        &nbsp; <strong>MERCE:</strong> ${goodsSummary}
      </div>
      <div style="font-size:6.5pt;color:#333;line-height:1.4;">
        ${d.note.replace(/\n/g,'<br>')}
      </div>
    </div>
    <div style="padding:1.5mm 2mm;min-height:18mm;">
      <span class="lbl">19 À payer par / To be paid by</span>
      <table style="border:none;width:100%;font-size:6.5pt;margin-top:1mm;">
        <tr>
          <td style="border:none;padding:0.8mm 0;">Prix de transport</td>
          <td style="border:none;border-bottom:1px solid #ddd;width:35%;"></td>
        </tr>
        <tr>
          <td style="border:none;padding:0.8mm 0;">Réductions</td>
          <td style="border:none;border-bottom:1px solid #ddd;"></td>
        </tr>
        <tr>
          <td style="border:none;padding:0.8mm 0;">Suppléments</td>
          <td style="border:none;border-bottom:1px solid #ddd;"></td>
        </tr>
        <tr>
          <td style="border:none;padding:0.8mm 0;font-weight:bold;">Total</td>
          <td style="border:none;border-bottom:2px solid #000;"></td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Firme -->
  <div style="display:grid;grid-template-columns:33% 34% 33%;
      border-bottom:1px solid #000;flex-shrink:0;min-height:24mm;">
    <div style="padding:1.5mm 2mm;border-right:2px solid #000;">
      <span class="lbl">22 Signature expéditeur</span>
      <div style="margin-top:13mm;border-top:1px solid #555;
          padding-top:0.5mm;font-size:9pt;color:#555;">x</div>
    </div>
    <div style="padding:1.5mm 2mm;border-right:2px solid #000;">
      <span class="lbl">23 Signature transporteur</span>
      <div style="font-size:9.5pt;font-weight:bold;margin-top:1mm;">
          ${d.drv1}</div>
      ${d.drv2
          ? `<div style="font-size:8pt;color:#555;">${d.drv2}</div>`
          : ''}
      <div style="margin-top:7mm;border-top:1px solid #555;
          padding-top:0.5mm;font-size:9pt;color:#555;">x</div>
    </div>
    <div style="padding:1.5mm 2mm;">
      <span class="lbl">24 Marchandise reçue</span>
      <div style="margin-top:13mm;border-top:1px solid #555;
          padding-top:0.5mm;font-size:9pt;color:#555;">x</div>
    </div>
  </div>

  <!-- Box 27 Targhe -->
  <div style="background:#1a1a1a;padding:2.5mm 4mm;
      flex-shrink:0;min-height:14mm;">
    <div style="font-size:5.5pt;color:#FF9900;font-weight:bold;
        margin-bottom:1.5mm;letter-spacing:1px;">
      27 — Amtl. Kennzeichen / License plate / Targa veicolo
    </div>
    <div style="display:flex;gap:18mm;align-items:center;">
      <div>
        <div style="font-size:5.5pt;color:#888;margin-bottom:1mm;">
            Kfz / Tractor / Motrice</div>
        <div style="font-size:15pt;font-weight:bold;color:#FF9900;
            letter-spacing:3px;font-family:monospace;">
            ${d.tract || '_ _ _ _ _ _'}</div>
      </div>
      <div style="width:1px;height:10mm;background:#444;"></div>
      <div>
        <div style="font-size:5.5pt;color:#888;margin-bottom:1mm;">
            Anhänger / Trailer / Rimorchio</div>
        <div style="font-size:15pt;font-weight:bold;color:#fff;
            letter-spacing:3px;font-family:monospace;">
            ${d.trail || '_ _ _ _ _ _'}</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#f0f0f0;border-top:1px solid #ddd;
      padding:1mm 2.5mm;flex-shrink:0;margin-top:auto;
      display:flex;justify-content:space-between;
      font-size:5.5pt;color:#aaa;">
    <span>Edited by SMOULIN for Amazon.com | CMR N°${d.cmrNum}</span>
    <span>${d.date} ${d.time} | DLZ3 — Via della Magliana 375 — Roma</span>
  </div>

</div>`;
        }

        // MutationObserver
        let deb;
        new MutationObserver(() => {
            clearTimeout(deb);
            deb = setTimeout(addButtons, 900);
        }).observe(document.body, { childList:true, subtree:true });
        setTimeout(addButtons, 2500);
    }

    // ╔══════════════════════════════════════════════════╗
    // ║  MODULO 2 — SHIPCLERK                           ║
    // ╚══════════════════════════════════════════════════╝
    function initShipClerk() {

        function harvest() {
            const data = {};
            document.querySelectorAll('tr[ng-repeat*="yardAsset"]').forEach(row => {
                const vridEl = row.querySelector(
                    'td.col9 span[ng-if*="VR_ID"]');
                if (!vridEl) return;
                const vm = vridEl.textContent.match(/\b([A-Z0-9]{8,14})\b/g);
                if (!vm) return;
                const vrid = vm[vm.length - 1];
                const plateEl = row.querySelector(
                    'td.col6 a.license-plate span.ng-binding');
                if (!plateEl) return;
                const plate = plateEl.textContent
                    .split('\n')[0]
                    .replace(/\s+/g, '')
                    .replace(/IT$/, '')
                    .trim();
                if (!plate) return;
                const isTrailer = !!row.querySelector('.yard-asset-icon-TRAILER');
                const isTractor = !!row.querySelector('.yard-asset-icon-TRACTOR');
                const noVehicle = !!row.querySelector(
                    'td.col7 .shipclerk-italic-label');
                if (!data[vrid]) data[vrid] = { trailer:'', tractor:'' };
                if (isTrailer)
                    data[vrid].trailer = plate;
                else if (isTractor)
                    data[vrid].tractor = plate;
                else if (noVehicle && !data[vrid].tractor)
                    data[vrid].tractor = plate;
                else if (!data[vrid].trailer)
                    data[vrid].trailer = plate;
            });
            let count = 0;
            Object.entries(data).forEach(([vrid, p]) => {
                if (p.trailer || p.tractor) {
                    savePlates(vrid, p.trailer, p.tractor);
                    count++;
                }
            });
            return count;
        }

        function updateInfo(n) {
            const el = document.getElementById('sc-info');
            if (el) el.textContent =
                `DB: ${Object.keys(getPlatesDB()).length} VRID ` +
                `| Ultimo: ${n} ` +
                `| Auto ogni 30s ✓`;
        }

        function addBanner() {
            if (document.getElementById('sc-banner')) return;
            const b = document.createElement('div');
            b.id = 'sc-banner';
            b.style.cssText = `
                position:fixed;top:0;left:0;width:100%;z-index:99999;
                background:#232F3E;color:#fff;padding:6px 18px;
                display:flex;align-items:center;gap:12px;
                font-family:Arial,sans-serif;font-size:12px;
                box-shadow:0 3px 10px rgba(0,0,0,0.4);
            `;
            b.innerHTML = `
                <span style="color:#FF9900;font-weight:bold;font-size:13px;">
                    🚛 CMR Tool
                </span>
                <span id="sc-info" style="color:#aaa;font-size:11px;">
                    DB: ${Object.keys(getPlatesDB()).length} VRID salvati
                </span>
                <button id="sc-now" style="background:#FF9900;color:#000;
                    border:none;padding:4px 14px;border-radius:4px;
                    font-size:11px;font-weight:bold;cursor:pointer;">
                    📥 Leggi Targhe Ora
                </button>
                <button id="sc-clr" style="background:#555;color:#fff;
                    border:none;padding:4px 12px;border-radius:4px;
                    font-size:11px;cursor:pointer;">
                    🗑️ Svuota DB
                </button>
                <span style="color:#2ecc71;font-size:11px;">
                    ⟳ Auto-harvest attivo
                </span>
                <button id="sc-relay" style="background:#0073bb;color:#fff;
                    border:none;padding:4px 14px;border-radius:4px;
                    font-size:11px;cursor:pointer;margin-left:auto;">
                    🔗 Vai a Relay
                </button>
            `;
            document.body.prepend(b);
            document.body.style.paddingTop = '38px';

            document.getElementById('sc-now').onclick = () => {
                const n = harvest(); updateInfo(n);
                const btn = document.getElementById('sc-now');
                btn.textContent = `✅ ${n} trovati!`;
                setTimeout(() => btn.textContent = '📥 Leggi Targhe Ora', 2500);
            };
            document.getElementById('sc-clr').onclick = () => {
                if (confirm('Svuotare il database targhe?')) {
                    clearPlatesDB(); updateInfo(0);
                }
            };
            document.getElementById('sc-relay').onclick = () =>
                window.open('https://track.relay.amazon.dev/', '_blank');
        }

        let deb;
        new MutationObserver(() => {
            clearTimeout(deb);
            deb = setTimeout(() => {
                addBanner();
                const n = harvest(); updateInfo(n);
            }, 1500);
        }).observe(document.body, { childList:true, subtree:true });

        setTimeout(() => {
            addBanner();
            setTimeout(() => updateInfo(harvest()), 3000);
            setInterval(() => updateInfo(harvest()), 30000);
        }, 2000);
    }


