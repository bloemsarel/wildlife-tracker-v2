# 📱 OFFLINE INSTALLASIE GIDS - Wild Tracker Pro

## ⚠️ BELANGRIK: Hoekom dit nie werk nie

Die **desktop ikoon** gee 'n 404 fout omdat die PWA nie behoorlik geïnstalleer is nie. Hier is hoe om dit reg te maak:

---

## ✅ STAP-VIR-STAP: Behoorlike Installasie

### **STAP 1: Update Jou GitHub Lêers**

1. **Gaan na jou GitHub repository:**
   ```
   https://github.com/bloemsarel/wildlife-tracker
   ```

2. **Vervang die ou lêers:**
   - Klik op `manifest.json` → Klik op die potlood ikoon (Edit)
   - Verwyder alles en kopieer die NUWE manifest.json inhoud
   - Scroll af en klik "Commit changes"
   
   - Herhaal vir `sw.js` (Service Worker)
   - Herhaal vir `app.js`

3. **Wag 2 minute** vir GitHub om op te dateer

---

### **STAP 2: Maak Desktop Ikoon Skoon**

**Op Desktop:**
1. Verwyder die ou ikoon van jou desktop
2. Maak Chrome heeltemal toe
3. Heropen Chrome

**Op Android:**
1. Hou die app ikoon vas
2. Kies "Remove" of "Uninstall"
3. Maak Chrome heeltemal toe

---

### **STAP 3: Installeer Weer (Korrek hierdie keer)**

#### **OP ANDROID (Aanbeveel):**

1. **Open Chrome** (moet Chrome wees, nie ander blaaier nie)

2. **Gaan na jou app:**
   ```
   https://bloemsarel.github.io/wildlife-tracker/
   ```

3. **Wag vir die "Install" popup:**
   - 'n Klein boks sal onder verskyn wat sê: "Add Wild Tracker Pro to Home screen"
   - Klik op "Install" of "Add"
   
   **OF** as popup nie verskyn nie:
   - Tap die menu (3 kolletjies bo regs)
   - Kies "Add to Home screen"
   - Kies "Install app" as jy dit sien

4. **Die app ikoon verskyn op jou tuisskerm** 🎉

5. **TOETS OFFLINE:**
   - Sit jou foon in **Vliegtuig Modus** ✈️
   - Open die app vanaf die tuisskerm ikoon
   - Dit MOET werk! 
   - GPS sal nie werk sonder sein nie, maar die app self moet oop maak

---

#### **OP DESKTOP (Windows/Mac):**

1. **Open Chrome** browser

2. **Gaan na:**
   ```
   https://bloemsarel.github.io/wildlife-tracker/
   ```

3. **Kyk vir installasie ikoon:**
   - In die address bar (waar die URL is)
   - Kyk vir 'n klein **⊕** of **⬇** ikoon aan die regterkant
   - Klik daarop
   - Kies "Install"

   **OF:**
   - Klik op menu (3 kolletjies)
   - "Save and share" → "Install Wild Tracker Pro"

4. **Die app open in sy eie venster**

5. **TOETS OFFLINE:**
   - Skakel WiFi af
   - Maak die app toe en weer oop
   - Dit MOET werk!

---

## 🔍 HOE OM TE SIEN OF DIT WERK

### **Teken dat dit KORREK geïnstalleer is:**

✅ App open in sy eie venster (geen Chrome balk bo nie)  
✅ GPS vra vir toestemming wanneer jy dit eerste keer open  
✅ Groen GPS lig verskyn 🟢  
✅ Kan waarnemings stoor en sien  
✅ Werk sonder internet (toets in vliegtuig modus)  

### **Teken dat dit VERKEERD geïnstalleer is:**

❌ 404 Error wanneer jy ikoon klik  
❌ App open in Chrome tab (met address bar)  
❌ Werk nie sonder internet nie  
❌ GPS werk nie  

---

## 🛠️ PROBLEEMOPLOSSING

### **Probleem: "Add to Home screen" popup verskyn nie**

**Oplossing:**
1. Maak seker jy gebruik **Chrome** (nie Firefox/Safari nie)
2. Gaan na: `chrome://flags`
3. Soek vir: "PWA"
4. Enable alle PWA features
5. Herlaai Chrome

**OP ANDROID:**
1. Settings → Apps → Chrome → Storage
2. "Clear cache" (MOENIE "Clear data" nie!)
3. Heropen Chrome en probeer weer

