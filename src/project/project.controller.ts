import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from '~/project/dto/project.dto';
import { PageOptionsDto } from '~/common/dtos/page/page-options.dto';
import { ProjectWithImages } from '~/project/types/project.types';
import { PageDto } from '~/common/dtos';
import { Project } from '@prisma/client';
import { AtGuard } from '~/common/guards';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
  }

  @UseGuards(AtGuard)
  @Post()
  async create(@Body() dto: CreateProjectDto): Promise<ProjectWithImages | null> {
    return this.projectService.create(dto);
  }

  @Get()
  async getProjects(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<ProjectWithImages>> {
    return this.projectService.findPaginated(pageOptionsDto);
  }

  @Get('all')
  async getAllProjects() {
    return this.projectService.findAll();
  }

  @Get(':id/related')
  async getRelatedProjects(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProjectWithImages>> {
    return this.projectService.getRelatedProjects(id, pageOptionsDto);
  }

  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectWithImages> {
    return this.projectService.findOne(id);
  }

  @UseGuards(AtGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectWithImages | null> {
    return this.projectService.update(id, dto);
  }

  @UseGuards(AtGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
    return this.projectService.remove(id);
  }
}
