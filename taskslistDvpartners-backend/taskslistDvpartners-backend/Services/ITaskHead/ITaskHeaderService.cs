using taskslistDvpartners_backend.Models;
using taskslistDvpartners_backend.ModelsDto;

namespace taskslistDvpartners_backend.Services.ITaskHead
{
    public interface ITaskHeaderService
    {
        // Obtener todos los TaskHeaders por estado (activo/inactivo)
        Task<IEnumerable<TasksHeader>> GetAllTaskHeadersAsync(int estado);

        // Obtener un TaskHeader por ID
        Task<TasksHeader> GetTaskHeaderByIdAsync(int id);

        // Crear un nuevo TaskHeader
        Task<TasksHeader> CreateTaskHeaderAsync(TaskHeaderCreateUpdateDto taskHeaderDto, int? userCreaId);

        // Actualizar un TaskHeader existente
        Task<TasksHeader> UpdateTaskHeaderAsync(int id, TaskHeaderCreateUpdateDto taskHeaderDto);

        // Eliminar lógicamente un TaskHeader (cambiar estado a 0)
        Task<TasksHeader> SoftDeleteTaskHeaderAsync(int id);

        // Validar si un usuario existe (para asignar tareas a usuarios existentes)
        Task<bool> UserExistsAsync(int userId);
    }
}
