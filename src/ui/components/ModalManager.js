/**
 * ModalManager.js
 * ==============
 * Replaces standard window.alert() with premium custom modals.
 * Features: Glassmorphism, animations, and non-blocking API.
 */
class ModalManager {
    constructor() {
        this.overlay = null;
        this.container = null;
        this._init();
    }

    _init() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';

        // Create container
        this.container = document.createElement('div');
        this.container.className = 'modal-container';

        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        // Close on overlay click (if no specific actions required)
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.hide();
        });
    }

    /**
     * Show a beautiful modal
     * @param {Object} options - { title, message, type: 'info'|'error', onConfirm }
     */
    show(options = {}) {
        const {
            title = 'Notificación',
            message = '',
            type = 'info',
            confirmText = 'Entendido',
            onConfirm = null
        } = options;

        // Clear container
        this.container.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
            </div>
            <div class="modal-body">
                ${message.replace(/\n/g, '<br>')}
            </div>
            <div class="modal-footer">
                <button class="modal-btn ${type === 'error' ? 'modal-btn-error' : 'modal-btn-confirm'}">${confirmText}</button>
            </div>
        `;

        // Add event listener to button
        const btn = this.container.querySelector('.modal-btn');
        btn.onclick = () => {
            this.hide();
            if (onConfirm) onConfirm();
        };

        // Show with animation
        this.overlay.style.display = 'flex';
        // Force reflow
        this.overlay.offsetHeight;
        this.overlay.classList.add('active');
    }

    hide() {
        this.overlay.classList.remove('active');
        setTimeout(() => {
            if (!this.overlay.classList.contains('active')) {
                this.overlay.style.display = 'none';
            }
        }, 300);
    }

    // Sugar for easy replacement
    showError(title, message) {
        this.show({ title, message, type: 'error', confirmText: 'Cerrar' });
    }

    showInfo(title, message) {
        this.show({ title, message, type: 'info' });
    }
}

// Global accessor
window.modalManager = new ModalManager();
