/**
 * Biblioteca de Escenarios (ScenarioLibrary)
 * ==========================================
 * Colección de definiciones de escenarios listas para usar.
 */
class ScenarioLibrary {

    // ------------------------------------------------------------------------
    // ESCENARIO 1: OCÉANO ESTÁNDAR (Juego Principal)
    // ------------------------------------------------------------------------
    static get STANDARD() {
        return new ScenarioDefinition({
            id: 'STANDARD',
            name: 'Océano Primordial',
            description: 'El entorno clásico de LUCA. Océano completo con capas, día/noche y ecosistema abierto.',

            world: {
                rows: 0, // Auto (Full Screen)
                cols: 0, // Auto (Full Screen)
                resolution: 60,
                atmosphereDepth: 0.10, // 10% Atmósfera
                sedimentDepth: 0.10,   // 10% Sedimento
                restrictToVents: false, // Mundo abierto
                vents: [] // Distribución natural
            },

            spawn: {
                mode: 'RANDOM',
                count: 10,
                type: 'LUCA'
            },

            ui: {
                showStatsPanel: true,
                showVentMonitor: false, // No necesario en mundo abierto
                showCellInspector: false, // Solo debug
                showLegend: true,
                showControls: true
            },

            render: {
                centerVertically: false,
                zoomLevel: 1.0
            },

            logging: {
                enabled: false, // Por defecto off en producción
                logEveryFrame: false,
                detailLevel: 'SUMMARY'
            }
        });
    }

    // ------------------------------------------------------------------------
    // ESCENARIO 2: LABORATORIO (Vent Único / Single Cell)
    // ------------------------------------------------------------------------
    static get LAB_SINGLE_VENT() {
        return new ScenarioDefinition({
            id: 'LAB_SINGLE_VENT',
            name: 'Laboratorio: Vent Único',
            description: 'Entorno controlado y aislado. Una única columna de agua sobre un vent hidrotermal perfecto.',

            world: {
                rows: 1, // Por defecto muy pequeño (Overrideable por slider)
                cols: 0, // Auto (calculado para llenar pantalla horizontalmente o centrado)
                resolution: 60,
                atmosphereDepth: 0.0, // Sin atmósfera (Océano profundo)
                sedimentDepth: 1,     // Todo el fondo activo (si rows=1, todo es vent)
                restrictToVents: true, // Resto del mundo es Void

                // Configuración del Vent Central
                vents: [{
                    type: 'CENTER',
                    subType: 'ALKALINE',
                    width: 1 // Ancho relativo (columnas)
                }]
            },

            spawn: {
                mode: 'CENTER_VENT', // Spawn exacto en el centro
                count: 1,
                type: 'LUCA'
            },

            ui: {
                showStatsPanel: true,
                showVentMonitor: true, // PANEL CRÍTICO solicitado
                showCellInspector: true, // Para ver datos de la célula única
                showLegend: true,
                showControls: true
            },

            render: {
                centerVertically: true, // Flotar en el centro de la pantalla
                zoomLevel: 1.0
            },

            // ------------------------------------------------------------------------
            // ESCENARIO 3: TEST DE ESTRÉS (Demostración de Eventos)
            // ------------------------------------------------------------------------
            static get STRESS_TEST() {
                // Heredamos del Lab base para no repetir config
                // Usamos una copia manual simple de las propiedades
                // (En un sistema real usaríamos Object.assign o herencia de clases)
                let base = ScenarioLibrary.LAB_SINGLE_VENT;

                return new ScenarioDefinition({
                    ...base, // Spread syntax works if environment supports it, otherwise manual
                    id: 'STRESS_TEST',
                    name: 'QA: Test de Estrés Térmico',
                    description: 'Ciclo automatizado de calor extremo y congelación para probar resiliencia.',

                    // Sobreescribimos la línea de tiempo
                    events: [
                        { frame: 60, action: 'LOG', payload: '--- INICIANDO PROTOCOLO DE PRUEBAS ---' },
                        { frame: 180, action: 'NOTIFY', payload: '⚠️ PREPARAR PARA IMPULSO TÉRMICO (3s)' },

                        // FASE 1: CALOR EXTREMO (Frame 360 ~ 6 segs)
                        { frame: 360, action: 'SET_VENT_PARAM', payload: { intensity: 5.0 } }, // 500% Flux
                        { frame: 360, action: 'LOG', payload: '>> INTENSIDAD AL MÁXIMO (500%)' },

                        // FASE 2: APAGADO (Frame 720 ~ 12 segs)
                        { frame: 720, action: 'SET_VENT_PARAM', payload: { intensity: 0.0 } }, // 0% Flux
                        { frame: 720, action: 'LOG', payload: '>> APAGADO DE EMERGENCIA (0%)' },

                        // FASE 3: RECUPERACIÓN (Frame 1080 ~ 18 segs)
                        { frame: 1080, action: 'SET_VENT_PARAM', payload: { intensity: 1.0 } }, // 100% Flux
                        { frame: 1080, action: 'NOTIFY', payload: '✅ Sistemas Normalizados' }
                    ]
                });
            }
        }
