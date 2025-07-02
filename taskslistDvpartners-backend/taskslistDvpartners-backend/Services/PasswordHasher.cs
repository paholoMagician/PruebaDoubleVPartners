using BCrypt.Net;

namespace taskslistDvpartners_backend.Services
{
    public class PasswordHasher : IPasswordHasher
    {

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, 12);
            
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {         
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            
        }

    }
}
