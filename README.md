# 🦁 Wild Tracker Pro - Professionele Wildlewe Waarneming Stelsel

## Oorsig

Wild Tracker Pro is 'n volledige Progressive Web App (PWA) wat ontwerp is spesifiek vir professionele jagters (PH's) om wildlewe waarnemings te dokumenteer in die veld. Die app werk **volledig offline** en gebruik GPS om presiese liggings vas te lê.

## ✨ Kenmerke

### 🎯 Kern Funksionaliteit
- **GPS Waarneming Merking**: Outomatiese GPS ligging opsporing met akkuraatheid aanduiding
- **Spesie Keuselys**: Omvattende lys van Suid-Afrikaanse wild
- **Offline Funksionaliteit**: Werk sonder internet - data word plaaslik gestoor
- **Interaktiewe Kaarte**: Wys waarnemings op 'n kaart met filters
- **Data Eksport**: Eksporteer alle data na CSV vir verdere verwerking

### 📍 Waarneming Funksies
- Outomatiese GPS koördinate opsporing
- GPS akkuraatheid aanduiding (meters)
- Datum en tyd stempel
- Opsionele notas vir elke waarneming
- Spesie seleksie met dropdown

### 🗺️ Kaart Visualisering
- Interaktiewe kaarte met OpenStreetMap
- Filter waarnemings per:
  - Spesifieke spesie
  - Radius (km) van huidige posisie
  - Tydperk (laaste X dae)
- Klik op merkers vir detail
- Zoom na spesifieke waarnemings

### 📊 Statistieke
- Totale waarnemings
- Unieke spesies getalle
- Onlangse aktiwiteit (7 dae)
- Top 5 mees waargenome spesies

### 💾 Data Bestuur
- Permanente plaaslike databasis (IndexedDB)
- Geen data verlies wanneer app gesluit word
- Eksporteer na CSV formaat
- Verwyder individuele waarnemings

## 🚀 Installasie

### Opsie 1: Plaaslike Toetsing (Desktop/Laptop)

1. **Maak 'n gids aan:**
   ```
   C:\Tracking\wildlife-tracker\
   ```

2. **Kopieer al die lêers:**
   - index.html
   - app.js
   - manifest.json
   - sw.js

3. **Begin 'n plaaslike bediener:**
   
   **Met Python 3:**
   ```bash
   cd C:\Tracking\wildlife-tracker
   python -m http.server 8000
   ```
   
   **OF met Node.js (as jy dit het):**
   ```bash
   npx http-server -p 8000
   ```

4. **Open in webblaaier:**
   ```
   http://localhost:8000
   ```

### Opsie 2: Op 'n Webgassheer (Vir Foon Toegang)

1. **Upload na GitHub Pages:**
   - Skep 'n nuwe repository op github.com/bloemsarel
   - Upload al 4 lêers
   - Aktiveer GitHub Pages in Settings
   - Toegang via: `https://bloemsarel.github.io/wildlife-tracker`

2. **OF gebruik Netlify/Vercel (gratis):**
   - Sleep lêers na Netlify Drop
   - Kry 'n permanente URL

### Opsie 3: Installeer as App op Android

1. Open die app in Chrome op jou foon
2. Tap die menu (3 kolletjies)
3. Kies "Add to Home screen" / "Voeg by tuisskerm"
4. Die app sal nou werk soos 'n normale app!

## 📱 Gebruik

### Merk 'n Waarneming

1. **Gaan na "Merk" tab**
2. Wag vir GPS sein (groen lig)
3. Kies spesie uit dropdown
4. Voeg opsionele notas by
5. Druk "Stoor Waarneming"

### Kyk na Waarnemings op Kaart

1. **Gaan na "Kaart" tab**
2. Stel filters:
   - Kies spesie (of laat leeg vir alles)
   - Stel radius (km)
   - Kies tydperk (laaste X dae)
3. Druk "Wys op Kaart"
4. Klik op merkers vir details

### Bestuur Waarnemings

1. **Gaan na "Lys" tab**
2. Filter per spesie of datum
3. Klik "Wys op Kaart" om spesifieke waarneming te sien
4. Klik "Verwyder" om te verwyder

### Eksporteer Data

1. **Gaan na "Lys" tab**
2. Druk "Eksporteer Data"
3. CSV lêer word afgelaai
4. Open in Excel/Google Sheets

## 🔧 Tegniese Besonderhede

