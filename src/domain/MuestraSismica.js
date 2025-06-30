class MuestraSismica {
    constructor(fechaMuestra, detalleMuestra) {
        this.fechaMuestra = fechaMuestra;
        this.detalleMuestra = detalleMuestra; // instancia de DetalleMuestraSismica
    }
    getFechaMuestra() {
        return this.fechaMuestra;
    }
    getDetalleMuestra() {
        return this.detalleMuestra;
    }
}
export default MuestraSismica;