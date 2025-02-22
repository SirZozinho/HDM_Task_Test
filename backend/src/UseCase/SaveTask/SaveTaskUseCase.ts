import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';

import { PrismaService } from '../../PrismaService';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor(private readonly prismaService: PrismaService) {}

  async handle(dto: SaveTaskDto) {
    if (dto.id) {
      // Si l'ID est présent, on met à jour la tâche
      return this.prismaService.task.update({
        where: { id: dto.id }, // On utilise l'ID pour retrouver la tâche à mettre à jour
        data: {
          name: dto.name,
        },
      });
    } else {
      // Si l'ID est absent ou null, on crée une nouvelle tâche
      return this.prismaService.task.create({
        data: {
          name: dto.name,
        },
      });
    }
  }

  async create(dto: SaveTaskDto) {
    try {
      const task = await this.prismaService.task.create({
        data: {
          name: dto.name,
        },
      });

      return task;
    } catch (error) {
      throw new BadRequestException('An error occurred while creating the task.', error.message);
    }
  }

  // Méthode de mise à jour
  async update(id: number, dto: SaveTaskDto) {
    try {
      // Vérifier si la tâche existe
      const existingTask = await this.prismaService.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        throw new BadRequestException('Task not found');
      }

      // Mise à jour de la tâche avec l'ID
      const task = await this.prismaService.task.update({
        where: { id },
        data: {
          name: dto.name,
        },
      });

      return task;
    } catch (error) {
      throw new BadRequestException('An error occurred while updating the task.', error.message);
    }
  }
}

