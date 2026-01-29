import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from '~/project/dto/project.dto';
import { PageOptionsDto } from '~/common/dtos/page/page-options.dto';
import { Prisma, Project } from '@prisma/client';
import { isProjectOrderField } from './utils/project.utils';
import { PageDto, PageMetaDto } from '~/common/dtos';
import { ProjectWithImages } from '~/project/types/project.types';
import slugify from 'slugify';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(dto: CreateProjectDto): Promise<ProjectWithImages | null> {
    const { images, coverIndex, date, ...projectData } = dto;

    if (coverIndex >= images.length) throw new BadRequestException('coverIndex out of range');

    return this.prisma.$transaction(async (tx) => {
      const baseSlug = slugify(dto.title, { lower: true, strict: true });
      const project = await tx.project.create({
        data: {
          ...projectData,
          slug: baseSlug,
          date: new Date(date),
          images: {
            create: images.map((img, index) => ({
              imageUrl: img.url,
              alt: img.alt,
              isCover: index === coverIndex,
            })),
          },
        },
      });

      const finalSlug = `${baseSlug}-${project.numericId}`;
      return tx.project.update({
        where: { id: project.id },
        data: { slug: finalSlug },
        include: { images: true },
      });
    });
  }

  async findPaginated(pageOptionsDto: PageOptionsDto): Promise<PageDto<ProjectWithImages>> {
    const { take, skip, orderBy, order } = pageOptionsDto;

    const orderByClause: Prisma.ProjectOrderByWithRelationInput = isProjectOrderField(orderBy)
      ? { [orderBy]: order }
      : { createdAt: order };

    const [data, itemsCount] = await Promise.all([
      this.prisma.project.findMany({
        include: {
          images: { orderBy: { createdAt: 'asc' } },
        },
        skip,
        take,
        orderBy: orderByClause,
      }),
      this.prisma.project.count(),
    ]);

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemsCount });
    return new PageDto(data, pageMetaDto);
  }

  async findAll() {
    return this.prisma.project.findMany({
      select: {
        slug: true,
        id: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string): Promise<ProjectWithImages> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    return project;
  }

  async getRelatedProjects(currentProjectId: string, pageOptionsDto: PageOptionsDto) {
    const { take = 5, skip } = pageOptionsDto;
    const project = await this.prisma.project.findUnique({
      where: { id: currentProjectId },
      select: { technologies: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    let related = await this.prisma.project.findMany({
      where: {
        id: { not: currentProjectId },
        technologies: { hasSome: project.technologies },
      },
      include: { images: true },
      take,
      skip,
    });

    const foundCount = related.length;
    if (foundCount < take) {
      const remaining = take - foundCount;
      const additional = await this.prisma.project.findMany({
        where: {
          id: { not: currentProjectId },
          NOT: { id: { in: related.map(p => p.id) } },
        },
        include: { images: true },
        take: remaining,
      });

      related = [...related, ...additional];
    }

    const itemsCount = await this.prisma.project.count({
      where: { id: { not: currentProjectId } },
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemsCount });
    return new PageDto(related, pageMetaDto);
  }

  async remove(id: string): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectWithImages | null> {
    const { images, coverIndex, ...projectData } = dto;

    return this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: projectData,
      });

      if (images) {
        const finalCoverIndex = coverIndex ?? 0;

        if (finalCoverIndex >= images.length) throw new BadRequestException('coverIndex out of range');

        await tx.projectImage.deleteMany({
          where: { projectId: id },
        });

        await tx.projectImage.createMany({
          data: images.map((img, index) => ({
            projectId: id,
            imageUrl: img.url,
            alt: img.alt,
            isCover: index === finalCoverIndex,
          })),
        });
      } else if (coverIndex !== undefined) {
        const currentImages = await tx.projectImage.findMany({
          where: { projectId: id },
        });

        if (coverIndex >= currentImages.length) throw new BadRequestException('coverIndex out of range');

        await tx.projectImage.updateMany({
          where: { projectId: id },
          data: { isCover: false },
        });

        await tx.projectImage.update({
          where: { id: currentImages[coverIndex].id },
          data: { isCover: true },
        });
      }

      return tx.project.findUnique({
        where: { id },
        include: { images: true },
      });
    });
  }
}