---

### **Probleem: 404 Error**

**Oorsaak:** Ou manifest/service worker nog aktief

**Oplossing:**
1. **In Chrome, druk:** `Ctrl+Shift+I` (of F12)
2. Gaan na "Application" tab
3. Klik "Service Workers" in linkerkant menu
4. Klik "Unregister" by alle service workers
5. Klik "Clear site data"
6. Maak Chrome toe en oop weer
7. Gaan na jou site en installeer weer

---

### **Probleem: App werk nie offline nie**

**Kontroleer:**
1. Open Chrome DevTools (F12)
2. Gaan na "Application" → "Service Workers"
3. Moet sê: "Status: activated and running"
4. As dit "Status: redundant" sê:
   - Klik "Unregister"
   - Herlaai bladsy
   - Wag vir nuwe service worker

---

### **Probleem: GPS werk nie**

**Oplossing:**
1. **Gee toestemming:**
   - Android: Settings → Apps → Chrome → Permissions → Location → Allow
   - Desktop: Chrome Settings → Privacy → Site Settings → Location

2. **Gaan buite** (GPS werk nie goed binne nie)

3. **Wag 30-60 sekondes** vir sein

4. **Druk "Verfris GPS"** knoppie

---

## 📊 OFFLINE FUNKSIES WAT WERK

### **SONDER INTERNET:**
✅ App open  
✅ Kyk alle gestoor waarnemings  
✅ Kyk statistieke  
✅ Filtreer en soek data  
✅ Eksporteer na CSV  
✅ Verwyder waarnemings  

### **MET INTERNET (eerste keer nodig):**
✅ Laai kaart teëls  
✅ Wys waarnemings op kaart  
✅ GPS koördinate (GPS chip nodig, nie internet nie)  

### **BELANGRIK:**
- **GPS werk SONDER internet** (GPS is 'n satelliet sein, nie internet nie)
- Maar jy moet die app **een keer met internet** open om alles te cache
- Kaarte sal **nie nuwe areas** wys offline nie, net areas wat jy al besoek het

---

## 💡 PRO WENKE VIR VELD GEBRUIK

### **VOOR JY DIE VELD IN GAAN:**

1. **Open die app met WiFi:**
   - Gaan na "Kaart" tab
   - Zoom in op jou jag gebied
   - Sleep die kaart rond om die area te laai
   - Die kaart sal nou gecached wees vir offline gebruik

2. **Toets offline modus:**
   - Sit foon in vliegtuig modus
   - Open app
   - Kontroleer dat alles werk

3. **Eksporteer ou data:**
   - Maak backup van belangrike data
   - Eksporteer na CSV

### **IN DIE VELD:**

1. **Skakel GPS aan** (nie internet nie)
2. **Wag vir groen lig** 🟢
3. **Merk waarnemings soos gewoonlik**
4. **Data word outomaties gestoor** (plaaslik op foon)

### **TERUG BY KAMP/HUIS:**

1. **Eksporteer data** na CSV
2. **Backup na Google Drive** of email
3. **Sien waarnemings op kaart** (as internet beskikbaar is)

---

## 🔄 HOE OM TE UPDATE

As jy wysigings maak aan die kode:

1. **Upload nuwe lêers** na GitHub
2. **Op foon/desktop:**
   - Open die app
   - App sal outomaties kyk vir updates
   - Popup sal vra: "Nuwe weergawe beskikbaar! Herlaai?"
   - Klik "OK"
   - App herlaai met nuwe weergawe

---

## 📞 HULP NODIG?

**Stuur vir my 'n screenshot van:**
1. Die fout boodskap
2. Chrome DevTools → Application → Service Workers
3. Chrome DevTools → Console tab

**GitHub:** github.com/bloemsarel/wildlife-tracker/issues

---

## ✅ FINALE CHECKLIST

Voordat jy die veld in gaan:

- [ ] App geïnstalleer vanaf tuisskerm ikoon (nie Chrome nie)
- [ ] Getoets in vliegtuig modus - werk! ✓
- [ ] GPS toestemming gegee ✓
- [ ] Kaart areas gecached (met internet) ✓
- [ ] Paar toets waarnemings gemaak ✓
- [ ] Data eksporteer getoets ✓
- [ ] Battery vol gelaai 🔋

---

**Geniet die jag! Die app is nou 100% offline gereed! 🦁🇿🇦**
