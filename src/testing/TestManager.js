/**
 * TestManager.js
 * ==============
 * Simple runtime test runner for checking simulation integrity.
 * Usage: window.runTests()
 */
class TestManager {
    static suites = [];

    static register(SuiteClass) {
        this.suites.push(SuiteClass);
        console.log(`[TestManager] Registered suite: ${SuiteClass.name}`);
    }

    static async runAll() {
        console.clear();
        console.log("%c🧪 STARTING SYSTEM DIAGNOSTICS...", "color: violet; font-weight: bold; font-size: 14px;");

        let passed = 0;
        let failed = 0;
        let total = 0;

        for (const Suite of this.suites) {
            console.group(`%c📂 ${Suite.name}`, "color: cyan;");

            // Get all methods starting with 'test'
            const methods = Object.getOwnPropertyNames(Suite)
                .filter(prop => typeof Suite[prop] === 'function' && prop.startsWith('test'));

            for (const testName of methods) {
                total++;
                try {
                    console.log(`Running ${testName}...`);
                    await Suite[testName]();
                    console.log(`%c  ✔️ PASS`, "color: lime");
                    passed++;
                } catch (e) {
                    console.error(`%c  ❌ FAIL: ${e.message}`, "color: red");
                    failed++;
                }
            }
            console.groupEnd();
        }

        console.log(`%c\n🏁 RESULTS: ${passed}/${total} Passed.`, failed > 0 ? "color: red; font-weight: bold;" : "color: lime; font-weight: bold;");

        if (failed === 0) {
            return "SUCCESS";
        } else {
            throw new Error(`${failed} Tests Failed.`);
        }
    }

    // Assertion Helpers
    static assert(condition, message) {
        if (!condition) {
            throw new Error(message || "Assertion failed");
        }
    }

    static assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message || 'Not equal'}: Expected ${expected}, got ${actual}`);
        }
    }
}

// Expose globally
window.TestManager = TestManager;
