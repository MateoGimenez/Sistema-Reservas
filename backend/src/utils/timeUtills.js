export const normalizarHora = (hora) => {
    if (!hora && hora !== 0) return hora

    const partes = String(hora).split(":")
    const horas = String(Number(partes[0] || 0)).padStart(2, "0")
    const minutos = String(Number(partes[1] || 0)).padStart(2, "0")
    const segundos = String(Number(partes[2] || 0)).padStart(2, "0")

    return `${horas}:${minutos}:${segundos}`
}

export const calcularHoraFin = (horaInicio, duracionMinutos) => {
    const [horas, minutos, segundos] = normalizarHora(horaInicio).split(":").map(Number)
    const fechaTemp = new Date(2000, 0, 1, horas, minutos, segundos)
    fechaTemp.setMinutes(fechaTemp.getMinutes() + duracionMinutos)

    return normalizarHora(
        `${fechaTemp.getHours()}:${fechaTemp.getMinutes()}:${fechaTemp.getSeconds()}`
    )
}

export const hayConflictoHorario = (inicio1, fin1, inicio2, fin2) => {
    const aInicio = normalizarHora(inicio1)
    const aFin = normalizarHora(fin1)
    const bInicio = normalizarHora(inicio2)
    const bFin = normalizarHora(fin2)

    return aInicio < bFin && aFin > bInicio
}

export const estaDentroDelHorario = (horaInicio, horaFin, franjaInicio, franjaFin) => {
    const inicio = normalizarHora(horaInicio)
    const fin = normalizarHora(horaFin)
    const desde = normalizarHora(franjaInicio)
    const hasta = normalizarHora(franjaFin)

    return inicio >= desde && fin <= hasta
}

/** `horarios.dia_semana`: 1 = lunes ... 7 = domingo (ISO). */
export const diaSemanaDesdeFecha = (fecha) => {
    const [anio, mes, dia] = String(fecha).split("-").map(Number)
    const date = new Date(anio, mes - 1, dia)
    const jsDay = date.getDay()

    return jsDay === 0 ? 7 : jsDay
}

export const fechaEsPasada = (fecha) => {
    const [anio, mes, dia] = String(fecha).split("-").map(Number)
    const fechaReserva = new Date(anio, mes - 1, dia)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    return fechaReserva < hoy
}