### Tegnologie Stapel
- **Frontend**: Vanilla JavaScript (geen afhanklikhede)
- **Kaarte**: Leaflet.js + OpenStreetMap
- **Databasis**: IndexedDB (browser-gebaseerd)
- **PWA**: Service Workers vir offline funksionaliteit

### GPS Akkuraatheid
- Gebruik HTML5 Geolocation API
- High accuracy mode geaktiveer
- Akkuraatheid word in meters gewys
- Werk op alle moderne toestelle

### Offline Funksionaliteit
- Alle data word plaaslik gestoor (IndexedDB)
- Service Worker cache kritieke resources
- Kaarte kan gecached word vir offline gebruik
- Geen internet nodig vir normale gebruik

### Data Sekuriteit
- Alle data bly op jou toestel
- Geen wolk sync (tsy jy eksporteer)
- Geen eksterne bediener kommunikasie

## 🌍 Spesie Lys

Die app sluit in:

**Groot Wild:**
Leeu, Luiperd, Tier, Jagluiperd, Seekoei, Renoster (Wit/Swart), Olifant, Buffel

**Algemene Wildsbokke:**
Koedoe, Waterbok, Blesbok, Springbok, Impala, Rooibok, Gemsbok, Eland, Wildebees (Blou/Swart)

**Klein Wild:**
Bosvark, Vlakvark, Duiker, Steenbok, Klipspringer

**Roofdiere:**
Jakkals, Hiëna, Wildehond, Rooikat, Serval, Karakaal

**Voëls:**
Volstruis, Kori Korhaan, Pou

## 🛠️ Aanpassings

### Voeg Spesies By

Open `app.js` en wysig die `SPECIES_LIST` array:

```javascript
const SPECIES_LIST = [
    'Leeu',
    'Luiperd',
    // Voeg jou eie by hier...
    'Nuwe Spesie'
];
```

### Verander Kleure

Open `index.html` en wysig die `:root` CSS veranderlikes:

```css
:root {
    --primary: #2d5016;  /* Hoof kleur */
    --secondary: #8b6914; /* Tweede kleur */
}
```

## 📋 Gebruik Gevalle

### Scenario 1: Daaglikse Patrollie
1. Begin app in die oggend
2. Merk wild soos jy hulle sien
3. Voeg notas by (getalle, gedrag)
4. Aan einde van dag: kyk kaart en eksporteer data

### Scenario 2: Voor Jagtog Voorbereiding
1. Kies jag gebied (stel radius)
2. Filter laaste 30 dae
3. Kies spesifieke spesie (bv. Koedoe)
4. Sien waar hulle onlangs gesien is

### Scenario 3: Multi-Gebied Bestuur
1. Merk waarnemings op verskillende plase
2. Filter per gebied (GPS radius)
3. Vergelyk wildlewe digtheid
4. Eksporteer vir rapporte

## 🐛 Foutopsporing

### GPS Werk Nie
- Maak seker ligging toestemmings is aan
- Gaan buite vir beter sein
- Herlaai bladsy
- Probeer "Verfris GPS" knoppie

### Kaart Laai Nie
- Kontroleer internet verbinding (eerste keer)
- Maak seker JavaScript is geaktiveer
- Probeer 'n ander blaaier

### Data Verdwyn
- IndexedDB word deur browser bestuur
- Moenie browser data skoonmaak nie
- Eksporteer gereeld as backup

### App Werk Nie Offline
- Maak seker jy het dit ten minste een keer met internet geopen
- Service Worker moet geregistreer wees
- Sommige browsers ondersteun nie PWA's nie

## 📞 Ondersteuning

Vir hulp of voorstelle:
- GitHub: github.com/bloemsarel
- Skep 'n Issue op die repository

## 🔮 Toekomstige Kenmerke (Beplanning)

- [ ] Foto's by waarnemings voeg
- [ ] Weer data integrasie
- [ ] Spoor pad aanduiding
- [ ] Multi-gebruiker sync (opsioneel)
- [ ] Aangepaste spesie lyste per gebied
- [ ] PDF rapporte genereer
- [ ] Datum bereik filters
- [ ] Bulk data invoer

## 📄 Lisensie

Hierdie projek is vry om te gebruik en aan te pas vir jou eie doeleindes.

## 🙏 Erkenning

- Kaarte: OpenStreetMap contributors
- Ikone: Unicode Emojis
- Gebou met liefde vir die Suid-Afrikaanse jagbedryf

---

**Gemaak vir professionele jagters wat die beste verdien!** 🦁🇿🇦
