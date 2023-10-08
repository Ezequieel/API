const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Declaración de la variable inscripciones
const inscripciones = {};

//Página principal DAW404 TEST
app.get('/', (req, res) => {
  res.send('DAW404 - API TEST');
});

//Obtener la lista completa de carreras y ciclos de la UDB agregados 
app.get('/api/info', (req, res) => {
  const info = {
    carreras: {},
  };

  // Organiza las carreras, ciclos y materias junto con sus valores UV
  for (const carreraNombre in carreras) {
    const carrera = carreras[carreraNombre];
    const ciclosCarrera = ciclos[carreraNombre];

    info.carreras[carreraNombre] = {
      ciclos: {},
      materias: {},
    };

    for (const cicloNombre in ciclosCarrera) {
      const materiasCiclo = ciclosCarrera[cicloNombre];

      info.carreras[carreraNombre].ciclos[cicloNombre] = {
        materias: materiasCiclo.map(codigoMateria => ({
          codigo: codigoMateria,
          nombre: carrera[codigoMateria].nombre,
          uv: carrera[codigoMateria].uv,
        })),
      };
    }

    for (const codigoMateria in carrera) {
      const materia = carrera[codigoMateria];

      info.carreras[carreraNombre].materias[codigoMateria] = {
        nombre: materia.nombre,
        uv: materia.uv,
      };
    }
  }

  res.json(info);
});



const carreras = {
    'Tecnico en Ingenieria en Computacion': {
      'ALG501': { nombre: 'Álgebra Vectorial y Matrices', uv: 4, prerrequisitos: ['Bachillerato'] },
      'PSC231': { nombre: 'Pensamiento Social Cristiano', uv: 4, prerrequisitos: ['Bachillerato'] },
      'PAL404': { nombre: 'Programación de Algoritmos', uv: 4, prerrequisitos: ['Bachillerato'] },
      'LME404': { nombre: 'Lenguajes de Marcado y Estilo Web', uv: 4, prerrequisitos: ['Bachillerato'] },
      'REC404': { nombre: 'Redes de Comunicación', uv: 4, prerrequisitos: ['Bachillerato'] },
      'ASB404': { nombre: 'Análisis y Diseño de Sistemas y Base de Datos', uv: 4, prerrequisitos: ['PAL404'] },
      'DAW404': { nombre: 'Desarrollo de Aplic. Web con Soft. Interpret. en el Cliente', uv: 4, prerrequisitos: ['LME404'] },
      'DSP404': { nombre: 'Desarrollo de Aplicaciones con Software Propietario', uv: 4, prerrequisitos: ['PAL404'] },
      'POO404': { nombre: 'Programación Orientada a Objetos', uv: 4, prerrequisitos: ['PAL404'] },
      'ASN441': { nombre: 'Administración de Servicios en la Nube', uv: 4, prerrequisitos: ['REC404'] },
    },
    'Ingenieria en Computacion': {
      'CAD501': { nombre: 'Cálculo Diferencial', uv: 4, prerrequisitos: ['Bachillerato'] },
      'QUG501': { nombre: 'Química General', uv: 4, prerrequisitos: ['Bachillerato'] },
      'ANF231': { nombre: 'Antropología Filosófica', uv: 3, prerrequisitos: ['Bachillerato'] },
      'PRE104': { nombre: 'Programación Estructurada', uv: 4, prerrequisitos: ['Bachillerato'] },
      'ALG501': { nombre: 'Álgebra Vectorial y Matrices ', uv: 4, prerrequisitos: ['Bachillerato'] },
      'CAI501': { nombre: 'Cálculo Integral ', uv: 4, prerrequisitos: ['CAD501'] },
      'MDB104': { nombre: 'Modelamiento y Diseño de Base de Datos', uv: 4, prerrequisitos: ['PRE104'] },
      'POO104': { nombre: 'Programación Orientada a Objetos ', uv: 4, prerrequisitos: ['PRE104'] },
      'CVV501': { nombre: 'Cálculo de Varias Variables', uv: 4, prerrequisitos: ['CAI501'] },
      'CDP501': { nombre: 'Cinemática y Dinámica de Partículas', uv: 4, prerrequisitos: ['CAD501'] },
    }
  };
  
  app.get('/api/prerrequisitos/:carrera/:codigoMateria', (req, res) => {
    const carrera = req.params.carrera;
    const codigoMateria = req.params.codigoMateria;
  
    const materiasCarrera = carreras[carrera];
    if (!materiasCarrera) {
      res.status(404).json({ mensaje: 'La Carrera no fue encontrada' });
    } else {
      const materia = materiasCarrera[codigoMateria];
      if (!materia) {
        res.status(404).json({ mensaje: 'La Materia no fue encontrada' });
      } else {
        res.json({ prerrequisitos: materia.prerrequisitos });
      }
    }
  });

  const ciclos = {
    'Tecnico en Ingenieria en Computacion': {
      'Ciclo1': ['ALG501', 'PSC231', 'PAL404', 'LME404', 'REC404'],
      'Ciclo2': [ 'ASB404', 'DAW404', 'DSP404', 'POO404', 'ASN441'],
    },
    'Ingenieria en Computacion': {
      'Ciclo1': ['CAD501', 'QUG501', 'ANF231', 'PRE104', 'ALG501'],
      'Ciclo2': ['CAI501',  'MDB104', 'POO104','CVV501', 'CDP501'],
    }
  };
  
  app.get('/api/materias/:carrera/:ciclo', (req, res) => {
    const carrera = req.params.carrera;
    const ciclo = req.params.ciclo;
  
    const materiasCarrera = carreras[carrera];
    const ciclosCarrera = ciclos[carrera];
    
    if (!materiasCarrera || !ciclosCarrera || !ciclosCarrera[ciclo]) {
      res.status(404).json({ mensaje: 'Carrera o ciclo no encontrados' });
    } else {
      const materiasDelCiclo = ciclosCarrera[ciclo].map(codigo => materiasCarrera[codigo]);
      res.json({ materias: materiasDelCiclo });
    }
  });

  app.post('/api/inscripcion', (req, res) => {
  const { usuario, carrera, materias } = req.body;
  
  const materiasCarrera = carreras[carrera];
  if (!materiasCarrera) {
    res.status(404).json({ mensaje: 'Carrera no encontrada' });
    return;
  }

  const totalUV = materias.reduce((total, codigoMateria) => {
    const materia = materiasCarrera[codigoMateria];
    return total + materia.uv;
  }, 0);

  if (totalUV < 20) {
    res.status(400).json({ mensaje: 'No cumple con la cantidad de UV requeridas' });
  } else {
    // Generar un ID único para la inscripción
    const inscripcionId = Date.now().toString();
    
    // Almacenar la inscripción con el ID
    inscripciones[inscripcionId] = { usuario, carrera, materias };
    
    res.json({ mensaje: 'Inscripción exitosa', inscripcionId });
  }
});

