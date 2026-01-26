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
    }
}
