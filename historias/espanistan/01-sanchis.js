// Españistán · Episodio 1: Sanchís. Guion completo con fuentes en 01-sanchis.md (datos a 25-10-2026).
// Cada plano: una frase del narrador (voz en HISTORIA.voces/NN.mp3), su dibujo de fondo, la cámara (de → a: [x, y, zoom])
// y los rótulos. 'en' y 'hasta' pueden ser '@palabra' (cuando el narrador la dice) o segundos.
window.HISTORIA = (() => {
  const D = 'historias/espanistan/img/', dato = (en, valor, texto, fuente, o = {}) => ({ en, tipo: 'dato', valor, texto, fuente, ...o });
  const cita = (en, texto, autor, o = {}) => ({ en, tipo: 'cita', texto, autor, y: .2, ...o }), titulo = (texto, o = {}) => ({ en: 0, tipo: 'titulo', texto, y: .14, hasta: 3, ...o });
  const P = (fondo, texto, o = {}) => ({ fondo, texto, ...o });
  const ACERCA = { de: [.5, .5, 1], a: [.5, .45, 1.12] }, IZQ = { de: [.45, .5, 1.1], a: [.55, .5, 1.1] }, LEJOS = { de: [.5, .5, 1.15], a: [.5, .5, 1] };
  return {
    id: 'espanistan-01-sanchis',
    titulo: 'Españistán · Episodio 1: Sanchís',
    descripcion: 'Un país inventado, datos públicos y un consejo: piensa antes de votar.',
    voces: 'audio/voz/es/espanistan-01',
    subtitulos: true,
    imagenes: { cueva: D + 'cueva.webp', portada: D + 'portada.webp', despacho: D + 'despacho.webp', coche: D + 'coche.webp', mochila: D + 'mochila.webp',
      llave: D + 'llave.webp', hucha: D + 'hucha.webp', congreso: D + 'congreso.webp', laboratorio: D + 'laboratorio.webp', balanza: D + 'balanza.webp', urna: D + 'urna.webp' },
    planos: [
      // 0. Frío
      P('cueva', 'Hace dos mil cuatrocientos años, Platón contó la historia de unos prisioneros encadenados en una cueva. Solo veían sombras en la pared, y creían que eso era el mundo.', { cam: ACERCA }),
      P('cueva', 'Hoy, las sombras se llaman titulares. Este vídeo va de salir de la cueva: vamos a mirar los números, no las sombras.', { cam: LEJOS }),
      P('portada', 'Bienvenidos a Españistán, un país inventado. Cualquier parecido con la realidad… es culpa de la realidad.', { cam: ACERCA,
        rotulos: [{ en: '@inventado', tipo: 'aviso', texto: 'Datos públicos · Aquí no te decimos a quién votar', y: .08 }] }),
      // 1. El presidente
      P('despacho', 'Españistán lo gobierna Sanchís. El cinco de octubre convocó elecciones para el veintinueve de noviembre, después de que el Congreso le tumbara dos decretos de vivienda.', { cam: IZQ,
        rotulos: [dato('@veintinueve', '29-N', 'Elecciones generales', 'BOE, Real Decreto 806/2026', { x: .78, y: .32, color: '#1f4e8c' })] }),
      P('despacho', 'Aristóteles decía que el ser humano es un animal político. Si es así, toca hacer de animal político con la cabeza.', { cam: ACERCA,
        rotulos: [cita('@Aristóteles', 'El ser humano es, por naturaleza, un animal político.', 'Aristóteles, «Política»')] }),
      P('despacho', 'Una sola pregunta guía este vídeo: ¿qué ha pasado de verdad en estos años? No lo que dicen sus fans, ni sus enemigos. Lo que dicen los datos.', { cam: LEJOS }),
      // 2. La economía
      P('coche', 'Empecemos por lo bueno, que también lo hay. La economía de Españistán creció un dos coma seis por ciento en dos mil veinticinco, más que la mayoría de sus vecinos europeos.', { cam: IZQ,
        rotulos: [titulo('1. LA ECONOMÍA'), dato('@creció', '+2,6 %', 'Crecimiento del PIB en 2025', 'INE', { x: .76, y: .4, color: '#1e8449' })] }),
      P('coche', 'El paro bajó al nueve coma ochenta y siete por ciento. Y el salario mínimo es hoy de mil doscientos veintiún euros: en dos mil dieciocho era de setecientos treinta y seis. Un sesenta y seis por ciento más.', { cam: ACERCA,
        rotulos: [dato('@paro', '9,87 %', 'Paro, segundo trimestre de 2026', 'INE, EPA', { x: .25, y: .38, hasta: '@salario' }),
          { en: '@salario', tipo: 'barras', titulo: 'Salario mínimo (€/mes, 14 pagas)', fuente: 'BOE', datos: [['2018', 736], ['2026', 1221]], colores: ['#7f8c8d', '#1e8449'], x: .72, y: .62 }] }),
      P('coche', 'Ahora, la letra pequeña. Ese paro sigue siendo de los más altos de Europa. Y entre los menores de veinticinco años, uno de cada cuatro no encuentra trabajo.', { cam: LEJOS,
        rotulos: [dato('@uno de cada cuatro', '1 de cada 4', 'Jóvenes menores de 25 años en paro', 'Eurostat, INE', { x: .5, y: .35, color: '#c0392b' })] }),
      P('mochila', 'Y la deuda pública: un billón setecientos sesenta y tres mil millones de euros.', { cam: ACERCA,
        rotulos: [dato('@billón', '1,763 billones €', 'Deuda pública, junio de 2026', 'Banco de España', { x: .5, y: .3, color: '#c0392b' })] }),
      P('mochila', 'Aquí va la lección de matemáticas del día. El Gobierno dirá: la deuda baja, ya es solo el ciento uno por ciento del PIB. La oposición dirá: la deuda no para de subir. Y los dos dicen la verdad.', { cam: IZQ,
        rotulos: [dato('@Gobierno', '101,4 % del PIB', '«La deuda baja» (en porcentaje)', 'Banco de España', { x: .27, y: .35, color: '#1e8449' }),
          dato('@oposición', '+4,3 % en un año', '«La deuda sube» (en euros)', 'Banco de España', { x: .73, y: .35, color: '#c0392b' })] }),
      P('mochila', 'La deuda en euros sube cada año, pero la economía crece más rápido, y el porcentaje baja. Como un niño que crece más deprisa de lo que pesa su mochila. La pregunta buena no es quién tiene razón. Es: ¿quién pagará esa mochila?', { cam: ACERCA }),
      // 3. La vivienda
      P('llave', 'En Españistán, un joven cobra de media mil ciento noventa y un euros al mes. Y un alquiler medio cuesta mil ciento setenta y seis. Haz la cuenta: el noventa y ocho coma siete por ciento del sueldo.', { cam: IZQ,
        rotulos: [titulo('2. LA VIVIENDA'), dato('@Haz la cuenta', '98,7 %', 'Del sueldo de un joven se iría en el alquiler medio', 'Consejo de la Juventud de España, 2025', { x: .72, y: .4, color: '#c0392b' })] }),
      P('llave', 'Por eso solo el catorce coma cinco por ciento de los jóvenes vive fuera de casa de sus padres: el peor dato desde que hay registros. La edad media para irse de casa: treinta años. En Europa, veintiséis.', { cam: ACERCA,
        rotulos: [{ en: '@edad media', tipo: 'barras', titulo: 'Edad media para irse de casa', fuente: 'CJE, Eurostat', datos: [['Españistán', 30.2], ['Media UE', 26.3]], colores: ['#c0392b', '#2c6fb7'], fmt: v => String(v).replace('.', ','), x: .72, y: .62 }] }),
      P('llave', 'Sanchís ha prometido muchas veces miles de viviendas públicas. Precisamente dos decretos de vivienda acabaron con la legislatura. La pregunta del profesor: ¿cuántas de las prometidas tienen hoy a alguien viviendo dentro? Búscalo antes de votar.', { cam: LEJOS }),
      // 4. Impuestos
      P('hucha', 'En dos mil veinticinco, Hacienda recaudó trescientos veinticinco mil millones de euros: récord histórico, un diez por ciento más que el año anterior.', { cam: ACERCA,
        rotulos: [titulo('3. LOS IMPUESTOS'), dato('@récord', '325.356 M€', 'Recaudación tributaria 2025 (+10,4 %), récord', 'Agencia Tributaria', { x: .74, y: .42, color: '#1f4e8c' })] }),
      P('hucha', 'Una parte es porque la economía y los sueldos crecen. Otra, porque los tramos del IRPF no se ajustan del todo a la inflación: te suben el sueldo para compensar los precios, y pagas más porcentaje sin ser más rico.', { cam: IZQ }),
      P('hucha', 'Recaudar más no es bueno ni malo. Depende de lo que te devuelven: sanidad, vivienda, pensiones. Con eso hay que comparar.', { cam: LEJOS }),
      // 5. Cómo se gobierna
      P('congreso', 'Montesquieu escribió que, para que no se pueda abusar del poder, el poder tiene que frenar al poder. Para eso existe un Parlamento.', { cam: ACERCA,
        rotulos: [titulo('4. CÓMO SE GOBIERNA'), cita('@Montesquieu', 'Para que no se pueda abusar del poder, es preciso que el poder frene al poder.', 'Montesquieu, «Del espíritu de las leyes»', { en: '@frenar', y: .24 })] }),
      P('congreso', 'Tres datos. Uno: Españistán funciona con los presupuestos de dos mil veintitrés, prorrogados por tercer año seguido.', { cam: IZQ,
        rotulos: [dato('@presupuestos', '2023', 'Últimos presupuestos aprobados: prorrogados en 2024, 2025 y 2026', 'Ministerio de Hacienda', { x: .72, y: .4 })] }),
      P('congreso', 'Dos: Sanchís es el primer presidente que cierra sus mandatos con más decretos ley que leyes tramitadas en el Parlamento. Y la Constitución reserva el decreto ley para casos de extraordinaria y urgente necesidad.', { cam: ACERCA,
        rotulos: [{ en: '@decretos', tipo: 'barras', titulo: 'Decretos-ley frente a leyes (todos sus mandatos)', fuente: 'Recuento de El Español, 25-10-2026', datos: [['Decretos-ley', 196], ['Leyes', 158]], colores: ['#c0392b', '#2c6fb7'], x: .7, y: .62 }] }),
      P('congreso', 'Tres: para ser investido, pactó una ley de amnistía con los partidos cuyos votos necesitaba. El Tribunal Constitucional la avaló: es legal. Pero que sea legal no contesta a la otra pregunta: ¿la habría hecho sin necesitar esos votos?', { cam: LEJOS }),
      // 6. El entorno
      P('laboratorio', 'El poeta romano Juvenal hizo una pregunta que tiene dos mil años: ¿quién vigila a los vigilantes? Vamos a mirar a la gente más cercana a Sanchís.', { cam: ACERCA,
        rotulos: [titulo('5. COSAS QUE HUELEN RARO'), cita('@Juvenal', '¿Quién vigilará a los propios vigilantes?', 'Juvenal, «Sátiras»', { en: '@pregunta', y: .26 })] }),
      P('laboratorio', 'Una regla antes de empezar: en un Estado de derecho, nadie es culpable hasta que lo dice una sentencia. Por eso cada frasco lleva su etiqueta exacta.', { cam: LEJOS,
        rotulos: [{ en: '@regla', tipo: 'aviso', texto: 'Presunción de inocencia', y: .1 }] }),
      P('laboratorio', 'Su ministro de confianza y su asesor: el Tribunal Supremo los condenó en junio de dos mil veintiséis a veinticuatro y diecinueve años de prisión, por organización criminal, cohecho, malversación y tráfico de influencias.', { cam: IZQ,
        rotulos: [{ en: '@condenó', tipo: 'frasco', quien: 'El ministro y su asesor', estado: 'CONDENADOS · Tribunal Supremo', x: .3, y: .74 }] }),
      P('laboratorio', 'El número tres de su partido pasó meses en prisión provisional. Hoy está en libertad e investigado en la Audiencia Nacional, y niega cualquier delito.', { cam: IZQ,
        rotulos: [{ en: '@número tres', tipo: 'frasco', quien: 'El número tres', estado: 'INVESTIGADO · Audiencia Nacional', x: .5, y: .74 }] }),
      P('laboratorio', 'Su fiscal general: condenado por el Supremo a dos años de inhabilitación por revelar secretos. Dimitió, y ha recurrido al Constitucional.', { cam: IZQ,
        rotulos: [{ en: '@fiscal', tipo: 'frasco', quien: 'El fiscal general', estado: 'CONDENADO · recurso en el Constitucional', x: .7, y: .74 }] }),
      P('laboratorio', 'Su hermano: condenado por la Audiencia de Badajoz a nueve años de inhabilitación por prevaricación en su contratación. Absuelto de tráfico de influencias. Puede recurrir.', { cam: ACERCA,
        rotulos: [{ en: '@hermano', tipo: 'frasco', quien: 'Su hermano', estado: 'CONDENADO en primera instancia · puede recurrir', x: .35, y: .74 }] }),
      P('laboratorio', 'Su mujer: un juez la ha enviado a juicio con jurado por tráfico de influencias y malversación. La Fiscalía pide que la absuelvan.', { cam: ACERCA,
        rotulos: [{ en: '@mujer', tipo: 'frasco', quien: 'Su mujer', estado: 'A JUICIO · presunta inocente · la Fiscalía pide absolución', x: .65, y: .74 }] }),
      P('laboratorio', 'Ninguno de estos frascos es Sanchís, y en estos casos no se le acusa de nada. Pero Lord Acton dejó escrito que el poder tiende a corromper. La pregunta no es si él es culpable. Es otra: ¿cuántos frascos aguanta una estantería antes de preguntarse quién eligió a esa gente?', { cam: LEJOS,
        rotulos: [cita('@Acton', 'El poder tiende a corromper.', 'Lord Acton', { en: '@Acton', hasta: '@pregunta' })] }),
      // 7. Conclusión
      P('balanza', 'Hagamos balance, como en clase, con los dos platos de la balanza. En uno: una economía que crece, menos paro, un salario mínimo un sesenta y seis por ciento más alto, y recaudación récord.', { cam: IZQ,
        rotulos: [titulo('6. LA BALANZA')] }),
      P('balanza', 'En el otro: jóvenes que no pueden irse de casa, una deuda que crece en euros, gobernar a golpe de decreto y sin presupuestos, y un entorno con más juzgados que nunca. Cuál pesa más… no te lo vamos a decir. Eso lo decides tú.', { cam: LEJOS }),
      // 8. El consejo
      P('urna', 'Sócrates decía que una vida sin examen no merece ser vivida. Un voto sin examen, tampoco. Antes del veintinueve de noviembre, hazte tres preguntas, con este partido y con todos.', { cam: ACERCA,
        rotulos: [cita('@Sócrates', 'Una vida sin examen no merece ser vivida.', 'Sócrates, en la «Apología» de Platón', { hasta: '@tres preguntas' })] }),
      P('urna', 'Una: ¿qué prometieron la última vez, y qué cumplieron? Dos: los números que me enseñan, ¿son euros o porcentajes? Tres: ¿me fío de la gente de la que se rodean?', { cam: IZQ,
        rotulos: [{ en: '@Una', tipo: 'aviso', texto: '1. ¿Qué prometieron y qué cumplieron?', y: .3, hasta: '@Dos' }, { en: '@Dos', tipo: 'aviso', texto: '2. ¿Euros o porcentajes?', y: .3, hasta: '@Tres' }, { en: '@Tres', tipo: 'aviso', texto: '3. ¿Me fío de su gente?', y: .3 }] }),
      P('urna', 'Kant lo resumió en dos palabras: sapere aude. Atrévete a pensar por ti mismo. Aquí no te decimos a quién votar. Te decimos que votes, y que votes pensando.', { cam: ACERCA,
        rotulos: [cita('@Kant', 'Sapere aude: atrévete a pensar por ti mismo.', 'Kant, «¿Qué es la Ilustración?»', { hasta: '@Aquí' })] }),
      P('portada', 'En el próximo episodio de Españistán: el líder de la oposición. Mismas reglas. Mismas preguntas.', { cam: LEJOS, dur: 6,
        rotulos: [{ en: '@próximo', tipo: 'aviso', texto: 'Fuentes de todos los datos en la descripción', y: .08 }] }),
    ],
  };
})();
