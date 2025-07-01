using System.ComponentModel.DataAnnotations;

namespace taskslistDvpartners_backend.ModelsDto
{
    public class TasksBodyCreateUpdateDto
    {

        public string Descripcion { get; set; }


        public string Urlimagen { get; set; }

        
        public int IdTasksHeader { get; set; }

        
        public string Color { get; set; }

        
        public int? Estado { get; set; }

        public DateTime FechaInicioTarea { get; set; }

        public DateTime? FechaFinTarea { get; set; }


        public string Observacion { get; set; }
    }
}
