using System.ComponentModel.DataAnnotations;

namespace taskslistDvpartners_backend.ModelsDto
{
        public class UserCreateUpdateDto
        {
            public string Nombres { get; set; }

            public string Email { get; set; }

            public string Password { get; set; }

         
            public int? Estado { get; set; }

            public string Rol { get; set; }

        }
    }
