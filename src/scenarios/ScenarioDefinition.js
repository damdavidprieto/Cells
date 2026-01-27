/**
 * Definición de Escenario (Schema)
 * ================================
 * Estructura base para definir cualquier escenario (nivel) del simulador.
 * Desacopla la configuración de la lógica de ejecución.
 */
class ScenarioDefinition {
    constructor(config) {
        // 1. Identidad
        this.id = config.id || 'UNKNOWN';
        this.name = config.name || 'Escenario Sin Nombre';
        this.description = config.description || '';

        // 2. Configuración del Mundo (Física/Entorno)
        this.world = {
            rows: config.world?.rows || 0, // 0 = Auto/Full
            cols: config.world?.cols || 0,
            resolution: config.world?.resolution || 60,

            // Capas ecológicas
            atmosphereDepth: config.world?.atmosphereDepth ?? 0.1,
            sedimentDepth: config.world?.sedimentDepth ?? 0.1,

            // Flags de comportamiento
            restrictToVents: config.world?.restrictToVents || false, // Si true, el resto es vacío

            // Vents iniciales
            vents: config.world?.vents || []
        };

        // 3. Configuración de Inyección (Célula Inicial)
        this.spawn = {
            mode: config.spawn?.mode || 'RANDOM', // RANDOM, CENTER_VENT, MANUAL
            count: config.spawn?.count || 10,
            type: config.spawn?.type || 'LUCA',
            customDNA: config.spawn?.customDNA || null
        };

        // 4. Configuración de Interfaz (UI)
        this.ui = {
            showStatsPanel: config.ui?.showStatsPanel ?? true,
            showVentMonitor: config.ui?.showVentMonitor ?? false,
            showCellInspector: config.ui?.showCellInspector ?? false,
            showLegend: config.ui?.showLegend ?? true,
            showControls: config.ui?.showControls ?? true,

            // Personalización visual
            theme: config.ui?.theme || 'DEFAULT' // DEFAULT, LAB_DARK, etc.
        };

        // 5. Configuración de Renderizado (Cámara/Viewport)
        this.render = {
            centerVertically: config.render?.centerVertically ?? false, // Para mapas pequeños (1 vent)
            zoomLevel: config.render?.zoomLevel || 1.0,
            showGrid: config.render?.showGrid ?? false
        };

        // 6. Configuración de Logs (Base de Datos)
        this.logging = {
            enabled: config.logging?.enabled ?? false,
            logEveryFrame: config.logging?.logEveryFrame ?? false,
            detailLevel: config.logging?.detailLevel || 'SUMMARY' // SUMMARY, FULL
        };

        // 7. Línea de Tiempo (Eventos Scriptados)
        // Permite "dirigir" la simulación con acciones programadas.
        // Formato: { frame: 100, action: 'NOTIFY', payload: 'Mensaje' }
        this.events = config.events || [];

        // 8. Configuración del Ecosistema (Overrides de Constantes)
        // Permite "tunear" la generación procedural (temperatura, pH, químicos)
        this.ecosystem = {
            // Light
            lightSurface: config.ecosystem?.lightSurface ?? null,
            lightDecay: config.ecosystem?.lightDecay ?? null,

            // Chemistry
            h2Vent: config.ecosystem?.h2Vent ?? null,
            fe2Vent: config.ecosystem?.fe2Vent ?? null,

            // Physics
            tempSurface: config.ecosystem?.tempSurface ?? null,
            tempVent: config.ecosystem?.tempVent ?? null,
            phSurface: config.ecosystem?.phSurface ?? null,
            phVent: config.ecosystem?.phVent ?? null
        };

        // 9. Configuración Física (Gravedad, Viscosidad)
        this.physics = {
            gravity: config.physics?.gravity ?? null, // Global Gravity
            viscosityWater: config.physics?.viscosityWater ?? null,
            viscositySediment: config.physics?.viscositySediment ?? null,
            brownianStrength: config.physics?.brownianStrength ?? null
        };

        // 10. Estado Inicial del Entorno (Legacy/Specific Grids)
        this.initialEnvState = config.initialEnvState || null;
    }
}
