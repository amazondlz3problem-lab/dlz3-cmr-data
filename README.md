# 🚛 CMR Generator — DLZ3

> **Tampermonkey script** per la generazione automatica delle bolle CMR
> direttamente dal portale Amazon Relay Track & Trace.
> Sviluppato per la stazione **DLZ3 — Via della Magliana 375, Roma**.

---

## 📋 Indice

- [Descrizione](#-descrizione)
- [Funzionalità](#-funzionalità)
- [Installazione](#-installazione)
- [Come usarlo](#-come-usarlo)
- [Struttura repository](#-struttura-repository)
- [Database](#-database)
- [CMR Layout](#-cmr-layout)
- [ShipClerk — Targhe automatiche](#-shipclerk--targhe-automatiche)
- [Aggiornamenti](#-aggiornamenti)
- [Autore](#-autore)

---

## 📌 Descrizione

Questo progetto sostituisce il vecchio flusso manuale basato su Excel per la
compilazione delle bolle di accompagnamento CMR (Lettre de Voiture
Internationale).

### Flusso precedente ❌


### Flusso nuovo ✅

---

## ✨ Funzionalità

| Funzione | Descrizione |
|---|---|
| 🖨️ **Pulsante CMR** | Appare su ogni trip nella pagina Relay |
| 👤 **Driver automatico** | Legge i nomi degli autisti direttamente dalla pagina |
| 🚚 **Carrier lookup** | Ricerca automatica del nome carrier dal codice SCAC |
| 🔍 **Autocomplete carrier** | Ricerca per nome o codice SCAC nel popup |
| 🚛 **Targhe automatiche** | Legge Trailer e Tractor da ShipClerk |
| 📦 **Selezione merci** | 7 tipi di merce selezionabili con quantità |
| 🌍 **National/International** | Toggle selezionabile nel popup e visibile sulla CMR |
| 🖨️ **3 copie A4** | Bianco (Mittente), Verde (Vettore), Blu (Destinatario) |
| 📋 **N° CMR progressivo** | Contatore automatico salvato in memoria |
| 🔒 **Validazione Seal** | Blocca la stampa se il sigillo non è inserito |

---

## 🔧 Installazione

### Step 1 — Installa Tampermonkey

Installa l'estensione **Tampermonkey** nel tuo browser Chrome:

👉 [Chrome Web Store — Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

### Step 2 — Installa lo script

1. Clicca sull'icona Tampermonkey nella barra del browser
2. Seleziona **"Crea nuovo script"**
3. Cancella tutto il contenuto
4. Copia e incolla il contenuto del file `script/cmr_generator.js`
5. Salva con `Ctrl + S`

### Step 3 — Verifica

Apri la pagina Relay:

Dovresti vedere il pulsante **🖨️ CMR** accanto ad ogni VRID nella lista.

---

## 🚀 Come usarlo

### Generare una CMR

> ⚠️ **Il Seal Number è l'unico campo obbligatorio manuale.**

### Tipi di merce disponibili

| Icona | Tipo | Descrizione |
|---|---|---|
| 🪵 | **Epal** | Europallet EPAL |
| 🔁 | **OneWay** | OneWay Pallet |
| 🪶 | **Light** | Light Items |
| 🛒 | **JP Cart** | JP Cart |
| 📐 | **F. misura** | Fuori Misura |
| 🟦 | **AMPAL** | AMPAL Plastic Pallet |
| ✏️ | **Altro** | Altro / Other |

### Selezione multipla merci

Puoi selezionare **più tipi di merce** contemporaneamente.
Per ogni tipo selezionato puoi inserire la quantità nel chip che appare.

---

## 🚛 ShipClerk — Targhe automatiche

Lo script legge le targhe (Trailer e Tractor) automaticamente da ShipClerk.

### Come funziona

### Banner ShipClerk

In cima alla pagina ShipClerk appare un banner con:

| Pulsante | Funzione |
|---|---|
| 📥 **Leggi Targhe Ora** | Forza la lettura immediata delle targhe |
| 🗑️ **Svuota DB** | Cancella tutte le targhe salvate |
| 🔗 **Vai a Relay** | Apre Relay in un nuovo tab |

---

## 📁 Struttura repository

---

## 🗄️ Database

### carrier_db.js

Contiene la mappatura completa **SCAC → Nome carrier**.

```javascript
// Esempio
const CARRIER_DB = {
    "ASPIC": "LOGISTICA & TRASPORTI SPINELLI CATALDO",
    "AFAGS": "GATTI FILASTRO SRL",
    "NROMA": "NORD ROMA TERMINAL",
    // ... oltre 200 carrier
};
