namespace taskslistDvpartners_backend.ModelsDto
{
    public class PaginatedResponseDto<T>
    {
        public List<T> Data { get; set; }
        public int Pagination { get; set; }
    }

}
