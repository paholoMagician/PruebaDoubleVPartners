// File: taskslistDvpartners_backend/Services/ITaskHead/ITaskHeaderService.cs

using taskslistDvpartners_backend.Models;
using taskslistDvpartners_backend.ModelsDto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace taskslistDvpartners_backend.Services.ITaskHead
{
    public interface ITaskHeaderService
    {
        Task<IEnumerable<TaskHeaderResponseDto>> GetAllTaskHeadersAsync(int estado, int iduserconnected, string role);
        Task<TasksHeader> GetTaskHeaderByIdAsync(int id);
        Task<TasksHeader> CreateTaskHeaderAsync(TaskHeaderCreateUpdateDto taskHeaderDto, int? userCreaId);
        Task<TasksHeader> UpdateTaskHeaderAsync(int id, TaskHeaderCreateUpdateDto taskHeaderDto);
        Task<TasksHeader> SoftDeleteTaskHeaderAsync(int id);
        Task<bool> UserExistsAsync(int userId); // Si esta en la interfaz
    }
}