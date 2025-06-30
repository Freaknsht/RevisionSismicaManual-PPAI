class DetalleMuestraSismica {
    constructor(velocidadOnda, frecuenciaOnda, longitud) {
        this.velocidadOnda = velocidadOnda;
        this.frecuenciaOnda = frecuenciaOnda;
        this.longitud = longitud;
    }
    getVelocidadOnda() {
        return this.velocidadOnda;
    }
    getFrecuenciaOnda() {
        return this.frecuenciaOnda;
    }
    getLongitud() {
        return this.longitud;
    }
}
export default DetalleMuestraSismica;