import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'src/components/ui/dialog'

type Exercise = {
  name: string
  description: string
  gifUrl: string
}

type ExerciseModalProps = {
  exercise?: Exercise
  onClose: () => void
}

const ExerciseModal = (props: ExerciseModalProps) => {
  const { exercise, onClose } = props

  return exercise ? (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
          <DialogDescription>{exercise.description}</DialogDescription>
        </DialogHeader>

        <img src={exercise.gifUrl} alt={`${exercise.name} demonstration`} />
      </DialogContent>
    </Dialog>
  ) : null
}

export default ExerciseModal
