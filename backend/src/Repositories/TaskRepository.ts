import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma } from '@prisma/client';

@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>
      | Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>,
  ) {
    if (!('id' in data)) {
      // Assurer que l'objet `data` correspond à un type de création (prisma.task.create)
      return this.prisma.task.create({
        data: data as Prisma.TaskCreateInput, // Forcer le type vers TaskCreateInput
      });
    }

    return this.prisma.task.update({
      where: {
        id: data.id as number,
      },
      data: {
        ...data,
        updatedAt: new Date(), // Mise à jour de la date `updatedAt`
      },
    });
  }
}
