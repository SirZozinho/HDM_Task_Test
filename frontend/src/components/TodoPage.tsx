import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [editedTasks, setEditedTasks] = useState<Record<number, string>>({});

  // Récupère toutes les tâches
  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  // Supprime une tâche avec son id
  const handleDelete = async (id: number) => {
    await api.delete('/tasks/' + id);
    handleFetchTasks();
  };

  // Sauvegarder une tâche
  const handleSave = async (task: Task) => {
    const updatedName = editedTasks[task.id];

    // On ne fait l'update que si le nom a changé et est valide (non null, non vide)
    if (updatedName && updatedName !== task.name) {
      await api.patch(`/tasks`, { id: task.id, name: updatedName });
      handleFetchTasks(); // Rafraîchir la liste après modification
      console.log('Changement sauvegardé avec succès:', updatedName);
    }
  };

  // Modification du texte de la tâche
  const handleChange = (id: number, newValue: string) => {
    setEditedTasks((prev) => ({ ...prev, [id]: newValue }));
    console.log('Changement changé avec succès');
  };

  // Ajouter une nouvelle tâche
  const handleAddTask = async () => {
    const newTask = { id: null, name: '' }; // Crée une tâche vide pour l'instant
    try {
      const createdTask = await api.post('/tasks', newTask);
      console.log('Tâche ajoutée avec succès:', createdTask);
      handleFetchTasks(); // Rafraîchit la liste des tâches après création
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error); // Gestion d'erreur
    }
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField
                size="small"
                value={editedTasks[task.id] !== undefined ? editedTasks[task.id] : task.name} // Affiche le texte modifié ou le texte de la tâche si non modifié
                fullWidth
                sx={{ maxWidth: 350 }}
                onChange={(e) => handleChange(task.id, e.target.value)} // Suivi des modifications
                placeholder={task.name === '' ? 'Nouvelle tâche' : ''} // Si la tâche est vide, affiche le placeholder
              />


              <Box>
                <IconButton
                  color="success"
                  disabled={!editedTasks[task.id] || editedTasks[task.id] === task.name} // Désactive le bouton si le texte n'est pas changé
                  onClick={() => handleSave(task)} // Sauvegarde seulement si le nom a changé
                >
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="h6" textAlign="center" mt={2}>
            Aucune tâche trouvée.
          </Typography>
        )}

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={handleAddTask}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
