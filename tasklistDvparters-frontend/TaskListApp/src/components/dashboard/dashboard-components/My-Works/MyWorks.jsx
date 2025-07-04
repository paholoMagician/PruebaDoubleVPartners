import { useState, useEffect } from 'react';
import { getTasks, updateTask } from '../Tareas/services/Tareas.services';
import './MyWorks.css';
import Swal from 'sweetalert2'; // Importamos SweetAlert2

// Importamos los íconos de Material-UI (MUI) que vamos a utilizar
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';

// Importaciones de DND Kit
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';

import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente para una tarjeta de tarea arrastrable
const SortableTaskCard = ({ task, id, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card status-${task.estadoTarea}`}
      onClick={() => onTaskClick && onTaskClick(task)}
    >
      <h4 className="card-title">{task.titutlo}</h4>
      <p><strong>ID:</strong> {task.id}</p>
      <p><strong>Estado:</strong> {task.estadoTarea === 1 ? 'Pendiente' : task.estadoTarea === 2 ? 'En Proceso' : task.estadoTarea === 3 ? 'Completada' : 'Desconocido'}</p>
      <p><strong>Observación:</strong> {task.observacion || 'Ninguna'}</p>
      <p className="card-date">Creada: {task.fecrea ? new Date(task.fecrea).toLocaleDateString() : 'N/A'}</p>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
export const MyWorks = ({ userData }) => {



  const [tasks, setTasks] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // console.log('userData desde MyWorks')
      // console.log(userData)
      // console.log(2)

      const allTasks = await getTasks(1);
      setTasks(allTasks);
    } catch (err) {
      console.error("Error al cargar las tareas principales para Kanban:", err);
      // Usar SweetAlert2 para errores de carga inicial
      Swal.fire({
        icon: 'error',
        title: 'Error de Carga',
        text: err.message || "Error desconocido al cargar las tareas principales.",
        confirmButtonText: 'Entendido'
      });
      // Ya no es necesario setError si el Swal es el método principal para mostrar errores de carga
      // setError(err.message || "Error desconocido al cargar las tareas principales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupTasksByStatus = (tasksArray) => {
    const grouped = {
      1: [], // Pendiente
      2: [], // En Proceso
      3: [], // Completada
      0: [], // Otros estados (usaremos 0 para esta columna "Otros Estados")
    };

    tasksArray.forEach(task => {
      if (task.estadoTarea === 1 || task.estadoTarea === 2 || task.estadoTarea === 3) {
        grouped[task.estadoTarea].push(task);
      } else {
        grouped[0].push(task); // Tareas con estados no reconocidos van a "Otros Estados"
      }
    });
    return grouped;
  };

  const groupedTasks = groupTasksByStatus(tasks);

  // Helper para obtener el nombre legible del estado
  const getTaskStatusName = (statusCode) => {
    switch (statusCode) {
      case 1: return 'Pendiente';
      case 2: return 'En Proceso';
      case 3: return 'Completada';
      case 0: return 'Otros Estados';
      default: return 'Desconocido';
    }
  };

  // --- Manejador de Drag and Drop ---
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      console.log("Soltado fuera de cualquier contenedor droppable válido. Operación ignorada.");
      return;
    }

    const draggedTaskId = active.id;
    let droppedColumnId = over.id; // Puede ser el ID de la columna o de la drop zone

    // LÓGICA DE DETECCIÓN DE ZONA DE DROPEO
    if (typeof droppedColumnId === 'string' && droppedColumnId.startsWith('drop-zone-')) {
      droppedColumnId = Number(droppedColumnId.replace('drop-zone-', ''));
      console.log(`Detectada zona de dropeo. Moviendo a la columna: ${droppedColumnId}`);
    } else if (typeof droppedColumnId === 'number') {
      console.log(`Detectada columna directamente. Moviendo a la columna: ${droppedColumnId}`);
    } else {
      console.warn(`Tipo de 'over.id' inesperado o no válido: ${over.id}. Operación ignorada.`);
      return;
    }

    const draggedTask = tasks.find(task => task.id === draggedTaskId);

    if (!draggedTask) {
      console.error("Tarea arrastrada no encontrada en el estado actual.");
      return;
    }

    const newStatus = Number(droppedColumnId);

    // VALIDACIÓN: Si el estado de destino no es 1, 2, o 3, o no es un número válido, no hacemos nada.
    if (isNaN(newStatus) || (newStatus !== 1 && newStatus !== 2 && newStatus !== 3)) {
      console.warn(`Intento de soltar en un estado no permitido o desconocido: ${droppedColumnId}. Operación ignorada.`);
      return;
    }

    // Si la tarea se soltó en la misma columna y no cambió de estado, solo logeamos.
    if (draggedTask.estadoTarea === newStatus) {
      console.log(`Tarea "${draggedTask.titutlo}" soltada en la misma columna (${getTaskStatusName(newStatus)}). No hay cambio de estado.`);
      return;
    }

    // --- Confirmar con SweetAlert2 ---
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres mover "${draggedTask.titutlo}" a la columna de "${getTaskStatusName(newStatus)}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, mover',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      console.log("Cambio de estado cancelado por el usuario.");
      return;
    }

    // Actualiza el estado de la tarea en el frontend (optimistic update)
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === draggedTaskId
        ? { ...task, estadoTarea: newStatus }
        : task
    ));
    setError(null);
    console.log(`Actualización optimista: Tarea "${draggedTask.titutlo}" movida a ${getTaskStatusName(newStatus)} en el frontend.`);

    try {
      const updatedTaskData = { ...draggedTask, estadoTarea: newStatus };
      await updateTask(draggedTaskId, updatedTaskData);
      console.log(`Éxito: Tarea ${draggedTaskId} actualizada al estado ${newStatus} en el backend.`);
      // Mostrar SweetAlert2 de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Movida!',
        text: `La tarea "${draggedTask.titutlo}" ha sido movida a "${getTaskStatusName(newStatus)}".`,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      console.error(`Error al actualizar la tarea ${draggedTaskId} en el backend:`, err);
      // Mostrar SweetAlert2 de error
      Swal.fire({
        icon: 'error',
        title: 'Error al mover',
        text: `No se pudo mover la tarea "${draggedTask.titutlo}". Error: ${err.message}.`,
        confirmButtonText: 'Aceptar'
      });
      // Ya no es necesario mantener el error en el estado local para la UI principal si SweetAlert2 ya lo manejó
      // setError(`Error al actualizar la tarea: ${err.message}. La tarea podría no haberse guardado.`);
      // Opcional: revertir el cambio optimista si falla el backend
      // fetchTasks();
    }
  };

  // Componente auxiliar para renderizar una columna Kanban
  const KanbanColumn = ({ title, tasksInColumn, statusValue, IconComponent }) => {
    // useDroppable para toda la columna como un droppable general
    const { setNodeRef: setColumnNodeRef } = useDroppable({
      id: statusValue,
    });

    // useDroppable para la zona de dropeo específica al principio de la columna
    const { setNodeRef: setDropZoneNodeRef, isOver } = useDroppable({
      id: `drop-zone-${statusValue}`, // ID único para la zona de dropeo
    });

    return (
      <div ref={setColumnNodeRef} id={statusValue} className="kanban-column">
        <h2 className="kanban-column-title">
          {IconComponent && <IconComponent style={{ fontSize: '1.2em', marginRight: '8px' }} />}
          {title} ({tasksInColumn.length})
        </h2>
        {/* La nueva zona de dropeo, ahora al principio */}
        <div
          ref={setDropZoneNodeRef}
          className={`kanban-drop-zone ${isOver ? 'kanban-drop-zone-active' : ''}`}
        >
          Arrastra aquí para mover
        </div>
        <SortableContext items={tasksInColumn.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasksInColumn.length === 0 ? (
            <p className="no-tasks-message">No hay tareas aquí.</p>
          ) : (
            tasksInColumn.map(task => (
              <SortableTaskCard key={task.id} id={task.id} task={task} />
            ))
          )}
        </SortableContext>
      </div>
    );
  };

  if (loading) {
    return <div className="loading-message">Cargando tablero Kanban...</div>;
  }

  // Ya no es necesario un div de error global si SweetAlert2 maneja todos los errores.
  // Solo se mostraría si fetchTasks falla y setError se sigue usando para algo más,
  // pero para la funcionalidad de alertas, ya no es crucial aquí.
  /*
  if (error) {
      return <div className="error-message">Error: {error}</div>;
  }
  */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="my-works-container">
        <h1 className="my-works-title">
          <DashboardOutlinedIcon style={{ fontSize: '0.9em', marginRight: '10px' }} />
          Tablero Kanban
        </h1>

        <div className="kanban-board">
          <KanbanColumn
            title="Pendiente"
            tasksInColumn={groupedTasks[1]}
            statusValue={1}
            IconComponent={AccessTimeOutlinedIcon}
          />
          <KanbanColumn
            title="En Proceso"
            tasksInColumn={groupedTasks[2]}
            statusValue={2}
            IconComponent={LoopOutlinedIcon}
          />
          <KanbanColumn
            title="Completada"
            tasksInColumn={groupedTasks[3]}
            statusValue={3}
            IconComponent={CheckCircleOutlineOutlinedIcon}
          />
          {groupedTasks[0].length > 0 && (
            <KanbanColumn
              title="Otros Estados"
              tasksInColumn={groupedTasks[0]}
              statusValue={0}
              IconComponent={QuestionMarkOutlinedIcon}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
};