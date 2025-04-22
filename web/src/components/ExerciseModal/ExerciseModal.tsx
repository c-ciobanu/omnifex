import { ExercisesQuery } from 'types/graphql'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'src/components/ui/dialog'

type ExerciseModalProps = {
  exercise?: ExercisesQuery['exercises'][number]
  onClose: () => void
}

const ExerciseModal = (props: ExerciseModalProps) => {
  const { exercise, onClose } = props

  return exercise ? (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center">
          <img src={exercise.gifUrl} alt={`${exercise.name} demonstration`} className="rounded-lg" />
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Instructions:</h4>
          <ol className="list-inside list-decimal space-y-2 text-sm">
            {exercise.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  ) : null
}

export default ExerciseModal
