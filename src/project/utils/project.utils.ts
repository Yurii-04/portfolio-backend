const projectOrderFields = [
  'createdAt',
  'updatedAt',
  'title',
] as const;

type ProjectOrderField = typeof projectOrderFields[number];

export const isProjectOrderField = (
  field: string | undefined,
): field is ProjectOrderField => {
  return !!field && projectOrderFields.includes(field as ProjectOrderField);
};
