document.addEventListener('DOMContentLoaded', () => {
    // --- GESTION DU BOUTON D'IMPRESSION ---
    const printButton = document.getElementById('print-button');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    // --- GESTION DE L'AUTO-REDIMENSIONNEMENT DES TEXTAREAS ---
    const textareas = document.querySelectorAll('textarea');
    const autoResize = (element) => {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    };
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => autoResize(textarea));
        autoResize(textarea);
    });

    // --- NOUVEAU : GESTION DES ZONES DE SIGNATURE ---
    const signaturePads = document.querySelectorAll('.signature-canvas');

    signaturePads.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // On définit la taille du canvas pour correspondre à sa taille affichée
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const getCoords = (e) => {
            const rect = canvas.getBoundingClientRect();
            // Gère à la fois les événements de la souris et les événements tactiles
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return [clientX - rect.left, clientY - rect.top];
        };
        
        const startDrawing = (e) => {
            e.preventDefault(); // Empêche le défilement sur mobile
            isDrawing = true;
            [lastX, lastY] = getCoords(e);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const [currentX, currentY] = getCoords(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            [lastX, lastY] = [currentX, currentY];
        };

        const stopDrawing = () => {
            isDrawing = false;
        };

        // Événements pour la souris
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing); // Arrête si la souris quitte la zone

        // Événements pour le tactile
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
    });
    
    // Gestion des boutons "Effacer"
    const clearButtons = document.querySelectorAll('.clear-signature-btn');
    clearButtons.forEach(button => {
        button.addEventListener('click', () => {
            const canvasId = button.getAttribute('data-canvas-id');
            const canvasToClear = document.getElementById(canvasId);
            if (canvasToClear) {
                const ctx = canvasToClear.getContext('2d');
                ctx.clearRect(0, 0, canvasToClear.width, canvasToClear.height);
            }
        });
    });
});