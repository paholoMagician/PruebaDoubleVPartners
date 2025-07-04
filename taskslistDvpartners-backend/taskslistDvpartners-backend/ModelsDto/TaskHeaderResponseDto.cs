// File: ModelsDto/TaskHeaderResponseDto.cs
namespace taskslistDvpartners_backend.ModelsDto
{
    public class TaskHeaderResponseDto
    {
        public int Id { get; set; }
        public string Titutlo { get; set; }
        public string Observacion { get; set; }
        public DateTime? Fecrea { get; set; }
        public DateTime FechaFinal { get; set; }
        public int? Estado { get; set; }
        public int? EstadoTarea { get; set; }

        public int? Iduser { get; set; }
        public string NombreAsignado { get; set; }

        public int? Usercrea { get; set; }
        public string NombreCreador { get; set; }
    }
}
