// using taskslistDvpartners_backend.ModelsDto; // Ya está presente
using taskslistDvpartners_backend.ModelsDto;

namespace taskslistDvpartners_backend.Services.IUsers
{
    public interface IUserService
    {
        // Modificado para aceptar userCrea como parámetro opcional
        Task<PaginatedResponseDto<taskslistDvpartners_backend.Models.Users>> GetAllUsersAsync(int? estado, int? userCrea);
        Task<taskslistDvpartners_backend.Models.Users> CreateUserAsync(UserCreateUpdateDto userDto, int? userCreaId);
        Task<taskslistDvpartners_backend.Models.Users> UpdateUserAsync(int id, UserCreateUpdateDto userDto);
        Task<taskslistDvpartners_backend.Models.Users> SoftDeleteUserAsync(int id);
        Task<bool> UserExistsByEmailAsync(string email);
        Task<taskslistDvpartners_backend.Models.Users> GetUserByIdAsync(int id);
    }
}