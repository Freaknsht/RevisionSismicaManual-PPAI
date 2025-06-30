class SerieTemporal {
    constructor(muestras) {
        this.muestras = muestras; // array de MuestraSismica
    }
    getMuestras() {
        return this.muestras;
    }
}
export default SerieTemporal;