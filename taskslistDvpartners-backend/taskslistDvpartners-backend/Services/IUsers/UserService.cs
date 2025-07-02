using Microsoft.EntityFrameworkCore;
using taskslistDvpartners_backend.Models;
using taskslistDvpartners_backend.ModelsDto;

namespace taskslistDvpartners_backend.Services.IUsers
{
    public class UserService : IUserService
    {
        private readonly taskslistDvpartnersContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public UserService(taskslistDvpartnersContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<PaginatedResponseDto<taskslistDvpartners_backend.Models.Users>> GetAllUsersAsync(int? estado, int? userCrea)
        {
            var query = _context.Users.AsQueryable(); // Inicia una query IQueryable

            if (estado.HasValue)
            {
                query = query.Where(u => u.Estado == estado.Value);
            }

            if (userCrea.HasValue)
            {
                query = query.Where(u => u.Usercrea == userCrea.Value);
            }
            // Si ambos son nulos, la query traerá todos los usuarios.
            // Si uno es nulo y el otro tiene valor, filtrará por el que tiene valor.

            var users = await query.ToListAsync();

            return new PaginatedResponseDto<taskslistDvpartners_backend.Models.Users>
            {
                Data = users,
                Pagination = users.Count > 0 ? users.Count : 0 // Puedes ajustar la paginación según tu lógica
            };
        }


        public async Task<taskslistDvpartners_backend.Models.Users> CreateUserAsync(UserCreateUpdateDto userDto, int? userCreaId)
        {
            if (await UserExistsByEmailAsync(userDto.Email))
            {
                // Podrías lanzar una excepción personalizada aquí para manejarla en el controlador.
                throw new InvalidOperationException("El email ya está en uso.");
            }

            var newUser = new taskslistDvpartners_backend.Models.Users
            {
                Nombres = userDto.Nombres,
                Email = userDto.Email,
                Password = _passwordHasher.HashPassword(userDto.Password),
                Estado = userDto.Estado,
                Rol = userDto.Rol,
                Fecrea = DateTime.UtcNow,
                Usercrea = userCreaId
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }

        public async Task<taskslistDvpartners_backend.Models.Users> UpdateUserAsync(int id, UserCreateUpdateDto userDto)
        {
            var userToUpdate = await _context.Users.FindAsync(id);
            if (userToUpdate == null) return null; // O lanzar NotFoundException

            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email && u.Id != id))
            {
                throw new InvalidOperationException("El email ya está en uso por otro usuario.");
            }

            userToUpdate.Nombres = userDto.Nombres;
            userToUpdate.Email = userDto.Email;
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                userToUpdate.Password = _passwordHasher.HashPassword(userDto.Password);
            }
            userToUpdate.Estado = userDto.Estado;
            userToUpdate.Rol = userDto.Rol;

            _context.Entry(userToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userToUpdate;
        }

        public async Task<taskslistDvpartners_backend.Models.Users> SoftDeleteUserAsync(int id)
        {
            var userToDelete = await _context.Users.FindAsync(id);
            if (userToDelete == null) return null; // O lanzar NotFoundException

            userToDelete.Estado = 0; // Eliminación lógica
            _context.Entry(userToDelete).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userToDelete;
        }

        public async Task<bool> UserExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<taskslistDvpartners_backend.Models.Users> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}
