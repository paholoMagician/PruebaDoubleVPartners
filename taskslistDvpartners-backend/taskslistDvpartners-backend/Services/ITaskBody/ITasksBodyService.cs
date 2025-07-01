
using taskslistDvpartners_backend.Models;
using taskslistDvpartners_backend.ModelsDto;

namespace taskslistDvpartners_backend.Services 
{
    public interface ITasksBodyService
    {
        Task<IEnumerable<TasksBody>> GetAllTasksBodyByHeaderIdAsync(int tasksHeaderId, int estado);
        Task<TasksBody> GetTasksBodyByIdAsync(int id);
        Task<TasksBody> CreateTasksBodyAsync(TasksBodyCreateUpdateDto tasksBodyDto);
        Task<TasksBody> UpdateTasksBodyAsync(int id, TasksBodyCreateUpdateDto tasksBodyDto);
        Task<TasksBody> SoftDeleteTasksBodyAsync(int id);
        Task<bool> TasksHeaderExistsAsync(int tasksHeaderId);
    }
}