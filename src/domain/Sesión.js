
const obtenerUsuarioLogueado = ()=>{
    return localStorage.getItem('usuarioLogueado') || null;
}