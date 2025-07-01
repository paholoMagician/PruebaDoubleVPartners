// Services/TasksBodyService.cs
using Microsoft.EntityFrameworkCore;
using taskslistDvpartners_backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taskslistDvpartners_backend.ModelsDto;

namespace taskslistDvpartners_backend.Services // <--- ¡Cambiado aquí!
{
    public class TasksBodyService : ITasksBodyService // <--- Asegúrate de que implementa la interfaz
    {
        private readonly taskslistDvpartnersContext _context;

        public TasksBodyService(taskslistDvpartnersContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TasksBody>> GetAllTasksBodyByHeaderIdAsync(int tasksHeaderId, int estado)
        {
            // NOTA: Cambié _context.TasksBody por _context.TasksBody (plural)
            // Esto asume que tu DbSet en DbContext se llama TasksBody.
            // Si tu DbSet se llama TasksBody, manténlo como estaba.
            return await _context.TasksBody
                                 .Where(tb => tb.IdTasksHeader == tasksHeaderId && tb.Estado == estado && tb.Eliminado == 0)
                                 .ToListAsync();
        }

        public async Task<TasksBody> GetTasksBodyByIdAsync(int id)
        {
            return await _context.TasksBody.FirstOrDefaultAsync(tb => tb.Id == id && tb.Eliminado == 0);
        }

        public async Task<TasksBody> CreateTasksBodyAsync(TasksBodyCreateUpdateDto tasksBodyDto)
        {
            if (!await TasksHeaderExistsAsync(tasksBodyDto.IdTasksHeader))
            {
                throw new InvalidOperationException($"El encabezado de tarea con ID '{tasksBodyDto.IdTasksHeader}' no existe.");
            }

            var newBody = new TasksBody
            {
                Descripcion = tasksBodyDto.Descripcion,
                Urlimagen = tasksBodyDto.Urlimagen,
                IdTasksHeader = tasksBodyDto.IdTasksHeader,
                Color = tasksBodyDto.Color,
                Estado = tasksBodyDto.Estado ?? 1,
                Eliminado = 0,
                FechaInicioTarea = tasksBodyDto.FechaInicioTarea,
                FechaFinTarea = tasksBodyDto.FechaFinTarea,
                Observacion = tasksBodyDto.Observacion
            };

            _context.TasksBody.Add(newBody);
            await _context.SaveChangesAsync();
            return newBody;
        }

        public async Task<TasksBody> UpdateTasksBodyAsync(int id, TasksBodyCreateUpdateDto tasksBodyDto)
        {
            var existingBody = await _context.TasksBody
                                .FirstOrDefaultAsync(tb => tb.Id == id && tb.Eliminado == 0);
            if (existingBody == null)
            {
                return null;
            }

            if (existingBody.IdTasksHeader != tasksBodyDto.IdTasksHeader && !await TasksHeaderExistsAsync(tasksBodyDto.IdTasksHeader))
            {
                throw new InvalidOperationException($"El nuevo encabezado de tarea con ID '{tasksBodyDto.IdTasksHeader}' no existe.");
            }

            existingBody.Descripcion = tasksBodyDto.Descripcion;
            existingBody.Urlimagen = tasksBodyDto.Urlimagen;
            existingBody.IdTasksHeader = tasksBodyDto.IdTasksHeader;
            existingBody.Color = tasksBodyDto.Color;
            existingBody.Estado = tasksBodyDto.Estado;
            existingBody.FechaInicioTarea = tasksBodyDto.FechaInicioTarea;
            existingBody.FechaFinTarea = tasksBodyDto.FechaFinTarea;
            existingBody.Observacion = tasksBodyDto.Observacion;

            _context.Entry(existingBody).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingBody;
        }

        public async Task<TasksBody> SoftDeleteTasksBodyAsync(int id)
        {
            var existingBody = await _context.TasksBody.FirstOrDefaultAsync(tb => tb.Id == id && tb.Eliminado == 0);
            if (existingBody == null)
            {
                return null;
            }

            existingBody.Eliminado = 1;
            _context.Entry(existingBody).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return existingBody;
        }

        public async Task<bool> TasksHeaderExistsAsync(int tasksHeaderId)
        {
            // NOTA: Cambié _context.TasksBody por _context.TasksHeaders (plural)
            // Aquí se valida contra la tabla TasksHeaders, no TasksBody.
            // Si tu DbSet se llama TasksHeader, manténlo como estaba.
            return await _context.TasksHeader.AnyAsync(th => th.Id == tasksHeaderId && th.Estado != 0);
        }
    }
}