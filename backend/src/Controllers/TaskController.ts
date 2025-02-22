import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import DeleteTask from '../UseCase/DeleteTask/DeleteTask';
import GetAllTasksUseCase from '../UseCase/GetAllTasks/GetAllTasksUseCase';
import SaveTaskDto from '../UseCase/SaveTask/SaveTaskDto';
import UseCaseFactory from '../UseCase/UseCaseFactory';

import SaveTaskUseCase from '../UseCase/SaveTask/SaveTaskUseCase';

@Controller()
export default class TaskController {
  constructor(private readonly useCaseFactory: UseCaseFactory) {}

  @Get('/tasks')
  async getAll() {
    return (await this.useCaseFactory.create(GetAllTasksUseCase)).handle();
  }

  @Post('/tasks')
  async create(@Body() dto: SaveTaskDto) {
    const saveTaskUseCase = await this.useCaseFactory.create(SaveTaskUseCase);
    return saveTaskUseCase.handle(dto); // Passe le dto pour créer la tâche
  }

  @Patch('/tasks')
  async update(@Body() dto: SaveTaskDto) {
    const saveTaskUseCase = await this.useCaseFactory.create(SaveTaskUseCase);

    // Vérifier si l'ID est présent dans le DTO
    if (dto.id) {
      // Mise à jour de la tâche existante
      return saveTaskUseCase.update(dto.id, dto);
    } else {
      // Création d'une nouvelle tâche
      return saveTaskUseCase.create(dto);
    }
  }



  @Delete('/tasks/:id')
  async delete(@Param('id') id: string) {
    return (await this.useCaseFactory.create(DeleteTask)).handle(Number(id));
  }
}
