// cmr_generator.js — Amazon DLZ3 v1.7
// Le funzioni GM_ vengono prese da window (iniettate dal loader)

var GM_setValue       = window.GM_setValue;
var GM_getValue       = window.GM_getValue;
var GM_xmlhttpRequest = window.GM_xmlhttpRequest;

// Verifica che siano disponibili
if (typeof GM_setValue !== 'function') {
    console.error('[CMR] GM_setValue non disponibile su window!');
}
if (typeof GM_getValue !== 'function') {
    console.error('[CMR] GM_getValue non disponibile su window!');
}

// ═══════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════
function savePlates(vrid, trailer, tractor) { ... }
// ... resto del codice INVARIATO


    'use strict';

    // Le funzioni GM_ vengono prese dal window
    GM_setValue       = GM_setValue       || window.GM_setValue;
    GM_getValue       = GM_getValue       || window.GM_getValue;
    GM_xmlhttpRequest = GM_xmlhttpRequest || window.GM_xmlhttpRequest;

    // ═══════════════════════════════════════════════════
    // STORAGE
    // ═══════════════════════════════════════════════════
    function savePlates(vrid, trailer, tractor) {
        var db = JSON.parse(GM_getValue('dlz3_plates_db', '{}'));
        db[vrid.trim()] = {
            trailer: trailer.trim(),
            tractor: tractor.trim(),
            ts: Date.now()
        };
        GM_setValue('dlz3_plates_db', JSON.stringify(db));
    }
    function getPlates(vrid) {
        var db = JSON.parse(GM_getValue('dlz3_plates_db', '{}'));
        return db[vrid.trim()] || { trailer: '', tractor: '' };
    }
    function getPlatesDB() {
        return JSON.parse(GM_getValue('dlz3_plates_db', '{}'));
    }
    function clearPlatesDB() {
        GM_setValue('dlz3_plates_db', '{}');
    }
    function getNextCMR() {
        var n = parseInt(GM_getValue('dlz3_cmr_n', '0')) + 1;
        GM_setValue('dlz3_cmr_n', n);
        return String(n).padStart(4, '0');
    }

    // ═══════════════════════════════════════════════════
    // CARRIER DATABASE
    // ═══════════════════════════════════════════════════
    var CARRIER_DB = {
        "ASPIC": "LOGISTICA & TRASPORTI SPINELLI CATALDO",
        "AFAGS": "GATTI FILASTRO SRL",
        "NROMA": "NORD ROMA TERMINAL",
        "ABPRP": "ABPRP ATSEU",
        "AGPUE": "AGPUE ATSEU",
        "AAFLI": "AAFLI ATSEU",
        "ACQSM": "Eurotrade 24 GmbH",
        "ADEMI": "2D Express Dabrowscy sp.j.",
        "ACSAL": "Battimelli Carmine",
        "AXQSP": "Bolid Damian Bomba",
        "AQAAH": "ELISTORCAR TRANSPORT SP. Z O.O.",
        "AALJF": "Euro-Transport Sp. z o.o.",
        "AFQKH": "FTU EURO TRANS HANDZEL",
        "APRBL": "Galaxi Haulage Limited",
        "AECNE": "H&S HAULAGE LTD",
        "ANGIT": "Ibiza-Speed Sp. z o.o.",
        "AXRPO": "Incampo Giovanni",
        "ACEID": "Kompas Spedycja Sp. z o.o.",
        "AEBFR": "LEN Logistics Patrycja Lach",
        "AJMCV": "Marcin Kucharski Megam",
        "AEABS": "MIEDZYNARODOWY TRANSPORT DROGOWY MARIUSZ PAPIS",
        "AAUMA": "Modica Salvatore",
        "AJDNT": "N&S LOGISTICS",
        "AZGKE": "PASQUALE CALIA",
        "ASHDC": "PRO-PANDA SRL",
        "ATACO": "Przedsiebiorstwo Handlowo-Transportowe TRACOM",
        "ANWRO": "Revox ltd",
        "AWAPO": "SC Thermo Tranzit SRL",
        "AFZVG": "SMART DELIVERY SP Z O.O.",
        "ASTZO": "Stepien Sp. z o.o.",
        "AOXRP": "Tako Logistics Sp zoo",
        "ARRKB": "TRANSPORT GABIN",
        "AFTRR": "2F TRASPORTI SRL",
        "AMHMM": "3D Trasporti",
        "ACODH": "DARTRANS DARIUSZ KOPEC",
        "AADTP": "A & D TRASPORTI S.R.L.",
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
        "AAGUK": "Amazon.Com Inc Amazon Freight",
        "AFXUK": "Amazon Freight Exchange",
        "AAUMS": "Auta Marocchi spa",
        "AFDWZ": "AUTOTRASPORTI AUTUORI ANIELLO",
        "AAUBR": "AUTOTRASPORTI BOMMARTINI SRL",
        "AAUOE": "Autotrasporti Bonello srl",
        "AIXNN": "Autotrasporti Borghi Srl",
        "AZAZV": "Autotrasporti Borrelli Fulvio Srl",
        "AACGP": "Autotrasporti c/terzi Giorgio Pellitteri",
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
        "AUCRK": "AUTOTRASPORTI RIVIELLO ANTONIO C. SNC",
        "ASVVT": "Autotrasporti S.Angela srl",
        "AAUIR": "Autotrasporti Sainato Roma srl",
        "AASMS": "AUTOTRASPORTI SINISI MICHELE S.R.L.",
        "AASLF": "Autotrasporti Spinosa Luigi F. Srl",
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

    function parseScac(raw) {
        if (!raw) return '';
        return raw.trim().split(/[\s(]/)[0].toUpperCase().trim();
    }
    function findCarrier(scacRaw) {
        var scac = parseScac(scacRaw);
        if (!scac) return '';
        if (CARRIER_DB[scac]) return CARRIER_DB[scac];
        var partial = Object.keys(CARRIER_DB)
            .find(function(k) { return k.startsWith(scac.slice(0,4)); });
        return partial ? CARRIER_DB[partial] : '';
    }
    function searchCarrier(query) {
        if (!query || query.length < 2) return [];
        var q = query.toLowerCase();
        return Object.entries(CARRIER_DB)
            .filter(function(e) {
                return e[0].toLowerCase().includes(q) ||
                       e[1].toLowerCase().includes(q);
            })
            .slice(0, 10)
            .map(function(e) { return { code: e[0], name: e[1] }; });
    }

    // ═══════════════════════════════════════════════════
    // NODE DATABASE
    // ═══════════════════════════════════════════════════
    var NODE_DB = {
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
        "XMP1":  { city:"Arqua Polesine (RO)",      address:"Via Maestri Del Lavoro 990\n45031 Arqua Polesine (RO) - ITALY" },
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
    var GOODS_LIST = [
        { id:'epal',   icon:'🪵', label:'Epal',      shortLabel:'Europallet EPAL'      },
        { id:'oneway', icon:'🔁', label:'OneWay',    shortLabel:'OneWay Pallet'        },
        { id:'light',  icon:'🪶', label:'Light',     shortLabel:'Light Items'          },
        { id:'jpcart', icon:'🛒', label:'JP Cart',   shortLabel:'JP Cart'              },
        { id:'fmis',   icon:'📐', label:'F. misura', shortLabel:'Fuori Misura'         },
        { id:'ampal',  icon:'🟦', label:'AMPAL',     shortLabel:'AMPAL Plastic Pallet' },
        { id:'altro',  icon:'✏️', label:'Altro',     shortLabel:'Altro / Other'        },
    ];

    var selectedGoods = [];

    // ═══════════════════════════════════════════════════
    // ROUTER
    // ═══════════════════════════════════════════════════
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
            var drivers = [];
            if (!container) return drivers;
            var sec = container.querySelector('.css-7hi57t');
            if (!sec) return drivers;
            sec.querySelectorAll('.css-1w1nhw5 button.css-rgh3oe').forEach(function(btn) {
                btn.querySelectorAll('span').forEach(function(sp) {
                    if (!sp.querySelector('span') && !sp.querySelector('svg')) {
                        var t = sp.textContent.trim();
                        if (t.length > 2 && t.length < 60 && !drivers.includes(t))
                            drivers.push(t);
                    }
                });
            });
            return drivers;
        }

        function getScacRaw(row) {
            var el = row.querySelector('.css-1oik3mk p.css-xjepgn');
            return el ? el.textContent.trim() : '';
        }

        function getParentContainer(row) {
            var el = row;
            for (var i = 0; i < 8; i++) {
                el = el.parentElement;
                if (!el) break;
                if (el.querySelector('.css-7hi57t') &&
                    el.querySelector('.css-184bhl9')) return el;
            }
            return row;
        }

        function addButtons() {
    document.querySelectorAll('[mdn-expander-title]').forEach(function(row) {
        if (row.querySelector('.cmr-btn')) return;
        var vEl = row.querySelector('p.css-17xh5uu');
        if (!vEl) return;

        var vrid     = vEl.textContent.trim();
        var nodes    = row.querySelectorAll('p.css-1mefxab');
        var nodeTo   = nodes[1] ? nodes[1].textContent.trim() : '';
        var cEl      = row.querySelector('p.css-pmdsih');
        var contType = cEl ? (cEl.title || cEl.textContent.trim()) : '';
        var scacRaw  = getScacRaw(row);

        var btn = document.createElement('button');
        btn.className = 'cmr-btn';
        btn.innerHTML = '🖨️ CMR';
        btn.title = 'CMR — ' + vrid;

        // ── STILE ──
        btn.setAttribute('style',
            'background:linear-gradient(135deg,#FF9900,#e68a00) !important;' +
            'color:#000 !important;' +
            'border:none !important;' +
            'border-radius:4px !important;' +
            'padding:4px 12px !important;' +
            'font-size:11px !important;' +
            'font-weight:bold !important;' +
            'cursor:pointer !important;' +
            'margin-left:8px !important;' +
            'vertical-align:middle !important;' +
            'z-index:9999 !important;' +
            'position:relative !important;' +
            'pointer-events:all !important;'
        );

        // ── CLICK con tutti i metodi possibili ──
        btn.onclick = function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            console.log('[CMR] Click su VRID:', vrid);

            try {
                selectedGoods = [];
                var cont    = getParentContainer(row);
                var drivers = getDrivers(cont);
                var plates  = getPlates(vrid);

                console.log('[CMR] drivers:', drivers);
                console.log('[CMR] plates:', plates);
                console.log('[CMR] nodeTo:', nodeTo);
                console.log('[CMR] scacRaw:', scacRaw);

                openPopup({
                    vrid:     vrid,
                    nodeTo:   nodeTo,
                    contType: contType,
                    scacRaw:  scacRaw,
                    carrier:  findCarrier(scacRaw),
                    drivers:  drivers,
                    trailer:  plates.trailer,
                    tractor:  plates.tractor,
                });

                console.log('[CMR] openPopup chiamato');
            } catch(err) {
                console.error('[CMR] ERRORE nel click:', err);
                alert('Errore CMR: ' + err.message);
            }

            return false;
        };

        var vridContainer = row.querySelector('.css-184bhl9');
        if (vridContainer) {
            vridContainer.appendChild(btn);
            console.log('[CMR] Pulsante aggiunto per VRID:', vrid);
        } else {
            console.warn('[CMR] .css-184bhl9 non trovato per VRID:', vrid);
        }
    });
}


        function openPopup(d) {
            var existing = document.getElementById('cmr-ov');
            if (existing) existing.remove();

            var date     = new Date().toLocaleDateString('it-IT');
            var cmrNum   = getNextCMR();
            var nodeI    = NODE_DB[d.nodeTo] || { city: d.nodeTo, address: '' };
            var plates   = getPlates(d.vrid);
            var trailer  = plates.trailer || d.trailer;
            var tractor  = plates.tractor || d.tractor;
            var dbCount  = Object.keys(getPlatesDB()).length;
            var scacCode = parseScac(d.scacRaw);

            var R = {
                bg:'#0f1111', panel:'#1a1f2e', panel2:'#232b3e',
                border:'#2d3748', accent:'#0073bb',
                orange:'#FF9900', text:'#e8eaed', label:'#8a9bb0',
                success:'#2ecc71', danger:'#e74c3c', warn:'#f39c12',
            };

            var IS = 'width:100%;padding:8px 12px;' +
                'background:' + R.panel2 + ';border:1px solid ' + R.border + ';' +
                'border-radius:6px;color:' + R.text + ';font-size:13px;' +
                'font-family:inherit;outline:none;box-sizing:border-box;' +
                'transition:border-color 0.2s;';

            var LS = 'font-size:11px;color:' + R.label + ';font-weight:600;' +
                'display:block;margin-bottom:5px;text-transform:uppercase;' +
                'letter-spacing:0.5px;';

            var ov = document.createElement('div');
            ov.id = 'cmr-ov';
            ov.style.cssText =
                'position:fixed;top:0;left:0;width:100%;height:100%;' +
                'background:rgba(0,0,0,0.75);z-index:999999;' +
                'display:flex;align-items:center;justify-content:center;' +
                'font-family:Arial,sans-serif;backdrop-filter:blur(3px);';

            var pop = document.createElement('div');
            pop.style.cssText =
                'background:' + R.bg + ';border:1px solid ' + R.border + ';' +
                'border-radius:8px;width:940px;max-width:97vw;' +
                'max-height:93vh;overflow-y:auto;' +
                'box-shadow:0 20px 60px rgba(0,0,0,0.7);';

            var dCards = d.drivers.map(function(name, i) {
                return '<div class="dcard" data-n="' + name + '" style="' +
                    'display:flex;align-items:center;gap:10px;' +
                    'padding:8px 14px;' +
                    'border:1px solid ' + (i===0 ? R.accent : R.border) + ';' +
                    'border-radius:6px;cursor:pointer;margin-bottom:6px;' +
                    'background:' + (i===0 ? R.panel2 : R.panel) + ';">' +
                    '<span style="font-size:14px;">👤</span>' +
                    '<span style="color:' + R.text + ';font-weight:600;' +
                    'font-size:13px;">' + name + '</span>' +
                    '<span class="dck" style="margin-left:auto;' +
                    'color:' + R.accent + ';font-size:12px;font-weight:bold;">' +
                    (i===0 ? '✓ Selezionato' : '') +
                    '</span></div>';
            }).join('');

            var gCards = GOODS_LIST.map(function(g) {
                return '<div class="gcard" id="gc-' + g.id + '"' +
                    ' data-id="' + g.id + '" data-label="' + g.shortLabel + '" style="' +
                    'border:1px solid ' + R.border + ';border-radius:6px;' +
                    'padding:8px 4px;text-align:center;cursor:pointer;' +
                    'background:' + R.panel + ';transition:all 0.15s;">' +
                    '<div style="font-size:20px;">' + g.icon + '</div>' +
                    '<div style="font-size:9px;font-weight:600;margin-top:3px;' +
                    'color:' + R.text + ';line-height:1.2;">' + g.label + '</div>' +
                    '</div>';
            }).join('');

            function plateBadge(v) {
                return v
                    ? '<span style="background:rgba(46,204,113,0.2);' +
                      'color:' + R.success + ';border:1px solid ' + R.success + ';' +
                      'border-radius:10px;padding:1px 8px;' +
                      'font-size:10px;margin-left:6px;">✓ ShipClerk</span>'
                    : '<span style="background:rgba(231,76,60,0.2);' +
                      'color:' + R.danger + ';border:1px solid ' + R.danger + ';' +
                      'border-radius:10px;padding:1px 8px;' +
                      'font-size:10px;margin-left:6px;">⚠ mancante</span>';
            }

            pop.innerHTML =
            '<div style="background:' + R.panel + ';border-bottom:1px solid ' + R.border + ';' +
            'padding:16px 24px;border-radius:8px 8px 0 0;' +
            'display:flex;justify-content:space-between;align-items:center;">' +
                '<div style="display:flex;align-items:center;gap:14px;">' +
                    '<svg width="75" height="24" viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg">' +
                        '<text x="2" y="58" font-family="Arial,sans-serif" font-size="52" font-weight="700" fill="' + R.text + '">amazon</text>' +
                        '<path d="M18 66 C 75 95, 148 95, 205 66" stroke="' + R.orange + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
                    '</svg>' +
                    '<div style="width:1px;height:28px;background:' + R.border + ';"></div>' +
                    '<div>' +
                        '<div style="color:' + R.text + ';font-size:16px;font-weight:700;">CMR Generator</div>' +
                        '<div style="color:' + R.label + ';font-size:11px;">DLZ3 — Via della Magliana 375, Roma</div>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">' +
                    '<span style="background:rgba(0,115,187,0.2);color:' + R.accent + ';' +
                    'border:1px solid ' + R.accent + ';border-radius:10px;' +
                    'padding:2px 10px;font-size:11px;font-weight:600;">VRID: ' + d.vrid + '</span>' +
                    '<span style="background:rgba(255,153,0,0.15);color:' + R.orange + ';' +
                    'border:1px solid ' + R.orange + ';border-radius:10px;' +
                    'padding:2px 10px;font-size:11px;">→ ' + d.nodeTo + '</span>' +
                    '<span style="background:rgba(46,204,113,0.15);color:' + R.success + ';' +
                    'border:1px solid ' + R.success + ';border-radius:10px;' +
                    'padding:2px 10px;font-size:11px;font-weight:600;">CMR N°' + cmrNum + '</span>' +
                    '<button id="px-close" style="background:' + R.panel2 + ';' +
                    'border:1px solid ' + R.border + ';color:' + R.label + ';' +
                    'width:32px;height:32px;border-radius:6px;cursor:pointer;' +
                    'font-size:16px;display:flex;align-items:center;justify-content:center;">✕</button>' +
                '</div>' +
            '</div>' +

            (!d.carrier ?
            '<div style="background:rgba(243,156,18,0.1);border-left:3px solid ' + R.warn + ';' +
            'padding:10px 24px;font-size:12px;color:' + R.warn + ';">' +
            '⚠ Carrier <strong>' + d.scacRaw + '</strong> non trovato nel DB.</div>' : '') +

            '<div style="padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +

                '<div><label style="' + LS + '">📦 Box 1 — Mittente</label>' +
                '<textarea id="px-mitt" rows="4" style="' + IS + 'font-family:inherit;">' +
                'DLZ3\nVia della Magliana 375\n00148 Roma (RM)\nITALY</textarea></div>' +

                '<div><label style="' + LS + '">📍 Box 2 — Destinatario</label>' +
                '<textarea id="px-dest" rows="4" style="' + IS + 'font-family:inherit;">' +
                d.nodeTo + '\n' + nodeI.address + '</textarea></div>' +

                '<div><label style="' + LS + '">📌 Box 3 — Luogo Consegna</label>' +
                '<input id="px-luogo" type="text" value="' + nodeI.city + '" style="' + IS + '"></div>' +

                '<div><label style="' + LS + '">🏭 Box 4 — Luogo & Data Presa</label>' +
                '<input id="px-presa" type="text" value="ROMA - ITALY - ' + date + '" style="' + IS + '"></div>' +

                '<div style="position:relative;">' +
                '<label style="' + LS + '">🚚 Box 16 — Carrier (' + d.scacRaw + ')</label>' +
                '<input id="px-carrier" type="text" value="' + (d.carrier || d.scacRaw || '') + '" ' +
                'placeholder="Cerca carrier..." style="' + IS +
                (!d.carrier ? 'border-color:' + R.warn + ';' : 'border-color:' + R.accent + ';') + '">' +
                '<div id="px-csugg" style="position:absolute;top:100%;left:0;right:0;z-index:300;' +
                'background:' + R.panel2 + ';border:1px solid ' + R.border + ';' +
                'border-top:none;border-radius:0 0 6px 6px;' +
                'box-shadow:0 8px 24px rgba(0,0,0,0.4);display:none;' +
                'max-height:200px;overflow-y:auto;"></div></div>' +

                '<div><label style="' + LS + '">🔢 VRID</label>' +
                '<input id="px-vrid" type="text" value="' + d.vrid + '" style="' + IS + '"></div>' +

                '<div style="grid-column:1/3;">' +
                '<label style="' + LS + '">🌍 Tipo Trasporto</label>' +
                '<div style="display:flex;gap:10px;">' +
                    '<div class="ttype" data-val="INTERNATIONAL" style="flex:1;padding:12px 16px;' +
                    'cursor:pointer;border:1px solid ' + R.accent + ';border-radius:6px;' +
                    'background:rgba(0,115,187,0.15);display:flex;align-items:center;gap:10px;">' +
                    '<div style="width:14px;height:14px;border-radius:50%;background:' + R.accent + ';flex-shrink:0;"></div>' +
                    '<div><div style="color:' + R.text + ';font-weight:600;font-size:13px;">🌍 INTERNATIONAL</div>' +
                    '<div style="color:' + R.label + ';font-size:10px;">Trasporto Internazionale</div></div></div>' +
                    '<div class="ttype" data-val="NATIONAL" style="flex:1;padding:12px 16px;' +
                    'cursor:pointer;border:1px solid ' + R.border + ';border-radius:6px;' +
                    'background:' + R.panel + ';display:flex;align-items:center;gap:10px;">' +
                    '<div style="width:14px;height:14px;border-radius:50%;' +
                    'border:2px solid ' + R.border + ';flex-shrink:0;"></div>' +
                    '<div><div style="color:' + R.label + ';font-weight:600;font-size:13px;">🇮🇹 NATIONAL</div>' +
                    '<div style="color:' + R.label + ';font-size:10px;opacity:0.6;">Trasporto Nazionale</div></div></div>' +
                '</div>' +
                '<input type="hidden" id="px-ttype" value="INTERNATIONAL"></div>' +

                '<div style="grid-column:1/3;">' +
                '<label style="' + LS + '">👤 Box 23 — Driver</label>' +
                '<div id="dcard-wrap" style="margin-bottom:10px;">' +
                (dCards || '<div style="padding:12px;border:1px solid ' + R.border + ';' +
                'border-radius:6px;color:' + R.danger + ';font-size:12px;' +
                'background:rgba(231,76,60,0.1);">⚠ Nessun driver trovato automaticamente.</div>') +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                    '<div><label style="' + LS + '">Driver principale</label>' +
                    '<input id="px-drv1" type="text" value="' + (d.drivers[0]||'') + '" ' +
                    'placeholder="Nome autista..." style="' + IS + 'font-weight:600;"></div>' +
                    '<div><label style="' + LS + '">Co-driver</label>' +
                    '<input id="px-drv2" type="text" value="' + (d.drivers[1]||'') + '" ' +
                    'placeholder="Co-driver..." style="' + IS + '"></div>' +
                '</div></div>' +

                '<div><label style="' + LS + '">🚛 Trailer ' + plateBadge(trailer) + '</label>' +
                '<input id="px-trail" type="text" value="' + trailer + '" ' +
                'placeholder="Es. XA470YT" style="' + IS +
                (trailer ? 'border-color:' + R.success + ';' : 'border-color:' + R.danger + ';') + '"></div>' +

                '<div><label style="' + LS + '">🚛 Tractor ' + plateBadge(tractor) + '</label>' +
                '<input id="px-tract" type="text" value="' + tractor + '" ' +
                'placeholder="Es. GP502HS" style="' + IS +
                (tractor ? 'border-color:' + R.success + ';' : 'border-color:' + R.danger + ';') + '"></div>' +

                '<div><label style="' + LS + '">🔒 Seal Number <span style="color:' + R.danger + ';">*</span></label>' +
                '<input id="px-seal" type="text" value="" placeholder="OBBLIGATORIO" ' +
                'style="' + IS + 'border-color:' + R.danger + ';font-size:14px;font-weight:700;"></div>' +

                '<div><label style="' + LS + '">📋 N° CMR</label>' +
                '<input id="px-cmr" type="text" value="' + cmrNum + '" style="' + IS + '"></div>' +

                '<div style="grid-column:1/3;background:' + R.panel + ';' +
                'border:1px solid ' + R.border + ';border-radius:6px;padding:14px;">' +
                '<label style="' + LS + 'margin-bottom:12px;">📦 Carico — Tipo merce</label>' +
                '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:12px;">' +
                gCards + '</div>' +
                '<div id="goods-list" style="min-height:42px;background:' + R.panel2 + ';' +
                'border:1px solid ' + R.border + ';border-radius:6px;' +
                'padding:8px 12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">' +
                '<span style="color:' + R.label + ';font-size:12px;">Nessuna merce — clicca le card</span></div>' +
                '<div style="margin-top:10px;">' +
                '<label style="' + LS + '">Natura merce (Box 9)</label>' +
                '<input id="px-goods-desc" type="text" value="Amazon Packages" ' +
                'placeholder="Es. Amazon Packages..." style="' + IS + '"></div></div>' +

                '<div style="grid-column:1/3;">' +
                '<label style="' + LS + '">📝 Note / ADR</label>' +
                '<textarea id="px-note" rows="2" style="' + IS + 'font-family:inherit;">' +
                'NOT RESTRICTED - NO DANGEROUS GOODS TRANSPORT\n(according SP 188 ADR/RID/IMDG-Code)' +
                '</textarea></div>' +

            '</div>' +

            '<div style="background:' + R.panel + ';border-top:1px solid ' + R.border + ';' +
            'padding:14px 24px;border-radius:0 0 8px 8px;' +
            'display:flex;gap:10px;justify-content:flex-end;align-items:center;">' +
                '<button id="px-sc" style="background:transparent;color:' + R.accent + ';' +
                'border:1px solid ' + R.accent + ';padding:8px 16px;border-radius:6px;' +
                'cursor:pointer;font-size:12px;font-family:inherit;">🔍 ShipClerk</button>' +
                '<button id="px-cancel" style="background:' + R.panel2 + ';color:' + R.label + ';' +
                'border:1px solid ' + R.border + ';padding:8px 18px;border-radius:6px;' +
                'cursor:pointer;font-size:13px;font-family:inherit;">Annulla</button>' +
                '<button id="px-print" style="background:' + R.orange + ';color:#000;border:none;' +
                'padding:10px 28px;border-radius:6px;cursor:pointer;' +
                'font-size:14px;font-weight:700;font-family:inherit;' +
                'box-shadow:0 2px 8px rgba(255,153,0,0.4);">' +
                '🖨️ Stampa CMR — 3 copie A4</button>' +
            '</div>';

            ov.appendChild(pop);
            document.body.appendChild(ov);

            // Focus effetti
            pop.querySelectorAll('input,textarea').forEach(function(el) {
                el.addEventListener('focus', function() {
                    el.style.borderColor = R.accent;
                    el.style.boxShadow = '0 0 0 2px rgba(0,115,187,0.25)';
                });
                el.addEventListener('blur', function() {
                    if (!el.style.borderColor.includes('2ecc71') &&
                        !el.style.borderColor.includes('e74c3c') &&
                        !el.style.borderColor.includes('f39c12'))
                        el.style.borderColor = R.border;
                    el.style.boxShadow = 'none';
                });
            });

            // Driver click
            pop.querySelectorAll('.dcard').forEach(function(c) {
                c.addEventListener('click', function() {
                    pop.querySelectorAll('.dcard').forEach(function(x) {
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
            pop.querySelectorAll('.ttype').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    pop.querySelectorAll('.ttype').forEach(function(b) {
                        b.style.borderColor = R.border;
                        b.style.background  = R.panel;
                        var dot = b.querySelector('div');
                        if (dot) {
                            dot.style.background = 'transparent';
                            dot.style.border = '2px solid ' + R.border;
                        }
                    });
                    btn.style.borderColor = R.accent;
                    btn.style.background  = 'rgba(0,115,187,0.15)';
                    var dot = btn.querySelector('div');
                    if (dot) { dot.style.background = R.accent; dot.style.border = 'none'; }
                    pop.querySelector('#px-ttype').value = btn.dataset.val;
                });
            });

            // Goods cards
            pop.querySelectorAll('.gcard').forEach(function(card) {
                card.addEventListener('click', function() {
                    var id    = card.dataset.id;
                    var label = card.dataset.label;
                    var idx   = selectedGoods.findIndex(function(g) { return g.id === id; });
                    if (idx === -1) {
                        selectedGoods.push({ id: id, label: label, qty: 1 });
                        card.style.borderColor = R.accent;
                        card.style.background  = 'rgba(0,115,187,0.2)';
                    } else {
                        selectedGoods.splice(idx, 1);
                        card.style.borderColor = R.border;
                        card.style.background  = R.panel;
                    }
                    renderGoods(pop, R);
                });
            });

            // Carrier autocomplete
            var cInput = pop.querySelector('#px-carrier');
            var cSugg  = pop.querySelector('#px-csugg');
            cInput.addEventListener('input', function() {
                var results = searchCarrier(cInput.value);
                if (!results.length) { cSugg.style.display = 'none'; return; }
                cSugg.innerHTML = results.map(function(r) {
                    return '<div class="cs-item" data-name="' + r.name + '" style="' +
                        'padding:9px 14px;cursor:pointer;font-size:12px;' +
                        'border-bottom:1px solid ' + R.border + ';' +
                        'display:flex;gap:12px;align-items:center;color:' + R.text + ';">' +
                        '<strong style="color:' + R.accent + ';min-width:68px;font-size:11px;">' +
                        r.code + '</strong><span>' + r.name + '</span></div>';
                }).join('');
                cSugg.style.display = 'block';
                cSugg.querySelectorAll('.cs-item').forEach(function(s) {
                    s.addEventListener('mouseenter', function() { s.style.background = R.panel; });
                    s.addEventListener('mouseleave', function() { s.style.background = 'transparent'; });
                    s.addEventListener('click', function() {
                        cInput.value = s.dataset.name;
                        cInput.style.borderColor = R.accent;
                        cSugg.style.display = 'none';
                    });
                });
            });

            pop.querySelector('#px-close').onclick  = function() { ov.remove(); };
            pop.querySelector('#px-cancel').onclick = function() { ov.remove(); };
            pop.querySelector('#px-sc').onclick     = function() {
                window.open(
                    'https://trans-logistics-eu.amazon.com/yms/shipclerk/#/yard',
                    '_blank');
            };
            ov.addEventListener('click', function(e) {
                if (e.target === ov) ov.remove();
            });

            pop.querySelector('#px-print').onclick = function() {
                var seal = pop.querySelector('#px-seal').value.trim();
                if (!seal) {
                    pop.querySelector('#px-seal').style.borderColor = R.danger;
                    pop.querySelector('#px-seal').focus();
                    alert('Inserisci il SEAL NUMBER!');
                    return;
                }
                if (selectedGoods.length === 0)
                    if (!confirm('Nessuna merce selezionata. Continuare?')) return;
                printCMR(collectForm(pop));
                ov.remove();
            };

            setTimeout(function() {
                var s = pop.querySelector('#px-seal');
                if (s) s.focus();
            }, 150);
        }

        function renderGoods(pop, R) {
            var container = pop.querySelector('#goods-list');
            if (!container) return;
            container.innerHTML = '';

            if (selectedGoods.length === 0) {
                container.innerHTML =
                    '<span style="color:' + R.label + ';font-size:12px;">' +
                    'Nessuna merce — clicca le card</span>';
                return;
            }

            selectedGoods.forEach(function(g, i) {
                var meta = GOODS_LIST.find(function(x) { return x.id === g.id; });
                var chip = document.createElement('div');
                chip.style.cssText =
                    'display:flex;align-items:center;gap:6px;' +
                    'background:rgba(0,115,187,0.15);' +
                    'border:1px solid ' + R.accent + ';border-radius:14px;' +
                    'padding:4px 10px 4px 8px;' +
                    'font-size:12px;font-weight:600;color:' + R.text + ';';
                chip.innerHTML =
                    '<span>' + (meta ? meta.icon : '📦') + '</span>' +
                    '<span>' + g.label + '</span>' +
                    '<span style="color:' + R.label + ';font-weight:400;margin:0 2px;">×</span>' +
                    '<input type="number" value="' + g.qty + '" min="1" max="9999" ' +
                    'style="width:52px;background:rgba(0,0,0,0.3);' +
                    'border:1px solid ' + R.border + ';border-radius:4px;' +
                    'padding:2px 4px;font-size:12px;font-weight:600;' +
                    'text-align:center;outline:none;color:' + R.text + ';font-family:inherit;">' +
                    '<button style="background:rgba(231,76,60,0.2);' +
                    'color:' + R.danger + ';border:1px solid ' + R.danger + ';' +
                    'border-radius:50%;width:18px;height:18px;font-size:10px;' +
                    'cursor:pointer;display:flex;align-items:center;' +
                    'justify-content:center;padding:0;margin-left:2px;flex-shrink:0;">✕</button>';

                var qInput = chip.querySelector('input');
                qInput.addEventListener('click',  function(e) { e.stopPropagation(); });
                qInput.addEventListener('input',  function() {
                    selectedGoods[i].qty = parseInt(qInput.value) || 1;
                });
                qInput.addEventListener('change', function() {
                    selectedGoods[i].qty = parseInt(qInput.value) || 1;
                });

                chip.querySelector('button').addEventListener('click', function(e) {
                    e.stopPropagation(); e.preventDefault();
                    var card = pop.querySelector('#gc-' + selectedGoods[i].id);
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

        function collectForm(p) {
            function v(id) {
                var el = p.querySelector('#' + id);
                return el ? el.value : '';
            }
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
                goods:     selectedGoods.slice(),
                ttype:     v('px-ttype') || 'INTERNATIONAL',
                cmrNum:    v('px-cmr'),
                note:      v('px-note'),
                date:      new Date().toLocaleDateString('it-IT'),
                time:      new Date().toLocaleTimeString('it-IT'),
            };
        }

        function printCMR(d) {
            var copies = [
                { bg:'#ffffff', accent:'#000000', name:'Copia 1 — MITTENTE (Expediteur)' },
                { bg:'#e8f5e9', accent:'#1b5e20', name:'Copia 2 — VETTORE (Transporteur)' },
                { bg:'#e3f2fd', accent:'#0d47a1', name:'Copia 3 — DESTINATARIO (Consignataire)' },
            ];
            var pages = copies.map(function(c) { return buildPage(d, c); }).join('');
            var win = window.open('', '_blank', 'width=1050,height=800');
            win.document.write('<!DOCTYPE html><html><head>' +
                '<meta charset="UTF-8">' +
                '<title>CMR N\u00b0' + d.cmrNum + ' \u2014 ' + d.vrid + '</title>' +
                '<style>' +
                '* { -webkit-print-color-adjust:exact; print-color-adjust:exact; box-sizing:border-box; margin:0; padding:0; }' +
                '@page { size:A4 portrait; margin:5mm; }' +
                '@media print { .np { display:none!important; } body { background:#fff; } }' +
                'html,body { font-family:Arial,Helvetica,sans-serif; font-size:8pt; background:#bbb; padding:6px; }' +
                '.page { width:200mm; height:287mm; margin:0 auto 6mm; border:2px solid #000; display:flex; flex-direction:column; overflow:hidden; page-break-after:always; }' +
                'table { width:100%; border-collapse:collapse; table-layout:fixed; }' +
                'td { border:1px solid #000; padding:1mm 1.5mm; vertical-align:top; line-height:1.2; overflow:hidden; }' +
                '.lbl { font-size:5.5pt; color:#666; font-style:italic; display:block; margin-bottom:0.5mm; }' +
                '.val { font-size:9.5pt; font-weight:bold; }' +
                '.val-sm { font-size:8.5pt; font-weight:bold; }' +
                '.npb { position:fixed;top:0;left:0;width:100%;z-index:999;background:#232F3E;padding:8px 16px;display:flex;gap:10px;align-items:center; }' +
                '.pb { background:#FF9900;color:#000;border:none;padding:7px 20px;font-size:12px;font-weight:700;cursor:pointer;border-radius:5px; }' +
                '.pb.g { background:#555;color:#fff; }' +
                '</style></head><body>' +
                '<div class="npb np">' +
                '<button class="pb" onclick="window.print()">🖨️ STAMPA 3 COPIE A4</button>' +
                '<button class="pb g" onclick="window.close()">✕ Chiudi</button>' +
                '<span style="color:#aaa;font-size:11px;margin-left:14px;">CMR N\u00b0' +
                d.cmrNum + ' | VRID: ' + d.vrid + ' | ' + d.date + ' ' + d.time + '</span>' +
                '</div>' +
                '<div style="height:46px;" class="np"></div>' +
                pages +
                '</body></html>');
            win.document.close();
        }

        function buildPage(d, c) {
            var isIntl = (d.ttype || 'INTERNATIONAL') === 'INTERNATIONAL';

            var LOGO = '<svg width="75" height="24" viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg">' +
                '<text x="2" y="58" font-family="Arial,sans-serif" font-size="52" font-weight="700" fill="#000">amazon</text>' +
                '<path d="M18 66 C 75 95, 148 95, 205 66" stroke="#FF9900" stroke-width="7" fill="none" stroke-linecap="round"/>' +
                '</svg>';

            var goods = (d.goods && d.goods.length > 0)
                ? d.goods
                : [{ label: d.goodsDesc || 'Amazon Packages', qty: '' }];

            var goodsRows = goods.map(function(g, i) {
                return '<tr>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;">' +
                    '<span style="font-size:8pt;font-weight:bold;">' + g.label + '</span>' +
                    (i===0 ? '<span style="font-size:6pt;color:#777;margin-left:3px;">EUK5</span>' : '') +
                    '</td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;text-align:center;">' +
                    '<span style="font-size:9pt;font-weight:bold;">' + g.qty + '</span></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;">' +
                    '<span style="font-size:8pt;font-weight:bold;">' + g.label + '</span></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;">' +
                    '<span style="font-size:8pt;">' + (d.goodsDesc || 'Amazon Packages') + '</span></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="padding:1px 2px;"></td></tr>';
            }).join('');

            var emptyCount = Math.max(0, 2 - goods.length);
            var emptyRows = '';
            for (var i = 0; i < emptyCount; i++) {
                emptyRows += '<tr>' +
                    '<td style="height:4mm;border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
                    '<td style="padding:1px 2px;"></td></tr>';
            }

            var goodsSummary = goods
                .map(function(g) { return g.label + (g.qty ? ': ' + g.qty : ''); })
                .join(' | ');

            return '<div class="page" style="background:' + c.bg + ';">' +

            '<div style="background:' + (c.bg==='#ffffff'?'#f0f0f0':c.bg) + ';' +
            'border-bottom:2px solid ' + c.accent + ';text-align:center;' +
            'padding:1.2mm;font-weight:bold;font-size:7.5pt;' +
            'color:' + c.accent + ';flex-shrink:0;">' + c.name + '</div>' +

            '<div style="display:flex;align-items:center;justify-content:space-between;' +
            'border-bottom:2px solid #000;padding:1.5mm 3mm;background:#fff;flex-shrink:0;">' +
                '<div style="display:flex;align-items:center;gap:6mm;width:44%;">' +
                LOGO +
                '<div style="font-size:5pt;color:#777;line-height:1.4;font-style:italic;">' +
                'Les parties encadrées de lignes grasses doivent être remplies par le transporteur. / ' +
                'The spaces framed with heavy lines must be filled in by the carrier.' +
                '</div></div>' +
                '<div style="text-align:center;background:#111;padding:2mm 6mm;border-radius:2px;">' +
                '<div style="font-size:26pt;font-weight:bold;color:#FF9900;' +
                'letter-spacing:8px;line-height:1;font-family:Arial Black,Arial,sans-serif;">CMR</div>' +
                '</div>' +
                '<div style="text-align:center;background:#f5f5f5;' +
                'padding:1.5mm 3mm;border:1px solid #ddd;border-radius:2px;width:20%;">' +
                '<div style="font-size:5.5pt;color:#888;">Nr:</div>' +
                '<div style="font-size:18pt;font-weight:bold;line-height:1.1;margin-bottom:1.5mm;">' +
                d.cmrNum + '</div>' +
                '<div style="display:flex;align-items:center;gap:2mm;margin-bottom:1mm;' +
                'padding:0.5mm 2mm;border:1px solid ' + (!isIntl?'#000':'#ddd') + ';border-radius:2px;' +
                'background:' + (!isIntl?'#232F3E':'#fff') + ';">' +
                '<div style="width:7px;height:7px;border-radius:50%;' +
                'background:' + (!isIntl?'#FF9900':'#ddd') + ';flex-shrink:0;"></div>' +
                '<span style="font-size:6pt;font-weight:bold;color:' + (!isIntl?'#fff':'#aaa') + ';">NATIONAL</span></div>' +
                '<div style="display:flex;align-items:center;gap:2mm;padding:0.5mm 2mm;' +
                'border:1px solid ' + (isIntl?'#000':'#ddd') + ';border-radius:2px;' +
                'background:' + (isIntl?'#232F3E':'#fff') + ';">' +
                '<div style="width:7px;height:7px;border-radius:50%;' +
                'background:' + (isIntl?'#FF9900':'#ddd') + ';flex-shrink:0;"></div>' +
                '<span style="font-size:6pt;font-weight:bold;color:' + (isIntl?'#fff':'#aaa') + ';">INTERNATIONAL</span></div>' +
                '</div>' +
            '</div>' +

            '<div style="display:grid;grid-template-columns:44% 56%;border-bottom:1px solid #000;flex-shrink:0;">' +
                '<div style="border-right:2px solid #000;">' +
                    '<div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">' +
                    '<span class="lbl">1 Expéditeur / Sender / Absender</span>' +
                    '<div class="val">' + d.mitt.replace(/\n/g,'<br>') + '</div></div>' +
                    '<div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">' +
                    '<span class="lbl">2 Destinataire / Consignee / Empfänger</span>' +
                    '<div class="val">' + d.dest.replace(/\n/g,'<br>') + '</div></div>' +
                    '<div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:12mm;">' +
                    '<span class="lbl">3 Lieu de livraison / Place of delivery</span>' +
                    '<div class="val">' + d.luogo + '</div></div>' +
                    '<div style="padding:1.5mm 2mm;height:10mm;">' +
                    '<span class="lbl">4 Date et lieu de prise en charge</span>' +
                    '<div style="display:flex;gap:4mm;align-items:center;margin-top:0.5mm;">' +
                    '<div class="val">ROMA</div>' +
                    '<div><span style="font-size:5.5pt;color:#888;">le/on</span>' +
                    '<span class="val-sm"> ' + d.date + '</span></div>' +
                    '<div class="val-sm" style="color:#555;">ITALIA</div>' +
                    '</div></div>' +
                '</div>' +
                '<div>' +
                    '<div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">' +
                    '<span class="lbl">16 Transporteur / Carrier / Frachtführer</span>' +
                    '<div class="val">' + d.carrier + '</div>' +
                    '<div style="margin-top:2mm;font-size:5.5pt;color:#888;">Sub Carrier</div></div>' +
                    '<div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:20mm;">' +
                    '<span class="lbl">17 Transporteurs successifs / Successive Carriers</span>' +
                    '<div style="height:6mm;"></div>' +
                    '<div style="font-size:5.5pt;color:#888;">Sub Carrier</div></div>' +
                    '<div style="padding:1.5mm 2mm;border-bottom:1px solid #000;height:12mm;">' +
                    '<span class="lbl">18 Réserves / Carrier\'s reservations</span>' +
                    '<div style="display:flex;gap:5mm;margin-top:0.5mm;flex-wrap:wrap;">' +
                    '<div><span style="font-size:6pt;color:#555;">VRID:</span><span class="val-sm"> ' + d.vrid + '</span></div>' +
                    '<div><span style="font-size:6pt;color:#555;">Trailer:</span><span class="val-sm"> ' + d.trail + '</span></div>' +
                    '<div><span style="font-size:6pt;color:#555;">Seal:</span><span class="val-sm"> ' + d.seal + '</span></div>' +
                    '</div></div>' +
                    '<div style="padding:1.5mm 2mm;height:10mm;">' +
                    '<span class="lbl">21+22 Etablie a / Established in</span>' +
                    '<div style="display:flex;gap:5mm;align-items:center;margin-top:0.5mm;">' +
                    '<span class="val">DLZ3</span>' +
                    '<div><span style="font-size:5.5pt;color:#888;">le/on</span><span class="val-sm"> ' + d.date + '</span></div>' +
                    '<div><span style="font-size:5.5pt;color:#888;">a/at</span><span class="val-sm"> ' + d.time + '</span></div>' +
                    '</div></div>' +
                '</div>' +
            '</div>' +

            '<div style="padding:1mm 2mm;border-bottom:1px solid #000;background:#f8f8f8;flex-shrink:0;">' +
            '<span class="lbl">5 Documents annexes / Documents attached</span>' +
            '<span class="val-sm">CMR, AMAZON Paper Manifests</span></div>' +

            '<table style="flex-shrink:0;">' +
            '<tr style="background:#e5e5e5;font-size:5.5pt;">' +
            '<td style="width:15%;border-right:1px solid #888;padding:0.5mm 1.5mm;"><b>6</b> Marks</td>' +
            '<td style="width:8%;border-right:1px solid #888;padding:0.5mm 1mm;text-align:center;"><b>7</b> Qty</td>' +
            '<td style="width:13%;border-right:1px solid #888;padding:0.5mm 1.5mm;"><b>8</b> Packing</td>' +
            '<td style="width:28%;border-right:1px solid #888;padding:0.5mm 1.5mm;"><b>9</b> Nature of goods</td>' +
            '<td style="width:12%;border-right:1px solid #888;padding:0.5mm 1.5mm;"><b>10</b> Stat.</td>' +
            '<td style="width:12%;border-right:1px solid #888;padding:0.5mm 1.5mm;"><b>11</b> Kg</td>' +
            '<td style="width:12%;padding:0.5mm 1.5mm;"><b>12</b> m3</td>' +
            '</tr></table>' +

            '<table style="flex-shrink:0;">' +
            goodsRows + emptyRows +
            '<tr><td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
            '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
            '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
            '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
            '<td style="border-right:1px solid #888;padding:1px 2px;"></td>' +
            '<td style="border-right:1px solid #888;padding:1px 2px;text-align:right;font-size:7.5pt;font-weight:bold;">0 kg</td>' +
            '<td style="padding:1px 2px;"></td></tr></table>' +

            '<div style="display:grid;grid-template-columns:56% 44%;border-top:1px solid #000;border-bottom:1px solid #000;flex-shrink:0;">' +
                '<div style="padding:1.5mm 2mm;border-right:2px solid #000;min-height:18mm;">' +
                '<span class="lbl">13 Instructions / Sender\'s instructions</span>' +
                '<div style="font-size:8.5pt;margin:0.8mm 0;">' +
                '<strong>SEAL: </strong><span style="font-size:10pt;font-weight:bold;">' + d.seal + '</span>' +
                ' &nbsp; <strong>MERCE:</strong> ' + goodsSummary + '</div>' +
                '<div style="font-size:6.5pt;color:#333;line-height:1.4;">' + d.note.replace(/\n/g,'<br>') + '</div></div>' +
                '<div style="padding:1.5mm 2mm;min-height:18mm;">' +
                '<span class="lbl">19 A payer par / To be paid by</span>' +
                '<table style="border:none;width:100%;font-size:6.5pt;margin-top:1mm;">' +
                '<tr><td style="border:none;padding:0.8mm 0;">Prix de transport</td>' +
                '<td style="border:none;border-bottom:1px solid #ddd;width:35%;"></td></tr>' +
                '<tr><td style="border:none;padding:0.8mm 0;">Reductions</td>' +
                '<td style="border:none;border-bottom:1px solid #ddd;"></td></tr>' +
                '<tr><td style="border:none;padding:0.8mm 0;">Supplements</td>' +
                '<td style="border:none;border-bottom:1px solid #ddd;"></td></tr>' +
                '<tr><td style="border:none;padding:0.8mm 0;font-weight:bold;">Total</td>' +
                '<td style="border:none;border-bottom:2px solid #000;"></td></tr>' +
                '</table></div>' +
            '</div>' +

            '<div style="display:grid;grid-template-columns:33% 34% 33%;border-bottom:1px solid #000;flex-shrink:0;min-height:24mm;">' +
                '<div style="padding:1.5mm 2mm;border-right:2px solid #000;">' +
                '<span class="lbl">22 Signature expediteur</span>' +
                '<div style="margin-top:13mm;border-top:1px solid #555;padding-top:0.5mm;font-size:9pt;color:#555;">x</div></div>' +
                '<div style="padding:1.5mm 2mm;border-right:2px solid #000;">' +
                '<span class="lbl">23 Signature transporteur</span>' +
                '<div style="font-size:9.5pt;font-weight:bold;margin-top:1mm;">' + d.drv1 + '</div>' +
                (d.drv2 ? '<div style="font-size:8pt;color:#555;">' + d.drv2 + '</div>' : '') +
                '<div style="margin-top:7mm;border-top:1px solid #555;padding-top:0.5mm;font-size:9pt;color:#555;">x</div></div>' +
                '<div style="padding:1.5mm 2mm;">' +
                '<span class="lbl">24 Marchandise recue</span>' +
                '<div style="margin-top:13mm;border-top:1px solid #555;padding-top:0.5mm;font-size:9pt;color:#555;">x</div></div>' +
            '</div>' +

            '<div style="background:#1a1a1a;padding:2.5mm 4mm;flex-shrink:0;min-height:14mm;">' +
            '<div style="font-size:5.5pt;color:#FF9900;font-weight:bold;margin-bottom:1.5mm;letter-spacing:1px;">' +
            '27 — Amtl. Kennzeichen / License plate / Targa veicolo</div>' +
            '<div style="display:flex;gap:18mm;align-items:center;">' +
                '<div><div style="font-size:5.5pt;color:#888;margin-bottom:1mm;">Kfz / Tractor / Motrice</div>' +
                '<div style="font-size:15pt;font-weight:bold;color:#FF9900;letter-spacing:3px;font-family:monospace;">' +
                (d.tract || '_ _ _ _ _ _') + '</div></div>' +
                '<div style="width:1px;height:10mm;background:#444;"></div>' +
                '<div><div style="font-size:5.5pt;color:#888;margin-bottom:1mm;">Anhanger / Trailer / Rimorchio</div>' +
                '<div style="font-size:15pt;font-weight:bold;color:#fff;letter-spacing:3px;font-family:monospace;">' +
                (d.trail || '_ _ _ _ _ _') + '</div></div>' +
            '</div></div>' +

            '<div style="background:#f0f0f0;border-top:1px solid #ddd;padding:1mm 2.5mm;' +
            'flex-shrink:0;margin-top:auto;display:flex;justify-content:space-between;' +
            'font-size:5.5pt;color:#aaa;">' +
            '<span>Edited by SMOULIN for Amazon.com | CMR N\u00b0' + d.cmrNum + '</span>' +
            '<span>' + d.date + ' ' + d.time + ' | DLZ3 \u2014 Via della Magliana 375 \u2014 Roma</span>' +
            '</div></div>';
        }

        var deb;
        new MutationObserver(function() {
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
            var data = {};
            document.querySelectorAll('tr[ng-repeat*="yardAsset"]').forEach(function(row) {
                var vridEl = row.querySelector('td.col9 span[ng-if*="VR_ID"]');
                if (!vridEl) return;
                var vm = vridEl.textContent.match(/\b([A-Z0-9]{8,14})\b/g);
                if (!vm) return;
                var vrid = vm[vm.length - 1];
                var plateEl = row.querySelector('td.col6 a.license-plate span.ng-binding');
                if (!plateEl) return;
                var plate = plateEl.textContent
                    .split('\n')[0].replace(/\s+/g,'').replace(/IT$/,'').trim();
                if (!plate) return;
                var isTrailer = !!row.querySelector('.yard-asset-icon-TRAILER');
                var isTractor = !!row.querySelector('.yard-asset-icon-TRACTOR');
                var noVehicle = !!row.querySelector('td.col7 .shipclerk-italic-label');
                if (!data[vrid]) data[vrid] = { trailer:'', tractor:'' };
                if (isTrailer)                              data[vrid].trailer = plate;
                else if (isTractor)                        data[vrid].tractor = plate;
                else if (noVehicle && !data[vrid].tractor) data[vrid].tractor = plate;
                else if (!data[vrid].trailer)              data[vrid].trailer = plate;
            });
            var count = 0;
            Object.entries(data).forEach(function(entry) {
                var vrid = entry[0]; var p = entry[1];
                if (p.trailer || p.tractor) {
                    savePlates(vrid, p.trailer, p.tractor);
                    count++;
                }
            });
            return count;
        }

        function updateInfo(n) {
            var el = document.getElementById('sc-info');
            if (el) el.textContent =
                'DB: ' + Object.keys(getPlatesDB()).length + ' VRID' +
                ' | Ultimo: ' + n +
                ' | Auto ogni 30s';
        }

        function addBanner() {
            if (document.getElementById('sc-banner')) return;
            var b = document.createElement('div');
            b.id = 'sc-banner';
            b.style.cssText =
                'position:fixed;top:0;left:0;width:100%;z-index:99999;' +
                'background:#232F3E;color:#fff;padding:6px 18px;' +
                'display:flex;align-items:center;gap:12px;' +
                'font-family:Arial,sans-serif;font-size:12px;' +
                'box-shadow:0 3px 10px rgba(0,0,0,0.4);';
            b.innerHTML =
                '<span style="color:#FF9900;font-weight:bold;font-size:13px;">🚛 CMR Tool</span>' +
                '<span id="sc-info" style="color:#aaa;font-size:11px;">' +
                'DB: ' + Object.keys(getPlatesDB()).length + ' VRID salvati</span>' +
                '<button id="sc-now" style="background:#FF9900;color:#000;border:none;' +
                'padding:4px 14px;border-radius:4px;font-size:11px;font-weight:bold;cursor:pointer;">' +
                '📥 Leggi Targhe Ora</button>' +
                '<button id="sc-clr" style="background:#555;color:#fff;border:none;' +
                'padding:4px 12px;border-radius:4px;font-size:11px;cursor:pointer;">' +
                '🗑️ Svuota DB</button>' +
                '<span style="color:#2ecc71;font-size:11px;">⟳ Auto-harvest attivo</span>' +
                '<button id="sc-relay" style="background:#0073bb;color:#fff;border:none;' +
                'padding:4px 14px;border-radius:4px;font-size:11px;cursor:pointer;margin-left:auto;">' +
                '🔗 Vai a Relay</button>';

            document.body.prepend(b);
            document.body.style.paddingTop = '38px';

            document.getElementById('sc-now').onclick = function() {
                var n = harvest(); updateInfo(n);
                var btn = document.getElementById('sc-now');
                btn.textContent = '✅ ' + n + ' trovati!';
                setTimeout(function() { btn.textContent = '📥 Leggi Targhe Ora'; }, 2500);
            };
            document.getElementById('sc-clr').onclick = function() {
                if (confirm('Svuotare il database targhe?')) { clearPlatesDB(); updateInfo(0); }
            };
            document.getElementById('sc-relay').onclick = function() {
                window.open('https://track.relay.amazon.dev/', '_blank');
            };
        }

        var deb;
        new MutationObserver(function() {
            clearTimeout(deb);
            deb = setTimeout(function() { addBanner(); var n = harvest(); updateInfo(n); }, 1500);
        }).observe(document.body, { childList:true, subtree:true });

        setTimeout(function() {
            addBanner();
            setTimeout(function() { updateInfo(harvest()); }, 3000);
            setInterval(function() { updateInfo(harvest()); }, 30000);
        }, 2000);
    }

})(window.GM_setValue, window.GM_getValue, window.GM_xmlhttpRequest);
