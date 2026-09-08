export const calcularHoraFin = (horaInicio , DuracionMinutos) =>{
    const [horas , minutos] = horaInicio.split(":").map(Number)
    const fechaTemp = new Date(2000,0,1,horas,minutos)
    fechaTemp.setMinutes(fechaTemp.getMinutes() + DuracionMinutos)

    return `${String(fechaTemp.getHours()).padStart(2, "0")}:${String(fechaTemp.getMinutes()).padStart(2, "0")}`
}

// Verifica si dos horarios se solapan
export const hayConflictoHorario = (inicio1, fin1, inicio2, fin2) => {
    return inicio1 < fin2 && fin1 > inicio2
}