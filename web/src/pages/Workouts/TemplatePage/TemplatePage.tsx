import WorkoutTemplateCell from './WorkoutTemplateCell'

type TemplatePageProps = {
  id: number
}

const TemplatePage = ({ id }: TemplatePageProps) => {
  return <WorkoutTemplateCell id={id} />
}

export default TemplatePage