//Mostrar las inscripciones por id
app.get('/api/inscripcion/:id', (req, res) => {
  const inscripcionId = req.params.id;

  // Buscar la inscripción por ID en el registro de inscripciones
  const inscripcion = inscripciones[inscripcionId];

  if (!inscripcion) {
    res.status(404).json({ mensaje: 'Inscripción no encontrada' });
  } else {
    res.json(inscripcion);
  }
});

// Ruta para inscripción
app.post('/api/inscripcion', (req, res) => {
  const { usuario, carrera, materias } = req.body;
  
  const materiasCarrera = carreras[carrera];
  if (!materiasCarrera) {
    res.status(404).json({ mensaje: 'Carrera no encontrada' });
    return;
  }

  const totalUV = materias.reduce((total, codigoMateria) => {
    const materia = materiasCarrera[codigoMateria];
    return total + materia.uv;
  }, 0);

  if (totalUV < 20) {
    res.status(400).json({ mensaje: 'No cumple con la cantidad de UV requeridas' });
  } else {
    // Generar un ID único para la inscripción
    const inscripcionId = Date.now().toString();
    
    // Almacenar la inscripción con el ID en el objeto de inscripciones
    inscripciones[inscripcionId] = { usuario, carrera, materias };
    
    res.json({ mensaje: 'Inscripción exitosa', inscripcionId });
  }
});


//Mostrar las incripciones hechas 
  app.get('/api/inscripciones', (req, res) => {
    res.json({ inscripciones });
  });

//Eliminar la inscripcion hecha 
app.delete('/api/inscripcion/:id', (req, res) => {
  const inscripcionId = req.params.id;

  // Verificar si la inscripción existe
  if (!inscripciones[inscripcionId]) {
    res.status(404).json({ mensaje: 'Inscripción no encontrada' });
  } else {
    // Eliminar la inscripción
    delete inscripciones[inscripcionId];
    res.json({ mensaje: 'Inscripción eliminada con éxito' });
  }
});

  

// Definir las rutas y lógica de la API aquí

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

  
  
  