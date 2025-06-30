using Serilog.Events;
using Serilog;
using System.IO; 

namespace taskslistDvpartners_backend.ClassAditionals.SeriLogExtensions.Extensions
{
    public static class SerilogExtensions
    {
        public static WebApplicationBuilder AddSerilogConfiguration(this WebApplicationBuilder builder)
        {
            // Define la ruta del directorio de logs
            var logsDirectory = Path.Combine(AppContext.BaseDirectory, "logs");

            // Asegúrate de que la carpeta 'logs' exista
            // Se usa try-catch para manejar posibles problemas de permisos
            if (!Directory.Exists(logsDirectory))
            {
                try
                {
                    Directory.CreateDirectory(logsDirectory);
                    Console.WriteLine($"[Logger Setup] Directorio de logs creado exitosamente: {logsDirectory}");
                }
                catch (UnauthorizedAccessException ex)
                {
                    Console.WriteLine($"[Logger Setup ERROR] Permiso denegado al crear el directorio de logs en {logsDirectory}. Detalles: {ex.Message}");
                    // En producción, podrías considerar lanzar la excepción o salir de la aplicación
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Logger Setup ERROR] Error al crear el directorio de logs en {logsDirectory}. Detalles: {ex.Message}");
                    // En producción, podrías considerar lanzar la excepción o salir de la aplicación
                }
            }
            else
            {
                Console.WriteLine($"[Logger Setup] El directorio de logs YA existe en: {logsDirectory}");
            }

            // Configurar Serilog
            Log.Logger = new LoggerConfiguration()
                // Nivel mínimo para logs
                .MinimumLevel.Information()
                // Silenciar algunos logs de Microsoft
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                // Mantener logs importantes de ASP.NET Core
                .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information) 
                .Enrich.FromLogContext()
                .Enrich.WithMachineName()
                .Enrich.WithProcessId()
                .Enrich.WithThreadId()
                .WriteTo.Console()
                .WriteTo.File(
                    Path.Combine(logsDirectory, "log-.txt"),
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] ({SourceContext}) {Message:lj}{NewLine}{Exception}",
                    retainedFileCountLimit: 7
                )
                .CreateLogger();

            // Usar Serilog para el logging de ASP.NET Core
            builder.Host.UseSerilog();
            // Devolvemos el builder para encadenar las llamadas
            return builder; 
        }
    }
}