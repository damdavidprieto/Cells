/**
 * SimpleTestPanel - Panel de prueba MINIMO
 */
class SimpleTestPanel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {
        push();

        // Fondo rojo brillante para que sea IMPOSIBLE no verlo
        fill(255, 0, 0, 200);
        stroke(255, 255, 0);
        strokeWeight(5);
        rect(this.x, this.y, 300, 200);

        // Texto grande
        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);
        text('PANEL DE PRUEBA', this.x + 150, this.y + 100);

        pop();
    }
}
