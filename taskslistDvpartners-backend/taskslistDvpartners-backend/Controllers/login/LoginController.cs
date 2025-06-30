using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using taskslistDvpartners_backend.Models;
using Microsoft.Extensions.Logging;
using taskslistDvpartners_backend.ModelsDto;
using taskslistDvpartners_backend.Services; 

namespace taskslistDvpartners_backend.Controllers.login
{
    [Route("api/Login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        readonly taskslistDvpartnersContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<LoginController> _logger;
        private readonly IPasswordHasher _passwordHasher;

        public LoginController(taskslistDvpartnersContext context,
                               IConfiguration configuration,
                               ILogger<LoginController> logger,
                               IPasswordHasher passwordHasher)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _passwordHasher = passwordHasher;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            try
            {
                if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                {
                    _logger.LogWarning("Intento de login con datos incompletos.");
                    return BadRequest("Debe proporcionar email y contraseña.");
                }

                if (_context == null)
                {
                    _logger.LogError("DbContext no está inicializado en LoginController.");
                    return StatusCode(500, "Error de configuración del servidor.");
                }

                var userFromDb = await _context.Users
                    .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

                // si no encuentra el usuario
                if (userFromDb == null)
                {
                    _logger.LogWarning("Intento de login fallido para el email: {Email}. Usuario no encontrado.", loginDto.Email);
                    // Por seguridad, es mejor no indicar si es el email o la contraseña lo incorrecto.
                    return Unauthorized("Credenciales incorrectas.");
                }

                // --- ¡CAMBIO CRUCIAL AQUÍ! Usar el PasswordHasher para verificar ---
                if (!_passwordHasher.VerifyPassword(loginDto.Password, userFromDb.Password))
                {
                    _logger.LogWarning("Intento de login fallido para el email: {Email}. Contraseña incorrecta.", loginDto.Email);
                    return Unauthorized("Credenciales incorrectas.");
                }
                // --- FIN DEL CAMBIO ---

                // Validacion de envio de rol
                if (string.IsNullOrEmpty(userFromDb.Rol))
                {
                    _logger.LogWarning("El rol del usuario {Email} no está definido.", userFromDb.Email);
                    return BadRequest("El rol del usuario no está definido.");
                }

                // obtencion del key de jwt
                var jwtKey = _configuration["Jwt:Key"];
                if (string.IsNullOrEmpty(jwtKey))
                {
                    _logger.LogError("La clave JWT no está configurada en appsettings.json o variables de entorno.");
                    return StatusCode(500, "Error interno del servidor: Configuración de seguridad faltante.");
                }
                var key = Encoding.UTF8.GetBytes(jwtKey);

                // Crear la lista de Claims que obtendre en el token
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, userFromDb.Id.ToString()),
                    new Claim(ClaimTypes.Email, userFromDb.Email),
                    new Claim(ClaimTypes.Name, userFromDb.Nombres),
                    new Claim(ClaimTypes.Role, userFromDb.Rol),
                    new Claim("Estado", userFromDb.Estado?.ToString() ?? ""),
                    new Claim("UserCrea", userFromDb.Usercrea?.ToString() ?? "")
                };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                _logger.LogInformation("Usuario {Email} ha iniciado sesión exitosamente.", userFromDb.Email);

                return Ok(new
                {
                    Token = tokenString
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error durante el proceso de login.");
                return StatusCode(500, "Ocurrió un error interno en el servidor.");
            }
        }
    }
}