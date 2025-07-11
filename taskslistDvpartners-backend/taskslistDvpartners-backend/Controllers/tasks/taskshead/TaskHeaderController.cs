﻿// File: taskslistDvpartners_backend/Controllers/tasks/taskshead/TaskHeaderController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using taskslistDvpartners_backend.Controllers.Users;
using taskslistDvpartners_backend.ModelsDto; // Importa el nuevo DTO
using taskslistDvpartners_backend.Services.ITaskHead;
using taskslistDvpartners_backend.Services.IUsers;

namespace taskslistDvpartners_backend.Controllers.tasks.taskshead
{
    [Route("api/TaskHeader")]
    [ApiController]
    [Authorize]
    public class TaskHeaderController : ControllerBase
    {
        private readonly ILogger<TaskHeaderController> _logger;
        private readonly ITaskHeaderService _taskHeaderService;

        public TaskHeaderController(ILogger<TaskHeaderController> logger, ITaskHeaderService taskHeaderService)
        {
            _logger = logger;
            _taskHeaderService = taskHeaderService;
        }

        // --- GET: Obtener todos los TaskHeaders por estado ---
        [HttpGet("GetAll/{estado}")]
        public async Task<IActionResult> GetAllTaskHeaders([FromRoute] int estado)
        {
            try
            {
                // Extraer el ID del usuario conectado desde el token
                int? iduserconnected = null;
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int parsedId))
                    iduserconnected = parsedId;

                // Extraer el rol desde el token
                var roleClaim = User.FindFirst(ClaimTypes.Role);
                var role = roleClaim?.Value;

                if (iduserconnected == null || role == null)
                {
                    return Unauthorized("No se pudo determinar el usuario o rol desde el token.");
                }

                var taskHeaders = await _taskHeaderService.GetAllTaskHeadersAsync(estado, iduserconnected.Value, role);

                if (!taskHeaders.Any())
                {
                    _logger.LogWarning("No se encontraron TaskHeaders con estado {Estado} para usuario ID {UserId} y rol {Role}.", estado, iduserconnected, role);
                    return NotFound("No se encontraron tareas para este usuario.");
                }

                return Ok(taskHeaders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener TaskHeaders con estado {Estado}.", estado);
                return StatusCode(500, "Ocurrió un error interno al obtener las tareas.");
            }
        }




        // El resto de tus métodos del controlador quedan igual
        // --- GET: Obtener un TaskHeader por ID ---
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskHeaderById([FromRoute] int id)
        {
            try
            {
                var taskHeader = await _taskHeaderService.GetTaskHeaderByIdAsync(id);
                if (taskHeader == null)
                {
                    _logger.LogWarning("TaskHeader con ID {Id} no encontrado.", id);
                    return NotFound($"TaskHeader con ID '{id}' no encontrado.");
                }
                _logger.LogInformation("TaskHeader con ID {Id} recuperado exitosamente.", id);
                return Ok(taskHeader);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar obtener TaskHeader con ID {Id}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al recuperar la tarea.");
            }
        }

        // --- POST: Crear un nuevo TaskHeader ---
        [HttpPost("Create")]
        [Authorize(Roles = "ADM,GER")]
        public async Task<IActionResult> CreateTaskHeader([FromBody] TaskHeaderCreateUpdateDto taskHeaderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Intento de creación de TaskHeader con datos inválidos: {Errors}", ModelState);
                    return BadRequest(ModelState);
                }

                int? userCreaId = null;
                var userCreaClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userCreaClaim != null && int.TryParse(userCreaClaim.Value, out int parsedId))
                {
                    userCreaId = parsedId;
                }
                else
                {
                    _logger.LogWarning("No se pudo obtener el UserCrea del token para el nuevo TaskHeader con título: {Titulo}", taskHeaderDto.Titutlo);
                }

                var newHeader = await _taskHeaderService.CreateTaskHeaderAsync(taskHeaderDto, userCreaId);

                _logger.LogInformation("TaskHeader '{Titulo}' creado exitosamente con ID: {Id}.", newHeader.Titutlo, newHeader.Id);
                return CreatedAtAction(nameof(GetTaskHeaderById), new { id = newHeader.Id }, newHeader);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Error al crear TaskHeader: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar crear un nuevo TaskHeader con título: {Titulo}.", taskHeaderDto?.Titutlo);
                return StatusCode(500, "Ocurrió un error interno en el servidor al crear la tarea.");
            }
        }

        // --- PUT: Actualizar un TaskHeader existente ---
        [HttpPut("Update/{id}")]
        [Authorize(Roles = "ADM,GER,NOR")]
        public async Task<IActionResult> UpdateTaskHeader([FromRoute] int id, [FromBody] TaskHeaderCreateUpdateDto taskHeaderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Intento de actualización de TaskHeader con ID {Id} con datos inválidos: {Errors}", id, ModelState);
                    return BadRequest(ModelState);
                }

                var updatedHeader = await _taskHeaderService.UpdateTaskHeaderAsync(id, taskHeaderDto);

                if (updatedHeader == null)
                {
                    _logger.LogWarning("TaskHeader con ID {Id} no encontrado para actualizar.", id);
                    return NotFound($"TaskHeader con ID '{id}' no encontrado para actualizar.");
                }

                _logger.LogInformation("TaskHeader con ID {Id} actualizado exitosamente.", id);
                return Ok(updatedHeader);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Error al actualizar TaskHeader con ID {Id}: {Message}", id, ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar actualizar el TaskHeader con ID {Id}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al actualizar la tarea.");
            }
        }

        // --- DELETE: Eliminar lógicamente un TaskHeader ---
        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "ADM,GER")]
        public async Task<IActionResult> SoftDeleteTaskHeader([FromRoute] int id)
        {
            try
            {
                var deletedHeader = await _taskHeaderService.SoftDeleteTaskHeaderAsync(id);

                if (deletedHeader == null)
                {
                    _logger.LogWarning("TaskHeader con ID {Id} no encontrado para eliminación lógica.", id);
                    return NotFound($"TaskHeader con ID '{id}' no encontrado para eliminar.");
                }

                _logger.LogInformation("TaskHeader con ID {Id} eliminado lógicamente (estado 0) exitosamente.", id);
                return Ok(new
                {
                    Message = $"TaskHeader con ID '{deletedHeader.Id}' y título '{deletedHeader.Titutlo}' ha sido eliminado lógicamente.",
                    TaskId = deletedHeader.Id,
                    NewStatus = deletedHeader.Estado
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar eliminar lógicamente el TaskHeader con ID {Id}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al eliminar la tarea.");
            }
        }
    }
}