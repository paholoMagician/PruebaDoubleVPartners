using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using taskslistDvpartners_backend.Services;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using taskslistDvpartners_backend.ModelsDto;

namespace taskslistDvpartners_backend.Controllers.tasks.taskBody
{
    [Route("api/TasksBody")]
    [ApiController]
    [Authorize] 
    public class TasksBodyController : ControllerBase
    {
        private readonly ILogger<TasksBodyController> _logger;
        private readonly ITasksBodyService _tasksBodyService; 

        public TasksBodyController(ILogger<TasksBodyController> logger, ITasksBodyService tasksBodyService)
        {
            _logger = logger;
            _tasksBodyService = tasksBodyService;
        }

        // --- GET: Obtener todas las entradas de TasksBody para un TaskHeader específico por estado ---
        [HttpGet("GetAllByHeader/{tasksHeaderId}/{estado}")]
        public async Task<IActionResult> GetAllTasksBodyByHeaderId([FromRoute] int tasksHeaderId, [FromRoute] int estado)
        {
            try
            {
                var tasksBodies = await _tasksBodyService.GetAllTasksBodyByHeaderIdAsync(tasksHeaderId, estado);
                if (!tasksBodies.Any())
                {
                    _logger.LogWarning("No se encontraron cuerpos de tarea (TasksBody) para el encabezado de tarea (TaskHeader) con ID {TasksHeaderId} y estado {Estado}.", tasksHeaderId, estado);
                    return NotFound($"No se encontraron cuerpos de tarea para el encabezado de tarea con ID '{tasksHeaderId}' y estado '{estado}'.");
                }
                _logger.LogInformation("Se recuperaron {Count} cuerpos de tarea (TasksBody) para el encabezado de tarea (TaskHeader) con ID {TasksHeaderId} y estado {Estado}.", tasksBodies.Count(), tasksHeaderId, estado);
                return Ok(tasksBodies);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar obtener cuerpos de tarea (TasksBody) para el encabezado de tarea (TaskHeader) con ID {TasksHeaderId} y estado {Estado}.", tasksHeaderId, estado);
                return StatusCode(500, "Ocurrió un error interno en el servidor al recuperar los cuerpos de tarea.");
            }
        }

        // --- GET: Obtener un TasksBody específico por ID ---
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTasksBodyById([FromRoute] int id)
        {
            try
            {
                var tasksBody = await _tasksBodyService.GetTasksBodyByIdAsync(id);
                if (tasksBody == null)
                {
                    _logger.LogWarning("Cuerpo de tarea (TasksBody) con ID {Id} no encontrado o eliminado lógicamente.", id);
                    return NotFound($"Cuerpo de tarea con ID '{id}' no encontrado.");
                }
                _logger.LogInformation("Cuerpo de tarea (TasksBody) con ID {Id} recuperado exitosamente.", id);
                return Ok(tasksBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar obtener cuerpo de tarea (TasksBody) con ID {Id}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al recuperar el cuerpo de tarea.");
            }
        }

        // --- POST: Crear un nuevo TasksBody ---
        [HttpPost("Create")]
        [Authorize(Roles = "ADM,USR")] // Permitir a ADM y USR crear cuerpos de tarea
        public async Task<IActionResult> CreateTasksBody([FromBody] TasksBodyCreateUpdateDto tasksBodyDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Intento de creación de cuerpo de tarea (TasksBody) con datos inválidos: {Errors}", ModelState);
                    return BadRequest(ModelState);
                }

                var newBody = await _tasksBodyService.CreateTasksBodyAsync(tasksBodyDto);

                _logger.LogInformation("Cuerpo de tarea (TasksBody) '{Descripcion}' creado exitosamente con ID: {Id}.", newBody.Descripcion, newBody.Id);

                return CreatedAtAction(nameof(GetTasksBodyById), new { id = newBody.Id }, newBody);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Error al crear cuerpo de tarea (TasksBody): {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar crear un nuevo cuerpo de tarea (TasksBody) con descripción: {Descripcion}.", tasksBodyDto?.Descripcion);
                return StatusCode(500, "Ocurrió un error interno en el servidor al crear el cuerpo de tarea.");
            }
        }

        // --- PUT: Actualizar un TasksBody existente ---
        [HttpPut("Update/{id}")]
        [Authorize(Roles = "ADM,USR")] // Permitir a ADM y USR actualizar cuerpos de tarea
        public async Task<IActionResult> UpdateTasksBody([FromRoute] int id, [FromBody] TasksBodyCreateUpdateDto tasksBodyDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Intento de actualización de cuerpo de tarea (TasksBody) con ID {Id} con datos inválidos: {Errors}", id, ModelState);
                    return BadRequest(ModelState);
                }

                var updatedBody = await _tasksBodyService.UpdateTasksBodyAsync(id, tasksBodyDto);

                if (updatedBody == null)
                {
                    _logger.LogWarning("Cuerpo de tarea (TasksBody) con ID {Id} no encontrado o eliminado lógicamente para actualizar.", id);
                    return NotFound($"Cuerpo de tarea con ID '{id}' no encontrado para actualizar.");
                }

                _logger.LogInformation("Cuerpo de tarea (TasksBody) con ID {Id} actualizado exitosamente.", id);
                return Ok(updatedBody);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Error al actualizar cuerpo de tarea (TasksBody) con ID {Id}: {Message}", id, ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar actualizar el cuerpo de tarea (TasksBody) con ID {Id}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al actualizar el cuerpo de tarea.");
            }
        }

        // --- DELETE: Eliminación lógica de un TasksBody ---
        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "ADM")] // Solo ADM puede eliminar lógicamente cuerpos de tarea
        public async Task<IActionResult> SoftDeleteTasksBody([FromRoute] int id)
        {
            try
            {
                var deletedBody = await _tasksBodyService.SoftDeleteTasksBodyAsync(id);

                if (deletedBody == null)
                {
                    _logger.LogWarning("Cuerpo de tarea (TasksBody) con ID {Id} no encontrado o ya eliminado lógicamente.", id);
                    return NotFound($"Cuerpo de tarea con ID '{id}' no encontrado o ya eliminado.");
                }

                _logger.LogInformation("Cuerpo de tarea (TasksBody) con ID {Id} eliminado lógicamente (Eliminado = 1) exitosamente.", id);

                return Ok(new
                {
                    Message = $"Cuerpo de tarea con ID '{deletedBody.Id}' y descripción '{deletedBody.Descripcion}' ha sido eliminado lógicamente.",
                    TasksBodyId = deletedBody.Id,
                    TasksBodyDescription = deletedBody.Descripcion,
                    NewEliminadoStatus = deletedBody.Eliminado,
                    DeletedTasksBody = deletedBody
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar eliminar lógicamente el cuerpo de tarea (TasksBody) con ID {Id}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al eliminar el cuerpo de tarea.");
            }
        }
    }
}