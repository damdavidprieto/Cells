/**
 * Biblioteca de Escenarios (ScenarioLibrary)
 * ==========================================
 * Colección de definiciones de escenarios listas para usar.
 */
/**
 * Biblioteca de Escenarios (ScenarioLibrary)
 * ==========================================
 * Colección de definiciones de escenarios listas para usar.
 * Refactorizado para usar Pattern Builder.
 */
class ScenarioLibrary {

    // ------------------------------------------------------------------------
    // ESCENARIO 1: OCÉANO ESTÁNDAR (Juego Principal)
    // ------------------------------------------------------------------------
    static get STANDARD() {
        return new ScenarioBuilder()
            .withId('STANDARD')
            .withName('Océano Primordial')
            .withDescription('El entorno clásico de LUCA. Océano completo con capas y ecosistema abierto.')
            .withWorldDimensions(0, 0, 60)
            .withStratification(0.10, 0.10)
            .withVents([
                { type: 'ALKALINE', x: 20, width: 2, intensity: 1.0 },
                { type: 'BLACK_SMOKER', x: 60, width: 2, intensity: 1.5 },
                { type: 'DIFFUSE', x: 100, width: 1, intensity: 0.8 }
            ])
            .withInitialEnvState({ oxygen: 0, light: 5 }) // Anaerobic bottom
            .withSpawn('RANDOM', 10, 'LUCA')
            .withUI({
                showStatsPanel: true,
                showLegend: true,
                showControls: true
            })
            .withChimneys(true)
            .withLogging(true, 'SUMMARY')
            .build();
    }

    // ------------------------------------------------------------------------
    // ESCENARIO 2: LABORATORIO (Vent Único / Single Cell)
    // ------------------------------------------------------------------------
    static get LAB_SINGLE_VENT() {
        return new ScenarioBuilder()
            .withId('LAB_SINGLE_VENT')
            .withName('Laboratorio: Vent Único')
            .withDescription('Entorno controlado y aislado. Celda única sobre un vent hidrotermal.')
            .withWorldDimensions(15, 0, 60)
            .withStratification(0.0, 0.1)
            .withRestrictedArea(true)
            .withVents([{
                type: 'CENTER',
                subType: 'ALKALINE',
                width: 1,
                context: 'SUBMARINE',
                forceContext: true,
                intensity: 1.5
            }])
            .withInitialEnvState({ oxygen: 0, light: 0 }) // Strict anaerobiosis
            .withSpawn('CENTER_VENT', 1, 'LUCA')
            .withMinimalUI()
            .withRender({
                centerVertically: true,
                zoomLevel: 1.0,
                blackScreen: true
            })
            .withChimneys(false) // Clean view for single cell
            .withLogging(true, 'FULL')
            .addEvent(60, 'NOTIFY', '🔬 Laboratorio Iniciado. Monitorización de LUCA Activa.')
            .build();
    }

    // ------------------------------------------------------------------------
    // ESCENARIO 3: TEST DE ESTRÉS (Eventos Programados)
    // ------------------------------------------------------------------------
    static get STRESS_TEST() {
        return new ScenarioBuilder()
            .withId('STRESS_TEST')
            .withName('QA: Test de Estrés Térmico')
            .withDescription('Ciclo automatizado de calor extremo para probar resiliencia.')
            .withWorldDimensions(15, 0, 60)
            .withStratification(0.0, 0.1)
            .withRestrictedArea(true)
            .withVents([{ type: 'CENTER', subType: 'ALKALINE', width: 2, intensity: 1.0 }])
            .withInitialEnvState({ oxygen: 0, light: 0 })
            .withSpawn('CENTER_VENT', 1, 'LUCA')
            .withMinimalUI()
            .withRender({ blackScreen: true })
            .withChimneys(false)
            .withLogging(true, 'FULL')
            .addEvent(180, 'NOTIFY', '⚠️ PREPARAR PARA IMPULSO TÉRMICO')
            .addEvent(360, 'SET_VENT_PARAM', { intensity: 5.0 })
            .addEvent(720, 'SET_VENT_PARAM', { intensity: 1.0 })
            .build();
    }

    // ------------------------------------------------------------------------
    // ESCENARIOS DE PRESIÓN EVOLUTIVA
    // ------------------------------------------------------------------------
    static get PRESSURE_OXYGEN() {
        return new ScenarioBuilder()
            .withId('PRESSURE_OXYGEN')
            .withName('Presión: Gran Oxidación')
            .withDescription('Océano con niveles crecientes de oxígeno.')
            .withWorldDimensions(0, 0, 60)
            .withVents([{ type: 'ALKALINE', x: 50, width: 2, intensity: 1.0 }])
            .withInitialEnvState({ oxygen: 5.0, progressiveOxygenEnabled: true, maxOxygenEvent: 40.0, oxygenRiseRate: 0.001 })
            .withSpawn('RANDOM', 10, 'LUCA')
            .withUI({ showStatsPanel: true, showLegend: true })
            .withChimneys(true)
            .build();
    }

    static get PRESSURE_LIGHT() {
        return new ScenarioBuilder()
            .withId('PRESSURE_LIGHT')
            .withName('Presión: Radiación UV')
            .withDescription('Atmósfera sin ozono con alta radiación.')
            .withWorldDimensions(0, 0, 60)
            .withVents([{ type: 'ALKALINE', x: 50, width: 2, intensity: 1.0 }])
            .withInitialEnvState({ oxygen: 0, light: 100, uvRadiation: 80 })
            .withSpawn('RANDOM', 10, 'LUCA')
            .withUI({ showStatsPanel: true, showLegend: true })
            .build();
    }

    // ------------------------------------------------------------------------
    // ESCENARIO 6: GRID VACÍO (Minimalista)
    // ------------------------------------------------------------------------
    static get EMPTY_GRID() {
        return new ScenarioBuilder()
            .withId('EMPTY_GRID')
            .withName('Grid Vacío')
            .withDescription('Sin visuales, sin vents. Simulación pura.')
            .withWorldDimensions(0, 0, 50)
            .withSpawn('NONE', 0)
            .withMinimalUI()
            .withRender({ showGrid: true })
            .withLogging(false)
            .build();
    }

    // ------------------------------------------------------------------------
    // ESCENARIO 7: LABORATORIO DE VENTS (Black Screen)
    // ------------------------------------------------------------------------
    static get VENT_LABORATORY() {
        return new ScenarioBuilder()
            .withId('VENT_LABORATORY')
            .withName('Laboratorio de Vents')
            .withDescription('Visualización de la actividad química de los vents.')
            .withWorldDimensions(0, 0, 50)
            .withStratification(0.0, 0.2)
            .withVents([
                { type: 'ALKALINE', x: 30, width: 1, intensity: 1.2 },
                { type: 'BLACK_SMOKER', x: 70, width: 1, intensity: 1.5 }
            ])
            .withInitialEnvState({ oxygen: 0, light: 0 })
            .withSpawn('NONE', 0)
            .withMinimalUI()
            .withRender({ blackScreen: true })
            .withChimneys(false)
            .withLogging(false)
            .build();
    }
}

