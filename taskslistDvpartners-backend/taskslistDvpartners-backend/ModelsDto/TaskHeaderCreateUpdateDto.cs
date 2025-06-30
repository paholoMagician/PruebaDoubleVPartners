using System.ComponentModel.DataAnnotations;

namespace taskslistDvpartners_backend.ModelsDto
{

        public class TaskHeaderCreateUpdateDto
        {
            // El usuario al que se le asigna la tarea
            public int Iduser { get; set; } 
            // Estado de la tarea (ej. 1=Pendiente, 2=En Progreso, 3=Completada)
            public int EstadoTarea { get; set; }
            public string Titutlo { get; set; }
            public string Observacion { get; set; }
            public int? Estado { get; set; }
        }

    }

