// Wildlife Tracker Pro - Main Application
// Database and state management

const SPECIES_LIST = [
    'Leeu',
    'Luiperd',
    'Tier',
    'Jagluiperd',
    'Seekoei',
    'Renoster (Wit)',
    'Renoster (Swart)',
    'Olifant',
    'Buffel',
    'Sebra',
    'Koedoe',
    'Waterbok',
    'Blesbok',
    'Springbok',
    'Impala',
    'Rooibok',
    'Gemsbok',
    'Eland',
    'Blouwildebees',
    'Swartwildebees',
    'Bosvark',
    'Vlakvark',
    'Erdvark',
    'Jakkals',
    'Hiëna',
    'Wildehond',
    'Duiker',
    'Steenbok',
    'Klipspringer',
    'Bobbejaan',
    'Vervet Aap',
    'Stert Meerkat',
    'Aardwolf',
    'Rooikat',
    'Serval',
    'Karakaal',
    'Volstruis',
    'Kori Korhaan',
    'Pou'
];

class WildlifeTracker {
    constructor() {
        this.db = null;
        this.currentPosition = null;
        this.watchId = null;
        this.map = null;
        this.markers = [];
        this.observations = [];
        
        this.initDB();
        this.initUI();
        this.startGPSTracking();
        this.checkOnlineStatus();
        
        // Register service worker for offline functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('Service Worker registered successfully:', registration);
                        
                        // Check for updates every time app loads
                        registration.update();
                        
                        // Listen for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker available, show update message
                                    if (confirm('Nuwe weergawe beskikbaar! Herlaai vir opdatering?')) {
                                        window.location.reload();
                                    }
                                }
                            });
                        });
                    })
                    .catch(err => {
                        console.log('Service Worker registration failed:', err);
                    });
            });
        } else {
            console.log('Service Worker not supported in this browser');
            this.showAlert('Hierdie blaaier ondersteun nie offline modus nie. Gebruik Chrome.', 'error');
        }
    }
    
    // Initialize IndexedDB for offline storage
    initDB() {
        const request = indexedDB.open('WildlifeTrackerDB', 1);
        
        request.onerror = () => {
            console.error('Database failed to open');
            this.showAlert('Databasis fout - probeer bladsy herlaai', 'error');
        };
        
        request.onsuccess = () => {
            this.db = request.result;
            console.log('Database opened successfully');
            this.loadObservations();
        };
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            
            if (!db.objectStoreNames.contains('observations')) {
                const objectStore = db.createObjectStore('observations', { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                objectStore.createIndex('species', 'species', { unique: false });
                objectStore.createIndex('date', 'date', { unique: false });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    }
    
    // Initialize UI components
    initUI() {
        // Populate species dropdowns
        const speciesSelect = document.getElementById('species');
        const filterSpeciesSelect = document.getElementById('filterSpecies');
        const listFilterSpeciesSelect = document.getElementById('listFilterSpecies');
        
        SPECIES_LIST.forEach(species => {
            const option1 = document.createElement('option');
            option1.value = species;
            option1.textContent = species;
            speciesSelect.appendChild(option1);
            
            const option2 = option1.cloneNode(true);
            filterSpeciesSelect.appendChild(option2);
            
            const option3 = option1.cloneNode(true);
            listFilterSpeciesSelect.appendChild(option3);
        });
        
        // Setup form submission
        document.getElementById('recordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveObservation();
        });
    }
    
    // GPS Tracking
    startGPSTracking() {
        if (!navigator.geolocation) {
            this.showAlert('GPS nie beskikbaar op hierdie toestel nie', 'error');
            document.getElementById('gpsText').textContent = 'GPS nie ondersteun nie';
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.updatePosition(position),
            (error) => this.handleGPSError(error),
            options
        );
        
        // Also get immediate position
        navigator.geolocation.getCurrentPosition(
            (position) => this.updatePosition(position),
            (error) => this.handleGPSError(error),
            options
        );
    }
    
    updatePosition(position) {
        this.currentPosition = position;
        
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        const accuracy = position.coords.accuracy.toFixed(1);
        
        document.getElementById('location').value = `${lat}, ${lon}`;
        document.getElementById('accuracy').value = `±${accuracy}m`;
        document.getElementById('gpsStatus').classList.add('active');
        document.getElementById('gpsText').textContent = `GPS aktief: ${lat}, ${lon}`;
    }
    
    handleGPSError(error) {
        let message = 'GPS fout';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = 'GPS toestemming geweier';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'GPS ligging nie beskikbaar nie';
                break;
            case error.TIMEOUT:
                message = 'GPS tyd verstreke';
                break;
        }
        
        document.getElementById('gpsText').textContent = message;
        document.getElementById('gpsStatus').classList.remove('active');
    }
    
    // Save observation to database
    saveObservation() {
        if (!this.currentPosition) {
            this.showAlert('Wag asseblief vir GPS sein', 'error', 'recordAlert');
            return;
        }
        
        const species = document.getElementById('species').value;
        const notes = document.getElementById('notes').value;
        
        if (!species) {
            this.showAlert('Kies asseblief \'n spesie', 'error', 'recordAlert');
            return;
        }
        
        const observation = {
            species: species,
            latitude: this.currentPosition.coords.latitude,
            longitude: this.currentPosition.coords.longitude,
            accuracy: this.currentPosition.coords.accuracy,
            notes: notes,
            date: new Date().toLocaleString('af-ZA'),
            timestamp: Date.now()
        };
        
        const transaction = this.db.transaction(['observations'], 'readwrite');
        const objectStore = transaction.objectStore('observations');
        const request = objectStore.add(observation);
        
        request.onsuccess = () => {
            this.showAlert(`✓ ${species} suksesvol gemerk!`, 'success', 'recordAlert');
            document.getElementById('recordForm').reset();
            document.getElementById('notes').value = '';
            this.loadObservations();
        };
        
        request.onerror = () => {
            this.showAlert('Kon nie waarneming stoor nie', 'error', 'recordAlert');
        };
    }
    
    // Load all observations from database
    loadObservations() {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['observations'], 'readonly');
        const objectStore = transaction.objectStore('observations');
        const request = objectStore.getAll();
        
        request.onsuccess = () => {
            this.observations = request.result;
            this.renderObservationsList();
            this.renderStats();
        };
    }
    
    // Render observations list
    renderObservationsList() {
        const container = document.getElementById('observationsList');
        const emptyState = document.getElementById('emptyState');
        
        // Apply filters
        const speciesFilter = document.getElementById('listFilterSpecies').value;
        const daysFilter = document.getElementById('listFilterDays').value;
        
        let filtered = this.observations;
        
        if (speciesFilter) {
            filtered = filtered.filter(obs => obs.species === speciesFilter);
        }
        
        if (daysFilter !== 'all') {
            const daysAgo = Date.now() - (parseInt(daysFilter) * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(obs => obs.timestamp > daysAgo);
        }
        
        // Sort by most recent first
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        
        if (filtered.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        container.innerHTML = filtered.map(obs => `
            <div class="observation-card">
                <h3>🦁 ${obs.species}</h3>
                <div class="observation-detail">📍 ${obs.latitude.toFixed(6)}, ${obs.longitude.toFixed(6)}</div>
                <div class="observation-detail">🎯 Akkuraatheid: ±${obs.accuracy.toFixed(1)}m</div>
                <div class="observation-detail">📅 ${obs.date}</div>
                ${obs.notes ? `<div class="observation-detail">📝 ${obs.notes}</div>` : ''}
                <div class="observation-actions">
                    <button class="btn btn-secondary" onclick="tracker.showOnMap(${obs.latitude}, ${obs.longitude})">
                        🗺️ Wys op Kaart
                    </button>
                    <button class="btn btn-danger" onclick="tracker.deleteObservation(${obs.id})">
                        🗑️ Verwyder
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Render statistics
    renderStats() {
        const statsGrid = document.getElementById('statsGrid');
        const topSpecies = document.getElementById('topSpecies');
        
        const total = this.observations.length;
        const uniqueSpecies = new Set(this.observations.map(o => o.species)).size;
        
        // Last 7 days
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recent = this.observations.filter(o => o.timestamp > sevenDaysAgo).length;
        
        // Species count
        const speciesCount = {};
        this.observations.forEach(obs => {
            speciesCount[obs.species] = (speciesCount[obs.species] || 0) + 1;
        });
        
        const topSpeciesArray = Object.entries(speciesCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Totale Waarnemings</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${uniqueSpecies}</div>
                <div class="stat-label">Unieke Spesies</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${recent}</div>
                <div class="stat-label">Laaste 7 Dae</div>
            </div>
        `;
        
        topSpecies.innerHTML = topSpeciesArray.map((item, index) => `
            <div class="observation-card">
                <h3>${index + 1}. ${item[0]}</h3>
                <div class="observation-detail">Waarnemings: ${item[1]}</div>
            </div>
        `).join('');
    }
    
    // Initialize map
    initMap() {
        if (this.map) return;
        
        const mapElement = document.getElementById('map');
        
        // Default center (South Africa)
        let center = [-25.7479, 28.2293];
        let zoom = 6;
        
        if (this.currentPosition) {
            center = [
                this.currentPosition.coords.latitude,
                this.currentPosition.coords.longitude
            ];
            zoom = 12;
        }
        
        this.map = L.map('map').setView(center, zoom);
        
        // Satellite imagery layers (multiple sources for better coverage)
        const satelliteLayers = {
            'Satelliet (Esri)': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles © Esri',
                maxZoom: 19
            }),
            'Satelliet (Google)': L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                attribution: '© Google',
                maxZoom: 20
            }),
            'Hibried (Google)': L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                attribution: '© Google',
                maxZoom: 20
            }),
            'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19
            })
        };
        
        // Set default to Satellite (Esri - best offline caching)
        satelliteLayers['Satelliet (Esri)'].addTo(this.map);
        
        // Add layer control for switching
        L.control.layers(satelliteLayers).addTo(this.map);
        
        // Add scale control
        L.control.scale({imperial: false, metric: true}).addTo(this.map);
        
        // Add current location marker if available
        if (this.currentPosition) {
            const marker = L.marker(center, {
                icon: L.divIcon({
                    className: 'current-location-marker',
                    html: '<div style="background: #2196F3; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(33,150,243,0.5);"></div>',
                    iconSize: [20, 20]
                })
            }).addTo(this.map);
            
            marker.bindPopup('📍 Huidige Posisie').openPopup();
            
            // Add accuracy circle
            L.circle(center, {
                radius: this.currentPosition.coords.accuracy,
                color: '#2196F3',
                fillColor: '#2196F3',
                fillOpacity: 0.1,
                weight: 1
            }).addTo(this.map);
        }
    }
    
    // Update map with observations
    updateMap() {
        if (!this.map) {
            this.initMap();
        }
        
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
        
        // Get filter values
        const speciesFilter = document.getElementById('filterSpecies').value;
        const radius = parseFloat(document.getElementById('radius').value);
        const days = parseInt(document.getElementById('days').value);
        
        // Filter observations
        let filtered = this.observations;
        
        if (speciesFilter) {
            filtered = filtered.filter(obs => obs.species === speciesFilter);
        }
        
        const daysAgo = Date.now() - (days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(obs => obs.timestamp > daysAgo);
        
        // Filter by radius if we have current position
        if (this.currentPosition && radius > 0) {
            const currentLat = this.currentPosition.coords.latitude;
            const currentLon = this.currentPosition.coords.longitude;
            
            filtered = filtered.filter(obs => {
                const distance = this.calculateDistance(
                    currentLat, currentLon,
                    obs.latitude, obs.longitude
                );
                return distance <= radius;
            });
        }
        
        // Add markers for filtered observations
        filtered.forEach(obs => {
            // Create custom marker with species emoji/icon
            const speciesIcon = this.getSpeciesIcon(obs.species);
            
            const marker = L.marker([obs.latitude, obs.longitude], {
                icon: L.divIcon({
                    className: 'wildlife-marker',
                    html: `<div style="background: white; padding: 5px 10px; border-radius: 20px; border: 2px solid #2d5016; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 18px; white-space: nowrap;">
                        ${speciesIcon} <span style="font-size: 12px; font-weight: bold; color: #2d5016;">${obs.species}</span>
                    </div>`,
                    iconSize: [null, 30],
                    iconAnchor: [0, 30]
                })
            }).addTo(this.map);
            
            marker.bindPopup(`
                <div style="min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: #2d5016;">${speciesIcon} ${obs.species}</h3>
                    <div style="font-size: 13px; line-height: 1.6;">
                        <strong>📅 Datum:</strong> ${obs.date}<br>
                        <strong>📍 Koördinate:</strong><br>
                        <span style="font-family: monospace; font-size: 11px;">
                            ${obs.latitude.toFixed(6)}, ${obs.longitude.toFixed(6)}
                        </span><br>
                        <strong>🎯 Akkuraatheid:</strong> ±${obs.accuracy.toFixed(1)}m
                        ${obs.notes ? `<br><br><strong>📝 Notas:</strong><br>${obs.notes}` : ''}
                    </div>
                </div>
            `);
            
            this.markers.push(marker);
        });
        
        // Fit map to show all markers
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
        
        this.showAlert(`${filtered.length} waarnemings gewys op kaart`, 'success', 'recordAlert');
    }
    
    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    toRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    // Get species-specific icon
    getSpeciesIcon(species) {
        const icons = {
            'Leeu': '🦁',
            'Luiperd': '🐆',
            'Tier': '🐅',
            'Jagluiperd': '🐆',
            'Seekoei': '🦛',
            'Renoster (Wit)': '🦏',
            'Renoster (Swart)': '🦏',
            'Olifant': '🐘',
            'Buffel': '🐃',
            'Sebra': '🦓',
            'Koedoe': '🦌',
            'Waterbok': '🦌',
            'Blesbok': '🦌',
            'Springbok': '🦌',
            'Impala': '🦌',
            'Rooibok': '🦌',
            'Gemsbok': '🦌',
            'Eland': '🦌',
            'Blouwildebees': '🐃',
            'Swartwildebees': '🐃',
            'Bosvark': '🐗',
            'Vlakvark': '🐗',
            'Erdvark': '🐗',
            'Jakkals': '🦊',
            'Hiëna': '🐺',
            'Wildehond': '🐕',
            'Duiker': '🦌',
            'Steenbok': '🦌',
            'Klipspringer': '🦌',
            'Bobbejaan': '🐒',
            'Vervet Aap': '🐒',
            'Stert Meerkat': '🦦',
            'Aardwolf': '🐺',
            'Rooikat': '🐈',
            'Serval': '🐈',
            'Karakaal': '🐈',
            'Volstruis': '🦃',
            'Kori Korhaan': '🦃',
            'Pou': '🦃'
        };
        
        return icons[species] || '🦌';
    }
    
    // Show observation on map
    showOnMap(lat, lon) {
        switchTab('view');
        
        setTimeout(() => {
            if (!this.map) {
                this.initMap();
            }
            
            this.map.setView([lat, lon], 15);
            
            L.marker([lat, lon])
                .addTo(this.map)
                .bindPopup('📍 Waarneming')
                .openPopup();
        }, 300);
    }
    
    // Delete observation
    deleteObservation(id) {
        if (!confirm('Is jy seker jy wil hierdie waarneming verwyder?')) {
            return;
        }
        
        const transaction = this.db.transaction(['observations'], 'readwrite');
        const objectStore = transaction.objectStore('observations');
        const request = objectStore.delete(id);
        
        request.onsuccess = () => {
            this.showAlert('Waarneming verwyder', 'success', 'recordAlert');
            this.loadObservations();
        };
        
        request.onerror = () => {
            this.showAlert('Kon nie waarneming verwyder nie', 'error', 'recordAlert');
        };
    }
    
    // Export data as CSV
    exportData() {
        if (this.observations.length === 0) {
            this.showAlert('Geen data om te eksporteer nie', 'error', 'recordAlert');
            return;
        }
        
        let csv = 'Spesie,Latitude,Longitude,Akkuraatheid,Datum,Notas\n';
        
        this.observations.forEach(obs => {
            csv += `"${obs.species}",${obs.latitude},${obs.longitude},${obs.accuracy},"${obs.date}","${obs.notes || ''}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wild_tracker_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showAlert('Data geëksporteer!', 'success', 'recordAlert');
    }
    
    // Check online/offline status
    checkOnlineStatus() {
        const banner = document.getElementById('offlineBanner');
        
        const updateStatus = () => {
            if (!navigator.onLine) {
                banner.classList.add('show');
            } else {
                banner.classList.remove('show');
            }
        };
        
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }
    
    // Show alert message
    showAlert(message, type = 'success', elementId = 'recordAlert') {
        const alert = document.getElementById(elementId);
        alert.textContent = message;
        alert.className = `alert alert-${type} show`;
        
        setTimeout(() => {
            alert.classList.remove('show');
        }, 5000);
    }
}

// Global functions for UI interaction
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Initialize map when view tab is opened
    if (tabName === 'view' && !tracker.map) {
        setTimeout(() => tracker.initMap(), 100);
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('GPS nie beskikbaar nie');
        return;
    }
    
    tracker.showAlert('GPS word verfris...', 'info', 'recordAlert');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            tracker.updatePosition(position);
            tracker.showAlert('GPS posisie opgedateer!', 'success', 'recordAlert');
        },
        (error) => {
            tracker.handleGPSError(error);
            tracker.showAlert('Kon nie GPS kry nie', 'error', 'recordAlert');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function filterList() {
    tracker.renderObservationsList();
}

function exportData() {
    tracker.exportData();
}

function updateMap() {
    tracker.updateMap();
}

// Initialize app when DOM is ready
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new WildlifeTracker();
});
