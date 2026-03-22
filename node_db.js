// ═══════════════════════════════════════════════════════════════════
// NODE DATABASE — Amazon Italia
// File: node_db.js
// Estratto da: CMR+autocompilazione 2.4 (Relay Track & Trace).xlsm
// Foglio: "Data"
// ═══════════════════════════════════════════════════════════════════

const NODE_DB = {

    // ── FULFILLMENT CENTERS ──────────────────────────────────────
    "BGY1": {
        type:    "FC",
        city:    "Cividate al Piano (BG)",
        region:  "Lombardia",
        address: "SP98\n24050 Cividate al Piano (BG) - ITALY",
        full:    "Fullfilment Center BGY1 - Amazon Italia Logistics\nSP98, 24050 Cividate al Piano BG, Italy"
    },
    "BLQ1": {
        type:    "FC",
        city:    "Castelguglielmo (RO)",
        region:  "Veneto",
        address: "Via Ipzia D'Alessandria\n45020 Castelguglielmo (RO) - ITALY",
        full:    "Fullfilmente Center BLQ1 - Amazon Italia Logistics\nVia Ipzia D'Alessandria, 45020 Castelguglielmo RO Italy"
    },
    "BLQ8": {
        type:    "FC",
        city:    "Spilamberto (MO)",
        region:  "Emilia-Romagna",
        address: "Via S. Vito 1369\n41057 Spilamberto (MO) - ITALY",
        full:    "Fullfilment Center BLQ8 - Amazon Italia Logistics\nVia S. Vito, 1369, 41057 Spilamberto MO, Italy"
    },
    "FCO1": {
        type:    "FC",
        city:    "Passo Corese (RI)",
        region:  "Lazio",
        address: "Via della Meccanica snc\n02032 Passo Corese (RI) - ITALY",
        full:    "Fullfilment Center FCO1 - Amazon Italia Logistics\nVia della Meccanica 32, 02032 Passo Corese Fara in Sabina RI Italia"
    },
    "FCO2": {
        type:    "FC",
        city:    "Colleferro (RM)",
        region:  "Lazio",
        address: "SP21\n00034 Colleferro (RM) - ITALY",
        full:    "Fullfilment Center FCO2 - Amazon Italia Logistics\n00034 Colleferro, SP21 RM, Italia"
    },
    "FCO8": {
        type:    "FC",
        city:    "Fara in Sabina (RI)",
        region:  "Lazio",
        address: "Via della Meccanica 32\n02032 Fara in Sabina (RI) - ITALY",
        full:    "Fullfilment Center FCO8 - Amazon Italia Logistics\nVia della Meccanica, 32, 02032 Fara in Sabina (RI), Italia"
    },
    "FCO9": {
        type:    "FC",
        city:    "Prato della Corte (RM)",
        region:  "Lazio",
        address: "Via Mola Saracena\n00065 Prato della Corte (RM) - ITALY",
        full:    "Fullfilment Center FCO9 - Amazon Italia Logistics\nVia Mola Saracena, 00065 Prato della Corte RM, Italia"
    },
    "LIN8": {
        type:    "FC",
        city:    "Casirate D'Adda (BG)",
        region:  "Lombardia",
        address: "Via Gioacchino Rossini\n24040 Casirate D'Adda (BG) - ITALY",
        full:    "Fullfiment Center LIN8 - Amazon Italia Logistics\nVia Gioacchino Rossi, 24040 Casirate D'adda BG Italia"
    },
    "MXP3": {
        type:    "FC",
        city:    "Vercelli",
        region:  "Piemonte",
        address: "Via Rita Levi Montalcini 2\n13100 Vercelli - ITALY",
        full:    "Fullfiment Center MXP3 - Amazon Italia Logistics\nVia Rita Levi Montalcini 2, 13100 Vercelli Italia"
    },
    "MXP5": {
        type:    "FC",
        city:    "Castel San Giovanni (PC)",
        region:  "Emilia-Romagna",
        address: "Via Dogana Po 2U\n29015 Castel San Giovanni (PC) - ITALY",
        full:    "Fullfilment Center MXP5 - Amazon Italia Logistics\nStrada Dogana po, 2u, 29015 Castel San Giovanni PC Italia"
    },
    "MXP6": {
        type:    "FC",
        city:    "Novara",
        region:  "Piemonte",
        address: "Via Luigi Einaudi 4\n28100 Novara - ITALY",
        full:    "Amazon Italia Logistica S.R.L Via Luigi Einaudi 4, Novara, Agognate, 28100, Italy"
    },
    "MXP8": {
        type:    "FC",
        city:    "Castel San Giovanni (PC)",
        region:  "Emilia-Romagna",
        address: "Strada Dogana Po 4U\n29015 Castel San Giovanni (PC) - ITALY",
        full:    "Strada Dogana Po, 4/U, Castel San Giovanni PC, Emilia-Romagna, 29015, Italy"
    },
    "TRN1": {
        type:    "FC",
        city:    "Torrazza Piemonte (TO)",
        region:  "Piemonte",
        address: "SP90 11\n10037 Torrazza Piemonte (TO) - ITALY",
        full:    "Fullfilment Center TRN1 - Amazon Italia Logistics\nSP90, 11, 10037 Torrazza Piemonte TO, Italy"
    },

    // ── FULFILLMENT CENTERS — XIT series ────────────────────────
    "XITF": {
        type:    "FC",
        city:    "Piacenza",
        region:  "Emilia-Romagna",
        address: "Strada della Torre della Razza 62\n29100 Piacenza - ITALY",
        full:    "Strada della Torre della Razza, 62, Piacenza, N/A, 29100, Italy"
    },
    "XITG": {
        type:    "FC",
        city:    "Francolino di Carpiano (MI)",
        region:  "Lombardia",
        address: "Via Aldo Moro 4\n20080 Francolino di Carpiano (MI) - ITALY",
        full:    "Via Aldo Moro 4, Carpiano, Milano, 20074, Italy"
    },
    "XITH": {
        type:    "FC",
        city:    "Soresina (CR)",
        region:  "Lombardia",
        address: "Via Emilio Caldara 7\n26015 Soresina (CR) - ITALY",
        full:    "Via Emilio Caldara, 7, Soresina, Cremona, 26015, Italy"
    },
    "XITI": {
        type:    "FC",
        city:    "Marzano (PV)",
        region:  "Lombardia",
        address: "Strada Provinciale 128 Km 2\n27010 Marzano (PV) - ITALY",
        full:    "Strada Provinciale 128 Km 2, Marzano, Pavia, 27010, Italy"
    },
    "XMP1": {
        type:    "FC",
        city:    "Arquà Polesine (RO)",
        region:  "Veneto",
        address: "Via Maestri Del Lavoro 990\n45031 Arquà Polesine (RO) - ITALY",
        full:    "Via Maestri Del Lavoro, 990, Arqua Polesine, N/A, 45031, Italy"
    },
    "XMP2": {
        type:    "FC",
        city:    "Carpiano (MI)",
        region:  "Lombardia",
        address: "Via Aldo Moro 4\n20080 Francolino di Carpiano (MI) - ITALY",
        full:    "Via Aldo Moro 4, Francolino di Carpiano, N/A, 20080, Italy"
    },
    "OER4": {
        type:    "FC",
        city:    "Cortemaggiore (PC)",
        region:  "Emilia-Romagna",
        address: "Viale Gabriele Rossetti 5\nCortemaggiore (PC) - ITALY",
        full:    "Viale Gabriele Rossetti 5, Cortemaggiore (PC), Italia"
    },

    // ── DELIVERY STATIONS — DLZ series (Roma) ───────────────────
    "DLZ1": {
        type:    "DS",
        city:    "Roma",
        region:  "Lazio",
        address: "Via Giacomo Peroni 462\n00131 Roma (RM) - ITALY",
        full:    "Via Giacomo Peroni, 462, 00131 Roma (RM)"
    },
    "DLZ2": {
        type:    "DS",
        city:    "Pomezia (RM)",
        region:  "Lazio",
        address: "Via Vaccareccia 7\n00071 Pomezia (RM) - ITALY",
        full:    "Via Vaccareccia, 7, 00071 Pomezia (RM)"
    },
    "DLZ3": {
        type:    "DS",
        city:    "Roma",
        region:  "Lazio",
        address: "Via della Magliana 375\n00148 Roma (RM) - ITALY",
        full:    "Via della Magliana, 375, 00148 Roma (RM)"
    },

    // ── DELIVERY STATIONS — DLO series (Milano) ─────────────────
    "DLO1": {
        type:    "DS",
        city:    "Milano",
        region:  "Lombardia",
        address: "Via Vincenzo Toffetti 108\n20139 Milano (MI) - ITALY",
        full:    "Via Vincenzo Toffetti, 108, 20139 Milano (MI)"
    },
    "DLO2": {
        type:    "DS",
        city:    "Origgio (VA)",
        region:  "Lombardia",
        address: "Via Del Lavoro 27\n21040 Origgio (VA) - ITALY",
        full:    "Via Del Lavoro, 27, 21040 Origgio (VA)"
    },
    "DLO3": {
        type:    "DS",
        city:    "Burago di Molgora (MB)",
        region:  "Lombardia",
        address: "Via Galileo Galilei 13\n20875 Burago di Molgora (MB) - ITALY",
        full:    "Via Galileo Galilei, 13, 20875 Burago di Molgora (MB)"
    },
    "DLO4": {
        type:    "DS",
        city:    "Buccinasco (MI)",
        region:  "Lombardia",
        address: "Via dell'Artigianato 2\n20090 Buccinasco (MI) - ITALY",
        full:    "Via dell'Artigianato, 2, 20090 Buccinasco (MI)"
    },
    "DLO5": {
        type:    "DS",
        city:    "Castegnato (BS)",
        region:  "Lombardia",
        address: "Via Pianera\n25045 Castegnato (BS) - ITALY",
        full:    "Via Pianera, 25045 Castegnato (BS)"
    },
    "DLO7": {
        type:    "DS",
        city:    "Mezzate (MI)",
        region:  "Lombardia",
        address: "Via Luigi Galvani 9\n20068 Mezzate (MI) - ITALY",
        full:    "Via Luigi Galvani, 9, 20068 Mezzate (MI)"
    },
    "DLO8": {
        type:    "DS",
        city:    "Pioltello (MI)",
        region:  "Lombardia",
        address: "Via 1° Maggio snc\n20096 Pioltello (MI) - ITALY",
        full:    "Via 1° Maggio snc, 20096 Pioltello (MI)"
    },

    // ── DELIVERY STATIONS — DPI series (Torino) ─────────────────
    "DPI1": {
        type:    "DS",
        city:    "Avigliana (TO)",
        region:  "Piemonte",
        address: "Viale M. Gandhi 25\n10051 Avigliana (TO) - ITALY",
        full:    "Viale M. Gandhi, 25, 10051 Avigliana (TO)"
    },
    "DPI2": {
        type:    "DS",
        city:    "Brandizzo (TO)",
        region:  "Piemonte",
        address: "Via Torino 331\n10032 Brandizzo (TO) - ITALY",
        full:    "Via Torino 331, Brandizzo (TO)"
    },
    "DPI3": {
        type:    "DS",
        city:    "Grugliasco (TO)",
        region:  "Piemonte",
        address: "Strada del Portone 91\n10095 Grugliasco (TO) - ITALY",
        full:    "Via Maserati 16, Grugliasco (TO)"
    },
    "DPI5": {
        type:    "DS",
        city:    "Alessandria",
        region:  "Piemonte",
        address: "Via Piave 121/125\n15121 Alessandria (AL) - ITALY",
        full:    "Via Piave, 121/125, 15121 Alessandria (AL)"
    },

    // ── DELIVERY STATIONS — DNP/DPU series (Napoli/Puglia) ──────
    "DNP1": {
        type:    "DS",
        city:    "Arzano (NA)",
        region:  "Campania",
        address: "Corso Salvatore D'Amato 77\n80022 Arzano (NA) - ITALY",
        full:    "Corso Salvatore D'Amato, 77, 80022 Arzano (NA)"
    },
    "DPU1": {
        type:    "DS",
        city:    "Bitonto (BA)",
        region:  "Puglia",
        address: "Strada Provinciale 231 Km\n70032 Bitonto (BA) - ITALY",
        full:    "Strada Provinciale 231, Km, 70032 Bitonto (BA)"
    },

    // ── DELIVERY STATIONS — DRU series (Abruzzo) ────────────────
    "DRU1": {
        type:    "DS",
        city:    "San Giovanni Teatino (CH)",
        region:  "Abruzzo",
        address: "Via Treviso\n66020 San Giovanni Teatino (CH) - ITALY",
        full:    "Via Treviso, San Giovanni Teatino (CH)"
    },

    // ── DELIVERY STATIONS — DTC series (Toscana) ────────────────
    "DTC1": {
        type:    "DS",
        city:    "Calenzano (FI)",
        region:  "Toscana",
        address: "Via Baldanzese 186\n50041 Calenzano (FI) - ITALY",
        full:    "Via Baldanzese 186, Calenzano (FI)"
    },
    "DTC2": {
        type:    "DS",
        city:    "Firenze",
        region:  "Toscana",
        address: "Via Camillo Porlezza snc\nFirenze - ITALY",
        full:    "Via Camillo Porlezza, snc, Firenze"
    },

    // ── DELIVERY STATIONS — DTT series (Trento) ─────────────────
    "DTT1": {
        type:    "DS",
        city:    "Trento",
        region:  "Trentino-Alto Adige",
        address: "Via Innsbruck 1\n38121 Trento (TN) - ITALY",
        full:    "Via Innsbruck I, 38121 Localita Produttiva I, Trento (TN)"
    },

    // ── DELIVERY STATIONS — DUM series (Umbria) ─────────────────
    "DUM1": {
        type:    "DS",
        city:    "Magione (PG)",
        region:  "Umbria",
        address: "Via Santa Giuliana 27/E\n06063 Magione (PG) - ITALY",
        full:    "Via Santa Giuliana 27/E, Magione (PG)"
    },

    // ── DELIVERY STATIONS — DFV series (Friuli) ─────────────────
    "DFV1": {
        type:    "DS",
        city:    "Fiume Veneto (PN)",
        region:  "Friuli-Venezia Giulia",
        address: "Via Maestri del Lavoro SNC\n33080 Fiume Veneto (PN) - ITALY",
        full:    "Via Maestri del lavoro SNC, Fiume Veneto (PN)"
    },
    "DFV2": {
        type:    "DS",
        city:    "Udine",
        region:  "Friuli-Venezia Giulia",
        address: "Via Liguria 94/a\n33100 Udine (UD) - ITALY",
        full:    "Via Liguria 94/a, 33100 Udine (UD)"
    },

    // ── DELIVERY STATIONS — DVN series (Veneto) ─────────────────
    "DVN1": {
        type:    "DS",
        city:    "Vigonza (PD)",
        region:  "Veneto",
        address: "Via Spagna 28\n35010 Vigonza (PD) - ITALY",
        full:    "Via Spagna, 28, 35010 Vigonza (PD)"
    },
    "DVN2": {
        type:    "DS",
        city:    "Verona",
        region:  "Veneto",
        address: "Via Augusto Righi 5\n37135 Verona (VR) - ITALY",
        full:    "Via augusto Righi 5 - 3, Verona"
    },

    // ── DELIVERY STATIONS — DLG series (Genova) ─────────────────
    "DLG1": {
        type:    "DS",
        city:    "Genova",
        region:  "Liguria",
        address: "Corso Ferdinando Maria Perrone SNC\n16152 Genova (GE) - ITALY",
        full:    "Corso Ferdinando Maria Perrone, snc, 16152 Genova (GE)"
    },

    // ── DELIVERY STATIONS — DMR series (Marche) ─────────────────
    "DMR1": {
        type:    "DS",
        city:    "Camerano (AN)",
        region:  "Marche",
        address: "Via della Sbrozzola 16\n60021 Camerano (AN) - ITALY",
        full:    "Via della Sbrozzola 16, 60021 Camerano (AN)"
    },

    // ── DELIVERY STATIONS — DSG series (Sardegna) ───────────────
    "DSG1": {
        type:    "DS",
        city:    "Cagliari",
        region:  "Sardegna",
        address: "Via Nervi SNC\n09122 Cagliari (CA) - ITALY",
        full:    "Via Nervi snc, 09122 Cagliari (CA)"
    },

    // ── DELIVERY STATIONS — DSI series (Sicilia) ────────────────
    "DSI1": {
        type:    "DS",
        city:    "Palermo",
        region:  "Sicilia",
        address: "Via Enrico Mattei\n90124 Palermo (PA) - ITALY",
        full:    "Via Enrico Mattei, 90124 Palermo PA"
    },
    "DSI2": {
        type:    "DS",
        city:    "Catania",
        region:  "Sicilia",
        address: "SP69i Pantano d'Arci\n95121 Catania (CT) - ITALY",
        full:    "SP69i Pantano d'Arci, 95121 Catania (CT)"
    },

    // ── OUTBOUND STATIONS ────────────────────────────────────────
    "PSR2": {
        type:    "OS",
        city:    "San Salvo (CH)",
        region:  "Abruzzo",
        address: "Viale Germania 114\n66050 San Salvo (CH) - ITALY",
        full:    "Fullfiment Center PSR2 - Amazon Italia Logistics SRL\nViale Germania 114, 66050 San Salvo"
    },
    "CCO8": {
        type:    "OS",
        city:    "Prato della Corte (RM)",
        region:  "Lazio",
        address: "Via Mola Saracena\n00065 Prato della Corte (RM) - ITALY",
        full:    "Via Mola Saracena, 00065 Prato della Corte, Roma, RM, Italy"
    },
    "CNP9": {
        type:    "OS",
        city:    "Arzano (NA)",
        region:  "Campania",
        address: "Corso Salvatore D'Amato 83\n80022 Arzano (NA) - ITALY",
        full:    "Corso Salvatore D'Amato 83, Arzano, NA, 80022, Italy"
    },
    "FCO9": {
        type:    "OS",
        city:    "Prato della Corte (RM)",
        region:  "Lazio",
        address: "Via Bari 1\n00065 Prato della Corte (RM) - ITALY",
        full:    "Via Bari 1, Prato della Corte, Roma, RM, Italy"
    },
    "BRQ2": {
        type:    "OS",
        city:    "Novara",
        region:  "Piemonte",
        address: "Via Luigi Einaudi 4\n28100 Novara - ITALY",
        full:    "Amazon BRQ2 Italia Logistica S.R.L Via Luigi Einaudi 4, Novara, Agognate, 28100, Italy"
    },

    // ── OUTBOUND STATIONS — O series ────────────────────────────
    "OFV1": {
        type:    "OS",
        city:    "Sgonico (TS)",
        region:  "Friuli-Venezia Giulia",
        address: "Localita Devincina 21\nSgonico (TS) - ITALY",
        full:    "Localita Devincina 21, Sgonico (TS)"
    },
    "OLG2": {
        type:    "OS",
        city:    "La Spezia",
        region:  "Liguria",
        address: "19021 Piano di Arcola\nLa Spezia (SP) - ITALY",
        full:    "19021 Piano di Arcola, La Spezia (SP)"
    },
    "OLZ3": {
        type:    "OS",
        city:    "Villa Santa Lucia (FR)",
        region:  "Lazio",
        address: "Via Campo Largo 8\n03030 Villa Santa Lucia (FR) - ITALY",
        full:    "Via Campo Largo, 8, 03030 Villa Santa Lucia (FR)"
    },
    "OLZ5": {
        type:    "OS",
        city:    "Civitavecchia (RM)",
        region:  "Lazio",
        address: "Via Siligato\nCivitavecchia (RM) - ITALY",
        full:    "Via Siligato, Civitavecchia (RM)"
    },
    "OMR2": {
        type:    "OS",
        city:    "Civitanova Marche (MC)",
        region:  "Marche",
        address: "Via Ansaldo 15\n62012 Civitanova Marche (MC) - ITALY",
        full:    "Via Ansaldo 15, Civitanova Marche - zona industriale (MC)"
    },
    "ONP1": {
        type:    "OS",
        city:    "Salerno",
        region:  "Campania",
        address: "Via Acquasanta 3\nSalerno (SA) - ITALY",
        full:    "Via Acquasanta, 3, Salerno (SA)"
    },
    "ONP2": {
        type:    "OS",
        city:    "Benevento",
        region:  "Campania",
        address: "Contrada S. Francesco\n82100 Benevento (BN) - ITALY",
        full:    "Contrada S. Francesco, 82100 Benevento (BN)"
    },
    "OPI1": {
        type:    "OS",
        city:    "Fossano (CN)",
        region:  "Piemonte",
        address: "Via Torino 79\nFossano (CN) - ITALY",
        full:    "Via Torino, 79, Fossano (CN)"
    },
    "OPI2": {
        type:    "OS",
        city:    "Fubine (AL)",
        region:  "Piemonte",
        address: "SS 77\nFubine (AL) - ITALY",
        full:    "SS 77, Fubine (AL)"
    },
    "OPI3": {
        type:    "OS",
        city:    "Casale Corte Cerro (VB)",
        region:  "Piemonte",
        address: "Via Novara 1/5\nCasale Corte Cerro (VB) - ITALY",
        full:    "Via Novara 1/5, Casale Corte Cerro VB, Italia"
    },
    "OPU1": {
        type:    "OS",
        city:    "Lecce",
        region:  "Puglia",
        address: "Zona Industriale 2\nLecce (LE) - ITALY",
        full:    "Zona Industriale 2, Lecce (LE)"
    },
    "OPU2": {
        type:    "OS",
        city:    "Taranto",
        region:  "Puglia",
        address: "Via F. di Giorgio Martini\nTaranto (TA) - ITALY",
        full:    "Via F. di Giorgio Martini, Taranto (TA), Italia"
    },
    "ORE2": {
        type:    "OS",
        city:    "Villa San Giovanni (RC)",
        region:  "Calabria",
        address: "Zona industriale Str. ASI 133\nVilla San Giovanni (RC) - ITALY",
        full:    "Zona industriale, Str. Asi 133, Villa San Giovanni (RC)"
    },
    "ORU1": {
        type:    "OS",
        city:    "L'Aquila",
        region:  "Abruzzo",
        address: "Frazione Genzano di Sassa\nZona industriale di Pile, L'Aquila (AQ) - ITALY",
        full:    "Frazione Genzano di Sassa, Zona industriale di Pile, L'Aquila (AQ)"
    },
    "OER4": {
        type:    "OS",
        city:    "Cortemaggiore (PC)",
        region:  "Emilia-Romagna",
        address: "Viale Gabriele Rossetti 5\nCortemaggiore (PC) - ITALY",
        full:    "Viale Gabriele Rossetti 5, Cortemaggiore (PC), Italia"
    },
    "OSG2": {
        type:    "OS",
        city:    "Sassari",
        region:  "Sardegna",
        address: "Predda Niedda\nSassari (SS) - ITALY",
        full:    "Predda Niedda, Sassari (SS)"
    },
    "OSI1": {
        type:    "OS",
        city:    "Marsala (TP)",
        region:  "Sicilia",
        address: "Contrada San Michele Rigugio 208\nMarsala (TP) - ITALY",
        full:    "Contrada San Michele Rigugio n.208, Marsala (TP)"
    },
    "OSI2": {
        type:    "OS",
        city:    "Giammoro (ME)",
        region:  "Sicilia",
        address: "Via Industriale\n98042 Giammoro (ME) - ITALY",
        full:    "98042 Giammoro, Messina (ME)"
    },
    "OSI5": {
        type:    "OS",
        city:    "Canicatti (AG)",
        region:  "Sicilia",
        address: "SS 122\nCanicatti (AG) - ITALY",
        full:    "SS 122, Canicatti (AG)"
    },
    "OSI6": {
        type:    "OS",
        city:    "Ragusa",
        region:  "Sicilia",
        address: "SP25 Km6 contrada Cimilla\nRagusa (RG) - ITALY",
        full:    "SP25 Km6, contrada Cimilla, Ragusa (RG)"
    },
    "OTC3": {
        type:    "OS",
        city:    "Monteriggioni (SI)",
        region:  "Toscana",
        address: "Via Pietro Nenni 116\nMonteriggioni (SI) - ITALY",
        full:    "Via Pietro Nenni 116, Monteriggioni (SI)"
    },
    "OTC6": {
        type:    "OS",
        city:    "Grosseto",
        region:  "Toscana",
        address: "Via Giordania 250\nGrosseto (GR) - ITALY",
        full:    "Via Giordania 250, Grosseto (GR)"
    },
    "OTT2": {
        type:    "OS",
        city:    "Bressanone (BZ)",
        region:  "Trentino-Alto Adige",
        address: "Via Julius Durst 2\nBressanone (BZ) - ITALY",
        full:    "Via Julius Durst, 2, Bressanone (BZ)"
    },
    "OUM3": {
        type:    "OS",
        city:    "Terni",
        region:  "Umbria",
        address: "Strada di Recentino 46\nTerni (TR) - ITALY",
        full:    "Strada di Recentino 46, Terni (TR)"
    },

    // ── SPECIAL / HUB ────────────────────────────────────────────
    "NROMA": {
        type:    "HUB",
        city:    "Roma",
        region:  "Lazio",
        address: "Via della Magliana 375\n00148 Roma (RM) - ITALY",
        full:    "Nord Roma Terminal - Via della Magliana 375, 00148 Roma (RM)"
    },
    "LIRF": {
        type:    "HUB",
        city:    "Fiumicino (RM)",
        region:  "Lazio",
        address: "Piazzale Caduti Italiani\n00054 Fiumicino (RM) - ITALY",
        full:    "LIRF - B3 Fiumicino Logistica Europa, Piazzale Caduti Italiani, Fiumicino, RM 00054"
    },
    "XITD": {
        type:    "HUB",
        city:    "Arquà Polesine (RO)",
        region:  "Veneto",
        address: "Viale Maestri del Lavoro 990\n45031 Arquà Polesine (RO) - ITALY",
        full:    "Viale Maestri del Lavoro 990, 45031 Arqua Polesine (RO)"
    },
    "XITN1": {
        type:    "HUB",
        city:    "Soresina (CR)",
        region:  "Lombardia",
        address: "Via Pezzini Carlo 176\n26015 Soresina (CR) - ITALY",
        full:    "Via Pezzini Carlo, 176, 26015 Soresina (CR)"
    },
    "XITC": {
        type:    "HUB",
        city:    "Francolino di Carpiano (MI)",
        region:  "Lombardia",
        address: "Via Aldo Moro 4\n20080 Francolino di Carpiano (MI) - ITALY",
        full:    "Via Aldo Moro, 4, 20080 Frankolino di Carpiano (MI)"
    },
    "HLO2": {
        type:    "HUB",
        city:    "Piacenza",
        region:  "Emilia-Romagna",
        address: "Via Francesco M. Bazzani 25\n29122 Piacenza (PC) - ITALY",
        full:    "Via Francesco M. Bazzani, 25, 29122 Piacenza (PC)"
    },
    "XMP4": {
        type:    "HUB",
        city:    "Casei Gerola (PV)",
        region:  "Lombardia",
        address: "Casei Gerola Logistics Park\n27050 Casei Gerola (PV) - ITALY",
        full:    "Casei Gerola Logistics Park, 27050 Casei Gerola (PV)"
    },

    // ── DELIVERY STATIONS — DLY/DLZ EXTRA ───────────────────────
    "DLY1": {
        type:    "DS",
        city:    "Cisterna di Latina (LT)",
        region:  "Lazio",
        address: "Via della Quaglia 16\n04012 Cisterna di Latina (LT) - ITALY",
        full:    "Delivery Station DLY1 - Amazon Italia Logistics\nVia della Quaglia 16, 04012 Cisterna di Latina LT Italia"
    },
    "DLZ7": {
        type:    "DS",
        city:    "Fiumicino (RM)",
        region:  "Lazio",
        address: "Via Portuense 2483\n00054 Fiumicino (RM) - ITALY",
        full:    "Delivery Station DLZ7 - Amazon Italia Logistics\nENI pv 16968, Via Portuense, 2483, 00054 Fiumicino RM, Italia"
    },
    "VEHQ": {
        type:    "DS",
        city:    "Castel San Giovanni (PC)",
        region:  "Emilia-Romagna",
        address: "Strada Provinciale della Val Tidone\n29015 Castel San Giovanni (PC) - ITALY",
        full:    "Delivery Station VEHQ - Amazon Italia Logistic\nStrada Provinciale della Val Tidone, 29015 Castel San Giovanni PC Italia"
    },

};

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Cerca nodi per tipo
 * @param {string} type - "FC", "DS", "OS", "HUB"
 * @returns {Object}
 */
function getNodesByType(type) {
    return Object.entries(NODE_DB)
        .filter(([, v]) => v.type === type)
        .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
}

/**
 * Cerca nodi per regione
 * @param {string} region
 * @returns {Object}
 */
function getNodesByRegion(region) {
    return Object.entries(NODE_DB)
        .filter(([, v]) => v.region.toLowerCase()
            .includes(region.toLowerCase()))
        .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});
}

/**
 * Ricerca nodo per codice
 * @param {string} code
 * @returns {Object|null}
 */
function getNode(code) {
    return NODE_DB[code.toUpperCase().trim()] || null;
}

// Export per uso in Node.js / module
if (typeof module !== 'undefined') {
    module.exports = { NODE_DB, getNodesByType, getNodesByRegion, getNode };
    window.NODE_DB = NODE_DB;

}

