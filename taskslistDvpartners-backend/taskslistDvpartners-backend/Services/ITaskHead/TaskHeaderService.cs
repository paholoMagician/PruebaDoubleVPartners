using Microsoft.EntityFrameworkCore;
using taskslistDvpartners_backend.Models;
using taskslistDvpartners_backend.ModelsDto;

namespace taskslistDvpartners_backend.Services.ITaskHead
{
    public class TaskHeaderService : ITaskHeaderService
    {
        private readonly taskslistDvpartnersContext _context;

        public TaskHeaderService(taskslistDvpartnersContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TasksHeader>> GetAllTaskHeadersAsync(int estado)
        {
            return await _context.TasksHeader
                                 .Where(th => th.Estado == estado)
                                 .ToListAsync();
        }

        public async Task<TasksHeader> GetTaskHeaderByIdAsync(int id)
        {
            return await _context.TasksHeader.FindAsync(id);
        }

        public async Task<TasksHeader> CreateTaskHeaderAsync(TaskHeaderCreateUpdateDto taskHeaderDto, int? userCreaId)
        {
            // Validar que el Iduser exista
            if (!await UserExistsAsync(taskHeaderDto.Iduser))
            {
                throw new InvalidOperationException($"El usuario con ID '{taskHeaderDto.Iduser}' no existe.");
            }

            var newHeader = new TasksHeader
            {
                Iduser = taskHeaderDto.Iduser,
                // Por defecto activo (1) si no se especifica
                Estado = taskHeaderDto.Estado ?? 1, 
                EstadoTarea = taskHeaderDto.EstadoTarea,
                Titutlo = taskHeaderDto.Titutlo,
                Observacion = taskHeaderDto.Observacion,
                Fecrea = DateTime.UtcNow,
                Usercrea = userCreaId
            };

            _context.TasksHeader.Add(newHeader);
            await _context.SaveChangesAsync();
            return newHeader;
        }

        public async Task<TasksHeader> UpdateTaskHeaderAsync(int id, TaskHeaderCreateUpdateDto taskHeaderDto)
        {
            var existingHeader = await _context.TasksHeader.FindAsync(id);
            if (existingHeader == null)
            {
                // O puedes lanzar una excepción NotFoundException personalizada
                return null; 
            }

            // Validar que el Iduser exista si se intenta cambiar
            if (existingHeader.Iduser != taskHeaderDto.Iduser && !await UserExistsAsync(taskHeaderDto.Iduser))
            {
                throw new InvalidOperationException($"El nuevo usuario con ID '{taskHeaderDto.Iduser}' no existe.");
            }

            existingHeader.Iduser = taskHeaderDto.Iduser;
            // Permitir actualizar el estado del header (activo/inactivo)
            existingHeader.Estado = taskHeaderDto.Estado; 
            existingHeader.EstadoTarea = taskHeaderDto.EstadoTarea;
            existingHeader.Titutlo = taskHeaderDto.Titutlo;
            existingHeader.Observacion = taskHeaderDto.Observacion;

            _context.Entry(existingHeader).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingHeader;
        }

        public async Task<TasksHeader> SoftDeleteTaskHeaderAsync(int id)
        {
            var existingHeader = await _context.TasksHeader.FindAsync(id);
            if (existingHeader == null)
            {
                // O puedes lanzar una excepción NotFoundException personalizada
                return null; 
            }
            // Eliminación lógica
            existingHeader.Estado = 0; 
            _context.Entry(existingHeader).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingHeader;
        }

        public async Task<bool> UserExistsAsync(int userId)
        {
            return await _context.Users.AnyAsync(u => u.Id == userId);
        }
    }
}
