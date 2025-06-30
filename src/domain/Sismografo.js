class Sismografo {
    constructor(estacion) {
        this.estacion = estacion; // instancia de EstacionSismografica
    }
    esSismografo() {
        // Ahora retorna el nombre de la estación asociada
        return this.estacion ? this.estacion.getNombre() : null;
    }
    getEstacion() {
        return this.estacion;
    }
}
export default Sismografo;