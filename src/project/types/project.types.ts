import { Project, ProjectImage } from '@prisma/client';

export interface ProjectWithImages extends Project {
  images: ProjectImage[];
}