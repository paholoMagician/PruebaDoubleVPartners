// controllers/Users/UsersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using taskslistDvpartners_backend.ModelsDto;
using taskslistDvpartners_backend.Services.IUsers;

namespace taskslistDvpartners_backend.Controllers.Users
{
    [Route("api/Users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IUserService _userService;

        public UsersController(ILogger<UsersController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpGet("GetUsers")] // Cambiamos a solo "GetUsers" ya que los parámetros ahora serán de consulta
        public async Task<IActionResult> GetUsers(
                  [FromQuery] int? estado, // Hacemos el estado opcional también
                  [FromQuery] int? userCrea) // Nuevo parámetro opcional para userCrea
        {
            try
            {
                // Si ambos son nulos, podrías devolver todos los usuarios o un error, según la lógica de negocio.
                // Aquí, si ambos son nulos, podría devolver un BadRequest o un set de datos por defecto.
                // Por ahora, asumimos que al menos uno se enviará o se devolverán todos si ambos son nulos (si tu servicio lo permite).
                // Modificaremos GetAllUsersAsync para manejar nulos.

                var response = await _userService.GetAllUsersAsync(estado, userCrea); // Pasamos ambos parámetros

                if (response == null || !response.Data.Any()) // También verifica si response es null
                {
                    _logger.LogWarning("No se encontraron usuarios con estado {Estado} y/o UserCrea {UserCrea}.", estado, userCrea);
                    return NotFound($"No se encontraron usuarios con el estado '{estado}' y/o UserCrea '{userCrea}'.");
                }
                _logger.LogInformation("Se recuperaron {Count} usuarios con estado {Estado} y UserCrea {UserCrea}.", response.Data.Count, estado, userCrea);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar obtener usuarios con estado {Estado} y UserCrea {UserCrea}.", estado, userCrea);
                return StatusCode(500, "Ocurrió un error interno en el servidor al recuperar los usuarios.");
            }
        }

        [HttpPost("CreateUser")]
        [Authorize(Roles = "ADM")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateUpdateDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Intento de creación de usuario con datos inválidos: {Errors}", ModelState);
                    return BadRequest(ModelState);
                }

                // Obtener el ID del usuario autenticado
                int? userCreaId = null;
                var userCreaClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userCreaClaim != null && int.TryParse(userCreaClaim.Value, out int parsedId))
                {
                    userCreaId = parsedId;
                }
                else
                {
                    _logger.LogWarning("No se pudo obtener el UserCrea del token para el nuevo usuario con email: {Email}", userDto.Email);
                }

                var newUser = await _userService.CreateUserAsync(userDto, userCreaId);

                _logger.LogInformation("Usuario '{Email}' creado exitosamente con ID: {UserId}.", newUser.Email, newUser.Id);
                // Si tienes un GetUserById, sería mejor: return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
                return CreatedAtAction(nameof(GetUsers), new { estado = newUser.Estado }, newUser); // Ajusta según tu GetUsers
            }
            catch (InvalidOperationException ex) // Captura excepciones específicas del servicio
            {
                _logger.LogWarning("Intento de creación de usuario fallido: {Message}", ex.Message);
                return Conflict(ex.Message); // O BadRequest si es una validación de entrada
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar crear un nuevo usuario con email: {Email}.", userDto?.Email);
                return StatusCode(500, "Ocurrió un error interno en el servidor al crear el usuario.");
            }
        }

        [HttpPut("UpdateUser/{id}")]
        [Authorize(Roles = "ADM")]
        public async Task<IActionResult> UpdateUser([FromRoute] int id, [FromBody] UserCreateUpdateDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Intento de actualización de usuario con ID {UserId} con datos inválidos: {Errors}", id, ModelState);
                    return BadRequest(ModelState);
                }

                var updatedUser = await _userService.UpdateUserAsync(id, userDto);

                if (updatedUser == null)
                {
                    _logger.LogWarning("Intento de actualización fallido: Usuario con ID {UserId} no encontrado.", id);
                    return NotFound($"Usuario con ID '{id}' no encontrado para actualizar.");
                }

                _logger.LogInformation("Usuario con ID {UserId} actualizado exitosamente.", id);
                return Ok(updatedUser);
            }
            catch (InvalidOperationException ex) // Captura excepciones específicas del servicio
            {
                _logger.LogWarning("Intento de actualización de usuario {UserId} fallido: {Message}", id, ex.Message);
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar actualizar el usuario con ID {UserId}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al actualizar el usuario.");
            }
        }

        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "ADM")]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            try
            {
                var deletedUser = await _userService.SoftDeleteUserAsync(id);

                if (deletedUser == null)
                {
                    _logger.LogWarning("Intento de eliminación fallido: Usuario con ID {UserId} no encontrado.", id);
                    return NotFound($"Usuario con ID '{id}' no encontrado para eliminar.");
                }

                _logger.LogInformation("Usuario con ID {UserId} eliminado lógicamente (estado 0) exitosamente.", id);
                return Ok(new
                {
                    Message = $"Usuario con ID '{deletedUser.Id}' y nombre '{deletedUser.Nombres}' ha sido eliminado lógicamente.",
                    UserId = deletedUser.Id,
                    NewStatus = deletedUser.Estado,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al intentar eliminar lógicamente el usuario con ID {UserId}.", id);
                return StatusCode(500, "Ocurrió un error interno en el servidor al eliminar el usuario.");
            }
        }
    }
}