import { WorkoutTemplatesQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { QUERY } from 'src/pages/Workouts/TemplatesPage/WorkoutTemplatesCell'

type TemplateSelectorModalProps = {
  onClose: () => void
}

const TemplateSelectorModal = (props: TemplateSelectorModalProps) => {
  const { onClose } = props

  const { data, loading } = useQuery<WorkoutTemplatesQuery>(QUERY)

  const workoutTemplates = loading ? [] : data.workoutTemplates

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Workout From Existing Template</DialogTitle>
        </DialogHeader>

        <ul className="divide-y divide-white">
          {workoutTemplates.map((template) => (
            <li key={template.id} className="flex items-center justify-between gap-6 py-4">
              <p className="text-sm font-medium">{template.name}</p>

              <Button asChild variant="outline">
                <Link to={routes.newWorkout({ copy: template.id })}>Select Template</Link>
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default TemplateSelectorModal
